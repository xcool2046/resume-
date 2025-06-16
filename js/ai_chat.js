// AI聊天功能模块
class AIChatManager {
    constructor() {
        this.apiKey = 'sk-4178cd1353e54fc996e2263ee77586f1'; // DeepSeek API Key
        this.resumeContent = '';
        this.chatHistory = [];
        this.isTyping = false;
        
        this.initializeElements();
        this.loadResumeContent();
        this.bindEvents();
        this.initializeChatInterface();
    }

    initializeElements() {
        this.terminalContainer = document.getElementById('terminalContainer');
        this.quickQuestions = document.getElementById('quickQuestions');
        this.chatArea = document.getElementById('chatArea');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
    }

    loadResumeContent() {
        // 直接使用内置的简历内容，避免网络请求的CORS问题
        this.resumeContent = `刘翔 - 网络工程专业 | 全栈开发者

## 个人信息
姓名：刘翔
专业：网络工程（浙江传媒学院）
联系方式：15757198473 | x233577@163.com
现住城市：杭州
学历：本科在读（2023.09-2027.06）
GPA：3.4，专业前10%

## 技能专长

### 前端开发
JavaScript (ES6+)、HTML5、CSS3、React、微信小程序原生开发

### 后端开发
Node.js、Express、RESTful API设计

### 数据库
MySQL数据库设计与查询优化

### AI/AIGC能力
Cursor、GitHub Copilot辅助开发、大模型应用、ComfyUI工作流、Prompt工程

## 核心项目

### 景悦达（智慧旅游小程序）- 项目负责人
微信小程序 + Node.js/Express + MySQL全栈开发
实现用户系统、景点展示、地图路线规划核心功能

### 贵物志（电商小程序）- 独立开发
微信小程序云开发，完整电商闭环
商品管理、购物车、微信支付等核心功能

### AI医学影像分析平台 - 前端重构
React + Ant Design + ECharts
UI/UX重新设计，提升信息展示清晰度50%

### 旅U（旅行社交平台）- 前端原型
React单页面应用，响应式设计
快速交付高保真原型，成功部署上线

## 自我评价
• 扎实的全栈开发能力，丰富的0到1项目落地经验
• 深度应用AI工具提升开发效率，追求技术创新
• 自驱学习，出色的问题解决能力和项目交付质量`;

        console.log('简历内容已直接加载（内置版本）');
        
        // 添加系统消息确认知识库已加载
        setTimeout(() => {
            this.addSystemMessage('✅ 准备就绪');
        }, 500);
    }



