# 🛒 Apna Bazaar – Local Market Online Store for Small Vendors

First Semester B.Tech | CA1 Project-Based Assessment
Built with **HTML5, CSS3, Vanilla JavaScript and browser localStorage** only (no frameworks, no server).

> **Important:** This is a single-browser academic prototype. All data (products, orders, reviews, cart) is saved in *your* browser's localStorage. It is not shared between devices or users. The "Demo Online Payment" is only a simulation. No real payment is made. The Vendor and Admin pages have no login.

## Features
- Home page: hero, categories, featured products, local vendors, offers, footer
- Products page: 20 sample products, working search, category filter and vendor filter, stock display
- Cart: add, remove, increase/decrease, stock limit, subtotal, delivery fee (free above ₹500), total, count in navbar
- Checkout: validated form, Cash on Delivery or simulated Demo Payment, unique order ID, stock reduced, cart cleared
- My Orders: order history with status, cancel a Pending order (stock is restored)
- Vendor dashboard: statistics, add/edit/delete products, update price/stock, view orders, change order status
- Admin dashboard: vendors/products/orders/sales totals, recent orders, product and vendor overview, reset demo data
- Reviews: star rating and short review for every product
- Responsive design (mobile, tablet, desktop)

## Run locally
1. Download or unzip the `apna-bazaar` folder.
2. Double-click `index.html` (opens in your browser). No installation needed.
   (Optional: in VS Code, install "Live Server", right-click `index.html` → *Open with Live Server*.)

## Upload to GitHub
1. Create an account at github.com and click **New repository**. Name it `apna-bazaar`, keep it **Public**, click *Create repository*.
2. Easiest way: click **uploading an existing file**, drag ALL files and folders from inside `apna-bazaar` (so `index.html` is at the top level), then click **Commit changes**.
3. Or with Git:
```
cd apna-bazaar
git init
git add .
git commit -m "Apna Bazaar first version"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/apna-bazaar.git
git push -u origin main
```

## Deploy with GitHub Pages
1. Open your repository → **Settings** → **Pages**.
2. Under *Build and deployment* → *Source*, choose **Deploy from a branch**.
3. Select branch **main** and folder **/ (root)**, click **Save**.
4. Wait 1–2 minutes. Your site will be at `https://YOUR-USERNAME.github.io/apna-bazaar/`.

## Folder structure and what each file does
| File | Purpose |
|---|---|
| `index.html` | Home page |
| `products.html` | All products with search and filters |
| `cart.html` | Shopping cart |
| `checkout.html` | Checkout form and order confirmation |
| `orders.html` | Customer order history |
| `vendor.html` | Vendor dashboard |
| `admin.html` | Admin dashboard |
| `about.html` | About and contact |
| `css/style.css` | All colours, layout, cards, tables, responsive rules (`@media`) |
| `js/main.js` | Loaded on every page: localStorage helpers, sample data, navbar, footer, cart helper functions |
| `js/products.js` | Product cards, search, category filter, home page sections, reviews popup |
| `js/cart.js` | Cart page: show items, change quantity, remove, totals |
| `js/checkout.js` | Form validation, order creation, stock reduction |
| `js/orders.js` | Order history page and cancel order |
| `js/vendor.js` | Vendor statistics, add/edit/delete product, order status |
| `js/admin.js` | Admin statistics and tables, reset button |
| `images/` | Product pictures (SVG files) |

## localStorage keys
`ab_products`, `ab_vendors`, `ab_categories`, `ab_orders`, `ab_reviews`, `ab_cart`.
Sample data is created only if a key is empty, so your changes are never overwritten. To start fresh, use **Reset Demo Data** on the Admin page.

## How to test quickly
1. Products → search "milk", click the Dairy button.
2. Add items to the cart (try adding more than the stock) → open Cart.
3. Checkout with valid details → see the order ID.
4. My Orders → your order shows as *Pending*.
5. Vendor → add a product, then check it on Products. Change the order status.
6. Admin → statistics have changed. Refresh the page: data is still there.

## Viva questions and easy answers
1. **What is Apna Bazaar?** An online marketplace where local shopkeepers sell products and customers order them.
2. **Which technologies did you use?** HTML for structure, CSS for design, JavaScript for logic, localStorage for saving data.
3. **What is localStorage?** A small storage inside the browser that keeps data as text even after refresh or closing the browser.
4. **How do you store arrays/objects in localStorage?** localStorage only keeps text, so `JSON.stringify` converts data to text when saving and `JSON.parse` converts it back when reading.
5. **Is localStorage a real database?** No. It works only in one browser, anyone can edit it, and it is not shared between users. A real project needs a server and database.
6. **Why is there no real payment?** Real payment needs a secure server and a payment gateway. Our online payment is only a demo simulation.
7. **How does the cart count in the navbar work?** `updateCartBadge()` adds up the quantities saved in `ab_cart` and shows the number.
8. **How do you stop a customer buying more than the stock?** In `addToCart()` and `changeQuantity()` we compare the quantity with `product.stock` and show a message if it is more.
9. **How does search work?** The search word goes in the URL (`?search=milk`). `renderProductList()` uses `filter()` to keep products whose name, category or vendor contains the word.
10. **How does category filtering work?** Clicking a category button sets `selectedCategory` and `filter()` keeps only matching products.
11. **How is a unique order ID created?** `'AB' + Date.now()`. The current time in milliseconds is different every time.
12. **What happens when Place Order is clicked?** Form is validated, order is saved, stock is reduced, cart is cleared, confirmation is shown.
13. **How do you validate the mobile number?** With a regular expression: exactly 10 digits starting with 6, 7, 8 or 9.
14. **Why do you check stock again at checkout?** Stock may have changed after the item was added to the cart.
15. **How do vendor changes appear on the products page?** Both pages read and write the same key `ab_products` in localStorage.
16. **Why do you use `escapeHtml()`?** So text typed by users (like `<script>`) is shown as plain text and cannot break the page or run code.
17. **What does `seedData()` do?** Saves sample data only when the key does not exist, so user data is not overwritten.
18. **What happens to stock when an order is cancelled?** `restoreStock()` adds the ordered quantities back to the products.
19. **How is the website responsive?** CSS Grid with `auto-fill`/`minmax`, flexible widths, and `@media` queries for small screens plus the viewport meta tag.
20. **What is the difference between `let` and `const`?** `const` cannot be reassigned; `let` can be changed later.
21. **What do `map`, `filter` and `reduce` do?** `map` transforms each item, `filter` keeps matching items, `reduce` combines all items into one value (e.g. total).
22. **Why is `main.js` loaded first?** Other files use its functions (`loadData`, `addToCart`, ...), and JavaScript needs them defined first.
23. **How does the navbar appear on all pages?** Each page has an empty `<div id="navbar">` and `main.js` fills it, so the navbar code is written only once.
24. **How are delivery charges calculated?** ₹40 is added if the subtotal is below ₹500; otherwise delivery is free (`calculateTotals()`).
25. **How would you make this a real marketplace?** Add a backend (e.g. Node.js + database), login for customers/vendors/admin, real payment gateway, and image upload.
26. **How are total sales calculated?** By adding the total of every order that is not Cancelled.

## Known limits (honest notes)
- Vendor/Admin pages have no login (prototype only).
- Data lives only in one browser; clearing browser data removes it.
- Product images are small local SVG pictures. Vendors may also paste an image URL.
