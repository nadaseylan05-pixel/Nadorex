import React, { useEffect, useState } from "react";
import styles from "../../styles/Buyer.module.css";

function Buyer({ lang = "en" }) {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [texts, setTexts] = useState({});
  const [error, setError] = useState("");

  const [selectedColors, setSelectedColors] = useState({});
  const [viewCartPage, setViewCartPage] = useState(false);
  const [activeTab, setActiveTab] = useState("cart");
  const [selectedOrder, setSelectedOrder] = useState(null);
  // ---------------- CSRF ----------------
  const getCsrfToken = () => {
    let cookieValue = null;
    if (document.cookie) {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith("csrftoken=")) {
          cookieValue = decodeURIComponent(cookie.split("=")[1]);
          break;
        }
      }
    }
    return cookieValue;
  };

  // ---------------- IMAGE ----------------
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const cleanUrl = url.replace(/\\/g, "/");
    return `http://127.0.0.1:8000/${cleanUrl}`;
  };

  // ---------------- LOAD DATA & AUTO UPDATE ----------------
  const fetchConfirmedOrders = () => {
    const phone = localStorage.getItem("buyer_phone") || "";
    if (!phone) return;

    fetch(
      `http://127.0.0.1:8000/api/buyer/orders/confirmed/?lang=${lang}&phone=${phone}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        setConfirmedOrders(data.orders || []);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/buyer/products/?lang=${lang}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setTexts(data.texts || {});
      })
      .catch(() => setError("Server error"));

    const savedCart = JSON.parse(localStorage.getItem("buyer_cart")) || [];
    setCartItems(savedCart);

    fetchConfirmedOrders();

    // فحص قاعدة البيانات كل 5 ثوانٍ لمزامنة تعديلات البائع لحظياً
    const interval = setInterval(() => {
      fetchConfirmedOrders();
    }, 5000); 

    return () => clearInterval(interval);
  }, [lang]);

  // ---------------- ACTION BUTTON CLICK ----------------
  const onActionButtonClick = async (action, orderId) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/orders/action/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify({
          order_id: orderId,
          action: action,
        }),
      });

      if (!res.ok) throw new Error("Action failed");
      const data = await res.json();

      if (data.success) {
        alert(data.message || "Done! ✅");
        fetchConfirmedOrders();
      } else {
        alert(data.message || "Failed to execute action");
        fetchConfirmedOrders();
      }
    } catch (error) {
      console.error(error);
      alert(lang === "ar" ? "خطأ في الاتصال بالخادم" : "Server Error");
    }
  };

  // ---------------- CART ----------------
  const updateCartState = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("buyer_cart", JSON.stringify(newCart));
  };

  const addToCart = (product) => {
    const color = selectedColors[product.id] || "default";

    if (!product.stock || product.stock <= 0) {
      alert("❌ هذا المنتج نفد من المخزون");
      return;
    }

    let newCart = [...cartItems];
    const index = newCart.findIndex(
      (item) => item.id === product.id && item.color === color
    );

    const currentQty = index > -1 ? newCart[index].quantity : 0;

    if (currentQty + 1 > product.stock) {
      alert(`❌ الحد الأقصى المتاح: ${product.stock}`);
      return;
    }

    if (index > -1) {
      newCart[index] = { ...newCart[index], quantity: newCart[index].quantity + 1 };
    } else {
      newCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        color,
        quantity: 1,
      });
    }

    updateCartState(newCart);
    alert(texts.added_to_cart || "تمت الإضافة 🛒");
  };

  const changeQty = (idx, delta) => {
    let newCart = [...cartItems];
    const item = newCart[idx];
    if (!item) return;

    const originalProduct = products.find((p) => p.id === item.id);
    const newQty = item.quantity + delta;

    if (delta > 0 && originalProduct && newQty > originalProduct.stock) {
      alert(`❌ الحد الأقصى المتاح في المخزون هو: ${originalProduct.stock}`);
      return;
    }

    if (newQty <= 0) {
      newCart.splice(idx, 1);
    } else {
      newCart[idx] = { ...item, quantity: newQty };
    }

    updateCartState(newCart);
  };

  const handleRemoveFromCart = (idx) => {
    let newCart = cartItems.filter((_, index) => index !== idx);
    updateCartState(newCart);
  };

  // ---------------- CHECKOUT ----------------
  const handleSingleCheckout = async (item, index) => {
    const name = prompt("Name:");
    const address = prompt("Address:");
    const phone = prompt("Phone:");
    if (!name || !address || !phone) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/buyer/order/confirm/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify({
          name,
          address,
          phone,
          email: "",
          product_data: {
            id: item.id,
            quantity: item.quantity,
            color: item.color,
          },
          lang,
        }),
      });

      if (!res.ok) throw new Error("Checkout response error");
      const data = await res.json();

      if (data.success) {
        alert("Order confirmed ✅");

        let newCart = cartItems.filter((_, i) => i !== index);
        updateCartState(newCart);

        localStorage.setItem("buyer_phone", phone);
        fetchConfirmedOrders();
        setActiveTab("orders");
      } else {
        alert(data.message || "Error");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  };

  const cartCount = cartItems.reduce((a, b) => a + b.quantity, 0);
  const cartTotal = cartItems.reduce((a, b) => a + b.price * b.quantity, 0);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className={styles.container} style={{ position: "relative", minHeight: "100vh" }}>
      
      {/* FLOATING CART BUTTON */}
      <div
        className={styles.floatingCartIcon}
        onClick={() => setViewCartPage(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#2563eb",
          color: "#433939",
          padding: "15px 20px",
          borderRadius: "50px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <span>🛒</span>
        <span>{cartCount}</span>
      </div>

      {/* PRODUCTS GRID */}
      <div className={styles.productsGrid}>
        {products.map((product) => (
          
          <div key={product.id} className={styles.card}>
            {!product.stock || product.stock <= 0 ? (
              <div className={styles.outOfStock}>OUT OF STOCK</div>
            ) : null}

            <img src={getImageUrl(product.image_url)} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}$</p>

            <button
              onClick={() => addToCart(product)}
              disabled={!product.stock || product.stock <= 0}
            >
              {!product.stock || product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>

      {/* SIDE DRAWER MODAL */}
      {viewCartPage && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "flex-end"
        }}>
          {selectedOrder && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.45)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2000,
              }}
              onClick={() => setSelectedOrder(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "95%",
                  maxWidth: "700px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  background: "#433939",
                  borderRadius: 20,
                  padding: 25,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <h2>📦 Order #{selectedOrder.order_id}</h2>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: 22,
                      cursor: "pointer",
                    }}
                  >
                    ✖
                  </button>
                </div>

                <img
                  src={getImageUrl(selectedOrder.image_url)}
                  alt=""
                  style={{
                    width: "100%",
                    maxHeight: 250,
                    objectFit: "contain",
                    borderRadius: 12,
                  }}
                />

                <hr />

                <h3>🛍 المنتج</h3>

                <p><b>الاسم:</b> {selectedOrder.name}</p>

                <p><b>الكمية:</b> {selectedOrder.quantity}</p>

                {selectedOrder.chosen_color && (
                  <p><b>اللون:</b> {selectedOrder.chosen_color}</p>
                )}

                {selectedOrder.chosen_size && (
                  <p><b>المقاس:</b> {selectedOrder.chosen_size}</p>
                )}

                {selectedOrder.book_language && (
                  <p><b>لغة الكتاب:</b> {selectedOrder.book_language}</p>
                )}

                <p><b>السعر:</b> {selectedOrder.total_price}$</p>

                <hr />

                <h3>👤 المستلم</h3>

                <p>{selectedOrder.receiver_name}</p>

                <p>{selectedOrder.phone}</p>

                <p>{selectedOrder.email}</p>

                <hr />

                <h3>📍 العنوان</h3>

                <p>{selectedOrder.city}</p>

                <p>{selectedOrder.region}</p>

                <p>{selectedOrder.street}</p>

                <p>{selectedOrder.building}</p>

                <p>{selectedOrder.apartment}</p>

                <hr />

                <h3>📅 التواريخ</h3>

                <p>تاريخ الطلب: {selectedOrder.created_at}</p>

                {selectedOrder.payment_date && (
                  <p>تاريخ الدفع: {selectedOrder.payment_date}</p>
                )}

                {selectedOrder.shipped_date && (
                  <p>تاريخ الشحن: {selectedOrder.shipped_date}</p>
                )}

                {selectedOrder.delivered_date && (
                  <p>تاريخ الاستلام: {selectedOrder.delivered_date}</p>
                )}

                {selectedOrder.return_days > 0 &&
                  selectedOrder.delivered_date && (
                    <p>
                      مدة الإرجاع:
                      {selectedOrder.return_days} يوم
                    </p>
                )}
              </div>
            </div>
          )}
          <div style={{ flex: 1 }} onClick={() => setViewCartPage(false)} />

          <div style={{
            width: "100%",
            maxWidth: "450px",
            height: "100%",
            backgroundColor: "#fff",
            boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            boxSizing: "border-box",
            direction: lang === "ar" ? "rtl" : "ltr"
          }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "24px" }}>{lang === "ar" ? "التسوق" : "Shopping"}</h2>
              <button 
                onClick={() => setViewCartPage(false)} 
                style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}
              >
                ❌
              </button>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: "flex", borderBottom: "2px solid #f3f4f6", marginBottom: "20px" }}>
              <button 
                onClick={() => setActiveTab("cart")}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === "cart" ? "3px solid #2563eb" : "none",
                  fontWeight: activeTab === "cart" ? "bold" : "normal",
                  color: activeTab === "cart" ? "#2563eb" : "#6b7280",
                  cursor: "pointer"
                }}
              >
                {lang === "ar" ? "🛒 السلة الحالية" : "🛒 Active Cart"} ({cartCount})
              </button>
              <button 
                onClick={() => setActiveTab("orders")}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === "orders" ? "3px solid #2563eb" : "none",
                  fontWeight: activeTab === "orders" ? "bold" : "normal",
                  color: activeTab === "orders" ? "#2563eb" : "#6b7280",
                  cursor: "pointer"
                }}
              >
                {lang === "ar" ? "📦 طلباتي المؤكدة" : "📦 My Orders"} ({confirmedOrders.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }}>
              
              {/* Active Cart Tab */}
              {activeTab === "cart" && (
                cartItems.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#9ca3af", marginTop: "40px" }}>
                    {lang === "ar" ? "سلتك فارغة حالياً" : "Your cart is empty"}
                  </p>
                ) : (
                  cartItems.map((item, i) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      marginBottom: "10px"
                    }}>
                      <img src={getImageUrl(item.image_url)} alt={item.name} style={{ width: "60px", height: "60px", borderRadius: "6px", objectFit: "cover" }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 5px 0" }}>{item.name}</h4>
                        <p style={{ margin: 0, color: "#2563eb", fontWeight: "bold" }}>{item.price}$</p>
                        <small style={{ color: "#6b7280" }}>{lang === "ar" ? "اللون" : "Color"}: {item.color}</small>
                      </div>
                      
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #d1d5db", borderRadius: "4px" }}>
                          <button onClick={() => changeQty(i, -1)} style={{ padding: "2px 8px", background: "#f3f4f6", border: "none", cursor: "pointer" }}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => changeQty(i, 1)} style={{ padding: "2px 8px", background: "#f3f4f6", border: "none", cursor: "pointer" }}>+</button>
                        </div>
                        <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
                          <button onClick={() => handleRemoveFromCart(i)} style={{ color: "#ef4444", background: "none", border: "none", fontSize: "12px", cursor: "pointer" }}>
                            {lang === "ar" ? "حذف" : "Remove"}
                          </button>
                          <button onClick={() => handleSingleCheckout(item, i)} style={{ color: "#10b981", background: "none", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                            {lang === "ar" ? "شراء" : "Buy"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* Confirmed Orders Tab */}
              {activeTab === "orders" && (
                confirmedOrders.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#9ca3af", marginTop: "40px" }}>
                    {lang === "ar" ? "لا توجد طلبات مؤكدة بعد" : "No confirmed orders yet"}
                  </p>
                ) : (
                  confirmedOrders.map((o, i) => {
                    const orderId = o.order_id || o.id;
                    const currentStatus = (o.status || "processing").toLowerCase().trim();

                    // 1. زر إلغاء الطلب: معلق أو قيد المعالجة
                    const showCancel = currentStatus === "processing" || currentStatus === "pending"; 
                    
                    // 2. زر تأكيد الاستلام: يظهر عندما يغير البائع الحالة إلى تم الشحن (shipped)
                    const showDelivered = currentStatus === "shipped"; 

                    // 3. زر طلب إرجاع: يظهر بعد التسليم مباشرة بشرط وجود مهلة زمنية متبقية
                    const returnDaysAllowed = Number(o.return_days || 0);

                    let isReturnPeriodValid = false;

                    if (returnDaysAllowed > 0 && o.delivered_date) {
                      const deliveredDate = new Date(o.delivered_date);

                      const deadline = new Date(deliveredDate);
                      deadline.setDate(deadline.getDate() + returnDaysAllowed);

                      isReturnPeriodValid = new Date() <= deadline;
                    }

                    const showReturn =
                        currentStatus === "delivered" &&
                        returnDaysAllowed > 0 &&
                        isReturnPeriodValid;

                    // 4. زر إلغاء طلب الإرجاع: يظهر فقط طالما الحالة معلقة عند البائع (return_requested)
                    const showCancelReturn = currentStatus === "return_requested"; 

                    const getBadgeStyles = (status) => {
                      if (status === "delivered") return { bg: "#d1fae5", text: "#065f46" };
                      if (status === "shipped") return { bg: "#dbeafe", text: "#1e40af" };
                      if (status === "return_requested") return { bg: "#fef3c7", text: "#92400e" };
                      if (status === "return_processing") return { bg: "#e0f2fe", text: "#0369a1" };
                      if (status === "cancelled") return { bg: "#fee2e2", text: "#991b1b" };
                      return { bg: "#f3f4f6", text: "#374151" }; // الافتراضي لقيد المعالجة
                    };
                    const badge = getBadgeStyles(currentStatus);

                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedOrder(o)}
                        style={{
                          cursor: "pointer",
                          padding: "15px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          marginBottom: "10px",
                          backgroundColor: "#f9fafb"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                            #{orderId} - {o.name || (lang === "ar" ? "طلب مشترك" : "Order")}
                          </span>
                          <span style={{ 
                            backgroundColor: badge.bg,
                            color: badge.text,
                            padding: "4px 10px",
                            borderRadius: "50px",
                            fontSize: "12px", 
                            fontWeight: "bold" 
                          }}>
                            {o.status === "processing" && (lang === "ar" ? "قيد المعالجة" : "Processing")}
                            {o.status === "shipped" && (lang === "ar" ? "تم الشحن 🚚" : "Shipped")}
                            {o.status === "delivered" && (lang === "ar" ? "تم الاستلام ✅" : "Delivered")}
                            {o.status === "return_requested" && (lang === "ar" ? "انتظار موافقة الإرجاع" : "Return Requested")}
                            {o.status === "return_processing" && (lang === "ar" ? "المندوب في الطريق 🏍️" : "Return Processing")}
                            {o.status === "cancelled" && (lang === "ar" ? "ملغي" : "Cancelled")}
                          </span>
                        </div>
                        <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#4b5563" }}>
                          {lang === "ar" ? "الإجمالي:" : "Total:"} <strong style={{ color: "#111827" }}>{o.total_price || o.total}$</strong>
                        </p>
                        
                        {/* Actions Section */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", borderTop: "1px dashed #e5e7eb", paddingTop: "10px" }}>
                          {showCancel && (
                            <button onClick={(e) => {e.stopPropagation();onActionButtonClick("cancel", orderId)}} style={{ padding: "6px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                              {lang === "ar" ? "إلغاء وحذف الطلب" : "Cancel Order"}
                            </button>
                          )}
                          {showDelivered && (
                            <button onClick={(e) => {e.stopPropagation();onActionButtonClick("delivered", orderId)}} style={{ padding: "6px 12px", background: "#10b981", color: "#fff", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                              {lang === "ar" ? "تأكيد الاستلام" : "Mark as Delivered"}
                            </button>
                          )}
                          {showReturn && (
                            <button onClick={(e) => {e.stopPropagation();onActionButtonClick("return", orderId)}} style={{ padding: "6px 12px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                              {lang === "ar" ? "طلب إرجاع" : "Request Return"}
                            </button>
                          )}
                          {showCancelReturn && (
                            <button onClick={(e) => {e.stopPropagation();onActionButtonClick("cancel_return", orderId)}} style={{ padding: "6px 12px", background: "#6b7280", color: "#fff", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                              {lang === "ar" ? "إلغاء الإرجاع" : "Cancel Return"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Buyer;