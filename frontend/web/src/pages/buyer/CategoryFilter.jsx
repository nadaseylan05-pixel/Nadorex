import React, { useEffect, useState } from "react";
import styles from "../../styles/CategoryFilter.module.css";

import {
    FaBorderAll,
    FaShirt,
    FaBookOpen,
    FaGem,
    FaLaptop,
    FaPumpSoap,
    FaHouse,
    FaBaby,
    FaDumbbell,
    FaBurger,
} from "react-icons/fa6";
import { MdVisibility } from "react-icons/md";

function CategoryFilter({
    lang = "en",
    selectedCategory,
    setSelectedCategory,
    // products =[],
    availableCategories =[],
}) {

    const [categories, setCategories] = useState([]);

    // useEffect(() => {
    //     fetch(`http://localhost:8000/api/categories/?lang=${lang}`)
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setCategories(data.categories || []);
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         });
    // }, [lang]);
    useEffect(() => {
        fetch(`http://localhost:8000/api/categories/?lang=${lang}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("ALL CATEGORIES FROM API:", data.categories);
                console.log("AVAILABLE CATEGORIES RECEIVED:", availableCategories);
                // const allCategories = data.categories || [];
                // const allCategor = allCategories.find(
                //     category => category.code === "all"
                // );
                // const filteredCategories = allCategories.filter(
                //     category =>
                //         availableCategories.includes(category.code)
                // );
                
                // setCategories(filteredCategories);
                const allCategories = data.categories || [];

                const allCategory = allCategories.find(
                    category => category.code === "all"
                );

                const filteredCategories = allCategories.filter(
                    category =>
                        availableCategories.includes(category.code)
                );

                setCategories(
                    allCategory
                        ? [allCategory, ...filteredCategories]
                        : filteredCategories
                );
            })
            .catch((err) => {
                console.error(err);
            });
    }, [lang, availableCategories]);
    
    const getCategoryIcon = (code) => {
        switch (code) {
            case "clothing":
                return <FaShirt />;

            case "books_education":
                return <FaBookOpen />;

            case "accessories_perfume":
                return <FaGem />;

            case "electronics":
                return <FaLaptop />;

            case "beauty":
                return <FaPumpSoap />;

            case "home":
                return <FaHouse />;

            case "kids":
                return <FaBaby />;

            case "sports":
                return <FaDumbbell />;

            case "food":
                return <FaBurger />;

            default:
                return <FaBorderAll />;
        }
    };

    return (
        <section className={styles.wrapper}>

            <div className={styles.header}>
                <h2>Browse Categories</h2>
                <span>{categories.length} Categories</span>
            </div>

            <div className={styles.categoriesBar}>

                {/* <button
                    type="button"
                    className={`${styles.categoryCard} ${
                        selectedCategory === "all" ? styles.active : ""
                    }`}
                    onClick={() => setSelectedCategory("all")}
                >
                    <div className={styles.categoryIcon}>
                        <FaBorderAll />
                    </div>

                    
                    <span className={styles.categoryName}>
                        {
                            allCategories.find(
                                category => category.code === "all"
                            )?.name || "All"
                        }
                    </span>
                </button> */}

                {/* {categories
                    .filter((c) => c.code !== "all")
                    .map((category) => (
                

                        <button
                            key={category.code}
                            type="button"
                            className={`${styles.categoryCard} ${
                                selectedCategory === category.code
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() =>
                                setSelectedCategory(category.code)
                            }
                        >
                            <div className={styles.categoryIcon}>
                                {getCategoryIcon(category.code)}
                            </div>

                            <span className={styles.categoryName}>
                                {category.name}
                            </span>
                        </button>

                    ))} */}
                {categories.map((category) => (
                    <button
                        key={category.code}
                        type="button"
                        className={`${styles.categoryCard} ${
                            selectedCategory === category.code
                                ? styles.active
                                : ""
                        }`}
                        onClick={() =>
                            setSelectedCategory(category.code)
                        }
                    >
                        <div className={styles.categoryIcon}>
                            {getCategoryIcon(category.code)}
                        </div>

                        <span className={styles.categoryName}>
                            {category.name}
                        </span>
                    </button>
                ))}
            </div>

        </section>
    );
}

export default CategoryFilter;