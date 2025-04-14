class CodePlayground {
    constructor(container) {
        this.container = container;
        this.element = null;
        this.codeEditor = null;
        this.outputArea = null;
        this.currentLanguage = 'python';
        this.init();
    }

    init() {
        this.element = document.createElement('div');
        this.element.className = 'interactive-component code-playground';
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
        title.textContent = '💻 代码编辑器';
        title.style.cssText = `
            margin: 0 0 20px 0;
            text-align: center;
            color: #333;
        `;

        // 语言选择器
        const languageSelector = document.createElement('div');
        languageSelector.style.cssText = `
            margin-bottom: 15px;
            text-align: center;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
        `;

        const languageLabel = document.createElement('span');
        languageLabel.textContent = '选择编程语言：';
        languageLabel.style.cssText = `
            margin-right: 10px;
            font-weight: bold;
            width: 100%;
        `;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
        `;

        const pythonButton = document.createElement('button');
        pythonButton.textContent = 'Python';
        pythonButton.style.cssText = `
            padding: 5px 15px;
            border: 2px solid #4CAF50;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 100px;
        `;

        const cppButton = document.createElement('button');
        cppButton.textContent = 'C++';
        cppButton.style.cssText = `
            padding: 5px 15px;
            border: 2px solid #ddd;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 100px;
        `;

        const jsButton = document.createElement('button');
        jsButton.textContent = 'JavaScript';
        jsButton.style.cssText = `
            padding: 5px 15px;
            border: 2px solid #ddd;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 100px;
        `;

        pythonButton.addEventListener('click', () => this.switchLanguage('python', pythonButton, cppButton, jsButton));
        cppButton.addEventListener('click', () => this.switchLanguage('cpp', pythonButton, cppButton, jsButton));
        jsButton.addEventListener('click', () => this.switchLanguage('javascript', pythonButton, cppButton, jsButton));

        languageSelector.appendChild(languageLabel);
        buttonsContainer.appendChild(pythonButton);
        buttonsContainer.appendChild(cppButton);
        buttonsContainer.appendChild(jsButton);
        languageSelector.appendChild(buttonsContainer);

        // 代码编辑器
        this.codeEditor = document.createElement('textarea');
        this.codeEditor.style.cssText = `
            width: 100%;
            height: 200px;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
            resize: vertical;
            margin-bottom: 15px;
        `;
        this.codeEditor.value = this.getDefaultCode('python');

        // 运行按钮
        const runButton = document.createElement('button');
        runButton.textContent = '运行代码';
        runButton.style.cssText = `
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        `;
        runButton.addEventListener('mouseover', () => {
            runButton.style.backgroundColor = '#45a049';
        });
        runButton.addEventListener('mouseout', () => {
            runButton.style.backgroundColor = '#4CAF50';
        });
        runButton.addEventListener('click', () => this.runCode());

        // 输出区域
        this.outputArea = document.createElement('div');
        this.outputArea.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 4px;
            background: #f5f5f5;
            min-height: 50px;
            font-family: monospace;
            white-space: pre-wrap;
        `;

        this.element.appendChild(title);
        this.element.appendChild(languageSelector);
        this.element.appendChild(this.codeEditor);
        this.element.appendChild(runButton);
        this.element.appendChild(this.outputArea);
        this.container.appendChild(this.element);
        this.hide();
    }

    switchLanguage(language, pythonButton, cppButton, jsButton) {
        this.currentLanguage = language;
        this.codeEditor.value = this.getDefaultCode(language);
        
        // 重置所有按钮样式
        pythonButton.style.borderColor = '#ddd';
        pythonButton.style.backgroundColor = 'white';
        cppButton.style.borderColor = '#ddd';
        cppButton.style.backgroundColor = 'white';
        jsButton.style.borderColor = '#ddd';
        jsButton.style.backgroundColor = 'white';
        
        // 设置当前选中语言的按钮样式
        if (language === 'python') {
            pythonButton.style.borderColor = '#4CAF50';
            pythonButton.style.backgroundColor = '#E8F5E9';
        } else if (language === 'cpp') {
            cppButton.style.borderColor = '#4CAF50';
            cppButton.style.backgroundColor = '#E8F5E9';
        } else {
            jsButton.style.borderColor = '#4CAF50';
            jsButton.style.backgroundColor = '#E8F5E9';
        }
    }

    getDefaultCode(language) {
        if (language === 'python') {
            return `# 贪心算法实现
def greedy_planting(land_area):
    # 作物收益表
    crops = [
        {'name': '玉米', 'area': 30, 'profit': 450},
        {'name': '小麦', 'area': 20, 'profit': 320},
        {'name': '青菜', 'area': 10, 'profit': 120}
    ]
    
    # 按单位面积收益排序
    crops.sort(key=lambda x: x['profit']/x['area'], reverse=True)
    
    total_profit = 0
    remaining_area = land_area
    
    for crop in crops:
        if remaining_area >= crop['area']:
            total_profit += crop['profit']
            remaining_area -= crop['area']
            print(f"种植{crop['name']} {crop['area']}㎡，收益{crop['profit']}元")
    
    print(f"\\n总收益：{total_profit}元")
    print(f"剩余土地：{remaining_area}㎡")

# 测试60㎡的土地
greedy_planting(60)`;
        } else if (language === 'cpp') {
            return `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Crop {
    string name;
    int area;
    int profit;
};

bool compareProfit(const Crop& a, const Crop& b) {
    return (a.profit / a.area) > (b.profit / b.area);
}

void greedyPlanting(int landArea) {
    vector<Crop> crops = {
        {"玉米", 30, 450},
        {"小麦", 20, 320},
        {"青菜", 10, 120}
    };
    
    sort(crops.begin(), crops.end(), compareProfit);
    
    int totalProfit = 0;
    int remainingArea = landArea;
    
    for (const auto& crop : crops) {
        if (remainingArea >= crop.area) {
            totalProfit += crop.profit;
            remainingArea -= crop.area;
            cout << "种植" << crop.name << " " << crop.area << "㎡，收益" << crop.profit << "元" << endl;
        }
    }
    
    cout << "\\n总收益：" << totalProfit << "元" << endl;
    cout << "剩余土地：" << remainingArea << "㎡" << endl;
}

int main() {
    // 测试60㎡的土地
    greedyPlanting(60);
    return 0;
}`;
        } else {
            return `// 贪心算法实现
function greedyPlanting(landArea) {
    // 作物收益表
    const crops = [
        {name: '玉米', area: 30, profit: 450},
        {name: '小麦', area: 20, profit: 320},
        {name: '青菜', area: 10, profit: 120}
    ];
    
    // 按单位面积收益排序
    crops.sort((a, b) => (b.profit / b.area) - (a.profit / a.area));
    
    let totalProfit = 0;
    let remainingArea = landArea;
    
    for (const crop of crops) {
        if (remainingArea >= crop.area) {
            totalProfit += crop.profit;
            remainingArea -= crop.area;
            console.log(\`种植\${crop.name} \${crop.area}㎡，收益\${crop.profit}元\`);
        }
    }
    
    console.log(\`\\n总收益：\${totalProfit}元\`);
    console.log(\`剩余土地：\${remainingArea}㎡\`);
}

// 测试60㎡的土地
greedyPlanting(60);`;
        }
    }

    runCode() {
        const code = this.codeEditor.value;
        this.outputArea.innerHTML = '正在编译执行...';
        
        // 模拟编译执行过程
        setTimeout(() => {
            if (this.currentLanguage === 'python') {
                this.simulatePythonExecution(code);
            } else if (this.currentLanguage === 'cpp') {
                this.simulateCppExecution(code);
            } else {
                this.simulateJavaScriptExecution(code);
            }
        }, 1000);
    }

    simulatePythonExecution(code) {
        try {
            // 模拟Python执行结果
            this.outputArea.innerHTML = `种植玉米 30㎡，收益450元
种植小麦 20㎡，收益320元
种植青菜 10㎡，收益120元

总收益：890元
剩余土地：0㎡`;
            this.outputArea.style.color = '#4CAF50';
        } catch (error) {
            this.outputArea.innerHTML = `执行错误：${error.message}`;
            this.outputArea.style.color = '#f44336';
        }
    }

    simulateCppExecution(code) {
        try {
            // 模拟C++执行结果
            this.outputArea.innerHTML = `种植玉米 30㎡，收益450元
种植小麦 20㎡，收益320元
种植青菜 10㎡，收益120元

总收益：890元
剩余土地：0㎡`;
            this.outputArea.style.color = '#4CAF50';
        } catch (error) {
            this.outputArea.innerHTML = `编译错误：${error.message}`;
            this.outputArea.style.color = '#f44336';
        }
    }

    simulateJavaScriptExecution(code) {
        try {
            // 模拟JavaScript执行结果
            this.outputArea.innerHTML = `种植玉米 30㎡，收益450元
种植小麦 20㎡，收益320元
种植青菜 10㎡，收益120元

总收益：890元
剩余土地：0㎡`;
            this.outputArea.style.color = '#4CAF50';
        } catch (error) {
            this.outputArea.innerHTML = `执行错误：${error.message}`;
            this.outputArea.style.color = '#f44336';
        }
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }
} 