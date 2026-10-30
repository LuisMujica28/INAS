/**
 * Vercel Serverless Function — POST /api/chat
 * Asistente Virtual del Instituto Nueva América de Suba (INAS)
 * Soporta DeepSeek (DEEPSEEK_API_KEY) y Google Gemini (GEMINI_API_KEY).
 * Optimizado para respuestas humanas, naturales, breves y sin caracteres raros o asteriscos.
 */

import { GoogleGenAI } from '@google/genai';

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';
const GEMINI_MODEL = 'gemini-3.7-flash';

const SYSTEM_INSTRUCTION = `
Eres Américo, el asistente virtual y recepcionista oficial del Instituto Nueva América de Suba (INAS).
Tu misión es atender a familias, acudientes y estudiantes con calidez, cercanía, amabilidad y brevedad, como si fueras una persona real respondiendo por WhatsApp.

REGLAS DE ORO OBLIGATORIAS:
1. EXTREMADAMENTE CORTO Y CONVERSACIONAL: Máximo 2 a 3 oraciones por respuesta (menos de 60 palabras). Ve directo al grano con tono amable.
2. NUNCA ENTREGUES LISTAS LARGAS DE REQUISITOS: Si el usuario pregunta de forma general por requisitos o admisiones, dale una respuesta corta y cálida con los 3 documentos más básicos:
   "Para estudiantes nuevos pedimos documentos básicos: documento de identidad, certificado médico de la EPS y notas del colegio anterior. ¿Para qué grado buscas cupo o es estudiante nuevo o antiguo? Cuéntame y te oriento paso a paso. 😊"
   NUNCA transcribas listas completas ni manuales de una sola vez. Haz preguntas amables para mantener un diálogo interactivo.
3. CERO ASTERISCOS: ESTÁ TERMINANTEMENTE PROHIBIDO usar asteriscos (** ni *). Escribe texto plano, natural y limpio.
4. CERO ARTÍCULOS O LEYES: NUNCA menciones "Art. 31", "Art. 32", "Manual de Convivencia", "parágrafos" ni jerga legal.
5. SIN VALORES MONETARIOS: El colegio cuenta con subsidio institucional directo de más del 50%. No menciones cifras en pesos; invita con agrado a escribir a WhatsApp (305 430-1113) o a Secretaría para la liquidación exacta de su grado.

DATOS CLAVE DEL COLEGIO:
- Ubicación: Calle 136 # 95B - 85, Barrio Villa Elisa, Suba.
- Horario de atención: Lunes a viernes de 6:00 a.m. a 2:30 p.m. continua.
- WhatsApp: 305 430-1113 | PBX: 601 768-9104.
- Niveles: Preescolar (Jardín y Transición), Primaria y Bachillerato en Jornada Única.
- Calidad: 317 puntos promedio Saber 11°.
`.trim();

function cleanReply(text) {
    if (!text || typeof text !== 'string') return '';
    return text
        .replace(/^\s*#+\s*/gm, '')              // Quitar encabezados markdown
        .replace(/\*\*/g, '')                    // Quitar dobles asteriscos
        .replace(/\*/g, '')                      // Quitar asteriscos simples
        .replace(/_{2,}/g, '')                   // Quitar guiones bajos de formato
        .replace(/`{1,3}[^`]*`{1,3}/g, '')       // Quitar bloques de código
        .replace(/^[ \t]*[-•]\s*/gm, '• ')       // Normalizar viñetas al inicio de línea
        .replace(/([^\n])\s+[-•]\s+/g, '$1\n• ') // Separar viñetas inline con salto de línea
        .replace(/\n{3,}/g, '\n\n')              // Máximo dos saltos de línea
        .trim();
}

function sanitizeHistory(rawHistory) {
    if (!Array.isArray(rawHistory)) return [];
    return rawHistory
        .slice(-10)
        .filter(
            (turn) =>
                turn &&
                (turn.role === 'user' || turn.role === 'assistant') &&
                typeof turn.content === 'string' &&
                turn.content.trim().length > 0
        )
        .map((turn) => ({
            role: turn.role,
            content: turn.content.trim().slice(0, 1500)
        }));
}

async function callDeepSeek(apiKey, message, history) {
    const response = await fetch(DEEPSEEK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: DEEPSEEK_MODEL,
            messages: [
                { role: 'system', content: SYSTEM_INSTRUCTION },
                ...history,
                { role: 'user', content: message }
            ],
            temperature: 0.3,
            max_tokens: 160,
            stream: false
        })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data?.error?.message || `DeepSeek HTTP ${response.status}`);
    }

    const rawReply = data?.choices?.[0]?.message?.content?.trim() || '';
    return {
        reply: cleanReply(rawReply),
        interactionId: null
    };
}

async function callGemini(apiKey, message, previousInteractionId) {
    const ai = new GoogleGenAI({ apiKey });
    const requestParams = {
        model: GEMINI_MODEL,
        input: message,
        system_instruction: SYSTEM_INSTRUCTION
    };

    if (previousInteractionId) {
        requestParams.previous_interaction_id = previousInteractionId;
    }

    const interaction = await ai.interactions.create(requestParams);
    return {
        reply: cleanReply(interaction.output_text || ''),
        interactionId: interaction.id || null
    };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!deepseekKey && !geminiKey) {
        return res.status(503).json({
            error: 'Falta configurar DEEPSEEK_API_KEY (o GEMINI_API_KEY) en las variables de entorno de Vercel.'
        });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const message = typeof body.message === 'string' ? body.message.trim() : '';

        if (!message) {
            return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
        }

        if (message.length > 1500) {
            return res.status(400).json({ error: 'El mensaje supera la longitud máxima permitida (1500 caracteres).' });
        }

        let result;
        if (deepseekKey) {
            const history = sanitizeHistory(body.history);
            result = await callDeepSeek(deepseekKey, message, history);
        } else {
            const previousInteractionId =
                typeof body.previousInteractionId === 'string' && body.previousInteractionId.trim()
                    ? body.previousInteractionId.trim()
                    : undefined;
            result = await callGemini(geminiKey, message, previousInteractionId);
        }

        return res.status(200).json({
            reply:
                result.reply ||
                '¡Hola! Con gusto te colaboro. Por favor comunícate a nuestra Secretaría Académica al WhatsApp 305 430-1113 para ayudarte de inmediato.',
            interactionId: result.interactionId
        });
    } catch (error) {
        console.error('[api/chat] Error en el proveedor de IA:', error);
        return res.status(500).json({
            error: 'En este momento no pude conectar con el servicio. Puedes escribirnos directo al WhatsApp 305 430-1113.'
        });
    }
}
