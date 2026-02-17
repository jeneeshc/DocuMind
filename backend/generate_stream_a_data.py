import os
import pandas as pd
import random
import uuid
from datetime import datetime, timedelta

# Try importing faker, if not present, use simple random generation
try:
    from faker import Faker
    fake = Faker()
    HAS_FAKER = True
except ImportError:
    HAS_FAKER = False
    print("Faker not found. Using simple random generation.")

OUTPUT_DIR = r"D:\Projects\DocuMind\datasources\Test\streamA"
TOTAL_FILES = 385

def generate_sales_data(num_rows):
    data = []
    products = ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Headphones', 'Phone', 'Tablet', 'Charger']
    regions = ['North', 'South', 'East', 'West', 'Central']
    
    for _ in range(num_rows):
        data.append({
            "Date": (datetime.now() - timedelta(days=random.randint(0, 365))).strftime("%Y-%m-%d"),
            "Product": random.choice(products),
            "Region": random.choice(regions),
            "Units": random.randint(1, 100),
            "amount": round(random.uniform(10.0, 2000.0), 2)
        })
    return pd.DataFrame(data)

def generate_hr_data(num_rows):
    data = []
    depts = ['Sales', 'Engineering', 'HR', 'Marketing', 'Finance', 'Support']
    
    for i in range(num_rows):
        emp_id = 1000 + i
        name = fake.name() if HAS_FAKER else f"Employee_{i}"
        data.append({
            "EmployeeID": emp_id,
            "Name": name,
            "Department": random.choice(depts),
            "Salary": random.randint(40000, 150000),
            "JoiningDate": (datetime.now() - timedelta(days=random.randint(0, 3650))).strftime("%Y-%m-%d")
        })
    return pd.DataFrame(data)

def generate_inventory_data(num_rows):
    data = []
    categories = ['Electronics', 'Furniture', 'Stationery', 'Accessories', 'Appliances']
    
    for i in range(num_rows):
        data.append({
            "ItemID": f"ITEM-{100+i}",
            "Category": random.choice(categories),
            "StockLevel": random.randint(0, 500),
            "ReorderPoint": random.randint(10, 50),
            "Price": round(random.uniform(5.0, 500.0), 2)
        })
    return pd.DataFrame(data)

def generate_financial_data(num_rows):
    data = []
    types = ['Credit', 'Debit', 'Transfer', 'Adjustment']
    statuses = ['Completed', 'Pending', 'Failed', 'Cancelled']
    
    for i in range(num_rows):
        data.append({
            "TransactionID": str(uuid.uuid4())[:8],
            "Type": random.choice(types),
            "Amount": round(random.uniform(100.0, 10000.0), 2),
            "Currency": "USD",
            "Status": random.choice(statuses)
        })
    return pd.DataFrame(data)

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created directory: {OUTPUT_DIR}")
    else:
        print(f"Directory exists: {OUTPUT_DIR}")

    print(f"Generating {TOTAL_FILES} files...")
    
    generators = [
        generate_sales_data,
        generate_hr_data,
        generate_inventory_data,
        generate_financial_data
    ]
    
    for i in range(TOTAL_FILES):
        gen_func = random.choice(generators)
        num_rows = random.randint(20, 100)
        df = gen_func(num_rows)
        
        filename = f"sample_rq1_{i+1}_{gen_func.__name__}.csv"
        file_path = os.path.join(OUTPUT_DIR, filename)
        
        df.to_csv(file_path, index=False)
        
        if (i+1) % 50 == 0:
            print(f"Generated {i+1}/{TOTAL_FILES} files...")

    print("Data generation complete.")
    print(f"Files saved to: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
