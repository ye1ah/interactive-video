class PlantingStrategy {
    constructor(container) {
        this.container = container;
        this.element = null;
        this.selectedOption = null;
        this.init();
    }

    init() {
        this.element = document.createElement('div');
        this.element.className = 'interactive-component planting-strategy';
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
        title.textContent = '🌱 请帮农民选择种植策略 👇';
        title.style.cssText = `
            margin: 0 0 20px 0;
            text-align: center;
            color: #333;
        `;

        const options = [
            {
                id: 'optionA',
                title: '选项A：先种满玉米和小麦',
                detail: '🌽玉米30㎡（450元） + 🌾小麦20㎡（320元） → 总收益770元（剩余10㎡未用）'
            },
            {
                id: 'optionB',
                title: '选项B：均分土地',
                detail: '🌾20㎡（320元） + 🌽20㎡（300元） + 🥬20㎡（240元） → 总收益860元'
            },
            {
                id: 'optionC',
                title: '选项C：先种小麦20㎡+玉米30㎡+青菜10㎡',
                detail: '🌾20㎡（320元） + 🌽30㎡（450元） + 🥬10㎡（120元） → 总收益890元（土地用满）'
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

            const titleDiv = document.createElement('div');
            titleDiv.textContent = option.title;
            titleDiv.style.cssText = `
                font-weight: bold;
                margin-bottom: 8px;
            `;

            const detailDiv = document.createElement('div');
            detailDiv.textContent = option.detail;
            detailDiv.style.cssText = `
                color: #666;
                font-size: 0.9em;
            `;

            optionElement.appendChild(titleDiv);
            optionElement.appendChild(detailDiv);

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
        this.element.appendChild(optionsContainer);
        this.element.appendChild(this.feedback);
        this.container.appendChild(this.element);
        this.hide();
    }

    handleOptionSelect(optionId) {
        this.selectedOption = optionId;
        const options = this.element.querySelectorAll('.option');
        const video = document.getElementById('video');
        
        options.forEach(option => {
            if (option.id === optionId) {
                option.style.borderColor = '#4CAF50';
                option.style.backgroundColor = '#E8F5E9';
                option.style.transform = 'translateY(-2px)';
                option.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';

                let feedbackMessage = '';
                if (optionId === 'optionA') {
                    feedbackMessage = '🌾 选择先种满玉米和小麦，虽然收益不错，但还有土地未利用哦~';
                } else if (optionId === 'optionB') {
                    feedbackMessage = '🌱 选择均分土地，收益比方案A更好，但还可以更优！';
                } else if (optionId === 'optionC') {
                    feedbackMessage = '🌟 太棒了！这是最优解！土地完全利用，收益最大化！';
                }

                this.feedback.textContent = feedbackMessage;
                this.feedback.style.color = '#4CAF50';
            } else {
                option.style.borderColor = '#ddd';
                option.style.backgroundColor = 'white';
                option.style.transform = 'translateY(0)';
                option.style.boxShadow = 'none';
            }
        });

        // 继续播放视频，但不隐藏交互组件
        video.play();
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }
} 