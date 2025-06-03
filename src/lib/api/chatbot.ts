import { api } from './api';

export interface ChatMessage {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const chatbotApi = {
  sendMessage: async (message: string) => {
    try {
      const response = await api.post('/api/chatbot/message', { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  },

  getChatHistory: async () => {
    try {
      const response = await api.get('/api/chatbot/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  clearChatHistory: async () => {
    try {
      const response = await api.delete('/api/chatbot/history');
      return response.data;
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }
}; 