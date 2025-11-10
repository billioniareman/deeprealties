from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.models import (
    PropertyRecommendation, PropertyRecommendationForm, Property, TokenData
)
from app.auth import get_current_user
from app.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

def match_properties(form_data: PropertyRecommendationForm, properties: List[dict]) -> List[str]:
    """Match properties based on recommendation form criteria."""
    matched_property_ids = []
    
    for prop in properties:
        if not prop.get("is_active", True):
            continue
        
        # Property type match
        if form_data.property_type and prop.get("property_type") != form_data.property_type.value:
            continue
        
        # Location matches
        if form_data.city and prop.get("city", "").lower() != form_data.city.lower():
            continue
        if form_data.state and prop.get("state", "").lower() != form_data.state.lower():
            continue
        if form_data.locality and form_data.locality.lower() not in prop.get("locality", "").lower():
            continue
        
        # Price range match
        prop_price = prop.get("price", 0)
        if form_data.min_price and prop_price < form_data.min_price:
            continue
        if form_data.max_price and prop_price > form_data.max_price:
            continue
        
        # Area range match
        prop_area = prop.get("area_sqft", 0)
        if form_data.min_area_sqft and prop_area < form_data.min_area_sqft:
            continue
        if form_data.max_area_sqft and prop_area > form_data.max_area_sqft:
            continue
        
        # Bedrooms match (for house/flat)
        if form_data.bedrooms is not None and prop.get("bedrooms") != form_data.bedrooms:
            continue
        
        # Bathrooms match (for house/flat)
        if form_data.bathrooms is not None and prop.get("bathrooms") != form_data.bathrooms:
            continue
        
        # Parking match
        if form_data.parking is not None and prop.get("parking") != form_data.parking:
            continue
        
        # Facing match
        if form_data.facing and form_data.facing.lower() not in prop.get("facing", "").lower():
            continue
        
        matched_property_ids.append(str(prop["_id"]))
    
    return matched_property_ids

@router.post("/", response_model=PropertyRecommendation, status_code=status.HTTP_201_CREATED)
async def create_recommendation(
    form_data: PropertyRecommendationForm,
    current_user: TokenData = Depends(get_current_user)
):
    """Submit a property recommendation form and get matched properties."""
    db = get_database()
    
    # Get buyer
    buyer = await db.users.find_one({"email": current_user.email})
    if not buyer:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get all active properties
    cursor = db.properties.find({"is_active": True})
    all_properties = await cursor.to_list(length=10000)
    
    # Match properties based on form criteria
    matched_property_ids = match_properties(form_data, all_properties)
    
    # Create recommendation record
    recommendation_dict = {
        "buyer_id": str(buyer["_id"]),
        "form_data": form_data.dict(),
        "created_at": datetime.utcnow(),
        "matched_properties": matched_property_ids
    }
    
    result = await db.recommendations.insert_one(recommendation_dict)
    recommendation_dict["id"] = str(result.inserted_id)
    
    return PropertyRecommendation(**recommendation_dict)

@router.get("/", response_model=List[PropertyRecommendation])
async def get_my_recommendations(
    current_user: TokenData = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    """Get all property recommendations submitted by the current user."""
    db = get_database()
    
    buyer = await db.users.find_one({"email": current_user.email})
    if not buyer:
        raise HTTPException(status_code=404, detail="User not found")
    
    cursor = db.recommendations.find({"buyer_id": str(buyer["_id"])}).sort("created_at", -1).skip(skip).limit(limit)
    recommendations = await cursor.to_list(length=limit)
    
    result = []
    for rec in recommendations:
        rec["id"] = str(rec["_id"])
        del rec["_id"]
        result.append(PropertyRecommendation(**rec))
    
    return result

@router.get("/{recommendation_id}/properties", response_model=List[Property])
async def get_recommendation_properties(
    recommendation_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Get the matched properties for a specific recommendation."""
    db = get_database()
    
    if not ObjectId.is_valid(recommendation_id):
        raise HTTPException(status_code=400, detail="Invalid recommendation ID")
    
    buyer = await db.users.find_one({"email": current_user.email})
    if not buyer:
        raise HTTPException(status_code=404, detail="User not found")
    
    recommendation = await db.recommendations.find_one({"_id": ObjectId(recommendation_id)})
    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    
    # Check if recommendation belongs to the user
    if recommendation.get("buyer_id") != str(buyer["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this recommendation"
        )
    
    # Get matched properties
    matched_ids = recommendation.get("matched_properties", [])
    if not matched_ids:
        return []
    
    # Convert string IDs to ObjectIds
    object_ids = [ObjectId(pid) for pid in matched_ids if ObjectId.is_valid(pid)]
    
    cursor = db.properties.find({"_id": {"$in": object_ids}, "is_active": True})
    properties = await cursor.to_list(length=len(object_ids))
    
    result = []
    for prop in properties:
        prop["id"] = str(prop["_id"])
        del prop["_id"]
        result.append(Property(**prop))
    
    return result

