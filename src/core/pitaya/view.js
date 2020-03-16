export let View = {
    CONTAIN: function() {
        var self = this;
        self.radioX = self.radioY = Math.min(self.winWidth / self.designWidth, self.winHeight / self.designHeight);
        self.canvasWidth = self.stageWidth = self.designWidth * self.radioX;
        self.canvasHeight = self.stageHeight = self.designHeight * self.radioY;
    },
    COVER: function() {
        var self = this;
        self.radioX = self.radioY = Math.max(self.winWidth / self.designWidth, self.winHeight / self.designHeight);
        self.canvasWidth = self.stageWidth = self.designWidth * self.radioX;
        self.canvasHeight = self.stageHeight = self.designHeight * self.radioY;
    },
    FILL: function() {
        var self = this;
        self.canvasWidth = self.stageWidth = self.winWidth;
        self.canvasHeight = self.stageHeight = self.winHeight;
    },
    FIXED_HEIGHT: function() {
        var self = this;
        self.radioX = self.radioY = self.winHeight / self.designHeight;
        self.canvasWidth = self.stageWidth = self.winWidth / self.radioX;
        self.canvasHeight = self.stageHeight = self.winHeight;
    },
    FIXED_WIDTH: function() {
        var self = this;
        self.radioX = self.radioY = self.winWidth / self.designWidth;
        self.canvasWidth = self.stageWidth = self.winWidth;
        self.canvasHeight = self.stageHeight = self.winHeight / self.radioY;
    },
    _setPolicy: function(mode) {
        var self = this;
        self._sizePolicy = mode;
    },
    _setSize: function() {
        let self = this;

        let width = self.container.clientWidth,
            height = self.container.clientHeight;
        self.winWidth = Math.max(width, height); // 屏幕窗口宽度
        self.winHeight = Math.min(width, height); // 屏幕窗口高度
        self.isPortrait = width <= height;

        self._sizePolicy();

        if (self.isPortrait) {
            // 舞台旋转
            self.app.stage.x = self.canvasHeight;

            self.app.stage.rotation = Math.PI / 2;

            // canvas宽高重渲染
            self.canvasWidth = self.stageHeight;
            self.canvasHeight = self.stageWidth;
        } else {
            self.app.stage.x = 0;
            self.app.stage.rotation = 0;
        }

        self.app.view.setAttribute('width', width);
        self.app.view.setAttribute('height', height);
        // style += '-webkit-transform: scale(' + scaleX + ', ' + scaleY + ') translate(-50%,-50%);';
        // self.app.view.style.cssText += style;
    },

    /**
     * 设置缩放适配模式
     * @param app {obj} 应用对象
     * @param designWidth {number} 设计稿宽度
     * @param designHeight {number} 设计稿高度
     * @param mode {obj} 内置五种缩放适配模式之一
     * @param resizeCallback resize回调函数
     */
    setViewMode: function(app, designWidth, designHeight, mode, resizeCallback) {
        var self = this;
        self.app = app;
        self.container = app.view.parentNode;
        self.designWidth = designWidth; // 设计稿宽度
        self.designHeight = designHeight; // 设计稿高度

        self._setPolicy(mode);
        self._setSize();

        var resizeHandler = function() {
            self._setSize();
            resizeCallback && resizeCallback();
        };
        window.onresize = resizeHandler;
    },
};
