# 🔐 Admin Login Guide

## How to Access Admin Dashboard

### Step 1: Go to Login Page
Navigate to: `http://localhost:5173/login`

### Step 2: Use Admin Credentials

**Default Admin Account (from backend seed):**
```
Email: admin@example.com
Password: Admin@123
```

### Step 3: Automatic Redirect
- After successful login with admin credentials
- You will be **automatically redirected** to `/admin/products`
- Admin dashboard will open with sidebar navigation

## 🎯 Admin Features

Once logged in as admin, you can:

1. **📊 Dashboard Tab**
   - View total products
   - See in-stock/out-of-stock counts
   - Check average rating
   - View recent products

2. **📦 All Products Tab**
   - See complete product list
   - Search products
   - Edit any product
   - Delete products
   - Quick stock toggle (In/Out)

3. **➕ Add Product Tab**
   - Add new products
   - Fill product details
   - Set price, stock, rating

4. **🏠 View Store**
   - See customer view
   - Check how products look to users

5. **🚪 Logout**
   - Logout and return to homepage

## 🔄 Login Flow

### For Admin:
```
Login Page → Enter admin@example.com → Auto redirect to /admin/products
```

### For Regular User:
```
Login Page → Enter user credentials → Redirect to homepage (/)
```

## 📝 Notes

- Admin credentials are set in backend `.env` file
- Default admin is created when you run `npm run seed` in backend
- Admin can access both admin dashboard and customer view
- Regular users cannot access `/admin/*` routes (protected)

## 🚀 Quick Start

1. **Start Backend:**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd FrontEnd
   npm run dev
   ```

3. **Login as Admin:**
   - Go to `http://localhost:5173/login`
   - Email: `admin@example.com`
   - Password: `Admin@123`
   - Click "Sign In"
   - You'll be on admin dashboard! 🎉

## 💡 Tips

- Login page shows demo credentials hint
- Admin role is checked automatically
- No separate admin login page needed
- Same login form for both admin and users
- Role-based redirect after login

**Happy Managing! 🛒**
