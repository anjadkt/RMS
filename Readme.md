# 🍽️ WebResto – Restaurant POS System

> A full-stack restaurant POS system designed to streamline order management, improve kitchen workflow, and provide role-based dashboards for efficient restaurant operations.

---

## 🚀 Overview

WebResto is a scalable POS system built for restaurants to manage orders, staff, and kitchen operations in real time.  
It features multiple user roles with dedicated interfaces, ensuring smooth coordination between customers, workers, kitchen staff, and administrators.

---

## ✨ Features

- 🔐 Role-based authentication (Customer, Worker, Kitchen, Admin)
- ⚡ Real-time order updates
- 🧾 Order management system
- 📊 Admin dashboard for control & insights
- 💳 Secure payment integration (Razorpay)
- 📱 Responsive UI for all devices

---

## 🧩 Modules

### 👤 Customer
- Browse menu
- Place orders
- Track order status

### 🧑‍🍳 Kitchen
- View incoming orders
- Update preparation status
- Manage order flow

### 🧑‍💼 Worker
- Assist customers
- Manage table orders
- Coordinate with kitchen

### 🛠 Admin
- Manage users & roles
- Control menu items
- Monitor orders & analytics

---

## 🏗 System Architecture

- 2 Frontend Applications:
  - Customer / Worker interface
  - Admin / Kitchen dashboard
- 1 Backend Server:
  - REST API + authentication
- Communication:
  - API-based interaction
  - Real-time updates (Socket.io)

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Redux Toolkit

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Other Tools
- JWT Authentication
- Socket.io
- Razorpay
- Git & GitHub

---

## 📁 Folder Structure

```bash
.
├── frontend/         # Customer frontend
├── staff-frontend /  # Admin, Worker & Kitchen frontend
├── backend/          # Backend API

```

## ⚙️ Installation & Setup

### Clone the repository & install dependencies
```bash
  git clone <your-repo-link>
  cd webresto
  npm install
```

### Setup environment variables
- Create a .env file inside backend
```bash
  
PORT
NODE_ENV
MONGO_DB_URL
USERFRONT_END_URL  #customer frontend url
STAFFFRONT_END_URL #staff frontend url
SECRET_KEY         #jwt secret key
SECRET_REFRESH_KEY #jwt refresh secret key
STAFF_PASS_KEY     #staff creation key
EMAIL_USER         #admin email
BREVO_API_KEY      # Brevo (email service) API key
KEY_ID             #razorpay key id
KEY_SECRET         #razorpay key secret 
RAZORPAY_WEBHOOK_SECRET #razorpay webhook secret
TEXTBEE_DEVICE_ID  #text bee device id for otp
TEXTBEE_API_KEY    # text bee api key
```

- Create a .env staff-frontend
```bash
VITE_API_BASE_URL 
```

- Create a .env frontend
```bash
VITE_API_BASE_URL
VITE_RAZORPAY_KEY_ID
```

### Run the project
```bash
# Start backend
cd backend && npm run start

# Start frontend apps
cd frontend && npm run dev
cd staff-frontend && npm run dev
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|

| GET | / | Check server status |

| GET | /auth/refresh | Refresh access token |
| GET | /auth/user | Get logged-in user data |
| GET | /user/logout | Logout user |

| GET | /items/category | Get item categories |
| GET | /items | Get all items |

| POST | /auth/customer/otp | Send OTP to customer |
| POST | /auth/customer/login | Customer login |

| GET | /resto | Get restaurant website data |

| GET | /user/cart | Get cart items |
| GET | /user/cart/add/:id | Add item to cart |
| GET | /user/cart/remove/:id | Remove item from cart |

| POST | /user/order | Create order |
| GET | /user/order | View user orders |
| POST | /user/order/cancel | Cancel order |
| GET | /user/order/notification/:id | Remove notification |

| POST | /auth/admin/login | Admin login |

| GET | /admin/orders | Get all orders (admin) |
| GET | /items/admin | Manage items (admin) |
| GET | /table/admin | Manage tables (admin) |
| GET | /staff/admin | Manage staff (admin) |
| GET | /resto/admin | Manage restaurant data |
| GET | /admin/bills | Manage bills |

| POST | /auth/staff/login | Staff login |

| GET | /waiter/table | Manage tables (waiter/admin) |
| GET | /waiter/orders | Manage orders (waiter/admin) |
| GET | /waiter/bills | Manage bills (waiter/admin) |

| GET | /items/cook | Get items for kitchen |
| GET | /orders/cook | Manage orders (cook/admin) |

## 🖥 Screenshots
![customer ui](/screenshots/image-1.png)
![customer ui](/screenshots/image-2.png)
![customer order](/screenshots/image-3.png)
![waiter billing](/screenshots/image.png)
![waiter orders](/screenshots/image-4.png)
![waiter order creation](/screenshots/image-5.png)
![waiter bills](/screenshots/image.png)
![admin products](/screenshots/image-6.png)

## 🌍 Deployment

- **Customer Frontend**: https://webresto-one.vercel.app (Vercel)
- **Staff Dashboard**: https://staffswebresto.vercel.app (Vercel)
- **Backend API**: Hosted on Render

## 🧠 Key Learnings
- Architected a multi-role POS system supporting customers, waiters, kitchen staff, and admins with role-based access control.
- Implemented modular frontend architecture using React and Redux Toolkit, improving scalability and maintainability.
- Developed secure RESTful APIs with Express.js, ensuring efficient communication between multiple frontend applications.
- Designed a centralized backend system to handle concurrent operations across multiple modules seamlessly.
- Optimized state management and API handling, reducing unnecessary re-renders and improving application performance.
- Built a real-time order lifecycle system, enabling instant updates between kitchen, staff, and customers.
- Integrated protected routes and middleware-based authorization, ensuring secure access across all user roles.
- Structured the backend using MVC architecture, improving code organization and maintainability.
Designed a scalable database schema in MongoDB to efficiently manage users, orders, items, and transactions.
- Implemented rate limiting and security best practices, protecting APIs from abuse and ensuring stability.
- Developed responsive UI components using Tailwind CSS, ensuring smooth experience across devices.
Enabled session persistence using HTTP-only cookies, improving security against XSS attacks.
- Built a multi-frontend system architecture, separating admin and user interfaces for better performance and clarity.
- Improved developer workflow and version control practices using Git and structured project organization.

## 👨‍💻 Author

**ANJAD KT**

- Portfolio: https://anjad.netlify.app  
- LinkedIn: https://www.linkedin.com/in/anjadkt 