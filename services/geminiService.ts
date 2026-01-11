
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage, DailyQuote, MoodEntry } from "../types";

const SYSTEM_INSTRUCTION = `
You are "Manas Buddy," a warm, empathetic, and supportive AI companion for a mental health awareness app called Manas.
Your goal is to provide supportive listening, helpful information about mental health, and suggest healthy coping mechanisms.
You are NOT a doctor or a licensed therapist. If a user expresses severe distress or thoughts of self-harm, gently and firmly provide resources for emergency hotlines and professional help.
Keep your responses concise, comforting, and conversational.
`;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGeminiChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    contents.push({
      role: 'user',
      parts: [{ text: newMessage }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "I'm here for you. Could you tell me more?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, I've encountered a small technical glitch. I'm still here to listen.";
  }
};

export const getDailyQuote = async (): Promise<DailyQuote> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a short, powerful, and calming inspirational quote for a mental health app. Focus on themes of peace, resilience, or mindfulness. Include the author's name.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            author: { type: Type.STRING }
          },
          required: ["text", "author"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      text: data.text || "Peace is a journey of a thousand miles and it must be taken one step at a time.",
      author: data.author || "Ancient Wisdom",
      date: new Date().toDateString()
    };
  } catch (error) {
    console.error("Quote Fetch Error:", error);
    return {
      text: "Nature does not hurry, yet everything is accomplished.",
      author: "Lao Tzu",
      date: new Date().toDateString()
    };
  }
};

export const generateInsights = async (entries: MoodEntry[]): Promise<string> => {
  if (entries.length === 0) return "Start logging your mood to receive personalized AI insights.";
  
  try {
    const historyText = entries.slice(-5).map(e => 
      `Date: ${new Date(e.timestamp).toLocaleDateString()}, Mood: ${e.mood}, Stress: ${e.stressLevel}/5, Note: ${e.note}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on my recent mood logs, give me a short, 2-sentence empathetic insight and one small actionable tip for my mental well-being. Keep it friendly and supportive.\n\nLogs:\n${historyText}`,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || "You're doing a great job checking in with yourself. Keep it up!";
  } catch (error) {
    return "Reflecting on your journey is a powerful step. You're making progress!";
  }
};
