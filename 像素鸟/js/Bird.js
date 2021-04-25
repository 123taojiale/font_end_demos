const birdDom = document.querySelector('.bird');
const birdStyles = getComputedStyle(birdDom);
const birdWidth = parseFloat(birdStyles.width);
const birdHeight = parseFloat(birdStyles.height);
const birdTop = parseFloat(birdStyles.top);
const birdLeft = parseFloat(birdStyles.left);

class Bird extends Rectangle {
    constructor() {
        super(birdWidth, birdHeight, birdLeft, birdTop, 0, 0, birdDom);

        // 小鸟煽动翅膀
        this.timer = null; // 小鸟煽动翅膀的计时器
        this.tick = 200; // 小鸟煽动翅膀的时间间隔
        this.swingStatus = 0; // 小鸟翅膀的状态 上 0  中 1  下 2
        this.render(); // 在 bird.swingStatus 有值的前提下 再 render 一遍 否则的话 div.bird 的 className 是 bird swing-statusundefined

        // 小鸟下落
        this.g = 1500;
        this.maxTop = landTop - birdHeight; // 小鸟top的最大值
    }

    /**
     * 小鸟开始煽动翅膀
     */
    startSwing() {
        if (this.timer) {
            return;
        } else {
            this.timer = setInterval(() => {
                this.swingStatus = ++this.swingStatus % 3;
                // console.log(this.swingStatus);
                this.render();
            }, this.tick);
        }
    }

    /**
     * 小鸟停止煽动翅膀
     */
    stopSwing() {
        clearInterval(this.timer);
        this.timer = null;
    }

    render() {
        super.render();
        this.dom.className = `bird swing-status${this.swingStatus}`;
    }

    /**
     * 边界处理
     */
    onMove() {
        if (this.top >= this.maxTop) { // 下界
            this.top = this.maxTop;
        }
        if (this.top < 0) { // 上界
            this.top = 0;
        }
    }

    /**
     * 小鸟移动 重写父类的 move 方法 每次移动后 纵向速度 自增
     * @param {*} duration
     */
    move(duration) {
        super.move(duration);
        this.ySpeed += this.g * duration;
    }

    /**
     * 小鸟跳
     */
    jump() {
        this.ySpeed = -400;
    }
}

/* 测试 */
// const bird = new Bird();

// bird.startSwing();

// // bird.stopSwing();

// setInterval(() => {
//     bird.move(16 / 1000);
// }, 16);