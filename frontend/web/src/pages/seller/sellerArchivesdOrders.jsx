// import React, { useEffect, useState } from "react";
// import { useLanguage } from "../../context/LanguageContext";


// // ==================================================
// // جلب الطلبات المؤرشفة من Django API
// // ==================================================

// const getSellerArchivedOrders = async (lang) => {

//     const token = localStorage.getItem("access_token");

//     const response = await fetch(
//         `http://localhost:8000/api/seller/archived-orders/?lang=${lang}`,
//         {
//             method: "GET",

//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//         }
//     );

//     if (!response.ok) {

//         const errorData =
//             await response.json().catch(() => ({}));

//         throw new Error(
//             errorData.error ||
//             errorData.message ||
//             "Failed to fetch archived orders"
//         );

//     }

//     return await response.json();
// };


// function SellerArchivedOrders() {

//     const { lang } = useLanguage();

//     const [archivedOrders, setArchivedOrders] = useState([]);
//     const [archivedOrdersLoading, setArchivedOrdersLoading] = useState(false);
//     const [error, setError] = useState("");


//     // ==================================================
//     // جلب الطلبات المؤرشفة
//     // ==================================================

//     const fetchArchivedOrders = async () => {

//         try {

//             setArchivedOrdersLoading(true);
//             setError("");

//             const data =
//                 await getSellerArchivedOrders(lang);

//             console.log(
//                 "ARCHIVED ORDERS RESPONSE:",
//                 data
//             );

//             console.log(
//                 "ARCHIVED ORDERS:",
//                 data?.orders
//             );

//             setArchivedOrders(
//                 data?.orders || []
//             );

//         } catch (error) {

//             console.error(
//                 "Error fetching archived orders:",
//                 error
//             );

//             setArchivedOrders([]);

//             setError(
//                 error?.message ||
//                 "حدث خطأ أثناء جلب الطلبات المؤرشفة"
//             );

//         } finally {

//             setArchivedOrdersLoading(false);

//         }

//     };


//     // ==================================================
//     // عند فتح المكون أو تغيير اللغة
//     // ==================================================

//     useEffect(() => {

//         fetchArchivedOrders();

//     }, [lang]);


//     // ==================================================
//     // Loading
//     // ==================================================

//     if (archivedOrdersLoading) {

//         return (
//             <div style={{
//                 padding: "30px",
//                 textAlign: "center",
//             }}>
//                 جاري تحميل الطلبات المؤرشفة...
//             </div>
//         );

//     }


//     // ==================================================
//     // Error
//     // ==================================================

//     if (error) {

//         return (
//             <div style={{
//                 padding: "30px",
//                 textAlign: "center",
//                 color: "#dc2626",
//             }}>
//                 {error}
//             </div>
//         );

//     }


//     // ==================================================
//     // الصفحة
//     // ==================================================

//     return (

//         <div style={{
//             padding: "24px",
//             width: "100%",
//         }}>

//             <div style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "24px",
//             }}>

//                 <h2 style={{
//                     margin: 0,
//                     color: "#1e293b",
//                 }}>
//                     الطلبات المؤرشفة
//                 </h2>


//                 <button
//                     type="button"
//                     onClick={fetchArchivedOrders}
//                     style={{
//                         padding: "8px 14px",
//                         border: "1px solid #cbd5e1",
//                         borderRadius: "8px",
//                         background: "#fff",
//                         cursor: "pointer",
//                     }}
//                 >
//                     تحديث
//                 </button>

//             </div>


//             {archivedOrders.length === 0 ? (

//                 <div style={{
//                     padding: "40px",
//                     textAlign: "center",
//                     background: "#f8fafc",
//                     borderRadius: "12px",
//                     color: "#64748b",
//                 }}>
//                     لا توجد طلبات مؤرشفة
//                 </div>

//             ) : (

//                 <div style={{
//                     display: "grid",
//                     gap: "12px",
//                 }}>

