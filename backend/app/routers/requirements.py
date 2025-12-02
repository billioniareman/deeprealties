from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.models import (
    PropertyRequirement, PropertyRequirementCreate, PropertyType, TokenData
)
from app.auth import get_current_user
from app.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=PropertyRequirement, status_code=status.HTTP_201_CREATED)
async def submit_property_requirement(requirement: PropertyRequirementCreate):
    """Submit a property requirement (What you're looking for)"""
    db = get_database()
    
    req_dict = {
        **requirement.dict(),
        "user_id": None,
        "created_at": datetime.utcnow(),
        "is_fulfilled": False,
        "matched_properties": []
    }
    
    result = await db.property_requirements.insert_one(req_dict)
    req_dict["id"] = str(result.inserted_id)
    
    # Try to match with existing properties
    filter_dict = {"is_active": True}
    
    if requirement.property_type:
        filter_dict["property_type"] = requirement.property_type.value
    if requirement.city:
        filter_dict["city"] = {"$regex": requirement.city, "$options": "i"}
    if requirement.min_budget is not None and requirement.max_budget is not None:
        filter_dict["price"] = {
            "$gte": requirement.min_budget,
            "$lte": requirement.max_budget
        }
    
    matched = await db.properties.find(filter_dict).limit(10).to_list(10)
    matched_ids = [str(p["_id"]) for p in matched]
    
    if matched_ids:
        await db.property_requirements.update_one(
            {"_id": result.inserted_id},
            {"$set": {"matched_properties": matched_ids}}
        )
        req_dict["matched_properties"] = matched_ids
    
    return PropertyRequirement(**req_dict)

@router.get("/", response_model=List[PropertyRequirement])
async def get_property_requirements(
    current_user: TokenData = Depends(get_current_user),
    is_fulfilled: Optional[bool] = Query(None),
    city: Optional[str] = Query(None),
    property_type: Optional[PropertyType] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """Get all property requirements (Admin only)"""
    db = get_database()
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view property requirements"
        )
    
    filter_dict = {}
    
    if is_fulfilled is not None:
        filter_dict["is_fulfilled"] = is_fulfilled
    if city:
        filter_dict["city"] = {"$regex": city, "$options": "i"}
    if property_type:
        filter_dict["property_type"] = property_type.value
    
    cursor = db.property_requirements.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit)
    requirements = await cursor.to_list(length=limit)
    
    result = []
    for req in requirements:
        req["id"] = str(req["_id"])
        del req["_id"]
        result.append(PropertyRequirement(**req))
    
    return result

@router.get("/{requirement_id}", response_model=PropertyRequirement)
async def get_property_requirement(
    requirement_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Get a specific property requirement (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(requirement_id):
        raise HTTPException(status_code=400, detail="Invalid requirement ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view property requirements"
        )
    
    requirement = await db.property_requirements.find_one({"_id": ObjectId(requirement_id)})
    
    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")
    
    requirement["id"] = str(requirement["_id"])
    del requirement["_id"]
    
    return PropertyRequirement(**requirement)

@router.put("/{requirement_id}/fulfilled", response_model=PropertyRequirement)
async def mark_requirement_fulfilled(
    requirement_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Mark a requirement as fulfilled (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(requirement_id):
        raise HTTPException(status_code=400, detail="Invalid requirement ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update requirements"
        )
    
    await db.property_requirements.update_one(
        {"_id": ObjectId(requirement_id)},
        {"$set": {"is_fulfilled": True}}
    )
    
    updated = await db.property_requirements.find_one({"_id": ObjectId(requirement_id)})
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    
    return PropertyRequirement(**updated)

@router.delete("/{requirement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_requirement(
    requirement_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Delete a property requirement (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(requirement_id):
        raise HTTPException(status_code=400, detail="Invalid requirement ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete requirements"
        )
    
    await db.property_requirements.delete_one({"_id": ObjectId(requirement_id)})
    
    return None

