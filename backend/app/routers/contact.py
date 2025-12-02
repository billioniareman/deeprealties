from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from app.models import ContactSubmission, ContactSubmissionCreate, TokenData
from app.auth import get_current_user
from app.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=ContactSubmission, status_code=status.HTTP_201_CREATED)
async def submit_contact_form(contact_data: ContactSubmissionCreate):
    """Submit a contact form"""
    db = get_database()
    
    contact_dict = {
        **contact_data.dict(),
        "created_at": datetime.utcnow(),
        "is_read": False,
        "is_responded": False
    }
    
    result = await db.contact_submissions.insert_one(contact_dict)
    contact_dict["id"] = str(result.inserted_id)
    
    return ContactSubmission(**contact_dict)

@router.get("/", response_model=List[ContactSubmission])
async def get_contact_submissions(
    current_user: TokenData = Depends(get_current_user),
    is_read: bool = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """Get all contact submissions (Admin only)"""
    db = get_database()
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view contact submissions"
        )
    
    filter_dict = {}
    if is_read is not None:
        filter_dict["is_read"] = is_read
    
    cursor = db.contact_submissions.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit)
    submissions = await cursor.to_list(length=limit)
    
    result = []
    for sub in submissions:
        sub["id"] = str(sub["_id"])
        del sub["_id"]
        result.append(ContactSubmission(**sub))
    
    return result

@router.get("/{submission_id}", response_model=ContactSubmission)
async def get_contact_submission(
    submission_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Get a specific contact submission (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(submission_id):
        raise HTTPException(status_code=400, detail="Invalid submission ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view contact submissions"
        )
    
    submission = await db.contact_submissions.find_one({"_id": ObjectId(submission_id)})
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    submission["id"] = str(submission["_id"])
    del submission["_id"]
    
    return ContactSubmission(**submission)

@router.put("/{submission_id}/read", response_model=ContactSubmission)
async def mark_submission_read(
    submission_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Mark a submission as read (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(submission_id):
        raise HTTPException(status_code=400, detail="Invalid submission ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update contact submissions"
        )
    
    await db.contact_submissions.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {"is_read": True}}
    )
    
    updated = await db.contact_submissions.find_one({"_id": ObjectId(submission_id)})
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    
    return ContactSubmission(**updated)

@router.put("/{submission_id}/responded", response_model=ContactSubmission)
async def mark_submission_responded(
    submission_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Mark a submission as responded (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(submission_id):
        raise HTTPException(status_code=400, detail="Invalid submission ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update contact submissions"
        )
    
    await db.contact_submissions.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {"is_responded": True, "is_read": True}}
    )
    
    updated = await db.contact_submissions.find_one({"_id": ObjectId(submission_id)})
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    
    return ContactSubmission(**updated)

@router.delete("/{submission_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_submission(
    submission_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Delete a contact submission (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(submission_id):
        raise HTTPException(status_code=400, detail="Invalid submission ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete contact submissions"
        )
    
    await db.contact_submissions.delete_one({"_id": ObjectId(submission_id)})
    
    return None

