from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.models import (
    Property, PropertyCreate, PropertyUpdate, PropertyFilter,
    PropertyType, User, TokenData
)
from app.auth import get_current_user
from app.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=Property, status_code=status.HTTP_201_CREATED)
async def create_property(
    property_data: PropertyCreate,
    current_user: TokenData = Depends(get_current_user)
):
    db = get_database()
    
    # Get user - any authenticated user can list properties
    user = await db.users.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate images count (max 3)
    if len(property_data.images) > 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 3 images allowed"
        )
    
    property_dict = {
        **property_data.dict(),
        "seller_id": str(user["_id"]),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_active": True
    }
    
    result = await db.properties.insert_one(property_dict)
    property_dict["id"] = str(result.inserted_id)
    
    return Property(**property_dict)

@router.get("/", response_model=List[Property])
async def get_properties(
    city: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    locality: Optional[str] = Query(None),
    property_type: Optional[PropertyType] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    min_area_sqft: Optional[float] = Query(None),
    max_area_sqft: Optional[float] = Query(None),
    bedrooms: Optional[int] = Query(None),
    bathrooms: Optional[int] = Query(None),
    parking: Optional[bool] = Query(None),
    facing: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    db = get_database()
    
    filter_dict = {"is_active": True}
    
    if city:
        filter_dict["city"] = {"$regex": city, "$options": "i"}
    if state:
        filter_dict["state"] = {"$regex": state, "$options": "i"}
    if locality:
        filter_dict["locality"] = {"$regex": locality, "$options": "i"}
    if property_type:
        filter_dict["property_type"] = property_type.value
    if min_price is not None:
        filter_dict["price"] = {"$gte": min_price}
    if max_price is not None:
        if "price" in filter_dict:
            filter_dict["price"]["$lte"] = max_price
        else:
            filter_dict["price"] = {"$lte": max_price}
    if min_area_sqft is not None:
        filter_dict["area_sqft"] = {"$gte": min_area_sqft}
    if max_area_sqft is not None:
        if "area_sqft" in filter_dict:
            filter_dict["area_sqft"]["$lte"] = max_area_sqft
        else:
            filter_dict["area_sqft"] = {"$lte": max_area_sqft}
    if bedrooms:
        filter_dict["bedrooms"] = bedrooms
    if bathrooms:
        filter_dict["bathrooms"] = bathrooms
    if parking is not None:
        filter_dict["parking"] = parking
    if facing:
        filter_dict["facing"] = {"$regex": facing, "$options": "i"}
    
    cursor = db.properties.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit)
    properties = await cursor.to_list(length=limit)
    
    result = []
    for prop in properties:
        prop["id"] = str(prop["_id"])
        del prop["_id"]
        result.append(Property(**prop))
    
    return result

@router.get("/{property_id}", response_model=Property)
async def get_property(property_id: str):
    db = get_database()
    
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")
    
    property = await db.properties.find_one({"_id": ObjectId(property_id), "is_active": True})
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    property["id"] = str(property["_id"])
    del property["_id"]
    
    return Property(**property)

@router.put("/{property_id}", response_model=Property)
async def update_property(
    property_id: str,
    property_data: PropertyUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    db = get_database()
    
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    property = await db.properties.find_one({"_id": ObjectId(property_id)})
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Check if user is the seller or admin (any user can list, but only owner can update)
    if str(property["seller_id"]) != str(user["_id"]) and user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this property"
        )
    
    update_data = {k: v for k, v in property_data.dict().items() if v is not None}
    
    # Validate images count if updating images
    if "images" in update_data and len(update_data["images"]) > 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 3 images allowed"
        )
    
    update_data["updated_at"] = datetime.utcnow()
    
    await db.properties.update_one(
        {"_id": ObjectId(property_id)},
        {"$set": update_data}
    )
    
    updated_property = await db.properties.find_one({"_id": ObjectId(property_id)})
    updated_property["id"] = str(updated_property["_id"])
    del updated_property["_id"]
    
    return Property(**updated_property)

@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
    property_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    db = get_database()
    
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    property = await db.properties.find_one({"_id": ObjectId(property_id)})
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Check if user is the seller or admin (any user can list, but only owner can delete)
    if str(property["seller_id"]) != str(user["_id"]) and user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this property"
        )
    
    # Soft delete
    await db.properties.update_one(
        {"_id": ObjectId(property_id)},
        {"$set": {"is_active": False}}
    )
    
    return None

@router.get("/my-properties", response_model=List[Property])
async def get_my_properties(current_user: TokenData = Depends(get_current_user)):
    """Get all properties listed by the current user (any user can list properties)"""
    db = get_database()
    
    user = await db.users.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    cursor = db.properties.find({"seller_id": str(user["_id"])}).sort("created_at", -1)
    properties = await cursor.to_list(length=1000)
    
    result = []
    for prop in properties:
        prop["id"] = str(prop["_id"])
        del prop["_id"]
        result.append(Property(**prop))
    
    return result

