import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, registerUser } from "../features/auth/authSlice";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthError());

    try {
      await dispatch(registerUser(formData)).unwrap();
      navigate("/");
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

        <h1 className="auth-title">Create Account</h1>

        <div className="form-group">
          <label className="form-label">Your name</label>
          <input
            type="text"
            className="form-input"
            required
            placeholder="First and last name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

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
            minLength={6}
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating account..." : "Create your ShopHub account"}
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
