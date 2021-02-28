```
2021年2月27日 晚上十点半开始 把购物车给重新写一遍

js css html 都重新写一遍

在编写过程中, 把一些注意点给记录一下 ...

计划用时: 2h
实际用时:
    1. 52min 结构与样式部分 html + css (比较晚了 洗洗睡 明儿早继续...)
    2. 137min 行为部分 js
       额外添加了一些自认为必要的功能
       1. 一键清空购物车效果
       2. 对于已选中的商品, 若重复添加, 那么会在原始数量的基础上 自增 (价格也会随之更新)
```

- [x] 注意点1 tr的border失效问题

```css
table {
    border-collapse: collapse; /* 防止 tr 元素上的 border-top 失效 */
}

.products tr+tr {
    border-top: 1px dashed #ddd;
}
```

```
现象: 如果不在 table 上加这条声明: border-collapse: collapse;
会发现我们给 tr 设置的 border-top 将不会显示出来 (在控制台检测的时候, 发现实际上是设置上去了的, 但是就是不显示, 原因还不详...)
```

- [x] 注意点2 颜色的active样式问题

```css
.products tr td:nth-of-type(2) span.active{
    border: 2px solid #b4a078;
    line-height: 24px;
    background: url(./images/ico_02.gif) no-repeat 39px bottom;
    /* background: url(./images/ico_02.gif) no-repeat right bottom; */
}
```

```
为什么要写成 39px 而不写成 right, 该值是哪来的?

因为如果写成 right 会发现一个小bug, 就是 背景图片 ico_02.gif 和 border-right 之间有一个小间隙

39px 是控制台微调出来的一个结果, 因为一点点增加该值, 发现这个值效果比较好, 所以就用它了...

注: bug 原因不详....
```

- [x] 注意点3 表格元素的 colspan 属性

```html
<th colspan="5">
    <span>总价: </span>
    <strong>0</strong>
</th>
```

```
看一下这部分的结构就理解了, 不易描述...
```

- [x] 注意点4 createProductDom

多个颜色按钮的问题

```js
/**
 * 创建商品区域的DOM结构
 * @param {Array} products 包含所有商品的信息
 */
function createProductDom(products) {
    let str = '';
    products.forEach(product => {
        let colors = '';
        product.list.forEach ( item => {
            colors += `<span data-id=${item.id}>${item.color}</span>`;
        });
        str += `<tr>
                    <td>
                        <img src=${product.list[0].img} alt="">
                    </td>
                    <td>
                        <p class="title">${product.name}</p>
                        <div class="colors">
                            ${colors}
                        </div>
                    </td>
                    <td>${product.list[0].price}.00元</td>
                    <td>
                        <span>-</span>
                        <strong>0</strong>
                        <span>+</span>
                    </td>
                    <td>
                        <button>加入购物车</button>
                    </td>
                </tr>`;
    });
    let tbody = document.querySelector('.shopping-cart .products');
    tbody.innerHTML = str;
}
```

```
在函数 createProductDom 中, 我们将颜色数组给单独拎出来 拼接, 这是因为每一行, 这个颜色按钮有多个
单独拎出来, 进行拼接操作, 再将拼接得到的结果, 放到一个变量 colors 中, 最后再一次性 拼接到 str 中即可;
```

- [x] 注意点5 bindEventForTr

图片路径问题

```js
console.log(product_img.src); // http://127.0.0.1:5500/%E8%B4%AD%E7%89%A9%E8%BD%A6%20(%E5%AE%9E%E6%88%98)/images/img_01-1.png
console.log(product_img.getAttribute("src")); // images/img_01-1.png
```

```
因为此时我们要获取的是相对路径, 所以应该采用 getAttribute 的方式来获取图片路径才对
```

---

```
其余的注意点, 都是一些比较小的细节问题, 写的时候, 注意就好...
```
