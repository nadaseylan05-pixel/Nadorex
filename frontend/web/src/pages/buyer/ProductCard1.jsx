import React, { useState } from "react";

import styles from "../../styles/ProductCard.module.css";

import ImageGallery from "./ImageGallery";
import VariantSelector from "./VariantSelector";
import PriceBox from "./PriceBox";
import QuantitySelector from "./QuantitySelector";
import { Navigate, useNavigate } from "react-router-dom";


function ProductCard({

    product,
    onAddToCart,

}) {

    console.log("CART LOADED", product.id);
    console.log("PRODUCT CARD", product);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const navigate = useNavigate();
    return (


        <div className={styles.card} onClick={() => { console.log("PRODUCT DETAILS"); navigate(`/buyer/product/detail/${product.id}`) }} >

            <ImageGallery
                product={product}
                variant={selectedVariant}

            />

            <h3>
                {product.name}
            </h3>

            <VariantSelector
                product={product}
                onVariantChange={setSelectedVariant}
            />

            <PriceBox
                product={product}
                variant={selectedVariant}
            />

            <QuantitySelector
                product={product}
                variant={selectedVariant}
                onAddToCart={onAddToCart}
            />

        </div>

    );

}

export default ProductCard;