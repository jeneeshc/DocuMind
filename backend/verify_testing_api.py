import sys
import os
import asyncio
import json

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_run_rq1():
    print("Testing RQ1 (Trilemma)...")
    response = client.post("/api/v1/testing/run", json={"test_type": "RQ1", "sample_size": 10})
    if response.status_code == 200:
        data = response.json()
        print(f"SUCCESS: Type={data['test_type']}, P-Value={data['p_value']}, Sig={data['significant']}")
        print(f"Details count: {len(data['details'])}")
    else:
        print(f"FAILED: {response.text}")

def test_run_rq2():
    print("\nTesting RQ2 (Routing Token Usage)...")
    response = client.post("/api/v1/testing/run", json={"test_type": "RQ2", "sample_size": 10})
    if response.status_code == 200:
        data = response.json()
        print(f"SUCCESS: Type={data['test_type']}, P-Value={data['p_value']}")
    else:
        print(f"FAILED: {response.text}")

def test_history():
    print("\nTesting History...")
    response = client.get("/api/v1/testing/history")
    if response.status_code == 200:
        data = response.json()
        print(f"SUCCESS: History count={len(data)}")
    else:
        print(f"FAILED: {response.text}")

if __name__ == "__main__":
    try:
        test_run_rq1()
        test_run_rq2()
        test_history()
        print("\nVerification Complete.")
    except ImportError as e:
        print(f"Import Error: {e}. Ensure dependencies are installed.")
    except Exception as e:
        print(f"Unexpected Error: {e}")
