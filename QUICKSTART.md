# Quick Start Guide

Get DeepRealties up and running in minutes!

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **MongoDB** (local installation or MongoDB Atlas)

## Step 1: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as service, it should start automatically)
# Or start manually:
mongod

# On macOS/Linux:
sudo systemctl start mongod
# or
mongod
```

## Step 2: Set Up Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv

# Activate it:
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=deeprealties
JWT_SECRET_KEY=your-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. Start backend server:
```bash
uvicorn app.main:app --reload
```

Backend will run at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

## Step 3: Set Up Frontend

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:8000
```

4. Start development server:
```bash
npm run dev
```

Frontend will run at `http://localhost:5173`

## Step 4: Create Your First Admin User

1. Go to `http://localhost:8000/docs`
2. Use the `/api/auth/register` endpoint
3. Send this JSON:
```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "full_name": "Admin User",
  "role": "admin"
}
```

Or use the frontend registration page and manually update the role in MongoDB.

## You're Ready! 🎉

- Visit `http://localhost:5173` to see the frontend
- Visit `http://localhost:8000/docs` for API documentation
- Register as a buyer or seller
- Start listing properties!

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, use the connection string from your cluster

### Port Already in Use
- Backend: Change port in `uvicorn app.main:app --reload --port 8001`
- Frontend: Change port in `vite.config.js`

### Module Not Found
- Make sure you've activated the virtual environment
- Run `pip install -r requirements.txt` again
- For frontend: Run `npm install` again

## Next Steps

- Add Google Maps API key for location features
- Set up Cloudinary for image uploads
- Configure email service for notifications
- Deploy to production!

