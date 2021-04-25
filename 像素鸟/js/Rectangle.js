class Rectangle {
    /**
     * 矩形类的 构造函数
     * @param {Number} width 矩形的宽度
     * @param {Number} height 矩形的高度
     * @param {Number} left 矩形的横坐标
     * @param {Number} top 矩形的纵坐标
     * @param {Number} xSpeed 矩形的横向速度 单位 (px/ms)
     * @param {Number} ySpeed 矩形的纵向速度 单位 (px/ms)
     * @param {HTMLElement} dom 矩形对应的 dom 元素
     */
    constructor(width, height, left, top, xSpeed, ySpeed, dom) {
        this.width = width;
        this.height = height;
        this.left = left;
        this.top = top;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.dom = dom;

        this.render(); // 创建好矩形后 就渲染一遍
    }

    render() {
        this.dom.style.width = this.width + 'px';
        this.dom.style.height = this.height + 'px';
        this.dom.style.left = this.left + 'px';
        this.dom.style.top = this.top + 'px';
    }

    move(duration) {
        this.left += this.xSpeed * duration;
        this.top += this.ySpeed * duration;

        // 若子类身上 有 onMove 方法 那调用一下该方法
        if (this.onMove) {
            this.onMove();
        }

        this.render(); // 每当 矩形身上的位置数据变化后 将其渲染一遍
    }
}