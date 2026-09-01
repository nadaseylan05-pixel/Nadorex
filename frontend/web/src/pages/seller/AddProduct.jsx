import React, { useState, useEffect } from "react";
import "../../styles/seller/AddProduct.css";
import {useNavigate} from "react-router-dom";
import { HexColorPicker } from "react-colorful";
import { useLanguage } from "../../context/LanguageContext";
import Notifications from "./Notifications"
import SellerArchivedOrders from "./sellerArchivesdOrders";
import { requestNotificationPermission } from "../../notifications";
function AddProduct() {
  console.log("🔥 AddProduct component started");
  const {lang} = useLanguage();
  const [t, setT] = useState({});
  const [instagramUsername, setInstagramUsername] = useState("");
  const [activeTab, setActiveTab] = useState("products"); 
  const [modalTab, setModalTab] = useState("basic"); // التبويب الداخلي لنافذة التعديل
  const navigate =useNavigate();
  const [stats, setStats] = useState({
    totalSales: 45231,
    pendingOrders: 0,
    activeProducts: 198,
    totalStock: 2450,
    totalProducts: 248
  });
  
  const [orders, setOrders] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]);
  const [archivedOrdersLoading, setArchivedOrdersLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [expandedVariant, setExpandedVariant] = useState(null);

  // const {
  //     notifications,
  //     unreadCount,
  // } = useSellerNotifications(lang);
  // --- بيانات نموذج إضافة منتج جديد ---
  const [formData, setFormData] = useState({
    name: "",
    describtion: "",
    category: "",
    price: "",
    old_price: "",
    currency: "₺",
    image_source: "file",
    image: null,
    instagram_image_url: "",
    stock: 0,
    trackStock: true,
    minStock: 5
  });

  // --- مصفوفة النسخ (Variants) عند الإضافة والتعديل ---
  const [variants, setVariants] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const openColorPicker = (index) => {
    setShowColorPicker(showColorPicker === index ? null : index);
  };
  const addVariantImages = (index, files) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              extra_images: [...v.extra_images, ...Array.from(files)],
            }
          : v
      )
    );
  };

  const addEditingVariantImages = (variantIndex, files) => {
    if (!files || files.length === 0) return;
    
    const newFilesArray = Array.from(files); // تحويل FileList إلى Array

    setEditingProduct((prev) => {
      if (!prev) return prev;

      const updatedVariants = prev.variants.map((variant, idx) => {
        if (idx === variantIndex) {
          const currentExtra = variant.extra_images || [];
          return {
            ...variant,
            extra_images: [...currentExtra, ...newFilesArray] // مصفوفة جديدة لضمان التحديث المباشر
          };
        }
        return variant;
      });

      return {
        ...prev,
        variants: updatedVariants
      };
    });
  };
  // جلب البيانات من السيرفر
  // const fetchDashboardData = async () => {
  //   const token = localStorage.getItem("access_token");
  //   try {
  //     const dashboardRes = await fetch(
  //       `http://localhost:8000/api/seller/dashboard/?lang=${lang}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     const dashboardData = await dashboardRes.json();
  //     console.log("Dashboard Response:", dashboardData);
  //     if (dashboardData.success) {
  //       setStats(prev => ({
  //         ...prev,
  //         totalSales: dashboardData.stats.totalSales || prev.totalSales,
  //         activeProducts: dashboardData.stats.activeProducts || prev.activeProducts,
  //         totalStock: dashboardData.stats.totalStock || prev.totalStock,
  //         totalProducts: dashboardData.stats.totalProducts || prev.totalProducts,
  //       }));
        
       
  //       console.log("Orders:", dashboardData.orders);
  //       setOrders(dashboardData.orders || []);
  //       setT(dashboardData.translations || {});
  //       console.log(t);
  //     }
  //   } catch (error) {
  //     console.error("Error loading dashboard data:", error);
  //   }
  // };
  const storeLink = `${window.location.origin}/${instagramUsername}`;
  const fetchDashboardData = async () => {
    const token = localStorage.getItem("access_token");

      try {
          const dashboardRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/seller/dashboard/?lang=${lang}`,
              // `http://localhost:8000/api/seller/dashboard/?lang=${lang}`,
              {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              }
          );

          const dashboardData = await dashboardRes.json();

          console.log("Dashboard Response:", dashboardData);

          if (dashboardData.success) {

              setInstagramUsername(
                  dashboardData.instagram_username || ""
              );

              setStats(prev => ({
                  ...prev,
                  totalSales:
                      dashboardData.stats.totalSales ||
                      prev.totalSales,

                  activeProducts:
                      dashboardData.stats.activeProducts ||
                      prev.activeProducts,

                  totalStock:
                      dashboardData.stats.totalStock ||
                      prev.totalStock,

                  totalProducts:
                      dashboardData.stats.totalProducts ||
                      prev.totalProducts,
              }));

              setOrders(
                  dashboardData.orders || []
              );

              setT(
                  dashboardData.translations || {}
              );
          }

      } catch (error) {
          console.error(
              "Error loading dashboard data:",
              error
          );
      }
  };
  // const fetchArchivedOrders = async () => {
  //     try {
  //         setArchivedOrdersLoading(true);

  //         const data = await getSellerArchivedOrders(lang);

  //         setArchivedOrders(data.orders || []);

  //     } catch (error) {

  //         console.error(
  //             "Error fetching archived orders:",
  //             error
  //         );

  //         setArchivedOrders([]);

  //     } finally {
  //         setArchivedOrdersLoading(false);
  //     }
  // };
  const createEmptyVariant = () => ({
  id: null,
  title: "",
  color: "",
  size: "",
  book_language: "",
  stock: 0,
  image_source: "file",
  image: null,
  extra_images: [],
  image_url: "",
  is_active: true,
  attributes:{},
});


const addEditingVariant = () => {
  console.log("قبل الاضافه ", editingProduct.variants)
  setEditingProduct((prev) => ({
    ...prev,
    variants: [
      ...(prev.variants || []),
      createEmptyVariant(),
    ],
  }));
};


const updateEditingVariant = (index, field, value) => {
  setEditingProduct((prev) => ({
    ...prev,
    variants: prev.variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    ),
  }));
};


