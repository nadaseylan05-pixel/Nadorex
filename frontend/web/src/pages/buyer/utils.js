// ================================
// Image
// ================================
export const getImageUrl = (url) => {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  return `http://127.0.0.1:8000/${url.replace(/\\/g, "/")}`;
};

// ================================
// CSRF
// ================================
export const getCsrfToken = () => {
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

// ================================
// Cart
// ================================
// export const getCart = () => {
//   try {
//     return JSON.parse(localStorage.getItem("buyer_cart")) || [];
//   } catch {
//     return [];
//   }
// };

// export const saveCart = (cart) => {
//   localStorage.setItem("buyer_cart", JSON.stringify(cart));
// };

// export const getCartCount = (cart) =>
//   cart.reduce((total, item) => total + item.quantity, 0);

// export const getCartTotal = (cart) =>
//   cart.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );
// ================================
// Cart
// ================================

export const getCart = (instagramUsername) => {
  try {
    if (!instagramUsername) return [];

    const key = `buyer_cart_${instagramUsername}`;

    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

export const saveCart = (cart, instagramUsername) => {
  if (!instagramUsername) return;

  const key = `buyer_cart_${instagramUsername}`;

  localStorage.setItem(key, JSON.stringify(cart));
};

export const getCartCount = (cart) =>
  cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

export const getCartTotal = (cart) =>
  cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );
// ================================
// Orders
// ================================
export const isReturnPeriodValid = (
  deliveredDate,
  returnDays
) => {
  if (!deliveredDate || !returnDays) return false;

  const delivered = new Date(deliveredDate);

  const deadline = new Date(delivered);

  deadline.setDate(deadline.getDate() + Number(returnDays));

  return new Date() <= deadline;
};

// ================================
// Status Badge
// ================================
export const getStatusBadge = (status) => {
  switch ((status || "").toLowerCase()) {
    case "processing":
    case "pending":
      return {
        bg: "#f3f4f6",
        text: "#374151",
      };

    case "shipped":
      return {
        bg: "#dbeafe",
        text: "#1e40af",
      };

    case "delivered":
      return {
        bg: "#d1fae5",
        text: "#065f46",
      };

    case "return_requested":
      return {
        bg: "#fef3c7",
        text: "#92400e",
      };

    case "return_processing":
      return {
        bg: "#e0f2fe",
        text: "#0369a1",
      };

    case "cancelled":
      return {
        bg: "#fee2e2",
        text: "#991b1b",
      };

    default:
      return {
        bg: "#f3f4f6",
        text: "#374151",
      };
  }
};

// ================================
// Status Text
// ================================
export const getStatusText = (status, lang) => {
  switch ((status || "").toLowerCase()) {
    case "processing":
      return lang === "ar"
        ? "قيد المعالجة"
        : "Processing";

    case "pending":
      return lang === "ar"
        ? "قيد الانتظار"
        : "Pending";

    case "shipped":
      return lang === "ar"
        ? "تم الشحن 🚚"
        : "Shipped";

    case "delivered":
      return lang === "ar"
        ? "تم الاستلام ✅"
        : "Delivered";

    case "return_requested":
      return lang === "ar"
        ? "انتظار موافقة الإرجاع"
        : "Return Requested";

    case "return_processing":
      return lang === "ar"
        ? "المندوب في الطريق 🏍️"
        : "Return Processing";

    case "cancelled":
      return lang === "ar"
        ? "ملغي"
        : "Cancelled";

    default:
      return status;
  }
};