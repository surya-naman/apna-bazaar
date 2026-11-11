// orders.js - customer order history page.

function showOrders() {
  const holder = document.getElementById('orders-list');
  const orders = loadData(KEYS.orders, []).slice().reverse();   // newest first
  if (orders.length === 0) {
    holder.innerHTML = '<div class="empty-box"><h2>📦 No orders yet</h2><p>Your placed orders will appear here.</p><br><a class="btn" href="products.html">Start Shopping</a></div>';
    return;
  }
  holder.innerHTML = orders.map(function (order) {
    const itemsHtml = order.items.map(function (i) {
      return '<tr><td>' + escapeHtml(i.name) + '</td><td>' + formatPrice(i.price) + '</td><td>' + i.qty + '</td><td>' + formatPrice(i.price * i.qty) + '</td></tr>';
    }).join('');
    const cancelButton = order.status === 'Pending' ? '<button class="btn btn-danger btn-small" onclick="cancelOrder(\'' + order.orderId + '\')">Cancel Order</button>' : '';
    return '<div class="order-card"><div class="order-head"><div><strong>Order ID: ' + order.orderId + '</strong><br><span class="small-text">' + formatDate(order.date) + '</span></div>' +
      '<span class="status status-' + order.status + '">' + order.status + '</span></div>' +
      '<div class="table-wrap"><table><tr><th>Product</th><th>Price</th><th>Qty</th><th>Amount</th></tr>' + itemsHtml + '</table></div>' +
      '<p style="margin-top:8px">Delivery: ' + (order.delivery === 0 ? 'FREE' : formatPrice(order.delivery)) + ' | <strong>Total: ' + formatPrice(order.total) + '</strong></p>' +
      '<p class="small-text">Payment: ' + escapeHtml(order.paymentMethod) + ' | Deliver to: ' + escapeHtml(order.customer.name) + ', ' + escapeHtml(order.customer.address) + ', ' + escapeHtml(order.customer.city) + ' - ' + escapeHtml(order.customer.pincode) + '</p>' +
      cancelButton + '</div>';
  }).join('');
}

// A customer can cancel only while the order is still Pending
function cancelOrder(orderId) {
  if (!confirm('Cancel this order?')) return;
  const orders = loadData(KEYS.orders, []);
  const order = orders.find(function (o) { return o.orderId === orderId; });
  if (!order || order.status !== 'Pending') return;
  order.status = 'Cancelled';
  restoreStock(order);
  saveData(KEYS.orders, orders);
  showMessage('Order cancelled');
  showOrders();
}

showOrders();
