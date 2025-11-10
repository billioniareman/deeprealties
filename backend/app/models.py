from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    BUYER = "buyer"
    SELLER = "seller"
    ADMIN = "admin"

class PropertyType(str, Enum):
    LAND = "land"
    HOUSE = "house"
    FLAT = "flat"
    PLOT = "plot"

# User Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.BUYER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    role: UserRole
    created_at: datetime
    is_active: bool = True

    class Config:
        from_attributes = True

# Property Models
class PropertyBase(BaseModel):
    title: str
    description: str
    locality: str = Field(..., description="Specific locality/neighborhood")
    city: str
    state: str
    price: float
    property_type: PropertyType
    area_sqft: float = Field(..., description="Area in square feet")
    # Property-specific fields
    bedrooms: Optional[int] = Field(None, description="For house/flat")
    bathrooms: Optional[int] = Field(None, description="For house/flat")
    floors: Optional[int] = Field(None, description="For house/flat")
    parking: Optional[bool] = Field(None, description="Parking available for house/flat")
    plot_number: Optional[str] = Field(None, description="For land/plot")
    facing: Optional[str] = Field(None, description="Direction facing (North, South, East, West)")
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class PropertyCreate(PropertyBase):
    images: List[str] = Field(default=[], max_items=3, description="Maximum 3 images allowed")

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    locality: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    price: Optional[float] = None
    property_type: Optional[PropertyType] = None
    area_sqft: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    floors: Optional[int] = None
    parking: Optional[bool] = None
    plot_number: Optional[str] = None
    facing: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    images: Optional[List[str]] = Field(None, max_items=3)

class Property(PropertyBase):
    id: str
    seller_id: str
    images: List[str] = Field(..., max_items=3)
    created_at: datetime
    updated_at: datetime
    is_active: bool = True

    class Config:
        from_attributes = True

# Enquiry Models
class EnquiryBase(BaseModel):
    property_id: str
    message: str

class EnquiryCreate(EnquiryBase):
    pass

class Enquiry(EnquiryBase):
    id: str
    buyer_id: str
    seller_id: str
    created_at: datetime
    is_read: bool = False

    class Config:
        from_attributes = True

# Property Recommendation Models (for buyers)
class PropertyRecommendationForm(BaseModel):
    property_type: Optional[PropertyType] = None
    locality: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_area_sqft: Optional[float] = None
    max_area_sqft: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    parking: Optional[bool] = None
    facing: Optional[str] = None
    description: Optional[str] = Field(None, description="Additional requirements or preferences")

class PropertyRecommendation(BaseModel):
    id: str
    buyer_id: str
    form_data: PropertyRecommendationForm
    created_at: datetime
    matched_properties: List[str] = Field(default=[], description="List of matched property IDs")

    class Config:
        from_attributes = True

# Filter Models
class PropertyFilter(BaseModel):
    city: Optional[str] = None
    state: Optional[str] = None
    locality: Optional[str] = None
    property_type: Optional[PropertyType] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_area_sqft: Optional[float] = None
    max_area_sqft: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    parking: Optional[bool] = None
    facing: Optional[str] = None

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

