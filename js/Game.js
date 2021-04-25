const gameOverDom = document.querySelector('.game-over');

class Game {
    constructor() {
        this.sky = new Sky(-50);
        this.land = new Land(-100);
        this.bird = new Bird();
        this.PipePareProduce = new PipePareProducer(-100);

        this.timer = null; // 游戏开始的计时器
        this.tick = 16; // 物体运动的时间间隔

        this.gameOver = false; // true 游戏结束 false 游戏开始
    }

    /**
     * 开始游戏
     */
    startGame() {
        if (this.timer) {
            return;
        }
        if (this.gameOver) { // 在游戏结束的情况下开始游戏 即: 重启游戏
            window.location.reload();
        }
        this.bird.startSwing(); // 小鸟开始煽动翅膀
        this.PipePareProduce.startProduce(); // 水管对生成器开始生成水管对
        this.timer = setInterval(() => {
            const duration = this.tick / 1000;
            // 天空 大地 小鸟 开始移动
            this.land.move(duration);
            this.sky.move(duration);
            this.bird.move(duration);
            // 水管对 开始移动
            const pairs = this.PipePareProduce.pairs;
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                pair.move(duration);
            }
            // 检测游戏是否结束
            this.isGameOver();
        }, this.tick);
    }

    /**
     * 结束游戏
     */
    stopGame() {
        clearInterval(this.timer);
        this.timer = null;
        this.bird.stopSwing();
        this.PipePareProduce.stopProduce();
    }

    isGameOver() {
        // 检测小鸟 是否 撞到地面
        if (this.bird.top === this.bird.maxTop) {
            this.stopGame(); // 停止游戏
            this.gameOver = true; // 游戏结束 显示 游戏结束蒙版
        }
        // 检测 小鸟 是否与 水管 碰撞
        const pairs = this.PipePareProduce.pairs;
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i]; // 水管对
            const upPipe = pair.upPipe; // 上水管
            const downPipe = pair.downPipe; // 下水管
            if (this.isHit(this.bird, upPipe) ||
                this.isHit(this.bird, downPipe)) {
                this.stopGame(); // 停止游戏
                this.gameOver = true; // 游戏结束 显示 游戏结束蒙版
            }
        }
    }

    /**
     * 检测 bird 和 pipe 是否碰撞 若发生了碰撞 返回 true 否则 返回 false
     * @param {Object} bird 小鸟矩形
     * @param {*} pipe 水管矩形
     */
    isHit(bird, pipe) {
        // 获取两矩形的中心点坐标
        const birdCenterX = bird.left + bird.width / 2;
        const birdCenterY = bird.top + bird.height / 2;
        const pipeCenterX = pipe.left + pipe.width / 2;
        const pipeCenterY = pipe.top + pipe.height / 2;
        // 获取两矩形的中心点的 横/纵 向距离
        const disCenterX = Math.abs(birdCenterX - pipeCenterX);
        const disCenterY = Math.abs(birdCenterY - pipeCenterY);
        // 获取安全距离
        const safeDisX = (bird.width + pipe.width) / 2;
        const safeDisY = (bird.height + pipe.height) / 2;
        if (disCenterX <= safeDisX && disCenterY <= safeDisY) {
            return true;
        }
        return false;
    }

    /**
     * 给 this.gameOver 添加访问器属性
     */
    set gameOver(val) {
        if (val === true) { // 游戏结束
            gameOverDom.style.display = 'block';
        }
        this._gameOver = val;
    }

    get gameOver() {
        return this._gameOver;
    }

    regEvent() {
        window.onkeypress = (e) => {
            if (e.key === ' ') { // 用户按下空格键
                this.bird.jump(); // 小鸟跳
            } else if (e.key === 'Enter') { // 用户按下回车键
                if (this.timer) { // 若游戏没有结束
                    this.stopGame(); // 停止游戏
                } else {
                    this.startGame(); // 开始游戏
                }
            }
        }
    }
}