class PlantingPlan {
    constructor(container) {
        this.container = container;
        this.element = null;
        this.selectedOption = null;
        this.correctAnswer = 'optionC'; // 正确答案是选项C
        this.init();
    }

    init() {
        this.element = document.createElement('div');
        this.element.className = 'interactive-component planting-plan';
        this.element.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            background: #f5f5f5;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            padding: 20px;
            box-sizing: border-box;
            gap: 20px;
        `;

        const title = document.createElement('h2');
        title.textContent = '🌱 种植方案选择题';
        title.style.cssText = `
            margin: 0 0 20px 0;
            text-align: center;
            color: #333;
        `;

        const description = document.createElement('p');
        description.textContent = '请选择完全符合规则的种植方案：';
        description.style.cssText = `
            margin: 0 0 20px 0;
            text-align: center;
            color: #666;
        `;

        const options = [
            {
                id: 'optionA',
                text: 'A) 玉米35m²'
            },
            {
                id: 'optionB',
                text: 'B) 小麦20m² + 玉米30m² + 青菜15m²'
            },
            {
                id: 'optionC',
                text: 'C) 小麦20m² + 玉米30m² + 青菜10m²'
            },
            {
                id: 'optionD',
                text: 'D) 小麦15m² + 玉米40m²'
            }
        ];

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        optionsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.id = option.id;
            optionElement.style.cssText = `
                padding: 15px;
                border: 2px solid #ddd;
                border-radius: 8px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
            `;

            const optionText = document.createElement('div');
            optionText.textContent = option.text;
            optionText.style.cssText = `
                font-weight: bold;
            `;

            optionElement.appendChild(optionText);

            optionElement.addEventListener('mouseover', () => {
                optionElement.style.borderColor = '#4CAF50';
                optionElement.style.transform = 'translateY(-2px)';
                optionElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            });

            optionElement.addEventListener('mouseout', () => {
                if (this.selectedOption !== option.id) {
                    optionElement.style.borderColor = '#ddd';
                    optionElement.style.transform = 'translateY(0)';
                    optionElement.style.boxShadow = 'none';
                }
            });

            optionElement.addEventListener('click', () => this.handleOptionSelect(option.id));

            optionsContainer.appendChild(optionElement);
        });

        this.feedback = document.createElement('div');
        this.feedback.style.cssText = `
            margin-top: 20px;
            text-align: center;
            font-weight: bold;
            min-height: 24px;
        `;

        this.element.appendChild(title);
        this.element.appendChild(description);
        this.element.appendChild(optionsContainer);
        this.element.appendChild(this.feedback);
        this.container.appendChild(this.element);
        this.hide();
    }

    handleOptionSelect(optionId) {
        this.selectedOption = optionId;
        const options = this.element.querySelectorAll('.option');
        const video = document.getElementById('lesson-video');
        
        options.forEach(option => {
            if (option.id === optionId) {
                if (optionId === this.correctAnswer) {
                    option.style.borderColor = '#4CAF50';
                    option.style.backgroundColor = '#E8F5E9';
                    option.style.transform = 'translateY(-2px)';
                    option.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    
                    this.feedback.innerHTML = '🌟 太棒了！完全符合规则！让我们继续探索最优解吧！';
                    this.feedback.style.color = '#4CAF50';
                    
                    setTimeout(() => {
                        video.play();
                    }, 2000);
                } else {
                    option.style.borderColor = '#f44336';
                    option.style.backgroundColor = '#FFEBEE';
                    option.style.transform = 'translateY(-2px)';
                    option.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    
                    let errorMessage = '';
                    if (optionId === 'optionA') errorMessage = '玉米种植面积不能超过30m²哦~';
                    else if (optionId === 'optionB') errorMessage = '总种植面积不能超过60m²呢~';
                    else if (optionId === 'optionD') errorMessage = '玉米种植面积不能超过30m²哦~';
                    
                    this.feedback.innerHTML = `
                        <div>🤔 ${errorMessage}</div>
                        <div>⏳ 即将跳转回1分50秒重新观看规则说明...</div>
                    `;
                    this.feedback.style.color = '#f44336';
                    
                    setTimeout(() => {
                        this.hide();
                        video.currentTime = 110; // 跳转到1分50秒
                        video.play();
                    }, 3000);
                }
            } else {
                option.style.borderColor = '#ddd';
                option.style.backgroundColor = 'white';
                option.style.transform = 'translateY(0)';
                option.style.boxShadow = 'none';
            }
        });
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }
} 