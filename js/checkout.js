// checkout.js - checkout form, validation and order placement.

function showSummary() {
  const details = getCartDetails();
  if (details.length === 0) {
    document.getElementById('checkout-layout').style.display = 'none';
    const box = document.getElementById('checkout-empty');
    box.style.display = 'block';
    box.innerHTML = '<h2>🛒 Your cart is empty</h2><p>Add some products before checking out.</p><br><a class="btn" href="products.html">Go to Products</a>';
    return false;
  }
  const totals = calculateTotals(details);
  let html = '<h2>Your Items</h2>';
  details.forEach(function (d) {
    html += '<div class="summary-line"><span>' + escapeHtml(d.product.name) + ' × ' + d.qty + '</span><span>' + formatPrice(d.product.price * d.qty) + '</span></div>';
  });
  html += '<div class="summary-line"><span>Subtotal</span><span>' + formatPrice(totals.subtotal) + '</span></div>' +
    '<div class="summary-line"><span>Delivery</span><span>' + (totals.delivery === 0 ? 'FREE' : formatPrice(totals.delivery)) + '</span></div>' +
    '<div class="summary-line summary-total"><span>Total</span><span>' + formatPrice(totals.total) + '</span></div>';
  document.getElementById('checkout-summary').innerHTML = html;
  return true;
}

// Returns a list of error messages (empty list = form is valid)
function validateForm(data) {
  const errors = [];
  if (data.name.length < 3) errors.push('Enter your full name (at least 3 characters).');
  if (!/^[6-9][0-9]{9}$/.test(data.mobile)) errors.push('Enter a valid 10 digit mobile number starting with 6, 7, 8 or 9.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) errors.push('Enter a valid email address.');
  if (data.address.length < 10) errors.push('Enter your full delivery address (at least 10 characters).');
  if (data.city.length < 2) errors.push('Enter your city.');
  if (!/^[0-9]{6}$/.test(data.pincode)) errors.push('Enter a valid 6 digit pincode.');
  return errors;
}

function placeOrder(event) {
  event.preventDefault();
  const data = {
    name: document.getElementById('c-name').value.trim(),
    mobile: document.getElementById('c-mobile').value.trim(),
    email: document.getElementById('c-email').value.trim(),
    address: document.getElementById('c-address').value.trim(),
    city: document.getElementById('c-city').value.trim(),
    pincode: document.getElementById('c-pincode').value.trim()
  };
  const errors = validateForm(data);
  const errorBox = document.getElementById('form-errors');
  if (errors.length > 0) {
    errorBox.innerHTML = '<ul><li>' + errors.join('</li><li>') + '</li></ul>';
    errorBox.style.display = 'block';
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  errorBox.style.display = 'none';

  const details = getCartDetails();   // re-check stock one more time
  if (details.length === 0) { showSummary(); return; }

  const totals = calculateTotals(details);
  const items = details.map(function (d) {
    return { productId: d.product.id, name: d.product.name, price: d.product.price, qty: d.qty, vendor: d.product.vendor };
  });
  const order = {
    orderId: 'AB' + Date.now(),             // unique because time in milliseconds never repeats
    date: new Date().toISOString(),
    customer: data,
    items: items,
    subtotal: totals.subtotal, delivery: totals.delivery, total: totals.total,
    paymentMethod: document.querySelector('input[name="payment"]:checked').value,
    status: 'Pending'
  };

  // 1. save the order
  const orders = loadData(KEYS.orders, []);
  orders.push(order);
  saveData(KEYS.orders, orders);
  // 2. reduce stock
  const products = getProducts();
  items.forEach(function (item) {
    const product = products.find(function (p) { return p.id === item.productId; });
    if (product) product.stock -= item.qty;
  });
  saveData(KEYS.products, products);
  // 3. clear the cart
  saveCart([]);
  // 4. show confirmation
  document.getElementById('checkout-layout').style.display = 'none';
  const box = document.getElementById('confirmation');
  box.style.display = 'block';
  box.innerHTML = '<h2>✅ Order Placed Successfully!</h2><p>Thank you, ' + escapeHtml(data.name) + '.</p>' +
    '<p>Your Order ID is <strong>' + order.orderId + '</strong></p><p>Total: <strong>' + formatPrice(order.total) + '</strong> (' + order.paymentMethod + ')</p>' +
    '<p class="note">This is a demo order. No real payment was taken.</p><br>' +
    '<a class="btn" href="orders.html">View My Orders</a> <a class="btn btn-outline" href="products.html">Continue Shopping</a>';
  window.scrollTo(0, 0);
}

if (showSummary()) {
  document.getElementById('checkout-form').addEventListener('submit', placeOrder);
}
