// products.js - product cards, search, category filter and reviews.
// Used by index.html (home) and products.html.

let selectedCategory = 'All';   // current category filter
let searchText = '';            // current search word
let vendorFilter = '';          // current vendor filter (from vendor cards on home page)
let reviewProductId = null;     // product whose reviews are open in the popup

// ----- ratings -----
function getAverageRating(productId) {
  const list = loadData(KEYS.reviews, []).filter(function (r) { return r.productId === productId; });
  if (list.length === 0) return { average: 0, count: 0 };
  const total = list.reduce(function (sum, r) { return sum + r.rating; }, 0);
  return { average: total / list.length, count: list.length };
}
function starsText(number) {
  const full = Math.round(number);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

// ----- product card (HTML for ONE product) -----
function productCardHTML(product) {
  const rating = getAverageRating(product.id);
  const ratingText = rating.count > 0 ? starsText(rating.average) + ' ' + rating.average.toFixed(1) + ' (' + rating.count + ')' : 'No reviews yet';
  const inStock = product.stock > 0;
  const stockText = inStock ? 'In stock: ' + product.stock : 'Out of stock';
  return '<div class="product-card">' +
    '<img src="' + escapeHtml(product.image || DEFAULT_IMAGE) + '" alt="' + escapeHtml(product.name) + '" onerror="this.onerror=null;this.src=\'' + DEFAULT_IMAGE + '\'">' +
    '<div class="card-body">' +
    '<span class="tag">' + escapeHtml(product.category) + '</span>' +
    '<h3>' + escapeHtml(product.name) + '</h3>' +
    '<p class="small-text">🏪 ' + escapeHtml(product.vendor) + '</p>' +
    '<p class="rating">' + ratingText + '</p>' +
    '<p class="price">' + formatPrice(product.price) + '</p>' +
    '<p class="' + (inStock ? 'in-stock' : 'out-stock') + '">' + stockText + '</p>' +
    '<div class="card-buttons">' +
    '<button class="btn" onclick="addToCart(' + product.id + ')"' + (inStock ? '' : ' disabled') + '>🛒 Add to Cart</button>' +
    '<button class="btn btn-outline" onclick="openReviews(' + product.id + ')">⭐ Reviews</button>' +
    '</div></div></div>';
}

// ----- products page: filtering -----
function renderProductList() {
  const grid = document.getElementById('product-grid');
  const filtered = getProducts().filter(function (product) {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const text = (product.name + ' ' + product.category + ' ' + product.vendor).toLowerCase();
    const matchesSearch = searchText === '' || text.includes(searchText.toLowerCase());
    const matchesVendor = vendorFilter === '' || product.vendor === vendorFilter;
    return matchesCategory && matchesSearch && matchesVendor;
  });
  let info = 'Showing ' + filtered.length + ' product(s)';
  if (searchText) info += ' for "' + searchText + '"';
  if (vendorFilter) info += ' from ' + vendorFilter;
  document.getElementById('result-info').textContent = info;

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-box" style="grid-column:1/-1"><h2>😕 No products found</h2><p>Try a different search word or category.</p><br><a class="btn" href="products.html">Show All Products</a></div>';
    return;
  }
  grid.innerHTML = filtered.map(productCardHTML).join('');
}

function renderCategoryButtons() {
  const holder = document.getElementById('category-buttons');
  let html = '<button class="' + (selectedCategory === 'All' ? 'active' : '') + '" onclick="setCategory(\'All\')">All</button>';
  loadData(KEYS.categories, []).forEach(function (category) {
    const active = selectedCategory === category.name ? 'active' : '';
    html += '<button class="' + active + '" onclick="setCategory(\'' + category.name + '\')">' + category.icon + ' ' + category.name + '</button>';
  });
  holder.innerHTML = html;
}
function setCategory(name) {
  selectedCategory = name;
  renderCategoryButtons();
  renderProductList();
}

