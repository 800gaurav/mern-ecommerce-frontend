import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../features/cart/cartSlice";
import { Star, ShoppingCart, Check, X, Search } from "lucide-react";
import {
  clearFilters,
  fetchProducts,
  setInStock,
  setPage,
  setPriceRange,
  setRating,
  setSearch,
  setSort,
  toggleCategory,
} from "../features/products/productSlice";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error, pagination, availableFilters, filters } = useSelector(
    (state) => state.products
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearch(searchInput.trim()));
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, searchInput]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, filters, pagination.page, pagination.limit]);

  const getCategoryColor = (cat) => {
    const colors = {
      'Electronics': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'Fashion': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Home': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Books': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'Sports': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'Beauty': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'Toys': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    };
    return colors[cat] || 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)';
  };

  return (
    <div className="main-container">
      <div className="products-container">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <span>Filters</span>
            <button className="clear-filters" onClick={() => {
              setSearchInput("");
              dispatch(clearFilters());
            }}>
              Clear All
            </button>
          </div>

          <div className="filter-group">
            <div className="filter-group-title">Sort By</div>
            <select value={filters.sort} onChange={(e) => dispatch(setSort(e.target.value))}>
              <option value="newest">Newest Arrivals</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="top_rated">Customer Rating</option>
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-group-title">Category</div>
            {availableFilters.categories.length === 0 ? (
              <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>No categories</div>
            ) : (
              availableFilters.categories.map((category) => (
                <div key={category} className="filter-checkbox">
                  <input
                    type="checkbox"
                    id={`cat-${category}`}
                    checked={filters.categories.includes(category)}
                    onChange={() => dispatch(toggleCategory(category))}
                  />
                  <label htmlFor={`cat-${category}`}>{category}</label>
                </div>
              ))
            )}
          </div>

          <div className="filter-group">
            <div className="filter-group-title">Price Range</div>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => dispatch(setPriceRange({ minPrice: e.target.value, maxPrice: filters.maxPrice }))}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => dispatch(setPriceRange({ minPrice: filters.minPrice, maxPrice: e.target.value }))}
              />
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-group-title">Minimum Rating</div>
            <select value={filters.rating} onChange={(e) => dispatch(setRating(e.target.value))}>
              <option value="">All Ratings</option>
              <option value="4.5">4.5 ⭐ & Up</option>
              <option value="4">4.0 ⭐ & Up</option>
              <option value="3">3.0 ⭐ & Up</option>
              <option value="2">2.0 ⭐ & Up</option>
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-checkbox">
              <input
                type="checkbox"
                id="in-stock"
                checked={filters.inStock}
                onChange={(e) => dispatch(setInStock(e.target.checked))}
              />
              <label htmlFor="in-stock">In Stock Only</label>
            </div>
          </div>
        </aside>

        <div className="products-main">
          <div className="products-header">
            <div>
              {filters.search && <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>Search Results for "{filters.search}"</h2>}
              {filters.categories.length > 0 && <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>{filters.categories.join(", ")}</h2>}
              {!filters.search && !filters.categories.length && <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>All Products</h2>}
              <div className="products-count">
                {pagination.totalCount > 0 ? (
                  <span>Showing {items.length} of {pagination.totalCount} products</span>
                ) : (
                  <span>No products found</span>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <Loader text="Loading products..." />
          ) : error ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚠️</div>
              <p>{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p>No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {items.map((product) => (
                  <div key={product._id} className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
                    <div className="product-image" style={{ 
                      background: product.images?.[0] 
                        ? `url(http://localhost:5000${product.images[0]})` 
                        : getCategoryColor(product.category),
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}>
                      {!product.images?.[0] && (
                        <div className="product-image-text" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{product.category}</div>
                      )}
                      <div className={`product-badge ${product.stock > 0 ? 'badge-in-stock' : 'badge-out-stock'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {product.stock > 0 ? (
                          <><Check size={14} /> {product.stock} in stock</>
                        ) : (
                          <><X size={14} /> Out of stock</>
                        )}
                      </div>
                    </div>
                    
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-title">{product.name}</h3>
                    
                    <div className="product-rating">
                      <Star size={16} fill="#fbbf24" color="#fbbf24" className="rating-stars" />
                      <span className="rating-value">{Number(product.rating).toFixed(1)}</span>
                    </div>
                    
                    <div className="product-price">
                      <span className="product-price-symbol">₹</span>
                      {Number(product.price).toLocaleString('en-IN')}
                    </div>
                    
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-actions" style={{ gap: '0.5rem' }}>
                      <button 
                        className="btn-view-details"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAuthenticated) {
                            dispatch(addToCart(product));
                          } else {
                            navigate("/login");
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        {isAuthenticated ? (
                          <><ShoppingCart size={16} /> Add to Cart</>
                        ) : (
                          'Login to Buy'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(value) => dispatch(setPage(value))}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
