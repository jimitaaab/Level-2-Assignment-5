# GearUp Client

Frontend for **GearUp**, a gear rental marketplace. Built with Next.js 16, React 19, and Tailwind CSS 4.

## Tech Stack

* **Framework:** Next.js 16 (App Router)
* **UI:** React 19, shadcn/ui, Tailwind CSS 4, Lucide icons
* **State:** Zustand
* **Forms:** Native `<form>` + `useActionState`, Zod validation
* **Auth:** Cookie-based JWT with automatic token refresh
* **Payments:** Stripe Checkout via GearUp backend
* **Images:** Cloudinary
* **HTTP:** Native `fetch()`
* **Package manager:** pnpm

## Backend API

GearUp Client communicates with the **GearUp Backend API**.

### Local Development

```env
BACKEND_API_URL=http://localhost:5000
```

The backend API is available at:

```text
http://localhost:5000
```

### Production

The deployed backend is:

```text
https://gear-up-rust.vercel.app
```

API endpoints use the following base path:

```text
/api
```

For example:

```text
GET http://localhost:5000/api/gear
```

## Prerequisites

* Node.js 18+
* pnpm
* GearUp Backend API running locally or a deployed backend
* PostgreSQL database configured in the backend
* Stripe account for payment functionality
* Cloudinary account for image uploads

## Getting Started

Clone the repository:

```bash
git clone <repo-url>

cd gear-up-client

pnpm install
```

Create a `.env` file in the project root:

```env
# Local GearUp Backend
BACKEND_API_URL=http://localhost:5000

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=gearupUsers
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_GEARS=gearupItems
```

For production, change the backend URL to:

```env
BACKEND_API_URL=https://gear-up-rust.vercel.app
```

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Project Structure

```text
app/

  (publicGroup)/
    # Public routes
    # Home, gear browsing, gear details

  (dashboardGroup)/
    # Protected dashboard routes

    dashboard/
      customer/
        # Customer orders and payments

      provider/
        # Provider gear management and orders

      profile/
        # Profile management

    admin-dashboard/
      # Admin users, gear, rentals and profile

  auth/
    # Login and registration

  payment/
    # Stripe success and cancel pages

components/

  ui/
    # shadcn/ui primitives

  shared/
    # Navbar, Footer, StatusBadge, GearThumb, LogoutDialog

  providers/
    # ThemeProvider, UserProvider

lib/

  types.ts
    # Shared TypeScript types

  schemas.ts
    # Zod validation schemas

  utils.ts
    # Utility functions

  cloudinary.ts
    # Cloudinary upload helpers

  format.ts
    # Date and number formatting

service/
  # Server-side API service layer
  # Auth, gear, rentals, payments, users,
  # admin and provider API requests

stores/
  # Zustand stores
  # User, UI and form state

proxy.ts
  # Authentication, token refresh and
  # role-based route protection
```

# Features

## Roles

| Role         | Dashboard          | Capabilities                                                                       |
| ------------ | ------------------ | ---------------------------------------------------------------------------------- |
| **Customer** | `/dashboard`       | Browse gear, create rentals, view rentals/payments, cancel rentals, submit reviews |
| **Provider** | `/dashboard`       | Create, update and delete gear, manage inventory, view and update incoming orders  |
| **Admin**    | `/admin-dashboard` | Manage users, categories, gear listings and rental orders                          |

# Backend API Endpoints

The frontend uses the following APIs from the GearUp Backend.

## Authentication

| Method | Endpoint                  | Access        | Description                             |
| ------ | ------------------------- | ------------- | --------------------------------------- |
| `POST` | `/api/auth/register`      | Public        | Register a new customer or provider     |
| `POST` | `/api/auth/login`         | Public        | Login and receive access/refresh tokens |
| `POST` | `/api/auth/refresh-token` | Authenticated | Refresh the access token                |
| `GET`  | `/api/auth/me`            | Authenticated | Get the current logged-in user          |

Example:

```text
POST http://localhost:5000/api/auth/login
```

## Users

| Method | Endpoint                    | Access        | Description                       |
| ------ | --------------------------- | ------------- | --------------------------------- |
| `PUT`  | `/api/users/update-profile` | Authenticated | Update the current user's profile |

## Categories

| Method   | Endpoint                      | Access | Description             |
| -------- | ----------------------------- | ------ | ----------------------- |
| `GET`    | `/api/categories`             | Public | Get all gear categories |
| `POST`   | `/api/categories`             | ADMIN  | Create a category       |
| `PUT`    | `/api/categories/:categoryId` | ADMIN  | Update a category       |
| `DELETE` | `/api/categories/:categoryId` | ADMIN  | Delete a category       |

