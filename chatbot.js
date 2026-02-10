// chatbot.js

// Configuration
// IMPORTANT: Replace this with your Google AI Studio API Key
// You can restrict this key to your domain in Google Cloud Console for security.
const API_KEY = "AIzaSyCWNvY4n-1OyyFi3KpuVsIKBZSvw1i5TmM";

const SYSTEM_INSTRUCTION = `
Rol: Eres el Asistente Virtual del "Instituto Nueva América de Suba" (INAS).
Tu objetivo es ayudar a padres y estudiantes con información precisa sobre el colegio.
Responde de manera amable, profesional y concisa. Si no sabes algo, sugiere contactar a secretaría.

CONTEXTO INSTITUCIONAL:
Nombre: Instituto Nueva América de Suba (INAS).
Lema: "Ciencia, Cultura y Vida".
Ubicación: Calle 136 # 95 B - 85, Villa Elisa - Suba, Bogotá D.C.
Teléfonos: TEL: 601 768-9104 / CEL: 305 430-1113.
Correos: secretaria@inas.edu.co, inamerica91@hotmail.com.
Horario de Atención: Lunes a viernes de 6:00 a.m. a 3:00 p.m.

PAGOS Y CUENTAS BANCARIAS:
1. Banco Caja Social: Cuenta Corriente No. 2403 0000 0015. Titular: Instituto Nueva América.
2. Davivienda: Cuenta de Ahorros No. 1089 0060 1783. Titular: Instituto Nueva América de Suba.
Importante: Para pagos en Davivienda (Convenio) se usa el NIT 900.030.860 y Llave @DAVIINSTAMERSUBA.
Reportar pagos a: secretaria@inas.edu.co con Nombre del estudiante, curso y motivo.

COSTOS EDUCATIVOS 2026:
- Matrícula (Jardín a Grado 11): $470.000 (Valor asumido por el padre de familia).
- Pensión Mensual (Jardín a Grado 11): $450.000.
* Nota: La institución otorga un subsidio de más del 50% sobre el costo real de la educación.

OTROS COSTOS 2026:
- Carné (Obligatorio): $13.266.
- Agenda Escolar (Obligatorio): $22.552.
- Constancias y Certificados: $11.408 (por documento).
- Derechos de Grado (Solo Grado 11): $245.411.

HORIZONTE INSTITUCIONAL:
Misión: Formar líderes integrales con excelencia académica y valores humanos.
Visión: Ser reconocidos por la calidad educativa y el impacto positivo en la comunidad de Suba.
Valores: Respeto, Responsabilidad, Honestidad, Solidaridad.

UNIFORMES:
- Diario (Hombres): Pantalón gris, saco azul oscuro (cuello V), camisa blanca, corbata azul, zapatos negros.
- Diario (Mujeres): Jardinera a cuadros (azul/gris), saco azul oscuro, camisa blanca, medias blancas, zapatos negros.
- Educación Física (Unisex): Sudadera azul oscura con franjas, camiseta blanca con escudo, tenis totalmente blancos.

INSTALACIONES:
Cancha múltiple, Aulas modernas, Zonas verdes, Laboratorios, Biblioteca, Zona de juegos y Baños adecuados.
`;

// DOM Elements
const chatWidget = document.createElement('div');
chatWidget.innerHTML = `
    <div id="chat-window" class="chat-window hidden">
        <div class="chat-header">
            <span>Asistente INAS 🤖</span>
            <button id="close-chat">✖</button>
        </div>
        <div id="chat-history" class="chat-history">
            <div class="message bot">
                Hola, soy el asistente virtual del INAS. ¿En qué puedo ayudarte hoy?
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Escribe tu pregunta..." />
            <button id="send-btn">➤</button>
        </div>
    </div>
    <button id="chat-toggle-btn" class="chat-toggle-btn">
        <img src="assets/robot.png" alt="Chat" />
    </button>
`;
document.body.appendChild(chatWidget);

// Styles Injection (Dynamic to keep it self-contained or use styles.css)
// We will rely on styles.css for cleaner code, but basic visibility logic is here.

// State - Initialize with System Instruction
let conversationHistory = [
    {
        role: "user",
        parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    {
        role: "model",
        parts: [{ text: "Entendido. Soy el asistente del INAS y tengo toda esta información en cuenta para responder." }]
    }
];

// Elements
const windowEl = document.getElementById('chat-window');
const toggleBtn = document.getElementById('chat-toggle-btn');
const closeBtn = document.getElementById('close-chat');
const sendBtn = document.getElementById('send-btn');
const inputEl = document.getElementById('chat-input');
const historyEl = document.getElementById('chat-history');

// Toggle Chat
toggleBtn.addEventListener('click', () => {
    windowEl.classList.remove('hidden');
    toggleBtn.classList.add('hidden');
});

closeBtn.addEventListener('click', () => {
    windowEl.classList.add('hidden');
    toggleBtn.classList.remove('hidden');
});

// Send Message Flow
async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    // 1. Add User Message to UI
    addMessageToUI('user', text);
    inputEl.value = '';

    // 2. Add to History State
    conversationHistory.push({
        role: "user",
        parts: [{ text: text }]
    });

    addMessageToUI('bot', 'Escribiendo...');
    const loadingMsg = historyEl.lastElementChild;

    try {
        const responseText = await fetchGeminiResponse();

        // 3. Add Model Response to History State
        conversationHistory.push({
            role: "model",
            parts: [{ text: responseText }]
        });

        historyEl.removeChild(loadingMsg);
        addMessageToUI('bot', responseText);
    } catch (error) {
        historyEl.removeChild(loadingMsg);
        addMessageToUI('bot', '⚠️ Error: Verifica tu conexión o intenta más tarde.');
        console.error(error);
        conversationHistory.pop(); // Remove user message on failure to maintain consistency
    }
}

// Add to UI Helper
function addMessageToUI(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', role);
    msgDiv.textContent = text;
    historyEl.appendChild(msgDiv);
    historyEl.scrollTop = historyEl.scrollHeight;
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);
inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Gemini API Interaction
async function fetchGeminiResponse() {
    // Usamos gemini-2.5-flash que validamos que funciona con tu llave
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    // Send the entire conversation history
    const payload = {
        contents: conversationHistory
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message);
    }

    // safely extract text
    return data.candidates[0].content.parts[0].text;
}
