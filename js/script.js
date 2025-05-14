let loggedIn = false;
let users = [];
let cart = [];
let products = [];

window.onload = function () {
    fetch('assets/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error loading product data.");
            }
            return response.json();
        })
        .then(data => {
            products = data;
            displayProducts(products);
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });

    document.getElementById("searchBar").addEventListener("input", function (e) {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
        displayProducts(filtered);
    });
};

function displayProducts(prodList) {
    const container = document.getElementById("productList");
    if (!container) return;

    container.innerHTML = "";
    prodList.forEach(p => {
        const card = `
            <div class="col-md-4 mb-3 d-flex">
                <div class="card w-100 d-flex flex-column">
                    <img src="${p.image}" class="card-img-top" alt="${p.name}" onclick="openModal(${p.id})">
                    <div class="card-body d-flex flex-column justify-content-between">
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
    if (!product) return;

    document.getElementById("modalTitle").innerText = product.name;
    document.getElementById("modalBody").innerHTML = `
        <img src="${product.image}" class="me-3 rounded" style="width: 150px; height: auto;">
        <div>
            <p><strong>Marca:</strong> ${product.brand}</p>
            <p><strong>Modelo:</strong> ${product.model}</p>
            <p><strong>Descripción:</strong> ${product.description}</p>
            <p><strong>Cnt.Disponible:</strong> ${product.quantity}</p>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <p><strong>Precio (USD):</strong> $${product.price}</p>
        </div>
    `;
    document.getElementById("productQuantity").value = 1;
    document.getElementById("productModal").setAttribute("data-id", id);
    new bootstrap.Modal(document.getElementById("productModal")).show();
}

function addToCart() {
    if (!loggedIn) {
        alert("Por favor, ingrese a su cuenta primero.");
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
                <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">Eliminar producto</button>
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
    const messageHeader = "Hola, me encuentro interesado en los siguientes productos:%0A";
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
        alert("Login existoso.");
        bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
    } else {
        alert("Nombre de usuario o contraseña incorrectos.");
    }
}

function signup() {
    const newUser = document.getElementById("newUsername").value;
    const newPass = document.getElementById("newPassword").value;
    const exists = users.find(u => u.username === newUser);
    if (exists) {
        alert("El usuario ya existe. Por favor eliga otro nombre de usuario.");
        return;
    }
    if (newUser && newPass) {
        users.push({ username: newUser, password: newPass });
        alert("Cuenta creada. Puede ahora ingresar a la cuenta.");
        bootstrap.Modal.getInstance(document.getElementById("signupModal")).hide();
    } else {
        alert("Por favor ingrese el usuario y la contraseña.");
    }
}
