from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import pandas as pd
import io
from ml_model import predict_performance, get_model_stats, train_model

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class PredictionInput(BaseModel):
    hours_studied: float = Field(..., ge=0, le=24)
    previous_scores: float = Field(..., ge=0, le=100)
    extracurricular_activities: str
    sleep_hours: float = Field(..., ge=0, le=24)
    sample_question_papers_practiced: int = Field(..., ge=0)

class PredictionOutput(BaseModel):
    predicted_score: float
    category: str
    color: str
    input_data: dict

class BatchPredictionResult(BaseModel):
    predictions: List[dict]
    summary: dict

# Train model on startup
try:
    print("Initializing ML model...")
    train_model()
    print("Model ready!")
except Exception as e:
    print(f"Error training model: {e}")

# Routes
@api_router.get("/")
async def root():
    return {"message": "Student Performance Predictor API", "status": "active"}

@api_router.post("/predict", response_model=PredictionOutput)
async def predict(input_data: PredictionInput):
    """Predict performance for a single student"""
    try:
        result = predict_performance(
            hours_studied=input_data.hours_studied,
            previous_scores=input_data.previous_scores,
            extracurricular=input_data.extracurricular_activities,
            sleep_hours=input_data.sleep_hours,
            sample_papers=input_data.sample_question_papers_practiced
        )
        
        # Save prediction to database
        prediction_doc = {
            'id': str(uuid.uuid4()),
            'input': input_data.model_dump(),
            'output': result,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        await db.predictions.insert_one(prediction_doc)
        
        return PredictionOutput(
            predicted_score=result['predicted_score'],
            category=result['category'],
            color=result['color'],
            input_data=input_data.model_dump()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@api_router.post("/predict-batch", response_model=BatchPredictionResult)
async def predict_batch(file: UploadFile = File(...)):
    """Predict performance for multiple students from CSV"""
    try:
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Validate columns
        required_cols = ['Hours Studied', 'Previous Scores', 'Extracurricular Activities', 
                        'Sleep Hours', 'Sample Question Papers Practiced']
        
        if not all(col in df.columns for col in required_cols):
            raise HTTPException(status_code=400, detail=f"CSV must contain columns: {required_cols}")
        
        # Make predictions
        predictions = []
        for _, row in df.iterrows():
            result = predict_performance(
                hours_studied=row['Hours Studied'],
                previous_scores=row['Previous Scores'],
                extracurricular=row['Extracurricular Activities'],
                sleep_hours=row['Sleep Hours'],
                sample_papers=row['Sample Question Papers Practiced']
            )
            
            predictions.append({
                'input': {
                    'hours_studied': float(row['Hours Studied']),
                    'previous_scores': float(row['Previous Scores']),
                    'extracurricular_activities': row['Extracurricular Activities'],
                    'sleep_hours': float(row['Sleep Hours']),
                    'sample_question_papers_practiced': int(row['Sample Question Papers Practiced'])
                },
                'predicted_score': result['predicted_score'],
                'category': result['category'],
                'color': result['color']
            })
        
        # Calculate summary statistics
        pred_scores = [p['predicted_score'] for p in predictions]
        summary = {
            'total_students': len(predictions),
            'average_predicted_score': sum(pred_scores) / len(pred_scores),
            'min_score': min(pred_scores),
            'max_score': max(pred_scores),
            'category_distribution': {
                'Excellent': sum(1 for p in predictions if p['category'] == 'Excellent'),
                'Good': sum(1 for p in predictions if p['category'] == 'Good'),
                'Average': sum(1 for p in predictions if p['category'] == 'Average'),
                'Poor': sum(1 for p in predictions if p['category'] == 'Poor')
            }
        }
        
        # Save batch prediction
        batch_doc = {
            'id': str(uuid.uuid4()),
            'predictions': predictions,
            'summary': summary,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        await db.batch_predictions.insert_one(batch_doc)
        
        return BatchPredictionResult(predictions=predictions, summary=summary)
        
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="CSV file is empty")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction error: {str(e)}")

@api_router.get("/model-info")
async def get_model_info():
    """Get model information and statistics"""
    try:
        stats = get_model_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching model info: {str(e)}")

@api_router.get("/predictions/history")
async def get_prediction_history(limit: int = 50):
    """Get recent prediction history"""
    try:
        predictions = await db.predictions.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
        return {"predictions": predictions, "count": len(predictions)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
