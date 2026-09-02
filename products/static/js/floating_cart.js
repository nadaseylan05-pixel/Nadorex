// ✅ الخطوة 1: زرع الـ CSRF Token في الكوكيز من السيرفر (يُوضع عادة داخل <script> في HTML)
// لكن هنا عشان JavaScript فقط، بنستخدم window.onload لاستلامه من HTML عند تحميل الصفحة
window.addEventListener("DOMContentLoaded", () => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]');
  if (csrfToken) {
    document.cookie = "csrftoken=" + csrfToken.content + "; path=/";
  }
});

window.cartCount = 0;

// ✅ getCookie كما هو
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function updateCartCount() {
  const floatCartBtn = document.getElementById("floatingCartBtn");
  if (!floatCartBtn) return;

  floatCartBtn.innerHTML = `
    <div style="position: relative;">
      <span style="font-size: 24px;">🛒</span>
      ${window.cartCount > 0 ? `
    < span style = "
  position: absolute;
  top: -10px;
  right: -10px;
  background: red;
  color: white;
  font - size: 14px;
  font - weight: bold;
  border - radius: 50 %;
  padding: 2px 6px;
  min - width: 20px;
  text - align: center;
  display: inline - block;
  ">${window.cartCount}</span>` : ''}
    </div >
    `;

  updatePageCartCount();
}

function fetchCartCount() {
  fetch('/api/cart_count')
    .then(response => response.json())
    .then(data => {
      if (typeof data.count === 'number') {
        window.cartCount = data.count;
        updateCartCount();
      }
    })
    .catch(() => {
      window.cartCount = 0;
      updateCartCount();
    });
}
function addToCart(productId, lang) {
  fetch('/add_to_cart/', {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": csrftoken
    },
    body: new URLSearchParams({
      product_id: productId,
      quantity: 1,
      lang: lang
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        window.cartCount = data.cart_count;
        updateCartCount();
      } else {
        alert(data.message);
      }
    })
    .catch(() => alert("حدث خطأ أثناء إضافة المنتج."));
}


// دالة لإنشاء زر السلة
function createFloatingCartBtn() {
  if (document.getElementById("floatingCartBtn")) return;

  const floatCartBtn = document.createElement("button");
  floatCartBtn.id = "floatingCartBtn";
  floatCartBtn.style.position = "fixed";
  floatCartBtn.style.bottom = "20px";
  floatCartBtn.style.right = "20px";
  floatCartBtn.style.backgroundColor = "#007bff";
  floatCartBtn.style.color = "white";
  floatCartBtn.style.border = "none";
  floatCartBtn.style.borderRadius = "50%";
  floatCartBtn.style.width = "60px";
  floatCartBtn.style.height = "60px";
  floatCartBtn.style.fontSize = "24px";
  floatCartBtn.style.cursor = "pointer";
  floatCartBtn.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
  floatCartBtn.style.zIndex = "9999";

  floatCartBtn.addEventListener("click", function () {
    window.location.href = window.cartPageUrl || "/buyer_cart";
  });

  document.body.appendChild(floatCartBtn);
  fetchCartCount();
}

document.addEventListener("DOMContentLoaded", createFloatingCartBtn);
