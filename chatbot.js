// chatbot.js
// Cliente del Asistente Virtual INAS — se comunica con /api/chat en Vercel
// para mantener GEMINI_API_KEY 100% privada en el servidor (cero llaves expuestas en el navegador).

// DOM Elements
const chatWidget = document.createElement('div');
chatWidget.innerHTML = `
    <div id="chat-window" class="chat-window hidden">
        <div class="chat-header">
            <span>Asistente INAS 🤖</span>
            <button id="close-chat" type="button" aria-label="Cerrar asistente">✖</button>
        </div>
        <div id="chat-history" class="chat-history">
            <div class="message bot">
                Hola, soy el asistente virtual del INAS. ¿En qué puedo ayudarte con Admisiones 2027, horarios, pagos o uniformes?
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Escribe tu pregunta..." maxlength="1500" />
            <button id="send-btn" type="button" aria-label="Enviar pregunta">➤</button>
        </div>
    </div>
    <button id="chat-toggle-btn" class="chat-toggle-btn" type="button" aria-label="Abrir asistente virtual INAS">
        <img src="assets/robot.png" alt="Chat INAS" />
    </button>
`;
document.body.appendChild(chatWidget);

// Styles Injection (Dynamic to keep it self-contained or use styles.css)
// We will rely on styles.css for cleaner code, but basic visibility logic is here.

// State - ID de interacción con memoria en servidor (Interactions API)
let previousInteractionId = null;
let isSending = false;

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
    inputEl.focus();
});

closeBtn.addEventListener('click', () => {
    windowEl.classList.add('hidden');
    toggleBtn.classList.remove('hidden');
});

// Send Message Flow
async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isSending) return;

    isSending = true;
    sendBtn.disabled = true;

    // 1. Add User Message to UI
    addMessageToUI('user', text);
    inputEl.value = '';

    addMessageToUI('bot', 'Escribiendo...');
    const loadingMsg = historyEl.lastElementChild;

    try {
        const data = await fetchAssistantResponse(text);

        if (data.interactionId) {
            previousInteractionId = data.interactionId;
        }

        if (loadingMsg && loadingMsg.parentNode === historyEl) {
            historyEl.removeChild(loadingMsg);
        }
        addMessageToUI('bot', data.reply);
    } catch (error) {
        if (loadingMsg && loadingMsg.parentNode === historyEl) {
            historyEl.removeChild(loadingMsg);
        }
        addMessageToUI(
            'bot',
            '⚠️ En este momento el asistente está fuera de línea. Puedes escribirnos directo al WhatsApp de Secretaría: 305 430-1113.'
        );
        console.error('[chatbot]', error);
    } finally {
        isSending = false;
        sendBtn.disabled = false;
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
inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

// Vercel Serverless Proxy Interaction (/api/chat)
async function fetchAssistantResponse(message) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            previousInteractionId
        })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
}
