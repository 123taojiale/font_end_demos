const skyDom = document.querySelector('.sky');
const skyStyles = getComputedStyle(skyDom);
const skyWidth = parseFloat(skyStyles.width);
const skyHeight = parseFloat(skyStyles.height);

class Sky extends Rectangle {
    constructor(xSpeed) {
        super(skyWidth, skyHeight, 0, 0, xSpeed, 0, skyDom);
    }

    // 边界处理
    onMove() {
        if (this.left <= -skyWidth / 2) {
            this.left = 0;
        }
    }
}

/* 测试 */
// const sky = new Sky(-50);

// setInterval(() => {
//     sky.move(16 / 1000);
// }, 16);