const removeEditingVariant = (index) => {
  setEditingProduct((prev) => ({
    ...prev,
    variants: prev.variants.filter((_, i) => i !== index),
  }));
};

  // const fetchProducts = async () => {
  //   const token = localStorage.getItem("access_token");
  //   try {
  //     const productsRes = await fetch(`http://localhost:8000/api/seller/products/?lang=${lang}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const productsData = await productsRes.json();
  //     if (productsData.success) {
  //       setProductsList(productsData.products || []);
  //       // setT(productsData.translations || {});
  //       // console.log("THE PRODUCTS ARE :",ProductsList);
  //     }
  //   } catch (error) {
  //     console.error("Error loading products:", error);
  //   }
  // };
  const fetchProducts = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const productsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/seller/products/?lang=${lang}`,
        // `http://localhost:8000/api/seller/products/?lang=${lang}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const productsData = await productsRes.json();

      if (productsData.success) {
        setProductsList(productsData.products || []);

        setStats(prev => ({
          ...prev,
          totalProducts: productsData.products_length,
          totalStock: productsData.total_stock,
        }));
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  useEffect(() => {
    
    
  const fetchData = async () => {
    const token = localStorage.getItem("access_token");

    try {
      await fetchDashboardData();
      await fetchProducts();

      const categoriesRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories/?lang=${lang}`,
        // `http://localhost:8000/api/categories/?lang=${lang}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const categoriesData = await categoriesRes.json();

      console.log("Categories API:", categoriesData);

      if (categoriesData.categories) {
        setCategoriesList(categoriesData.categories);
      }

    } catch (error) {
      console.error("Error loading initial data:", error);
      console.error(error);
      console.log("1");
      await fetchDashboardData();
      console.log("2");

      await fetchProducts();
      console.log("3");

      const categoriesRes = await fetch();
      console.log("4");
    }
  };
  fetchData();

  }, [lang]);
  // useEffect(() => {

  //     if (activeTab === "archivedOrders") {
  //         fetchArchivedOrders();
  //     }

  // }, [activeTab, lang]);
  
  useEffect(() => {
    console.log("Categories:");

    categoriesList.forEach((cat) => {
      console.log(
        "id:",
        cat.id,
        "name:",
        cat.name,
        "code:",
        cat.code,
        cat
      );
    });

  }, [categoriesList]);
  
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;

    return `http://localhost:8000/${url.replace(/\\/g, "/")}`;
  };

  const handleBaseChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
      
    }));
    if (name === "category" && value)
    {
      fetchCategoryAttributes(value);
    }
  };
  const handleShareClick = async (product) => {
      if (!instagramUsername) {
          alert("لم يتم العثور على اسم حساب المتجر");
          return;
      }

      const productUrl =
          `${window.location.origin}/${instagramUsername}/product/detail/${product.id}`;

      try {
          if (navigator.share) {
              await navigator.share({
                  title: product.name,
                  text: product.name,
                  url: productUrl,
              });
          } else {
              await navigator.clipboard.writeText(productUrl);
              alert("تم نسخ رابط المنتج");
          }
      } catch (error) {
          if (error.name !== "AbortError") {
              console.error("Share error:", error);
          }
      }
  };
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [productAttributes, setProductAttributes] = useState({});
  const handleAttributeChange = (attributeId, value) => {

      setProductAttributes(prev => ({
          ...prev,
          [attributeId]: value
      }));

  };
  // const fetchCategoryAttributes = async (categoryCode) => {

  //     try {

  //         const response = await fetch(
  //             `http://localhost:8000/api/categories/${categoryCode}/attributes/?lang=${lang}`
  //         );
  //         console.log("response status:",response.status);
  //         const data = await response.json();

  //         if (data.success) {
  //             setCategoryAttributes(data.data);
  //         }

  //     } catch (error) {
  //         console.error(
  //             "Error loading attributes",
  //             error.message
  //         );
  //     }
  // };
  const fetchCategoryAttributes = async (categoryCode) => {
    try {
      console.log("FETCHING ATTRIBUTES FOR CATEGORY:", categoryCode);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories/${categoryCode}/attributes/?lang=${lang}`
        // `http://localhost:8000/api/categories/${categoryCode}/attributes/?lang=${lang}`
      );

      console.log("ATTRIBUTES RESPONSE STATUS:", response.status);

      const data = await response.json();

      console.log("ATTRIBUTES RESPONSE DATA:", data);

      if (data.success) {
        console.log("SETTING CATEGORY ATTRIBUTES:", data.data);
        setCategoryAttributes(data.data);
      }

    } catch (error) {
      console.error("Error loading attributes", error.message);
    }
  };
  const handleUpdateStatus = async (orderId, status) => {
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/seller/orders/${orderId}/update-status/`,
        // `http://localhost:8000/api/seller/orders/${orderId}/update-status/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(t.order_status_updated,"✅");
        fetchDashboardData(); // إعادة تحميل الطلبات والإحصائيات
      } else {
        alert(data.error || t.update_order_status_failed);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      alert(t.update_order_status_error);
    }
  };

  const getCategoryType = (categoryCode) => {
    if (!categoryCode) return "general";

    switch (categoryCode) {
      case "clothing":
        return "clothing";

      case "books_education":
        return "book";

      case "accessories_perfume":
        return "accessories";

      default:
        return "general";
    }
  };

  console.log("Selected category:", formData.category);
  const catType = getCategoryType(formData.category);
  const editingCatType = editingProduct ? getCategoryType(editingProduct.category) : "general";

  // --- التحكم بالنسخ (Variants) ---
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { title: "", color: "", size: "", book_language: "", stock: 0, image_source: "file", image: null, extra_images:[], image_url: "", is_active: true, attributes:{} }
    ]);
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) => prev.map((v, idx) => (idx === index ? { ...v, [field]: value } : v)));
  };
  const updateVariantAttribute = (variantIndex, attributeId, value) => {
    setVariants((prev) =>
      prev.map((variant, index) => {
        if (index !== variantIndex) return variant;

        return {
          ...variant,
          attributes: {
            ...variant.attributes,
            [attributeId]: value,
          },
        };
      })
    );
  };
  const updateEditingVariantAttribute = (
    variantIndex,
    attributeId,
    value
  ) => {
    setEditingProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              attributes: {
                ...variant.attributes,
                [attributeId]: value,
              },
            }
          : variant
      ),
    }));
  };
  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const cloneVariant = (index) => {
    setVariants((prev) => [...prev, { ...variants[index] }]);
  };

  const moveVariant = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === variants.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...variants];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setVariants(updated);
  };
  const [extraImages, setExtraImages] = useState([]);
  const handleExtraImagesChange = (e) => {
    // تحويل FileList إلى Array
    const files = Array.from(e.target.files); 
    setExtraImages((prevImages) => [...prevImages, ...files]);
  };
  const removeExtraImage = (index) => {
    setExtraImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }
  
  // احتساب المخزون الكلي تلقائياً في حال وجود نسخ
  // const totalStock = variants.length > 0 
  //   ? variants.reduce((acc, curr) => acc + (parseInt(curr.stock) || 0), 0)
  //   : parseInt(formData.stock) || 0;

  // --- إرسال منتج جديد ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    const payload = new FormData();
    payload.append("name", formData.name);
    
    payload.append("describtion", formData.describtion);
    payload.append("category", formData.category);
    console.log("CATEGORY BEFORE SEND:", formData.category);
    console.log("PAYLOAD CATEGORY:", payload.get("category"));
    payload.append("price", formData.price);
    payload.append("old_price", formData.old_price);
    payload.append("currency", formData.currency);

    if (formData.image_source === "file" && formData.image) {
      payload.append("image", formData.image);
    } else if (formData.image_source === "url") {
      payload.append("image_url", formData.instagram_image_url);
    }
    
    payload.append("stock", parseInt(formData.stock) || 0);
    // خصائص المنتج الرئيسي
    payload.append(
      "attributes",
      JSON.stringify(productAttributes || {})
    );
    // payload.append("stock", totalStock);
    extraImages.forEach((img) => {
        payload.append("extra_images", img);
    });
    variants.forEach((v, index) => {
      payload.append(`variants[${index}][title]`, v.title || `نسخة ${index + 1}`);
      if (catType === "clothing" || catType === "accessories" || catType === "general") {
        payload.append(`variants[${index}][color]`, v.color_hex);
      }
      if (catType === "clothing") {
        payload.append(`variants[${index}][size]`, v.size);
      }
      if (catType === "book") {
        payload.append(`variants[${index}][book_language]`, v.book_language);
      }
      payload.append(`variants[${index}][stock]`, v.stock);
      payload.append(`variants[${index}][is_active]`, v.is_active);

      if (v.image_source === "file" && v.image) {
        payload.append(`variants[${index}][image]`, v.image);
      } else if (v.image_source === "url" && v.image_url) {
        payload.append(`variants[${index}][image_url]`, v.image_url);
      }
      (v.extra_images || []).forEach((img) => {
          payload.append(`variants[${index}][extra_images]`, img);
      });
      payload.append(
        `variants[${index}][attributes]`,
        JSON.stringify(v.attributes || {})
      );
    });

    try {
      // fetch(`http://localhost:8000/api/seller/products/add/?lang=${lang}`, {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/products/add/?lang=${lang}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await res.json();
      
      if (data.success || res.ok) {
        console.log("ADD PRODUCT RESPONSE ",data)
        alert(t.product_added_success , "🎉");
        window.location.reload();
      } else {
        alert(data.error || t.add_product_failed);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- تحديث منتج موجود ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("handleUpdate called");
    console.log(editingProduct.variants);
    console.log(editingProduct.id);

    const token = localStorage.getItem("access_token");
    
    // إعداد البيانات المرسلة للتعديل

    const payload = new FormData();

    // بيانات المنتج الأساسية
    payload.append("name", editingProduct.name);
    payload.append("describtion", editingProduct.describtion);
    payload.append("category", editingProduct.category);
    payload.append("price", editingProduct.price);
    payload.append("old_price", editingProduct.old_price);
    payload.append("currency", editingProduct.currency);
    payload.append("stock", editingProduct.stock);

    // الصورة الرئيسية
    if (editingProduct.image_source === "file") {
      if (editingProduct.image instanceof File) {
        payload.append("image", editingProduct.image);
      }
    } else {
      payload.append(
        "image_url",
        editingProduct.instagram_image_url || ""
      );
    }

    // Variants
    // editingProduct.variants.forEach((v, index) => {
    //   payload.append(`variants[${index}][id]`, v.id || "");
    //   payload.append(`variants[${index}][title]`, v.title || "");
    //   payload.append(`variants[${index}][color]`, v.color_hex || "");
    //   payload.append(`variants[${index}][size]`, v.size || "");
    //   payload.append(`variants[${index}][book_language]`, v.book_language || "");
    //   payload.append(`variants[${index}][stock]`, v.stock || 0);
    //   payload.append(`variants[${index}][is_active]`, v.is_active);
    //   payload.append(
    //     `variants[${index}][attributes]`,
    //     JSON.stringify(v.attributes || {})
    //     );
    //   (v.extra_images || []).forEach((img) => {
    //     if (img instanceof File) {
    //         payload.append(`variants[${index}][extra_images]`, img);
    //     }
    //   });

      
    //   if (v.image_source === "file") {
    //     if (v.image instanceof File) {
    //       payload.append(`variants[${index}][image]`, v.image);
    //     }
    //   } else {
    //     payload.append(
    //       `variants[${index}][image_url]`,
    //       v.image_url || ""
    //     );
    //     Object.entries(v.attributes || {}).forEach(
    //       ([attribute_id, value])=>{

    //         payload.append(
    //           `variants[${index}][attributes][${attribute_id}]`,
    //           value
    //         );

    //       }
    //     );
    //   }
    // });
    editingProduct.variants.forEach((v, index) => {
      console.log(
        "VARIANT ATTRIBUTES BEFORE SEND:",
        index,
        v.attributes
      );
     
      payload.append(`variants[${index}][id]`, v.id || "");
      payload.append(`variants[${index}][title]`, v.title || "");
      payload.append(`variants[${index}][color]`, v.color_hex || "");
      payload.append(`variants[${index}][size]`, v.size || "");
      payload.append(`variants[${index}][is_active]`, v.is_active);
      payload.append(
        `variants[${index}][book_language]`,
        v.book_language || ""
      );
      payload.append(`variants[${index}][stock]`, v.stock || 0);
      payload.append(`variants[${index}][is_active]`, v.is_active);

      // الخصائص
      payload.append(
        `variants[${index}][attributes]`,
        JSON.stringify(v.attributes || {})
      );

      // الصور الإضافية
      (v.extra_images || []).forEach((img) => {
        if (img instanceof File) {
          payload.append(
            `variants[${index}][extra_images]`,
            img
          );
        }
      });

      // الصورة الرئيسية
      if (v.image_source === "file") {

        if (v.image instanceof File) {
          payload.append(
            `variants[${index}][image]`,
            v.image
          );
        }

      } else {

        payload.append(
          `variants[${index}][image_url]`,
          v.image_url || ""
        );

      }
    });

    console.log("🔥 IMAGE SOURCE:", editingProduct.image_source);
    console.log("🔥 IMAGE:", editingProduct.image);
    console.log(
      "🔥 IS FILE:",
      editingProduct.image instanceof File
    );
    console.log("🔥 FORM DATA:");

    for (const [key, value] of payload.entries()) {
      console.log(
        key,
        value instanceof File
          ? `FILE: ${value.name}`
          : value
      );
    }

    
    try {
      // fetch(`http://localhost:8000/api/seller/products/update/${editingProduct.id}/`, {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/products/update/${editingProduct.id}/`, {
        method: "POST",
        headers: { 
          
          Authorization: `Bearer ${token}` 
        },
        body: payload,
      });

      const data = await res.json();
      if (data.success) {
        alert(t.product_updated_successfully,"✨");
        setEditingProduct(null);
        // setT(data.translations);
        fetchProducts(); 
      } else {
        alert(data.error || "فشل التحديث");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تعديل المنتج");
    }
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("access_token");
    if (!window.confirm(t.confirm_delete)) return;
    try {
      // fetch(`http://localhost:8000/api/seller/products/delete/${productId}/`, {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/products/delete/${productId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert(t.delete_successful);
        fetchProducts();
      }
    } catch (err) { console.error(err); }
  };
  const [copied, setCopied] = useState(false);

  const handleCopyStoreLink = async () => {
      if (!storeLink) return;

      try {
          await navigator.clipboard.writeText(storeLink);

          setCopied(true);

          setTimeout(() => {
              setCopied(false);
          }, 2000);

      } catch (error) {
          console.error("COPY STORE LINK ERROR:", error);
      }
  };


  const handleShareStoreLink = async () => {
      if (!storeLink) return;

      try {

          // إذا كان الجهاز يدعم المشاركة
          if (navigator.share) {

              await navigator.share({
                  title: "متجري",
                  text: "تفضل بزيارة متجري",
                  url: storeLink,
              });

          } else {

              // إذا لم يدعم المشاركة، ننسخ الرابط
              await handleCopyStoreLink();

          }

      } catch (error) {

          // المستخدم أغلق نافذة المشاركة
          if (error.name !== "AbortError") {
              console.error(
                  "SHARE STORE LINK ERROR:",
                  error
              );
          }

      }
  };
  const handleConnectInstagram = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/instagram/login/`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Instagram Login Response:", data);

      if (data.success && data.login_url) {
        window.location.href = data.login_url;
      } else {
        console.error("Instagram login URL not received:", data);
      }
    } catch (error) {
      console.error("Instagram login error:", error);
    }
  };
  console.log(t);
  console.log("🔥 About to RETURN AddProduct");
  return (
    // <div className="seller-container" style={{ display: "flex", background: "#f8fafc", minHeight: "100vh", direction: "rtl", fontFamily: "system-ui, sans-serif" }}>
    <div
        className="seller-container"
        style={{
            display: "flex",
            width: "100%",
            maxWidth: "100%",
            minHeight: "100vh",
            background: "#f8fafc",
            direction: "rtl",
            fontFamily: "system-ui, sans-serif",
            boxSizing: "border-box"
        }}
    >  
      {/* القائمة الجانبية (Sidebar) */}
      <div className="sidebar" style={{ boxSizing: "border-box", background: "#fff", borderLeft: "1px solid #e2e8f0", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="logo" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "22px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "30px" }}>
          {/* <span style={{ background: "#2563eb", color: "#fff", padding: "6px 10px", borderRadius: "8px" }}>M</span> متجري */}
          <span
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: "8px",
              fontWeight: "bold"
            }}
          >
            {instagramUsername?.charAt(0).toUpperCase()}
          </span>

          <span>
            {instagramUsername}
          </span>
        </div>
        {storeLink && (
            <div>
                {/* <span>رابط متجري:</span> */}
                <a
                    href={storeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {storeLink}
                </a>
            </div>
        )}
        {storeLink && (
            <div
                style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "14px",
                    marginBottom: "18px",
                }}
            >

                {/* عنوان البطاقة */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "10px",
                    }}
                >
                    {/* <span
                        style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "9px",
                            background: "#eff6ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "17px",
                        }}
                    >
                        🔗
                    </span> */}

                    <div>
                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "#0f172a",
                            }}
                        >
                            {t.my_store_link}
                        </div>

                        <div
                            style={{
                                fontSize: "11px",
                                color: "#64748b",
                                marginTop: "2px",
                            }}
                        >
                            {t.share_store_with_customers}
                        </div>
                    </div>
                </div>


                {/* الرابط */}
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "9px",
                        padding: "9px 10px",
                        marginBottom: "10px",
                        direction: "ltr",
                        overflow: "hidden",
                    }}
                >
                    <a
                        href={storeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "block",
                            color: "#2563eb",
                            fontSize: "12px",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                        title={storeLink}
                    >
                        {storeLink}
                    </a>
                </div>


                {/* الأزرار */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                    }}
                >

                    {/* نسخ */}
                    <button
                        type="button"
                        onClick={handleCopyStoreLink}
                        style={{
                            border: "1px solid #dbeafe",
                            background: copied
                                ? "#ecfdf5"
                                : "#eff6ff",
                            color: copied
                                ? "#059669"
                                : "#2563eb",
                            borderRadius: "8px",
                            padding: "8px 6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600",
                            transition: "all 0.2s",
                        }}
                    >
                        {copied ? "✓ " : t.copy_link}
                    </button>


                    {/* مشاركة */}
                    <button
                        type="button"
                        onClick={(e) => {
                          console.log("Share link is clicked!!");
                          e.stopPropagation();
                          // handleShareStoreLink();
                        }}
                        // style={{
                        //     border: "1px solid #e2e8f0",
                        //     background: "#fff",
                        //     color: "#475569",
                        //     borderRadius: "8px",
                        //     padding: "8px 6px",
                        //     cursor: "pointer",
                        //     fontSize: "12px",
                        //     fontWeight: "600",
                        //     transition: "all 0.2s",
                        style={{
                            position: "relative",
                            zIndex: 9999,
                            pointerEvents: "auto",
                            display: "inline-block",
                            border: "1px solid #e2e8f0",
                            background: "#fff",
                            color: "#475569",
                            borderRadius: "8px",
                            padding: "8px 6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600",
                        
                        }}
                    >
                        📤{t.share}
                    </button>

                </div>


                {/* فتح المتجر */}
                <a
                    href={storeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        marginTop: "8px",
                        padding: "8px",
                        borderRadius: "8px",
                        background: "#2563eb",
                        color: "#fff",
                        textDecoration: "none",
                        fontSize: "12px",
                        fontWeight: "600",
                    }}
                >
                    🌐 {t.open_my_store}
                </a>

            </div>
        )}
        <div style={{ color: "#64748b", fontSize: "14px", padding: "0 10px 10px" }}>{t.main_menu}</div>
        <button type="button" onClick={() => setActiveTab("products")} style={{ border: "none", background: "none", textAlign: "right", padding: "12px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", color: "#475569" }}>🏠 {t.home}</button>
        <button
          type="button"
          onClick={() => {console.log("It is clicked",orders);setActiveTab("orders")}}
          style={{
            border: "none",
            background: activeTab === "orders" ? "#eff6ff" : "none",
            textAlign: "right",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            color: activeTab === "orders" ? "#2563eb" : "#475569",
            fontWeight: activeTab === "orders" ? "bold" : "normal"
          }}
        >
          📦 {t.orders_list}
          <span
            style={{
              background: "#eff6ff",
              color: "#2563eb",
              padding: "2px 8px",
              borderRadius: "10px",
              fontSize: "12px",
              float: "left"
            }}
          >
            {orders.length}
          </span>
        </button> 
        <button
          type="button"
          onClick={() => setActiveTab("archivedOrders")}
          style={{
              border: "none",
              background:
                  activeTab === "archivedOrders"
                      ? "#eff6ff"
                      : "none",
              textAlign: "right",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              color:
                  activeTab === "archivedOrders"
                      ? "#2563eb"
                      : "#475569",
              fontWeight:
                  activeTab === "archivedOrders"
                      ? "bold"
                      : "normal"
          }}
      >
          🗄️ {t.archived_orders || "الطلبات المؤرشفة"}
      </button>
      <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          style={{
              position: "relative",
              border: "none",
              background: "none",
              cursor: "pointer",
          }}
      >
          🔔

          {unreadCount > 0 && (
              <span
                  style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-8px",

                      minWidth: "18px",
                      height: "18px",

                      padding: "0 5px",

                      background: "#ef4444",
                      color: "#fff",

                      borderRadius: "999px",

                      fontSize: "11px",
                      fontWeight: "bold",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      lineHeight: "18px",
                  }}
              >
                  {unreadCount}
              </span>
          )}
      </button>
        {/* <button
          type="button"
          onClick={handleConnectInstagram}
          style={{
            background: "#111827",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          📸 Connect Instagram
        </button>   */}
        <button type="button" style={{ border: "none", background: activeTab === "products" || activeTab === "add" ? "#eff6ff" : "none", textAlign: "right", padding: "12px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", color: "#2563eb", fontWeight: "bold" }} onClick={() => setActiveTab("products")}>🏷️{t.products}</button>
        {/* <button type="button" style={{ border: "none", background: "none", textAlign: "right", padding: "12px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", color: "#475569" }}>📊 {t.inventory_management}</button>
        <button type="button" style={{ border: "none", background: "none", textAlign: "right", padding: "12px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", color: "#475569" }}>👥 {t.customers}</button> */}
      </div>

      {/* المحتوى الرئيسي للموقع */}
      <div className="main-content" style={{ flex: 1, padding: "30px", position: "relative" }}>
        
        {/* شريط علوي للهيدر */}
        <div className="top-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          {/* <div>
            <h2 style={{ margin: 0, fontSize: "24px", color: "#0f172a" }}>اختبار ChatGPT 123</h2>
            <div style={{ color: "#64748b", fontSize: "14px" }}>الصفحه الام &gt; المنتجات</div>
          </div> */}
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            {/* <button type="button" style={{ background: "#fff", border: "1px solid #cbd5e1", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>📥 تصدير المنتجات</button> */}
            <button type="button" style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }} onClick={() => { setActiveTab("add"); setVariants([]); }}>➕ {t.add_product}</button>
          </div>
        </div>

       <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">{t.total_sales}</div>
            <div className="stat-value">
              {stats.totalSales.toLocaleString()} ₺
            </div>
            {/* <div className="stat-change">
              ⬆️ +23% {t.from_last_month}
            </div> */}
          </div>

          <div className="stat-card">
            <div className="stat-title">{t.total_inventory}</div>
            <div className="stat-value">
              {stats.totalStock.toLocaleString()}
            </div>
            {/* <div className="stat-change">
              ⬆️ +8% {t.from_last_month}
            </div> */}
          </div>

          <div className="stat-card">
            <div className="stat-title">{t.active_products}</div>
            <div className="stat-value">
              {stats.activeProducts}
            </div>
            {/* <div className="stat-change">
              ⬆️ +8% {t.from_last_month}
            </div> */}
          </div>

          <div className="stat-card">
            <div className="stat-title">{t.total_products}</div>
            <div className="stat-value">
              {stats.totalProducts}
            </div>
            {/* <div className="stat-change">
              ⬆️ +12% {t.from_last_month}
            </div> */}
          </div>
        </div>

        {/* عرض المنتجات على هيئة جدول */}
        {activeTab === "products" && (
          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "15px" }}>{t.product}</th>
                  <th>{t.stock}</th>
                  <th>{t.statuse}</th>
                  <th>{t.price}</th>
                  <th style={{ textAlign: "center" }}>{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {productsList.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>{t.no_products_add_first}</td>
                  </tr>
                ) : (
                  productsList.map((item) => (
                    <tr key={item.id} 
                      onClick={() => {console.log(item.id); navigate(`/seller/products/${item.id}`)}}
                
                      style={{ borderBottom: "1px solid #f1f5f9" }}>
                     <td
                        
                        style={{
                          padding: "15px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          cursor: "pointer",
                        }}
                      >
                        <img
                          src={getImageUrl(item.image_url)}
                          alt=""
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "6px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: "600", color: "#0f172a" }}>{item.name}</div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>ID: #{item.id}</div>
                        </div>
                      </td>
                      <td style={{ color: "#334155" }}>{item.stock} {t.piece}</td>
                      <td>
                        <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "13px", background: item.stock > 0 ? "#ecfdf5" : "#fef2f2", color: item.stock > 0 ? "#10b981" : "#ef4444" }}>
                          {item.stock > 0 ? t.active : t.out_of_stock}
                        </span>
                      </td>
                      <td style={{ fontWeight: "bold", color: "#0f172a" }}>{item.price} {item.currency || "₺"}</td>
                      
                      <td style={{ textAlign: "center" }}>
                        <button 
                          type="button"
                          onClick={(e) => {

                            e.stopPropagation();
                            console.log("ITEM ATTRIBUTES:", item.attributes);

                            console.log(
                              "VARIANT ATTRIBUTES:",
                              item.variants?.map(v => v.attributes)
                            );

                            console.log("THE ITEMS ARE ",item);
                            console.log("The Vriants are: ",item.variants);
                            console.log("ITEM ATTRIBUETS",item.attributes);
                            console.log("EDIT CATEGORY",item.category);
                            console.log("EDIT CATEGORY CODE",item.category_code);
                            // const productAttributes = {};
                            // (item.attributes || []).forEach(attr => {
                            //   if (attr.attribute != null) {
                            //     productAttributes[attr.attribute] = attr.value;
                            //   }
                            // });
                            console.log("EDIT CATEGORY:", item.category);
                            // if (item.category) {
                            //   fetchCategoryAttributes(item.category);
                            // }
                            
                            const selectedCategory = item.category_code || item.category;

                            console.log("Selected category:", selectedCategory);

                            if (selectedCategory) {
                              fetchCategoryAttributes(selectedCategory);
                            }
                            // const editingAttributes = {};

                            // (item.attributes || []).forEach(attr => {
                            //   if (attr.attribute != null) {
                            //     editingAttributes[attr.attribute] =
                            //       attr.option != null
                            //         ? attr.option
                            //         : attr.value;
                            //   }
                            // });
                            console.log("PRODUCT ATTRIBUTES RAW:", item.attributes);

                            const editingAttributes = {};

                            (item.attributes || []).forEach(attr => {
                              if (attr.attribute != null) {
                                editingAttributes[attr.attribute] =
                                  attr.option != null
                                    ? attr.option
                                    : attr.value;
                              }
                            });

                            console.log("PRODUCT ATTRIBUTES CONVERTED:", editingAttributes);
                            setEditingProduct({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              old_price: item.old_price || "",
                              currency: item.currency || "₺",
                              stock: item.stock,
                              describtion: item.describtion || "",
                              // category: item.category || "",
                              category: item.category_code || item.category || "",
                              image_source: item.image_source || "file",
                              image_url: item.image_url || "",
                              instagram_image_url: item.instagram_image_url || "",
                              attributes: editingAttributes,
                              // variants: Array.isArray(item.variants)? item.variants.map(v => ({
                              //   ...v,
                              //   image_source: v.image_url? "url" : "file",
                              //   // images: v.extra_images || [],
                              //   extra_images:v.images || [],
                              // })) : []
                              variants: Array.isArray(item.variants)
                                ? item.variants.map(v => {

                                    const attributes = {};

                                    (v.attributes || []).forEach(attr => {
                                      if (attr.attribute != null) {
                                        attributes[attr.attribute] =
                                          attr.option != null
                                            ? attr.option
                                            : attr.value;
                                      }
                                    });

                                    return {
                                      ...v,
                                      image_source: v.image_url ? "url" : "file",
                                      extra_images: v.images || [],
                                      attributes: attributes,
                                    };
                                  })
                                : []
                              
                            });
                            setModalTab("basic");
                          }}
                          style={{ background: "#eff6ff", color: "#2563eb", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", marginLeft: "8px" }}
                        >
                          ⚙️ {t.edit_product}
                        </button>
                        {/* <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleShareClick(item);
                            }}
                            title="مشاركة المنتج"
                            style={{
                                background: "#eff6ff",
                                color: "#2563eb",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                marginLeft: "8px"
                            }}
                        >
                            🔗
                        </button> */}
                        <button type="button" onClick={(e) =>{e.stopPropagation();  handleDelete(item.id)}}style={{ background: "#fef2f2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h3>{t.orders_list}</h3>

            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  {/* <th>{t.product}</th>
                  <th>{t.price}</th>
                  <th>{t.status}</th>
                  <th>{t.return_status}</th> */}
                  <th>order_number</th>
                  <th>customer</th>
                  <th>{t.products}</th>
                  <th>{t.price}</th>
                  <th>{t.status}</th>
                  <th>{t.actions}</th>
                </tr>
              </thead>


              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.order_number}
                    onClick={() =>
                      navigate(`/seller/orders/${order.order_number}`)
                    }
                    style={{
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                    }}
                  >
                    <td>{order.order_number}</td>

                    <td>{order.customer_name}</td>

                    <td>{order.products_count}</td>

                    <td>{order.total_price} $</td>

                    <td>
                      {order.status === "processing" && t.processing}

                      {order.status === "shipped" && t.shipped}

                      {order.status === "delivered" && t.mark_as_delivered}

                      {order.status === "return_requested" && (
                        <>
                          ⚠️ {t.return_processing}
                        </>
                      )}

                      {order.status === "return_processing" && (
                        <>
                          🏍️ {t.return_request_pending}
                        </>
                      )}

                      {order.status === "cancelled" && t.cancelled}
                    </td>

                    <td>
                      {t.view_details || "عرض التفاصيل"} →
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* نموذج إضافة منتج جديد بالكامل */}
        {activeTab === "add" && (
          <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "30px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px" }}>📋{t.add_new_product}</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>{t.product_name_label}</label>
                <input type="text" name="name" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}  value={formData.name} onChange={handleBaseChange} required />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>{t.category_label}</label>
                <select name="category" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={formData.category} onChange={handleBaseChange} required>
                  <option value="">{t.choose_category}</option>
                  {categoriesList.map(cat => <option key={cat.code} value={cat.code}>{cat.name}</option>)}
                </select>
              </div>
              {categoryAttributes.length > 0 && (
                <div style={{ marginTop: "20px" }}>

                  {categoryAttributes.map((attr) => (

                    <div key={attr.id} style={{ marginBottom: "15px" }}>

                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                        {attr.translation}
                        {attr.required && " *"}
                      </label>


                      {/* Text */}
                      {attr.attribute_type === "text" && (
                        <input
                          type="text"
                          className="attribute-input"
                          value={productAttributes[attr.id] || ""}
                          onChange={(e) => handleAttributeChange(attr.id,e.target.value)
                          }
                          
                        />
                      )}


                      {/* Number */}
                      {attr.attribute_type === "number" && (
                        <input
                          type="number"
                          className="attribute-input"
                          value={productAttributes[attr.id] || ""}
                          onChange={(e) =>
                            handleAttributeChange(attr.id, e.target.value)
                          }
                        />
                      )}


                      {/* Select */}
                      {attr.attribute_type === "select" && (
                        <select
                          className="attribute-select"
                          value={productAttributes[attr.id] || ""}
                          onChange={(e) =>
                            handleAttributeChange(attr.id, e.target.value)
                          }
                        >
                          <option value="">
                            {t.select}
                          </option>

                          {attr.options.map((option) => (
                            <option
                              key={option.id}
                              value={option.value}
                            >
                              {option.translation}
                            </option>
                          ))}

                        </select>
                      )}


                      {/* Color */}
                      {attr.attribute_type === "color" && (
                        <input
                          type="color"
                          className="attribute-color"
                          value={productAttributes[attr.id] || "#000000"}
                          onChange={(e) =>
                            handleAttributeChange(attr.id, e.target.value)
                          }
                        />
                      )}

                    </div>

                  ))}

                </div>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>{t.describtion}</label>
              <textarea name="describtion" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", height: "100px" }} placeholder={t.product_description} value={formData.describtion} onChange={handleBaseChange} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>{t.price_label}</label>
                <input type="number" name="price" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={formData.price} onChange={handleBaseChange} required />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>{t.old_price_label}(اختياري)</label>
                <input type="number" name="old_price" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={formData.old_price} onChange={handleBaseChange} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>{t.currency}</label>
                <select name="currency" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={formData.currency} onChange={handleBaseChange}>
                  <option value="₺">₺ </option>
                  <option value="USD">USD </option>
                  <option value="TRY">TRY </option>
                </select>
              </div>
            </div>

            {/* إعدادات الصورة الأساسية */}
            <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>صورة المنتج الرئيسية</label>
              <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                <label><input type="radio" name="image_source" value="file" checked={formData.image_source === "file"} onChange={handleBaseChange} /> رفع ملف صورة</label>
                <label><input type="radio" name="image_source" value="url" checked={formData.image_source === "url"} onChange={handleBaseChange} /> رابط صورة (Instagram / Web)</label>
              
              </div>
              {formData.image_source === "file" ? (
                <input type="file" accept="image/*" onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))} />
              ) : (
                <input type="text" name="instagram_image_url" placeholder="https://..." style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={formData.instagram_image_url} onChange={handleBaseChange} />
              )}
            </div>
            <div
              style={{
                background: "#f8fafc",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #e2e8f0",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "bold",
                }}
              >
                {t.product_extra_images}
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleExtraImagesChange}
              />

              {extraImages.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginTop: "15px",
                  }}
                >
                  {extraImages.map((img, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt=""
                        style={{
                          width: 90,
                          height: 90,
                          borderRadius: 10,
                          objectFit: "cover",
                          border: "1px solid #ddd",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => removeExtraImage(index)}
                        style={{
                          position: "absolute",
                          top: -6,
                          left: -6,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          border: "none",
                          background: "#ef4444",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* قسم إدارة المخزون والنسخ */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h4 style={{ margin: 0 }}>📦 {t.product_variants_options} (Variants)</h4>
                <button type="button" onClick={addVariant} style={{ background: "#10b981", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                  ➕{t.add_new_variant}
                </button>
                
              </div>

              {variants.length === 0 ? (
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>{t.total_stock_quantity}</label>
                  <input type="number" name="stock" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={formData.stock} onChange={handleBaseChange} required />
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <p>{categoryAttributes.length}</p>
                  {variants.map((v, index) => (
                    <div key={index} className="variant-card">

                      <div className="variant-main">

                        <input
                          type="text"
                          placeholder={t.variant_name}
                          value={v.title}
                          onChange={(e) => updateVariant(index, "title", e.target.value)}
                          required
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                          }}
                        />

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            updateVariant(index, "image", e.target.files[0])
                          }
                        />

                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            addVariantImages(index, e.target.files)
                          }
                        />

                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {(v.extra_images || []).map((img, i) => (
                            <img
                              key={i}
                              src={URL.createObjectURL(img)}
                              alt=""
                              style={{
                                width: 70,
                                height: 70,
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                            />
                          ))}
                        </div>

                        {/* {(catType === "clothing" ||
                          catType === "accessories" ||
                          catType === "general") && (
                          <div style={{ position: "relative" }}>
                            <div
                              onClick={() => openColorPicker(index)}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: v.color_hex || "#cccccc",
                                border: "2px solid #ccc",
                                cursor: "pointer",
                              }}
                            />

                            {showColorPicker === index && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "50px",
                                  zIndex: 9999,
                                }}
                              >
                                <HexColorPicker
                                  color={v.color_hex || "#ff0000"}
                                  onChange={(color) =>
                                    updateVariant(index, "color_hex", color)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        )} */}

                        {/* {catType === "clothing" && (
                          <input
                            type="text"
                            placeholder="المقاس"
                            value={v.size}
                            onChange={(e) =>
                              updateVariant(index, "size", e.target.value)
                            }
                            style={{
                              padding: "8px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                            }}
                          />
                        )}

                        {catType === "book" && (
                          <input
                            type="text"
                            placeholder="اللغة"
                            value={v.book_language}
                            onChange={(e) =>
                              updateVariant(index, "book_language", e.target.value)
                            }
                            style={{
                              padding: "8px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                            }}
                          />
                        )} */}

                        <input
                          type="number"
                          placeholder="المخزون"
                          value={v.stock}
                          onChange={(e) =>
                            updateVariant(index, "stock", e.target.value)
                          }
                          required
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                          }}
                        />

                      </div>

                      {categoryAttributes.length > 0 && (
                        <div className="variant-attributes">
                          {categoryAttributes.map((attr) => (
                            <div
                                key={attr.id}
                                style={{
                                  marginBottom: "15px",
                                }}
                              >
                                <label
                                  style={{
                                    display: "block",
                                    marginBottom: "6px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {attr.translation}
                                </label>

                                {/* Text */}
                                {attr.attribute_type === "text" && (
                                  <input
                                    type="text"
                                    className="attribute-input"
                                    value={v.attributes?.[attr.id] || ""}
                                    onChange={(e) =>
                                      updateVariantAttribute(index, attr.id, e.target.value)
                                    }
                                    
                                  />
                                )}

                                {/* Number */}
                                {attr.attribute_type === "number" && (
                                  <input
                                    type="number"
                                    className="attribute-input"
                                    value={v.attributes?.[attr.id] || ""}
                                    onChange={(e) =>
                                      updateVariantAttribute(index, attr.id, e.target.value)
                                    }
                                    
                                  />
                                )}

                                {/* Select */}
                                {attr.attribute_type === "select" && (
                                  <select
                                    value={v.attributes?.[attr.id] || ""}
                                    className="attribute-select"
                                    onChange={(e) =>
                                      updateVariantAttribute(index, attr.id, e.target.value)
                                    }
                                    
                                  >
                                    <option value="">اختر</option>

                                    {attr.options.map((option) => (
                                      <option key={option.id} value={option.id}>
                                        {option.translation}
                                      </option>
                                    ))}
                                  </select>
                                )}

                                {/* Color */}
                                {attr.attribute_type === "color" && (
                                  <input
                                    type="color"
                                    className="attribute-color"
                                    value={v.attributes?.[attr.id] || "#000000"}
                                    onChange={(e) =>
                                      updateVariantAttribute(index, attr.id, e.target.value)
                                    }
                                  />
                                )}
                              </div>
                          ))}
                        </div>
                      )}

                      {/* <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          justifyContent: "flex-end",
                          marginTop: "10px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => moveVariant(index, "up")}
                        >
                          ▲
                        </button>

                        <button
                          type="button"
                          onClick={() => moveVariant(index, "down")}
                        >
                          ▼
                        </button>

                        <button
                          type="button"
                          onClick={() => cloneVariant(index)}
                        >
                          📋
                        </button>

                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                        >
                          🗑️
                        </button>
                      </div> */}

                    </div>
                  ))}
                  {/* <div style={{ fontSize: "14px", color: "#475569", fontWeight: "bold" }}>📊 إجمالي المخزون المحسوب تلقائياً: {totalStock} قطعة</div> */}
                </div>
              )}
            </div>

            <button type="submit" style={{ width: "100%", background: "#2563eb", color: "#fff", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}>🚀 {t.save_upload_product}</button>
          </form>
        )}
        {activeTab === "archivedOrders" && (
            <SellerArchivedOrders />
        )}
        {/* {activeTab === "notifications" && (
            <Notifications
                onUnreadCountChange={setUnreadCount}
            />
        )} */}
        <Notifications
            onUnreadCountChange={setUnreadCount}
            visible={activeTab === "notifications"}
        />
        {/* النافذة المنبثقة للتعديل الاحترافي الكامل والمفعل */}
        {editingProduct && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
            {/* <div style={{ background: "#fff", width: "600px", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", overflow: "hidden" }}> */}
            <div
              style={{
                background: "#fff",
                width: "600px",
                maxHeight: "90vh",
                borderRadius: "16px",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                overflowY: "auto",
                overflowX: "hidden"
              }}
            >
              {/* هيدر المودال */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ cursor: "pointer", fontSize: "18px", color: "#94a3b8" }} onClick={() => setEditingProduct(null)}>✕</span>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>🛠️ {t.manage_products}</h3>
                <span style={{ width: "15px" }}></span>
              </div>

              {/* تبويبات المودال العلوية المفعلة بالكامل */}
              <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                {/* <button type="button" onClick={() => setModalTab("seo")} style={{ flex: 1, padding: "12px", border: "none", background: "none", color: modalTab === "seo" ? "#2563eb" : "#64748b", borderBottom: modalTab === "seo" ? "2px solid #2563eb" : "none", cursor: "pointer" }}>SEO 🔍</button>
                <button type="button" onClick={() => setModalTab("shipping")} style={{ flex: 1, padding: "12px", border: "none", background: "none", color: modalTab === "shipping" ? "#2563eb" : "#64748b", borderBottom: modalTab === "shipping" ? "2px solid #2563eb" : "none", cursor: "pointer" }}>الشحن 📦</button> */}
                <button type="button" onClick={() => setModalTab("images")} style={{ flex: 1, padding: "12px", border: "none", background: "none", color: modalTab === "images" ? "#2563eb" : "#64748b", borderBottom: modalTab === "images" ? "2px solid #2563eb" : "none", cursor: "pointer" }}>{t.images} 🖼️</button>
                <button type="button" onClick={() => setModalTab("pricing")} style={{ flex: 1, padding: "12px", border: "none", background: "none", color: modalTab === "pricing" ? "#2563eb" : "#64748b", borderBottom: modalTab === "pricing" ? "2px solid #2563eb" : "none", cursor: "pointer" }}>{t.price_label}💰</button>
                <button type="button" onClick={() => setModalTab("basic")} style={{ flex: 1, padding: "12px", border: "none", background: "none", color: modalTab === "basic" ? "#2563eb" : "#64748b", borderBottom: modalTab === "basic" ? "2px solid #2563eb" : "none", fontWeight: "bold", cursor: "pointer" }}>{t.basic_information} ℹ️</button>
                <button type="button" onClick={() => setModalTab("variants")} style={{ flex: 1, padding: "12px", border: "none", background: "none", color: modalTab === "variants" ? "#2563eb" : "#64748b", borderBottom: modalTab === "variants" ? "2px solid #2563eb" : "none", cursor: "pointer" }}>📦{t.variants}</button>
              </div>

              {/* محتوى المودال الداخلي الفعلي */}
              <form onSubmit={handleUpdate} style={{ padding: "20px" }}>
                
                {/* 1. التبويب الأساسي */}
                {modalTab === "basic" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#334155", fontWeight: "bold" }}>{t.product_name}</label>
                      <input type="text" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#334155", fontWeight: "bold" }}>{t.product_description}</label>
                      <div style={{ border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden" }}>
                        <div style={{ background: "#f8fafc", padding: "6px", borderBottom: "1px solid #cbd5e1", display: "flex", gap: "10px", color: "#64748b", fontSize: "14px" }}>
                          <b>B</b> <i>I</i> 🔗 📋 📜
                        </div>
                        <textarea style={{ width: "100%", padding: "10px", border: "none", height: "100px", resize: "none", outline: "none" }} value={editingProduct.describtion} onChange={(e) => setEditingProduct({ ...editingProduct, describtion: e.target.value })} required />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#334155", fontWeight: "bold" }}>{t.edit_category_section}</label>
                      <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} required>
                        {categoriesList.map(cat => <option key={cat.code} value={cat.code}>{cat.name}</option>)}
                      </select>
                    </div>
                    {/* خصائص المنتج الرئيسية */}
                      {categoryAttributes.length > 0 && (
                        <div
                          style={{
                            borderTop: "1px solid #f1f5f9",
                            paddingTop: "15px",
                            marginTop: "5px",
                          }}
                        >
                          <h4
                            style={{
                              marginBottom: "15px",
                              color: "#334155",
                            }}
                          >
                            خصائص المنتج
                          </h4>

                          {categoryAttributes.map((attr) => (
                            <div
                              key={attr.id}
                              style={{
                                marginBottom: "15px",
                              }}
                            >
                              <label
                                style={{
                                  display: "block",
                                  marginBottom: "6px",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                  color: "#334155",
                                }}
                              >
                                {attr.translation}
                              </label>

                              {/* Text */}
                              {attr.attribute_type === "text" && (
                                <input
                                  type="text"
                                  value={editingProduct.attributes?.[attr.id] || ""}
                                  onChange={(e) =>
                                    setEditingProduct((prev) => ({
                                      ...prev,
                                      attributes: {
                                        ...(prev.attributes || {}),
                                        [attr.id]: e.target.value,
                                      },
                                    }))
                                  }
                                  style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                  }}
                                />
                              )}

                              {/* Number */}
                              {attr.attribute_type === "number" && (
                                <input
                                  type="number"
                                  value={editingProduct.attributes?.[attr.id] || ""}
                                  onChange={(e) =>
                                    setEditingProduct((prev) => ({
                                      ...prev,
                                      attributes: {
                                        ...(prev.attributes || {}),
                                        [attr.id]: e.target.value,
                                      },
                                    }))
                                  }
                                  style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                  }}
                                />
                              )}

                              {/* Select */}
                              {attr.attribute_type === "select" && (
                                <select
                                  value={editingProduct.attributes?.[attr.id] || ""}
                                  onChange={(e) =>
                                    setEditingProduct((prev) => ({
                                      ...prev,
                                      attributes: {
                                        ...(prev.attributes || {}),
                                        [attr.id]: e.target.value,
                                      },
                                    }))
                                  }
                                  style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                  }}
                                >
                                  <option value="">اختر</option>

                                  {attr.options.map((option) => (
                                    <option
                                      key={option.id}
                                      value={option.id}
                                    >
                                      {option.translation}
                                    </option>
                                  ))}
                                </select>
                              )}

                              {/* Color */}
                              {attr.attribute_type === "color" && (
                                <input
                                  type="color"
                                  value={
                                    editingProduct.attributes?.[attr.id] ||
                                    "#000000"
                                  }
                                  onChange={(e) =>
                                    setEditingProduct((prev) => ({
                                      ...prev,
                                      attributes: {
                                        ...(prev.attributes || {}),
                                        [attr.id]: e.target.value,
                                      },
                                    }))
                                  }
                                  style={{
                                    width: "50px",
                                    height: "40px",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "15px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "bold", color: "#334155" }}>{t.update_stock}</span>
                      </div>
                      <input type="number" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} required />
                    </div>
                  </div>
                )}

                {/* 2. تبويب التسعير */}
                {modalTab === "pricing" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#334155", fontWeight: "bold" }}>{t.price_label}</label>
                      <input type="number" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#334155", fontWeight: "bold" }}>{t.old_price_label}</label>
                      <input type="number" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={editingProduct.old_price} onChange={(e) => setEditingProduct({ ...editingProduct, old_price: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#334155", fontWeight: "bold" }}>{t.currency}</label>
                      <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={editingProduct.currency} onChange={(e) => setEditingProduct({ ...editingProduct, currency: e.target.value })}>
                        <option value="₺">₺ (ريال سعودي)</option>
                        <option value="USD">USD (دولار أمريكي)</option>
                        <option value="TRY">TRY (ليرة تركية)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. تبويب الصور */}
                {modalTab === "images" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <label style={{ fontWeight: "bold" }}>إدارة وتحديث الصور</label>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <label><input type="radio" checked={editingProduct.image_source === "file"} onChange={() => setEditingProduct({ ...editingProduct, image_source: "file" })} /> ملف محلي</label>
                      {/* <label><input type="radio" checked={editingProduct.image_source === "url"} onChange={() => setEditingProduct({ ...editingProduct, image_source: "url" })} /> رابط خارجي / إنستغرام</label> */}
                      <label>
                        <input
                          type="radio"
                          checked={editingProduct.image_source === "url"}
                          onChange={() =>
                            setEditingProduct({
                              ...editingProduct,
                              image_source: "url"
                            })
                          }
                        />
                        رابط خارجي / إنستغرام
                      </label>
                    </div>
                    {editingProduct.image_source === "url" ? (
                      <input type="text" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} value={editingProduct.instagram_image_url} onChange={(e) => setEditingProduct({ ...editingProduct, instagram_image_url: e.target.value })} placeholder="https://instagram.com/p/..." />
                    ) : (
                      // <input type="file" accept="image/*" onChange={(e) => setEditingProduct ({ ... editingProduct, image: e.target.files[0],})}/>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];

                          if (!file) return;

                          setEditingProduct({
                            ...editingProduct,
                            image: file,
                            image_source: "file",
                          });
                        }}
                      />
                    )}
                  </div>
                )}
                {/* تبويب النسخ */}
                {modalTab === "variants" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4 style={{ margin: 0 }}>📦 نسخ المنتج</h4>

                      <button type="button" onClick={addEditingVariant} style={{ background: "#10b981", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                        ➕ {t.add_new_variant}
                      </button>
                    </div>

                    {/* هنا سنضيف لاحقًا editingProduct.variants.map(...) */}
                    {editingProduct.variants.map((v, index) => (
                      <div 
                        key={index}
                        style={{
                          background: "#f8fafc",
                          padding: "10px",
                          borderRadius: "8px",
                          display: "grid",
                          gap: "10px",
                          overflowY: "auto",
                          overflowX: "hidden",
                        }}
                      >
                        <input
                          value={v.title || ""}
                          placeholder={t.variant_name}
                          onChange={(e) =>updateEditingVariant(index,"totle", e.target.value)}/>
                          {categoryAttributes.length > 0 && (
                            <div
                              style={{
                                borderTop: "1px solid #e2e8f0",
                                paddingTop: "12px",
                                marginTop: "5px",
                              }}
                            >
                              <label
                                style={{
                                  display: "block",
                                  fontWeight: "bold",
                                  marginBottom: "12px",
                                  color: "#334155",
                                }}
                              >
                               {t.variant_properties}
                              </label>

                              {categoryAttributes.map((attr) => (
                                <div
                                  key={attr.id}
                                  style={{
                                    marginBottom: "12px",
                                  }}
                                >
                                  <label
                                    style={{
                                      display: "block",
                                      marginBottom: "5px",
                                      fontSize: "13px",
                                      color: "#475569",
                                    }}
                                  >
                                    {attr.translation}
                                  </label>

                                  {/* Text */}
                                  {attr.attribute_type === "text" && (
                                    <input
                                      type="text"
                                      value={v.attributes?.[attr.id] || ""}
                                      onChange={(e) =>
                                        updateEditingVariantAttribute(
                                          index,
                                          attr.id,
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        padding: "8px",
                                        borderRadius: "7px",
                                        border: "1px solid #cbd5e1",
                                      }}
                                    />
                                  )}

                                  {/* Number */}
                                  {attr.attribute_type === "number" && (
                                    <input
                                      type="number"
                                      value={v.attributes?.[attr.id] || ""}
                                      onChange={(e) =>
                                        updateEditingVariantAttribute(
                                          index,
                                          attr.id,
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        padding: "8px",
                                        borderRadius: "7px",
                                        border: "1px solid #cbd5e1",
                                      }}
                                    />
                                  )}

                                  {/* Select */}
                                  {attr.attribute_type === "select" && (
                                    <select
                                      value={v.attributes?.[attr.id] || ""}
                                      onChange={(e) =>
                                        updateEditingVariantAttribute(
                                          index,
                                          attr.id,
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        padding: "8px",
                                        borderRadius: "7px",
                                        border: "1px solid #cbd5e1",
                                      }}
                                    >
                                      <option value="">اختر</option>

                                      {attr.options.map((option) => (
                                        <option
                                          key={option.id}
                                          value={option.id}
                                        >
                                          {option.translation}
                                        </option>
                                      ))}
                                    </select>
                                  )}

                                  {/* Color */}
                                  {attr.attribute_type === "color" && (
                                    <input
                                      type="color"
                                      value={
                                        v.attributes?.[attr.id] ||
                                        "#000000"
                                      }
                                      onChange={(e) =>
                                        updateEditingVariantAttribute(
                                          index,
                                          attr.id,
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        width: "50px",
                                        height: "40px",
                                        cursor: "pointer",
                                      }}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {/* placeholder= {t.variant_name}
                          onChange={(e) => updateEditingVariant(index, "title", e.target.value)}
                        /> */}

                        {/* اختيار نوع الصورة الرئيسية */}
                        <div>
                          <label>
                            <input
                              type="radio"
                              checked={v.image_source === "file"}
                              onChange={() => updateEditingVariant(index, "image_source", "file")}
                            />
                            ملف
                          </label>

                          <label>
                            <input
                              type="radio"
                              checked={v.image_source === "url"}
                              onChange={() => updateEditingVariant(index, "image_source", "url")}
                            />
                            رابط
                          </label>
                        </div>

                        {/* الصورة الرئيسية للنسخة */}
                        {v.image_source === "file" ? (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => updateEditingVariant(index, "image", e.target.files[0])}
                          />
                        ) : (
                          <input
                            type="text"
                            value={v.image_url || ""}
                            onChange={(e) => updateEditingVariant(index, "image_url", e.target.value)}
                            placeholder="https://..."
                          />
                        )}

                        {/* زر رفع الصور الإضافية للنسخة */}
                        <label style={{ fontWeight: "bold", fontSize: "12px", color: "#475569" }}>
                          الصور الإضافية للنسخة:
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            console.log("الملفات المحددة:", e.target.files);
                            addEditingVariantImages(index, e.target.files);
                          }}
                        />

                        {/* 📍 هنا مكان عرض المعاينة للصور الإضافية 📍 */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "5px" }}>
                          {(v.extra_images || []).map((img, i) => {
                            // تحديد رابط الصورة سواء كانت ملف جديد أو رابط قديم من السيرفر
                            const imgSrc = img instanceof File 
                              ? URL.createObjectURL(img) 
                              : getImageUrl(typeof img === "string" ? img : img.image_url);

                            return (
                              <div key={i} style={{ position: "relative" }}>
                                <img
                                  src={imgSrc}
                                  alt={`extra-${i}`}
                                  style={{
                                    width: 70,
                                    height: 70,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    border: "1px solid #cbd5e1"
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* لون النسخة */}
                        <div style={{ position: "relative" }}>
                          {/* <div
                            onClick={() => openColorPicker(index)}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              backgroundColor: v.color_hex || "#cccccc",
                              border: "2px solid #ddd",
                              cursor: "pointer",
                            }}
                          /> */}

                        {/* {showColorPicker === index && (
                          <div
                            style={{
                              position: "absolute",
                              top: "50px",
                              zIndex: 1000,
                            }}
                          >
                            <HexColorPicker
                              color={v.color_hex || "#ff0000"}
                              onChange={(color) =>
                                updateEditingVariant(index, "color_hex", color)
                              }
                            />
                          </div>
                        )} */}
                      </div>

{/* 
                      <input
                        value={v.size}
                        placeholder="المقاس"
                        onChange={(e)=>
                          updateEditingVariant(index,"size",e.target.value)
                        }
                      /> */}


                      <input
                        type="number"
                        value={v.stock}
                        placeholder="المخزون"
                        onChange={(e)=>
                          updateEditingVariant(index,"stock",e.target.value)
                        }
                      />

                      {/* خصائص النسخة */}
                      {categoryAttributes.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            marginTop: "10px",
                            padding: "10px",
                            background: "#fff",
                            borderRadius: "8px"
                          }}
                        >

                          <label style={{fontWeight:"bold"}}>
                            {t.variant_properties}
                          </label>


                          {categoryAttributes.map((attr) => (

                            <div key={attr.id}>

                              <label>
                                {attr.translation || attr.name}
                              </label>


                              {/* لو الخاصية Select */}
                              {attr.attribute_type === "select" ? (

                                <select
                                  value={
                                    v.attributes?.[attr.id] || ""
                                  }
                                  onChange={(e)=>
                                    updateEditingVariant(
                                      index,
                                      "attributes",
                                      {
                                        ...v.attributes,
                                        [attr.id]: e.target.value
                                      }
                                    )
                                  }
                                >

                                  <option value="">
                                    اختر
                                  </option>

                                  {attr.options?.map((opt)=>(

                                    <option 
                                      key={opt.id}
                                      value={opt.id}
                                    >
                                      {opt.translation || opt.value}
                                    </option>

                                  ))}

                                </select>


                              ) : (

                                /* Text - Number - Color */

                                <input
                                  type={
                                    attr.attribute_type === "number"
                                    ? "number"
                                    : "text"
                                  }

                                  value={
                                    v.attributes?.[attr.id] || ""
                                  }

                                  onChange={(e)=>
                                    updateEditingVariant(
                                      index,
                                      "attributes",
                                      {
                                        ...v.attributes,
                                        [attr.id]: e.target.value
                                      }
                                    )
                                  }

                                />

                              )}

                            </div>

                          ))}

                        </div>
                      )}

                      <button
                        type="button"
                        onClick={()=>removeEditingVariant(index)}
                      >
                        🗑 حذف النسخة
                      </button>

                    </div>
                  ))}

                  </div>
                )}

                {/* 4 و 5. الأقسام المتقدمة الأخرى */}
                {(modalTab === "shipping" || modalTab === "seo") && (
                  <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                    ⚙️ إعدادات الـ {modalTab.toUpperCase()} الخاصة بالمنتج جاهزة ومرتبطة بقاعدة البيانات عند الحفظ.
                  </div>
                )}

                {/* أزرار الحفظ والإغلاق السفليين */}
                <div style={{ display: "flex", gap: "12px", marginTop: "25px", borderTop: "1px solid #f1f5f9", paddingTop: "15px" }}>
                  <button type="submit" style={{ flex: 1, background: "#2563eb", color: "white", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>💾 {t.save_current_changes}</button>
                  <button type="button" onClick={() => setEditingProduct(null)} style={{ padding: "12px 20px", background: "#f1f5f9", color: "#566474", border: "none", borderRadius: "8px", cursor: "pointer" }}>{t.cancel}</button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AddProduct;