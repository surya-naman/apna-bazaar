// vendor.js - vendor dashboard: statistics, add/edit/delete products, manage orders.
// (Prototype: there is no login, anyone who opens this page can act as a vendor.)

let editingProductId = null;   // null = adding a new product, a number = editing that product

// Orders that are not cancelled count as sales
function getSalesOrders() {
  return loadData(KEYS.orders, []).filter(function (o) { return o.status !== 'Cancelled'; });
}

function showStats() {
  const products = getProducts();
  const orders = loadData(KEYS.orders, []);
  let sales = 0, unitsSold = 0;
  getSalesOrders().forEach(function (o) {
    sales += o.total;
    o.items.forEach(function (i) { unitsSold += i.qty; });
  });
  const lowStock = products.filter(function (p) { return p.stock <= 10; }).length;
  const cards = [['Total Products', products.length], ['Total Orders', orders.length], ['Total Sales', formatPrice(sales)],
                 ['Units Sold', unitsSold], ['Low / Out of Stock', lowStock]];
  document.getElementById('vendor-stats').innerHTML = cards.map(function (c) {
    return '<div class="stat-card">' + c[0] + '<strong>' + c[1] + '</strong></div>';
  }).join('');
}

function fillFormOptions() {
  document.getElementById('p-category').innerHTML = loadData(KEYS.categories, []).map(function (c) {
    return '<option value="' + c.name + '">' + c.name + '</option>';
  }).join('');
  document.getElementById('vendor-names').innerHTML = loadData(KEYS.vendors, []).map(function (v) {
    return '<option value="' + escapeHtml(v.name) + '">';
  }).join('');
}

function showProductTable() {
  const products = getProducts();
  if (products.length === 0) {
    document.getElementById('product-table').innerHTML = '<p class="empty-box">No products yet. Add your first product above.</p>';
    return;
  }
  let rows = '';
  products.forEach(function (p) {
    rows += '<tr><td><img src="' + escapeHtml(p.image || DEFAULT_IMAGE) + '" alt="" onerror="this.onerror=null;this.src=\'' + DEFAULT_IMAGE + '\'"></td>' +
      '<td>' + escapeHtml(p.name) + '</td><td>' + escapeHtml(p.category) + '</td><td>' + formatPrice(p.price) + '</td>' +
      '<td>' + p.stock + '</td><td>' + escapeHtml(p.vendor) + '</td>' +
      '<td><button class="btn btn-small" onclick="startEdit(' + p.id + ')">Edit</button> <button class="btn btn-danger btn-small" onclick="deleteProduct(' + p.id + ')">Delete</button></td></tr>';
  });
  document.getElementById('product-table').innerHTML = '<table><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Vendor</th><th>Actions</th></tr>' + rows + '</table>';
}

function showOrderTable() {
  const orders = loadData(KEYS.orders, []).slice().reverse();
  if (orders.length === 0) {
    document.getElementById('order-table').innerHTML = '<p class="empty-box">No customer orders yet.</p>';
    return;
  }
  let rows = '';
  orders.forEach(function (o) {
    const items = o.items.map(function (i) { return escapeHtml(i.name) + ' × ' + i.qty; }).join('<br>');
    // A cancelled order cannot be changed again
    let options = '';
    ORDER_STATUSES.forEach(function (s) { options += '<option' + (s === o.status ? ' selected' : '') + '>' + s + '</option>'; });
    const select = '<select onchange="updateOrderStatus(\'' + o.orderId + '\', this.value)"' + (o.status === 'Cancelled' ? ' disabled' : '') + '>' + options + '</select>';
    rows += '<tr><td>' + o.orderId + '<br><span class="small-text">' + formatDate(o.date) + '</span></td><td>' + escapeHtml(o.customer.name) + '<br><span class="small-text">' + escapeHtml(o.customer.mobile) + '</span></td>' +
      '<td>' + items + '</td><td>' + formatPrice(o.total) + '<br><span class="small-text">' + escapeHtml(o.paymentMethod) + '</span></td><td>' + select + '</td></tr>';
  });
  document.getElementById('order-table').innerHTML = '<table><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr>' + rows + '</table>';
}

