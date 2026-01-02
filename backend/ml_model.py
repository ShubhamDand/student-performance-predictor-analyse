import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import json
import os
from pathlib import Path

BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / 'student_model.pkl'
STATS_PATH = BASE_DIR / 'model_stats.json'
CSV_PATH = BASE_DIR / 'Student_Performance.csv'

def train_model():
    """Train the ML model and save it"""
    # Load data
    df = pd.read_csv(CSV_PATH)
    
    # Encode categorical variable
    le = LabelEncoder()
    df['Extracurricular Activities'] = le.fit_transform(df['Extracurricular Activities'])
    
    # Prepare features and target
    X = df.drop('Performance Index', axis=1)
    y = df['Performance Index']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train multiple models and choose best
    models = {
        'RandomForest': RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10),
        'GradientBoosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
        'LinearRegression': LinearRegression()
    }
    
    best_model = None
    best_score = -float('inf')
    best_name = ''
    model_results = {}
    
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)
        
        model_results[name] = {
            'mae': float(mae),
            'mse': float(mse),
            'rmse': float(rmse),
            'r2': float(r2)
        }
        
        if r2 > best_score:
            best_score = r2
            best_model = model
            best_name = name
    
    # Get feature importance
    if hasattr(best_model, 'feature_importances_'):
        feature_importance = dict(zip(X.columns, best_model.feature_importances_.tolist()))
    else:
        feature_importance = dict(zip(X.columns, [0.2] * len(X.columns)))
    
    # Calculate dataset statistics
    dataset_stats = {
        'total_samples': len(df),
        'feature_stats': {},
        'target_stats': {
            'mean': float(y.mean()),
            'std': float(y.std()),
            'min': float(y.min()),
            'max': float(y.max()),
            'median': float(y.median())
        },
        'performance_distribution': {
            'Excellent (80-100)': int((y >= 80).sum()),
            'Good (60-79)': int(((y >= 60) & (y < 80)).sum()),
            'Average (40-59)': int(((y >= 40) & (y < 60)).sum()),
            'Poor (0-39)': int((y < 40).sum())
        }
    }
    
    # Feature statistics
    for col in X.columns:
        if col != 'Extracurricular Activities':
            original_col = col
            if col == 'Extracurricular Activities':
                dataset_stats['feature_stats'][col] = {
                    'type': 'categorical',
                    'values': ['No', 'Yes']
                }
            else:
                dataset_stats['feature_stats'][col] = {
                    'type': 'numeric',
                    'mean': float(df[original_col].mean()) if col in df.columns else float(X[col].mean()),
                    'std': float(df[original_col].std()) if col in df.columns else float(X[col].std()),
                    'min': float(df[original_col].min()) if col in df.columns else float(X[col].min()),
                    'max': float(df[original_col].max()) if col in df.columns else float(X[col].max())
                }
    
    # Save model
    model_data = {
        'model': best_model,
        'label_encoder': le,
        'feature_names': X.columns.tolist()
    }
    joblib.dump(model_data, MODEL_PATH)
    
    # Save statistics
    stats = {
        'best_model': best_name,
        'model_metrics': model_results[best_name],
        'all_models': model_results,
        'feature_importance': feature_importance,
        'dataset_stats': dataset_stats
    }
    
    with open(STATS_PATH, 'w') as f:
        json.dump(stats, f, indent=2)
    
    return stats

def load_model():
    """Load the trained model"""
    if not MODEL_PATH.exists():
        print("Model not found, training...")
        train_model()
    
    return joblib.load(MODEL_PATH)

def predict_performance(hours_studied, previous_scores, extracurricular, sleep_hours, sample_papers):
    """Make a prediction for a single student"""
    model_data = load_model()
    model = model_data['model']
    le = model_data['label_encoder']
    
    # Encode extracurricular
    extracurricular_encoded = 1 if extracurricular.lower() in ['yes', 'true', '1'] else 0
    
    # Create feature array
    features = np.array([[hours_studied, previous_scores, extracurricular_encoded, sleep_hours, sample_papers]])
    
    # Predict
    prediction = model.predict(features)[0]
    
    # Determine performance category
    if prediction >= 80:
        category = 'Excellent'
        color = '#10b981'
    elif prediction >= 60:
        category = 'Good'
        color = '#3b82f6'
    elif prediction >= 40:
        category = 'Average'
        color = '#f59e0b'
    else:
        category = 'Poor'
        color = '#ef4444'
    
    return {
        'predicted_score': float(prediction),
        'category': category,
        'color': color
    }

def get_model_stats():
    """Get model statistics"""
    if not STATS_PATH.exists():
        train_model()
    
    with open(STATS_PATH, 'r') as f:
        return json.load(f)

if __name__ == '__main__':
    print("Training model...")
    stats = train_model()
    print(f"Model trained: {stats['best_model']}")
    print(f"R2 Score: {stats['model_metrics']['r2']:.4f}")
    print(f"RMSE: {stats['model_metrics']['rmse']:.4f}")
