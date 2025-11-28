from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.models import (
    RentalProperty, RentalPropertyCreate, PropertyStatus,
    PropertyType, RentType, TenantType, TokenData
)
from app.auth import get_current_user
from app.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=RentalProperty, status_code=status.HTTP_201_CREATED)
async def create_rental_listing(rental_data: RentalPropertyCreate):
    """Create a new rental property listing. No login required - contact details are stored."""
    db = get_database()
    
    rental_dict = {
        **rental_data.dict(),
        "owner_id": None,  # No user ID since no login required
        "status": PropertyStatus.PENDING.value,  # Always pending for review
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_active": True
    }
    
    result = await db.rentals.insert_one(rental_dict)
    rental_dict["id"] = str(result.inserted_id)
    
    return RentalProperty(**rental_dict)

@router.get("/", response_model=List[RentalProperty])
async def get_rental_properties(
    city: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    property_type: Optional[PropertyType] = Query(None),
    rent_type: Optional[RentType] = Query(None),
    tenant_type: Optional[TenantType] = Query(None),
    min_rent: Optional[float] = Query(None),
    max_rent: Optional[float] = Query(None),
    bedrooms: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """Get all approved rental properties"""
    db = get_database()
    
    filter_dict = {
        "is_active": True,
        "status": PropertyStatus.APPROVED.value
    }
    
    if city:
        filter_dict["city"] = {"$regex": city, "$options": "i"}
    if state:
        filter_dict["state"] = {"$regex": state, "$options": "i"}
    if property_type:
        filter_dict["property_type"] = property_type.value
    if rent_type:
        filter_dict["rent_type"] = rent_type.value
    if tenant_type:
        filter_dict["tenant_type"] = tenant_type.value
    if min_rent is not None:
        filter_dict["monthly_rent"] = {"$gte": min_rent}
    if max_rent is not None:
        if "monthly_rent" in filter_dict:
            filter_dict["monthly_rent"]["$lte"] = max_rent
        else:
            filter_dict["monthly_rent"] = {"$lte": max_rent}
    if bedrooms:
        filter_dict["bedrooms"] = bedrooms
    
    cursor = db.rentals.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit)
    rentals = await cursor.to_list(length=limit)
    
    result = []
    for rental in rentals:
        rental["id"] = str(rental["_id"])
        del rental["_id"]
        result.append(RentalProperty(**rental))
    
    return result

@router.get("/my-listings", response_model=List[RentalProperty])
async def get_my_rental_listings(
    current_user: TokenData = Depends(get_current_user)
):
    """Get all rental listings by current user"""
    db = get_database()
    
    user = await db.users.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    cursor = db.rentals.find({
        "owner_id": str(user["_id"]),
        "is_active": True
    }).sort("created_at", -1)
    
    rentals = await cursor.to_list(length=100)
    
    result = []
    for rental in rentals:
        rental["id"] = str(rental["_id"])
        del rental["_id"]
        result.append(RentalProperty(**rental))
    
    return result

@router.get("/pending", response_model=List[RentalProperty])
async def get_pending_rentals(
    current_user: TokenData = Depends(get_current_user)
):
    """Get all pending rental listings (Admin only)"""
    db = get_database()
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view pending rentals"
        )
    
    cursor = db.rentals.find({
        "status": PropertyStatus.PENDING.value,
        "is_active": True
    }).sort("created_at", -1)
    
    rentals = await cursor.to_list(length=100)
    
    result = []
    for rental in rentals:
        rental["id"] = str(rental["_id"])
        del rental["_id"]
        result.append(RentalProperty(**rental))
    
    return result

@router.get("/{rental_id}", response_model=RentalProperty)
async def get_rental_property(rental_id: str):
    """Get a specific rental property"""
    db = get_database()
    
    if not ObjectId.is_valid(rental_id):
        raise HTTPException(status_code=400, detail="Invalid rental ID")
    
    rental = await db.rentals.find_one({
        "_id": ObjectId(rental_id),
        "is_active": True
    })
    
    if not rental:
        raise HTTPException(status_code=404, detail="Rental property not found")
    
    rental["id"] = str(rental["_id"])
    del rental["_id"]
    
    return RentalProperty(**rental)

@router.put("/{rental_id}/approve", response_model=RentalProperty)
async def approve_rental(
    rental_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Approve a rental listing (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(rental_id):
        raise HTTPException(status_code=400, detail="Invalid rental ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can approve rentals"
        )
    
    await db.rentals.update_one(
        {"_id": ObjectId(rental_id)},
        {"$set": {"status": PropertyStatus.APPROVED.value, "updated_at": datetime.utcnow()}}
    )
    
    updated = await db.rentals.find_one({"_id": ObjectId(rental_id)})
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    
    return RentalProperty(**updated)

@router.put("/{rental_id}/reject", response_model=RentalProperty)
async def reject_rental(
    rental_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Reject a rental listing (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(rental_id):
        raise HTTPException(status_code=400, detail="Invalid rental ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can reject rentals"
        )
    
    await db.rentals.update_one(
        {"_id": ObjectId(rental_id)},
        {"$set": {"status": PropertyStatus.REJECTED.value, "updated_at": datetime.utcnow()}}
    )
    
    updated = await db.rentals.find_one({"_id": ObjectId(rental_id)})
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    
    return RentalProperty(**updated)

@router.delete("/{rental_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_rental(
    rental_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Delete a rental listing"""
    db = get_database()
    
    if not ObjectId.is_valid(rental_id):
        raise HTTPException(status_code=400, detail="Invalid rental ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    rental = await db.rentals.find_one({"_id": ObjectId(rental_id)})
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    
    # Check if user is owner or admin
    if str(rental["owner_id"]) != str(user["_id"]) and user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this rental"
        )
    
    await db.rentals.update_one(
        {"_id": ObjectId(rental_id)},
        {"$set": {"is_active": False}}
    )
    
    return None

