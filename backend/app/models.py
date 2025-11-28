from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# ========================================
# ENUMS
# ========================================

class UserRole(str, Enum):
    BUYER = "buyer"
    SELLER = "seller"
    INVESTOR = "investor"
    ADMIN = "admin"

class PropertyType(str, Enum):
    LAND = "land"
    PLOT = "plot"
    FLAT = "flat"
    HOUSE = "house"
    VILLA = "villa"
    APARTMENT = "apartment"
    COMMERCIAL = "commercial"
    FARMLAND = "farmland"

class ListingType(str, Enum):
    SALE = "sale"
    RENT = "rent"

class PropertyStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ProjectStatus(str, Enum):
    COMPLETED = "completed"
    ONGOING = "ongoing"
    UPCOMING = "upcoming"

class RentType(str, Enum):
    FURNISHED = "furnished"
    UNFURNISHED = "unfurnished"
    SEMI_FURNISHED = "semi_furnished"

class TenantType(str, Enum):
    FAMILY = "family"
    BACHELOR = "bachelor"
    ANY = "any"

# ========================================
# USER MODELS
# ========================================

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

# ========================================
# PROPERTY MODELS (Buy/Sell)
# ========================================

class PropertyBase(BaseModel):
    title: str
    description: str
    locality: str = Field(..., description="Specific locality/neighborhood")
    city: str
    state: str
    price: float
    property_type: PropertyType
    listing_type: ListingType = ListingType.SALE
    area_sqft: float = Field(..., description="Area in square feet")
    # Property-specific fields
    bedrooms: Optional[int] = Field(None, description="For house/flat")
    bathrooms: Optional[int] = Field(None, description="For house/flat")
    floors: Optional[int] = Field(None, description="For house/flat")
    parking: Optional[bool] = Field(None, description="Parking available")
    plot_number: Optional[str] = Field(None, description="For land/plot")
    facing: Optional[str] = Field(None, description="Direction facing")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    # Farmland specific
    is_farmland: bool = False
    google_earth_link: Optional[str] = Field(None, description="Google Earth link for farmland")
    # Amenities
    amenities: List[str] = Field(default=[], description="List of amenities")

class PropertyCreate(PropertyBase):
    images: List[str] = Field(default=[], max_length=10, description="Property images")
    # Contact details (for submissions without login)
    full_name: str = Field(..., description="Submitter's full name")
    email: EmailStr = Field(..., description="Submitter's email")
    phone: str = Field(..., description="Submitter's phone number")

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    locality: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    price: Optional[float] = None
    property_type: Optional[PropertyType] = None
    listing_type: Optional[ListingType] = None
    area_sqft: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    floors: Optional[int] = None
    parking: Optional[bool] = None
    plot_number: Optional[str] = None
    facing: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_farmland: Optional[bool] = None
    google_earth_link: Optional[str] = None
    amenities: Optional[List[str]] = None
    images: Optional[List[str]] = None

class Property(PropertyBase):
    id: str
    seller_id: Optional[str] = None
    images: List[str] = []
    status: PropertyStatus = PropertyStatus.PENDING
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    views: int = 0
    # Contact details
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True

# ========================================
# RENTAL PROPERTY MODELS
# ========================================

class RentalPropertyBase(BaseModel):
    title: str
    description: str
    locality: str
    city: str
    state: str
    monthly_rent: float
    security_deposit: Optional[float] = None
    property_type: PropertyType
    area_sqft: float
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    rent_type: RentType = RentType.UNFURNISHED
    tenant_type: TenantType = TenantType.ANY
    available_from: Optional[datetime] = None
    amenities: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class RentalPropertyCreate(RentalPropertyBase):
    images: List[str] = []
    # Contact details (for submissions without login)
    full_name: str = Field(..., description="Submitter's full name")
    email: EmailStr = Field(..., description="Submitter's email")
    phone: str = Field(..., description="Submitter's phone number")

class RentalProperty(RentalPropertyBase):
    id: str
    owner_id: Optional[str] = None
    images: List[str] = []
    status: PropertyStatus = PropertyStatus.PENDING
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    # Contact details
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True

# ========================================
# PROPERTY REQUIREMENT (Buy Section)
# ========================================

class PropertyRequirementBase(BaseModel):
    property_type: PropertyType
    min_budget: float
    max_budget: float
    preferred_location: str
    city: str
    state: Optional[str] = None
    min_area_sqft: Optional[float] = None
    max_area_sqft: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    additional_requirements: Optional[str] = None

class PropertyRequirementCreate(PropertyRequirementBase):
    full_name: str
    email: EmailStr
    phone: str

class PropertyRequirement(PropertyRequirementBase):
    id: str
    user_id: Optional[str] = None
    full_name: str
    email: str
    phone: str
    created_at: datetime
    is_fulfilled: bool = False
    matched_properties: List[str] = []

    class Config:
        from_attributes = True

# ========================================
# PROJECT MODELS (Our Projects)
# ========================================

