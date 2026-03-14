from dotenv import load_dotenv
load_dotenv()

import asyncio
import json
from app.core.gatekeeper import gatekeeper
from app.streams.stream_b import stream_b
from app.streams.stream_c import stream_c
from app.streams.stream_d import stream_d

SAMPLES = [
    {
        "domain": "Tax",
        "file": r"D:\Projects\DocuMind\datasources\Test\RQ4_Domain_Adaptation\Tax\f1040--2025.pdf",
        "filename": "f1040--2025.pdf",
        "gt": r"D:\Projects\DocuMind\datasources\Test\RQ4_Domain_Adaptation\Tax\f1040--2025_gt.json",
        "query": "Extract: Tax Year, AGI (Adjusted Gross Income), Filing Status"
    },
    {
        "domain": "Legal",
        "file": r"D:\Projects\DocuMind\datasources\Test\RQ4_Domain_Adaptation\Legal\2ThemartComInc_19990826_10-12G_EX-10.10_6700288_EX-10.10_Co-Branding Agreement_ Agency Agreement.pdf",
        "filename": "Co-Branding Agreement.pdf",
        "gt": None,
        "query": "Extract: Parties involved, Agreement Type, Effective Date, Key Obligations"
    },
    {
        "domain": "Healthcare",
        "file": r"D:\Projects\DocuMind\datasources\Test\RQ4_Domain_Adaptation\Healthcare\patient_record_001.pdf",
        "filename": "patient_record_001.pdf",
        "gt": r"D:\Projects\DocuMind\datasources\Test\RQ4_Domain_Adaptation\Healthcare\patient_record_001_gt.json",
        "query": "Extract: Patient Name, Diagnosis, Medication"
    }
]

async def test_sample(sample):
    domain = sample["domain"]
    content = open(sample["file"], "rb").read()
    filename = sample["filename"]
    query = sample["query"]

    print(f"\n{'='*55}")
    print(f"DOMAIN: {domain}  |  File: {filename}")
    print(f"{'='*55}")

    # Ground truth if available
    if sample["gt"]:
        gt = json.load(open(sample["gt"]))
        print(f"Ground Truth: {json.dumps(gt, indent=2)}")

    # Routing
    stream = await gatekeeper.route(content, filename)
    print(f"\n→ Gatekeeper routed to: Stream {stream}")

    # Process
    if stream == "B":
        result = await stream_b.process(content, filename)
    elif stream == "C":
        result = await stream_c.process(content, filename, query)
    elif stream == "D":
        result = await stream_d.process(content, filename, query)
    else:
        result = {"status": "error", "message": f"Unexpected stream: {stream}"}

    data = result.get("data") or result
    print(f"\n→ Extraction Result:")
    print(json.dumps(data, indent=2, default=str))

async def main():
    for sample in SAMPLES:
        await test_sample(sample)

if __name__ == "__main__":
    asyncio.run(main())
