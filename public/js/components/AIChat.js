class AIChat {
    constructor(container) {
        this.container = container;
        this.messages = [];
        this.initChat();
    }

    initChat() {
        // 创建聊天容器
        this.chatContainer = document.createElement('div');
        this.chatContainer.style.cssText = `
            width: 100%;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: none;
            flex-direction: column;
            padding: 20px;
            box-sizing: border-box;
            margin-bottom: 20px;
        `;

        // 创建标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 24px;
            font-weight: bold;
            color: #0078ff;
            margin-bottom: 20px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        `;
        title.innerHTML = '<span>🤖</span> AI智能助手';
        this.chatContainer.appendChild(title);

        // 创建消息区域
        this.messagesArea = document.createElement('div');
        this.messagesArea.style.cssText = `
            flex: 1;
            overflow-y: auto;
            margin-bottom: 20px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 8px;
            min-height: 200px;
            max-height: 400px;
        `;
        this.chatContainer.appendChild(this.messagesArea);

        // 创建输入区域
        const inputArea = document.createElement('div');
        inputArea.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 10px;
        `;

        // 创建输入框
        this.inputField = document.createElement('input');
        this.inputField.style.cssText = `
            flex: 1;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            outline: none;
        `;
        this.inputField.placeholder = '输入你的问题...';
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        inputArea.appendChild(this.inputField);

        // 创建发送按钮
        const sendButton = document.createElement('button');
        sendButton.style.cssText = `
            padding: 12px 24px;
            background: #0078ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        `;
        sendButton.textContent = '发送';
        sendButton.onclick = () => this.sendMessage();
        inputArea.appendChild(sendButton);

        this.chatContainer.appendChild(inputArea);
        this.container.appendChild(this.chatContainer);
    }

    show() {
        this.chatContainer.style.display = 'flex';
        this.inputField.focus();
    }

    hide() {
        this.chatContainer.style.display = 'none';
    }

    async sendMessage() {
        const message = this.inputField.value.trim();
        if (!message) return;

        // 清空输入框
        this.inputField.value = '';

        // 添加用户消息
        this.addMessage(message, 'user');

        // 显示AI思考中
        const thinkingMsg = this.addMessage('思考中...', 'ai', true);

        try {
            // 调用AI API
            const response = await this.callAIAPI(message);
            
            // 移除思考中消息
            thinkingMsg.remove();
            
            // 添加AI回复
            this.addMessage(response, 'ai');
        } catch (error) {
            // 移除思考中消息
            thinkingMsg.remove();
            
            // 显示错误消息
            this.addMessage('抱歉，出现了一些问题，请稍后再试。', 'ai');
            console.error('AI API调用失败:', error);
        }
    }

    addMessage(text, type, isThinking = false) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            margin-bottom: 10px;
            padding: 10px 15px;
            border-radius: 8px;
            max-width: 80%;
            word-wrap: break-word;
            align-self: ${type === 'user' ? 'flex-end' : 'flex-start'};
            background: ${type === 'user' ? '#0078ff' : '#f0f0f0'};
            color: ${type === 'user' ? 'white' : '#333'};
            font-style: ${isThinking ? 'italic' : 'normal'};
        `;
        messageDiv.textContent = text;
        this.messagesArea.appendChild(messageDiv);
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        return messageDiv;
    }

    async callAIAPI(message) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('API请求失败');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('AI API调用失败:', error);
            throw error;
        }
    }
} 