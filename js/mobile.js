// 移动端主逻辑
class MobileApp {
    constructor() {
        this.video = document.getElementById('lesson-video');
        this.interactiveLayer = document.getElementById('interactiveLayer');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        this.networkStatus = document.querySelector('.network-status');
        this.isFullscreen = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // 网络状态监听
        this.setupNetworkMonitoring();
        
        // 添加视频事件监听
        this.setupVideoEventListeners();
        
        // 预加载设置
        this.video.preload = 'metadata';
        
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

    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.networkStatus.style.display = 'none';
            if (this.video.paused && this.video.currentTime > 0) {
                this.retryVideoLoad();
            }
        });

        window.addEventListener('offline', () => {
            this.networkStatus.style.display = 'block';
        });
    }

    setupVideoEventListeners() {
        this.video.addEventListener('loadstart', () => this.handleLoadStart());
        this.video.addEventListener('waiting', () => this.handleWaiting());
        this.video.addEventListener('canplay', () => this.handleCanPlay());
        this.video.addEventListener('error', (e) => this.handleVideoError(e));
        this.video.addEventListener('stalled', () => this.handleVideoStalled());
        this.video.addEventListener('timeupdate', () => this.handleTimeUpdate());
        this.video.addEventListener('progress', () => this.handleProgress());
    }

    handleLoadStart() {
        this.loadingSpinner.style.display = 'block';
        document.getElementById('video-container').classList.add('loading');
        console.log('视频开始加载');
    }

    handleWaiting() {
        this.loadingSpinner.style.display = 'block';
        document.getElementById('video-container').classList.add('loading');
    }

    handleCanPlay() {
        this.loadingSpinner.style.display = 'none';
        document.getElementById('video-container').classList.remove('loading');
        this.retryCount = 0; // 重置重试计数
        console.log('视频可以播放');
    }

    handleProgress() {
        // 检查视频缓冲进度
        if (this.video.buffered.length > 0) {
            const bufferedEnd = this.video.buffered.end(this.video.buffered.length - 1);
            const duration = this.video.duration;
            console.log(`已缓冲: ${Math.round((bufferedEnd / duration) * 100)}%`);
        }
    }

    handleVideoError(e) {
        this.loadingSpinner.style.display = 'none';
        const error = this.video.error;
        let message = '视频播放出错';
        
        switch (error.code) {
            case 1:
                message = '视频加载被中断';
                break;
            case 2:
                message = '网络错误导致视频下载失败';
                break;
            case 3:
                message = '视频解码失败';
                break;
            case 4:
                message = '视频格式不支持';
                break;
        }
        
        console.error('视频错误:', message);
        
        // 显示错误信息
        const errorDisplay = document.createElement('div');
        errorDisplay.className = 'video-error-message';
        errorDisplay.textContent = message;
        
        // 添加重试按钮
        const retryButton = document.createElement('button');
        retryButton.textContent = '重试';
        retryButton.onclick = () => this.retryVideoLoad();
        errorDisplay.appendChild(retryButton);
        
        this.video.parentNode.appendChild(errorDisplay);
    }

    handleVideoStalled() {
        console.log('视频加载停滞');
        this.loadingSpinner.style.display = 'block';
        
        if (this.retryCount < this.maxRetries) {
            this.retryVideoLoad();
        } else {
            this.networkStatus.textContent = '视频加载失败，请检查网络连接';
            this.networkStatus.style.display = 'block';
        }
    }

    retryVideoLoad() {
        this.retryCount++;
        console.log(`尝试重新加载视频（第 ${this.retryCount} 次）`);
        
        // 移除现有的错误消息
        const errorMessage = document.querySelector('.video-error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
        
        // 记住当前播放位置
        const currentTime = this.video.currentTime;
        
        // 重新加载视频
        this.video.load();
        
        // 恢复播放位置
        this.video.currentTime = currentTime;
        
        // 如果之前在播放，则继续播放
        if (!this.video.paused) {
            this.video.play().catch(e => console.error('重新播放失败:', e));
        }
    }
}

// 初始化应用
window.addEventListener('load', () => {
    new MobileApp();
}); 