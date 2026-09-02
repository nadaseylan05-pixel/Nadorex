// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useLanguage } from "../../context/LanguageContext";
// import styles from "../../styles/seller/ProductDetail.module.css";
// function ProductDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const {lang} =useLanguage();
//   const [product, setProduct] = useState(null);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [currentImages,setCurrentImages]=useState([]);
//   const [t, setT] = useState({});
//   useEffect(() => {
//     const fetchProduct = async () => {

//       const token = localStorage.getItem("access_token");
//       console.log("TOKEN:", token);

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/products/details/${id}/?lang=${lang}`,
//         // `http://localhost:8000/api/products/details/${id}/?lang=${lang}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log(res.status);

//       const data = await res.json();
//       setT(data.translations);
//       if (!data.success) {
//         console.log(data.error);
//       }

//       if (data.success) {

//         setProduct(data.product);

//         // أول صورة تلقائياً
//         const firstImage =
//           data.product.base_image ||
//           data.product.image_url ||
//           data.product.images?.[0]?.image;

//         setSelectedImage(firstImage);
//         setCurrentImages([
//           ...(data.product.base_image ? [data.product.base_image] : []),
//           ...(data.product.images || []).map((img) => img.image),
//         ]);
//       }
//     };

//     fetchProduct();
//   }, [id, lang]);

//   if (!product)

//     return <div style={{ padding: 30 }}>{t.loading_product}</div>;
//   console.log(product.variants);
//   console.log(product.variants[0]);
//   console.log(JSON.stringify(product.variants?.[0], null, 2));
//   return (
//     <div style={{ padding: 30 }}>

//       {/* 🔙 رجوع */}
//       <button
//         onClick={() => navigate(-1)}
//         style={{ marginBottom: 20 }}
//       >
//         ⬅{t.back_to_home}
//       </button>

//       {/* 🧱 Layout */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>

//         {/* 🖼️ الصور */}
//         <div>

//           <div style={{ border: "1px solid #eee", borderRadius: 12 }}>
//             <img
//               src={
//                 selectedImage?.startsWith("http")
//                   ? selectedImage
//                   : `http://localhost:8000${selectedImage}`
//               }
//               style={{
//                 width: "100%",
//                 height: 420,
//                 objectFit: "cover",
//                 borderRadius: 12,
//               }}
//             />
//           </div>

//           {/* thumbnails */}
//           <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>

//             {currentImages.map((img, i) => (
//               <img
//                 key={i}
//                 src={
//                   img.startsWith("http")
//                     ? img
//                     : `http://localhost:8000${img}`
//                 }
//                 onClick={() => setSelectedImage(img)}
//                 style={{
//                   width: 70,
//                   height: 70,
//                   objectFit: "cover",
//                   cursor: "pointer",
//                   borderRadius: 8,
//                   border:
//                     selectedImage === img
//                       ? "2px solid #2563eb"
//                       : "1px solid #ddd",
//                 }}
//               />
//             ))}

//           </div>
//         </div>

//         {/* ℹ️ المعلومات */}
//         <div>

//           <h1 style={{ marginBottom: 10, color: "#7a6363" }}>{product.name}</h1>

//           <div style={{ fontSize: 22, fontWeight: "bold", color: "#2563eb" }}>
//             {product.price} {product.currency}
//           </div>

//           {product.old_price && (
//             <div style={{ textDecoration: "line-through", color: "#999" }}>
//               {product.old_price}
//             </div>
//           )}

//           <p style={{ marginTop: 15, color: "#555" }}>
//             {product.describtion}
//           </p>
//           {/* خصائص المنتج الرئيسي */}
//           {product.attributes?.length > 0 && (
//             <div
//               style={{
//                 marginTop: 20,
//                 padding: 15,
//                 border: "1px solid #eee",
//                 borderRadius: 10,
//                 background: "#fafafa",
//                 color: "#111"
//               }}
//             >
//               <h3 style={{ marginBottom: 12 }}>
//                 خصائص المنتج
//               </h3>

