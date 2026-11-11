// main.js - code shared by EVERY page: localStorage helpers, sample data, navbar, footer, cart helpers.
// It must be loaded first (before the other js files).

// All localStorage keys are written here ONCE, so every page uses the same names.
const KEYS = {
  products: 'ab_products', vendors: 'ab_vendors', categories: 'ab_categories',
  orders: 'ab_orders', reviews: 'ab_reviews', cart: 'ab_cart'
};
const DELIVERY_FEE = 40;            // delivery charge in rupees
const FREE_DELIVERY_ABOVE = 500;    // no delivery charge above this subtotal
const DEFAULT_IMAGE = 'images/default.svg';
const ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

// ---------- localStorage helpers ----------
// Read data from localStorage (returns "fallback" if nothing is saved yet)
function loadData(key, fallback) {
  try {
    const text = localStorage.getItem(key);
    return text ? JSON.parse(text) : fallback;
  } catch (error) {
    return fallback;
  }
}
// Save data to localStorage (objects/arrays are converted to text with JSON.stringify)
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- sample data ----------
function makeProduct(id, name, category, price, stock, vendor, description, imageFile) {
  return { id: id, name: name, category: category, price: price, stock: stock,
           vendor: vendor, description: description, image: 'images/' + imageFile };
}

// Saves sample data ONLY if that key does not exist yet, so user changes are never overwritten.
function seedData() {
  if (localStorage.getItem(KEYS.categories) === null) {
    saveData(KEYS.categories, [
      { name: 'Fruits', icon: '🍎' }, { name: 'Vegetables', icon: '🥕' }, { name: 'Dairy', icon: '🥛' },
      { name: 'Grocery', icon: '🛒' }, { name: 'Bakery', icon: '🍞' }
    ]);
  }
  if (localStorage.getItem(KEYS.vendors) === null) {
    saveData(KEYS.vendors, [
      { id: 1, name: 'Sharma Fruit Corner', area: 'Model Town, Ludhiana', speciality: 'Fresh seasonal fruits' },
      { id: 2, name: 'Gupta Sabzi Mandi', area: 'Sarabha Nagar, Ludhiana', speciality: 'Farm fresh vegetables' },
      { id: 3, name: 'Punjab Dairy Farm', area: 'Dugri, Ludhiana', speciality: 'Milk, paneer and curd' },
      { id: 4, name: 'Kaur Kirana Store', area: 'BRS Nagar, Ludhiana', speciality: 'Daily grocery items' },
      { id: 5, name: 'Ludhiana Bakery House', area: 'Pakhowal Road, Ludhiana', speciality: 'Bread, cakes and biscuits' }
    ]);
  }
  if (localStorage.getItem(KEYS.products) === null) {
    saveData(KEYS.products, [
      makeProduct(1, 'Kashmiri Apples (1 kg)', 'Fruits', 150, 40, 'Sharma Fruit Corner', 'Crisp and sweet red apples.', 'apple.svg'),
      makeProduct(2, 'Bananas (1 dozen)', 'Fruits', 60, 60, 'Sharma Fruit Corner', 'Ripe yellow bananas, rich in energy.', 'banana.svg'),
      makeProduct(3, 'Dasheri Mangoes (1 kg)', 'Fruits', 120, 25, 'Sharma Fruit Corner', 'Juicy and sweet seasonal mangoes.', 'mango.svg'),
      makeProduct(4, 'Oranges (1 kg)', 'Fruits', 80, 50, 'Sharma Fruit Corner', 'Fresh juicy oranges full of vitamin C.', 'orange.svg'),
      makeProduct(5, 'Black Grapes (1 kg)', 'Fruits', 90, 0, 'Sharma Fruit Corner', 'Seedless sweet black grapes.', 'grapes.svg'),
      makeProduct(6, 'Tomatoes (1 kg)', 'Vegetables', 40, 80, 'Gupta Sabzi Mandi', 'Red firm tomatoes for daily cooking.', 'tomato.svg'),
      makeProduct(7, 'Potatoes (1 kg)', 'Vegetables', 30, 100, 'Gupta Sabzi Mandi', 'Fresh potatoes, great for every dish.', 'potato.svg'),
      makeProduct(8, 'Onions (1 kg)', 'Vegetables', 35, 90, 'Gupta Sabzi Mandi', 'Good quality red onions.', 'onion.svg'),
      makeProduct(9, 'Carrots (1 kg)', 'Vegetables', 45, 6, 'Gupta Sabzi Mandi', 'Sweet orange carrots, ideal for gajar halwa.', 'carrot.svg'),
      makeProduct(10, 'Full Cream Milk (1 L)', 'Dairy', 66, 50, 'Punjab Dairy Farm', 'Fresh full cream milk delivered daily.', 'milk.svg'),
      makeProduct(11, 'Fresh Paneer (250 g)', 'Dairy', 90, 20, 'Punjab Dairy Farm', 'Soft homemade-style paneer.', 'paneer.svg'),
      makeProduct(12, 'Curd (500 g)', 'Dairy', 40, 35, 'Punjab Dairy Farm', 'Thick and creamy set curd.', 'curd.svg'),
      makeProduct(13, 'Desi Butter (100 g)', 'Dairy', 58, 30, 'Punjab Dairy Farm', 'Rich traditional white butter.', 'butter.svg'),
      makeProduct(14, 'Basmati Rice (5 kg)', 'Grocery', 450, 15, 'Kaur Kirana Store', 'Long grain aromatic basmati rice.', 'rice.svg'),
      makeProduct(15, 'Wheat Atta (5 kg)', 'Grocery', 240, 30, 'Kaur Kirana Store', 'Stone ground whole wheat flour.', 'atta.svg'),
      makeProduct(16, 'Toor Dal (1 kg)', 'Grocery', 140, 40, 'Kaur Kirana Store', 'Clean and protein rich arhar dal.', 'dal.svg'),
      makeProduct(17, 'Mustard Oil (1 L)', 'Grocery', 175, 25, 'Kaur Kirana Store', 'Pure kachi ghani mustard oil.', 'oil.svg'),
      makeProduct(18, 'Brown Bread (400 g)', 'Bakery', 45, 30, 'Ludhiana Bakery House', 'Soft and healthy whole wheat bread.', 'bread.svg'),
      makeProduct(19, 'Chocolate Cake (500 g)', 'Bakery', 350, 8, 'Ludhiana Bakery House', 'Rich chocolate cake, baked fresh.', 'cake.svg'),
      makeProduct(20, 'Butter Biscuits (250 g)', 'Bakery', 50, 45, 'Ludhiana Bakery House', 'Crunchy butter biscuits for tea time.', 'biscuits.svg')
    ]);
  }
  if (localStorage.getItem(KEYS.orders) === null) {
    saveData(KEYS.orders, [{
      orderId: 'AB1001', date: new Date(Date.now() - 2 * 86400000).toISOString(),
      customer: { name: 'Rohan Verma', mobile: '9876500001', email: 'rohan@example.com', address: '12 Model Town', city: 'Ludhiana', pincode: '141002' },
      items: [
        { productId: 1, name: 'Kashmiri Apples (1 kg)', price: 150, qty: 2, vendor: 'Sharma Fruit Corner' },
        { productId: 10, name: 'Full Cream Milk (1 L)', price: 66, qty: 3, vendor: 'Punjab Dairy Farm' }
      ],
      subtotal: 498, delivery: 40, total: 538, paymentMethod: 'Cash on Delivery', status: 'Delivered'
    }]);
  }
  if (localStorage.getItem(KEYS.reviews) === null) {
    saveData(KEYS.reviews, [
      { id: 1, productId: 1, name: 'Rohan Verma', rating: 5, comment: 'Very fresh and sweet apples.', date: new Date().toISOString() },
      { id: 2, productId: 10, name: 'Simran Kaur', rating: 4, comment: 'Good milk, delivered on time.', date: new Date().toISOString() },
      { id: 3, productId: 18, name: 'Aman Singh', rating: 5, comment: 'Bread was soft and fresh.', date: new Date().toISOString() }
    ]);
  }
  if (localStorage.getItem(KEYS.cart) === null) saveData(KEYS.cart, []);
}

