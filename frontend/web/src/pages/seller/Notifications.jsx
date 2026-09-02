// "Notifications.jsx"

// import React, { useEffect, useState } from "react";
// import { useLanguage } from "../../context/LanguageContext";


// // ==================================================
// // جلب إشعارات البائع من Django API
// // ==================================================

// const getSellerNotifications = async (lang) => {

//     const token = localStorage.getItem("access_token");

//     const response = await fetch(
//         `http://localhost:8000/api/seller/notifications/?lang=${lang}`,
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
//             "Failed to fetch notifications"
//         );
//     }

//     return await response.json();
// };


// // ==================================================
// // Notifications Component
// // ==================================================

// function Notifications() {

//     const { lang } = useLanguage();

//     const [notifications, setNotifications] = useState([]);
//     const [unreadCount, setUnreadCount] = useState(0);

//     const [notificationsLoading, setNotificationsLoading] =
//         useState(false);

//     const [error, setError] = useState("");


//     // ==================================================
//     // جلب الإشعارات
//     // ==================================================

//     const fetchNotifications = async () => {

//         try {

//             setNotificationsLoading(true);
//             setError("");

//             const data =
//                 await getSellerNotifications(lang);

//             console.log(
//                 "NOTIFICATIONS RESPONSE:",
//                 data
//             );

//             console.log(
//                 "NOTIFICATIONS:",
//                 data?.notifications
//             );

//             setNotifications(
//                 data?.notifications || []
//             );

//             setUnreadCount(
//                 data?.unread_count || 0
//             );

//         } catch (error) {

//             console.error(
//                 "Error fetching notifications:",
//                 error
//             );

//             setNotifications([]);
//             setUnreadCount(0);

//             setError(
//                 error?.message ||
//                 "حدث خطأ أثناء جلب الإشعارات"
//             );

//         } finally {

//             setNotificationsLoading(false);

//         }

//     };


//     // ==================================================
//     // عند فتح المكون أو تغيير اللغة
//     // ==================================================

//     useEffect(() => {

//         fetchNotifications();

//     }, [lang]);


//     // ==================================================
//     // Loading
//     // ==================================================

//     if (notificationsLoading) {

//         return (
//             <div
//                 style={{
//                     padding: "30px",
//                     textAlign: "center",
//                 }}
//             >
//                 جاري تحميل الإشعارات...
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

//                 <div>

//                     <h2
//                         style={{
//                             margin: 0,
//                             color: "#1e293b",
//                         }}
//                     >
//                         الإشعارات
//                     </h2>

//                     {unreadCount > 0 && (

//                         <div
//                             style={{
//                                 marginTop: "6px",
//                                 color: "#64748b",
//                                 fontSize: "14px",
//                             }}
//                         >
//                             لديك {unreadCount} إشعار غير مقروء
//                         </div>

//                     )}

//                 </div>


//                 <button
//                     type="button"
//                     onClick={fetchNotifications}
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
//                 لا توجد إشعارات
//             ========================================== */}

//             {notifications.length === 0 ? (

//                 <div
//                     style={{
//                         padding: "40px",
//                         textAlign: "center",
//                         background: "#f8fafc",
//                         borderRadius: "12px",
//                         color: "#64748b",
//                     }}
//                 >
//                     لا توجد إشعارات
//                 </div>

//             ) : (

//                 <div
//                     style={{
//                         display: "grid",
//                         gap: "12px",
//                     }}
//                 >

//                     {notifications.map(
//                         (notification, index) => (

//                             <div
//                                 key={
//                                     notification.id ||
//                                     index
//                                 }
//                                 style={{
//                                     background:
//                                         notification.is_read
//                                             ? "#fff"
//                                             : "#eff6ff",

//                                     border:
//                                         "1px solid #e2e8f0",

//                                     borderRadius: "12px",

//                                     padding: "16px",

//                                     cursor: "pointer",
//                                 }}
//                             >

//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         justifyContent:
//                                             "space-between",
//                                         alignItems:
//                                             "center",
//                                     }}
//                                 >

//                                     {/* ==================================
//                                         نص الإشعار
//                                     ================================== */}

//                                     <strong
//                                         style={{
//                                             color: "#1e293b",
//                                             fontSize: "15px",
//                                         }}
//                                     >
//                                         {notification.message}
//                                     </strong>


//                                     {/* ==================================
//                                         غير مقروء
//                                     ================================== */}

//                                     {!notification.is_read && (

//                                         <span
//                                             style={{
//                                                 width: "9px",
//                                                 height: "9px",
//                                                 borderRadius:
//                                                     "50%",
//                                                 background:
//                                                     "#2563eb",
//                                                 display:
//                                                     "inline-block",
//                                             }}
//                                         />

