from dotenv import load_dotenv
load_dotenv()

import asyncio
import json
from app.core.gatekeeper import gatekeeper
from app.streams.stream_c import stream_c
from app.streams.stream_b import stream_b

INVOICE_PATH = r"D:\Projects\DocuMind\datasources\Test\RQ3_Referee_Validation\Invoices\Template1_Instance0.jpg"
FILENAME = "Template1_Instance0.jpg"

EXTRACTION_QUERY = "Extract: Invoice Number, Date, Due Date, Bill To (name, address), Sub Total, Tax/VAT amount, Total, line items (description, qty, price)"

async def main():
    content = open(INVOICE_PATH, "rb").read()

    # 1. Test Gatekeeper routing
    print("=== Step 1: Gatekeeper Routing ===")
    stream = await gatekeeper.route(content, FILENAME)
    print(f"Routed to Stream: {stream}")

    # 2. Run through the routed stream
    print(f"\n=== Step 2: Processing via Stream {stream} ===")
    if stream == "C":
        result = await stream_c.process(content, FILENAME, EXTRACTION_QUERY)
    elif stream == "B":
        result = await stream_b.process(content, FILENAME)
    else:
        print(f"Unexpected stream: {stream}")
        return

    print("\n--- Result ---")
    print(json.dumps(result, indent=2, default=str))

if __name__ == "__main__":
    asyncio.run(main())
