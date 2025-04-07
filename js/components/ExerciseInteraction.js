class ExerciseInteraction {
    constructor(container) {
        this.container = container;
        this.questions = [
            {
                type: "choice",
                question: "小熊有5元、2元、1元硬币，要买6元的蜂蜜，怎么付钱硬币最少？",
                options: [
                    "5元+1元 → 总硬币数2个",
                    "3个2元 → 总硬币数3个",
                    "6个1元 → 总硬币数6个"
                ],
                answer: 0,
                explanation: "✅ 正确！贪心策略：每次选择最大面值硬币。5元（剩余1元）→ 1元，共2个硬币。"
            },
            {
                type: "trueFalse",
                question: "贪心算法在所有问题中都能得到最优解。",
                answer: false,
                explanation: "❌ 错误！贪心算法只在特定条件下有效，例如硬币面值符合贪心条件时才适用"
            },
            {
                type: "choice",
                question: "小熊要分蛋糕给朋友们，如何分配才能让最多朋友吃饱？",
                options: ["优先满足胃口大的朋友", "优先满足胃口小的朋友", "随机分配"],
                answer: 1,
                explanation: "🍰 正确！贪心策略：先满足小胃口朋友 → 可以分给更多人"
            }
        ];
        this.currentQuestions = [];
        this.userAnswers = [];
        this.isActive = false;
        this.hasCompletedQuiz = false;
        this.lastScore = 0;
        
        this.initExercise();
    }

    initExercise() {
        // 创建习题容器
        this.exerciseContainer = document.createElement('div');
        this.exerciseContainer.style.cssText = `
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
            color: #4ECDC4;
            margin-bottom: 20px;
            text-align: center;
        `;
        title.textContent = '🐻小熊的贪心算法大挑战🐰';
        this.exerciseContainer.appendChild(title);

        // 创建问题容器
        this.questionsContainer = document.createElement('div');
        this.questionsContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            margin-bottom: 20px;
        `;
        this.exerciseContainer.appendChild(this.questionsContainer);

        // 创建提交按钮
        const submitButton = document.createElement('button');
        submitButton.style.cssText = `
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
            align-self: center;
        `;
        submitButton.textContent = '提交答案';
        submitButton.onclick = () => this.submitAnswers();
        this.exerciseContainer.appendChild(submitButton);

        this.container.appendChild(this.exerciseContainer);
    }

    show() {
        this.exerciseContainer.style.display = 'flex';
        this.startQuiz();
    }

    hide() {
        this.exerciseContainer.style.display = 'none';
    }

    startQuiz() {
        this.currentQuestions = [...this.questions].sort(() => Math.random() - 0.5).slice(0, 3);
        this.userAnswers = new Array(3).fill(null);
        this.hasCompletedQuiz = false;
        this.showQuestions();
    }

    showQuestions() {
        this.questionsContainer.innerHTML = '';
        this.currentQuestions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.style.cssText = `
                margin-bottom: 20px;
                padding: 15px;
                background: #f5f5f5;
                border-radius: 8px;
            `;

            const questionText = document.createElement('div');
            questionText.style.cssText = `
                font-size: 18px;
                margin-bottom: 15px;
                color: #333;
            `;
            questionText.textContent = `${index + 1}. ${q.question}`;
            questionDiv.appendChild(questionText);

            if (q.type === "choice") {
                q.options.forEach((opt, i) => {
                    const option = document.createElement('div');
                    option.style.cssText = `
                        padding: 10px;
                        margin: 5px 0;
                        background: white;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: background 0.3s;
                    `;
                    option.textContent = opt;
                    option.onclick = () => this.selectAnswer(index, i);
                    questionDiv.appendChild(option);
                });
            } else {
                const trueOption = document.createElement('div');
                trueOption.style.cssText = `
                    padding: 10px;
                    margin: 5px 0;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.3s;
                `;
                trueOption.textContent = '✅ 对';
                trueOption.onclick = () => this.selectAnswer(index, true);
                questionDiv.appendChild(trueOption);

                const falseOption = document.createElement('div');
                falseOption.style.cssText = `
                    padding: 10px;
                    margin: 5px 0;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.3s;
                `;
                falseOption.textContent = '❌ 错';
                falseOption.onclick = () => this.selectAnswer(index, false);
                questionDiv.appendChild(falseOption);
            }

            this.questionsContainer.appendChild(questionDiv);
        });
    }

    selectAnswer(qIndex, answer) {
        this.userAnswers[qIndex] = answer;
        const questionDiv = this.questionsContainer.children[qIndex];
        const options = questionDiv.querySelectorAll('div');
        options.forEach(opt => {
            opt.style.background = 'white';
        });
        options[answer + 1].style.background = '#e3f2fd';
    }

    submitAnswers() {
        if (this.userAnswers.includes(null)) {
            alert('请先完成所有题目哦！');
            return;
        }

        let score = 0;
        this.currentQuestions.forEach((q, index) => {
            const isCorrect = q.type === "choice" 
                ? this.userAnswers[index] === q.answer 
                : this.userAnswers[index] === q.answer;
            if (isCorrect) score++;

            const questionDiv = this.questionsContainer.children[index];
            const explanation = document.createElement('div');
            explanation.style.cssText = `
                margin-top: 10px;
                padding: 10px;
                background: ${isCorrect ? '#e8f5e9' : '#ffebee'};
                border-radius: 4px;
                color: ${isCorrect ? '#2e7d32' : '#c62828'};
            `;
            explanation.textContent = q.explanation;
            questionDiv.appendChild(explanation);
        });

        this.lastScore = score;
        this.hasCompletedQuiz = true;

        const resultDiv = document.createElement('div');
        resultDiv.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: #e3f2fd;
            border-radius: 8px;
            text-align: center;
        `;
        resultDiv.innerHTML = `
            <div style="font-size: 20px; margin-bottom: 10px;">得分：${score}分 ${"⭐".repeat(score)}</div>
            <div style="color: #666;">正确率：${((score / 3) * 100).toFixed(0)}%</div>
        `;
        this.questionsContainer.appendChild(resultDiv);
    }
} 