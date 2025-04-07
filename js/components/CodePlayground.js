class CodePlayground {
    constructor(container) {
        this.container = container;
        this.currentLanguage = 'javascript';
        this.currentTheme = 'dark';
        this.initEditor();
    }

    initEditor() {
        // 创建编辑器容器
        this.editorContainer = document.createElement('div');
        this.editorContainer.style.cssText = `
            width: 100%;
            background: #2d2d2d;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: none;
            flex-direction: column;
            box-sizing: border-box;
            margin-bottom: 20px;
        `;

        // 创建工具栏
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            padding: 10px;
            background: #1e1e1e;
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid #444;
        `;

        // 创建语言选择器
        const languageSelect = document.createElement('select');
        languageSelect.style.cssText = `
            padding: 8px;
            background: #3d3d3d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        const languages = [
            { value: 'javascript', name: 'JavaScript' },
            { value: 'python', name: 'Python' },
            { value: 'cpp', name: 'C++' }
        ];
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.value;
            option.textContent = lang.name;
            languageSelect.appendChild(option);
        });
        languageSelect.value = this.currentLanguage;
        languageSelect.onchange = () => {
            this.currentLanguage = languageSelect.value;
            this.codeArea.value = this.getDefaultCode(this.currentLanguage);
            this.adjustCodeAreaHeight();
        };
        toolbar.appendChild(languageSelect);

        // 创建运行按钮
        const runButton = document.createElement('button');
        runButton.style.cssText = `
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        `;
        runButton.textContent = '运行';
        runButton.onclick = () => this.executeCode();
        toolbar.appendChild(runButton);

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.style.cssText = `
            margin-left: auto;
            padding: 8px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        closeButton.textContent = '×';
        closeButton.onclick = () => this.hide();
        toolbar.appendChild(closeButton);

        this.editorContainer.appendChild(toolbar);

        // 创建代码区域
        this.codeArea = document.createElement('textarea');
        this.codeArea.style.cssText = `
            padding: 15px;
            background: #1e1e1e;
            color: #d4d4d4;
            border: none;
            outline: none;
            resize: none;
            font-family: 'Consolas', monospace;
            font-size: 14px;
            line-height: 1.5;
            tab-size: 4;
            min-height: 200px;
            overflow-y: auto;
        `;
        this.codeArea.value = this.getDefaultCode(this.currentLanguage);
        this.codeArea.addEventListener('input', () => this.adjustCodeAreaHeight());
        this.editorContainer.appendChild(this.codeArea);

        // 创建输出区域
        this.outputArea = document.createElement('div');
        this.outputArea.style.cssText = `
            padding: 15px;
            background: #1e1e1e;
            color: #d4d4d4;
            border-top: 1px solid #444;
            font-family: 'Consolas', monospace;
            font-size: 14px;
            line-height: 1.5;
            max-height: 200px;
            overflow-y: auto;
        `;
        this.editorContainer.appendChild(this.outputArea);

        this.container.appendChild(this.editorContainer);
        this.adjustCodeAreaHeight();
    }

    adjustCodeAreaHeight() {
        const lineHeight = 21; // 14px font-size * 1.5 line-height
        const minHeight = 200;
        const padding = 30; // 15px top + 15px bottom
        const lines = this.codeArea.value.split('\n').length;
        const newHeight = Math.max(minHeight, lines * lineHeight + padding);
        this.codeArea.style.height = `${newHeight}px`;
    }

    getDefaultCode(language) {
        switch (language) {
            case 'javascript':
                return `// 计算矩形面积
function calculateArea(width, height) {
    console.log("计算过程：");
    console.log("宽度 =", width);
    console.log("高度 =", height);
    const area = width * height;
    console.log("面积 =", area);
    return { area: area };
}

// 测试代码
const result = calculateArea(5, 3);
console.log("返回结果：", result);`;
            case 'python':
                return `# 计算矩形面积
def calculate_area(width, height):
    print("计算过程：")
    print("宽度 =", width)
    print("高度 =", height)
    area = width * height
    print("面积 =", area)
    return {"area": area}

# 测试代码
result = calculate_area(5, 3)
print("返回结果：", result)`;
            case 'cpp':
                return `// 计算矩形面积
#include <iostream>
using namespace std;

struct Result {
    int area;
};

Result calculateArea(int width, int height) {
    cout << "计算过程：" << endl;
    cout << "宽度 = " << width << endl;
    cout << "高度 = " << height << endl;
    int area = width * height;
    cout << "面积 = " << area << endl;
    return {area};
}

int main() {
    Result result = calculateArea(5, 3);
    cout << "返回结果：面积 = " << result.area << endl;
    return 0;
}`;
            default:
                return '';
        }
    }

    executeCode() {
        const code = this.codeArea.value;
        this.outputArea.innerHTML = '';

        try {
            // 创建一个安全的执行环境
            const safeEval = new Function(`
                let console = {
                    log: (...args) => {
                        window._lastConsoleOutput = args.map(arg => 
                            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                        ).join(' ');
                    }
                };
                try {
                    ${code}
                    return window._lastConsoleOutput;
                } catch (e) {
                    throw new Error(e.message);
                }
            `);

            // 执行代码
            const result = safeEval();
            
            // 显示执行结果
            this.outputArea.innerHTML = `
                <div style="color: #4CAF50;">执行成功！</div>
                <div style="margin-top: 10px;">输出：</div>
                <div style="white-space: pre-wrap;">${result}</div>
            `;
        } catch (error) {
            this.outputArea.innerHTML = `
                <div style="color: #f44336;">执行错误：</div>
                <div style="margin-top: 10px; color: #ff9800;">${error.message}</div>
            `;
        }
    }

    show() {
        this.editorContainer.style.display = 'flex';
        this.codeArea.focus();
    }

    hide() {
        this.editorContainer.style.display = 'none';
    }
} 