import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, loginUser } from "../features/auth/authSlice";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthError());
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      // Check if user is admin and redirect accordingly
      if (result.user?.role === "admin") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch (_error) {
      // handled by Redux state
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <h2>Shop<span>Hub</span></h2>
        </div>

        <h1 className="auth-title">Sign In</h1>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            required
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div style={{ background: "var(--primary-light)", padding: "1rem", borderRadius: "8px", marginTop: "1rem", fontSize: "0.875rem" }}>
          <strong>Admin Credentials:</strong><br/>
          <strong>Admin:</strong> admin@gamil.com / admin@123<br/>
          <strong>User:</strong> Register a new account
        </div>

        <div className="auth-footer">
          New to ShopHub? <Link to="/register">Create your account</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