//                     {archivedOrders.map((order, index) => (

//                         <div
//                             key={
//                                 order.id ||
//                                 order.order_number ||
//                                 index
//                             }
//                             style={{
//                                 background: "#fff",
//                                 border: "1px solid #e2e8f0",
//                                 borderRadius: "12px",
//                                 padding: "16px",
//                             }}
//                         >

//                             <div style={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                             }}>

//                                 <strong>
//                                     {order.order_number ||
//                                         order.orderNumber ||
//                                         `طلب #${order.id}`}
//                                 </strong>

//                                 <span style={{
//                                     color: "#64748b",
//                                     fontSize: "14px",
//                                 }}>
//                                     {order.status || "Archived"}
//                                 </span>

//                             </div>


//                             {order.total_price != null && (

//                                 <div style={{
//                                     marginTop: "10px",
//                                     color: "#334155",
//                                 }}>
//                                     الإجمالي:{" "}
//                                     <strong>
//                                         {order.total_price}
//                                     </strong>
//                                 </div>

//                             )}

//                         </div>

//                     ))}

//                 </div>

//             )}

//         </div>

//     );
// }

// export default SellerArchivedOrders;
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useLanguage } from "../../context/LanguageContext";


// // ==================================================
// // جلب الطلبات المؤرشفة من Django API
// // ==================================================

// const getSellerArchivedOrders = async (lang) => {

//     const token = localStorage.getItem("access_token");
//     const [t, setT] = useState({});
//     const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/seller/archived-orders/?lang=${lang}`,
//         // `http://localhost:8000/api/seller/archived-orders/?lang=${lang}`,
//         {
//             method: "GET",

//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//         }
//     );

//     if (!response.ok) {

//         const errorData =
//             await response.json().catch(() => ({}));

//         throw new Error(
//             errorData.error ||
//             errorData.message ||
//             "Failed to fetch archived orders"
//         );

//     }

//     return await response.json();
// };


// function SellerArchivedOrders() {

//     const { lang } = useLanguage();

//     const navigate = useNavigate();

//     const [archivedOrders, setArchivedOrders] = useState([]);
//     const [archivedOrdersLoading, setArchivedOrdersLoading] = useState(false);
//     const [error, setError] = useState("");


//     // ==================================================
//     // جلب الطلبات المؤرشفة
//     // ==================================================

//     const fetchArchivedOrders = async () => {

//         try {

//             setArchivedOrdersLoading(true);
//             setError("");

//             const data =
//                 await getSellerArchivedOrders(lang);

//             console.log(
//                 "ARCHIVED ORDERS RESPONSE:",
//                 data
//             );

//             console.log(
//                 "ARCHIVED ORDERS:",
//                 data?.orders
//             );

//             setArchivedOrders(
//                 data?.orders || []
//             );

//         } catch (error) {

//             console.error(
//                 "Error fetching archived orders:",
//                 error
//             );

//             setArchivedOrders([]);

//             setError(
//                 error?.message ||
//                 "حدث خطأ أثناء جلب الطلبات المؤرشفة"
//             );

//         } finally {

//             setArchivedOrdersLoading(false);

//         }

//     };


//     // ==================================================
//     // عند فتح المكون أو تغيير اللغة
//     // ==================================================

//     useEffect(() => {

//         fetchArchivedOrders();

//     }, [lang]);


//     // ==================================================
//     // Loading
//     // ==================================================

//     if (archivedOrdersLoading) {

//         return (
//             <div
//                 style={{
//                     padding: "30px",
//                     textAlign: "center",
//                 }}
//             >
//                 جاري تحميل الطلبات المؤرشفة...
//             </div>
//         );

//     }


//     // ==================================================
//     // Error
//     // ==================================================

//     if (error) {

//         return (
//             <div
//                 style={{
//                     padding: "30px",
//                     textAlign: "center",
//                     color: "#dc2626",
//                 }}
//             >
//                 {error}
//             </div>
//         );

