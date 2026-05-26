/* ============================================
   Chatbot Widget — Eternal Rides
   ============================================ */

(function () {
    'use strict';

    const chatbot = document.getElementById('chatbot');
    const toggle = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputForm = document.getElementById('chatbot-input-form');
    const inputField = document.getElementById('chatbot-input');
    const quickRepliesContainer = document.getElementById('chatbot-quick-replies');

    if (!chatbot || !toggle) return;

    // ─── KNOWLEDGE BASE ───
    const responses = {
        greeting: "Welcome to Eternal Rides! 🚗✨ I'm your luxury wedding car assistant. How can I help you plan the perfect ride for your special day?",

        fleet: "We have an exquisite fleet of 6 luxury vehicles:\n\n🔹 **Rolls Royce Phantom** — $500/day\n🔹 **Mercedes S-Class** — $350/day\n🔹 **Bentley Continental** — $450/day\n🔹 **Vintage Silver Cloud** — $600/day\n🔹 **Audi A8 L** — $300/day\n🔹 **Range Rover** — $400/day\n\nEach comes with a professional chauffeur!",

        pricing: "We offer 3 packages:\n\n🥈 **Silver** — $299 (1 car, 4 hrs)\n🥇 **Gold** — $499 (2 cars, 8 hrs, red carpet)\n💎 **Platinum** — $799 (3 cars, full day, photography)\n\nAll packages include a professional chauffeur and complimentary beverages!",

        booking: "Booking is easy! You can:\n\n1️⃣ Fill out the **contact form** on our website\n2️⃣ Call us at **+1 (555) 123-4567**\n3️⃣ Email us at **hello@eternalrides.com**\n\nWe recommend booking at least 3 months in advance for peak wedding season! 📅",

        decorations: "Yes! Our car decoration service includes:\n\n🌸 Custom **floral arrangements** matching your theme\n🎀 **Ribbons, bows**, and draping\n🌿 **Greenery** and seasonal flowers\n✨ **LED** accent lighting (evening weddings)\n\nDecorations are included in Gold & Platinum packages, or can be added to Silver for $99.",

        chauffeur: "All our chauffeurs are:\n\n👔 Professionally uniformed\n🎓 Extensively trained in wedding etiquette\n📋 Background-checked and certified\n⏰ Always arrive 30 minutes early\n🥂 Trained in champagne service\n\nThey're the best in the business!",

        availability: "We're available 7 days a week! Our office hours are **9 AM – 8 PM**, but our cars are available for events at any time. For availability on your specific date, please fill out our booking form or call us.",

        default: "That's a great question! For detailed information, I'd suggest:\n\n📞 Calling us at **+1 (555) 123-4567**\n📧 Emailing **hello@eternalrides.com**\n📝 Filling out the **contact form** below\n\nOur wedding specialists would love to help! Is there anything else I can help with?"
    };

    // ─── KEYWORD MATCHING ───
    function getResponse(message) {
        const msg = message.toLowerCase();

        if (msg.match(/\b(car|fleet|vehicle|rolls|royce|mercedes|bentley|audi|range rover|vintage)\b/))
            return responses.fleet;

        if (msg.match(/\b(price|pricing|cost|how much|package|rate|fee|expensive|cheap|afford)\b/))
            return responses.pricing;

        if (msg.match(/\b(book|booking|reserve|reservation|schedule|appointment|order)\b/))
            return responses.booking;

        if (msg.match(/\b(decor|decoration|flower|floral|ribbon|theme|arrange)\b/))
            return responses.decorations;

        if (msg.match(/\b(chauffeur|driver|driving|professional|uniform)\b/))
            return responses.chauffeur;

        if (msg.match(/\b(available|availability|date|when|open|hour|time|schedule)\b/))
            return responses.availability;

        if (msg.match(/\b(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/))
            return responses.greeting;

        return responses.default;
    }

    // ─── CREATE MESSAGE ELEMENT ───
    function createMessage(text, isBot = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message chat-message--${isBot ? 'bot' : 'user'}`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'chat-msg-avatar';
        avatarDiv.textContent = isBot ? '✦' : 'U';

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'chat-msg-bubble';
        // Simple markdown: **bold**
        bubbleDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(bubbleDiv);

        return messageDiv;
    }

    // ─── TYPING INDICATOR ───
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message chat-message--bot';
        typingDiv.id = 'chat-typing';

        const avatar = document.createElement('div');
        avatar.className = 'chat-msg-avatar';
        avatar.textContent = '✦';

        const bubble = document.createElement('div');
        bubble.className = 'chat-msg-bubble chat-typing';
        bubble.innerHTML = '<span></span><span></span><span></span>';

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(bubble);
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
    }

    function hideTyping() {
        const typing = document.getElementById('chat-typing');
        if (typing) typing.remove();
    }

    // ─── SCROLL TO BOTTOM ───
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ─── ADD BOT MESSAGE WITH TYPING DELAY ───
    function addBotMessage(text) {
        showTyping();
        const delay = Math.min(800 + text.length * 8, 2000);

        setTimeout(() => {
            hideTyping();
            const msg = createMessage(text, true);
            messagesContainer.appendChild(msg);
            scrollToBottom();
        }, delay);
    }

    // ─── ADD USER MESSAGE ───
    function addUserMessage(text) {
        const msg = createMessage(text, false);
        messagesContainer.appendChild(msg);
        scrollToBottom();
    }

    // ─── HANDLE USER INPUT ───
    function handleUserInput(text) {
        if (!text.trim()) return;

        addUserMessage(text);

        // Get response
        const response = getResponse(text);
        addBotMessage(response);
    }

    // ─── TOGGLE CHATBOT ───
    function toggleChatbot() {
        chatbot.classList.toggle('open');

        if (chatbot.classList.contains('open')) {
            // Hide badge
            const badge = chatbot.querySelector('.chatbot-badge');
            if (badge) badge.classList.add('hidden');

            inputField.focus();

            // Send greeting if first open
            if (messagesContainer.children.length === 0) {
                setTimeout(() => addBotMessage(responses.greeting), 500);
            }
        }
    }

    // ─── EVENT LISTENERS ───
    toggle.addEventListener('click', toggleChatbot);
    closeBtn.addEventListener('click', toggleChatbot);

    inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = inputField.value.trim();
        if (text) {
            handleUserInput(text);
            inputField.value = '';
        }
    });

    // Quick replies
    quickRepliesContainer.querySelectorAll('.quick-reply').forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.getAttribute('data-msg');
            handleUserInput(msg);
        });
    });

    // Close with Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatbot.classList.contains('open')) {
            toggleChatbot();
        }
    });

})();