## Public Gear

| Method | Endpoint        | Access | Description                         |
| ------ | --------------- | ------ | ----------------------------------- |
| `GET`  | `/api/gear`     | Public | Browse all gear                     |
| `GET`  | `/api/gear/:id` | Public | Get details of a specific gear item |

Example:

```text
GET http://localhost:5000/api/gear
```

## Provider Gear Management

These APIs are available to users with the `PROVIDER` role.

| Method   | Endpoint                 | Access   | Description           |
| -------- | ------------------------ | -------- | --------------------- |
| `POST`   | `/api/provider/gear`     | PROVIDER | Create a gear listing |
| `GET`    | `/api/provider/gear`     | PROVIDER | Get provider's gear   |
| `PUT`    | `/api/provider/gear/:id` | PROVIDER | Update a gear listing |
| `DELETE` | `/api/provider/gear/:id` | PROVIDER | Delete a gear listing |

## Provider Orders

| Method  | Endpoint                   | Access   | Description                |
| ------- | -------------------------- | -------- | -------------------------- |
| `GET`   | `/api/provider/orders`     | PROVIDER | Get incoming rental orders |
| `PATCH` | `/api/provider/orders/:id` | PROVIDER | Update rental order status |

## Customer Rentals

These APIs are available to users with the `CUSTOMER` role.

| Method  | Endpoint                  | Access   | Description                  |
| ------- | ------------------------- | -------- | ---------------------------- |
| `POST`  | `/api/rentals`            | CUSTOMER | Create a rental order        |
| `GET`   | `/api/rentals`            | CUSTOMER | Get customer's rental orders |
| `GET`   | `/api/rentals/:id`        | CUSTOMER | Get rental details           |
| `PATCH` | `/api/rentals/:id/cancel` | CUSTOMER | Cancel a rental              |

## Payments

The GearUp backend uses Stripe for payments.

| Method | Endpoint                | Access           | Description                        |
| ------ | ----------------------- | ---------------- | ---------------------------------- |
| `POST` | `/api/payments/create`  | CUSTOMER         | Create Stripe payment session      |
| `POST` | `/api/payments/confirm` | Stripe Webhook   | Handle Stripe payment confirmation |
| `GET`  | `/api/payments`         | CUSTOMER         | Get customer's payment history     |
| `GET`  | `/api/payments/:id`     | CUSTOMER / ADMIN | Get payment details                |

The frontend should use the backend to create the Stripe Checkout session rather than communicating directly with Stripe's secret API.

## Reviews

| Method | Endpoint       | Access   | Description                     |
| ------ | -------------- | -------- | ------------------------------- |
| `POST` | `/api/reviews` | CUSTOMER | Submit a review for rented gear |

## Admin

These APIs require the `ADMIN` role.

| Method  | Endpoint               | Access | Description               |
| ------- | ---------------------- | ------ | ------------------------- |
| `GET`   | `/api/admin/users`     | ADMIN  | Get all users             |
| `PATCH` | `/api/admin/users/:id` | ADMIN  | Update user active status |
| `GET`   | `/api/admin/gear`      | ADMIN  | Get all gear listings     |
| `GET`   | `/api/admin/rentals`   | ADMIN  | Get all rental orders     |

# API Base URL

For local development:

```env
BACKEND_API_URL=http://localhost:5000
```

Therefore:

```text
http://localhost:5000/api/auth/login
http://localhost:5000/api/auth/register
http://localhost:5000/api/auth/me
http://localhost:5000/api/categories
http://localhost:5000/api/gear
http://localhost:5000/api/provider/gear
http://localhost:5000/api/provider/orders
http://localhost:5000/api/rentals
http://localhost:5000/api/payments
http://localhost:5000/api/reviews
http://localhost:5000/api/admin/users
http://localhost:5000/api/admin/gear
http://localhost:5000/api/admin/rentals
```

For production:

```env
BACKEND_API_URL=https://gear-up-rust.vercel.app
```

Example:

```text
https://gear-up-rust.vercel.app/api/gear
```

# Authentication

GearUp uses JWT authentication.

The backend provides:

* Access token
* Refresh token
* Cookie-based refresh token management
* Role-based authorization

The frontend handles authentication through the service layer and proxy middleware.

Protected operations send the appropriate authentication credentials to the backend.

Roles:

```text
CUSTOMER
PROVIDER
ADMIN
```

## Authentication Flow

