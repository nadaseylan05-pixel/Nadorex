async function loadProducts(email) {
    const lang = document.getElementById("language")?.value || 'en';
    const container = document.getElementById("products-container");
    container.innerHTML = lang === 'ar' ? "جاري تحميل المنتجات..." : "Loading products...";

    try {
        const response = await fetch(/api/store_products_data?lang=${lang}&email=${encodeURIComponent(email)});
        if (!response.ok) throw new Error(lang === 'ar' ? "فشل في جلب المنتجات" : "Failed to fetch products");

        const products = await response.json();

        if (products.length === 0) {
            container.innerHTML = <p>${lang === 'ar' ? "لا توجد منتجات لهذا المتجر." : "No products for this store."}</p>;
            return;
        }

        let html = '<div class="product-list">';
        for (const p of products) {
            html += `
                <div class="product-card">
                    <h3>${p.name}</h3>
                    <p>${lang === 'ar' ? "السعر" : "Price"}: ${p.price} ${p.currency}</p>
                </div>
            `;
        }
        html += '</div>';
        container.innerHTML = html;

    } catch (error) {
        container.innerHTML = <p>${lang === 'ar' ? "حدث خطأ" : "An error occurred"}: ${error.message}</p>;
    }
}