import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const ITEMS_PER_PAGE = 8;
const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹50,000', min: 0, max: 50000 },
  { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
  { label: '₹1,00,000 - ₹2,00,000', min: 100000, max: 200000 },
  { label: 'Above ₹2,00,000', min: 200000, max: Infinity },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'gold', label: 'Gold Jewellery' },
  { value: 'diamond', label: 'Diamond Jewellery' },
  { value: 'bridal', label: 'Bridal Collection' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'bangles', label: 'Bangles' },
];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const paramSearch = searchParams.get('search');
    const paramCategory = searchParams.get('category');
    if (paramSearch) setSearch(paramSearch);
    if (paramCategory) setCategory(paramCategory);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const range = priceRanges[priceRange];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (category !== 'all') {
      result = result.filter(
        (p) => p.category === category || p.subcategory === category
      );
    }

    result = result.filter(
      (p) => p.price >= range.min && p.price <= range.max
    );

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
      default:
        result.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    return result;
  }, [search, category, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, priceRange, sortBy]);

  return (
    <div className="py-12 bg-cream min-h-screen">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="font-sans text-gold text-sm uppercase tracking-[0.4em]">Collection</span>
          <h1 className="section-title mt-3">Shop All Jewellery</h1>
          <p className="section-subtitle mx-auto">
            Browse our complete collection of handcrafted luxury jewellery
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-sm shadow-card sticky top-24">
              <h3 className="font-display text-lg mb-6 flex items-center gap-2">
                <FiFilter className="text-gold" />
                Filters
              </h3>

              <div className="mb-6">
                <label className="font-sans text-sm font-semibold uppercase tracking-wider text-luxury-gray mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gray" size={16} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="input-field pl-10 !py-2.5"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="font-sans text-sm font-semibold uppercase tracking-wider text-luxury-gray mb-2 block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field !py-2.5"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="font-sans text-sm font-semibold uppercase tracking-wider text-luxury-gray mb-2 block">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="input-field !py-2.5"
                >
                  {priceRanges.map((range, i) => (
                    <option key={i} value={i}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-sans text-sm font-semibold uppercase tracking-wider text-luxury-gray mb-2 block">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field !py-2.5"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="font-sans text-sm text-luxury-gray">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden btn-outline !px-4 !py-2 !text-xs"
              >
                <FiFilter size={14} />
                Filters
              </button>
            </div>

            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-sm">
                <p className="font-display text-xl text-luxury-gray">No products found</p>
                <p className="font-sans text-sm text-luxury-gray mt-2">Try adjusting your filters</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gold/30 rounded-sm hover:bg-gold hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-luxury-black transition-colors"
                >
                  <FiChevronLeft size={20} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 font-sans text-sm rounded-sm transition-colors ${
                      currentPage === i + 1
                        ? 'bg-gold text-luxury-black font-bold'
                        : 'border border-gold/30 hover:bg-gold/10'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gold/30 rounded-sm hover:bg-gold hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-luxury-black transition-colors"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
