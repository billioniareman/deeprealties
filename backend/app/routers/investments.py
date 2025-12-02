from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.models import (
    InvestmentOpportunity, InvestmentOpportunityCreate,
    InvestorRegistration, InvestorRegistrationCreate, TokenData
)
from app.auth import get_current_user
from app.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

# ========================================
# INVESTMENT OPPORTUNITIES
# ========================================

@router.post("/opportunities", response_model=InvestmentOpportunity, status_code=status.HTTP_201_CREATED)
async def create_investment_opportunity(
    investment_data: InvestmentOpportunityCreate,
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new investment opportunity (Admin only)"""
    db = get_database()
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create investment opportunities"
        )
    
    investment_dict = {
        **investment_data.dict(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_active": True,
        "investors_count": 0
    }
    
    result = await db.investments.insert_one(investment_dict)
    investment_dict["id"] = str(result.inserted_id)
    
    return InvestmentOpportunity(**investment_dict)

@router.get("/opportunities", response_model=List[InvestmentOpportunity])
async def get_investment_opportunities(
    investment_type: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    min_investment: Optional[float] = Query(None),
    max_investment: Optional[float] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """Get all investment opportunities"""
    db = get_database()
    
    filter_dict = {"is_active": True}
    
    if investment_type:
        filter_dict["investment_type"] = {"$regex": investment_type, "$options": "i"}
    if city:
        filter_dict["city"] = {"$regex": city, "$options": "i"}
    if min_investment is not None:
        filter_dict["min_investment"] = {"$gte": min_investment}
    if max_investment is not None:
        if "min_investment" in filter_dict:
            filter_dict["min_investment"]["$lte"] = max_investment
        else:
            filter_dict["min_investment"] = {"$lte": max_investment}
    
    cursor = db.investments.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit)
    investments = await cursor.to_list(length=limit)
    
    result = []
    for inv in investments:
        inv["id"] = str(inv["_id"])
        del inv["_id"]
        result.append(InvestmentOpportunity(**inv))
    
    return result

@router.get("/opportunities/{opportunity_id}", response_model=InvestmentOpportunity)
async def get_investment_opportunity(opportunity_id: str):
    """Get a specific investment opportunity"""
    db = get_database()
    
    if not ObjectId.is_valid(opportunity_id):
        raise HTTPException(status_code=400, detail="Invalid opportunity ID")
    
    investment = await db.investments.find_one({
        "_id": ObjectId(opportunity_id),
        "is_active": True
    })
    
    if not investment:
        raise HTTPException(status_code=404, detail="Investment opportunity not found")
    
    investment["id"] = str(investment["_id"])
    del investment["_id"]
    
    return InvestmentOpportunity(**investment)

@router.delete("/opportunities/{opportunity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_investment_opportunity(
    opportunity_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Delete an investment opportunity (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(opportunity_id):
        raise HTTPException(status_code=400, detail="Invalid opportunity ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete investment opportunities"
        )
    
    await db.investments.update_one(
        {"_id": ObjectId(opportunity_id)},
        {"$set": {"is_active": False}}
    )
    
    return None

# ========================================
# INVESTOR REGISTRATIONS
# ========================================

@router.post("/register", response_model=InvestorRegistration, status_code=status.HTTP_201_CREATED)
async def register_as_investor(registration: InvestorRegistrationCreate):
    """Register as an investor"""
    db = get_database()
    
    # Check if already registered with this email
    existing = await db.investor_registrations.find_one({
        "email": registration.email
    })
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="This email is already registered as an investor"
        )
    
    reg_dict = {
        **registration.dict(),
        "user_id": None,
        "created_at": datetime.utcnow(),
        "is_contacted": False
    }
    
    result = await db.investor_registrations.insert_one(reg_dict)
    reg_dict["id"] = str(result.inserted_id)
    
    # If opportunity_id is provided, increment investors count
    if registration.opportunity_id:
        await db.investments.update_one(
            {"_id": ObjectId(registration.opportunity_id)},
            {"$inc": {"investors_count": 1}}
        )
    
    return InvestorRegistration(**reg_dict)

@router.get("/registrations", response_model=List[InvestorRegistration])
async def get_investor_registrations(
    current_user: TokenData = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """Get all investor registrations (Admin only)"""
    db = get_database()
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view investor registrations"
        )
    
    cursor = db.investor_registrations.find().sort("created_at", -1).skip(skip).limit(limit)
    registrations = await cursor.to_list(length=limit)
    
    result = []
    for reg in registrations:
        reg["id"] = str(reg["_id"])
        del reg["_id"]
        result.append(InvestorRegistration(**reg))
    
    return result

@router.put("/registrations/{registration_id}/contacted", response_model=InvestorRegistration)
async def mark_investor_contacted(
    registration_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Mark an investor registration as contacted (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(registration_id):
        raise HTTPException(status_code=400, detail="Invalid registration ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update investor registrations"
        )
    
    await db.investor_registrations.update_one(
        {"_id": ObjectId(registration_id)},
        {"$set": {"is_contacted": True}}
    )
    
    updated = await db.investor_registrations.find_one({"_id": ObjectId(registration_id)})
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    
    return InvestorRegistration(**updated)

# ========================================
# STATISTICS
# ========================================

@router.get("/statistics")
async def get_investment_statistics():
    """Get investment statistics"""
    db = get_database()
    
    total_opportunities = await db.investments.count_documents({"is_active": True})
    total_investors = await db.investor_registrations.count_documents({})
    
    # Calculate average ROI from active opportunities
    pipeline = [
        {"$match": {"is_active": True, "expected_roi": {"$exists": True, "$ne": None}}},
        {"$group": {"_id": None, "avg_roi": {"$avg": "$expected_roi"}}}
    ]
    roi_result = await db.investments.aggregate(pipeline).to_list(1)
    avg_roi = roi_result[0]["avg_roi"] if roi_result else 0
    
    return {
        "total_opportunities": total_opportunities,
        "total_investors": total_investors,
        "average_roi": round(avg_roi, 2) if avg_roi else 0
    }

