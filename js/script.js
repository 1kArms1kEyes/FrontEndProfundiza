

fetch('assets/products.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    displayProducts(products);
  });

window.onload = function () {
    document.getElementById("searchBar").addEventListener("input", function (e) {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
        );
        displayProducts(filtered);
    });
};

function displayProducts(prodList) {
    const container = document.getElementById("productList");
    container.innerHTML = "";
    prodList.forEach(p => {
        const card = `<div class="col-md-4 mb-3">
            <div class="card">
                <img src="${p.image}" class="card-img-top" onclick="openModal(${p.id})">
                <div class="card-body">
                    <h5 class="card-title">${p.name}</h5>
                    <p class="card-text">${p.category}</p>
                </div>
            </div>
        </div>`;
        container.innerHTML += card;
    });
}

function openModal(id) {
    const product = products.find(p => p.id === id);
    document.getElementById("modalTitle").innerText = product.name;
    document.getElementById("modalBody").innerHTML = `
        <img src="${product.image}" class="me-3 rounded" style="width: 150px; height: auto;">
        <div>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Model:</strong> ${product.model}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Available:</strong> ${product.quantity}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Price:</strong> $${product.price}</p>
        </div>
    `;
    document.getElementById("productQuantity").value = 1;
    document.getElementById("productModal").setAttribute("data-id", id);
    new bootstrap.Modal(document.getElementById("productModal")).show();
}

// The rest of the previous JavaScript remains unchanged

let loggedIn = false;
let users = [];
let cart = [];
let products = [];

for (let i = 1; i <= 10; i++) {
    products.push({
        id: i,
        name: "Product " + i,
        brand: "Brand " + i,
        model: "Model " + i,
        description: "Description of product " + i,
        quantity: 100,
        category: i % 2 === 0 ? "Category A" : "Category B",
        price: 10 * i,
        image: `assets/images/product${i}.png`
    });
}

window.onload = function () {
    displayProducts(products);
    document.getElementById("searchBar").addEventListener("input", function (e) {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
        );
        displayProducts(filtered);
    });
};

function displayProducts(prodList) {
    const container = document.getElementById("productList");
    container.innerHTML = "";
    prodList.forEach(p => {
        const card = `<div class="col-md-4 mb-3">
            <div class="card">
                <img src="${p.image}" class="card-img-top" onclick="openModal(${p.id})">
                <div class="card-body">
                    <h5 class="card-title">${p.name}</h5>
                    <p class="card-text">${p.category}</p>
                </div>
            </div>
        </div>`;
        container.innerHTML += card;
    });
}

function openModal(id) {
    const product = products.find(p => p.id === id);
    document.getElementById("modalTitle").innerText = product.name;
    
    document.getElementById("modalBody").innerHTML = `
        <img src="${product.image}" class="me-3 rounded" style="width: 150px; height: auto;">
        <div>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Model:</strong> ${product.model}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Available:</strong> ${product.quantity}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Price:</strong> $${product.price}</p>
        </div>
    `;
    
    document.getElementById("productQuantity").value = 1;
    document.getElementById("productModal").setAttribute("data-id", id);
    new bootstrap.Modal(document.getElementById("productModal")).show();
}

function addToCart() {
    if (!loggedIn) {
        alert("Please login first.");
        new bootstrap.Modal(document.getElementById("loginModal")).show();
        return;
    }
    const id = parseInt(document.getElementById("productModal").getAttribute("data-id"));
    const qty = parseInt(document.getElementById("productQuantity").value);
    const product = products.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }
    document.getElementById("cartCount").innerText = cart.length;
    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
}

function showCart() {
    const cartList = document.getElementById("cartItems");
    cartList.innerHTML = "";
    cart.forEach((item, index) => {
        cartList.innerHTML += `<div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                ${item.name} (${item.qty})
                <button class="btn btn-sm btn-outline-secondary" onclick="updateQty(${index}, -1)">-</button>
                <button class="btn btn-sm btn-outline-secondary" onclick="updateQty(${index}, 1)">+</button>
                <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">Remove</button>
            </div>
        </div>`;
    });
    new bootstrap.Modal(document.getElementById("cartModal")).show();
}

function updateQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    showCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    showCart();
}

function sendWhatsApp() {
    const number = "+573134773765";
    const messageHeader = "Hi, I am interested in the following products:%0A";
    const messageBody = cart.map(item => `- ${item.name}: ${item.qty}`).join("%0A");
    const finalMessage = `${messageHeader}${messageBody}`;
    const whatsappURL = `https://wa.me/${number}?text=${finalMessage}`;
    window.open(whatsappURL, "_blank");
}

function showLogin() {
    new bootstrap.Modal(document.getElementById("loginModal")).show();
}

function showSignup() {
    new bootstrap.Modal(document.getElementById("signupModal")).show();
}

function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const found = users.find(u => u.username === user && u.password === pass);
    if (found) {
        loggedIn = true;
        alert("Login successful.");
        bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
    } else {
        alert("Incorrect username or password.");
    }
}

function signup() {
    const newUser = document.getElementById("newUsername").value;
    const newPass = document.getElementById("newPassword").value;
    const exists = users.find(u => u.username === newUser);
    if (exists) {
        alert("Username already exists. Please choose another.");
        return;
    }
    if (newUser && newPass) {
        users.push({ username: newUser, password: newPass });
        alert("Account created. You can now log in.");
        bootstrap.Modal.getInstance(document.getElementById("signupModal")).hide();
    } else {
        alert("Please enter a username and password.");
    }
}
