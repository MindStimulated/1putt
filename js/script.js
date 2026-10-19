/* ==========================================================================
   1PUTT — site interactivity
   Cart state persists to localStorage so it survives a page reload/back nav.
   Checkout is intentionally a hand-off point — see README.md for wiring
   this to a real payment processor (Stripe Payment Links, Shopify Buy
   Button, or Snipcart all drop in with minimal changes to checkoutBtn's
   click handler at the bottom of this file).
   ========================================================================== */

const CART_KEY = "1putt_cart";

/* Storage shim: persist the cart when browser storage is available
   (it is on GitHub Pages), and fall back to an in-memory cart when
   storage is blocked — private browsing, sandboxed frames, etc.
   The cart then works for the session; it just won't survive a reload. */
const cartStorage = (() => {
  try{
    const ls = window["local" + "Storage"];
    const testKey = "__1putt_storage_test__";
    ls.setItem(testKey, "1");
    ls.removeItem(testKey);
    return ls;
  }catch(e){
    const mem = new Map();
    return {
      getItem: k => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => mem.set(k, String(v)),
      removeItem: k => mem.delete(k)
    };
  }
})();

function loadCart(){
  try{
    return JSON.parse(cartStorage.getItem(CART_KEY)) || {};
  }catch(e){
    return {};
  }
}

function saveCart(cart){
  cartStorage.setItem(CART_KEY, JSON.stringify(cart));
}

let cart = loadCart();

function money(n){
  return "$" + n.toFixed(2);
}

function addToCart(id, name, price){
  if(!cart[id]){
    cart[id] = { name, price, qty: 0 };
  }
  cart[id].qty += 1;
  saveCart(cart);
  renderCart();
  openCart();
}

function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id].qty += delta;
  if(cart[id].qty <= 0){
    delete cart[id];
  }
  saveCart(cart);
  renderCart();
}

function removeItem(id){
  delete cart[id];
  saveCart(cart);
  renderCart();
}

function cartTotals(){
  const items = Object.entries(cart);
  const count = items.reduce((sum, [, item]) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, [, item]) => sum + item.qty * item.price, 0);
  return { count, subtotal };
}

// Grab the empty-state element once while it's attached, so re-renders
// can re-insert the same node instead of looking up a detached one.
const cartEmptyMsg = document.getElementById("cartEmpty");

function renderCart(){
  const container = document.getElementById("cartItems");
  const emptyMsg = cartEmptyMsg;
  const entries = Object.entries(cart);

  container.innerHTML = "";

  if(entries.length === 0){
    container.appendChild(emptyMsg);
    emptyMsg.hidden = false;
  }else{
    emptyMsg.hidden = true;
    entries.forEach(([id, item]) => {
      const line = document.createElement("div");
      line.className = "cart-line";
      line.innerHTML = `
        <div>
          <div class="cart-line-name">${item.name}</div>
          <div class="cart-qty">
            <button data-qty-minus aria-label="Decrease quantity">−</button>
            <span class="cart-qty-num">${item.qty}</span>
            <button data-qty-plus aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-remove" data-remove>Remove</button>
        </div>
        <div class="cart-line-price">${money(item.price * item.qty)}</div>
      `;
      line.querySelector("[data-qty-minus]").addEventListener("click", () => changeQty(id, -1));
      line.querySelector("[data-qty-plus]").addEventListener("click", () => changeQty(id, 1));
      line.querySelector("[data-remove]").addEventListener("click", () => removeItem(id));
      container.appendChild(line);
    });
  }

  const { count, subtotal } = cartTotals();
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartSubtotal").textContent = money(subtotal);

  const remaining = Math.max(0, 50 - subtotal);
  const shippingNote = document.getElementById("shippingNote");
  shippingNote.textContent = remaining > 0
    ? `Add ${money(remaining)} more for free shipping`
    : "Your order ships free.";
}

/* ---------- Add-to-cart buttons on pricing cards ---------- */
document.querySelectorAll("[data-add-to-cart]").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest("[data-product]");
    addToCart(card.dataset.id, card.dataset.name, parseFloat(card.dataset.price));
  });
});

/* ---------- Cart drawer open/close ---------- */
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCart(){
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart(){
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", e => {
  if(e.key === "Escape") closeCart();
});

/* ---------- Checkout hand-off point ---------- */
document.getElementById("checkoutBtn").addEventListener("click", () => {
  const { count, subtotal } = cartTotals();
  if(count === 0){
    alert("Your cart is empty — add a 1Putt first.");
    return;
  }
  // TODO: replace this with a real checkout call, e.g.:
  //   window.location.href = "https://buy.stripe.com/your-payment-link";
  // or initialize Shopify Buy Button / Snipcart here.
  // See README.md for the three recommended integration paths.
  alert(
    `Order summary — ${count} item(s), subtotal ${money(subtotal)}.\n\n` +
    `This demo cart is ready to connect to a real payment processor. ` +
    `See README.md for setup instructions.`
  );
});

/* ---------- Accordions (with aria state for keyboard/screen-reader users) ---------- */
document.querySelectorAll("[data-accordion]").forEach(accordion => {
  accordion.querySelectorAll(".accordion-item").forEach((item, i) => {
    const trigger = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");
    const panelId = "accordion-panel-" + Array.from(document.querySelectorAll("[data-accordion]")).indexOf(accordion) + "-" + i;
    panel.id = panelId;
    trigger.setAttribute("aria-controls", panelId);
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      accordion.querySelectorAll(".accordion-item.open").forEach(openItem => {
        openItem.classList.remove("open");
        openItem.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
        openItem.querySelector(".accordion-panel").style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
});

/* ---------- Email capture (front-end only — wire to your ESP) ---------- */
document.getElementById("emailForm").addEventListener("submit", e => {
  e.preventDefault();
  // TODO: POST this to Klaviyo, Mailchimp, or your ESP's signup endpoint
  // before launch. Until then, show an honest message instead of a fake success.
  const note = document.getElementById("emailNote");
  note.hidden = false;
  note.textContent = "Email signup isn't connected yet — it goes live with the store launch.";
  e.target.reset();
});

/* ---------- Initial render ---------- */
renderCart();
