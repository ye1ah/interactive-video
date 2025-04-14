// 移动端主逻辑
class MobileApp {
    constructor() {
        this.video = document.getElementById('video');
        this.interactiveLayer = document.getElementById('interactiveLayer');
        this.isFullscreen = false;
        
        // 初始化交互组件
        this.plantingSimulation = new PlantingSimulation(this.interactiveLayer);
        this.codePlayground = new CodePlayground(this.interactiveLayer);
        this.exerciseInteraction = new ExerciseInteraction(this.interactiveLayer);
        this.aiChat = new AIChat(this.interactiveLayer);
        
        // 定义交互触发时间点（秒）
        this.interactionTriggers = {
            planting: 60,    // 种植模拟
            codeEditor: 90,  // 代码编辑器
            exercise: 120,   // 练习题
            aiChat: 150     // AI对话
        };
        
        // 跟踪已显示的交互
        this.shownInteractions = new Set();
        
        this.init();
    }

    init() {
        // 初始化视频事件监听
        this.video.addEventListener('timeupdate', () => this.handleVideoTimeUpdate());
        this.video.addEventListener('error', (e) => this.handleVideoError(e));
        this.video.addEventListener('stalled', () => this.handleVideoStalled());
        
        // 初始化全屏事件监听
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        
        // 初始化交互组件
        this.initInteractions();
    }

    initInteractions() {
        // 初始化所有交互组件，但保持隐藏状态
        this.plantingSimulation.hide();
        this.codePlayground.hide();
        this.exerciseInteraction.hide();
        this.aiChat.hide();
    }

    handleVideoTimeUpdate() {
        const currentTime = Math.floor(this.video.currentTime);
        
        // 检查是否到达交互触发时间点，且未显示过
        if (currentTime === this.interactionTriggers.planting && !this.shownInteractions.has('planting')) {
            this.plantingSimulation.show();
            this.shownInteractions.add('planting');
        } else if (currentTime === this.interactionTriggers.codeEditor && !this.shownInteractions.has('codeEditor')) {
            this.codePlayground.show();
            this.shownInteractions.add('codeEditor');
        } else if (currentTime === this.interactionTriggers.exercise && !this.shownInteractions.has('exercise')) {
            this.exerciseInteraction.show();
            this.shownInteractions.add('exercise');
        } else if (currentTime === this.interactionTriggers.aiChat && !this.shownInteractions.has('aiChat')) {
            this.aiChat.show();
            this.shownInteractions.add('aiChat');
        }
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