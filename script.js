const catalog = [
    { id: 1, name: 'Румяность', price: 3900, image: 'https://www.studiofloristic.ru/files/catalog/4628/w1000_0782a1394a8c0bc19f2d0392e7df8993.jpg', desc: 'Розы, пионы' },
    { id: 2, name: 'Летняя поляна', price: 2700, image: 'https://avatars.mds.yandex.net/i?id=e965e87a6d59978601e33a5dc2ba30b4ff37eda7-5233094-images-thumbs&n=13', desc: 'Подсолнухи, хризантемы' },
    { id: 3, name: 'Тайный сад', price: 4500, image: 'https://dostavkatsvetov.ru/upload/iblock/1b6/sxlloma08xl1ote2kpknhhln0iqcg91r.jpeg', desc: 'Лилии, орхидеи' },
    { id: 4, name: 'Нежность', price: 4200, image: 'https://avatars.mds.yandex.net/i?id=5389a8a41e60bb1cbe670b0046b7e5806b081110-5113178-images-thumbs&n=13', desc: 'Кустовые розы, альстромерии' }
];

let cart = [];

function saveCart() { localStorage.setItem('flowerCart', JSON.stringify(cart)); }

function loadCart() {
    const saved = localStorage.getItem('flowerCart');
    if (saved) cart = JSON.parse(saved);
    updateCartUI();
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.innerText = count;
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    const totalSpan = document.getElementById('cartTotal');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Корзина пуста</p>';
        if (totalSpan) totalSpan.innerText = '0';
        return;
    }
    
    let total = 0;
    let html = '';
    cart.forEach(item => {
        total += item.price * item.quantity;
        html += `<div class="cart-item" data-id="${item.id}">
                    <div><strong>${item.name}</strong> — ${item.price}₽ x ${item.quantity}</div>
                    <div>
                        <button class="qty-minus" data-id="${item.id}">-</button>
                        <button class="qty-plus" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">🗑</button>
                    </div>
                    <hr>
                </div>`;
    });
    container.innerHTML = html;
    if (totalSpan) totalSpan.innerText = total;
    
    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); changeQty(parseInt(btn.dataset.id), -1); };
    });
    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); changeQty(parseInt(btn.dataset.id), 1); };
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); removeItem(parseInt(btn.dataset.id)); };
    });
}

function showNotification(message, duration = 2500) {
    const oldNotification = document.querySelector('.custom-notification');
    if (oldNotification) oldNotification.remove();
    
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.innerHTML = `<span>${message}</span><button class="notification-close">×</button>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    
    function closeNotification() {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }
    
    notification.querySelector('.notification-close').onclick = closeNotification;
    notification.onclick = (e) => {
        if (e.target === notification || e.target.classList.contains('notification-close')) {
            closeNotification();
        }
    };
    setTimeout(closeNotification, duration);
}

function addToCart(id, name, price) {
    let item = cart.find(i => i.id === id);
    if (item) item.quantity++;
    else cart.push({ id, name, price, quantity: 1 });
    saveCart();
    updateCartUI();
    updateCartCount();
    showNotification(`✓ ${name} добавлен в корзину!`, 2000);
}

function changeQty(id, delta) {
    let item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
        saveCart();
        updateCartUI();
        updateCartCount();
    }
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
    updateCartCount();
}

function clearCart() { 
    cart = []; 
    saveCart(); 
    updateCartUI(); 
    updateCartCount(); 
}

function renderCatalog() {
    const container = document.getElementById('catalog');
    if (!container) return;
    container.innerHTML = '';
    catalog.forEach(item => {
        container.innerHTML += `<div class="card">
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="price">${item.price} ₽</p>
            <p>${item.desc}</p>
            <button onclick="addToCart(${item.id}, '${item.name}', ${item.price})">В корзину</button>
        </div>`;
    });
}

const sidebar = document.getElementById('cartSidebar');
const modal = document.getElementById('orderModal');

function openSidebar() { if (sidebar) sidebar.classList.add('open'); }
function closeSidebar() { if (sidebar) sidebar.classList.remove('open'); }
function openModal() {
    if (cart.length === 0) { showNotification("Корзина пуста!", 1500); return; }
    if (modal) modal.style.display = 'flex';
}
function closeModal() { if (modal) modal.style.display = 'none'; }

// Закрытие корзины при клике вне её
document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('open')) {
        const cartIcon = document.getElementById('cartIcon');
        if (!sidebar.contains(e.target) && cartIcon && !cartIcon.contains(e.target)) {
            closeSidebar();
        }
    }
});

// Инициализация обработчиков
const cartIcon = document.getElementById('cartIcon');
const closeCartBtn = document.getElementById('closeCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const closeModalBtn = document.querySelector('.close');
const orderForm = document.getElementById('orderForm');

if (cartIcon) cartIcon.onclick = openSidebar;
if (closeCartBtn) closeCartBtn.onclick = closeSidebar;
if (checkoutBtn) checkoutBtn.onclick = openModal;
if (closeModalBtn) closeModalBtn.onclick = closeModal;

window.onclick = (e) => { if (e.target === modal) closeModal(); };

if (orderForm) {
    orderForm.onsubmit = (e) => {
        e.preventDefault();
        let name = document.getElementById('name').value;
        if (!name) return showNotification("Введите имя!", 1500);
        showNotification(`Спасибо, ${name}! Заказ оформлен.`, 2500);
        clearCart();
        closeModal();
        closeSidebar();
        orderForm.reset();
    };
}

renderCatalog();
loadCart();