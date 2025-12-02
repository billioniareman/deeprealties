from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.models import Event, EventCreate, EventUpdate, EventRegistration, TokenData
from app.auth import get_current_user
from app.database import get_database
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel, EmailStr

router = APIRouter()

class EventRegistrationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str

@router.post("/", response_model=Event, status_code=status.HTTP_201_CREATED)
async def create_event(
    event_data: EventCreate,
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new event (Admin only)"""
    db = get_database()
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create events"
        )
    
    event_dict = {
        **event_data.dict(),
        "created_at": datetime.utcnow(),
        "registered_count": 0,
        "is_active": True
    }
    
    result = await db.events.insert_one(event_dict)
    event_dict["id"] = str(result.inserted_id)
    
    return Event(**event_dict)

@router.get("/", response_model=List[Event])
async def get_events(
    is_past: Optional[bool] = Query(None),
    city: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """Get all events with optional filters"""
    db = get_database()
    
    filter_dict = {"is_active": True}
    
    if is_past is not None:
        filter_dict["is_past"] = is_past
    if city:
        filter_dict["city"] = {"$regex": city, "$options": "i"}
    
    cursor = db.events.find(filter_dict).sort("event_date", -1 if is_past else 1).skip(skip).limit(limit)
    events = await cursor.to_list(length=limit)
    
    result = []
    for event in events:
        event["id"] = str(event["_id"])
        del event["_id"]
        result.append(Event(**event))
    
    return result

@router.get("/upcoming", response_model=List[Event])
async def get_upcoming_events():
    """Get all upcoming events"""
    db = get_database()
    
    cursor = db.events.find({
        "is_active": True,
        "is_past": False,
        "event_date": {"$gte": datetime.utcnow()}
    }).sort("event_date", 1)
    
    events = await cursor.to_list(length=50)
    
    result = []
    for event in events:
        event["id"] = str(event["_id"])
        del event["_id"]
        result.append(Event(**event))
    
    return result

@router.get("/past", response_model=List[Event])
async def get_past_events():
    """Get all past events"""
    db = get_database()
    
    cursor = db.events.find({
        "is_active": True,
        "is_past": True
    }).sort("event_date", -1)
    
    events = await cursor.to_list(length=50)
    
    result = []
    for event in events:
        event["id"] = str(event["_id"])
        del event["_id"]
        result.append(Event(**event))
    
    return result

@router.get("/{event_id}", response_model=Event)
async def get_event(event_id: str):
    """Get a specific event by ID"""
    db = get_database()
    
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID")
    
    event = await db.events.find_one({
        "_id": ObjectId(event_id),
        "is_active": True
    })
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event["id"] = str(event["_id"])
    del event["_id"]
    
    return Event(**event)

@router.post("/{event_id}/register", response_model=EventRegistration)
async def register_for_event(
    event_id: str,
    registration: EventRegistrationCreate
):
    """Register for an event"""
    db = get_database()
    
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID")
    
    event = await db.events.find_one({
        "_id": ObjectId(event_id),
        "is_active": True,
        "is_past": False
    })
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found or already past")
    
    # Check if already registered
    existing = await db.event_registrations.find_one({
        "event_id": event_id,
        "email": registration.email
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this event")
    
    # Check max attendees
    if event.get("max_attendees"):
        if event.get("registered_count", 0) >= event["max_attendees"]:
            raise HTTPException(status_code=400, detail="Event is full")
    
    reg_dict = {
        "event_id": event_id,
        "full_name": registration.full_name,
        "email": registration.email,
        "phone": registration.phone,
        "created_at": datetime.utcnow()
    }
    
    result = await db.event_registrations.insert_one(reg_dict)
    reg_dict["id"] = str(result.inserted_id)
    
    # Update registered count
    await db.events.update_one(
        {"_id": ObjectId(event_id)},
        {"$inc": {"registered_count": 1}}
    )
    
    return EventRegistration(**reg_dict)

@router.put("/{event_id}", response_model=Event)
async def update_event(
    event_id: str,
    event_data: EventUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    """Update an event (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update events"
        )
    
    update_data = {k: v for k, v in event_data.dict().items() if v is not None}
    
    await db.events.update_one(
        {"_id": ObjectId(event_id)},
        {"$set": update_data}
    )
    
    updated_event = await db.events.find_one({"_id": ObjectId(event_id)})
    updated_event["id"] = str(updated_event["_id"])
    del updated_event["_id"]
    
    return Event(**updated_event)

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Delete an event (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete events"
        )
    
    await db.events.update_one(
        {"_id": ObjectId(event_id)},
        {"$set": {"is_active": False}}
    )
    
    return None

