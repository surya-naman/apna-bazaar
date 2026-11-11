// admin.js - admin dashboard: totals, recent orders, product and vendor overview.

function showAdminStats() {
  const products = getProducts();
  const orders = loadData(KEYS.orders, []);
  const vendors = loadData(KEYS.vendors, []);
  let sales = 0;
  orders.forEach(function (o) { if (o.status !== 'Cancelled') sales += o.total; });   // cancelled orders are not sales
  const cards = [['Total Vendors', vendors.length], ['Total Products', products.length], ['Total Orders', orders.length], ['Total Demo Sales', formatPrice(sales)]];
  document.getElementById('admin-stats').innerHTML = cards.map(function (c) {
    return '<div class="stat-card">' + c[0] + '<strong>' + c[1] + '</strong></div>';
  }).join('');
}

function showRecentOrders() {
  const recent = loadData(KEYS.orders, []).slice(-5).reverse();   // last 5 orders
  if (recent.length === 0) { document.getElementById('recent-orders').innerHTML = '<p class="empty-box">No orders yet.</p>'; return; }
  const rows = recent.map(function (o) {
    return '<tr><td>' + o.orderId + '</td><td>' + formatDate(o.date) + '</td><td>' + escapeHtml(o.customer.name) + '</td><td>' + formatPrice(o.total) +
      '</td><td><span class="status status-' + o.status + '">' + o.status + '</span></td></tr>';
  }).join('');
  document.getElementById('recent-orders').innerHTML = '<table><tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Total</th><th>Status</th></tr>' + rows + '</table>';
}

function showProductOverview() {
  const products = getProducts();
  if (products.length === 0) { document.getElementById('product-overview').innerHTML = '<p class="empty-box">No products.</p>'; return; }
  const rows = products.map(function (p) {
    return '<tr><td>' + escapeHtml(p.name) + '</td><td>' + escapeHtml(p.category) + '</td><td>' + formatPrice(p.price) + '</td><td>' +
      (p.stock === 0 ? '<span class="out-stock">Out of stock</span>' : p.stock) + '</td><td>' + escapeHtml(p.vendor) + '</td></tr>';
  }).join('');
  document.getElementById('product-overview').innerHTML = '<table><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Vendor</th></tr>' + rows + '</table>';
}

function showVendorOverview() {
  const products = getProducts();
  const orders = loadData(KEYS.orders, []);
  const rows = loadData(KEYS.vendors, []).map(function (v) {
    const productCount = products.filter(function (p) { return p.vendor === v.name; }).length;
    let sales = 0;   // sales of this vendor = items sold by them in non-cancelled orders
    orders.forEach(function (o) {
      if (o.status === 'Cancelled') return;
      o.items.forEach(function (i) { if (i.vendor === v.name) sales += i.price * i.qty; });
    });
    return '<tr><td>' + escapeHtml(v.name) + '</td><td>' + escapeHtml(v.area) + '</td><td>' + productCount + '</td><td>' + formatPrice(sales) + '</td></tr>';
  }).join('');
  document.getElementById('vendor-overview').innerHTML = '<table><tr><th>Vendor</th><th>Area</th><th>Products</th><th>Sales</th></tr>' + rows + '</table>';
}

// Delete all saved data and let main.js create the sample data again
document.getElementById('reset-button').addEventListener('click', function () {
  if (!confirm('Reset all demo data? Your products, orders, reviews and cart will be deleted.')) return;
  Object.values(KEYS).forEach(function (key) { localStorage.removeItem(key); });
  location.reload();
});

showAdminStats();
showRecentOrders();
showProductOverview();
showVendorOverview();