//               {product.attributes.map((attr) => (
//                 <div
//                   key={attr.id}
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     padding: "8px 0",
//                     borderBottom: "1px solid #211d1d",
//                   }}
//                 >
//                   <b>{attr.attribute_name}</b>

//                   {/* <span>
//                     {attr.value || "-"}
//                   </span> */}
//                   {attr.attribute_type === "color" ? (
//                     <span
//                         className={styles.colorValue}
//                         style={{
//                             backgroundColor: attr.value || "#1b1616",
//                         }}
//                         title={attr.value || ""}
//                     />
//                 ) : (
//                     <span className={styles.attributeValue}>
//                         {attr.value || "-"}
//                     </span>
//                 )}
//                 </div>
//               ))}
//             </div>
//           )}
//           {/* stock */}
//           <div style={{ marginTop: 15, color: "#111" }}>
//             <b>{t.stock || "المخزون"}:</b> {product.stock}
//           </div>

//           <div style={{ marginTop: 5, color: "#111" }}>
//             <b>{t.status}:</b>{" "}
//             {product.stock > 0 ? "🟢 متوفر" : "🔴 غير متوفر"}
//           </div>

//           {/* أزرار */}
//           <div style={{ marginTop: 25, display: "flex", gap: 10 }}>
//             {/* <button style={{ padding: 10, background: "#2563eb", color: "#fff", border: 0 }}>
//               تعديل
//             </button>

//             <button style={{ padding: 10, background: "#ef4444", color: "#fff", border: 0 }}>
//               حذف
//             </button> */}
//           </div>
//         </div>
//       </div>

//       {/* 📦 Variants */}
//       <div style={{ marginTop: 40 }}>

//         <h2>النسخ (Variants)</h2>

//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//           gap: 15
//         }}>
//           {product.variants?.map((v) =>  (
//             <div
//               key={v.id}
//               onClick={() => {console.log("مكان عرض الصور");
//                 const imgs = [];

//                 if (v.image || v.image_url) {
//                   imgs.push(v.image || v.image_url);
//                 }

//                 (v.images || []).forEach((img) => {
//                   imgs.push(img.image || img.image_url);
//                 });

//                 if (imgs.length > 0) {
//                   setCurrentImages(imgs);
//                   setSelectedImage(imgs[0]);
//                 }
//               }}
//               style={{
//                 border: "1px solid #eee",
//                 padding: 10,
//                 borderRadius: 10,
//                 cursor: "pointer",
//                 background: "#fff",
//                 color: "#111"
//               }}
//             >
//               {(v.image || v.image_url) && (
//                 <img
//                   src={
//                     (v.image || v.image_url).startsWith("http")
//                       ? (v.image || v.image_url)
//                       : `http://localhost:8000${v.image || v.image_url}`
//                   }
//                   style={{
//                     width: "100%",
//                     height: 120,
//                     objectFit: "cover",
//                     borderRadius: 8,
//                     marginBottom: 10,
//                   }}
//                 />
//               )}
//               <b>{v.title}</b>
//               <div>المخزون: {v.stock}</div>
//               {v.color_hex && (
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     marginBottom: "8px",
//                   }}


//                 >
//                   <div
//                     style={{
//                       width: "22px",
//                       height: "22px",
//                       borderRadius: "50%",
//                       backgroundColor: v.color_hex,
//                       border: "2px solid white",
//                       boxShadow: "0 0 4px rgba(0,0,0,.25)",
//                     }}
//                   />
//                 </div>
//               )}
//               {v.size && <div>المقاس: {v.size}</div>}
//               {v.book_language && <div>اللغة: {v.book_language}</div>}
//               {/* خصائص النسخة */}
//               {v.attributes?.length > 0 && (
//                 <div
//                   style={{
//                     marginTop: 12,
//                     paddingTop: 10,
//                     borderTop: "1px solid #eee",
//                   }}
//                 >
//                   <b>خصائص النسخة:</b>

