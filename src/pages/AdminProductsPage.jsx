import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Plus, Users, ShoppingBag, Tag, Home, LogOut } from "lucide-react";
import {
  clearAdminStatus,
  deleteAdminProduct,
  fetchAdminProducts,
  fetchAllUsers,
  toggleBlockUser,
  deleteUser,
  fetchAllOrders,
  updateOrderStatus,
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../features/admin/adminSlice";
import { logout } from "../features/auth/authSlice";
import Loader from "../components/Loader";
import api from "../services/api";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  rating: "",
};

function AdminProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, users, orders, categories, loading, formLoading, error, successMessage } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");

  useEffect(() => {
    if (activeTab === "dashboard") {
      dispatch(fetchAdminProducts({ limit: 100, search }));
      dispatch(fetchAllOrders());
      dispatch(fetchAllUsers());
    } else if (activeTab === "products" || activeTab === "add") {
      dispatch(fetchAllCategories());
      const timer = setTimeout(() => {
        dispatch(fetchAdminProducts({ limit: 100, search }));
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [dispatch, search, activeTab]);

  useEffect(() => {
    if (activeTab === "users") {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (activeTab === "orders") {
      dispatch(fetchAllOrders());
    } else if (activeTab === "categories") {
      dispatch(fetchAllCategories());
    }
  }, [dispatch, activeTab]);

  useEffect(() => {
    return () => {
      dispatch(clearAdminStatus());
    };
  }, [dispatch]);

  const totalStock = items.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const inStockProducts = items.filter((product) => Number(product.stock) > 0).length;
  const outOfStockProducts = items.filter((product) => Number(product.stock) === 0).length;
  const averageRating = items.length
    ? (items.reduce((sum, product) => sum + Number(product.rating || 0), 0) / items.length).toFixed(1)
    : "0.0";

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setLocalError("Maximum 5 images allowed");
      return;
    }
    setImages(files);
    setLocalError("");
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");
    setLocalSuccess("");
    dispatch(clearAdminStatus());

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", Number(formData.price));
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", Number(formData.stock));
      if (formData.rating) {
        formDataToSend.append("rating", Number(formData.rating));
      }

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      if (editingId) {
        await api.put(`/products/${editingId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setLocalSuccess("Product updated successfully!");
      } else {
        await api.post("/products", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setLocalSuccess("Product created successfully!");
      }

      setFormData(initialForm);
      setImages([]);
      setImagePreviews([]);
      setEditingId(null);
      dispatch(fetchAdminProducts({ limit: 100, search }));
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setLocalSuccess("");
      }, 3000);
    } catch (err) {
      setLocalError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      rating: String(product.rating ?? ""),
    });
    setImages([]);
    setImagePreviews([]);
    setActiveTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      dispatch(fetchAdminProducts({ limit: 100, search }));
      setLocalSuccess("Product deleted successfully!");
    } catch (err) {
      setLocalError(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };



  const handleToggleBlock = async (userId) => {
    await dispatch(toggleBlockUser(userId));
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await dispatch(deleteUser(userId));
  };

  const handleOrderStatusChange = async (orderId, status) => {
    await dispatch(updateOrderStatus({ id: orderId, status }));
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategoryId) {
        await dispatch(updateCategory({ id: editingCategoryId, payload: categoryForm })).unwrap();
      } else {
        await dispatch(createCategory(categoryForm)).unwrap();
      }
      setCategoryForm({ name: "" });
      setEditingCategoryId(null);
    } catch (err) {}
  };

  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat._id);
    setCategoryForm({ name: cat.name });
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await dispatch(deleteCategory(id));
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          Shop<span>Hub</span>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button
            className={`admin-nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <Package size={18} /> Products
          </button>
          <button
            className={`admin-nav-item ${activeTab === "add" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("add");
              setEditingId(null);
              setFormData(initialForm);
            }}
          >
            <Plus size={18} /> Add Product
          </button>
          <button
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={18} /> Users
          </button>
          <button
            className={`admin-nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag size={18} /> Orders
          </button>
          <button
            className={`admin-nav-item ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <Tag size={18} /> Categories
          </button>
          <button
            className="admin-nav-item"
            onClick={() => navigate("/")}
          >
            <Home size={18} /> View Store
          </button>
          <button
            className="admin-nav-item"
            onClick={handleLogout}
            style={{ marginTop: "auto" }}
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        {activeTab === "dashboard" && (
          <>
            <div className="admin-header">
              <h1>Dashboard</h1>
              <p>Welcome back, {user?.name}!</p>
            </div>

            <div className="admin-stats">
              <div className="stat-card">
                <h3>📦 Total Products</h3>
                <div className="stat-value">{items.length}</div>
              </div>
              <div className="stat-card">
                <h3>👥 Total Users</h3>
                <div className="stat-value">{users.length}</div>
              </div>
              <div className="stat-card">
                <h3>🛒 Total Orders</h3>
                <div className="stat-value">{orders.length}</div>
              </div>
              <div className="stat-card">
                <h3>📊 Total Stock</h3>
                <div className="stat-value">{totalStock}</div>
              </div>
            </div>

            <div className="admin-content">
              <h2>Recent Orders</h2>
              {loading ? (
                <Loader text="Loading..." />
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🛒</div>
                  <p>No orders yet</p>
                </div>
              ) : (
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order._id}>
                        <td><strong>#{order._id.slice(-6)}</strong></td>
                        <td>{order.user?.name || 'N/A'}</td>
                        <td>{order.products?.length || 0} items</td>
                        <td>₹{Number(order.totalAmount).toLocaleString("en-IN")}</td>
                        <td>
                          <span className={`product-badge ${
                            order.status === 'delivered' ? 'badge-in-stock' : 
                            order.status === 'cancelled' ? 'badge-out-stock' : 
                            'badge-in-stock'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeTab === "products" && (
          <>
            <div className="admin-header">
              <h1>All Products</h1>
              <p>Manage your inventory</p>
            </div>

            <div className="admin-content">
              <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Products ({items.length})</h2>
                <input
                  type="text"
                  placeholder="🔍 Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: "300px", padding: "0.5rem 1rem", border: "1px solid var(--border)", borderRadius: "4px" }}
                />
              </div>

              {loading ? (
                <Loader text="Loading..." />
              ) : items.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📦</div>
                  <p>No products found</p>
                </div>
              ) : (
                <div className="products-grid">
                  {items.map((product) => {
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
                      <div key={product._id} className="product-card" style={{ cursor: 'default' }}>
                        <div className="product-image" style={{ 
                          background: product.images?.[0] 
                            ? `url(http://localhost:5000${product.images[0]})` 
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}>
                          {!product.images?.[0] && (
                            <div className="product-image-text" style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>
                              {product.category}
                            </div>
                          )}
                          <div className={`product-badge ${product.stock > 0 ? 'badge-in-stock' : 'badge-out-stock'}`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </div>
                        </div>
                        
                        <div className="product-category">{product.category}</div>
                        <h3 className="product-title">{product.name}</h3>
                        <div className="product-brand">by {product.brand}</div>
                        
                        <div className="product-rating">
                          <span className="rating-stars">⭐</span>
                          <span className="rating-value">{Number(product.rating).toFixed(1)}</span>
                        </div>
                        
                        <div className="product-price">
                          <span className="product-price-symbol">₹</span>
                          {Number(product.price).toLocaleString('en-IN')}
                        </div>
                        
                        <p className="product-description">{product.description}</p>
                        
                        <div className="product-actions" style={{ gap: '0.5rem' }}>
                          <button className="btn-edit" onClick={() => handleEdit(product)} style={{ flex: 1, padding: '0.5rem' }}>Edit</button>
                          <button className="btn-danger" onClick={() => handleDelete(product._id)} disabled={formLoading} style={{ flex: 1, padding: '0.5rem' }}>Delete</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "add" && (
          <>
            <div className="admin-header">
              <h1>{editingId ? "Edit Product" : "Add Product"}</h1>
              <p>{editingId ? "Update product" : "Add new product"}</p>
            </div>

            <div className="admin-content">
              <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input type="text" className="form-input" required placeholder="Enter product name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" required rows={4} placeholder="Enter description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input type="number" className="form-input" min="0" required placeholder="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input type="number" className="form-input" min="0" required placeholder="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Images (Max 5)</label>
                  <input
                    type="file"
                    className="form-input"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageChange}
                    style={{ padding: "0.5rem" }}
                  />
                  <small style={{ color: "var(--text-light)", fontSize: "0.75rem" }}>
                    Accepted formats: JPEG, JPG, PNG, WEBP (Max 5MB each)
                  </small>
                  {images.length > 0 && (
                    <>
                      <div style={{ marginTop: "0.5rem", color: "var(--accent)", fontWeight: "600" }}>
                        {images.length} image(s) selected
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.5rem", marginTop: "1rem" }}>
                        {imagePreviews.map((preview, index) => (
                          <div key={index} style={{ position: "relative", border: "2px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                            <img src={preview} alt={`Preview ${index + 1}`} style={{ width: "100%", height: "100px", objectFit: "cover" }} />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              style={{
                                position: "absolute",
                                top: "4px",
                                right: "4px",
                                background: "var(--danger)",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Rating (0-5) - Optional</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="0" 
                    max="5" 
                    step="0.1" 
                    placeholder="0" 
                    value={formData.rating} 
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || (Number(value) >= 0 && Number(value) <= 5)) {
                        setFormData({ ...formData, rating: value });
                      }
                    }} 
                  />
                  <small style={{ color: "var(--text-light)", fontSize: "0.75rem" }}>Leave empty or set 0 to let users rate this product</small>
                </div>

                {(error || localError) && <div className="form-error">{error || localError}</div>}
                {(successMessage || localSuccess) && <div className="form-success">{successMessage || localSuccess}</div>}

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={formLoading}>
                    {formLoading ? "Saving..." : editingId ? "Update" : "Add Product"}
                  </button>
                  {editingId && (
                    <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setFormData(initialForm); setImages([]); setImagePreviews([]); setLocalError(""); setLocalSuccess(""); }}>Cancel</button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <>
            <div className="admin-header">
              <h1>All Users</h1>
              <p>Manage user accounts</p>
            </div>

            <div className="admin-content">
              <h2>Users ({users.length})</h2>
              {loading ? (
                <Loader text="Loading..." />
              ) : (
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td><span className={`product-badge ${u.role === 'admin' ? 'badge-in-stock' : 'badge-out-stock'}`}>{u.role}</span></td>
                        <td><span className={`product-badge ${u.isBlocked ? 'badge-out-stock' : 'badge-in-stock'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="table-actions">
                          {u.role !== 'admin' && (
                            <>
                              <button className={u.isBlocked ? "btn-edit" : "btn-danger"} onClick={() => handleToggleBlock(u._id)}>
                                {u.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                              <button className="btn-danger" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <>
            <div className="admin-header">
              <h1>All Orders</h1>
              <p>Manage customer orders</p>
            </div>

            <div className="admin-content">
              <h2>Orders ({orders.length})</h2>
              {loading ? (
                <Loader text="Loading..." />
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🛒</div>
                  <p>No orders yet</p>
                </div>
              ) : (
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Products</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td><strong>#{order._id.slice(-6)}</strong></td>
                        <td>{order.user?.name || 'N/A'}</td>
                        <td>{order.products?.length || 0} items</td>
                        <td>₹{Number(order.totalAmount).toLocaleString("en-IN")}</td>
                        <td>
                          <select 
                            value={order.status} 
                            onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                            style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid var(--border)" }}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="table-actions">
                          <button className="btn-edit" onClick={() => alert(`Order details: ${JSON.stringify(order, null, 2)}`)}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeTab === "categories" && (
          <>
            <div className="admin-header">
              <h1>Categories</h1>
              <p>Manage product categories</p>
            </div>

            <div className="admin-content">
              <form onSubmit={handleCategorySubmit} style={{ marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "end" }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g., Electronics"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: "auto", padding: "0.625rem 1.5rem" }}>
                  {editingCategoryId ? "Update" : "Add Category"}
                </button>
                {editingCategoryId && (
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ width: "auto", padding: "0.625rem 1.5rem" }}
                    onClick={() => {
                      setEditingCategoryId(null);
                      setCategoryForm({ name: "", icon: "📦" });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>

              {error && <div className="form-error">{error}</div>}
              {successMessage && <div className="form-success">{successMessage}</div>}

              <h2>All Categories ({categories.length})</h2>
              {loading ? (
                <Loader text="Loading..." />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                  {categories.map((cat) => (
                    <div key={cat._id} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", textAlign: "center" }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>{cat.name}</h3>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-light)", marginBottom: "1rem" }}>{cat.slug}</div>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                        <button className="btn-edit" onClick={() => handleEditCategory(cat)} style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}>Edit</button>
                        <button className="btn-danger" onClick={() => handleDeleteCategory(cat._id)} style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminProductsPage;
