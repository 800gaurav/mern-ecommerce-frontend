function FilterSidebar({
  availableFilters,
  filters,
  onCategoryToggle,
  onBrandToggle,
  onPriceChange,
  onRatingChange,
  onStockChange,
  onSortChange,
  onClear,
}) {
  return (
    <aside className="filters-panel">
      <div className="filters-header">
        <h3>Filters</h3>
        <button type="button" className="text-btn" onClick={onClear}>
          Clear All
        </button>
      </div>

      <div className="filter-group">
        <p className="filter-title">Sort By</p>
        <select value={filters.sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="newest">🆕 Newest First</option>
          <option value="price_low_high">💰 Price: Low to High</option>
          <option value="price_high_low">💎 Price: High to Low</option>
          <option value="top_rated">⭐ Top Rated</option>
        </select>
      </div>

      <div className="filter-group">
        <p className="filter-title">Category</p>
        <div className="checkbox-list">
          {availableFilters.categories.length === 0 && (
            <p className="empty-text">No categories available</p>
          )}
          {availableFilters.categories.map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => onCategoryToggle(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <p className="filter-title">Brand</p>
        <div className="checkbox-list">
          {availableFilters.brands.length === 0 && (
            <p className="empty-text">No brands available</p>
          )}
          {availableFilters.brands.map((brand) => (
            <label key={brand}>
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => onBrandToggle(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <p className="filter-title">Price Range (₹)</p>
        <div className="price-grid">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              onPriceChange({
                minPrice: e.target.value,
                maxPrice: filters.maxPrice,
              })
            }
          />
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              onPriceChange({
                minPrice: filters.minPrice,
                maxPrice: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="filter-group">
        <p className="filter-title">Minimum Rating</p>
        <select value={filters.rating} onChange={(e) => onRatingChange(e.target.value)}>
          <option value="">All Ratings</option>
          <option value="4.5">⭐ 4.5 & Above</option>
          <option value="4">⭐ 4.0 & Above</option>
          <option value="3">⭐ 3.0 & Above</option>
          <option value="2">⭐ 2.0 & Above</option>
        </select>
      </div>

      <label className="stock-toggle">
        <input
          type="checkbox"
          checked={filters.inStock}
          onChange={(e) => onStockChange(e.target.checked)}
        />
        <span>✓ In Stock Only</span>
      </label>
    </aside>
  );
}

export default FilterSidebar;
