// cart.js - shopping cart page: show items, change quantity, remove, totals.

function showCart() {
  const holder = document.getElementById('cart-content');
  const details = getCartDetails();

  // Empty cart message
  if (details.length === 0) {
    holder.innerHTML = '<div class="empty-box"><h2>🛒 Your cart is empty</h2><p>Looks like you have not added anything yet.</p><br><a class="btn" href="products.html">Start Shopping</a></div>';
    return;
  }

  let rows = '';
  details.forEach(function (d) {
    const p = d.product;
    rows += '<div class="cart-row">' +
      '<img src="' + escapeHtml(p.image || DEFAULT_IMAGE) + '" alt="' + escapeHtml(p.name) + '" onerror="this.onerror=null;this.src=\'' + DEFAULT_IMAGE + '\'">' +
      '<div class="cart-info"><h3>' + escapeHtml(p.name) + '</h3><p class="small-text">🏪 ' + escapeHtml(p.vendor) + '</p>' +
      '<p>' + formatPrice(p.price) + ' each</p></div>' +
      '<div class="qty-box"><button onclick="changeQuantity(' + p.id + ', -1)" aria-label="Decrease">−</button>' +
      '<strong>' + d.qty + '</strong>' +
      '<button onclick="changeQuantity(' + p.id + ', 1)" aria-label="Increase"' + (d.qty >= p.stock ? ' disabled' : '') + '>+</button></div>' +
      '<strong>' + formatPrice(p.price * d.qty) + '</strong>' +
      '<button class="btn btn-danger btn-small" onclick="removeFromCart(' + p.id + ')">Remove</button></div>';
  });

  const totals = calculateTotals(details);
  const deliveryText = totals.delivery === 0 ? 'FREE' : formatPrice(totals.delivery);
  const hint = totals.delivery > 0 ? '<p class="note">Add items worth ' + formatPrice(FREE_DELIVERY_ABOVE - totals.subtotal) + ' more for free delivery.</p>' : '';
  holder.innerHTML = '<div class="two-column"><div>' + rows + '</div>' +
    '<div class="card"><h2>Order Summary</h2>' +
    '<div class="summary-line"><span>Subtotal</span><span>' + formatPrice(totals.subtotal) + '</span></div>' +
    '<div class="summary-line"><span>Delivery</span><span>' + deliveryText + '</span></div>' +
    '<div class="summary-line summary-total"><span>Total</span><span>' + formatPrice(totals.total) + '</span></div>' + hint +
    '<a class="btn btn-block" href="checkout.html" style="text-align:center">Proceed to Checkout</a>' +
    '<button class="btn btn-outline btn-block" onclick="clearCart()">Clear Cart</button></div></div>';
}

// change = +1 or -1
function changeQuantity(productId, change) {
  const product = getProductById(productId);
  const cart = getCart();
  const item = cart.find(function (i) { return i.id === productId; });
  if (!item || !product) return;
  const newQty = item.qty + change;
  if (newQty > product.stock) { showMessage('Only ' + product.stock + ' available in stock.', 'error'); return; }
  if (newQty < 1) { removeFromCart(productId); return; }
  item.qty = newQty;
  saveCart(cart);
  showCart();
}
function removeFromCart(productId) {
  saveCart(getCart().filter(function (i) { return i.id !== productId; }));
  showCart();
}
function clearCart() {
  if (confirm('Remove all items from your cart?')) { saveCart([]); showCart(); }
}

showCart();
