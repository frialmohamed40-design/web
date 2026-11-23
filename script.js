const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", isOpen);
    menuBtn.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    });
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.contains(event.target) && !menuBtn.contains(event.target)) {
      navLinks.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    }
  });
}

document.querySelectorAll(".year").forEach((item) => {
  item.textContent = new Date().getFullYear();
});

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const formMessage = document.getElementById("formMessage");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      formMessage.textContent = "Please fill in all fields.";
      formMessage.className = "form-message error";
      return;
    }
    if (!emailPattern.test(email)) {
      formMessage.textContent = "Please enter a valid email address.";
      formMessage.className = "form-message error";
      return;
    }
    formMessage.textContent = "Thank you! Your message passed the demo validation.";
    formMessage.className = "form-message success";
    contactForm.reset();
  });
}


// Simple shopping cart. Items are saved in this browser using localStorage.
const CART_KEY = "cozyCoffeeCart";
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (error) { return []; }
}
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function formatPrice(amount) { return `EGP ${Number(amount).toLocaleString("en-EG")}`; }

document.querySelectorAll(".add-cart-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const cart = getCart();
    const id = button.dataset.id;
    const existing = cart.find((item) => item.id === id);
    if (existing) existing.quantity += 1;
    else cart.push({ id, name: button.dataset.name, price: Number(button.dataset.price), image: button.dataset.image, quantity: 1 });
    saveCart(cart);
    const oldText = button.textContent;
    button.textContent = "Added ✓";
    setTimeout(() => { button.textContent = oldText; }, 900);
  });
});

const cartItemsElement = document.getElementById("cartItems");
if (cartItemsElement) {
  function renderCart() {
    const cart = getCart();
    if (cart.length === 0) {
      cartItemsElement.innerHTML = '<div class="empty-cart"><h2>Your cart is empty</h2><p>You have not added any coffee yet.</p><a class="btn" href="services.html">Explore the Menu</a></div>';
    } else {
      cartItemsElement.innerHTML = cart.map((item) => `
        <article class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div><h3>${item.name}</h3><p>${formatPrice(item.price)} each</p>
            <div class="quantity-controls"><button type="button" data-action="decrease" data-id="${item.id}" aria-label="Decrease ${item.name}">−</button><strong>${item.quantity}</strong><button type="button" data-action="increase" data-id="${item.id}" aria-label="Increase ${item.name}">+</button></div>
          </div>
          <div class="item-actions"><strong>${formatPrice(item.price * item.quantity)}</strong><br><button class="remove-btn" type="button" data-action="remove" data-id="${item.id}">Remove</button></div>
        </article>`).join("");
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("cartSubtotal").textContent = formatPrice(total);
    document.getElementById("cartTotal").textContent = formatPrice(total);
  }
  cartItemsElement.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const cart = getCart();
    const item = cart.find((product) => product.id === button.dataset.id);
    if (!item) return;
    if (button.dataset.action === "increase") item.quantity += 1;
    if (button.dataset.action === "decrease") item.quantity -= 1;
    let updated = cart.filter((product) => product.quantity > 0);
    if (button.dataset.action === "remove") updated = cart.filter((product) => product.id !== button.dataset.id);
    saveCart(updated);
    renderCart();
  });
  renderCart();
}

const checkoutButton = document.getElementById("checkoutBtn");
if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    const message = document.getElementById("checkoutMessage");
    if (getCart().length === 0) {
      message.textContent = "Your cart is empty. Add a coffee first.";
      message.className = "form-message error";
      return;
    }
    message.textContent = "This is a demo checkout. Online payment and order submission are not connected yet.";
    message.className = "form-message success";
  });
}
