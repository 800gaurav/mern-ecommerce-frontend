# FrontEnd - MERN E-Commerce UI

React + Redux Toolkit frontend with a modern responsive storefront and admin product management panel.

## Features

- JWT auth flow (register/login/logout, profile restore)
- Protected routes and admin-only route
- Product listing grid with:
  - search
  - multi-select category and brand filters
  - price range filter
  - rating filter
  - in-stock filter
  - sorting and pagination
- Admin dashboard:
  - create/update/delete product
  - admin search + product table
  - quick inventory stats cards

## Folder Structure

```text
FrontEnd/
  src/
    app/store.js
    components/
    features/
      auth/
      products/
      admin/
    pages/
    services/api.js
    App.jsx
    main.jsx
    index.css
  .env.example
```

## Setup

```bash
cd FrontEnd
npm install
cp .env.example .env
```

Set API URL in `.env`:

- `VITE_API_URL=http://localhost:5000/api`

## Run

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

## Auth Notes

- User token and profile are stored in `localStorage`.
- `ProtectedRoute` blocks unauthenticated access.
- Admin panel route requires `user.role === "admin"`.
