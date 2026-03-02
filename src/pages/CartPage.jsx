import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../features/cart/cartSlice";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalItems, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const getCategoryIcon = (cat) => {
    const icons = {
      'Electronics': '💻',
      'Fashion': '👕',
      'Home': '🏠',
      'Books': '📚',
      'Sports': '⚽',
      'Beauty': '💄',
      'Toys': '🧸'
    };
    return icons[cat] || '📦';
  };

  return (
    <div className="main-container">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "1.5rem" }}>Shopping Cart ({totalItems} items)</h1>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <p>Your cart is empty</p>
            <button className="btn-primary" onClick={() => navigate("/")} style={{ marginTop: "1rem", width: "auto", padding: "0.75rem 2rem" }}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem", alignItems: "start" }}>
            <div>
              {items.map((item) => (
                <div key={item._id} style={{ 
                  background: "white", 
                  border: "1px solid var(--border)", 
                  borderRadius: "8px", 
                  padding: "1.5rem", 
                  marginBottom: "1rem",
                  display: "flex",
                  gap: "1.5rem"
                }}>
                  <div style={{ 
                    width: "120px", 
                    height: "120px", 
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                    flexShrink: 0
                  }}>
                    {getCategoryIcon(item.category)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: "700", marginBottom: "0.5rem" }}>{item.name}</h3>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
                      {item.category} • {item.brand}
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-dark)", marginBottom: "1rem" }}>
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </div>

                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--border)", borderRadius: "4px" }}>
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                          disabled={item.quantity <= 1}
                          style={{ padding: "0.5rem 0.75rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem" }}
                        >
                          −
                        </button>
                        <span style={{ padding: "0 0.75rem", fontWeight: "600" }}>{item.quantity}</span>
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                          disabled={item.quantity >= item.stock}
                          style={{ padding: "0.5rem 0.75rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem" }}
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => dispatch(removeFromCart(item._id))}
                        className="btn-danger"
                        style={{ padding: "0.5rem 1rem" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", fontWeight: "700", fontSize: "1.25rem" }}>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}

              <button 
                onClick={() => dispatch(clearCart())}
                style={{ 
                  background: "none", 
                  border: "1px solid var(--danger)", 
                  color: "var(--danger)", 
                  padding: "0.75rem 1.5rem", 
                  borderRadius: "6px", 
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Clear Cart
              </button>
            </div>

            <div style={{ 
              background: "white", 
              border: "1px solid var(--border)", 
              borderRadius: "8px", 
              padding: "1.5rem",
              position: "sticky",
              top: "6rem"
            }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1rem" }}>Order Summary</h2>
              
              <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>Shipping</span>
                  <span style={{ color: "var(--success)" }}>FREE</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.5rem" }}>
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>

              <button 
                className="btn-primary"
                onClick={() => alert("Checkout functionality coming soon!")}
                style={{ marginBottom: "1rem" }}
              >
                Proceed to Checkout
              </button>

              <button 
                onClick={() => navigate("/")}
                style={{ 
                  width: "100%",
                  padding: "0.75rem",
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
