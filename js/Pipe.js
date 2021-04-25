const gameDom = document.querySelector('.game');
const gameStyles = getComputedStyle(gameDom);
const gameWidth = parseFloat(gameStyles.width);

// 单个水管
class Pipe extends Rectangle {
    /**
     * 单个水管的构造器
     * @param {Number} height 水管的高度
     * @param {Number} top 水管的纵坐标
     * @param {Number} xSpeed 水管的横向速度
     * @param {HTMLElement} dom 水管的dom对象
     */
    constructor(height, top, xSpeed, dom) {
        super(52, height, gameWidth, top, xSpeed, 0, dom);
    }

    /**
     * 清理视野范围外的水管 dom
     */
    onMove() {
        if (this.left < -this.width) {
            this.dom.remove();
        }
    }
}

/**
 * 返回一个介于 [min, max] 之间的随机整数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns 整数
 */
function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// 水管对
class PipePare {
    /**
     * 水管对的构造器
     * @param {Number} xSpeed 水管对的移动速度
     */
    constructor(xSpeed) {
        // 1. 获取水管对的高度
        this.spaceHeight = 150; // 水管对之间的固定间隙大小 150px
        this.minHeight = 80; // 水管的最小高度值
        this.maxHeight = landTop - this.spaceHeight - this.minHeight; // 水管的最大高度值
        /* 随机获取 上/下 水管的高度值 */
        this.upPipeHeight = getRandom(this.minHeight, this.maxHeight);
        this.downPipeHeight = landTop - this.upPipeHeight - this.spaceHeight;

        // 2. 获取水管对的纵坐标
        this.upPipeTop = 0;
        this.downPipeTop = landTop - this.downPipeHeight;

        // 3. 创建水管对的dom元素
        this.upPipeDom = document.createElement('div');
        this.upPipeDom.className = 'pipe up';

        this.downPipeDom = document.createElement('div');
        this.downPipeDom.className = 'pipe down';

        gameDom.appendChild(this.upPipeDom);
        gameDom.appendChild(this.downPipeDom);

        // 创建水管对
        this.upPipe = new Pipe(this.upPipeHeight, this.upPipeTop, xSpeed, this.upPipeDom);
        this.downPipe = new Pipe(this.downPipeHeight, this.downPipeTop, xSpeed, this.downPipeDom);
    }

    /**
     * 实现水管对一起移动
     * @param {*} duration
     */
    move(duration) {
        this.upPipe.move(duration);
        this.downPipe.move(duration);
    }

    /**
     * 水管对 若在视野范围外 则 返回 true 否则返回 false
     */
    get useLess() {
        return this.upPipe.left < -this.upPipe.width;
    }
}

class PipePareProducer {
    constructor(xSpeed) {
        this.xSpeed = xSpeed;
        this.pairs = []; // 存放所有水管对
        this.timer = null; // 水管对生成的计时器
        this.tick = 1500; // 水管对生成的时间间隔
    }

    /**
     * 开始生成水管对
     */
    startProduce() {
        if (this.timer) {
            return;
        } else {
            this.timer = setInterval(() => {
                this.pairs.push(new PipePare(this.xSpeed));
                this.removePipePare(); // 移除视野范围外的水管对
            }, this.tick);
        }
    }

    /**
     * 停止生成水管对
     */
    stopProduce() {
        clearInterval(this.timer);
        this.timer = null;
    }

    /**
     * 清除 不在视野范围内的水管对 防止 this.pairs 成员数量过多
     */
    removePipePare() {
        for (let i = 0; i < this.pairs.length; i++) {
            const pair = this.pairs[i];
            if (pair.useLess) {
                this.pairs.splice(i, 1);
                i--;
            }
        }
    }
}

/* 测试 */
// const p = new PipePareProducer(-100);

// p.startProduce();

// setInterval(() => {
//     for (let i = 0; i < p.pairs.length; i++) {
//         const pair = p.pairs[i];
//         pair.move(16 / 1000);
//     }
// }, 16);