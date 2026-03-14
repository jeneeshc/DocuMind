from dotenv import load_dotenv
load_dotenv()

import asyncio
import json
from app.core.gatekeeper import gatekeeper
from app.streams.stream_b import stream_b

PDF_PATH = r"D:\Projects\DocuMind\datasources\Test\RQ2_Cost_Optimization\f1040--2025.pdf"

async def main():
    content = open(PDF_PATH, "rb").read()
    filename = "f1040--2025.pdf"

    # 1. Test routing
    print("=== Step 1: Gatekeeper Routing ===")
    stream = await gatekeeper.route(content, filename)
    print(f"Routed to Stream: {stream}")
    
    if stream != "B":
        print("WARNING: Not routed to Stream B! Check gatekeeper keywords.")
        return
    
    # 2. Test Stream B process
    print("\n=== Step 2: Stream B Processing ===")
    result = await stream_b.process(content, filename)

    extracted = result.get("extracted", {})
    metadata = extracted.get("_metadata", {})
    extractors = metadata.get("extractors", {})
    healing = result.get("healing_report")

    print("\nExtracted Fields:")
    for k, v in extracted.items():
        if k != "_metadata":
            tag = extractors.get(k, "?")
            print(f"  {k}: {v!r}  [{tag}]")

    print("\nReferee Agent Triggered?", healing is not None)
    if healing:
        print("Detected Issues:", healing.get("detected_issues"))
        print("Healed Fields:", healing.get("healed_fields"))
    else:
        print("No issues found — all fields extracted natively.")

if __name__ == "__main__":
    asyncio.run(main())
