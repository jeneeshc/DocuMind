import requests
import json
import sys
import time

url = "http://localhost:8000/api/v1/process/orchestrate"

def test_file(file_path, schema=None):
    print(f"Testing {file_path}")
    files = {"file": open(file_path, "rb")}
    data = {}
    if schema:
        data["extraction_schema"] = schema
        
    start_time = time.time()
    try:
        response = requests.post(url, files=files, data=data, timeout=30)
        end_time = time.time()
        print(f"Response Code: {response.status_code}")
        print(f"Time Taken: {end_time - start_time:.2f} seconds")
        print(json.dumps(response.json(), indent=2))
    except requests.exceptions.Timeout:
        end_time = time.time()
        print(f"REQUEST TIMED OUT AFTER {end_time - start_time:.2f} SECONDS!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    import sys
    
    # 1. Test RQ1 File
    rq1_file = r"D:\Projects\DocuMind\datasources\Test\RQ1_Trilemma\Test\sample_rq1_1_generate_hr_data.csv"
    rq1_schema = json.dumps({
        "type": "transformation", 
        "instruction": "Convert the date format in column 'E' to 'DD-MMMM-YYYY'"
    })
    print("\n" + "="*50)
    print("TESTING RQ1 (STREAM A)")
    print("="*50)
    test_file(rq1_file, rq1_schema)

    # 2. Test RQ2 File (No Schema)
    rq2_file = r"D:\Projects\DocuMind\datasources\Test\RQ2_Cost_Optimization\f1040--2025.pdf"
    print("\n" + "="*50)
    print("TESTING RQ2 (STREAM B)")
    print("="*50)
    test_file(rq2_file)