    bindEvents() {
        // 发送消息事件
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 快速问题按钮事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('question-btn')) {
                const question = e.target.getAttribute('data-question');
                this.askQuickQuestion(question);
            }
        });
    }

    initializeChatInterface() {
        // 设置状态为在线
        this.updateStatus('在线', '#28ca42');
        
        // 聚焦到输入框
        setTimeout(() => {
            this.messageInput.focus();
        }, 100);
        
        // 添加使用提示
        setTimeout(() => {
            this.addSystemMessage('💡 可直接提问或使用下方快速问题');
        }, 1500);
    }



    updateStatus(text, color) {
        this.statusText.textContent = text;
        this.statusIndicator.style.color = color;
    }

    addSystemMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.innerHTML = `
            <span class="timestamp">[系统]</span>
            <span class="message-text">${text}</span>
        `;
        this.chatArea.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <span class="timestamp">[面试官]</span>
            <span class="message-text">${text}</span>
        `;
        this.chatArea.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addAIMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.innerHTML = `
            <span class="timestamp">[刘翔]</span>
            <span class="message-text"></span>
        `;
        this.chatArea.appendChild(messageDiv);
        
        // 打字机效果显示AI回答
        this.typewriterEffect(messageDiv.querySelector('.message-text'), text);
        this.scrollToBottom();
    }

    typewriterEffect(element, text, speed = 20) { // 从30ms提速到20ms
        let index = 0;
        element.textContent = '';
        
        const typeNext = () => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                this.scrollToBottom();
                setTimeout(typeNext, speed);
            } else {
                this.isTyping = false;
                this.enableInput();
            }
        };
        
        this.isTyping = true;
        this.disableInput();
        typeNext();
    }

    scrollToBottom() {
        this.chatArea.scrollTop = this.chatArea.scrollHeight;
    }

    disableInput() {
        this.messageInput.disabled = true;
        this.sendBtn.disabled = true;
        this.updateStatus('思考中...', '#ffbd2e');
    }

    enableInput() {
        this.messageInput.disabled = false;
        this.sendBtn.disabled = false;
        this.updateStatus('在线', '#28ca42');
        this.messageInput.focus();
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        this.addUserMessage(message);
        this.messageInput.value = '';
        
        // 检查是否是测试连接请求
        if (message === '测试连接' || message === 'test' || message === '测试') {
            this.testAPIConnection();
            return;
        }
        
        try {
            const response = await this.callDeepSeekAPI(message);
            this.addAIMessage(response);
        } catch (error) {
            console.error('API调用失败:', error);
            
            // 更详细的错误信息
            let errorMessage = '抱歉，我现在无法回答您的问题。';
            
            if (error.message.includes('401')) {
                errorMessage = 'API密钥验证失败，请检查DeepSeek API Key配置。';
            } else if (error.message.includes('403')) {
                errorMessage = 'API访问被拒绝，请检查API权限设置。';
            } else if (error.message.includes('429')) {
                errorMessage = 'API调用频率过高，请稍后再试。';
            } else if (error.message.includes('500')) {
                errorMessage = 'DeepSeek服务器错误，请稍后再试。';
            } else if (error.message.includes('网络')) {
                errorMessage = '网络连接失败，请检查网络状态。';
            } else if (error.message.includes('知识库')) {
                errorMessage = '知识库加载失败，请刷新页面重试。';
            }
            
            this.addAIMessage(errorMessage);
            this.addSystemMessage(`技术详情: ${error.message}`);
        }
    }

    async testAPIConnection() {
        this.updateStatus('测试中...', '#ffbd2e');
        
        try {
            const testResponse = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'user',
                            content: '你好'
                        }
                    ],
                    max_tokens: 10
                })
            });

            if (testResponse.ok) {
                this.addSystemMessage('✅ API连接测试成功！DeepSeek服务正常工作。');
                this.updateStatus('在线', '#28ca42');
            } else {
                const errorText = await testResponse.text();
                this.addSystemMessage(`❌ API连接测试失败：${testResponse.status} - ${errorText}`);
                this.updateStatus('离线', '#ff4444');
            }
        } catch (error) {
            this.addSystemMessage(`❌ API连接测试失败：${error.message}`);
            this.updateStatus('离线', '#ff4444');
        }
    }

    askQuickQuestion(question) {
        if (this.isTyping) return;
        
        this.messageInput.value = question;
        this.sendMessage();
    }

    async callDeepSeekAPI(userQuestion) {
        console.log('=== DeepSeek API 调用开始 ===');
        console.log('API Key:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'undefined');
        console.log('简历内容长度:', this.resumeContent ? this.resumeContent.length : 0);
        
        // 添加数据源验证
        if (!this.resumeContent || this.resumeContent === '简历内容暂时无法加载，请稍后再试。') {
            throw new Error('知识库未正确加载');
        }

        const systemPrompt = `你现在是刘翔本人，请以第一人称的角度回答面试官的问题。你的所有回答都必须严格基于提供的简历信息，不能引用其他任何资料或知识。

我的简历信息如下（唯一知识来源）：
${this.resumeContent}

严格要求：
1. 以"我"的身份回答，就像刘翔本人在回答面试官
2. 所有信息必须基于上述简历内容，绝对不要编造任何信息
3. 不能引用简历以外的任何资料、新闻、技术文档等
4. 如果简历中没有相关信息，明确说"这方面的信息我的简历中没有详细提到"
5. 回答要自然、真诚，符合面试场景
6. 用中文回答
7. 保持专业但不失亲和力的语调
8. 只基于简历内容回答，不要扩展其他知识`;

        const requestBody = {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userQuestion
                }
            ],
            temperature: 0.7,
            max_tokens: 1024,
            stream: false
        };

        console.log('请求URL:', 'https://api.deepseek.com/chat/completions');
        console.log('请求体:', JSON.stringify(requestBody, null, 2));

        try {
            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            console.log('响应状态:', response.status);
            console.log('响应头:', [...response.headers.entries()]);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API错误响应:', errorText);
                throw new Error(`API请求失败: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('API响应数据:', data);
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                console.log('=== DeepSeek API 调用成功 ===');
                return data.choices[0].message.content;
            } else {
                console.error('API返回格式错误:', data);
                throw new Error('API返回格式错误');
            }
        } catch (error) {
            console.error('=== DeepSeek API 调用失败 ===');
            console.error('错误详情:', error);
            throw error;
        }
    }
}

// 页面加载完成后初始化AI聊天功能
document.addEventListener('DOMContentLoaded', function() {
    // 只在AI问答页面初始化
    if (window.location.pathname.includes('ai_qa') || document.getElementById('terminalContainer')) {
        new AIChatManager();
    }
});

// 导出到全局作用域供其他模块使用
window.AIChatManager = AIChatManager; 