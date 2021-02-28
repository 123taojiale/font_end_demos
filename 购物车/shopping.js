let shoppingCart; // 用于存放 localStorage 中的商品信息(即: 购物车数据)

function init() {
    shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || {}; // 防止 localStorage 中的 shoppingCart 为空, 返回null 并赋值给 变量shoppingCart
    creatSelectedDom();
}

init();

ajax('./shoppingData.json', function (products) {
    createProductDom(products);
    bindEvent();
});


/**
 * 创建商品区域的DOM结构
 * @param {Array} products 包含所有商品的信息
 */
function createProductDom(products) {
    let str = '';
    products.forEach(product => {
        let colors = '';
        product.list.forEach(item => {
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

/**
 * 绑定事件
 */
function bindEvent() {
    let trs = Array.from(document.querySelectorAll(".shopping-cart .products tr"));
    // console.log(trs);
    trs.forEach((tr, tr_index) => { // 逐行绑定事件
        bindEventForTr(tr, tr_index);
    });

    /**
     * 逐行绑定事件
     * @param {HTMLElement} tr 行
     * @param {Number} tr_index 该行所在的索引
     */
    function bindEventForTr(tr, tr_index) {
        let tds = Array.from(tr.children), // 该行每一个单元格对象
            product_img = tds[0].children[0], // 商品图片对象
            product_img_src = product_img.getAttribute("src"),
            product_name = tds[1].children[0].innerHTML,
            product_colors = Array.from(tds[1].children[1].children), // 该行的所有颜色按钮
            product_price = parseInt(tds[2].innerHTML), // 先提前把价格给转化为数字类型 方便后续计算
            product_decrease_btn = tds[3].children[0], // 减按钮
            product_selected_dom = tds[3].children[1],
            product_selected_num = parseInt(product_selected_dom.innerHTML), // 已选中的商品数量
            product_add_btn = tds[3].children[2], // 加按钮
            product_join_btn = tds[4].children[0]; // 加入购物车

        /* 1. 实现颜色切换 + 按钮样式切换 + 还原功能 */
        let color_value = '',
            product_id = '';
        product_colors.forEach(btn => {
            btn.onclick = function () {
                if (this.classList.contains("active")) {
                    this.classList.remove("active");
                    restoreInfo();
                } else {
                    // 清除所有样式
                    product_colors.forEach(item => item.classList.remove("active"));
                    // 更新样式
                    this.classList.add("active");
                    // 更新商品颜色 及 商品id
                    color_value = this.innerHTML;
                    product_id = this.dataset.id;
                    // console.log(color_value, product_id);
                    // 更新图片
                    product_img.src = `images/img_0${tr_index + 1}-${product_colors.indexOf(this) + 1}.png`;
                    product_img_src = product_img.getAttribute("src");
                }
            }
        });

        // 还原当前行的信息
        function restoreInfo() {
            // console.log(product_colors);
            product_colors.forEach(btn => {
                // console.log(1);
                // 还原颜色按钮的样式
                btn.classList.remove("active");
            });
            color_value = '';
            product_id = '';
            // 还原默认图片
            product_img.src = `images/img_0${tr_index + 1}-1.png`;
            // 还原选中商品的数量
            product_selected_dom.innerHTML = 0;
            product_selected_num = 0;
        }

        // 2. 实现增减按钮功能
        product_decrease_btn.onclick = function () {
            if (product_selected_num === 0) {
                return;
            }
            product_selected_num--;
            product_selected_dom.innerHTML = product_selected_num;
        }
        product_add_btn.onclick = function () {
            product_selected_num++;
            product_selected_dom.innerHTML = product_selected_num;
        }

        // 3. 实现加入购物车功能
        product_join_btn.onclick = function () {
            // 校验
            if (!color_value) {
                alert('请选择商品颜色!!!');
                return;
            }
            if (!product_selected_num) {
                alert('请选择商品数量!!!');
                return;
            }
            // 加入购物车
            if (product_id in shoppingCart) {
                shoppingCart[product_id].product_selected_num += product_selected_num;
                shoppingCart[product_id].product_total_price += shoppingCart[product_id].product_selected_num * product_price;
            } else {
                shoppingCart[product_id] = {
                    product_id, // 商品id
                    product_img_src, // 商品图片路径
                    color_value, // 商品颜色
                    product_price, // 商品单价
                    product_selected_num, // 商品数量
                    product_total_price: product_price * product_selected_num, // 该商品的总价
                    time: new Date().getTime() // 商品加入购物车时的时间戳 (用于排序)
                };
            }

            // console.log(shoppingCart);
            localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
            restoreInfo();
            creatSelectedDom();
        }
    }
}



/**
 * 创建添加至购物车内的商品的结构
 */
function creatSelectedDom() {
    let str = '',
        total_price = 0;
    let goods = Object.values(shoppingCart);
    goods = goods.sort((former, latter) => latter.time - former.time); // 降序 -> 令最新添加的商品位于最前面展示
    goods.forEach(good => {
        console.log(good);
        str += `<tr>
                    <td>
                        <img src=${good.product_img_src} alt="">
                    </td>
                    <td class="product-price">单价: ${good.product_price}元</td>
                    <td>${good.color_value}</td>
                    <td class="total-price">总价: ${good.product_total_price}.00元</td>
                    <td>x${good.product_selected_num}</td>
                    <td>
                        <button class="remove-btn" data-id=${good.product_id}>删除</button>
                    </td>
                </tr>`;
        total_price += good.product_total_price;
    });
    // console.log(str);
    document.querySelector(".selected-area tbody").innerHTML = str;
    document.querySelector(".selected-area thead strong").innerHTML = total_price;

    del();

    let remove_all = document.querySelector(".remove-all");
    if (total_price !== 0) {
        remove_all.style.display = "block";
        removeAll();
    } else {
        remove_all.style.display = "none";
    }
}

/**
 * 添加删除功能
 */
function del() {
    let remove_btns = document.querySelectorAll(".remove-btn");
    if (remove_btns) {
        Array.from(remove_btns).forEach(btn => {
            btn.onclick = function () {
                // console.log(1);
                delete shoppingCart[this.dataset.id];
                localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
                creatSelectedDom();
            }
        });
    }
}


/**
 * 清空购物车
 */
function removeAll() {
    let remove_all_btn = document.querySelector(".remove-all button");
    if (remove_all_btn) {
        remove_all_btn.onclick = function () {
            localStorage.clear('shoppingCart');
            init();
        }
    }
}