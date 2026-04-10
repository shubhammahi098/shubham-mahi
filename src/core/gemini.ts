import { GoogleGenAI, Type } from "@google/genai";
import { Verdict } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeNews(text: string, language: string = 'English') {
  const model = "gemini-3-flash-preview";
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const response = await ai.models.generateContent({
    model,
    contents: `The current date is ${currentDate}. Analyze the following news text or URL for authenticity. 
    If it's a URL, analyze the content of that page.
    Provide the analysis in ${language}.
    
    Provide:
    1. A confidence score (0-100).
    2. A verdict (TRUE, FALSE, MISLEADING, or UNVERIFIED).
    3. A detailed explanation.
    4. A list of pros (supporting evidence) and cons (debunking evidence).
    5. A source reliability assessment (score 0-100, rating, and description).
    
    News/URL: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          confidenceScore: { type: Type.NUMBER },
          verdict: { type: Type.STRING, enum: ["TRUE", "FALSE", "MISLEADING", "UNVERIFIED"] },
          explanation: { type: Type.STRING },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          sourceReliability: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              rating: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["score", "rating", "description"]
          }
        },
        required: ["confidenceScore", "verdict", "explanation", "pros", "cons", "sourceReliability"]
      },
      tools: [{ googleSearch: {} }]
    }
  });

  return JSON.parse(response.text);
}

export async function getTrendingNews() {
  const model = "gemini-3-flash-preview";
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const response = await ai.models.generateContent({
    model,
    contents: `The current date is ${currentDate}. Find 4-5 currently trending news topics or viral claims that people are discussing today. Provide them in a structured JSON format with title, a brief description, and a source URL if possible.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            url: { type: Type.STRING }
          },
          required: ["title", "description"]
        }
      },
      tools: [{ googleSearch: {} }]
    }
  });

  return JSON.parse(response.text);
}

export async function getChatResponse(history: { role: 'user' | 'model', text: string }[], message: string) {
  const model = "gemini-3-flash-preview";
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `You are Fake News Detector AI, a helpful assistant specializing in news verification and fact-checking. The current date is ${currentDate}. Provide crisp, short, and direct answers that are very easy to understand. Avoid long paragraphs; use bullet points for clarity. Keep your tone professional yet highly accessible for a college student.`
    },
    history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
  });

  const result = await chat.sendMessage({ message });
  return result.text;
}
