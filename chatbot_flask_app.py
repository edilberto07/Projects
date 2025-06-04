import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import DistilBertForSequenceClassification, DistilBertTokenizer # Use DistilBERT classes
import json
import numpy as np
import random # Needed to pick a random response

app = Flask(__name__)
CORS(app)

# Define the path to the local model directory (assuming chatbot_model is at the root)
MODEL_DIR = os.path.join(os.path.dirname(__file__), "chatbot_model")
# Define the path to the intents.json file (now inside chatbot_model)
INTENTS_FILE = os.path.join(MODEL_DIR, "intents.json")

# Load intents data and create tag mappings
intents_data = {}
tag_to_index = {}
index_to_tag = {}
try:
    with open(INTENTS_FILE, "r") as f:
        intents_data = json.load(f)
    tag_to_index = {intent["tag"]: i for i, intent in enumerate(intents_data["intents"])}
    index_to_tag = {i: tag for tag, i in tag_to_index.items()}
    print(f"Intents data loaded successfully from {INTENTS_FILE}")
except FileNotFoundError:
    print(f"Error: Intents file not found at {INTENTS_FILE}")
except Exception as e:
    print(f"Error loading intents data: {str(e)}")

# Load the trained intent classification model and tokenizer
tokenizer = None
model = None
if intents_data and tag_to_index:
    try:
        num_labels = len(tag_to_index)
        # Load tokenizer from the local directory
        tokenizer = DistilBertTokenizer.from_pretrained(MODEL_DIR)
        print(f"Tokenizer loaded from {MODEL_DIR}")

        # Load the model architecture and then load the state dictionary
        model = DistilBertForSequenceClassification.from_pretrained(
            "distilbert-base-uncased", # Load the base architecture
            num_labels=num_labels
        )

        # Construct the full path to the saved model weights file
        model_weights_path = os.path.join(MODEL_DIR, "chatbot_intent_model.pth")
        if not os.path.exists(model_weights_path):
             print(f"Error: Model weights file not found at {model_weights_path}")
             # Attempt to find the file in the model_path directory if the exact name isn't found
             found_files = [f for f in os.listdir(MODEL_DIR) if f.endswith('.pth')]
             if found_files:
                  model_weights_path = os.path.join(MODEL_DIR, found_files[0])
                  print(f"Using found weights file: {model_weights_path}")
             else:
                  raise FileNotFoundError(f"Model weights file not found in {MODEL_DIR}")

        model.load_state_dict(torch.load(model_weights_path, map_location=torch.device('cpu'))) # Load to CPU as Flask is typically CPU-based
        model.eval() # Set model to evaluation mode
        print("Intent classification model loaded successfully.")

    except Exception as e:
        print(f"Error loading model or tokenizer: {str(e)}")


@app.route('/chat', methods=['POST'])
def chat():
    # Check if model and data are loaded
    if model is None or not intents_data or not index_to_tag or not tokenizer:
        print("Chatbot model, intents data, or tokenizer not loaded.")
        return jsonify({
            "response": "The chatbot service is not fully initialized. Please check server logs.",
            "confidence": 0
        }), 500

    data = request.json
    message = data.get('message', '')

    if not message:
        return jsonify({
            "response": "Please provide a message.",
            "confidence": 0
        }), 400
    
    try:
        # Predict the intent of the user's message
        # Preprocess the input text (similar to the predict_intent method logic)
        encoding = tokenizer(
            message,
            max_length=32, # Use the same max_length as during training
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )

        input_ids = encoding["input_ids"] # No need to move to device for CPU
        attention_mask = encoding["attention_mask"]

        # Make prediction
        with torch.no_grad():
            outputs = model(input_ids, attention_mask=attention_mask)
            logits = outputs.logits
            predicted_class_idx = torch.argmax(logits, dim=1).item()

        # Get the predicted tag
        predicted_intent_tag = index_to_tag.get(predicted_class_idx, "unknown")
        print(f"Predicted intent for '{message}': {predicted_intent_tag}")

        # Get a random response based on the predicted intent tag
        bot_response_text = "I'm not sure how to respond to that."
        for intent in intents_data["intents"]:
            if intent["tag"] == predicted_intent_tag:
                bot_response_text = random.choice(intent["responses"])
                break # Found the intent, no need to continue searching

        # If the predicted tag was 'unknown' or didn't match any intent, use a fallback
        if predicted_intent_tag == "unknown" or bot_response_text == "I'm not sure how to respond to that.":
             # You might want a specific fallback response for unknown intents
             fallback_responses = ["I didn't understand that. Can you please rephrase?", "I'm still learning. Could you ask differently?", "Sorry, I don't have information on that topic."]
             bot_response_text = random.choice(fallback_responses)
             print(f"Using fallback response for intent '{predicted_intent_tag}'.")


        # Construct the response object
        # Note: This Flask app doesn't handle timestamps or sender like the previous FastAPI example
        # You might need to adjust the frontend to expect this simpler response format or add it here.
        return jsonify({
            "response": bot_response_text,
            "confidence": 0.9  # Confidence is just a placeholder here
        })

    except Exception as e:
        print(f"Error processing message: {e}")
        return jsonify({
            "response": "Sorry, I encountered an internal error while processing your message.",
            "confidence": 0
        }), 500


if __name__ == '__main__':
    # Use the PORT environment variable provided by Heroku or default to 5000
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Flask app on port {port}...")
    app.run(host='0.0.0.0', port=port) 