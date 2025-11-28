from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.models import Project, ProjectCreate, ProjectUpdate, ProjectStatus, TokenData
from app.auth import get_current_user
from app.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new project (Admin only)"""
    db = get_database()
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create projects"
        )
    
    project_dict = {
        **project_data.dict(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_active": True
    }
    
    result = await db.projects.insert_one(project_dict)
    project_dict["id"] = str(result.inserted_id)
    
    return Project(**project_dict)

@router.get("/", response_model=List[Project])
async def get_projects(
    status: Optional[ProjectStatus] = Query(None),
    city: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """Get all projects with optional filters"""
    db = get_database()
    
    filter_dict = {"is_active": True}
    
    if status:
        filter_dict["status"] = status.value
    if city:
        filter_dict["city"] = {"$regex": city, "$options": "i"}
    
    cursor = db.projects.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit)
    projects = await cursor.to_list(length=limit)
    
    result = []
    for proj in projects:
        proj["id"] = str(proj["_id"])
        del proj["_id"]
        result.append(Project(**proj))
    
    return result

@router.get("/completed", response_model=List[Project])
async def get_completed_projects():
    """Get all completed projects"""
    db = get_database()
    
    cursor = db.projects.find({
        "is_active": True,
        "status": ProjectStatus.COMPLETED.value
    }).sort("created_at", -1)
    
    projects = await cursor.to_list(length=100)
    
    result = []
    for proj in projects:
        proj["id"] = str(proj["_id"])
        del proj["_id"]
        result.append(Project(**proj))
    
    return result

@router.get("/ongoing", response_model=List[Project])
async def get_ongoing_projects():
    """Get all ongoing projects"""
    db = get_database()
    
    cursor = db.projects.find({
        "is_active": True,
        "status": ProjectStatus.ONGOING.value
    }).sort("created_at", -1)
    
    projects = await cursor.to_list(length=100)
    
    result = []
    for proj in projects:
        proj["id"] = str(proj["_id"])
        del proj["_id"]
        result.append(Project(**proj))
    
    return result

@router.get("/upcoming", response_model=List[Project])
async def get_upcoming_projects():
    """Get all upcoming projects"""
    db = get_database()
    
    cursor = db.projects.find({
        "is_active": True,
        "status": ProjectStatus.UPCOMING.value
    }).sort("created_at", -1)
    
    projects = await cursor.to_list(length=100)
    
    result = []
    for proj in projects:
        proj["id"] = str(proj["_id"])
        del proj["_id"]
        result.append(Project(**proj))
    
    return result

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str):
    """Get a specific project by ID"""
    db = get_database()
    
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID")
    
    project = await db.projects.find_one({
        "_id": ObjectId(project_id),
        "is_active": True
    })
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project["id"] = str(project["_id"])
    del project["_id"]
    
    return Project(**project)

@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    """Update a project (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update projects"
        )
    
    update_data = {k: v for k, v in project_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": update_data}
    )
    
    updated_project = await db.projects.find_one({"_id": ObjectId(project_id)})
    updated_project["id"] = str(updated_project["_id"])
    del updated_project["_id"]
    
    return Project(**updated_project)

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Delete a project (Admin only)"""
    db = get_database()
    
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID")
    
    user = await db.users.find_one({"email": current_user.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete projects"
        )
    
    await db.projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": {"is_active": False}}
    )
    
    return None

