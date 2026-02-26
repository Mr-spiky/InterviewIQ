from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client: AsyncIOMotorClient = None  # type: ignore
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["interviewiq"]

    # Create indexes
    await db["users"].create_index([("email", ASCENDING)], unique=True)
    await db["sessions"].create_index([("user_id", ASCENDING)])
    await db["messages"].create_index([("session_id", ASCENDING)])
    print("✅ Connected to MongoDB")


async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")


def get_db():
    return db
