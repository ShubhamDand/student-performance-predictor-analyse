import requests
import sys
import json
import io
from datetime import datetime

class StudentPerformanceAPITester:
    def __init__(self, base_url="https://grade-oracle-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'} if not files else {}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    response = requests.post(url, files=files)
                else:
                    response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Non-dict response'}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if success and response.content else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET",
            "",
            200
        )
        return success

    def test_single_prediction(self):
        """Test single student prediction"""
        test_data = {
            "hours_studied": 7.5,
            "previous_scores": 85.0,
            "extracurricular_activities": "Yes",
            "sleep_hours": 8.0,
            "sample_question_papers_practiced": 5
        }
        
        success, response = self.run_test(
            "Single Prediction",
            "POST",
            "predict",
            200,
            data=test_data
        )
        
        if success:
            required_keys = ['predicted_score', 'category', 'color', 'input_data']
            missing_keys = [key for key in required_keys if key not in response]
            if missing_keys:
                print(f"   ⚠️  Missing response keys: {missing_keys}")
                return False
            else:
                print(f"   Predicted Score: {response['predicted_score']}")
                print(f"   Category: {response['category']}")
                print(f"   Color: {response['color']}")
        
        return success

    def test_single_prediction_edge_cases(self):
        """Test single prediction with edge cases"""
        edge_cases = [
            {
                "name": "Minimum values",
                "data": {
                    "hours_studied": 0.0,
                    "previous_scores": 0.0,
                    "extracurricular_activities": "No",
                    "sleep_hours": 1.0,
                    "sample_question_papers_practiced": 0
                }
            },
            {
                "name": "Maximum values",
                "data": {
                    "hours_studied": 24.0,
                    "previous_scores": 100.0,
                    "extracurricular_activities": "Yes",
                    "sleep_hours": 12.0,
                    "sample_question_papers_practiced": 20
                }
            }
        ]
        
        all_passed = True
        for case in edge_cases:
            success, response = self.run_test(
                f"Single Prediction - {case['name']}",
                "POST",
                "predict",
                200,
                data=case['data']
            )
            if success:
                print(f"   Score: {response.get('predicted_score', 'N/A')}, Category: {response.get('category', 'N/A')}")
            all_passed = all_passed and success
        
        return all_passed

    def test_batch_prediction(self):
        """Test batch prediction with CSV"""
        # Create sample CSV content
        csv_content = """Hours Studied,Previous Scores,Extracurricular Activities,Sleep Hours,Sample Question Papers Practiced
7,99,Yes,9,1
4,82,No,4,2
8,51,Yes,7,2
5,75,No,8,5"""
        
        # Create file-like object
        csv_file = io.StringIO(csv_content)
        files = {'file': ('test_data.csv', csv_file.getvalue(), 'text/csv')}
        
        success, response = self.run_test(
            "Batch Prediction",
            "POST",
            "predict-batch",
            200,
            files=files
        )
        
        if success:
            required_keys = ['predictions', 'summary']
            missing_keys = [key for key in required_keys if key not in response]
            if missing_keys:
                print(f"   ⚠️  Missing response keys: {missing_keys}")
                return False
            else:
                print(f"   Total predictions: {len(response['predictions'])}")
                print(f"   Average score: {response['summary'].get('average_predicted_score', 'N/A')}")
                print(f"   Category distribution: {response['summary'].get('category_distribution', {})}")
        
        return success

    def test_batch_prediction_invalid_csv(self):
        """Test batch prediction with invalid CSV"""
        # Invalid CSV - missing required columns
        invalid_csv = """Name,Age,Grade
John,20,A
Jane,19,B"""
        
        files = {'file': ('invalid.csv', invalid_csv, 'text/csv')}
        
        success, response = self.run_test(
            "Batch Prediction - Invalid CSV",
            "POST",
            "predict-batch",
            400,
            files=files
        )
        
        return success

    def test_model_info(self):
        """Test model information endpoint"""
        success, response = self.run_test(
            "Model Info",
            "GET",
            "model-info",
            200
        )
        
        if success:
            required_keys = ['best_model', 'model_metrics', 'feature_importance', 'dataset_stats']
            missing_keys = [key for key in required_keys if key not in response]
            if missing_keys:
                print(f"   ⚠️  Missing response keys: {missing_keys}")
                return False
            else:
                print(f"   Best model: {response['best_model']}")
                print(f"   R² Score: {response['model_metrics'].get('r2', 'N/A')}")
                print(f"   Total samples: {response['dataset_stats'].get('total_samples', 'N/A')}")
        
        return success

    def test_prediction_history(self):
        """Test prediction history endpoint"""
        success, response = self.run_test(
            "Prediction History",
            "GET",
            "predictions/history",
            200
        )
        
        if success:
            required_keys = ['predictions', 'count']
            missing_keys = [key for key in required_keys if key not in response]
            if missing_keys:
                print(f"   ⚠️  Missing response keys: {missing_keys}")
                return False
            else:
                print(f"   History count: {response['count']}")
        
        return success

def main():
    print("🚀 Starting Student Performance API Tests")
    print("=" * 50)
    
    # Setup
    tester = StudentPerformanceAPITester()
    
    # Run all tests
    tests = [
        tester.test_root_endpoint,
        tester.test_model_info,
        tester.test_single_prediction,
        tester.test_single_prediction_edge_cases,
        tester.test_batch_prediction,
        tester.test_batch_prediction_invalid_csv,
        tester.test_prediction_history,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {str(e)}")
            tester.tests_run += 1
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Tests completed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "No tests run")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())