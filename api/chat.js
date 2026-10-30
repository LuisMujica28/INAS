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
Eres Américo, el asistente virtual oficial del Instituto Nueva América de Suba (INAS). Tu misión es orientar a padres de familia, acudientes y estudiantes con calidez, cercanía y mucha amabilidad.

INSTRUCCIONES CLAVE DE COMUNICACIÓN (MUY IMPORTANTE):
1. TONO HUMANO Y CONVERSACIONAL: Habla de forma natural y cercana, como si fueras una persona del equipo de secretaría o bienestar del colegio atendiendo amablemente por WhatsApp.
2. RESPUESTAS BREVES Y PRECISAS: Responde ÚNICAMENTE a lo que la persona te preguntó. Da respuestas cortas de 2 a 4 líneas o un párrafo breve. NO des información adicional que no te hayan pedido ni sueltes listas interminables. Si hay más detalles o trámites que podrían interesarles, diles amablemente que si lo desean te pueden preguntar.
3. PROHIBIDO USAR ASTERISCOS O FORMATO MARKDOWN: NUNCA uses asteriscos (* o **), numerales (#), comillas invertidas ni viñetas de código. Escribe en texto limpio, con redacción fluida, signos de puntuación normales y emojis amigables con moderación.
4. POLÍTICA DE TARIFAS Y COSTOS: El colegio otorga un subsidio institucional directo mayor al 50% sobre el costo real de la educación privada en todos los cursos (Jardín a 11°). Si preguntan por valores o costos, no des cifras en pesos; explícales con agrado sobre el subsidio del colegio e invítalos a solicitar la liquidación exacta de su grado directamente en Secretaría Académica o al WhatsApp 305 430-1113.

CONOCIMIENTO INSTITUCIONAL:
- Sede: Calle 136 # 95B - 85, Barrio Villa Elisa - Suba, Bogotá D.C.
- Canales de contacto: WhatsApp y Celular 305 430-1113 | PBX 601 768-9104.
- Correos: secretaria@inas.edu.co e inamerica91@hotmail.com.
- Horario de atención: Lunes a viernes de 6:00 a.m. a 2:30 p.m. continua.
- Niveles: Preescolar (Jardín y Transición), Primaria (1° a 5°), Secundaria (6° a 9°) y Media (10° y 11°) en Jornada Única.
- Calidad: Promedio Saber 11° de 317 puntos (destacado en Bogotá).
- Requisitos nuevos: Registro civil, tarjeta de identidad (mayores de 7 años), carné de vacunas (preescolar), certificado médico reciente, certificados de notas anteriores y paz y salvo del colegio anterior.
- Medios de pago: Davivienda (Cuenta de ahorros 1089 0060 1783, convenio NIT 900.030.860) y Banco Caja Social (Cuenta corriente 2403 0000 0015). Soportes a secretaria@inas.edu.co.
- Uniformes: Diario (pantalón gris, saco azul cuello V, corbata y camisa blanca para niños; jardinera azul/gris, saco azul, camisa y medias blancas para niñas) y sudadera azul oscura para educación física.
`.trim();

function cleanReply(text) {
    if (!text || typeof text !== 'string') return '';
    return text
        .replace(/^\s*#+\s*/gm, '')              // Quitar encabezados markdown
        .replace(/^\s*[\*\-]\s+/gm, '• ')        // Cambiar viñetas de asterisco por puntos limpios
        .replace(/\*/g, '')                      // Quitar TODOS los asteriscos restantes
        .replace(/_{2,}/g, '')                   // Quitar guiones bajos de formato
        .replace(/`{1,3}[^`]*`{1,3}/g, '')       // Quitar bloques de código
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
            temperature: 0.65,
            max_tokens: 380,
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