```text
User
  ↓
Login/Register
  ↓
Frontend
  ↓
GearUp Backend
  ↓
JWT Authentication
  ↓
Authenticated User
  ↓
Role-based Dashboard
```

The frontend proxy handles:

* Authentication checks
* Access token validation
* Token refresh
* Protected route access
* Role-based redirects

# Rental Flow

The typical rental flow is:

```text
Browse Gear
    ↓
Select Gear
    ↓
Choose Rental Dates
    ↓
Choose Quantity
    ↓
Create Rental Order
    ↓
Create Stripe Checkout Session
    ↓
Stripe Checkout
    ↓
Payment Confirmation
    ↓
Order Status Update
```

## Rental Order Status

The backend rental status flow is:

```text
PLACED
   ↓
CONFIRMED
   ↓
PAID
   ↓
PICKED_UP
   ↓
RETURNED
```

A rental can also be:

```text
CANCELLED
```

# Provider Flow

Providers can:

1. Add gear
2. Upload gear images
3. Set gear information and stock
4. View their gear
5. Edit gear
6. Delete gear
7. View incoming rental orders
8. Update rental order status

Provider APIs:

```text
POST   /api/provider/gear
GET    /api/provider/gear
PUT    /api/provider/gear/:id
DELETE /api/provider/gear/:id
GET    /api/provider/orders
PATCH  /api/provider/orders/:id
```

# Customer Flow

Customers can:

1. Register
2. Login
3. Browse gear
4. Search and filter gear
5. View gear details
6. Select rental dates
7. Select quantity
8. Create rental orders
9. Pay through Stripe
10. View rental history
11. View payment history
12. View rental details
13. Cancel rentals
14. Submit reviews
15. Update their profile

# Admin Flow

Admins can:

* View all users
* Update user active status
* View all gear listings
* View all rental orders
* Manage categories

Admin APIs:

```text
GET    /api/admin/users
PATCH  /api/admin/users/:id

GET    /api/admin/gear

GET    /api/admin/rentals

GET    /api/categories
POST   /api/categories
PUT    /api/categories/:categoryId
DELETE /api/categories/:categoryId
```

# Cloudinary

Cloudinary is used for image uploads.

The frontend uses:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=gearupUsers
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_GEARS=gearupItems
```

Two upload presets are used:

* `gearupUsers` — user/profile images
* `gearupItems` — gear images

# Architecture

The frontend follows a service-layer architecture.

```text
Next.js App
     ↓
Server Actions
     ↓
Service Layer
     ↓
GearUp Backend API
     ↓
Prisma ORM
     ↓
PostgreSQL
```

## Proxy Middleware

`proxy.ts` is responsible for:

* Checking authentication
* Reading JWT information
* Refreshing expired access tokens
* Protecting dashboard routes
* Handling role-based routing
* Redirecting unauthorized users

## Server Actions

Server actions handle frontend mutations such as:

* Login
* Registration
* Profile updates
* Gear creation
* Gear updates
* Gear deletion
* Rental creation
* Rental cancellation
* Payment session creation
* Reviews

## Service Layer

The `service/` directory contains the backend API communication layer.

Typical services include:

```text
auth
gear
rentals
payments
users
provider
admin
reviews
categories
```

The service layer uses native:

```javascript
fetch()
```

No Axios is required.

# State Management

Zustand is used for client-side state management.

Stores include:

```text
stores/
  user
  UI
  forms
```

The application avoids unnecessary component-level state where possible.

# Available Scripts

Start development server:

```bash
pnpm dev
```

Create production build:

```bash
pnpm build
```

Start production server:

```bash
pnpm start
```

Run ESLint:

```bash
pnpm lint
```

# Backend Repository

The GearUp backend repository is:

```text
https://github.com/jimitaaab/Level-2-Assignment-4
```

# Backend Deployment

Production backend:

```text
https://gear-up-rust.vercel.app
```

Local backend:

```text
http://localhost:5000
```

# Important Notes

* The frontend backend URL is configured using `BACKEND_API_URL`.
* The local backend runs on port `5000`.
* The frontend development server runs on port `3000`.
* Refresh-token management uses cookies.
* Protected endpoints require authentication.
* Provider endpoints require the `PROVIDER` role.
* Customer rental/payment/review endpoints require the `CUSTOMER` role.
* Admin endpoints require the `ADMIN` role.
* Stripe secret operations are handled by the backend.
* Stripe webhook requests require raw-body handling on the backend.
* Cloudinary is used for image uploads.
* The frontend uses native `fetch()` instead of Axios.

## License

This project is licensed under ISC.
