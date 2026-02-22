# ZedFlip Deployment Guide

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://admin_db_user:5UV8jFFVlObkl2KJ@ac-8k5t1k-shard-00-00.08k5t1k.mongodb.net:27017,ac-8k5t1k-shard-00-01.08k5t1k.mongodb.net:27017,ac-8k5t1k-shard-00-02.08k5t1k.mongodb.net:27017/zedflip?ssl=true&replicaSet=atlas-8k5t1k-shard-0&authSource=admin&retryWrites=true&w=majority
JWT_SECRET=zedflip_super_secret_key_2025_production_min_32_chars
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=dei9fugyy
CLOUDINARY_API_KEY=355463518257273
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
FRONTEND_URL=https://zedflip.com
```

### Frontend (.env.production)

```env
VITE_API_URL=https://zedflip-api.up.railway.app/api
VITE_SOCKET_URL=https://zedflip-api.up.railway.app
```

## Deployment Steps

### 1. Backend (Railway)

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repo or deploy from CLI
4. Add environment variables from above
5. Deploy

### 2. Frontend (Netlify/Vercel)

1. Build: `npm run build`
2. Deploy `dist` folder
3. Set environment variables
4. Configure custom domain: zedflip.com

### 3. MongoDB Atlas

- Cluster: zedflip-cluster
- User: admin_db_user
- Network Access: 0.0.0.0/0

### 4. Cloudinary

- Cloud Name: dei9fugyy
- Configure upload presets

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Test user registration/login
- [ ] Test listing creation with images
- [ ] Test real-time chat
- [ ] Submit sitemap to Google Search Console
- [ ] Set up SSL certificate
- [ ] Configure DNS for zedflip.com
