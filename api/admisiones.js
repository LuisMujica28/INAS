/**
 * Vercel Serverless Function — POST /api/admisiones
 * Guarda cada solicitud de Matrículas 2027 en Firebase Firestore (colección `preinscripciones_2027`)
 * usando Firebase Admin SDK en el servidor (cero credenciales ni permisos de escritura expuestos al público).
 */

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

function getFirebaseCredentials() {
    // Opción A (recomendada): pegar el JSON completo de la cuenta de servicio en FIREBASE_SERVICE_ACCOUNT
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        if (parsed.private_key) {
            parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
        }
        return {
            projectId: parsed.project_id,
            clientEmail: parsed.client_email,
            privateKey: parsed.private_key
        };
    }

    // Opción B: 3 variables de entorno individuales en Vercel
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

    if (projectId && clientEmail && privateKey) {
        return { projectId, clientEmail, privateKey };
    }

    return null;
}

function getDb() {
    const creds = getFirebaseCredentials();
    if (!creds) return null;

    if (getApps().length === 0) {
        initializeApp({
            credential: cert(creds)
        });
    }

    return getFirestore();
}

function cleanText(val, maxLen = 140) {
    if (typeof val !== 'string') return '';
    return val.trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

        const grado = cleanText(body.grado, 80);
        const acudiente = cleanText(body.acudiente, 120);
        const telefono = cleanText(body.telefono, 40);
        const estudiante = cleanText(body.estudiante, 120);
        const tipo = cleanText(body.tipo, 80) || 'Estudiante Nuevo';
        const modalidad = cleanText(body.modalidad, 120) || 'Orientación por WhatsApp';
        const canal = cleanText(body.canal, 30) || 'whatsapp';
        const origen = cleanText(body.origen, 40) || 'web';

        if (!grado || !acudiente || !telefono) {
            return res.status(400).json({
                saved: false,
                error: 'Los campos grado, acudiente y teléfono son obligatorios.'
            });
        }

        const db = getDb();
        if (!db) {
            return res.status(200).json({
                saved: false,
                reason: 'firebase_unconfigured',
                message: 'Configura FIREBASE_SERVICE_ACCOUNT en Vercel para activar el guardado en Firestore.'
            });
        }

        const docRef = await db.collection('preinscripciones_2027').add({
            anioLectivo: 2027,
            tipo,
            grado,
            acudiente,
            telefono,
            estudiante: estudiante || null,
            modalidad,
            canal,
            origen,
            estado: 'pendiente',
            createdAt: FieldValue.serverTimestamp(),
            createdAtIso: new Date().toISOString()
        });

        return res.status(201).json({
            saved: true,
            id: docRef.id
        });
    } catch (error) {
        console.error('[api/admisiones] Error guardando en Firestore:', error);
        return res.status(500).json({
            saved: false,
            error: 'No se pudo registrar en Firestore en este momento.'
        });
    }
}