//                   {v.attributes.map((attr) => (
//                     <div
//                       key={attr.id}
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginTop: 6,
//                         fontSize: 14,
//                       }}
//                     >
//                       <span>{attr.attribute_name}</span>

//                       {/* <span>
//                         {attr.option_name || attr.value || "-"}
//                       </span> */}
//                       {attr.attribute_type === "color" ? (
//                         <span
//                             style={{
//                                 display: "inline-block",
//                                 width: "24px",
//                                 height: "24px",
//                                 borderRadius: "50%",
//                                 backgroundColor: attr.value || "#ddd",
//                                 border: "2px solid #fff",
//                                 boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
//                             }}
//                             title={attr.value || ""}
//                         />
//                     ) : (
//                         <span>
//                             {attr.option_name || attr.value || "-"}
//                         </span>
//                     )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>


//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default ProductDetails;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import styles from "../../styles/seller/ProductDetail.module.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  const [t, setT] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("access_token");
      console.log("TOKEN:", token);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/details/${id}/?lang=${lang}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.status);

      const data = await res.json();
      setT(data.translations || {});

      if (!data.success) {
        console.log(data.error);
      }

      if (data.success) {
        setProduct(data.product);

        const firstImage =
          data.product.base_image ||
          data.product.image_url ||
          data.product.images?.[0]?.image;

        setSelectedImage(firstImage);
        setCurrentImages([
          ...(data.product.base_image ? [data.product.base_image] : []),
          ...(data.product.images || []).map((img) => img.image),
        ]);
      }
    };

    fetchProduct();
  }, [id, lang]); // ✅ إضافة lang هنا لتحديث الترجمات عند تغيير اللغة

  if (!product)
    return <div style={{ padding: 30 }}>{t.loading || "جاري التحميل..."}</div>;

  return (
    <div style={{ padding: 30 }}>
      {/* 🔙 رجوع */}
      {/* <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        ⬅ {t.back_to_home && t.back_to_home !== "back_to_home" ? t.back_to_home : "رجوع"}
      </button> */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 20,
          background: "transparent",
          border: "none",
        }}
      >
        ⬅ {t.back_to_home && t.back_to_home !== "back_to_home"
          ? t.back_to_home
          : "رجوع"}
      </button>
      {/* 🧱 Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>

        {/* 🖼️ الصور */}
        <div>
          <div style={{ border: "1px solid #eee", borderRadius: 12 }}>
            <img
              src={
                selectedImage?.startsWith("http")
                  ? selectedImage
                  : `http://localhost:8000${selectedImage}`
              }
              style={{
                width: "100%",
                height: 420,
                objectFit: "cover",
                borderRadius: 12,
              }}
              alt={product.name}
            />
          </div>

          {/* thumbnails */}
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            {currentImages.map((img, i) => (
              <img
                key={i}
                src={
                  img.startsWith("http")
                    ? img
                    : `http://localhost:8000${img}`
                }
                onClick={() => setSelectedImage(img)}
                style={{
                  width: 70,
                  height: 70,
                  objectFit: "cover",
                  cursor: "pointer",
                  borderRadius: 8,
                  border:
                    selectedImage === img
                      ? "2px solid #2563eb"
                      : "1px solid #ddd",
                }}
                alt=""
              />
            ))}
          </div>
        </div>

        {/* ℹ️ المعلومات */}
        <div>
          <h1 style={{ marginBottom: 10, color: "#7a6363" }}>{product.name}</h1>

          <div style={{ fontSize: 22, fontWeight: "bold", color: "#2563eb" }}>
            {product.price} {product.currency}
          </div>

          {product.old_price && (
            <div style={{ textDecoration: "line-through", color: "#999" }}>
              {product.old_price}
            </div>
          )}

          <p style={{ marginTop: 15, color: "#555" }}>
            {product.describtion}
          </p>

          {/* خصائص المنتج الرئيسي */}
          {product.attributes?.length > 0 && (
            <div
              style={{
                marginTop: 20,
                padding: 15,
                border: "1px solid #eee",
                borderRadius: 10,
                background: "#fafafa",
                color: "#111"
              }}
            >
              <h3 style={{ marginBottom: 12 }}>
                {t.product_attributes && t.product_attributes !== "product_attributes" ? t.product_attributes : "خصائص المنتج"}
              </h3>

              {product.attributes.map((attr) => (
                <div
                  key={attr.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid #211d1d",
                  }}
                >
                  <b>{attr.attribute_name}</b>

                  {attr.attribute_type === "color" ? (
                    <span
                      className={styles.colorValue}
                      style={{
                        backgroundColor: attr.value || "#1b1616",
                      }}
                      title={attr.value || ""}
                    />
                  ) : (
                    <span className={styles.attributeValue}>
                      {attr.value || "-"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* stock */}
          <div style={{ marginTop: 15, color: "#111" }}>
            <b>{t.stock && t.stock !== "stock" ? t.stock : "المخزون"}:</b> {product.stock} {t.piece && t.piece !== "piece" ? t.piece : ""}
          </div>

          <div style={{ marginTop: 5, color: "#111" }}>
            <b>{t.status && t.status !== "status" ? t.status : "الحالة"}:</b>{" "}
            {product.stock > 0
              ? `🟢 ${t.available && t.available !== "available" ? t.available : "متوفر"}`
              : `🔴 ${t.unavailable && t.unavailable !== "unavailable" ? t.unavailable : "غير متوفر"}`}
          </div>
        </div>
      </div>

      {/* 📦 Variants */}
      <div style={{ marginTop: 40 }}>
        <h2>{t.variants && t.variants !== "variants" ? t.variants : "النسخ (Variants)"}</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 15
        }}>
          {product.variants?.map((v) => (
            <div
              key={v.id}
              onClick={() => {
                const imgs = [];
                if (v.image || v.image_url) {
                  imgs.push(v.image || v.image_url);
                }
                (v.images || []).forEach((img) => {
                  imgs.push(img.image || img.image_url);
                });

                if (imgs.length > 0) {
                  setCurrentImages(imgs);
                  setSelectedImage(imgs[0]);
                }
              }}
              style={{
                border: "1px solid #eee",
                padding: 10,
                borderRadius: 10,
                cursor: "pointer",
                background: "#fff",
                color: "#111"
              }}
            >
              {(v.image || v.image_url) && (
                <img
                  src={
                    (v.image || v.image_url).startsWith("http")
                      ? (v.image || v.image_url)
                      : `http://localhost:8000${v.image || v.image_url}`
                  }
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                  alt=""
                />
              )}
              <b>{v.title}</b>
              <div>{t.stock && t.stock !== "stock" ? t.stock : "المخزون"}: {v.stock} {t.piece && t.piece !== "piece" ? t.piece : ""}</div>

              {v.color_hex && (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: v.color_hex,
                      border: "2px solid white",
                      boxShadow: "0 0 4px rgba(0,0,0,.25)",
                    }}
                  />
                </div>
              )}

              {v.size && <div>{t.size && t.size !== "size" ? t.size : "المقاس"}: {v.size}</div>}
              {v.book_language && <div>{t.language && t.language !== "language" ? t.language : "اللغة"}: {v.book_language}</div>}

              {/* خصائص النسخة */}
              {v.attributes?.length > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: "1px solid #eee",
                  }}
                >
                  <b>{t.variant_attributes && t.variant_attributes !== "variant_attributes" ? t.variant_attributes : "خصائص النسخة"}:</b>

                  {v.attributes.map((attr) => (
                    <div
                      key={attr.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 6,
                        fontSize: 14,
                      }}
                    >
                      <span>{attr.attribute_name}</span>

                      {attr.attribute_type === "color" ? (
                        <span
                          style={{
                            display: "inline-block",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: attr.value || "#ddd",
                            border: "2px solid #fff",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                          }}
                          title={attr.value || ""}
                        />
                      ) : (
                        <span>
                          {attr.option_name || attr.value || "-"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;