class ProjectBase(BaseModel):
    name: str
    description: str
    location: str
    city: str
    state: str
    status: ProjectStatus
    total_units: Optional[int] = None
    available_units: Optional[int] = None
    price_range_min: Optional[float] = None
    price_range_max: Optional[float] = None
    amenities: List[str] = []
    highlights: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    completion_date: Optional[datetime] = None
    possession_date: Optional[datetime] = None

class ProjectCreate(ProjectBase):
    images: List[str] = []
    gallery: List[str] = []
    videos: List[str] = []
    brochure_url: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    status: Optional[ProjectStatus] = None
    total_units: Optional[int] = None
    available_units: Optional[int] = None
    price_range_min: Optional[float] = None
    price_range_max: Optional[float] = None
    amenities: Optional[List[str]] = None
    highlights: Optional[List[str]] = None
    images: Optional[List[str]] = None
    gallery: Optional[List[str]] = None
    videos: Optional[List[str]] = None
    brochure_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    completion_date: Optional[datetime] = None
    possession_date: Optional[datetime] = None

class Project(ProjectBase):
    id: str
    images: List[str] = []
    gallery: List[str] = []
    videos: List[str] = []
    brochure_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    is_active: bool = True

    class Config:
        from_attributes = True

# ========================================
# EVENT MODELS
# ========================================

class EventBase(BaseModel):
    title: str
    description: str
    location: str
    city: str
    event_date: datetime
    event_time: Optional[str] = None
    is_past: bool = False
    registration_link: Optional[str] = None
    max_attendees: Optional[int] = None

class EventCreate(EventBase):
    images: List[str] = []
    videos: List[str] = []

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    event_date: Optional[datetime] = None
    event_time: Optional[str] = None
    is_past: Optional[bool] = None
    registration_link: Optional[str] = None
    max_attendees: Optional[int] = None
    images: Optional[List[str]] = None
    videos: Optional[List[str]] = None

class Event(EventBase):
    id: str
    images: List[str] = []
    videos: List[str] = []
    created_at: datetime
    registered_count: int = 0
    is_active: bool = True

    class Config:
        from_attributes = True

class EventRegistration(BaseModel):
    id: str
    event_id: str
    full_name: str
    email: str
    phone: str
    created_at: datetime

    class Config:
        from_attributes = True

# ========================================
# INVESTMENT MODELS
# ========================================

class InvestmentOpportunityBase(BaseModel):
    title: str
    description: str
    location: str
    city: str
    state: str
    investment_type: str  # Colony, Land, Commercial, etc.
    min_investment: float
    expected_roi: Optional[float] = None  # Percentage
    investment_period: Optional[str] = None  # e.g., "3-5 years"
    highlights: List[str] = []
    risk_level: Optional[str] = None  # Low, Medium, High

class InvestmentOpportunityCreate(InvestmentOpportunityBase):
    images: List[str] = []
    documents: List[str] = []

class InvestmentOpportunity(InvestmentOpportunityBase):
    id: str
    images: List[str] = []
    documents: List[str] = []
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    investors_count: int = 0

    class Config:
        from_attributes = True

class InvestorRegistrationBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    investment_budget: Optional[float] = None
    preferred_investment_type: Optional[str] = None
    message: Optional[str] = None

class InvestorRegistrationCreate(InvestorRegistrationBase):
    opportunity_id: Optional[str] = None

class InvestorRegistration(InvestorRegistrationBase):
    id: str
    opportunity_id: Optional[str] = None
    user_id: Optional[str] = None
    created_at: datetime
    is_contacted: bool = False

    class Config:
        from_attributes = True

# ========================================
# CONTACT MODELS
# ========================================

class ContactSubmissionBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class ContactSubmissionCreate(ContactSubmissionBase):
    pass

class ContactSubmission(ContactSubmissionBase):
    id: str
    created_at: datetime
    is_read: bool = False
    is_responded: bool = False

    class Config:
        from_attributes = True

# ========================================
# ENQUIRY MODELS
# ========================================

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

# ========================================
# PROPERTY RECOMMENDATION MODELS
# ========================================

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
    description: Optional[str] = None

class PropertyRecommendation(BaseModel):
    id: str
    buyer_id: str
    form_data: PropertyRecommendationForm
    created_at: datetime
    matched_properties: List[str] = []

    class Config:
        from_attributes = True

# ========================================
# STATISTICS MODELS
# ========================================

class SiteStatistics(BaseModel):
    total_properties: int = 0
    properties_sold: int = 0
    happy_customers: int = 0
    cities_covered: int = 0
    total_investors: int = 0
    total_projects: int = 0
    years_experience: int = 5

# ========================================
# FILTER MODELS
# ========================================

class PropertyFilter(BaseModel):
    city: Optional[str] = None
    state: Optional[str] = None
    locality: Optional[str] = None
    property_type: Optional[PropertyType] = None
    listing_type: Optional[ListingType] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_area_sqft: Optional[float] = None
    max_area_sqft: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    parking: Optional[bool] = None
    facing: Optional[str] = None

# ========================================
# TOKEN MODELS
# ========================================

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
