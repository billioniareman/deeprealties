from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    auth, properties, enquiries, admin, users, recommendations,
    projects, events, investments, contact, rentals, requirements
)
from app.database import connect_to_mongo, close_mongo_connection
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="DeepRealties API",
    version="2.0.0",
    description="Premium Real Estate Platform API - Buy, Sell, Rent & Invest"
)

# CORS middleware - get allowed origins from environment variable or use defaults
allowed_origins_str = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,https://deeprealties.vercel.app"
)
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database lifecycle
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Include routers
# Authentication & Users
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])

# Properties (Buy/Sell)
app.include_router(properties.router, prefix="/api/properties", tags=["Properties"])
app.include_router(requirements.router, prefix="/api/requirements", tags=["Property Requirements"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])

# Rentals
app.include_router(rentals.router, prefix="/api/rentals", tags=["Rentals"])

# Projects
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])

# Events
app.include_router(events.router, prefix="/api/events", tags=["Events"])

# Investments
app.include_router(investments.router, prefix="/api/investments", tags=["Investments"])

# Contact & Enquiries
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(enquiries.router, prefix="/api/enquiries", tags=["Enquiries"])

# Admin
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {
        "message": "DeepRealties API is running",
        "version": "2.0.0",
        "services": [
            "Buy Property",
            "Sell Property",
            "Rent Property",
            "Invest With Us",
            "Our Projects",
            "Events"
        ]
    }

@app.get("/api/statistics")
async def get_site_statistics():
    """Get overall site statistics"""
    from app.database import get_database
    
    db = get_database()
    
    total_properties = await db.properties.count_documents({"is_active": True})
    approved_properties = await db.properties.count_documents({
        "is_active": True,
        "status": "approved"
    })
    total_users = await db.users.count_documents({"is_active": True})
    total_investors = await db.investor_registrations.count_documents({})
    total_projects = await db.projects.count_documents({"is_active": True})
    total_rentals = await db.rentals.count_documents({
        "is_active": True,
        "status": "approved"
    })
    
    # Get unique cities
    cities = await db.properties.distinct("city", {"is_active": True})
    
    return {
        "total_properties": total_properties,
        "approved_properties": approved_properties,
        "total_users": total_users,
        "total_investors": total_investors,
        "total_projects": total_projects,
        "total_rentals": total_rentals,
        "cities_covered": len(cities),
        "years_experience": 5,
        "properties_sold": 250,  # Can be updated with actual tracking
        "happy_customers": total_users
    }
