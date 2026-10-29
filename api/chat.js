/**
 * Vercel Serverless Function — POST /api/chat
 * Asistente Virtual del Instituto Nueva América de Suba (INAS)
 * Soporta automáticamente DeepSeek (DEEPSEEK_API_KEY) y Google Gemini (GEMINI_API_KEY),
 * manteniendo la clave 100% privada en el servidor de Vercel.
 */

import { GoogleGenAI } from '@google/genai';

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';
const GEMINI_MODEL = 'gemini-3.7-flash';

const SYSTEM_INSTRUCTION = `
Rol: Eres el Asistente Virtual del "Instituto Nueva América de Suba" (INAS).
Tu objetivo es ayudar a padres de familia, acudientes y estudiantes con información precisa sobre el colegio y el proceso de Admisiones y Matrículas 2027.
Responde en español de manera amable, clara, profesional y concisa. Si desconoces un dato específico, invita a comunicarse con Secretaría Académica.

CONTEXTO INSTITUCIONAL OFICIAL:
- Nombre: Instituto Nueva América de Suba (INAS).
- Lema: "Ciencia, Cultura y Vida".
- Licencia de Funcionamiento: Resolución 110042 del 10 de marzo de 2014 · Código DANE: 311001025053 · Registro ICFES: 056127 · NIT: 900.030.860.
- Ubicación (sede única): Calle 136 # 95B - 85, Barrio Villa Elisa - Suba, Bogotá D.C.
- Teléfonos: PBX 601 768-9104 / Celular y WhatsApp oficial: 305 430-1113.
- Correos oficiales: secretaria@inas.edu.co, inamerica91@hotmail.com.
- Horario de atención de Secretaría: Lunes a viernes de 6:00 a.m. a 2:30 p.m. (jornada continua).
- Oferta educativa: Preescolar (Jardín y Transición), Básica Primaria (1° a 5°), Básica Secundaria (6° a 9°) y Media Académica (10° y 11°) en Jornada Única.
- Desempeño Saber 11° (ICFES): Promedio institucional destacado de 317 puntos (entre los mejores de Bogotá).

ADMISIONES Y COSTOS DE REFERENCIA (SUBSIDIO INSTITUCIONAL >50%):
- La institución otorga directamente un subsidio superior al 50% sobre el costo real anual del servicio educativo privado.
- Matrícula anual (Jardín a Grado 11°): $470.000 (valor neto asumido por la familia).
- Pensión mensual (Jardín a Grado 11°): $450.000.
- Otros conceptos (Art. 33 Manual de Convivencia): Carné estudiantil ($13.266), Agenda y Manual de Convivencia ($22.552), Constancias/certificados ($11.408), Derechos de grado exclusivo Grado 11° ($245.411), seguro estudiantil, sistematización, periódico escolar y módulos Martes de Prueba.
- Las familias pueden iniciar su solicitud de cupo 2027 desde la portada o en la sección Admisiones (admisiones.html).

REQUISITOS DE MATRÍCULA (MANUAL DE CONVIVENCIA):
- Estudiantes nuevos (Art. 31): Registro civil legible, fotocopia tarjeta de identidad (desde 7 años), certificado médico reciente EPS, afiliación vigente EPS/ARS, carné de vacunación al día (Preescolar), certificados originales de notas de grados anteriores, paz y salvo original del colegio anterior, copia del observador, constancia de comportamiento y 1 foto tamaño documento.
- Estudiantes antiguos (Art. 32): Fotocopia actualizada del documento de identidad, certificado médico reciente, último boletín de calificaciones y paz y salvo institucional del año anterior.
- Firma de matrícula (Art. 33 Par. 1): Debe asistir el estudiante con uniforme institucional acompañado de su padre, madre o acudiente autorizado.

PAGOS Y CUENTAS BANCARIAS OFICIALES:
1. Davivienda: Cuenta de Ahorros No. 1089 0060 1783 a nombre del Instituto Nueva América de Suba (Convenio NIT 900.030.860 · Llave Bre-B @DAVIINSTAMERSUBA).
2. Banco Caja Social: Cuenta Corriente No. 2403 0000 0015 a nombre del Instituto Nueva América.
- Reportar soportes de pago a secretaria@inas.edu.co indicando nombre completo del estudiante, grado y concepto.

UNIFORMES:
- Diario masculino: Pantalón gris, saco azul oscuro cuello V, camisa blanca, corbata azul, zapatos negros.
- Diario femenino: Jardinera a cuadros azul/gris, saco azul oscuro, camisa blanca, medias blancas, zapatos negros.
- Educación física (unisex): Sudadera azul oscura institucional, camiseta blanca con escudo, tenis totalmente blancos.
`.trim();

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
            temperature: 0.4,
            max_tokens: 600,
            stream: false
        })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data?.error?.message || `DeepSeek HTTP ${response.status}`);
    }

    return {
        reply: data?.choices?.[0]?.message?.content?.trim() || '',
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
        reply: interaction.output_text || '',
        interactionId: interaction.id || null
    };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

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
                'En este momento no pude generar una respuesta. Por favor comunícate al WhatsApp 305 430-1113.',
            interactionId: result.interactionId
        });
    } catch (error) {
        console.error('[api/chat] Error en el proveedor de IA:', error);
        return res.status(500).json({
            error: 'No fue posible procesar tu consulta en este momento. Puedes escribirnos al WhatsApp 305 430-1113.'
        });
    }
}
