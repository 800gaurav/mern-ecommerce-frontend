import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts, setPage } from "../features/products/productSlice";
import { Laptop, Shirt, Home, BookOpen, Trophy, Sparkles, Gamepad2, Package, Star, Check, X, ArrowRight } from "lucide-react";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import api from "../services/api";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, pagination } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
    fetchCategories();
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const getCategoryProducts = (categoryName) => {
    return items.filter(p => p.category === categoryName).slice(0, 4);
  };

  const getCategoryIcon = (cat) => {
    const icons = {
      'Electronics': Laptop,
      'Fashion': Shirt,
      'Home': Home,
      'Books': BookOpen,
      'Sports': Trophy,
      'Beauty': Sparkles,
      'Toys': Gamepad2
    };
    return icons[cat] || Package;
  };

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
    return colors[cat] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader text="Loading products..." />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className="hero-banner" style={{ background: getCategoryColor('Electronics'), padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Welcome to ShopHub</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>Discover amazing products at unbeatable prices</p>
        {!isAuthenticated && (
          <button 
            style={{ 
              background: 'white', 
              color: 'var(--primary)', 
              padding: '1rem 2rem', 
              fontSize: '1.1rem', 
              fontWeight: '700', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onClick={() => navigate("/register")}
          >
            Sign Up & Start Shopping →
          </button>
        )}
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Category Sections */}
        {categories.map((category) => {
          const categoryProducts = getCategoryProducts(category.name);
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category._id} style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {(() => {
                    const IconComponent = getCategoryIcon(category.name);
                    return <IconComponent size={28} />;
                  })()}
                  {category.name}
                </h2>
                <button 
                  onClick={() => navigate('/products')}
                  style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    padding: '0.5rem 1.5rem', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  View All <ArrowRight size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {categoryProducts.map((product) => (
                  <div 
                    key={product._id} 
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={{ 
                      background: 'white', 
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={{ 
                      height: '200px', 
                      background: product.images?.[0] 
                        ? `url(http://localhost:5000${product.images[0]})` 
                        : getCategoryColor(product.category),
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {!product.images?.[0] && (() => {
                        const IconComponent = getCategoryIcon(product.category);
                        return <IconComponent size={64} color="white" />;
                      })()}
                      {product.stock > 0 ? (
                        <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Check size={14} /> In Stock
                        </span>
                      ) : (
                        <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <X size={14} /> Out of Stock
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>{product.category}</div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{Number(product.rating).toFixed(1)}</span>
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* All Products Section */}
        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>All Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {items.map((product) => (
              <div 
                key={product._id} 
                onClick={() => navigate(`/product/${product._id}`)}
                style={{ 
                  background: 'white', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ 
                  height: '200px', 
                  background: product.images?.[0] 
                    ? `url(http://localhost:5000${product.images[0]})` 
                    : getCategoryColor(product.category),
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {!product.images?.[0] && (
                    <span style={{ fontSize: '4rem' }}>{getCategoryIcon(product.category)}</span>
                  )}
                  {product.stock > 0 ? (
                    <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                      In Stock
                    </span>
                  ) : (
                    <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                      Out of Stock
                    </span>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>{product.category}</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#fbbf24' }}>⭐</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{Number(product.rating).toFixed(1)}</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(value) => dispatch(setPage(value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
