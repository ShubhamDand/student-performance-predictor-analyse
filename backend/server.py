from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
import uuid
from datetime import datetime, timezone, timedelta
import pandas as pd
import io

from ml_model import predict_performance, train_model, get_model_stats

from passlib.context import CryptContext
from jose import JWTError, jwt
from groq import Groq

# ==========================
# ENV SETUP
# ==========================
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

client_ai = Groq(api_key=GROQ_API_KEY)

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ==========================
# AUTH CONFIG
# ==========================
SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# ==========================
# MODELS
# ==========================
class PredictionInput(BaseModel):
    hours_studied: float = Field(..., ge=1, le=9)
    previous_scores: float = Field(..., ge=0, le=100)
    extracurricular_activities: str
    sleep_hours: float = Field(..., ge=0, le=24)
    sample_question_papers_practiced: int = Field(..., ge=0)


class PredictionOutput(BaseModel):
    predicted_score: float
    category: str
    color: str
    input_data: dict


class AIChatRequest(BaseModel):
    message: str
    context: dict | None = None


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict


# ==========================
# AUTH FUNCTIONS
# ==========================
def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)


def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


# ==========================
# AUTH CHECK
# ==========================
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_role(roles: list):
    async def checker(user: dict = Depends(get_current_user)):
        if user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Access denied")
        return user
    return checker


# ==========================
# TRAIN MODEL
# ==========================
try:
    train_model()
    print("ML Model Ready")
except Exception as e:
    print("Model error:", e)


# ==========================
# ROOT
# ==========================
@api_router.get("/")
async def root():
    return {"message": "Student Performance Predictor API running"}


# ==========================
# REGISTER
# ==========================
@api_router.post("/auth/register")
async def register_user(user: UserRegister):

    existing = await db.users.find_one({"email": user.email})

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user_doc = {
        "id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "role": user.role,
        "created_at": datetime.now(timezone.utc),
    }

    await db.users.insert_one(user_doc)

    return {"message": "User registered"}


# ==========================
# LOGIN
# ==========================
@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user: UserLogin):

    db_user = await db.users.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": db_user["id"],
        "email": db_user["email"],
        "role": db_user["role"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user["id"],
            "name": db_user["name"],
            "email": db_user["email"],
            "role": db_user["role"]
        }
    }


# ==========================
# SINGLE PREDICTION
# ==========================
@api_router.post("/predict", response_model=PredictionOutput)
async def predict(
    data: PredictionInput,
    user: dict = Depends(require_role(["student", "admin"]))
):

    result = predict_performance(
        hours_studied=data.hours_studied,
        previous_scores=data.previous_scores,
        extracurricular=data.extracurricular_activities,
        sleep_hours=data.sleep_hours,
        sample_papers=data.sample_question_papers_practiced
    )

    return PredictionOutput(
        predicted_score=result["predicted_score"],
        category=result["category"],
        color=result["color"],
        input_data=data.model_dump()
    )


# ==========================
# BATCH PREDICTION
# ==========================
@api_router.post("/predict-batch")
async def predict_batch(
    file: UploadFile = File(...),
    user: dict = Depends(require_role(["student", "admin"]))
):

    try:

        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))

        if "Previous Scores" not in df.columns:
            raise HTTPException(
                status_code=400,
                detail="CSV must contain 'Previous Scores' column"
            )

        predictions = []

        category_distribution = {
            "Excellent": 0,
            "Good": 0,
            "Average": 0,
            "Poor": 0
        }

        for _, row in df.iterrows():

            result = predict_performance(
                hours_studied=5,
                previous_scores=float(row["Previous Scores"]),
                extracurricular="No",
                sleep_hours=7,
                sample_papers=0
            )

            category = result["category"]

            predictions.append({
                "previous_score": row["Previous Scores"],
                "predicted_score": result["predicted_score"],
                "category": category
            })

            if category in category_distribution:
                category_distribution[category] += 1

        return {
            "predictions": predictions,
            "summary": {
                "total_students": len(predictions),
                "category_distribution": category_distribution
            }
        }

    except Exception as e:
        print("Batch prediction error:", e)

        return {
            "predictions": [],
            "summary": {
                "total_students": 0,
                "category_distribution": {
                    "Excellent": 0,
                    "Good": 0,
                    "Average": 0,
                    "Poor": 0
                }
            }
        }


# ==========================
# ANALYTICS
# ==========================
@api_router.get("/model-info")
async def get_model_info(user: dict = Depends(require_role(["admin"]))):
    stats = get_model_stats()
    return stats


# ==========================
# AI CHAT
# ==========================
@api_router.post("/ai-chat")
async def ai_chat(
    request: AIChatRequest,
    user: dict = Depends(require_role(["student", "admin"]))
):

    try:

        system_prompt = """
You are an AI Study Mentor helping students improve performance.
Give clear study advice and motivation.
"""

        response = client_ai.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message},
            ],
            temperature=0.7,
            max_tokens=500,
        )

        reply = response.choices[0].message.content

        return {"reply": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================
# APP CONFIG
# ==========================
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

logging.basicConfig(level=logging.INFO)


@app.on_event("shutdown")
async def shutdown_db():
    client.close()