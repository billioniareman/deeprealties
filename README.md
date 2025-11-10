# DeepRealties - Modern Real Estate Platform

A full-stack real estate platform built with React, FastAPI, and MongoDB. Find your dream home or list your property with ease.

## 🚀 Features

### For Buyers
- Browse and search properties with advanced filters
- View detailed property information with image carousels
- Send enquiries to sellers
- Responsive design for all devices

### For Sellers
- Register and manage your properties
- Add, edit, and delete property listings
- View and manage buyer enquiries
- Dashboard with statistics

### For Admins
- Comprehensive admin dashboard
- Manage users, properties, and enquiries
- View analytics and statistics
- Top cities and activity tracking

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - API calls

### Backend
- **FastAPI** - Python web framework
- **MongoDB** - Database (via Motor)
- **JWT** - Authentication
- **Pydantic** - Data validation

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or cloud)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=deeprealties
JWT_SECRET_KEY=your-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. Start the backend server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎨 Design

- **Color Palette**: Navy blue (#1E3A8A), Light blue (#3B82F6), Emerald green (#10B981), Off-white (#F9FAFB)
- **Typography**: Inter, Poppins, Lato
- **Theme**: Modern, minimalist real estate aesthetic
- **Features**: Dark mode, smooth animations, responsive design

## 📁 Project Structure

```
DeepRealties/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── properties.py
│   │   │   ├── enquiries.py
│   │   │   ├── admin.py
│   │   │   └── users.py
│   │   ├── models.py
│   │   ├── auth.py
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── package.json
│   └── README.md
└── README.md
```

## 🔐 Authentication

The platform uses JWT-based authentication:
- Register as a buyer or seller
- Login to access your dashboard
- Protected routes for sellers and admins

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - List all properties (with filters)
- `GET /api/properties/{id}` - Get property details
- `POST /api/properties` - Create property (seller/admin)
- `PUT /api/properties/{id}` - Update property (seller/admin)
- `DELETE /api/properties/{id}` - Delete property (seller/admin)
- `GET /api/properties/seller/my-properties` - Get seller's properties

### Enquiries
- `POST /api/enquiries` - Create enquiry
- `GET /api/enquiries/my-enquiries` - Get buyer's enquiries
- `GET /api/enquiries/seller/enquiries` - Get seller's enquiries
- `PUT /api/enquiries/{id}/read` - Mark enquiry as read

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/properties` - Get all properties
- `GET /api/admin/enquiries` - Get all enquiries
- `PUT /api/admin/users/{id}/toggle-active` - Toggle user status

## 🚧 Future Enhancements

- Google Maps integration for property locations
- Cloudinary integration for image uploads
- Email notifications for enquiries
- Advanced search with map view
- Property favorites/bookmarks
- User profiles and reviews
- Payment integration
- Real-time chat between buyers and sellers

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

