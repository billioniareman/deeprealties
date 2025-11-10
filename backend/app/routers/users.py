from fastapi import APIRouter, Depends
from app.models import User, TokenData
from app.auth import get_current_user
from app.database import get_database

router = APIRouter()

@router.get("/me", response_model=User)
async def get_current_user_info(current_user: TokenData = Depends(get_current_user)):
    db = get_database()
    user = await db.users.find_one({"email": current_user.email})
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user["id"] = str(user["_id"])
    del user["_id"]
    if "password" in user:
        del user["password"]
    
    return User(**user)

