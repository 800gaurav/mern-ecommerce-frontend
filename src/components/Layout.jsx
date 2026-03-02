import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { setSearch } from "../features/products/productSlice";
import { useState } from "react";
import { Search, ShoppingCart, User, LogOut } from "lucide-react";

function Layout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const [searchInput, setSearchInput] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setProfileDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(searchInput));
    navigate("/");
  };

  // Don't show navbar for admin pages
  if (user?.role === "admin" && window.location.pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-top">
          <NavLink to="/" className="navbar-logo">
            Shop<span>Hub</span>
          </NavLink>

          <form className="navbar-search" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit"><Search size={18} /></button>
          </form>

          <div className="navbar-actions">
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className="navbar-link">
                  Sign In
                </NavLink>
                <NavLink to="/register" className="navbar-link" style={{ background: "var(--primary)", color: "var(--text-dark)" }}>
                  Sign Up
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/cart" className="navbar-link" style={{ position: "relative" }}>
                  <ShoppingCart size={18} />
                  <span style={{ marginLeft: "0.5rem" }}>Cart</span>
                  {totalItems > 0 && (
                    <span style={{ 
                      position: "absolute", 
                      top: "-5px", 
                      right: "-5px", 
                      background: "var(--primary)", 
                      color: "var(--text-dark)", 
                      borderRadius: "50%", 
                      width: "20px", 
                      height: "20px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: "0.7rem",
                      fontWeight: "700"
                    }}>
                      {totalItems}
                    </span>
                  )}
                </NavLink>
                
                {/* Profile Dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="navbar-link"
                    style={{ 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px"
                    }}
                  >
                    <User size={18} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 0.5rem)",
                      right: 0,
                      background: "white",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      minWidth: "200px",
                      overflow: "hidden",
                      zIndex: 1000
                    }}>
                      <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)" }}>
                        <div style={{ fontWeight: "700", fontSize: "0.95rem", marginBottom: "0.25rem" }}>{user?.name}</div>
                        <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>{user?.email}</div>
                      </div>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "#ef4444",
                          fontWeight: "600",
                          fontSize: "0.95rem",
                          transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#fee2e2"}
                        onMouseLeave={(e) => e.target.style.background = "transparent"}
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </>
  );
}

export default Layout;
