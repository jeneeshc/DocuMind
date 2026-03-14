import fitz  # PyMuPDF
import json
import sys
import os

def extract_text_with_pymupdf(pdf_path: str):
    """
    Simulates Stream 2 PyMuPDF Logic:
    Extracts text layout (blocks) and raw text using PyMuPDF.
    """
    print(f"--- Processing: {os.path.basename(pdf_path)} ---")
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening document: {e}")
        return

    full_text = ""
    pages_data = []

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        
        # 1. Raw text extraction (Fastest)
        text = page.get_text("text")
        full_text += text + "\n"
        
        # 2. Layout/Block extraction (for coordinate-based logic if needed)
        # get_text("dict") gives detailed word-by-word info, get_text("blocks") gives paragraph blocks
        blocks = page.get_text("blocks")
        
        page_dict = {
            "page_num": page_num + 1,
            "block_count": len(blocks),
            "sample_blocks": []
        }
        
        # Save a few sample blocks to demonstrate layout extraction
        for b in blocks[:5]: # Take first 5 blocks
            # b = (x0, y0, x1, y1, "text", block_no, block_type)
            if b[6] == 0:  # block_type 0 is text
                page_dict["sample_blocks"].append({
                    "bbox": (round(b[0], 2), round(b[1], 2), round(b[2], 2), round(b[3], 2)),
                    "text": b[4].strip()
                })
                
        pages_data.append(page_dict)

    doc.close()

    print("\n[PyMuPDF Extraction Summary]")
    print(f"Total Pages: {len(pages_data)}")
    print(f"Total Text Length: {len(full_text)} characters")
    
    print("\n[Sample Layout Blocks from Page 1]")
    if pages_data and pages_data[0]["sample_blocks"]:
        print(json.dumps(pages_data[0]["sample_blocks"], indent=2))
    else:
        print("No text blocks found on page 1.")
        
    print("\n[Preview of Extracted Text (First 500 chars)]")
    print("-" * 40)
    print(full_text[:500])
    print("-" * 40)

if __name__ == "__main__":
    # Default to the sample from Digital_Native
    sample_path = r"D:\Projects\DocuMind\datasources\Test\RQ2_Cost_Optimization\Digital_Native\f1040--2025.pdf"
    
    if len(sys.argv) > 1:
        sample_path = sys.argv[1]
        
    if not os.path.exists(sample_path):
        print(f"File not found: {sample_path}")
    else:
        extract_text_with_pymupdf(sample_path)
