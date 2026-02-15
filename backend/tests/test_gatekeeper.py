import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from backend.app.core.gatekeeper import gatekeeper

async def test_gatekeeper():
    print("Running Gatekeeper Verification...")
    
    # Test Layer 1: Metadata
    print("Testing Layer 1 (Metadata) - .csv file...")
    route_a = await gatekeeper.route(b"dummy content", "data.csv")
    assert route_a == "A", f"Expected A, got {route_a}"
    print("Layer 1 CSV OK.")
    
    # Test Layer 2: Heuristics
    print("Testing Layer 2 (Heuristics) - Tax keyword...")
    route_b = await gatekeeper.route(b"This is a Form 1040 document.", "document.pdf")
    assert route_b == "B", f"Expected B, got {route_b}"
    print("Layer 2 Tax OK.")
    
    # Test Layer 3: Density
    print("Testing Layer 3 (Density) - High density text...")
    high_density = b"A" * 1601 + b" " * 399 # >80% non-whitespace
    route_d = await gatekeeper.route(high_density, "legal.txt")
    assert route_d == "D", f"Expected D, got {route_d}"
    print("Layer 3 Density OK.")
    
    # Test Default
    print("Testing Default - Semi-structured visual...")
    route_c = await gatekeeper.route(b"Small text block", "image.jpg")
    assert route_c == "C", f"Expected C, got {route_c}"
    print("Default Route OK.")
    
    print("\nGatekeeper Verification SUCCESSFUL.")

if __name__ == "__main__":
    asyncio.run(test_gatekeeper())
