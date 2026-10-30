// chatbot.js
// Cliente del Asistente Virtual INAS — se comunica con /api/chat en Vercel
// (compatible con DEEPSEEK_API_KEY y GEMINI_API_KEY sin exponer llaves en el navegador).

(function () {
    // 1. Obtener o crear los elementos del widget
    let windowEl = document.getElementById('chat-window');
    let toggleBtn = document.getElementById('chat-toggle-btn');

    if (!windowEl || !toggleBtn) {
        const chatWidget = document.createElement('div');
        chatWidget.innerHTML = `
            <div id="chat-window" class="chat-window hidden">
                <div class="chat-header">
                    <span>Asistente INAS 🤖</span>
                    <button id="close-chat" type="button" aria-label="Cerrar asistente">✕</button>
                </div>
                <div id="chat-history" class="chat-history">
                    <div class="message bot">
                        ¡Hola! Soy el asistente virtual del INAS. ¿En qué puedo orientarte hoy sobre el proceso de admisiones 2027, requisitos, horarios o vida escolar?
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Escribe tu pregunta..." maxlength="1500" autocomplete="off" />
                    <button id="send-btn" type="button" aria-label="Enviar pregunta">➤</button>
                </div>
            </div>
            <button id="chat-toggle-btn" class="chat-toggle-btn" type="button" aria-label="Abrir asistente virtual INAS" title="Hablar con Asistente INAS">
                <img src="assets/robot.png" alt="Asistente Virtual INAS" />
            </button>
        `;
        document.body.appendChild(chatWidget);
        windowEl = document.getElementById('chat-window');
        toggleBtn = document.getElementById('chat-toggle-btn');
    }

    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const inputEl = document.getElementById('chat-input');
    const historyEl = document.getElementById('chat-history');

    // State - Memoria de conversación multi-turno (para DeepSeek y/o Gemini)
    let chatTurns = [];
    let previousInteractionId = null;
    let isSending = false;

    function openChat() {
        if (!windowEl || !toggleBtn) return;
        windowEl.classList.remove('hidden');
        toggleBtn.classList.add('hidden');
        if (inputEl) inputEl.focus();
    }

    function closeChat() {
        if (!windowEl || !toggleBtn) return;
        windowEl.classList.add('hidden');
        toggleBtn.classList.remove('hidden');
    }

    window.openChatBot = openChat;

    // Toggle Chat
    if (toggleBtn) toggleBtn.addEventListener('click', openChat);
    if (closeBtn) closeBtn.addEventListener('click', closeChat);

    // Botones y enlaces con data-open-chat que abren el bot
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-open-chat]');
        if (trigger) {
            e.preventDefault();
            openChat();
        }
    });

    // Send Message Flow
    async function sendMessage() {
        if (!inputEl) return;
        const text = inputEl.value.trim();
        if (!text || isSending) return;

        isSending = true;
        if (sendBtn) sendBtn.disabled = true;

        // 1. Add User Message to UI
        addMessageToUI('user', text);
        inputEl.value = '';

        addMessageToUI('bot', 'Escribiendo...');
        const loadingMsg = historyEl ? historyEl.lastElementChild : null;

        try {
            const data = await fetchAssistantResponse(text);

            if (data.interactionId) {
                previousInteractionId = data.interactionId;
            }

            chatTurns.push({ role: 'user', content: text });
            chatTurns.push({ role: 'assistant', content: data.reply });
            if (chatTurns.length > 10) {
                chatTurns = chatTurns.slice(-10);
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
            if (sendBtn) sendBtn.disabled = false;
        }
    }

    // Add to UI Helper
    function addMessageToUI(role, text) {
        if (!historyEl) return;
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', role);
        msgDiv.textContent = text;
        historyEl.appendChild(msgDiv);
        historyEl.scrollTop = historyEl.scrollHeight;
    }

    // Event Listeners
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (inputEl) {
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Vercel Serverless Proxy Interaction (/api/chat)
    async function fetchAssistantResponse(message) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                history: chatTurns,
                previousInteractionId
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        return data;
    }
})();
