import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(express.json({ limit: '1mb' }));

const rootDir = process.cwd();
const envLocalPath = path.join(rootDir, '.env.local');
const envPath = path.join(rootDir, '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. Set it in your environment before starting the server.');
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/chat', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
    }

    const { message, context } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const products = Array.isArray(context?.products) ? context.products : [];
    const cartItems = Array.isArray(context?.cartItems) ? context.cartItems : [];

    // 1. UPDATE THE PROMPT TO DEMAND JSON
    const prompt = [
      'You are a helpful grocery shopping assistant inside a grocery app.',
      'If the user asks for a recipe or meal idea, you can provide a short, simple recipe.',
      'Whenever possible, suggest ingredients from the Products list provided in context.',
      'CRITICAL: If you suggest ingredients, end your message by asking the user: "Shall I add these ingredients to your cart?"',
      'If asked about something completely unrelated to groceries or food, politely decline.',
      `Products: ${products.map(p => `${p.name} (₹${p.price})`).join(', ') || 'None'}`,
      `Cart: ${cartItems.map(i => `${i.name} x${i.qty}`).join(', ') || 'Empty'}`,
      `Delivery date: ${context?.selectedDate || 'N/A'}. Delivery time: ${context?.selectedTime || 'N/A'}.`,
      `User: ${message}`,
      'Answer in under 120 words.',
      'IMPORTANT: You must respond ONLY with a valid JSON object in this exact format:',
      '{',
      '  "reply": "Your conversational response and recipe ideas here",',
      '  "ingredients": ["ingredient1", "ingredient2", "ingredient3"]',
      '}'
    ].join('\n');

    // 2. FORCE JSON OUTPUT IN THE CONFIG
    let result;
    try {
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.4,
          responseMimeType: "application/json"
        }
      });
    } catch (e) {
      console.warn('Primary model failed, falling back to gemini-2.0-flash', e.message);
      const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      result = await fallbackModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.4,
          responseMimeType: "application/json"
        }
      });
    }

    const text = result?.response?.text?.() ?? '';

    // 3. PARSE AND SEND THE JSON
    let structuredData;
    try {
      structuredData = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON from Gemini:', text);
      // Fallback just in case Gemini's formatting fails
      structuredData = { reply: text, ingredients: [] };
    }

    return res.json(structuredData);

  } catch (err) {
    console.error('Chat error:', err);
    const status = err.status || 500;
    return res.status(status).json({ error: 'Chat failed', details: err.message });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 8787;
app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
