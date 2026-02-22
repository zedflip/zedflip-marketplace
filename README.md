# ZedFlip - Zambia's Second-Hand Marketplace

![ZedFlip Logo](https://via.placeholder.com/200x60/E85D04/FFFFFF?text=ZedFlip)

A modern, full-stack marketplace application for buying and selling second-hand items in Zambia.

## 🚀 Features

- **User Authentication** - Register/Login with email and Zambian phone number (+260)
- **Listings Management** - Create, edit, and manage product listings
- **Real-time Chat** - Socket.io powered messaging between buyers and sellers
- **Image Upload** - Cloudinary integration for image storage
- **Search & Filters** - Filter by category, city, price, condition
- **Admin Panel** - Manage users, listings, categories, and reports
- **PWA Support** - Installable progressive web app
- **Zambia-Specific** - ZMW currency, Zambian cities, +260 phone format

## 🎨 Design System

| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Orange) | `#E85D04` | CTAs, highlights |
| Secondary (Green) | `#2D6A4F` | Success, secondary actions |
| Accent (Red) | `#D00000` | Alerts, errors |
| Background | `#F8F9FA` | Page background |
| Surface | `#FFFFFF` | Cards, modals |

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Socket.io
- JWT Authentication
- Cloudinary

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Zustand (State Management)
- React Query
- Socket.io Client

## 📁 Project Structure

```
zedflip/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, Cloudinary, Socket config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, admin, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── utils/          # JWT, SMS, Logger
│   │   └── server.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Zustand stores
│   │   ├── lib/            # API client, utilities
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary account

### Backend Setup

```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your credentials
# MONGODB_URI, JWT_SECRET, CLOUDINARY_*, etc.

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/zedflip
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

## 📱 Zambia-Specific Features

### Cities
- Lusaka, Kitwe, Ndola, Kabwe, Livingstone
- Chipata, Mansa, Mongu, Solwezi, Kasama
- Mufulira, Luanshya

### Currency
- ZMW (Zambian Kwacha)
- Display format: `K 2,500`

### Phone Format
- Prefix: +260
- Format: +260XXXXXXXXX

### Payment Methods
- Cash on Delivery
- Mobile Money (MTN/Airtel)
- Bank Transfer

## 🔒 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (auth required)
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Chat
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Start new chat
- `POST /api/chats/:id/messages` - Send message

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/ban` - Ban/unban user
- `GET /api/admin/categories` - Manage categories

## 🏗️ Build & Deploy

### Build for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Deployment Options
- **Backend**: Railway, Render, DigitalOcean
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: MongoDB Atlas

## 📄 License

MIT License - feel free to use this project for your own marketplace!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for Zambia 🇿🇲
