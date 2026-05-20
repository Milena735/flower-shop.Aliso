const fullCatalog = [
    { id: 1, name: 'Румяность', price: 3900, image: 'https://avatars.mds.yandex.net/i?id=ecdac02c74dcc0194d0e0361df549c97c504af64-13094613-images-thumbs&n=13', desc: 'Розы, пионы' },
    { id: 2, name: 'Летняя поляна', price: 2700, image: 'https://avatars.mds.yandex.net/i?id=e965e87a6d59978601e33a5dc2ba30b4ff37eda7-5233094-images-thumbs&n=13', desc: 'Подсолнухи, хризантемы' },
    { id: 3, name: 'Тайный сад', price: 4500, image: 'https://avatars.mds.yandex.net/i?id=dc53d0d0be3ba4098e49e7aee5a92e37839c6520-5157058-images-thumbs&n=13', desc: 'Лилии, орхидеи' },
    { id: 4, name: 'Нежность', price: 4200, image: 'https://avatars.mds.yandex.net/i?id=5389a8a41e60bb1cbe670b0046b7e5806b081110-5113178-images-thumbs&n=13', desc: 'Кустовые розы, альстромерии' },
    { id: 5, name: 'Облачко', price: 3600, image: 'https://content2.flowwow-images.com/data/flowers/524x524/90/1743594073_30299590.jpg', desc: 'Белые розы, хризантемы, спатифиллум'},
    { id: 6, name: 'Первое свидание', price: 3800, image: 'https://avatars.mds.yandex.net/get-mpic/11462999/2a00000195661a74206ef9c8b176e8ca9894/orig', desc: 'Ранункулюсы'}
];

