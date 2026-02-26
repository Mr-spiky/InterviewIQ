from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from db.mongo import get_db
from models.user import UserCreate, UserLogin, UserOut, TokenOut
from utils.auth import hash_password, verify_password, create_access_token, get_current_user
from utils.helpers import doc_to_dict
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut, status_code=201)
async def register(data: UserCreate):
    db = get_db()

    # Check duplicate email
    existing = await db["users"].find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "name": data.name,
        "email": data.email,
        "hashed_password": hash_password(data.password),
        "created_at": datetime.utcnow(),
    }
    result = await db["users"].insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_access_token({"sub": user_id})
    user_out = UserOut(
        id=user_id,
        name=data.name,
        email=data.email,
        created_at=user_doc["created_at"],
    )
    return TokenOut(access_token=token, user=user_out)


@router.post("/login", response_model=TokenOut)
async def login(data: UserLogin):
    db = get_db()

    user = await db["users"].find_one({"email": data.email})
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user["_id"])
    token = create_access_token({"sub": user_id})
    user_out = UserOut(
        id=user_id,
        name=user["name"],
        email=user["email"],
        created_at=user["created_at"],
    )
    return TokenOut(access_token=token, user=user_out)


@router.get("/me", response_model=UserOut)
async def get_me(user_id: str = Depends(get_current_user)):
    db = get_db()
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        created_at=user["created_at"],
    )