// ---------- small helper functions ----------
// Stops user-typed text from being treated as HTML (safety when we build HTML strings)
function escapeHtml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                     .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function formatPrice(amount) {
  const number = Number(amount);
  return '₹' + (Number.isInteger(number) ? number : number.toFixed(2));
}
function formatDate(isoText) {
  return new Date(isoText).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function getProducts() { return loadData(KEYS.products, []); }
function getProductById(id) { return getProducts().find(function (p) { return p.id === id; }); }

// Shows a small message at the bottom of the screen for 2 seconds
function showMessage(text, type) {
  const old = document.getElementById('toast');
  if (old) old.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast' + (type === 'error' ? ' error' : '');
  toast.textContent = text;
  document.body.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 2200);
}

// ---------- cart helpers (cart is a list like [{id: 1, qty: 2}]) ----------
function getCart() { return loadData(KEYS.cart, []); }
function saveCart(cart) { saveData(KEYS.cart, cart); updateCartBadge(); }
function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  badge.textContent = getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

// Add one piece of a product to the cart (never more than the available stock)
function addToCart(productId) {
  const product = getProductById(productId);
  if (!product || product.stock <= 0) { showMessage('Sorry, this product is out of stock.', 'error'); return; }
  const cart = getCart();
  const item = cart.find(function (i) { return i.id === productId; });
  if (item) {
    if (item.qty >= product.stock) { showMessage('Only ' + product.stock + ' available in stock.', 'error'); return; }
    item.qty++;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  showMessage(product.name + ' added to cart');
}

// Returns cart items together with their product details.
// It also cleans the cart: removes deleted/out-of-stock products and reduces quantity to the stock limit.
function getCartDetails() {
  const cart = getCart();
  const details = [];
  const cleanCart = [];
  cart.forEach(function (item) {
    const product = getProductById(item.id);
    if (!product || product.stock <= 0) return;
    const qty = Math.min(item.qty, product.stock);
    cleanCart.push({ id: item.id, qty: qty });
    details.push({ product: product, qty: qty });
  });
  if (JSON.stringify(cleanCart) !== JSON.stringify(cart)) saveCart(cleanCart);
  return details;
}

// Subtotal + delivery fee + total for a list of cart details
function calculateTotals(details) {
  let subtotal = 0;
  details.forEach(function (d) { subtotal += d.product.price * d.qty; });
  let delivery = 0;
  if (subtotal > 0 && subtotal < FREE_DELIVERY_ABOVE) delivery = DELIVERY_FEE;
  return { subtotal: subtotal, delivery: delivery, total: subtotal + delivery };
}

// Put the stock back when an order is cancelled
function restoreStock(order) {
  const products = getProducts();
  order.items.forEach(function (item) {
    const product = products.find(function (p) { return p.id === item.productId; });
    if (product) product.stock += item.qty;
  });
  saveData(KEYS.products, products);
}

// ---------- navbar and footer (written once here, shown on every page) ----------
function renderNavbar() {
  const holder = document.getElementById('navbar');
  if (!holder) return;
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const pages = [
    ['index.html', 'Home'], ['products.html', 'Products'], ['orders.html', 'My Orders'],
    ['vendor.html', 'Vendor'], ['admin.html', 'Admin'], ['about.html', 'About'],
    ['cart.html', '🛒 Cart <span id="cart-count" class="badge">0</span>']
  ];
  let linksHtml = '';
  pages.forEach(function (page) {
    const activeClass = page[0] === currentPage ? ' class="active"' : '';
    linksHtml += '<a href="' + page[0] + '"' + activeClass + '>' + page[1] + '</a>';
  });
  holder.innerHTML =
    '<nav class="navbar"><div class="container nav-inner">' +
    '<a class="logo" href="index.html">🛒 Apna <span>Bazaar</span></a>' +
    '<button class="menu-button" id="menu-button" aria-label="Open menu">☰</button>' +
    '<div class="nav-menu" id="nav-menu">' +
    '<form class="search-form" id="search-form"><input type="search" id="search-input" placeholder="Search products..."><button type="submit">🔍</button></form>' +
    '<div class="nav-links">' + linksHtml + '</div></div></div></nav>';

  document.getElementById('search-input').value = new URLSearchParams(location.search).get('search') || '';
  // Search: go to the products page with the search word in the address
  document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const word = document.getElementById('search-input').value.trim();
    location.href = 'products.html' + (word ? '?search=' + encodeURIComponent(word) : '');
  });
  // Mobile menu button
  document.getElementById('menu-button').addEventListener('click', function () {
    document.getElementById('nav-menu').classList.toggle('open');
  });
}

function renderFooter() {
  const holder = document.getElementById('footer');
  if (!holder) return;
  holder.innerHTML =
    '<footer class="footer"><div class="container"><div class="footer-grid">' +
    '<div><h3>🛒 Apna Bazaar</h3><p>Your local market, online.</p></div>' +
    '<div><h3>Quick Links</h3><p><a href="products.html">Products</a></p><p><a href="orders.html">My Orders</a></p><p><a href="about.html">About &amp; Contact</a></p></div>' +
    '<div><h3>Contact</h3><p>📍 Ludhiana, Punjab, India</p><p>📞 +91 98765 43210</p><p>✉️ support@apnabazaar.example</p></div>' +
    '</div><p class="copyright">© 2026 Apna Bazaar | College project (demo data stored in your browser)</p></div></footer>';
}

// ---------- run on every page ----------
seedData();
renderNavbar();
renderFooter();
updateCartBadge();
