import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { ArrowLeft, Star, ShoppingCart, Check, X } from "lucide-react";
import Loader from "../components/Loader";
import api from "../services/api";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (err) {
      console.error("Failed to fetch product");
    } finally {
      setLoading(false);
    }
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
        <Loader text="Loading product..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Go to Home
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [null];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            background: 'white', 
            border: '1px solid var(--border)', 
            padding: '0.5rem 1rem', 
            borderRadius: '6px', 
            cursor: 'pointer',
            marginBottom: '1rem',
            fontWeight: '600',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '1.5rem' }}>
            {/* Image Section */}
            <div>
              <div style={{ 
                height: '300px', 
                background: images[selectedImage] 
                  ? `url(http://localhost:5000${images[selectedImage]})` 
                  : getCategoryColor(product.category),
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '12px',
                marginBottom: '1rem',
                position: 'relative'
              }}>
                {product.stock > 0 ? (
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#10b981', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Check size={14} /> In Stock
                  </span>
                ) : (
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <X size={14} /> Out of Stock
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                  {images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      style={{
                        width: '70px',
                        height: '70px',
                        background: img ? `url(http://localhost:5000${img})` : getCategoryColor(product.category),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: selectedImage === index ? '3px solid var(--primary)' : '2px solid var(--border)',
                        flexShrink: 0
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>{product.category}</div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>{product.name}</h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={18} fill="#fbbf24" color="#fbbf24" />
                  <span style={{ fontSize: '1rem', fontWeight: '700' }}>{Number(product.rating).toFixed(1)}</span>
                </div>
                <span style={{ color: 'var(--text-light)' }}>|</span>
                <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>{product.numReviews || 0} reviews</span>
              </div>

              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem' }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </div>

              <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Product Details</h3>
                <p style={{ color: 'var(--text-light)', lineHeight: '1.6', fontSize: '0.875rem' }}>{product.description}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Stock</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700' }}>{product.stock} units</div>
                </div>
                <div style={{ background: 'var(--bg)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Category</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700' }}>{product.category}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        dispatch(addToCart(product));
                        alert('Added to cart!');
                      }}
                      disabled={product.stock === 0}
                      style={{
                        background: product.stock > 0 ? 'var(--primary)' : '#ccc',
                        color: 'white',
                        padding: '0.875rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <ShoppingCart size={20} /> Add to Cart
                    </button>
                    <button
                      onClick={() => navigate('/cart')}
                      style={{
                        background: 'white',
                        color: 'var(--primary)',
                        padding: '0.875rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        border: '2px solid var(--primary)',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      View Cart
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      padding: '0.875rem',
                      fontSize: '1rem',
                      fontWeight: '700',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Login to Buy
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
