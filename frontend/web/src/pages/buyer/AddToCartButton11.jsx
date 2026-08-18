import React from "react";

function AddToCartButton({
  product,
  onClick,
  lang = "en",
  disabled = false,
  loading = false,
}) {
  const outOfStock =
    disabled ||
    !product ||
    Number(product.stock) <= 0;

  return (
    <button
      onClick={() => !outOfStock && onClick(product)}
      disabled={outOfStock || loading}
      style={{
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        cursor:
          outOfStock || loading
            ? "not-allowed"
            : "pointer",

        backgroundColor: outOfStock
          ? "#d1d5db"
          : "#2563eb",

        color: "#fff",

        fontWeight: "bold",

        fontSize: "15px",

        transition: ".25s",

        opacity:
          outOfStock || loading
            ? .7
            : 1,
      }}
    >
      {loading
        ? (
            lang === "ar"
              ? "جاري الإضافة..."
              : "Adding..."
          )
        : outOfStock
        ? (
            lang === "ar"
              ? "نفد المخزون"
              : "Out of Stock"
          )
        : (
            lang === "ar"
              ? "🛒 أضف إلى السلة"
              : "🛒 Add to Cart"
          )}
    </button>
  );
}

export default AddToCartButton;