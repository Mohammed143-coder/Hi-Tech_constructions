(function() {
    'use strict';
    
    // Chatbot Configuration
    const CHATBOT_CONFIG = {
        apiEndpoint: '/api/chatbot/chat',
        companyName: 'HI-Tech Constructions & Builders',
        welcomeMessage: 'Hi! How can I help you with your construction needs? 🏗️',
        primaryColor: '#2c3e50'
    };

    // Check if already loaded
    if (window.HitechChatbot) {
        return;
    }

    // Inject CSS Styles
    const injectStyles = () => {
        if (document.getElementById('hitech-chatbot-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'hitech-chatbot-styles';
        style.textContent = `
            #hitech-chatbot-widget {
                position: fixed;
                right: 20px;
                bottom: 80px;
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .hitech-chat-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #2c3e50, #34495e);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                animation: hitech-pulse 2s infinite;
            }

            .hitech-chat-icon:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(0,0,0,0.4);
            }

            @keyframes hitech-pulse {
                0% { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
                50% { box-shadow: 0 4px 20px rgba(44,62,80,0.6); }
                100% { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
            }

            .hitech-chat-widget {
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                position: absolute;
                bottom: 70px;
                right: 0;
            }

            .hitech-chat-widget.open {
                display: flex;
                animation: hitech-slideUp 0.3s ease-out;
            }

            @keyframes hitech-slideUp {
                from { opacity: 0; transform: translateY(20px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }

            .hitech-chat-header {
                background: linear-gradient(135deg, #2c3e50, #34495e);
                color: white;
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .hitech-chat-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color:white;
            }

            .hitech-online-status {
                font-size: 12px;
                color: #2ecc71;
                margin-top: 2px;
                display: block;
            }

            .hitech-close-btn {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 5px;
                border-radius: 5px;
                font-size: 18px;
                line-height: 1;
            }

            .hitech-close-btn:hover {
                background: rgba(255,255,255,0.1);
            }

            .hitech-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: #f8f9fa;
            }

            .hitech-message {
                margin-bottom: 12px;
                display: flex;
                align-items: flex-start;
            }

            .hitech-message.user {
                justify-content: flex-end;
            }

            .hitech-message-content {
                max-width: 80%;
                padding: 10px 14px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.4;
            }

            .hitech-message.ai .hitech-message-content {
                background: white;
                border: 1px solid #e1e5e9;
                border-radius: 16px 16px 16px 4px;
            }

            .hitech-message.user .hitech-message-content {
                background: linear-gradient(135deg, #2c3e50, #34495e);
                color: white;
                border-radius: 16px 16px 4px 16px;
            }

            .hitech-typing-indicator {
                padding: 12px 16px;
                background: #f8f9fa;
                display: none;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                color: #666;
            }

            .hitech-typing-indicator.show {
                display: flex;
            }

            .hitech-typing-dots {
                display: flex;
                gap: 3px;
            }

            .hitech-typing-dots span {
                width: 6px;
                height: 6px;
                background: #666;
                border-radius: 50%;
                animation: hitech-typingAnimation 1.4s infinite;
            }

            .hitech-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
            .hitech-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

            @keyframes hitech-typingAnimation {
                0%, 60%, 100% { opacity: 0.3; }
                30% { opacity: 1; }
            }

            .hitech-quick-actions {
                padding: 12px 16px;
                background: #f8f9fa;
                border-top: 1px solid #e1e5e9;
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .hitech-quick-btn {
                background: white;
                border: 1px solid #e1e5e9;
                padding: 6px 12px;
                border-radius: 12px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .hitech-quick-btn:hover {
                background: #2c3e50;
                color: white;
                border-color: #2c3e50;
            }

            .hitech-chat-input-container {
                padding: 16px;
                background: white;
                border-top: 1px solid #e1e5e9;
            }

            .hitech-chat-input-form {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .hitech-message-input {
                flex: 1;
                padding: 10px 12px;
                border: 1px solid #e1e5e9;
                border-radius: 20px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.3s;
            }

            .hitech-message-input:focus {
                border-color: #2c3e50;
            }

            .hitech-send-button {
                background: linear-gradient(135deg, #2c3e50, #34495e);
                color: white;
                border: none;
                padding: 10px 12px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
            }

            .hitech-send-button:hover {
                transform: scale(1.05);
            }

            .hitech-send-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            /* Mobile Responsive */
            @media (max-width: 480px) {
                .hitech-chat-widget {
                    width: calc(100vw - 40px);
                    height: 450px;
                    bottom: 60px;
                    right: -10px;
                }
                #hitech-chatbot-widget {
                    right: 20px;
                    bottom: 90px;
                }
            }
        `;
        
        document.head.appendChild(style);
    };

    // Create HTML
    const createChatbotHTML = () => {
        return `
            <div class="hitech-chat-icon" id="hitechChatIcon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1 .2 0 .3 0 .4-.1L12.4 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7c-.6 0-1-.4-1-1s.4-1 1-1h10c.6 0 1 .4 1 1s-.4 1-1 1zm0-3H7c-.6 0-1-.4-1-1s.4-1 1-1h10c.6 0 1 .4 1 1s-.4 1-1 1zm0-3H7c-.6 0-1-.4-1-1s.4-1 1-1h10c.6 0 1 .4 1 1s-.4 1-1 1z"/>
                </svg>
            </div>

            <div class="hitech-chat-widget" id="hitechChatWidget">
                <div class="hitech-chat-header">
                    <div class="hitech-chat-header-info">
                        <h3>${CHATBOT_CONFIG.companyName}</h3>
                        <span class="hitech-online-status">● Online</span>
                    </div>
                    <button class="hitech-close-btn" id="hitechCloseBtn">×</button>
                </div>

                <div class="hitech-chat-messages" id="hitechChatMessages">
                    <div class="hitech-message ai">
                        <div class="hitech-message-content">${CHATBOT_CONFIG.welcomeMessage}</div>
                    </div>
                </div>

                <div class="hitech-typing-indicator" id="hitechTypingIndicator">
                    <div class="hitech-typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span>AI is typing...</span>
                </div>

                <div class="hitech-quick-actions" id="hitechQuickActions">
                    <button class="hitech-quick-btn" onclick="HitechChatbot.sendQuickMessage('What services do you offer?')">Services</button>
                    <button class="hitech-quick-btn" onclick="HitechChatbot.sendQuickMessage('Get a quote')">Quote</button>
                    <button class="hitech-quick-btn" onclick="HitechChatbot.sendQuickMessage('Contact information')">Contact</button>
                </div>

                <div class="hitech-chat-input-container">
                    <form class="hitech-chat-input-form" id="hitechChatForm">
                        <input type="text" class="hitech-message-input" id="hitechMessageInput" placeholder="Type your message..." autocomplete="off">
                        <button type="submit" class="hitech-send-button" id="hitechSendButton">Send</button>
                    </form>
                </div>
            </div>
        `;
    };

    // Main Chatbot Class
    class HitechChatbot {
        constructor() {
            this.sessionId = this.generateSessionId();
            this.isOpen = false;
            this.firstMessage = true;
            this.init();
        }

        init() {
            injectStyles();
            this.createWidget();
            this.bindEvents();
        }

        createWidget() {
            const existing = document.getElementById('hitech-chatbot-widget');
            if (existing) existing.remove();

            const widget = document.createElement('div');
            widget.id = 'hitech-chatbot-widget';
            widget.innerHTML = createChatbotHTML();
            
            document.body.appendChild(widget);

            this.messagesContainer = document.getElementById('hitechChatMessages');
            this.messageInput = document.getElementById('hitechMessageInput');
            this.sendButton = document.getElementById('hitechSendButton');
            this.typingIndicator = document.getElementById('hitechTypingIndicator');
            this.chatForm = document.getElementById('hitechChatForm');
            this.chatIcon = document.getElementById('hitechChatIcon');
            this.chatWidget = document.getElementById('hitechChatWidget');
            this.closeBtn = document.getElementById('hitechCloseBtn');
            this.quickActions = document.getElementById('hitechQuickActions');
        }

        bindEvents() {
            this.chatIcon.addEventListener('click', () => this.toggleChat());
            this.closeBtn.addEventListener('click', () => this.closeChat());
            this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeChat();
                }
            });
        }

        generateSessionId() {
            return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
        }

        toggleChat() {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }

        openChat() {
            this.chatWidget.classList.add('open');
            this.chatIcon.style.display = 'none';
            this.isOpen = true;
            
            setTimeout(() => {
                this.messageInput.focus();
            }, 300);
        }

        closeChat() {
            this.chatWidget.classList.remove('open');
            this.chatIcon.style.display = 'flex';
            this.isOpen = false;
        }

        async handleSubmit(e) {
            e.preventDefault();
            
            const message = this.messageInput.value.trim();
            if (!message) return;

            this.addMessage(message, 'user');
            this.messageInput.value = '';
            this.setLoading(true);

            if (this.firstMessage) {
                this.quickActions.style.display = 'none';
                this.firstMessage = false;
            }

            try {
                const response = await this.sendMessage(message);
                if (response.success) {
                    this.addMessage(response.response, 'ai');
                } else {
                    throw new Error(response.error);
                }
            } catch (error) {
                console.error('Chat error:', error);
                this.addMessage('Sorry, I encountered an issue. Please try again later.', 'ai');
            } finally {
                this.setLoading(false);
            }
        }

        async sendMessage(message) {
            const response = await fetch(CHATBOT_CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        }

        addMessage(content, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `hitech-message ${type}`;
            
            const messageContent = document.createElement('div');
            messageContent.className = 'hitech-message-content';
            messageContent.textContent = content;
            
            messageDiv.appendChild(messageContent);
            this.messagesContainer.appendChild(messageDiv);
            
            this.scrollToBottom();
        }

        setLoading(isLoading) {
            this.sendButton.disabled = isLoading;
            this.messageInput.disabled = isLoading;
            
            if (isLoading) {
                this.sendButton.textContent = 'Sending...';
                this.typingIndicator.classList.add('show');
            } else {
                this.sendButton.textContent = 'Send';
                this.typingIndicator.classList.remove('show');
            }
            
            this.scrollToBottom();
        }

        scrollToBottom() {
            setTimeout(() => {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }, 100);
        }

        sendQuickMessage(message) {
            this.messageInput.value = message;
            this.handleSubmit(new Event('submit'));
        }

        static sendQuickMessage(message) {
            if (window.hitechChatbotInstance) {
                window.hitechChatbotInstance.sendQuickMessage(message);
            }
        }

        static openChat() {
            if (window.hitechChatbotInstance) {
                window.hitechChatbotInstance.openChat();
            }
        }

        static closeChat() {
            if (window.hitechChatbotInstance) {
                window.hitechChatbotInstance.closeChat();
            }
        }
    }

    // Initialize
    function initializeChatbot() {
        if (window.hitechChatbotInstance) {
            return;
        }
        
        window.hitechChatbotInstance = new HitechChatbot();
        window.HitechChatbot = HitechChatbot;
        
        console.log('Hi-tech Constructions Chatbot loaded!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChatbot);
    } else {
        initializeChatbot();
    }

})();