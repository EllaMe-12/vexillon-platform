let geminiClient = null;

async function getGeminiClient() {
  if (geminiClient) return geminiClient;
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const { GoogleGenAI } = await import('@google/genai');
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    return geminiClient;
  } catch (error) {
    console.warn('Gemini SDK unavailable, using fallback content generation.', error.message);
    return null;
  }
}

function normalizeText(input) {
  return String(input || '').trim();
}

function summarizeText(input) {
  const source = normalizeText(input);
  return source.length > 180 ? `${source.slice(0, 180)}…` : source || 'No content supplied.';
}

export function buildEmailFallback(input) {
  const source = normalizeText(input?.body || input?.emailThread || input?.text || '');
  const subject = normalizeText(input?.subject || 'Follow-up');
  const summary = summarizeText(source || subject);
  return {
    kind: 'email',
    ready: true,
    draft: `Hi there,\nThanks for reaching out. I reviewed your request and prepared a concise response based on the context provided.\n\nSubject: ${subject}\nContext summary: ${summary}`,
    summary,
    subject,
  };
}

export function buildMeetingFallback(input) {
  const transcript = normalizeText(input?.transcript || input?.text || '');
  const summary = summarizeText(transcript);
  return {
    kind: 'meeting',
    ready: true,
    summary: `Meeting summary: ${summary}`,
    decisions: ['Confirmed next steps after review.'],
    actionItems: ['Send update', 'Follow up with stakeholders', 'Confirm timeline'],
  };
}

export function buildVoiceFallback(input) {
  const text = normalizeText(input?.text || input?.transcript || input?.voiceNote || '');
  const summary = summarizeText(text);
  const tasks = [
    { title: 'Review request', priority: 'medium', notes: summary },
    { title: 'Confirm priority and timing', priority: 'medium', notes: 'Prepared for follow-up.' },
  ];
  return {
    kind: 'voice',
    ready: true,
    summary: `Voice note summary: ${summary}`,
    tasks,
  };
}

async function generateWithGemini(prompt, fallbackKind, input) {
  const ai = await getGeminiClient();
  if (!ai) {
    if (fallbackKind === 'email') return buildEmailFallback(input);
    if (fallbackKind === 'meeting') return buildMeetingFallback(input);
    return buildVoiceFallback(input);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.2 },
    });

    const text = response.text || response?.output?.text || '';
    if (text) {
      if (fallbackKind === 'email') {
        return { kind: 'email', ready: true, draft: text, summary: summarizeText(text), subject: 'AI generated' };
      }
      if (fallbackKind === 'meeting') {
        return { kind: 'meeting', ready: true, summary: text, decisions: ['Captured via AI'], actionItems: ['Follow up'] };
      }
      return { kind: 'voice', ready: true, summary: text, tasks: [{ title: 'Review request', priority: 'medium', notes: text }] };
    }

    if (fallbackKind === 'email') return buildEmailFallback(input);
    if (fallbackKind === 'meeting') return buildMeetingFallback(input);
    return buildVoiceFallback(input);
  } catch (error) {
    console.error('Gemini generation failed, using fallback.', error.message);
    if (fallbackKind === 'email') return buildEmailFallback(input);
    if (fallbackKind === 'meeting') return buildMeetingFallback(input);
    return buildVoiceFallback(input);
  }
}

export async function draftEmailResponse(emailThread) {
  const prompt = `You are VeXillon's business email engine. Analyze the following thread, infer intent, prioritize urgency, and draft a polished response ready for approval.\n\nThread:\n${emailThread}`;
  return generateWithGemini(prompt, 'email', { body: emailThread });
}

export async function summarizeMeeting(transcriptText) {
  const prompt = `You are VeXillon's meeting intelligence engine. Turn the transcript below into concise, executive-ready notes with summary, decisions, action items, and next steps.\n\nTranscript:\n${transcriptText}`;
  return generateWithGemini(prompt, 'meeting', { transcript: transcriptText });
}

export async function extractTasksFromVoice(transcriptText) {
  const prompt = `You are VeXillon's voice task engine. Extract structured tasks from the note below and return them in a clear, business-friendly format with priority and owner hints.\n\nVoice note:\n${transcriptText}`;
  return generateWithGemini(prompt, 'voice', { text: transcriptText });
}

const { GoogleGenAI } = require('@google/genai');

// Ensure your API token is loaded from your root .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Dispatches a specialized context payload to the Gemini framework
 * to determine the next autonomous action for VeXillon.
 */
exports.processAutonomousAction = async (orderId, targetState) => {
    try {
        const systemInstruction = `
            You are the autonomous execution engine of VeXillon. 
            An event state shift has occurred. Evaluate the situation and provide structured output.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Order ID: ${orderId} has transitioned to terminal state: ${targetState}. Generate provisioning instructions.`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json' // Forces deterministic JSON parsing on output
            }
        });

        // Parse and return the machine-readable response text
        return JSON.parse(response.text);

    } catch (error) {
        console.error('Fatal execution exception in Gemini Service:', error);
        throw new Error('Autonomous engine routing layer failure.');
    }
};