// ----- home page sections -----
function renderHomePage() {
  document.getElementById('category-cards').innerHTML = loadData(KEYS.categories, []).map(function (c) {
    return '<a class="category-card" href="products.html?category=' + encodeURIComponent(c.name) + '"><span>' + c.icon + '</span>' + c.name + '</a>';
  }).join('');
  renderFeatured();
  const products = getProducts();
  document.getElementById('vendor-cards').innerHTML = loadData(KEYS.vendors, []).map(function (v) {
    const count = products.filter(function (p) { return p.vendor === v.name; }).length;
    return '<div class="vendor-card"><h3>🏪 ' + escapeHtml(v.name) + '</h3><p class="small-text">📍 ' + escapeHtml(v.area) + '</p>' +
      '<p>' + escapeHtml(v.speciality) + '</p><p class="small-text">' + count + ' product(s)</p>' +
      '<a href="products.html?vendor=' + encodeURIComponent(v.name) + '">View products →</a></div>';
  }).join('');
}
function renderFeatured() {
  const featured = getProducts().filter(function (p) { return p.stock > 0; }).slice(0, 8);
  const holder = document.getElementById('featured-products');
  holder.innerHTML = featured.length ? featured.map(productCardHTML).join('') : '<p>No products available right now.</p>';
}

// ----- reviews popup -----
function openReviews(productId) {
  reviewProductId = productId;
  const product = getProductById(productId);
  if (!product) return;
  const reviews = loadData(KEYS.reviews, []).filter(function (r) { return r.productId === productId; }).reverse();
  let modal = document.getElementById('review-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'review-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }
  let listHtml = reviews.length === 0 ? '<p class="note">No reviews yet. Be the first to review!</p>' : '';
  reviews.forEach(function (r) {
    listHtml += '<div class="review-item"><span class="rating">' + starsText(r.rating) + '</span> <strong>' + escapeHtml(r.name) + '</strong>' +
      '<p>' + escapeHtml(r.comment) + '</p><p class="small-text">' + formatDate(r.date) + '</p></div>';
  });
  modal.innerHTML = '<div class="modal-box"><h2>' + escapeHtml(product.name) + '</h2>' + listHtml +
    '<h3 style="margin-top:14px">Write a Review</h3><div id="review-error" class="error-box" style="display:none"></div>' +
    '<form id="review-form" novalidate><label for="rv-name">Your Name</label><input type="text" id="rv-name">' +
    '<label for="rv-rating">Rating</label><select id="rv-rating"><option value="5">★★★★★ (5 - Excellent)</option><option value="4">★★★★ (4 - Good)</option><option value="3">★★★ (3 - Average)</option><option value="2">★★ (2 - Poor)</option><option value="1">★ (1 - Bad)</option></select>' +
    '<label for="rv-comment">Your Review</label><textarea id="rv-comment" rows="3" maxlength="200"></textarea>' +
    '<button type="submit" class="btn" style="margin-top:12px">Submit Review</button> ' +
    '<button type="button" class="btn btn-outline" onclick="closeReviews()" style="margin-top:12px">Close</button></form></div>';
  modal.style.display = 'flex';
  document.getElementById('review-form').addEventListener('submit', submitReview);
}
function closeReviews() {
  document.getElementById('review-modal').style.display = 'none';
}
function submitReview(event) {
  event.preventDefault();
  const name = document.getElementById('rv-name').value.trim();
  const rating = Number(document.getElementById('rv-rating').value);
  const comment = document.getElementById('rv-comment').value.trim();
  const errorBox = document.getElementById('review-error');
  if (name.length < 2 || comment.length < 3) {
    errorBox.textContent = 'Please enter your name and a short review.';
    errorBox.style.display = 'block';
    return;
  }
  const reviews = loadData(KEYS.reviews, []);
  const newId = reviews.length ? Math.max.apply(null, reviews.map(function (r) { return r.id; })) + 1 : 1;
  reviews.push({ id: newId, productId: reviewProductId, name: name, rating: rating, comment: comment, date: new Date().toISOString() });
  saveData(KEYS.reviews, reviews);
  showMessage('Thank you for your review!');
  openReviews(reviewProductId);     // refresh the popup
  if (document.getElementById('product-grid')) renderProductList();
  if (document.getElementById('featured-products')) renderFeatured();
}

// ----- start the page -----
if (document.getElementById('product-grid')) {
  const params = new URLSearchParams(location.search);
  selectedCategory = params.get('category') || 'All';
  searchText = params.get('search') || '';
  vendorFilter = params.get('vendor') || '';
  renderCategoryButtons();
  renderProductList();
}
if (document.getElementById('featured-products')) renderHomePage();