function updateOrderStatus(orderId, newStatus) {
  const orders = loadData(KEYS.orders, []);
  const order = orders.find(function (o) { return o.orderId === orderId; });
  if (!order) return;
  if (newStatus === 'Cancelled') restoreStock(order);   // cancelled order gives stock back
  order.status = newStatus;
  saveData(KEYS.orders, orders);
  showMessage('Order ' + orderId + ' is now ' + newStatus);
  refreshDashboard();
}

// ----- add / edit product form -----
function saveProduct(event) {
  event.preventDefault();
  const name = document.getElementById('p-name').value.trim();
  const category = document.getElementById('p-category').value;
  const price = parseFloat(document.getElementById('p-price').value);
  const stockText = document.getElementById('p-stock').value.trim();
  const stock = parseInt(stockText, 10);
  const vendorName = document.getElementById('p-vendor').value.trim();
  const image = document.getElementById('p-image').value.trim();
  const description = document.getElementById('p-description').value.trim();

  const errors = [];
  if (name.length < 2) errors.push('Product name is required.');
  if (isNaN(price) || price <= 0) errors.push('Price must be greater than 0.');
  if (stockText === '' || isNaN(stock) || stock < 0) errors.push('Stock must be 0 or more.');
  if (vendorName.length < 2) errors.push('Vendor name is required.');
  if (description.length < 3) errors.push('Please add a short description.');
  const errorBox = document.getElementById('vendor-errors');
  if (errors.length > 0) {
    errorBox.innerHTML = '<ul><li>' + errors.join('</li><li>') + '</li></ul>';
    errorBox.style.display = 'block';
    return;
  }
  errorBox.style.display = 'none';

  const products = getProducts();
  if (editingProductId === null) {
    const newId = products.length ? Math.max.apply(null, products.map(function (p) { return p.id; })) + 1 : 1;
    products.push({ id: newId, name: name, category: category, price: price, stock: stock, vendor: vendorName, description: description, image: image || DEFAULT_IMAGE });
    showMessage('Product added');
  } else {
    const product = products.find(function (p) { return p.id === editingProductId; });
    product.name = name; product.category = category; product.price = price; product.stock = stock;
    product.vendor = vendorName; product.description = description; product.image = image || DEFAULT_IMAGE;
    showMessage('Product updated');
  }
  saveData(KEYS.products, products);

  // If this is a new vendor name, add the vendor to the vendor list
  const vendors = loadData(KEYS.vendors, []);
  if (!vendors.some(function (v) { return v.name === vendorName; })) {
    vendors.push({ id: vendors.length + 1, name: vendorName, area: 'Local vendor', speciality: 'New vendor' });
    saveData(KEYS.vendors, vendors);
  }
  resetForm();
  fillFormOptions();
  refreshDashboard();
}

function startEdit(productId) {
  const p = getProductById(productId);
  if (!p) return;
  editingProductId = productId;
  document.getElementById('p-name').value = p.name;
  document.getElementById('p-category').value = p.category;
  document.getElementById('p-price').value = p.price;
  document.getElementById('p-stock').value = p.stock;
  document.getElementById('p-vendor').value = p.vendor;
  document.getElementById('p-image').value = p.image;
  document.getElementById('p-description').value = p.description;
  document.getElementById('form-title').textContent = 'Edit Product';
  document.getElementById('save-button').textContent = 'Update Product';
  document.getElementById('cancel-edit').style.display = 'inline-block';
  document.getElementById('product-form-box').scrollIntoView({ behavior: 'smooth' });
}
function resetForm() {
  editingProductId = null;
  document.getElementById('product-form').reset();
  document.getElementById('form-title').textContent = 'Add New Product';
  document.getElementById('save-button').textContent = 'Add Product';
  document.getElementById('cancel-edit').style.display = 'none';
  document.getElementById('vendor-errors').style.display = 'none';
}
function deleteProduct(productId) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  saveData(KEYS.products, getProducts().filter(function (p) { return p.id !== productId; }));
  saveCart(getCart().filter(function (i) { return i.id !== productId; }));
  if (editingProductId === productId) resetForm();
  showMessage('Product deleted');
  refreshDashboard();
}

function refreshDashboard() { showStats(); showProductTable(); showOrderTable(); }

fillFormOptions();
refreshDashboard();
document.getElementById('product-form').addEventListener('submit', saveProduct);
document.getElementById('cancel-edit').addEventListener('click', resetForm);