// Для главной — только первые 4 букета
const featuredCatalog = fullCatalog.slice(0, 4);

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
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽ x ${item.quantity}</div>
                    <div class="cart-item-actions">
                        <button class="cart-qty-minus" data-id="${item.id}">−</button>
                        <span class="cart-qty-value">${item.quantity}</span>
                        <button class="cart-qty-plus" data-id="${item.id}">+</button>
                        <button class="cart-remove" data-id="${item.id}">🗑</button>
                    </div>
                    <hr>
                </div>`;
    });
    container.innerHTML = html;
    if (totalSpan) totalSpan.innerText = total;
    
    document.querySelectorAll('.cart-qty-minus').forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); changeQty(parseInt(btn.dataset.id), -1); };
    });
    document.querySelectorAll('.cart-qty-plus').forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); changeQty(parseInt(btn.dataset.id), 1); };
    });
    document.querySelectorAll('.cart-remove').forEach(btn => {
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

// Отрисовка ВСЕХ букетов (для страницы каталога)
function renderCatalog() {
    const container = document.getElementById('catalog');
    if (!container) return;
    container.innerHTML = '';
    fullCatalog.forEach(item => {
        container.innerHTML += `<div class="card">
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="price">${item.price} ₽</p>
            <p>${item.desc}</p>
            <button onclick="addToCart(${item.id}, '${item.name}', ${item.price})">В корзину</button>
        </div>`;
    });
}

// Отрисовка ТОЛЬКО первых 4 букетов (для главной страницы)
function renderFeatured() {
    const container = document.getElementById('featuredCatalog');
    if (!container) return;
    container.innerHTML = '';
    featuredCatalog.forEach(item => {
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

document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('open')) {
        const cartIcon = document.getElementById('cartIcon');
        if (!sidebar.contains(e.target) && cartIcon && !cartIcon.contains(e.target)) {
            closeSidebar();
        }
    }
});

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
        
        let name = document.getElementById('name').value.trim();
        let phone = document.getElementById('phone').value.trim();
        let address = document.getElementById('address').value.trim();
        
        // Проверка имени (минимум 2 символа, только буквы и пробелы)
        if (!name) {
            return showNotification("❌ Введите имя!", 1500);
        }
        if (name.length < 2) {
            return showNotification("❌ Имя должно содержать минимум 2 символа!", 1500);
        }
        if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(name)) {
            return showNotification("❌ Имя может содержать только буквы!", 1500);
        }
        
        // Проверка телефона (ровно 11 цифр, может начинаться с 8 или +7)
        if (!phone) {
            return showNotification("❌ Введите номер телефона!", 1500);
        }
        // Удаляем всё, кроме цифр
        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length === 11) {
            // Норм, оставляем
        } else if (cleanPhone.length === 10 && phone.startsWith('8')) {
            cleanPhone = '8' + cleanPhone;
        } else if (cleanPhone.length === 10 && phone.startsWith('9')) {
            cleanPhone = '8' + cleanPhone;
        } else {
            return showNotification("❌ Номер телефона должен содержать 11 цифр (например: 89123456789)!", 2000);
        }
        
        // Проверка адреса (минимум 5 символов)
        if (!address) {
            return showNotification("❌ Введите адрес доставки!", 1500);
        }
        if (address.length < 5) {
            return showNotification("❌ Адрес должен быть подробнее (минимум 5 символов)!", 1500);
        }
        if (address.length > 150) {
            return showNotification("❌ Адрес слишком длинный (максимум 150 символов)!", 1500);
        }
        
        // Если все проверки пройдены
        showNotification(`✅ Спасибо, ${name}! Ваш заказ оформлен.`, 2500);
        clearCart();
        closeModal();
        closeSidebar();
        orderForm.reset();
    };
}
loadCart();

// ===== ДАННЫЕ ДЛЯ КОНСТРУКТОРА (оставляем как есть) =====
const flowersMulti = [
    { id: 'f1', name: 'Розы (красные)', price: 320, image: 'https://content2.flowwow-images.com/data/flowers/524x524/22/1719243648_22879022.jpg' },
    { id: 'f2', name: 'Пионы (розовые)', price: 280, image: 'https://avatars.mds.yandex.net/get-mpic/20160986/2a0000019d2d1bad6e89d675a3ed590c345b/orig' },
    { id: 'f3', name: 'Лилии (белые)', price: 460, image: 'https://avatars.mds.yandex.net/get-mpic/16166074/2a000001993b30873850f0bbdae7debf39ae/orig' },
    { id: 'f4', name: 'Хризантемы', price: 290, image: 'https://avatars.mds.yandex.net/i?id=6c715fd4ce466e802d61e56cb72e2307a0c92abf-4421407-images-thumbs&n=13' },
    { id: 'f5', name: 'Тюльпаны', price: 125, image: 'https://ir.ozone.ru/s3/multimedia-r/c1000/6528797799.jpg' }
];

const greeneryMulti = [
    { id: 'g1', name: 'Эвкалипт', price: 110, image: 'https://ir.ozone.ru/s3/multimedia-1-3/7457121867.jpg' },
    { id: 'g2', name: 'Папоротник', price: 100, image: https:'https://basket-18.wbbasket.ru/vol2995/part299569/299569358/images/big/1.webp' },
    { id: 'g3', name: 'Аспидистра', price: 210, image: 'https://avatars.mds.yandex.net/i?id=b0dde2c09d993f0263ebaac4bd599842_sr-9043236-images-thumbs&n=13' },
    { id: 'g4', name: 'Рускус', price: 170, image: 'https://content2.flowwow-images.com/data/flowers/524x524/56/1716625508_30298556.jpg' }
];

const packagingMulti = [
    { id: 'p1', name: 'Крафт + лента', price: 50, image: 'https://avatars.mds.yandex.net/i?id=15426fa820bcf2c26d3f37a7d145bcae_l-5280919-images-thumbs&n=13' },
    { id: 'p2', name: 'Прозрачная плёнка', price: 60, image: 'https://avatars.mds.yandex.net/i?id=5bae7c3eb87589c0297dcdb745923dfca92d1eb0-5234681-images-thumbs&n=13' },
    { id: 'p3', name: 'Сетка декоративная', price: 100, image: 'https://avatars.mds.yandex.net/i?id=20fc024a4c425fdb670c17dc410c149fbea13118-5459902-images-thumbs&n=13' },
    { id: 'p4', name: 'Подарочная коробка', price: 350, image: 'https://avatars.mds.yandex.net/get-mpic/4615030/img_id7991358104299464563.jpeg/orig' }
];

let selectedFlowers = [];
let selectedGreenery = [];
let selectedPackaging = [];

function updateFlowerQuantity(flowerId, delta) {
    const existingIndex = selectedFlowers.findIndex(f => f.id === flowerId);
    if (existingIndex !== -1) {
        const newQty = selectedFlowers[existingIndex].quantity + delta;
        if (newQty <= 0) {
            selectedFlowers.splice(existingIndex, 1);
        } else {
            selectedFlowers[existingIndex].quantity = newQty;
        }
    } else if (delta > 0) {
        const flower = flowersMulti.find(f => f.id === flowerId);
        if (flower) {
            selectedFlowers.push({ ...flower, quantity: 1 });
        }
    }
    renderMultiBuilder();
    updateMultiBuilderTotal();
    updateFloatingDetails();
}

function toggleGreenery(item) {
    const index = selectedGreenery.findIndex(g => g.id === item.id);
    if (index === -1) {
        selectedGreenery.push(item);
    } else {
        selectedGreenery.splice(index, 1);
    }
    renderMultiBuilder();
    updateMultiBuilderTotal();
    updateFloatingDetails();
}

function togglePackaging(item) {
    const index = selectedPackaging.findIndex(p => p.id === item.id);
    if (index === -1) {
        selectedPackaging.push(item);
    } else {
        selectedPackaging.splice(index, 1);
    }
    renderMultiBuilder();
    updateMultiBuilderTotal();
    updateFloatingDetails();
}

function renderMultiBuilder() {
    const flowersContainer = document.getElementById('flowersList');
    const greeneryContainer = document.getElementById('greeneryList');
    const packagingContainer = document.getElementById('packagingList');
    
    if (!flowersContainer) return;
    
    flowersContainer.innerHTML = '';
    greeneryContainer.innerHTML = '';
    packagingContainer.innerHTML = '';
    
    flowersMulti.forEach(flower => {
        const selected = selectedFlowers.find(f => f.id === flower.id);
        const quantity = selected ? selected.quantity : 0;
        const isSelected = quantity > 0;
        
        const card = document.createElement('div');
        card.className = `builder-card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
            <img src="${flower.image}" alt="${flower.name}">
            <div class="builder-card-title">${flower.name}</div>
            <div class="builder-card-price">${flower.price} ₽ / шт</div>
            ${isSelected ? `
                <div class="builder-quantity">
                    <button class="qty-btn minus" data-id="${flower.id}">-</button>
                    <span class="qty-value">${quantity}</span>
                    <button class="qty-btn plus" data-id="${flower.id}">+</button>
                </div>
            ` : `
                <button class="add-flower-btn" data-id="${flower.id}">➕ Добавить</button>
            `}
        `;
        
        const addBtn = card.querySelector('.add-flower-btn');
        if (addBtn) {
            addBtn.onclick = (e) => {
                e.stopPropagation();
                updateFlowerQuantity(flower.id, 1);
            };
        }
        
        const minusBtn = card.querySelector('.qty-btn.minus');
        if (minusBtn) {
            minusBtn.onclick = (e) => {
                e.stopPropagation();
                updateFlowerQuantity(flower.id, -1);
            };
        }
        
        const plusBtn = card.querySelector('.qty-btn.plus');
        if (plusBtn) {
            plusBtn.onclick = (e) => {
                e.stopPropagation();
                updateFlowerQuantity(flower.id, 1);
            };
        }
        
        flowersContainer.appendChild(card);
    });
    
    greeneryMulti.forEach(item => {
        const isSelected = selectedGreenery.some(g => g.id === item.id);
        const card = document.createElement('div');
        card.className = `builder-card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="builder-card-title">${item.name}</div>
            <div class="builder-card-price">${item.price} ₽</div>
        `;
        card.onclick = () => {
            toggleGreenery(item);
        };
        greeneryContainer.appendChild(card);
    });
    
    packagingMulti.forEach(item => {
        const isSelected = selectedPackaging.some(p => p.id === item.id);
        const card = document.createElement('div');
        card.className = `builder-card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="builder-card-title">${item.name}</div>
            <div class="builder-card-price">${item.price} ₽</div>
        `;
        card.onclick = () => {
            togglePackaging(item);
        };
        packagingContainer.appendChild(card);
    });
    
    updateMultiBuilderTotal();
    updateFloatingDetails();
}

function updateMultiBuilderTotal() {
    const flowersTotal = selectedFlowers.reduce((sum, f) => sum + (f.price || 0) * (f.quantity || 1), 0);
    const greeneryTotal = selectedGreenery.reduce((sum, g) => sum + (g.price || 0), 0);
    const packagingTotal = selectedPackaging.reduce((sum, p) => sum + (p.price || 0), 0);
    const total = flowersTotal + greeneryTotal + packagingTotal;
    
    const totalElement = document.getElementById('builderTotalPrice');
    if (totalElement) totalElement.innerText = total + ' ₽';
    
    const floatingPrice = document.getElementById('floatingPriceValue');
    if (floatingPrice) floatingPrice.innerText = total + ' ₽';
    
    return total;
}

function updateFloatingDetails() {
    const detailsElement = document.getElementById('floatingPriceDetails');
    if (!detailsElement) return;
    
    const flowersText = selectedFlowers.map(f => `${f.name} ${f.quantity}шт`).join(', ');
    const greeneryText = selectedGreenery.map(g => g.name).join(', ');
    const packagingText = selectedPackaging.map(p => p.name).join(', ');
    
    let text = '';
    if (flowersText) text += `🌹 ${flowersText}`;
    if (greeneryText) text += ` | 🌿 ${greeneryText}`;
    if (packagingText) text += ` | 🎀 ${packagingText}`;
    if (!text) text = 'Выберите цветы, зелень и упаковку';
    
    detailsElement.innerHTML = text;
}

function addMultiBuilderToCart() {
    const flowersText = selectedFlowers.map(f => `${f.name} ${f.quantity}шт`).join(', ');
    const greeneryText = selectedGreenery.map(g => g.name).join(', ');
    const packagingText = selectedPackaging.map(p => p.name).join(', ');
    
    // Вычисляем общую стоимость
    const price = selectedFlowers.reduce((s, f) => s + (f.price || 0) * (f.quantity || 1), 0) +
                  selectedGreenery.reduce((s, g) => s + (g.price || 0), 0) +
                  selectedPackaging.reduce((s, p) => s + (p.price || 0), 0);
    
    // Если цена 0 — запрещаем добавление
    if (price <= 0) {
        showNotification("❌ Нельзя добавить пустой букет! Выберите цветы, зелень или упаковку.", 2500);
        return;
    }
    
    const name = `💐 Букет (🌹 ${flowersText}; 🌿 ${greeneryText}; 🎀 ${packagingText})`;
    
    let item = cart.find(i => i.name === name);
    if (item) item.quantity++;
    else cart.push({ id: Date.now(), name, price, quantity: 1 });
    
    saveCart();
    updateCartUI();
    updateCartCount();
    showNotification(`✓ Букет добавлен в корзину!`, 2000);
}

// ===== ПОЭТАПНЫЙ КОНСТРУКТОР =====
let currentStep = 1;

function showStep(step) {
    for (let i = 1; i <= 3; i++) {
        const stepDiv = document.getElementById(`step${i}`);
        const content = stepDiv.querySelector('.step-content');
        if (i === step) {
            stepDiv.classList.add('active');
            content.style.display = 'block';
        } else {
            stepDiv.classList.remove('active');
            content.style.display = 'none';
        }
    }
    currentStep = step;
    updateMultiBuilderTotal();
    updateFloatingDetails();
}

function nextStep(step) {
    currentStep = step;
    showStep(currentStep);
}

function prevStep(step) {
    currentStep = step;
    showStep(currentStep);
}

function finishBuilder() {
    // Вычисляем общую стоимость
    const price = selectedFlowers.reduce((s, f) => s + (f.price || 0) * (f.quantity || 1), 0) +
                  selectedGreenery.reduce((s, g) => s + (g.price || 0), 0) +
                  selectedPackaging.reduce((s, p) => s + (p.price || 0), 0);
    
    if (price <= 0) {
        showNotification("❌ Нельзя собрать пустой букет! Добавьте цветы, зелень или упаковку.", 2500);
        return;
    }
    
    updateMultiBuilderTotal();
    const panel = document.getElementById('builderTotalPanel');
    const selectedList = document.getElementById('builderSelectedList');
    
    const flowersText = selectedFlowers.map(f => `${f.name} ${f.quantity}шт`).join(', ');
    const greeneryText = selectedGreenery.map(g => g.name).join(', ');
    const packagingText = selectedPackaging.map(p => p.name).join(', ');
    
    selectedList.innerHTML = `
        <strong>📋 Состав вашего букета:</strong><br>
        🌹 Цветы: ${flowersText || 'не выбраны'}<br>
        🌿 Зелень: ${greeneryText || 'не выбрана'}<br>
        🎀 Упаковка: ${packagingText || 'не выбрана'}
    `;
    
    panel.style.display = 'block';
    currentStep = 4;
    
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`step${i}`).style.display = 'none';
    }
}

function resetBuilder() {
    selectedFlowers = [];
    selectedGreenery = [];
    selectedPackaging = [];
    
    renderMultiBuilder();
    
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`step${i}`).style.display = 'block';
    }
    
    document.getElementById('builderTotalPanel').style.display = 'none';
    currentStep = 1;
    showStep(1);
    updateMultiBuilderTotal();
    updateFloatingDetails();
}

function initStepClickListeners() {
    for (let i = 1; i <= 3; i++) {
        const stepDiv = document.getElementById(`step${i}`);
        if (stepDiv) {
            const header = stepDiv.querySelector('.step-header');
            if (header) {
                header.style.cursor = 'pointer';
                header.onclick = () => {
                    if (currentStep !== 4) {
                        showStep(i);
                    }
                };
            }
        }
    }
}

if (document.getElementById('flowersList')) {
    renderMultiBuilder();
    initStepClickListeners();
}

// ===== ВЫЗОВ ОТРИСОВКИ В ЗАВИСИМОСТИ ОТ СТРАНИЦЫ =====
if (document.getElementById('featuredCatalog')) {
    renderFeatured();
}

if (document.getElementById('catalog')) {
    renderCatalog();
}
