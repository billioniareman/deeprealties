from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models import Enquiry, EnquiryCreate, User, TokenData
from app.auth import get_current_user
from app.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=Enquiry, status_code=status.HTTP_201_CREATED)
async def create_enquiry(
    enquiry_data: EnquiryCreate,
    current_user: TokenData = Depends(get_current_user)
):
    """Create an enquiry for a property. Any user can enquire about properties."""
    db = get_database()
    
    # Get user (can be buyer or seller - dual role)
    user = await db.users.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get property and seller
    if not ObjectId.is_valid(enquiry_data.property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")
    
    property = await db.properties.find_one({"_id": ObjectId(enquiry_data.property_id)})
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    seller_id = property["seller_id"]
    
    # Don't allow users to enquire about their own properties
    if str(user["_id"]) == seller_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot enquire about your own property"
        )
    
    enquiry_dict = {
        "property_id": enquiry_data.property_id,
        "buyer_id": str(user["_id"]),  # buyer_id stores the enquirer's ID
        "seller_id": seller_id,
        "message": enquiry_data.message,
        "created_at": datetime.utcnow(),
        "is_read": False
    }
    
    result = await db.enquiries.insert_one(enquiry_dict)
    enquiry_dict["id"] = str(result.inserted_id)
    
    return Enquiry(**enquiry_dict)

@router.get("/my-enquiries", response_model=List[Enquiry])
async def get_my_enquiries(current_user: TokenData = Depends(get_current_user)):
    """Get all enquiries made by the current user (as a buyer)."""
    db = get_database()
    
    user = await db.users.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    cursor = db.enquiries.find({"buyer_id": str(user["_id"])}).sort("created_at", -1)
    enquiries = await cursor.to_list(length=1000)
    
    result = []
    for enquiry in enquiries:
        enquiry["id"] = str(enquiry["_id"])
        del enquiry["_id"]
        result.append(Enquiry(**enquiry))
    
    return result

@router.get("/received-enquiries", response_model=List[Enquiry])
async def get_received_enquiries(current_user: TokenData = Depends(get_current_user)):
    """Get all enquiries received for properties listed by the current user (as a seller)."""
    db = get_database()
    
    user = await db.users.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Any user can receive enquiries if they have listed properties
    cursor = db.enquiries.find({"seller_id": str(user["_id"])}).sort("created_at", -1)
    enquiries = await cursor.to_list(length=1000)
    
    result = []
    for enquiry in enquiries:
        enquiry["id"] = str(enquiry["_id"])
        del enquiry["_id"]
        result.append(Enquiry(**enquiry))
    
    return result

@router.put("/{enquiry_id}/read", response_model=Enquiry)
async def mark_enquiry_read(
    enquiry_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    db = get_database()
    
    if not ObjectId.is_valid(enquiry_id):
        raise HTTPException(status_code=400, detail="Invalid enquiry ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    enquiry = await db.enquiries.find_one({"_id": ObjectId(enquiry_id)})
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    # Check if user is the seller (owner of the property) or admin
    if str(enquiry["seller_id"]) != str(user["_id"]) and user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    await db.enquiries.update_one(
        {"_id": ObjectId(enquiry_id)},
        {"$set": {"is_read": True}}
    )
    
    updated_enquiry = await db.enquiries.find_one({"_id": ObjectId(enquiry_id)})
    updated_enquiry["id"] = str(updated_enquiry["_id"])
    del updated_enquiry["_id"]
    
    return Enquiry(**updated_enquiry)

