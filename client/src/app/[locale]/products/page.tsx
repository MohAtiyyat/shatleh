"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import SearchBar from "../../../../components/products/search-bar"
import Filters from "../../../../components/products/filters"
import ProductCard from "../../../../components/products/product-card"
import Pagination from "../../../../components/pagination"
import { useTranslations } from "next-intl"
import Breadcrumb from "../../../../components/breadcrumb"
import { usePathname } from "next/navigation"

// Mock data for products with multilingual support
const mockProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: {
        en: "Calathea Plant",
        ar: "نبات كالاثيا",
    },
    description: {
        en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        ar: "لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليت",
    },
    price: "4.5JD",
    rating: 5,
    image:
        "https://images.pexels.com/photos/129574/pexels-photo-129574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category:
        i % 4 === 0 ? "Seeds" : i % 4 === 1 ? "Home Plants" : i % 4 === 2 ? "Fruit Plants" : "Supplies",
    categoryAr:
        i % 4 === 0 ? "بذور" : i % 4 === 1 ? "نباتات منزلية" : i % 4 === 2 ? "نباتات مثمرة" : "مستلزمات",
    inStock: i % 3 !== 0, // 2/3 of products are in stock
    isTopSelling: i % 5 === 0,
}))

// Mock data for filters with multilingual support
const mockFilters = {
    categories: [
        { id: 1, name: { en: "Seeds", ar: "بذور" }, selected: false },
        { id: 2, name: { en: "Home Plants", ar: "نباتات منزلية" }, selected: false },
        { id: 3, name: { en: "Fruit Plants", ar: "نباتات مثمرة" }, selected: false },
        { id: 4, name: { en: "Supplies", ar: "مستلزمات" }, selected: false },
        { id: 5, name: { en: "Plants", ar: "نباتات" }, selected: false },
        { id: 6, name: { en: "Pesticides", ar: "مبيدات" }, selected: false },
        { id: 7, name: { en: "Fertilizers", ar: "أسمدة" }, selected: false },
        { id: 8, name: { en: "Agricultural Equipment", ar: "مستلزمات زراعية" }, selected: false },
    ],
    availability: [
        { id: 1, name: { en: "In Stock", ar: "متوفر" }, selected: false },
        { id: 2, name: { en: "Out of Stock", ar: "غير متوفر" }, selected: false },
    ],
    ratings: [
        { id: 5, name: { en: "5 Stars", ar: "5 نجوم" }, count: 589, stars: 5, selected: false },
        { id: 4, name: { en: "4 Stars", ar: "4 نجوم" }, count: 461, stars: 4, selected: false },
        { id: 3, name: { en: "3 Stars", ar: "3 نجوم" }, count: 203, stars: 3, selected: false },
        { id: 2, name: { en: "2 Stars", ar: "2 نجوم" }, count: 50, stars: 2, selected: false },
        { id: 1, name: { en: "1 Star", ar: "1 نجمة" }, count: 18, stars: 1, selected: false },
    ],
}

export default function ProductsPage() {
    const t = useTranslations("")
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
    const pathname = usePathname()
    const currentLocale = pathname.split("/")[1] || "ar"

    // State for selected filters
    const [filters, setFilters] = useState({
        categories: [...mockFilters.categories],
        availability: [...mockFilters.availability],
        ratings: [...mockFilters.ratings],
        bestSelling: false,
    })

    // State for filtered products
    const [filteredProducts, setFilteredProducts] = useState(mockProducts)

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 12
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

    // Pre-select category from localStorage on mount
    useEffect(() => {
        const category = localStorage.getItem("selectedCategory")
        if (category) {
            setFilters((prev) => ({
                ...prev,
                categories: prev.categories.map((c) => ({
                    ...c,
                    selected: c.name.ar === category || c.name.en === category,
                })),
                availability: prev.availability.map((a) => ({ ...a, selected: false })),
                ratings: prev.ratings.map((r) => ({ ...r, selected: false })),
                bestSelling: false,
            }))
            localStorage.removeItem("selectedCategory") // Clear after use
        }
    }, [])

    // Clear localStorage when navigating away from the page
    useEffect(() => {
        return () => {
            localStorage.removeItem("selectedCategory") // Clear specific item
            // OR: localStorage.clear() // Clear all localStorage if needed
        }
    }, []) // Empty dependency array ensures this runs on unmount only

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Apply filters and search when filters or search term change
    useEffect(() => {
        let result = [...mockProducts]

        // Apply search filter
        if (debouncedSearchTerm) {
            result = result.filter((product) => {
                const nameMatch =
                    currentLocale === "en"
                        ? product.name.en.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                        : product.name.ar.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                const descMatch =
                    currentLocale === "en"
                        ? product.description.en.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                        : product.description.ar.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                return nameMatch || descMatch
            })
        }

        // Filter by category
        const selectedCategories = filters.categories
            .filter((c) => c.selected)
            .map((c) => c.name.en)
        if (selectedCategories.length > 0) {
            result = result.filter((product) => selectedCategories.includes(product.category))
        }

        // Filter by availability
        const inStockSelected = filters.availability.find((a) => a.name.en === "In Stock")?.selected
        const outOfStockSelected = filters.availability.find((a) => a.name.en === "Out of Stock")?.selected

        if (inStockSelected && !outOfStockSelected) {
            result = result.filter((product) => product.inStock)
        } else if (!inStockSelected && outOfStockSelected) {
            result = result.filter((product) => !product.inStock)
        }

        // Filter by rating
        const selectedRatings = filters.ratings.filter((r) => r.selected).map((r) => r.stars)
        if (selectedRatings.length > 0) {
            result = result.filter((product) => selectedRatings.includes(product.rating))
        }

        // Filter by best selling
        if (filters.bestSelling) {
            result = result.filter((product) => product.isTopSelling)
        }

        setFilteredProducts(result)
        setCurrentPage(1) // Reset to first page when filters change
    }, [filters, debouncedSearchTerm, currentLocale])

    // Handle search submission
    const handleSearch = () => {
        console.log("Search submitted:", searchTerm)
    }

    // Get current page products
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

    return (
        <div className="min-h-screen bg-[#e8f5e9] overflow-hidden">
            {/* Main Content */}
            <main className="container mx-auto px-4 py-2">
                <div className="mb-4 mx-8">
                    <Breadcrumb pageName="products" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mb-3">
                    <div className="sm:col-span-2 md:col-span-1 sm:mx-auto">
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />
                    </div>
                    <Filters filters={filters} setFilters={setFilters} currentLocale={currentLocale} />
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 w-[90%] mx-auto">
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} pageName="products" />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-10"
                        >
                            <p className="text-lg text-[#0f4229]">{t("products.noProducts")}</p>
                            <button
                                onClick={() => {
                                    setFilters({
                                        categories: filters.categories.map((c) => ({ ...c, selected: false })),
                                        availability: filters.availability.map((a) => ({ ...a, selected: false })),
                                        ratings: filters.ratings.map((r) => ({ ...r, selected: false })),
                                        bestSelling: false,
                                    })
                                    setSearchTerm("")
                                }}
                                className="mt-4 px-4 py-2 bg-[#43bb67] text-white rounded-md"
                            >
                                {t("products.clearFilters")}
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Pagination */}
                {filteredProducts.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </main>
        </div>
    )
}