//                                     )}

//                                 </div>


//                                 {/* ==================================
//                                     رقم الطلب
//                                 ================================== */}

//                                 {notification.order_id && (

//                                     <div
//                                         style={{
//                                             marginTop: "8px",
//                                             color: "#64748b",
//                                             fontSize: "14px",
//                                         }}
//                                     >
//                                         الطلب #
//                                         {notification.order_id}
//                                     </div>

//                                 )}


//                                 {/* ==================================
//                                     التاريخ
//                                 ================================== */}

//                                 {notification.created_at && (

//                                     <div
//                                         style={{
//                                             marginTop: "6px",
//                                             color: "#94a3b8",
//                                             fontSize: "12px",
//                                         }}
//                                     >
//                                         {new Date(
//                                             notification.created_at
//                                         ).toLocaleString()}
//                                     </div>

//                                 )}

//                             </div>

//                         )
//                     )}

//                 </div>

//             )}

//         </div>

//     );
// }

// export default Notifications;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";


// ==================================================
// جلب إشعارات البائع
// ==================================================

const getSellerNotifications = async (lang) => {

    const token = localStorage.getItem("access_token");

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/seller/notifications/?lang=${lang}`,
        // `http://localhost:8000/api/seller/notifications/?lang=${lang}`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json().catch(() => ({}));

        throw new Error(
            errorData.error ||
            errorData.message ||
            "Failed to fetch notifications"
        );
    }

    return await response.json();
};


// ==================================================
// تحديد إشعار كمقروء
// ==================================================

// const markNotificationAsRead = async (notificationId) => {

//     const token = localStorage.getItem("access_token");

//     const response = await fetch(
//         `http://localhost:8000/api/seller/notifications/${notificationId}/read/`,
//         {
//             method: "PATCH",

//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//         }
//     );

//     const data =
//         await response.json().catch(() => ({}));

//     if (!response.ok) {

//         throw new Error(
//             data.error ||
//             data.message ||
//             "Failed to mark notification as read"
//         );
//     }

//     return data;
// };
// const markNotificationAsRead = async (notificationId) => {
//     const token = localStorage.getItem("access_token");

//     const response = await fetch(
//         `http://localhost:8000/api/seller/notifications/${notificationId}/read/`,
//         {
//             method: "PATCH",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//         }
//     );

//     const data = await response.json().catch(() => ({}));

//     console.log("READ NOTIFICATION STATUS:", response.status);
//     console.log("READ NOTIFICATION RESPONSE:", data);

//     if (!response.ok) {
//         throw new Error(
//             data.message ||
//             data.error ||
//             `Failed to mark notification as read (${response.status})`
//         );
//     }

//     return data;
// };
const markNotificationAsRead = async (notificationId) => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
        `http://localhost:8000/api/seller/notifications/${notificationId}/read/`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    const text = await response.text();

    console.log("READ STATUS:", response.status);
    console.log("READ RESPONSE:", text);

    if (!response.ok) {
        throw new Error(
            `READ API FAILED: ${response.status} - ${text}`
        );
    }

    return text ? JSON.parse(text) : {};
};
// ==================================================
// Notifications Component
// ==================================================

