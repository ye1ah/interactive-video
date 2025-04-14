// 移动端主逻辑
class MobileApp {
    constructor() {
        this.video = document.getElementById('video');
        this.interactiveLayer = document.getElementById('interactiveLayer');
        this.isFullscreen = false;
        
        // 初始化交互组件
        this.plantingStrategy = new PlantingStrategy(this.interactiveLayer);
        this.plantingPlan = new PlantingPlan(this.interactiveLayer);
        this.plantingSimulation = new PlantingSimulation(this.interactiveLayer);
        this.codePlayground = new CodePlayground(this.interactiveLayer);
        this.exerciseInteraction = new ExerciseInteraction(this.interactiveLayer);
        this.aiChat = new AIChat(this.interactiveLayer);
        
        // 定义交互触发时间点（秒）
        this.interactionTriggers = {
            plantingStrategy: 52,      // 种植策略选择题
            plantingPlan: 127.73,      // 种植方案选择题
            plantingSimulation: 209.75, // 农场模拟器
            codeEditor: 383,           // 代码编辑器
            exercise: 421.5            // 习题组件
        };
        
        // 跟踪已显示的交互
        this.shownInteractions = new Set();
        
        this.init();
    }

    init() {
        // 初始化视频事件监听
        this.video.addEventListener('timeupdate', () => this.handleTimeUpdate());
        this.video.addEventListener('error', (e) => this.handleVideoError(e));
        this.video.addEventListener('stalled', () => this.handleVideoStalled());
        
        // 初始化全屏事件监听
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        
        // 为 interactiveLayer 添加底部内边距，避免被 AI 助手遮挡
        this.interactiveLayer.style.paddingBottom = '100px'; 

        // 初始化时隐藏所有交互组件（除了AI问答）
        this.plantingStrategy.hide();
        this.plantingPlan.hide();
        this.plantingSimulation.hide();
        this.codePlayground.hide();
        this.exerciseInteraction.hide();
        
        // 只显示AI问答组件
        this.aiChat.show();
        this.aiChat.element.style.zIndex = '1001';
    }

    handleTimeUpdate() {
        const currentTime = this.video.currentTime;
        
        // 检查是否需要触发交互
        for (const [interaction, triggerTime] of Object.entries(this.interactionTriggers)) {
            if (currentTime >= triggerTime && !this.shownInteractions.has(interaction)) {
                this.video.pause(); // 暂停视频
                this.showInteraction(interaction);
                this.shownInteractions.add(interaction);
            }
        }
    }

    showInteraction(interaction) {
        // 不再隐藏其他交互组件
        // 只显示当前触发的交互组件
        switch(interaction) {
            case 'plantingStrategy':
                this.plantingStrategy.show();
                break;
            case 'plantingPlan':
                this.plantingPlan.show();
                break;
            case 'plantingSimulation':
                this.plantingSimulation.show();
                break;
            case 'codeEditor':
                this.codePlayground.show();
                break;
            case 'exercise':
                this.exerciseInteraction.show();
                break;
        }

        // 确保AI问答始终显示在最上层
        this.aiChat.element.style.zIndex = '1001';
    }

    handleFullscreenChange() {
        this.isFullscreen = !this.isFullscreen;
        if (this.isFullscreen) {
            this.video.requestFullscreen();
        }
    }

    handleVideoError(e) {
        console.error('视频加载错误:', e);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = '视频加载失败，请刷新页面重试';
        this.video.parentNode.appendChild(errorMessage);
    }

    handleVideoStalled() {
        console.log('视频加载停滞，尝试重新加载...');
        this.video.load();
    }
}

// 初始化应用
window.addEventListener('load', () => {
    new MobileApp();
}); 