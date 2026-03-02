function ProductCard({ product }) {
  const rating = Number(product.rating || 0).toFixed(1);
  const inStock = product.stock > 0;
  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
  const shortDescription =
    product.description.length > 100
      ? `${product.description.slice(0, 100).trim()}...`
      : product.description;

  return (
    <article className="product-card">
      <div className="product-visual" aria-hidden="true">
        <span>{initials}</span>
      </div>

      <div className="product-top">
        <p className="product-category">{product.category}</p>
        <p className={`stock-badge ${inStock ? "in" : "out"}`}>
          {inStock ? `${product.stock} left` : "Out"}
        </p>
      </div>

      <h3>{product.name}</h3>
      <p className="brand-line">by {product.brand}</p>
      <p className="product-description">{shortDescription}</p>

      <div className="product-meta">
        <p className="price">₹{Number(product.price).toLocaleString("en-IN")}</p>
        <p className="rating">{rating}</p>
      </div>
    </article>
  );
}

export default ProductCard;
