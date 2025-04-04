"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Product data with consistent image naming
var products = [{
  id: 1,
  name: "Wireless Headphones",
  price: 59.99
}, {
  id: 2,
  name: "Smart Watch",
  price: 129.99
}, {
  id: 3,
  name: "Bluetooth Speaker",
  price: 39.99
}, {
  id: 4,
  name: "Laptop Backpack",
  price: 49.99
}, {
  id: 5,
  name: "Fitness Tracker",
  price: 79.99
}, {
  id: 6,
  name: "Wireless Earbuds",
  price: 89.99
}].map(function (product) {
  return _objectSpread({}, product, {
    image: "https://via.placeholder.com/300?text=".concat(encodeURIComponent(product.name))
  });
}); // Cart functionality

var cart = JSON.parse(localStorage.getItem('cart')) || []; // Update cart count

function updateCartCount() {
  var count = cart.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);
  document.querySelectorAll('.cart-count').forEach(function (el) {
    el.textContent = count;
  });
} // Add to cart


function addToCart(productId, productName, productPrice) {
  var existingItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  if (window.location.pathname.includes('cart.html')) {
    renderCart();
  }
} // Remove from cart


function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
} // Update quantity


function updateQuantity(productId, newQuantity) {
  var item = cart.find(function (item) {
    return item.id === productId;
  });

  if (item) {
    item.quantity = parseInt(newQuantity) || 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
} // Render cart


function renderCart() {
  var cartItemsEl = document.getElementById('cart-items');
  var subtotalEl = document.getElementById('subtotal');
  var totalEl = document.getElementById('total');
  var checkoutBtn = document.querySelector('.checkout-btn');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "\n            <div class=\"empty-cart\">\n                <p>Your cart is empty</p>\n                <a href=\"products.html\" class=\"btn\">Continue Shopping</a>\n            </div>\n        ";
    subtotalEl.textContent = '$0.00';
    totalEl.textContent = '$0.00';
    checkoutBtn.disabled = true;
    return;
  }

  var html = cart.map(function (item) {
    var product = products.find(function (p) {
      return p.id === item.id;
    });
    var itemTotal = item.price * item.quantity;
    return "\n            <div class=\"cart-item\">\n                <img src=\"".concat(product.image, "\" alt=\"").concat(item.name, "\">\n                <div class=\"cart-item-details\">\n                    <h4>").concat(item.name, "</h4>\n                    <p class=\"cart-item-price\">$").concat(item.price.toFixed(2), "</p>\n                    <div class=\"cart-item-quantity\">\n                        <button class=\"quantity-btn minus\" data-id=\"").concat(item.id, "\">-</button>\n                        <input type=\"number\" value=\"").concat(item.quantity, "\" min=\"1\" data-id=\"").concat(item.id, "\">\n                        <button class=\"quantity-btn plus\" data-id=\"").concat(item.id, "\">+</button>\n                    </div>\n                </div>\n                <button class=\"remove-item\" data-id=\"").concat(item.id, "\">\n                    <i class=\"fas fa-trash\"></i>\n                </button>\n            </div>\n        ");
  }).join('');
  var subtotal = cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);
  cartItemsEl.innerHTML = html;
  subtotalEl.textContent = "$".concat(subtotal.toFixed(2));
  totalEl.textContent = "$".concat(subtotal.toFixed(2));
  checkoutBtn.disabled = false; // Add event listeners

  document.querySelectorAll('.remove-item').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      removeFromCart(parseInt(e.target.closest('button').dataset.id));
    });
  });
  document.querySelectorAll('.quantity-btn.minus').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var id = parseInt(e.target.dataset.id);
      var item = cart.find(function (item) {
        return item.id === id;
      });

      if (item.quantity > 1) {
        updateQuantity(id, item.quantity - 1);
      }
    });
  });
  document.querySelectorAll('.quantity-btn.plus').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var id = parseInt(e.target.dataset.id);
      var item = cart.find(function (item) {
        return item.id === id;
      });
      updateQuantity(id, item.quantity + 1);
    });
  });
  document.querySelectorAll('.cart-item-quantity input').forEach(function (input) {
    input.addEventListener('change', function (e) {
      var id = parseInt(e.target.dataset.id);
      updateQuantity(id, e.target.value);
    });
  });
} // Render products


function renderProducts(productsToRender) {
  var container = document.getElementById('products-container');
  if (!container) return;
  var html = productsToRender.map(function (product) {
    return "\n        <div class=\"product-card\">\n            <img src=\"".concat(product.image, "\" alt=\"").concat(product.name, "\">\n            <h3>").concat(product.name, "</h3>\n            <p class=\"price\">$").concat(product.price.toFixed(2), "</p>\n            <button class=\"btn add-to-cart\" data-id=\"").concat(product.id, "\" data-name=\"").concat(product.name, "\" data-price=\"").concat(product.price, "\">Add to Cart</button>\n        </div>\n    ");
  }).join('');
  container.innerHTML = html; // Add event listeners to add to cart buttons

  document.querySelectorAll('.add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var id = parseInt(e.target.dataset.id);
      var name = e.target.dataset.name;
      var price = parseFloat(e.target.dataset.price);
      addToCart(id, name, price); // Show added to cart feedback

      var originalText = e.target.textContent;
      e.target.textContent = 'Added!';
      e.target.style.backgroundColor = '#2E7D32';
      setTimeout(function () {
        e.target.textContent = originalText;
        e.target.style.backgroundColor = '#4CAF50';
      }, 1000);
    });
  });
} // Search products


function searchProducts() {
  var searchInput = document.getElementById('search-input');
  var sortSelect = document.getElementById('sort-select');
  if (!searchInput || !sortSelect) return;
  searchInput.addEventListener('input', filterAndSortProducts);
  sortSelect.addEventListener('change', filterAndSortProducts);

  function filterAndSortProducts() {
    var searchTerm = searchInput.value.toLowerCase();
    var filteredProducts = products.filter(function (product) {
      return product.name.toLowerCase().includes(searchTerm);
    }); // Sort products

    switch (sortSelect.value) {
      case 'price-low':
        filteredProducts.sort(function (a, b) {
          return a.price - b.price;
        });
        break;

      case 'price-high':
        filteredProducts.sort(function (a, b) {
          return b.price - a.price;
        });
        break;

      default:
        // Default sorting (by ID)
        filteredProducts.sort(function (a, b) {
          return a.id - b.id;
        });
    }

    renderProducts(filteredProducts);
  }
} // Initialize the page


document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();

  if (window.location.pathname.includes('cart.html')) {
    renderCart();
  } else if (window.location.pathname.includes('products.html')) {
    renderProducts(products);
    searchProducts();
  } else {
    // Home page - add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var id = parseInt(e.target.dataset.id);
        var name = e.target.dataset.name;
        var price = parseFloat(e.target.dataset.price);
        addToCart(id, name, price); // Show added to cart feedback

        var originalText = e.target.textContent;
        e.target.textContent = 'Added!';
        e.target.style.backgroundColor = '#2E7D32';
        setTimeout(function () {
          e.target.textContent = originalText;
          e.target.style.backgroundColor = '#4CAF50';
        }, 1000);
      });
    });
  }
});
//# sourceMappingURL=script.dev.js.map
