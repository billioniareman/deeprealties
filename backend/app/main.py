from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, properties, enquiries, admin, users, recommendations
from app.database import connect_to_mongo, close_mongo_connection

app = FastAPI(title="DeepRealties API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
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
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(properties.router, prefix="/api/properties", tags=["Properties"])
app.include_router(enquiries.router, prefix="/api/enquiries", tags=["Enquiries"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Property Recommendations"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])

@app.get("/")
async def root():
    return {"message": "DeepRealties API is running"}