function Notifications({ onUnreadCountChange }) {

    const { lang } = useLanguage();

    const navigate = useNavigate();

    const [notifications, setNotifications] =
        useState([]);

    const [unreadCount, setUnreadCount] =
        useState(0);

    const [notificationsLoading, setNotificationsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [readingId, setReadingId] =
        useState(null);
    const [t, setT] = useState({});

    // ==================================================
    // جلب الإشعارات
    // ==================================================

    const fetchNotifications = async () => {

        try {

            setNotificationsLoading(true);
            setError("");

            const data =
                await getSellerNotifications(lang);

            console.log(
                "NOTIFICATIONS RESPONSE:",
                data
            );

            console.log(
                "NOTIFICATIONS:",
                data?.notifications
            );

            setNotifications(
                data?.notifications || []
            );
            setT(
                data?.translations || {}
            );
            setUnreadCount(
                data?.unread_count || 0
            );
            onUnreadCountChange?.(
                data?.unread_count || 0
            );

        } catch (error) {

            console.error(
                "Error fetching notifications:",
                error
            );

            setNotifications([]);
            setUnreadCount(0);

            setError(
                error?.message ||
                "حدث خطأ أثناء جلب الإشعارات"
            );

        } finally {

            setNotificationsLoading(false);

        }
    };


    // ==================================================
    // الضغط على الإشعار
    //
    // 1. تحديده كمقروء
    // 2. إخفاؤه
    // 3. فتح تفاصيل الطلب
    // ==================================================

    // const handleNotificationClick = async (notification) => {

    //     console.log(
    //         "CLICKED NOTIFICATION:",
    //         notification
    //     );

    //     console.log(
    //         "IS READ:",
    //         notification.is_read
    //     );
    //     if (!notification?.id) {
    //         return;
    //     }

    //     // منع الضغط مرة أخرى أثناء التنفيذ
    //     if (readingId === notification.id) {
    //         return;
    //     }

    //     try {

    //         setReadingId(notification.id);

    //         // ==================================================
    //         // تحديد الإشعار كمقروء
    //         // ==================================================

    //         if (!notification.is_read) {

    //             await markNotificationAsRead(
    //                 notification.id
    //             );

    //             // ----------------------------------------------
    //             // إزالة الإشعار من القائمة
    //             // ----------------------------------------------

    //             setNotifications((currentNotifications) =>
    //                 currentNotifications.filter(
    //                     (item) =>
    //                         item.id !== notification.id
    //                 )
    //             );

    //             // ----------------------------------------------
    //             // تقليل عدد غير المقروء
    //             // ----------------------------------------------

    //             setUnreadCount((currentCount) =>
    //                 Math.max(
    //                     0,
    //                     currentCount - 1
    //                 )
    //             );
    //         }

    //         // ==================================================
    //         // فتح تفاصيل الطلب
    //         // ==================================================

    //         const orderNumber =
    //             notification.order_number;

    //         if (orderNumber) {

    //             navigate(
    //                 `/seller/orders/${encodeURIComponent(
    //                     orderNumber
    //                 )}`
    //             );

    //             return;
    //         }

    //     } catch (error) {

    //         console.error(
    //             "Error handling notification:",
    //             error
    //         );

    //     } finally {

    //         setReadingId(null);

    //     }
    // };
    // const handleNotificationClick = async (notification) => {

    //     if (!notification?.id) {
    //         return;
    //     }

    //     if (readingId === notification.id) {
    //         return;
    //     }

    //     try {

    //         setReadingId(notification.id);

    //         // ==================================================
    //         // إذا كان غير مقروء → نحدده كمقروء في قاعدة البيانات
    //         // ==================================================

    //         if (!notification.is_read) {

    //             try {

    //                 await markNotificationAsRead(
    //                     notification.id
    //                 );

    //                 // setUnreadCount((currentCount) =>
    //                 //     Math.max(0, currentCount - 1)
    //                 // );
    //                 setUnreadCount((currentCount) => {

    //                     const newCount = Math.max(
    //                         0,
    //                         currentCount - 1
    //                     );

    //                     onUnreadCountChange?.(newCount);

    //                     return newCount;
    //                 });
    //             } catch (error) {

    //                 console.error(
    //                     "Error marking notification as read:",
    //                     error
    //                 );

    //             }
    //         }

    //         // ==================================================
    //         // إزالة الإشعار من القائمة في React
    //         // سواء كان مقروءاً أو غير مقروء
    //         // ==================================================

    //         // setNotifications((currentNotifications) =>
    //         //     currentNotifications.filter(
    //         //         (item) =>
    //         //             item.id !== notification.id
    //         //     )
    //         // );
    //         setNotifications((currentNotifications) =>
    //             currentNotifications.map((item) =>
    //                 item.id === notification.id
    //                     ? { ...item, is_read: true }
    //                     : item
    //             )
    //         );
    //         // ==================================================
    //         // فتح تفاصيل الطلب
    //         // ==================================================

    //         const orderNumber =
    //             notification.order_number;

    //         if (orderNumber) {

    //             navigate(
    //                 `/seller/orders/${encodeURIComponent(
    //                     orderNumber
    //                 )}`
    //             );
    //         }

    //     } finally {

    //         setReadingId(null);

    //     }
    // };
    const handleNotificationClick = async (notification) => {

        if (!notification?.id) {
            return;
        }

        if (readingId === notification.id) {
            return;
        }

        try {

            setReadingId(notification.id);

            // ==========================================
            // إذا كان غير مقروء
            // ==========================================

            if (!notification.is_read) {

                console.log(
                    "MARKING NOTIFICATION AS READ:",
                    notification.id
                );

                await markNotificationAsRead(
                    notification.id
                );

                console.log(
                    "NOTIFICATION MARKED AS READ:",
                    notification.id
                );

                // ==========================================
                // إزالة الإشعار من القائمة فوراً
                // ==========================================

                setNotifications((currentNotifications) =>
                    currentNotifications.filter(
                        (item) =>
                            item.id !== notification.id
                    )
                );

                // ==========================================
                // تحديث عدد الإشعارات
                // ==========================================

                setUnreadCount((currentCount) => {

                    const newCount = Math.max(
                        0,
                        currentCount - 1
                    );

                    console.log(
                        "NEW UNREAD COUNT:",
                        newCount
                    );

                    onUnreadCountChange?.(
                        newCount
                    );

                    return newCount;
                });
            }

            // ==========================================
            // فتح تفاصيل الطلب
            // ==========================================

            const orderNumber =
                notification.order_number;

            if (orderNumber) {

                navigate(
                    `/seller/orders/${encodeURIComponent(
                        orderNumber
                    )}`
                );
            }

        } catch (error) {

            console.error(
                "ERROR MARKING NOTIFICATION:",
                error
            );

        } finally {

            setReadingId(null);

        }
    };

    // ==================================================
    // عند فتح الصفحة أو تغيير اللغة
    // ==================================================

    useEffect(() => {

        fetchNotifications();

    }, [lang]);


    // ==================================================
    // Loading
    // ==================================================

    if (notificationsLoading) {

        return (
            <div
                style={{
                    padding: "30px",
                    textAlign: "center",
                }}
            >
                {t.loading_notifications}
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

            {/* ==========================================
                Header
            ========================================== */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                }}
            >

                <div>

                    <h2
                        style={{
                            margin: 0,
                            color: "#1e293b",
                        }}
                    >
                        {t.notifications}
                    </h2>

                    {unreadCount > 0 && (

                        <div
                            style={{
                                marginTop: "6px",
                                color: "#64748b",
                                fontSize: "14px",
                            }}
                        >
                            لديك {unreadCount} إشعار غير مقروء
                        </div>

                    )}

                </div>


                {/* ==================================
                    تحديث
                ================================== */}

                {/* <button
                    type="button"
                    onClick={fetchNotifications}
                    style={{
                        padding: "8px 14px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        background: "#fff",
                        cursor: "pointer",
                    }}
                >
                    {t.refresh}
                   
                </button> */}

            </div>


            {/* ==========================================
                لا توجد إشعارات
            ========================================== */}

            {notifications.length === 0 ? (

                <div
                    style={{
                        padding: "40px",
                        textAlign: "center",
                        background: "#f8fafc",
                        borderRadius: "12px",
                        color: "#64748b",
                    }}
                >
                    {t.no_notifications}
                </div>

            ) : (

                <div
                    style={{
                        display: "grid",
                        gap: "12px",
                    }}
                >

                    {notifications.map(
                        (notification, index) => (

                            <div
                                key={
                                    notification.id ||
                                    index
                                }

                                onClick={() =>
                                    handleNotificationClick(
                                        notification
                                    )
                                }

                                style={{
                                    background:
                                        notification.is_read
                                            ? "#fff"
                                            : "#eff6ff",

                                    border:
                                        "1px solid #e2e8f0",

                                    borderRadius:
                                        "12px",

                                    padding: "16px",

                                    cursor:
                                        readingId ===
                                            notification.id
                                            ? "default"
                                            : "pointer",

                                    opacity:
                                        readingId ===
                                            notification.id
                                            ? 0.6
                                            : 1,

                                    transition:
                                        "all 0.2s ease",
                                }}
                            >

                                {/* ==================================
                                    النص + نقطة غير مقروء
                                ================================== */}

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "center",
                                    }}
                                >

                                    <strong
                                        style={{
                                            color:
                                                "#1e293b",

                                            fontSize:
                                                "15px",
                                        }}
                                    >
                                        {notification.message}
                                    </strong>


                                    {!notification.is_read && (

                                        <span
                                            style={{
                                                width: "9px",
                                                height: "9px",
                                                borderRadius:
                                                    "50%",

                                                background:
                                                    "#2563eb",

                                                display:
                                                    "inline-block",

                                                flexShrink: 0,
                                            }}
                                        />

                                    )}

                                </div>


                                {/* ==================================
                                    رقم الطلب
                                ================================== */}

                                {notification.order_number && (

                                    <div
                                        style={{
                                            marginTop:
                                                "8px",

                                            color:
                                                "#64748b",

                                            fontSize:
                                                "14px",
                                        }}
                                    >
                                        الطلب #

                                        {
                                            notification.order_number
                                        }
                                    </div>

                                )}


                                {/* ==================================
                                    التاريخ
                                ================================== */}

                                {notification.created_at && (

                                    <div
                                        style={{
                                            marginTop:
                                                "6px",

                                            color:
                                                "#94a3b8",

                                            fontSize:
                                                "12px",
                                        }}
                                    >
                                        {new Date(
                                            notification.created_at
                                        ).toLocaleString()}
                                    </div>

                                )}

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );
}

export default Notifications;