// ==============================
// LUNÉ EC SITE - script.js
// ==============================

// カートの保存キー
const CART_KEY = "lune_cart";


// ==============================
// カートを取得
// ==============================

function getCart() {
    const cart = localStorage.getItem(CART_KEY);

    if (!cart) {
        return [];
    }

    return JSON.parse(cart);
}


// ==============================
// カートを保存
// ==============================

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


// ==============================
// 商品をカートに追加
// ==============================

function addToCart(product) {

    const cart = getCart();

    // すでに同じ商品があるか確認
    const existingProduct = cart.find(
        item => item.id === product.id
    );

    if (existingProduct) {

        // すでにあれば数量を1つ増やす
        existingProduct.quantity += 1;

    } else {

        // なければ新しく追加
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);

    alert("カートに商品を追加しました。");

    updateCartCount();
}


// ==============================
// カートの商品数を表示
// ==============================

function updateCartCount() {

    const cart = getCart();

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartLinks = document.querySelectorAll(
        'a[href="cart.html"]'
    );

    cartLinks.forEach(link => {

        link.textContent = `CART (${totalQuantity})`;

    });
}


// ==============================
// 商品詳細ページ
// ==============================

const addCartButton = document.querySelector(
    ".add-cart-button"
);

if (addCartButton) {

    addCartButton.addEventListener("click", () => {

        const product = {
            id: "lune-one-black",
            name: "LUNÉ ONE",
            price: 48000,
            image: "images/headphone-black.jpg"
        };

        addToCart(product);

    });
}


// ==============================
// カートページを表示
// ==============================

function displayCart() {

    const cartItemsContainer =
        document.getElementById("cart-items");

    if (!cartItemsContainer) {
        return;
    }

    const cart = getCart();

    // カートが空の場合
    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>カートに商品がありません。</p>
                <a href="products.html">
                    PRODUCTSを見る
                </a>
            </div>
        `;

        updateCartSummary();

        return;
    }


    // カートの商品を表示
    cartItemsContainer.innerHTML = cart.map(item => {

        return `
            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-item-info">

                    <h3>${item.name}</h3>

                    <p>
                        ¥${item.price.toLocaleString()}
                    </p>

                    <div class="quantity-control">

                        <button
                            class="quantity-button"
                            onclick="changeQuantity('${item.id}', -1)"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            class="quantity-button"
                            onclick="changeQuantity('${item.id}', 1)"
                        >
                            +
                        </button>

                    </div>

                    <button
                        class="remove-button"
                        onclick="removeFromCart('${item.id}')"
                    >
                        REMOVE
                    </button>

                </div>

            </div>
        `;

    }).join("");

    updateCartSummary();
}


// ==============================
// 数量変更
// ==============================

function changeQuantity(productId, amount) {

    const cart = getCart();

    const product = cart.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }

    product.quantity += amount;


    // 数量が0になったら削除
    if (product.quantity <= 0) {

        const newCart = cart.filter(
            item => item.id !== productId
        );

        saveCart(newCart);

    } else {

        saveCart(cart);

    }

    displayCart();
    updateCartCount();
}


// ==============================
// 商品をカートから削除
// ==============================

function removeFromCart(productId) {

    const cart = getCart();

    const newCart = cart.filter(
        item => item.id !== productId
    );

    saveCart(newCart);

    displayCart();
    updateCartCount();
}


// ==============================
// カートの金額計算
// ==============================

function updateCartSummary() {

    const cart = getCart();

    const subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );


    // 送料
    // 30,000円以上なら送料無料
    const shipping =
        subtotal >= 30000 || subtotal === 0
            ? 0
            : 800;


    const total = subtotal + shipping;


    // HTMLの要素を取得
    const subtotalElement =
        document.getElementById("subtotal");

    const shippingElement =
        document.getElementById("shipping");

    const totalElement =
        document.getElementById("total");


    if (subtotalElement) {
        subtotalElement.textContent =
            `¥${subtotal.toLocaleString()}`;
    }

    if (shippingElement) {

        shippingElement.textContent =
            shipping === 0
                ? "FREE"
                : `¥${shipping.toLocaleString()}`;

    }

    if (totalElement) {

        totalElement.textContent =
            `¥${total.toLocaleString()}`;

    }
}


// ==============================
// 初期処理
// ==============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        displayCart();
        updateCartCount();

    }
);