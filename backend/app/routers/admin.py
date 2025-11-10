from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from app.models import User, Property, Enquiry, TokenData
from app.auth import get_current_user
from app.database import get_database
from datetime import datetime, timedelta

router = APIRouter()

async def check_admin(current_user: TokenData = Depends(get_current_user)):
    db = get_database()
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return user

@router.get("/dashboard", response_model=Dict[str, Any])
async def get_dashboard(admin_user: dict = Depends(check_admin)):
    db = get_database()
    
    # Count users
    total_users = await db.users.count_documents({})
    buyers = await db.users.count_documents({"role": "buyer"})
    sellers = await db.users.count_documents({"role": "seller"})
    
    # Count properties
    total_properties = await db.properties.count_documents({"is_active": True})
    
    # Count enquiries
    total_enquiries = await db.enquiries.count_documents({})
    unread_enquiries = await db.enquiries.count_documents({"is_read": False})
    
    # Most active city
    pipeline = [
        {"$match": {"is_active": True}},
        {"$group": {"_id": "$city", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    top_cities = await db.properties.aggregate(pipeline).to_list(length=5)
    
    # Recent activities
    recent_properties = await db.properties.find({"is_active": True}).sort("created_at", -1).limit(5).to_list(length=5)
    recent_enquiries = await db.enquiries.find().sort("created_at", -1).limit(5).to_list(length=5)
    
    # Format recent properties
    formatted_properties = []
    for prop in recent_properties:
        prop["id"] = str(prop["_id"])
        del prop["_id"]
        formatted_properties.append(Property(**prop))
    
    # Format recent enquiries
    formatted_enquiries = []
    for enquiry in recent_enquiries:
        enquiry["id"] = str(enquiry["_id"])
        del enquiry["_id"]
        formatted_enquiries.append(Enquiry(**enquiry))
    
    return {
        "stats": {
            "total_users": total_users,
            "buyers": buyers,
            "sellers": sellers,
            "total_properties": total_properties,
            "total_enquiries": total_enquiries,
            "unread_enquiries": unread_enquiries
        },
        "top_cities": [{"city": city["_id"], "count": city["count"]} for city in top_cities],
        "recent_properties": [prop.dict() for prop in formatted_properties],
        "recent_enquiries": [enq.dict() for enq in formatted_enquiries]
    }

@router.get("/users", response_model=List[User])
async def get_all_users(admin_user: dict = Depends(check_admin)):
    db = get_database()
    
    cursor = db.users.find({}).sort("created_at", -1)
    users = await cursor.to_list(length=1000)
    
    result = []
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
        if "password" in user:
            del user["password"]
        result.append(User(**user))
    
    return result

@router.put("/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: str,
    admin_user: dict = Depends(check_admin)
):
    db = get_database()
    from bson import ObjectId
    
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_status = not user.get("is_active", True)
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_active": new_status}}
    )
    
    return {"message": f"User {'activated' if new_status else 'deactivated'}"}

@router.get("/properties", response_model=List[Property])
async def get_all_properties(admin_user: dict = Depends(check_admin)):
    db = get_database()
    
    cursor = db.properties.find({}).sort("created_at", -1)
    properties = await cursor.to_list(length=1000)
    
    result = []
    for prop in properties:
        prop["id"] = str(prop["_id"])
        del prop["_id"]
        result.append(Property(**prop))
    
    return result

@router.get("/enquiries", response_model=List[Enquiry])
async def get_all_enquiries(admin_user: dict = Depends(check_admin)):
    db = get_database()
    
    cursor = db.enquiries.find({}).sort("created_at", -1)
    enquiries = await cursor.to_list(length=1000)
    
    result = []
    for enquiry in enquiries:
        enquiry["id"] = str(enquiry["_id"])
        del enquiry["_id"]
        result.append(Enquiry(**enquiry))
    
    return result

