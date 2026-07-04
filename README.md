# Sachcu Website

A modern e-commerce storefront and admin dashboard built with Next.js 15, Tailwind CSS, MongoDB, and NextAuth. The app includes customer-facing pages, seller/admin sections, product management, authentication, email notifications, Cloudinary uploads, and SEO support.

## Key Features

- Customer-facing storefront with product browsing, categories, cart, checkout, and contact forms
- Authentication via email/password and Google sign-in using NextAuth
- Admin and seller panels for orders, users, products, and SEO management
- MongoDB database with Mongoose models for users, products, orders, categories, and SEO content
- Cloudinary integration for product image uploads
- Email handling with Nodemailer for contact messages, order notifications, and password resets
- SEO-friendly product pages with dynamic schema and metadata support
- Tailwind CSS for responsive styling and Framer Motion for UI animation

## Tech Stack

- Next.js 15
- React 19
- Tailwind CSS
- MongoDB / Mongoose
- NextAuth
- Cloudinary
- Nodemailer
- Axios
- Lucide React / react-icons
- Framer Motion

## Getting Started

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file at the project root and configure the following variables:

```env
MONGODB_URI=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_USER=
EMAIL_PASSWORD=
ADMIN_EMAIL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_CURRENCY=
```

> Notes:
> - `MONGODB_URI` connects the application to your MongoDB database.
> - `NEXTAUTH_URL` should match the app base URL.
> - `NEXTAUTH_SECRET` is required for JWT session handling.
> - Cloudinary variables are used for product image uploads.
> - SMTP credentials are required for contact, password reset, and order notification emails.

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Linting

```bash
npm run lint
```

## Project Structure

- `app/` - Next.js app routes, pages, API route handlers, and layouts
- `components/` - Reusable UI components for storefront and admin
- `context/` - Global context provider for app state
- `lib/` - Database connection and auth utilities
- `models/` - Mongoose models for database schemas
- `public/` - Static assets
- `assets/` - application asset data and image references

## Deployment

This project is designed to deploy on any platform that supports Next.js and environment variables, such as Vercel, Netlify, or a custom Node.js host. Ensure the required environment variables are set in your deployment environment.

## License

This repository includes a `LICENSE.md` file. Review that file for license terms.
