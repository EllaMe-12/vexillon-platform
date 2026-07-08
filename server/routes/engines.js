import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Initialize the Gemini API client using your loaded environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * ── BOT 01: THE EMAIL & DRAFT ASSISTANT ──
 * Endpoint: POST /api/engines/email
 */
router.post('/email', async (req, res) => {
  try {
    const { sender, subject, body } = req.body;

    if (!body) {
      return res.status(400).json({ error: 'Inbound email body content is missing.' });
    }

    const prompt = `
      You are VeXillon Bot 01 (The Email & Draft Assistant). 
      Analyze the following inbound email metadata and body.
      Generate a professional, high-end, context-aware draft reply on behalf of the operator.
      
      Sender: ${sender || 'Unknown'}
      Subject: ${subject || 'No Subject'}
      Body: ${body}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      botIdentifier: 'VE-NODE-SYNC-0',
      draftReply: response.text.trim()
    });

  } catch (error) {
    console.error('[Bot 01 Error]:', error);
    return res.status(500).json({ error: 'Internal pipeline fault processing email draft.' });
  }
});

/**
 * ── BOT 02: THE AUTONOMOUS MEETING REPRESENTATIVE ──
 * Endpoint: POST /api/engines/notes
 */
router.post('/notes', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Meeting transcript or log matrix is missing.' });
    }

    const prompt = `
      You are VeXillon Bot 02 (The Autonomous Meeting Representative).
      Process this raw conference dialogue/transcript transcript. 
      Extract clean executive summaries and explicitly outline action items, tasks, and deadlines.
      
      Transcript: ${text}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      botIdentifier: 'VE-NODE-SYNC-1',
      analysis: response.text.trim()
    });

  } catch (error) {
    console.error('[Bot 02 Error]:', error);
    return res.status(500).json({ error: 'Internal pipeline fault parsing transcript matrix.' });
  }
});

/**
 * ── BOT 03: THE VOICE TASK MULTITASKER ──
 * Endpoint: POST /api/engines/voice
 */
router.post('/voice', async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Voice verbal transcription payload is missing.' });
    }

    const prompt = `
      You are VeXillon Bot 03 (The Voice Task Multitasker).
      Convert this spoken verbal stream into an organized, step-by-step checklist of actionable tasks.
      
      Spoken Audio Input: ${transcript}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      botIdentifier: 'VE-NODE-SYNC-2',
      checklist: response.text.trim()
    });

  } catch (error) {
    console.error('[Bot 03 Error]:', error);
    return res.status(500).json({ error: 'Internal pipeline fault formatting audio task items.' });
  }
});

export default router;