//     }


//     // ==================================================
//     // الصفحة
//     // ==================================================

//     return (

//         <div
//             style={{
//                 padding: "24px",
//                 width: "100%",
//             }}
//         >

//             {/* ==========================================
//                 Header
//             ========================================== */}

//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "24px",
//                 }}
//             >

//                 <h2
//                     style={{
//                         margin: 0,
//                         color: "#1e293b",
//                     }}
//                 >
//                     الطلبات المؤرشفة
//                 </h2>


//                 <button
//                     type="button"
//                     onClick={fetchArchivedOrders}
//                     style={{
//                         padding: "8px 14px",
//                         border: "1px solid #cbd5e1",
//                         borderRadius: "8px",
//                         background: "#fff",
//                         cursor: "pointer",
//                     }}
//                 >
//                     تحديث
//                 </button>

//             </div>


//             {/* ==========================================
//                 لا توجد طلبات
//             ========================================== */}

//             {archivedOrders.length === 0 ? (

//                 <div
//                     style={{
//                         padding: "40px",
//                         textAlign: "center",
//                         background: "#f8fafc",
//                         borderRadius: "12px",
//                         color: "#64748b",
//                     }}
//                 >
//                    {t.no_archived_orders}
//                 </div>

//             ) : (

//                 <div
//                     style={{
//                         display: "grid",
//                         gap: "12px",
//                     }}
//                 >

//                     {archivedOrders.map((order, index) => {

//                         const orderNumber =
//                             order.order_number ||
//                             order.orderNumber;

//                         return (

//                             <div
//                                 key={
//                                     order.id ||
//                                     orderNumber ||
//                                     index
//                                 }
//                                 style={{
//                                     background: "#fff",
//                                     border: "1px solid #e2e8f0",
//                                     borderRadius: "12px",
//                                     padding: "16px",
//                                 }}
//                             >

//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         justifyContent: "space-between",
//                                         alignItems: "center",
//                                     }}
//                                 >

//                                     {/* ==================================
//                                         رقم الطلب
//                                         قابل للضغط
//                                     ================================== */}

//                                     <button
//                                         type="button"
//                                         onClick={() => {

//                                             if (!orderNumber) {
//                                                 console.error(
//                                                     "Order number is missing:",
//                                                     order
//                                                 );
//                                                 return;
//                                             }

//                                             navigate(
//                                                 `/seller/orders/${encodeURIComponent(
//                                                     orderNumber
//                                                 )}`
//                                             );

//                                         }}
//                                         style={{
//                                             background: "none",
//                                             border: "none",
//                                             padding: 0,
//                                             color: "#2563eb",
//                                             cursor: "pointer",
//                                             fontWeight: "600",
//                                             fontSize: "16px",
//                                         }}
//                                     >
//                                         {orderNumber ||
//                                             `طلب #${order.id}`}
//                                     </button>


//                                     {/* ==================================
//                                         حالة الطلب
//                                     ================================== */}

//                                     <span
//                                         style={{
//                                             color: "#64748b",
//                                             fontSize: "14px",
//                                         }}
//                                     >
//                                         {order.status || "Archived"}
//                                     </span>

//                                 </div>


//                                 {/* ==================================
//                                     إجمالي الطلب
//                                 ================================== */}

//                                 {order.total_price != null && (

//                                     <div
//                                         style={{
//                                             marginTop: "10px",
//                                             color: "#334155",
//                                         }}
//                                     >
//                                         الإجمالي:{" "}

//                                         <strong>
//                                             {order.total_price}
//                                         </strong>

//                                     </div>

//                                 )}

//                             </div>

//                         );

//                     })}

//                 </div>

//             )}

//         </div>

//     );
// }

// export default SellerArchivedOrders;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

