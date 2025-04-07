class PlantingSimulation {
    constructor(container) {
        this.container = container;
        this.crops = new Map();
        this.totalLand = 60; // 总土地面积60平米
        this.usedLand = {    // 每种作物已使用的面积
            wheat: 0,    // 小麦
            corn: 0,     // 玉米
            vegetable: 0 // 青菜
        };
        this.totalProfit = 0; // 总收益
        this.cropData = {
            wheat: { 
                profit: 320, 
                maxArea: 20, 
                profitPerArea: 16, // 320/20 = 16元/平方米
                name: '小麦',
                emoji: '🌾'
            },
            corn: { 
                profit: 180, 
                maxArea: 15, 
                profitPerArea: 12, // 180/15 = 12元/平方米
                name: '玉米',
                emoji: '🌽'
            },
            vegetable: { 
                profit: 450, 
                maxArea: 30, 
                profitPerArea: 15, // 450/30 = 15元/平方米
                name: '青菜',
                emoji: '🥬'
            }
        };
        
        this.initSimulator();
    }

    initSimulator() {
        // 创建模拟器容器
        const simulator = document.createElement('div');
        simulator.className = 'planting-simulator';
        simulator.style.cssText = `
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

        // 修改控制面板样式
        const controlPanel = document.createElement('div');
        controlPanel.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
            margin-bottom: 10px;
        `;

        // 创建作物选择器和面积输入的容器
        const inputGroup = document.createElement('div');
        inputGroup.style.cssText = `
            display: flex;
            gap: 10px;
            flex: 1;
            min-width: 200px;
        `;

        // 创建作物选择器
        const cropSelector = document.createElement('select');
        cropSelector.style.cssText = `
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
            flex: 1;
        `;
        
        // 添加作物选项
        Object.entries(this.cropData).forEach(([type, data]) => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = `${data.emoji} ${data.name} (¥${data.profitPerArea}/㎡)`;
            cropSelector.appendChild(option);
        });

        // 创建面积输入框
        const areaInput = document.createElement('input');
        areaInput.type = 'number';
        areaInput.min = '1';
        areaInput.value = '1';
        areaInput.style.cssText = `
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 80px;
            text-align: center;
        `;

        // 创建按钮容器
        const buttonGroup = document.createElement('div');
        buttonGroup.style.cssText = `
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        `;

        // 创建种植按钮
        const plantButton = document.createElement('button');
        plantButton.textContent = '种植';
        plantButton.style.cssText = `
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = `
            padding: 8px 16px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        closeButton.onclick = () => this.hide();

        // 修改信息显示区域样式
        const infoDisplay = document.createElement('div');
        infoDisplay.style.cssText = `
            padding: 15px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            height: 150px;
            overflow-y: auto;
        `;

        // 修改种植区域样式
        const plantingArea = document.createElement('div');
        plantingArea.style.cssText = `
            flex: 1;
            min-height: 300px;
            background: #e8f5e9;
            border-radius: 4px;
            position: relative;
            overflow: hidden;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows: repeat(6, 1fr);
            gap: 2px;
            padding: 10px;
        `;

        // 组装控制面板
        inputGroup.appendChild(cropSelector);
        inputGroup.appendChild(areaInput);
        buttonGroup.appendChild(plantButton);
        buttonGroup.appendChild(closeButton);
        controlPanel.appendChild(inputGroup);
        controlPanel.appendChild(buttonGroup);

        // 组装模拟器
        simulator.appendChild(controlPanel);
        simulator.appendChild(infoDisplay);
        simulator.appendChild(plantingArea);
        this.container.appendChild(simulator);

        // 保存引用
        this.simulator = simulator;
        this.cropSelector = cropSelector;
        this.areaInput = areaInput;
        this.plantButton = plantButton;
        this.infoDisplay = infoDisplay;
        this.plantingArea = plantingArea;

        // 添加事件监听
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.plantButton.onclick = () => this.plantCrop();
        this.cropSelector.onchange = () => this.updateAreaInput();
        this.updateInfo();
    }

    updateAreaInput() {
        const selectedCrop = this.cropSelector.value;
        const cropData = this.cropData[selectedCrop];
        const remainingArea = cropData.maxArea - this.usedLand[selectedCrop];
        this.areaInput.max = remainingArea;
        this.areaInput.value = Math.min(parseInt(this.areaInput.value) || 1, remainingArea);
    }

    plantCrop() {
        const cropType = this.cropSelector.value;
        const area = parseInt(this.areaInput.value);
        const cropData = this.cropData[cropType];

        // 检查总面积限制
        const totalUsedLand = Object.values(this.usedLand).reduce((a, b) => a + b, 0);
        if (totalUsedLand + area > this.totalLand) {
            this.showError(`总种植面积不能超过${this.totalLand}平方米`);
            return;
        }

        // 检查作物面积限制
        if (this.usedLand[cropType] + area > cropData.maxArea) {
            this.showError(`${cropData.name}的种植面积不能超过${cropData.maxArea}平方米`);
            return;
        }

        // 创建作物元素
        const crop = document.createElement('div');
        crop.className = 'crop';
        crop.style.cssText = `
            background: #81c784;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            position: relative;
            transition: all 0.3s;
            font-size: 24px;
            padding: 5px;
        `;
        crop.textContent = this.cropData[cropType].emoji;

        // 添加面积标签
        const areaLabel = document.createElement('div');
        areaLabel.textContent = `${area}㎡`;
        areaLabel.style.cssText = `
            position: absolute;
            bottom: 5px;
            right: 5px;
            font-size: 12px;
            background: rgba(0,0,0,0.5);
            padding: 2px 4px;
            border-radius: 2px;
            z-index: 1;
        `;
        crop.appendChild(areaLabel);

        // 添加到种植区域
        this.plantingArea.appendChild(crop);

        // 更新数据
        this.usedLand[cropType] += area;
        this.totalProfit += area * cropData.profitPerArea;
        this.crops.set(crop, { type: cropType, area });

        // 更新信息显示
        this.updateInfo();

        // 检查是否是最优种植
        if (this.checkOptimalPlanting(cropType)) {
            this.showOptimalFeedback(crop);
        }
    }

    checkOptimalPlanting(cropType) {
        const profitPerArea = this.cropData[cropType].profitPerArea;
        const maxProfitPerArea = Math.max(...Object.values(this.cropData).map(crop => crop.profitPerArea));
        return profitPerArea === maxProfitPerArea;
    }

    showOptimalFeedback(crop) {
        const feedback = document.createElement('div');
        feedback.textContent = '最优选择！';
        feedback.style.cssText = `
            position: absolute;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            animation: fadeOut 2s forwards;
            z-index: 2;
        `;
        crop.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }

    showError(message) {
        const error = document.createElement('div');
        error.textContent = message;
        error.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f44336;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1000;
            animation: fadeOut 2s forwards;
        `;
        document.body.appendChild(error);
        setTimeout(() => error.remove(), 2000);
    }

    updateInfo() {
        const totalUsedLand = Object.values(this.usedLand).reduce((a, b) => a + b, 0);
        this.infoDisplay.innerHTML = `
            <div style="margin-bottom: 10px;">
                <strong>土地使用情况：</strong>
                <span style="color: ${totalUsedLand > this.totalLand ? '#f44336' : '#4CAF50'}">
                    ${totalUsedLand}/${this.totalLand} 平方米
                </span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>总收益：</strong>
                ¥${this.totalProfit}
            </div>
            <div>
                <strong>作物收益/㎡：</strong>
                ${Object.entries(this.cropData).map(([type, data]) => `
                    <div style="margin-top: 5px; display: flex; align-items: center; gap: 5px;">
                        <span style="font-size: 20px;">${data.emoji}</span>
                        <span>${data.name}: ¥${data.profitPerArea}</span>
                        <span style="color: ${this.usedLand[type] >= data.maxArea ? '#f44336' : '#4CAF50'}">
                            (已使用: ${this.usedLand[type]}/${data.maxArea}㎡)
                        </span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    show() {
        this.simulator.style.display = 'flex';
    }

    hide() {
        this.simulator.style.display = 'none';
    }
} 