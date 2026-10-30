// chatbot.js
// Cliente del Asistente Virtual INAS — se comunica con /api/chat en Vercel
// (compatible con DEEPSEEK_API_KEY y GEMINI_API_KEY sin exponer llaves en el navegador).

(function () {
    // Si la página ya tiene la lógica del chat (como index.html), no duplicar
    if (window._inasChatInitialized) return;
    window._inasChatInitialized = true;

    let windowEl = document.getElementById('chat-window');
    let toggleBtn = document.getElementById('chat-toggle-btn');

    if (!windowEl || !toggleBtn) {
        const chatWidget = document.createElement('div');
        chatWidget.innerHTML = `
            <div id="chat-window" class="chat-window hidden">
                <div class="chat-header">
                    <span>Asistente INAS 🤖</span>
                    <button id="close-chat" type="button" aria-label="Cerrar asistente" onclick="window.toggleINASChat ? window.toggleINASChat(false) : this.closest('.chat-window').classList.add('hidden')">✕</button>
                </div>
                <div id="chat-history" class="chat-history">
                    <div class="message bot">
                        ¡Hola! Soy el asistente virtual del INAS. ¿En qué puedo orientarte hoy sobre el proceso de admisiones 2027, requisitos, horarios o vida escolar?
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Escribe tu pregunta..." maxlength="1500" autocomplete="off" />
                    <button id="send-btn" type="button" aria-label="Enviar pregunta" onclick="window.sendINASMessage && window.sendINASMessage()">➤</button>
                </div>
            </div>
            <button id="chat-toggle-btn" class="chat-toggle-btn" type="button" aria-label="Abrir asistente virtual INAS" title="Hablar con Asistente INAS" onclick="window.toggleINASChat ? window.toggleINASChat(true) : (document.getElementById('chat-window').classList.remove('hidden'), this.classList.add('hidden'))">
                <img src="assets/robot.png" alt="Asistente Virtual INAS" />
            </button>
        `;
        document.body.appendChild(chatWidget);
        windowEl = document.getElementById('chat-window');
        toggleBtn = document.getElementById('chat-toggle-btn');
    }

    function toggleChat(open) {
        if (!windowEl || !toggleBtn) return;
        var inputEl = document.getElementById('chat-input');
        if (open) {
            windowEl.classList.remove('hidden');
            toggleBtn.classList.add('hidden');
            if (inputEl) setTimeout(function () { inputEl.focus(); }, 60);
        } else {
            windowEl.classList.add('hidden');
            toggleBtn.classList.remove('hidden');
        }
    }

    if (!window.toggleINASChat) {
        window.toggleINASChat = toggleChat;
        window.openChatBot = function () { toggleChat(true); };
        window.closeChatBot = function () { toggleChat(false); };
    }

    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const inputEl = document.getElementById('chat-input');
    const historyEl = document.getElementById('chat-history');

    let chatTurns = [];
    let previousInteractionId = null;
    let isSending = false;

    if (toggleBtn) toggleBtn.addEventListener('click', function () { window.toggleINASChat(true); });
    if (closeBtn) closeBtn.addEventListener('click', function () { window.toggleINASChat(false); });

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-open-chat]');
        if (trigger) {
            e.preventDefault();
            window.toggleINASChat(true);
        }
    });

    async function sendMessage() {
        var input = document.getElementById('chat-input');
        var send = document.getElementById('send-btn');
        var hist = document.getElementById('chat-history');
        if (!input) return;
        const text = input.value.trim();
        if (!text || isSending) return;

        isSending = true;
        if (send) send.disabled = true;

        addMessageToUI('user', text);
        input.value = '';

        addMessageToUI('bot', 'Escribiendo...');
        const loadingMsg = hist ? hist.lastElementChild : null;

        const endpoint = window.location.protocol === 'file:' 
            ? 'http://localhost:8000/api/chat' 
            : '/api/chat';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: chatTurns,
                    previousInteractionId
                })
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            if (data.interactionId) {
                previousInteractionId = data.interactionId;
            }

            chatTurns.push({ role: 'user', content: text });
            chatTurns.push({ role: 'assistant', content: data.reply });
            if (chatTurns.length > 10) chatTurns = chatTurns.slice(-10);

            if (loadingMsg && loadingMsg.parentNode === hist) {
                hist.removeChild(loadingMsg);
            }
            addMessageToUI('bot', data.reply);
        } catch (error) {
            if (loadingMsg && loadingMsg.parentNode === hist) {
                hist.removeChild(loadingMsg);
            }
            addMessageToUI(
                'bot',
                '⚠️ En este momento el asistente está fuera de línea. Puedes escribirnos directo al WhatsApp de Secretaría: 305 430-1113.'
            );
            console.error('[chatbot]', error);
        } finally {
            isSending = false;
            if (send) send.disabled = false;
        }
    }

    if (!window.sendINASMessage) {
        window.sendINASMessage = sendMessage;
    }

    function addMessageToUI(role, text) {
        var hist = document.getElementById('chat-history');
        if (!hist) return;
        var clean = (text || '')
            .replace(/^\s*#+\s*/gm, '')
            .replace(/^\s*[\*\-]\s+/gm, '• ')
            .replace(/\*/g, '')
            .replace(/_{2,}/g, '')
            .replace(/`{1,3}[^`]*`{1,3}/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ' + role;
        msgDiv.textContent = clean;
        hist.appendChild(msgDiv);
        hist.scrollTop = hist.scrollHeight;
    }

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (inputEl) {
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
})();
