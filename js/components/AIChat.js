class AIChat {
    constructor(container) {
        this.container = container;
        this.element = null;
        this.chatContainer = null; // 新增：用于容纳历史和输入
        this.chatHistoryElement = null;
        this.inputElement = null;
        this.chatHistory = [];
        this.isChatVisible = true; // 新增：跟踪聊天区域可见性
        
        // --- API 配置 (参考 ai_assistant.js) ---
        // !!! 安全警告: 直接在前端嵌入 API 密钥非常不安全 !!!
        // !!! 生产环境请使用后端代理 !!!
        this.apiKey = "sk-1a0182653ed145f99873f833108f7994"; // DeepSeek API 密钥
        this.baseUrl = "https://api.deepseek.com/v1/chat/completions";
        this.model = "deepseek-chat";
        // ----------------------------------------

        this.init();
    }

    init() {
        this.element = document.createElement('div');
        this.element.className = 'interactive-component ai-chat';
        this.element.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: transparent; /* 让主容器透明 */
            z-index: 1001;
            pointer-events: none; /* 主容器不拦截事件 */
        `;

        // 新增：创建标题栏 (可点击区域)
        const header = document.createElement('div');
        header.className = 'ai-chat-header';
        header.innerHTML = '<span>🤖 AI 助手 优宝</span><span class="toggle-arrow">▼</span>'; // 添加箭头
        header.style.cssText = `
            background: #4CAF50;
            color: white;
            padding: 8px 15px;
            cursor: pointer;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            pointer-events: auto; /* 标题栏可点击 */
        `;
        header.onclick = () => this.toggleChatVisibility();
        this.element.appendChild(header);

        // 新增：创建聊天内容容器 (历史+输入)
        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'ai-chat-content';
        this.chatContainer.style.cssText = `
            background: rgba(255, 255, 255, 0.95);
            padding: 15px;
            border-top: 1px solid #ddd;
            max-height: 300px;
            display: flex; /* 初始可见 */
            flex-direction: column;
            pointer-events: auto; /* 内容区域可交互 */
            transition: max-height 0.3s ease-out, padding 0.3s ease-out; /* 添加过渡 */
        `;

        // 聊天历史区域 (放入 chatContainer)
        const chatHistory = document.createElement('div');
        chatHistory.className = 'chat-history';
        chatHistory.style.cssText = `
            flex: 1;
            overflow-y: auto;
            margin-bottom: 10px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 8px;
            min-height: 100px; /* 保证最小高度 */
        `;

        // 初始欢迎消息
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'ai-message';
        welcomeMessage.innerHTML = '你好呀！我是 AI 助手优宝，有什么可以帮助你的吗？<br><small style="color: #666; font-size: 12px;">🔔提示：需要联网才能使用AI助手功能哦</small>';
        chatHistory.appendChild(welcomeMessage);
        this.chatContainer.appendChild(chatHistory);

        // 输入区域 (放入 chatContainer)
        const inputArea = document.createElement('div');
        inputArea.style.cssText = `
            display: flex;
            gap: 10px;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '💬输入您的问题...';
        input.style.cssText = `
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        `;

        const sendButton = document.createElement('button');
        sendButton.textContent = '发送';
        sendButton.style.cssText = `
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        // 添加事件监听
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSend(input.value);
                input.value = '';
            }
        });

        sendButton.addEventListener('click', () => {
            this.handleSend(input.value);
            input.value = '';
        });

        // 组装组件
        inputArea.appendChild(input);
        inputArea.appendChild(sendButton);
        this.chatContainer.appendChild(inputArea);
        this.element.appendChild(this.chatContainer);

        this.container.appendChild(this.element);

        // 保存引用
        this.chatHistoryElement = chatHistory;
        this.inputElement = input;
        this.headerElement = header; // 保存标题栏引用
    }

    // 新增：切换聊天区域可见性
    toggleChatVisibility() {
        this.isChatVisible = !this.isChatVisible;
        const arrow = this.headerElement.querySelector('.toggle-arrow');
        if (this.isChatVisible) {
            this.chatContainer.style.display = 'flex';
            arrow.textContent = '▼'; // 向下箭头
        } else {
            this.chatContainer.style.display = 'none';
            arrow.textContent = '▲'; // 向上箭头
        }
    }

    async handleSend(message) {
        const userMessage = message.trim();
        if (!userMessage) return;

        // 如果聊天是隐藏的，先显示它
        if (!this.isChatVisible) {
            this.toggleChatVisibility();
        }

        // 添加用户消息
        this.addMessage('user', userMessage);

        // 显示思考中消息
        const thinkingMessage = this.addMessage('ai', '⏳思考中...', 'ai-thinking');

        try {
            // 调用真实 API
            const response = await this.callAIAPI(userMessage);
            
            // 移除思考中消息
            thinkingMessage.remove();

            // 添加 AI 回复
            this.addMessage('ai', response);
        } catch (error) {
            // 移除思考中消息
            thinkingMessage.remove();
            // 显示错误消息
            this.addMessage('ai', `⚠️抱歉，与 AI 通信失败: ${error.message}`);
            console.error("AI API Error:", error);
        }
    }

    addMessage(type, content, className = '') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(`${type}-message`);
        if(className) messageDiv.classList.add(className);
        
        messageDiv.style.cssText = `
            margin-bottom: 10px;
            padding: 8px 12px;
            border-radius: 8px;
            max-width: 80%;
            word-wrap: break-word;
        `;

        if (type === 'user') {
            messageDiv.style.cssText += `
                background: #E3F2FD;
                margin-left: auto;
            `;
        } else {
            messageDiv.style.cssText += `
                background: #F5F5F5;
                margin-right: auto;
            `;
            if (className === 'ai-thinking') {
                 messageDiv.style.fontStyle = 'italic';
                 messageDiv.style.color = '#666';
            }
        }

        messageDiv.textContent = content;
        this.chatHistoryElement.appendChild(messageDiv);
        // 滚动到底部前确保元素可见
        if (this.isChatVisible) {
             this.chatHistoryElement.scrollTop = this.chatHistoryElement.scrollHeight;
        }
        return messageDiv; // 返回消息元素，用于移除
    }

    async callAIAPI(message) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: message
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API 请求失败: ${response.status} ${response.statusText}. ${errorBody}`);
            }

            const data = await response.json();
            if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
                 throw new Error('API 返回了无效的响应格式');
            }
            return data.choices[0].message.content;
        } catch (error) {
            console.error("callAIAPI Error:", error);
            throw error; // 将错误向上抛出，由 handleSend 处理
        }
    }

    show() {
        this.element.style.display = 'block'; // 使用 block 或其他，而不是 flex
    }

    hide() {
        this.element.style.display = 'none';
    }
} 