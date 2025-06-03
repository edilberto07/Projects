import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import json
import os
import logging
from typing import List, Dict, Any

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Pydantic models
class ChatMessage(BaseModel):
    content: str
    sender: str
    timestamp: datetime

class MessageRequest(BaseModel):
    message: str

# Initialize the model and tokenizer with memory optimization
MODEL_PATH = "payroll_chatbot_model_small"  # Path to the smaller model

# Load model with memory optimization
def load_model():
    try:
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        
        # Load model with optimizations
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_PATH,
            torch_dtype=torch.float16,  # Use float16 for reduced memory
            low_cpu_mem_usage=True
        )
        
        # Move model to CPU (Heroku doesn't have GPU)
        model = model.to('cpu')
        
        # Set model to evaluation mode
        model.eval()
        
        return model, tokenizer
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

# Initialize model and tokenizer
try:
    model, tokenizer = load_model()
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error initializing model: {str(e)}")
    raise

# Function to generate response with memory optimization
def generate_response(message: str) -> str:
    try:
        with torch.no_grad():  # Disable gradient calculation
            # Encode the input message
            input_ids = tokenizer.encode(
                message + tokenizer.eos_token,
                return_tensors='pt',
                truncation=True,
                max_length=512  # Limit input length
            )
            
            # Generate response with optimized parameters
            output = model.generate(
                input_ids,
                max_length=200,  # Limit output length
                pad_token_id=tokenizer.eos_token_id,
                no_repeat_ngram_size=3,
                do_sample=True,
                top_k=50,  # Reduced from 100
                top_p=0.7,
                temperature=0.8,
                num_return_sequences=1
            )
            
            # Decode and return the response
            response = tokenizer.decode(
                output[:, input_ids.shape[-1]:][0],
                skip_special_tokens=True
            )
            return response
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        return "I apologize, but I'm having trouble processing your request right now."

# Chatbot routes
@app.post("/api/chatbot/message")
async def send_message(message_request: MessageRequest):
    try:
        # Generate response using the ML model
        bot_response = generate_response(message_request.message)
        
        response = {
            "content": bot_response,
            "sender": "bot",
            "timestamp": datetime.utcnow()
        }
        
        return response
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing message")

@app.get("/api/chatbot/history")
async def get_chat_history():
    return messages

@app.delete("/api/chatbot/history")
async def clear_chat_history():
    messages.clear()
    return {"message": "Chat history cleared successfully"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 