// ==================================================
// جلب الطلبات المؤرشفة من Django API
// ==================================================
const getSellerArchivedOrders = async (lang) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/seller/archived-orders/?lang=${lang}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.error ||
        errorData.message ||
        "Failed to fetch archived orders"
    );
  }

  return await response.json();
};

function SellerArchivedOrders() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [archivedOrders, setArchivedOrders] = useState([]);
  const [archivedOrdersLoading, setArchivedOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [t, setT] = useState({}); // 👈 التصريح الصحيح لحالة الترجمة

  // ==================================================
  // جلب الطلبات المؤرشفة
  // ==================================================
  const fetchArchivedOrders = async () => {
    try {
      setArchivedOrdersLoading(true);
      setError("");

      const data = await getSellerArchivedOrders(lang);

      console.log("ARCHIVED ORDERS RESPONSE:", data);
      console.log("ARCHIVED ORDERS:", data?.orders);

      // 👈 تحديث الترجمات والطلبات من استجابة الـ API
      setT(data?.translations || {});
      setArchivedOrders(data?.orders || []);
    } catch (error) {
      console.error("Error fetching archived orders:", error);
      setArchivedOrders([]);
      setError(
        error?.message || "حدث خطأ أثناء جلب الطلبات المؤرشفة"
      );
    } finally {
      setArchivedOrdersLoading(false);
    }
  };

  // ==================================================
  // عند فتح المكون أو تغيير اللغة
  // ==================================================
  useEffect(() => {
    fetchArchivedOrders();
  }, [lang]);

  // ==================================================
  // Loading
  // ==================================================
  if (archivedOrdersLoading) {
    return (
      <div
        style={{
          padding: "30px",
          textAlign: "center",
        }}
      >
        
        {t.loading_archived_orders || "جاري تحميل الطلبات المؤرشفة..."}
      </div>
    );
  }

  // ==================================================
  // Error
  // ==================================================
  if (error) {
    return (
      <div
        style={{
          padding: "30px",
          textAlign: "center",
          color: "#dc2626",
        }}
      >
        {error}
      </div>
    );
  }

  // ==================================================
  // الصفحة
  // ==================================================
  return (
    <div
      style={{
        padding: "24px",
        width: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#1e293b",
          }}
        >
          {/* {t.archived_orders && t.archived_orders !== "archived_orders"
            ? t.archived_orders
            : "الطلبات المؤرشفة"} */}
            {t.archived_orders}
        </h2>

        <button
          type="button"
          onClick={fetchArchivedOrders}
          style={{
            padding: "8px 14px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          {t.refresh && t.refresh !== "refresh" ? t.refresh : "تحديث"}
        </button>
      </div>

      {/* لا توجد طلبات */}
      {archivedOrders.length === 0 ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            background: "#f8fafc",
            borderRadius: "12px",
            color: "#64748b",
          }}
        >
          {/* {t.no_archived_orders && t.no_archived_orders !== "no_archived_orders"
            ? t.no_archived_orders
            : "لا توجد طلبات مؤرشفة"} */}
            {t.orders?.no_archived_orders}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {archivedOrders.map((order, index) => {
            const orderNumber = order.order_number || order.orderNumber;

            return (
              <div
                key={order.id || orderNumber || index}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* رقم الطلب */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!orderNumber) {
                        console.error("Order number is missing:", order);
                        return;
                      }

                      navigate(
                        `/seller/orders/${encodeURIComponent(orderNumber)}`
                      );
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "#2563eb",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    {orderNumber || `${t.order || "طلب"} #${order.id}`}
                  </button>

                  {/* حالة الطلب */}
                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    {order.status || "Archived"}
                  </span>
                </div>

                {/* إجمالي الطلب */}
                {order.total_price != null && (
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#334155",
                    }}
                  >
                    {t.total && t.total !== "total" ? t.total : "الإجمالي"}:{" "}
                    <strong>{order.total_price}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SellerArchivedOrders;