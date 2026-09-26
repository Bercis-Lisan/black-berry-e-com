import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import ProductCard from "./common/productCard";
import Reveal from "./common/reveal";
import { categories, products, getCategory } from "../data/products";
import { ensureProductColors } from "../utils/productDisplay";

const API_BASE_URL = "http://localhost:5000/api";

function Products() {
  const { category } = useParams();
  const activeCategory = category ? getCategory(category) : null;
  const [databaseProducts, setDatabaseProducts] = useState([]);

  useEffect(() => {
    let active = true;
    axios.get(`${API_BASE_URL}/products`)
      .then(({ data }) => {
        if (active) {
          setDatabaseProducts((data.products || []).map((product) => ({
            ...product,
            id: product._id || product.id,
            isNew: product.tag?.toLowerCase() === "new",
            colors: ensureProductColors(product.colors),
          })));
        }
      })
      .catch((error) => console.error("Could not load published products:", error));
    return () => {
      active = false;
    };
  }, []);

  const allProducts = [...databaseProducts, ...products];
  const list = activeCategory
    ? allProducts.filter((p) => p.category === activeCategory.slug)
    : allProducts;

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f]">
      <div className="mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-16">
      <div key={category || "all"} className="mb-10 animate-fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2997ff]">
          Black Berry collection
        </p>
        <div className="mt-4">
        <p className="text-xs font-medium text-[#86868b]">
          <Link to="/" className="link-underline hover:text-ink">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-[#474747]">
            {activeCategory ? activeCategory.name : "All products"}
          </span>
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f] sm:text-5xl">
          {activeCategory ? activeCategory.name : "All products"}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#707070] sm:text-base">
          {activeCategory
            ? activeCategory.tagline
            : "Browse the full Black Berry lineup, across every category."}
        </p>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-[#e5e5e7] pb-6">
        <Link
          to="/products"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-smooth ${
            !activeCategory
              ? "bg-[#1d1d1f] text-white shadow-sm"
              : "border border-[#e5e5e7] bg-white text-[#707070] hover:border-[#1d1d1f]/30 hover:text-[#1d1d1f]"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            to={`/products/${c.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-smooth ${
              activeCategory?.slug === c.slug
                ? "bg-[#1d1d1f] text-white shadow-sm"
                : "border border-[#e5e5e7] bg-white text-[#707070] hover:border-[#1d1d1f]/30 hover:text-[#1d1d1f]"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Sort bar */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[#707070]"><span className="font-semibold text-[#1d1d1f]">{list.length}</span> products</p>
        
      </div>

      {/* Grid */}
      <div key={`grid-${category || "all"}`} className="grid auto-rows-fr grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {list.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 50} className="h-full">
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
      </div>
    </div>
  );
}

export default Products;
