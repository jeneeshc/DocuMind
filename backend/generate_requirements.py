import json
import random
import os

OUTPUT_DIR = r"D:\Projects\DocuMind\datasources\Test\streamA"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "requirements.json")

def generate_sales_requirements(count=50):
    reqs = []
    regions = ['North', 'South', 'East', 'West', 'Central']
    products = ['Laptop', 'Mouse', 'Keyboard', 'Monitor']
    
    for _ in range(count):
        template = random.choice([
            "Calculate total revenue for {region} region.",
            "Find the top selling product in {region}.",
            "Filter sales where Units are greater than {units}.",
            "Group by Region and sum the Amounts.",
            "List all sales of {product} with Amount > {amount}.",
            "Calculate the average transaction value for {region}.",
            "Sort by Date descending and take top 5 rows.",
            "Create a pivot table of Product vs Region for Sum of Units.",
            "Filter for sales in {region} or {region2}.",
            "Calculate the commission (5%) for each sale and add as new column."
        ])
        
        req = template.format(
            region=random.choice(regions),
            region2=random.choice(regions),
            product=random.choice(products),
            units=random.randint(10, 50),
            amount=random.randint(100, 1000)
        )
        reqs.append(req)
    return reqs

def generate_hr_requirements(count=50):
    reqs = []
    depts = ['Sales', 'Engineering', 'HR', 'Marketing']
    
    for _ in range(count):
        template = random.choice([
            "Calculate average salary for {dept} department.",
            "List employees who joined after {year}.",
            "Find the highest paid employee in {dept}.",
            "Count number of employees in each department.",
            "Filter employees with Salary > {salary}.",
            "Sort employees by JoiningDate.",
            "Calculate total payroll cost for {dept}.",
            "Give a 10% bonus to all employees in {dept}.",
            "Find employees with Salary between {s1} and {s2}.",
            "Group by Department and find max Salary."
        ])
        
        s1 = random.randint(50000, 80000)
        req = template.format(
            dept=random.choice(depts),
            year=random.randint(2018, 2024),
            salary=random.randint(60000, 100000),
            s1=s1,
            s2=s1 + 20000
        )
        reqs.append(req)
    return reqs

def generate_inventory_requirements(count=50):
    reqs = []
    cats = ['Electronics', 'Furniture', 'Stationery']
    
    for _ in range(count):
        template = random.choice([
            "List items with StockLevel below ReorderPoint.",
            "Calculate total inventory value (StockLevel * Price).",
            "Find the most expensive item in {cat}.",
            "Filter items in {cat} category.",
            "Sort items by StockLevel ascending.",
            "Increase Price by 10% for {cat} items.",
            "Find items with Price > {price} and StockLevel > 0.",
            "Calculate average Price for {cat}.",
            "Group by Category and sum StockLevel.",
            "Identify items that need reordering."
        ])
        
        req = template.format(
            cat=random.choice(cats),
            price=random.randint(50, 200)
        )
        reqs.append(req)
    return reqs

def generate_financial_requirements(count=50):
    reqs = []
    types = ['Credit', 'Debit', 'Transfer']
    statuses = ['Completed', 'Pending', 'Failed']
    
    for _ in range(count):
        template = random.choice([
            "Sum the Amount for {type} transactions.",
            "Filter for {status} transactions.",
            "Calculate total Amount where Status is {status}.",
            "List transactions with Amount > {amount}.",
            "Group by Status and count transactions.",
            "Find the average Amount for {type} type.",
            "Sort transactions by Amount descending.",
            "Filter for {type} transactions that are {status}.",
            "Calculate percentage of {status} transactions.",
            "Find the largest {type} transaction."
        ])
        
        req = template.format(
            type=random.choice(types),
            status=random.choice(statuses),
            amount=random.randint(500, 5000)
        )
        reqs.append(req)
    return reqs

def main():
    if not os.path.exists(OUTPUT_DIR):
        print(f"Directory {OUTPUT_DIR} does not exist. Please run data generation first.")
        return

    requirements = {
        "sales": generate_sales_requirements(100),
        "hr": generate_hr_requirements(100),
        "inventory": generate_inventory_requirements(100),
        "financial": generate_financial_requirements(100)
    }

    with open(OUTPUT_FILE, 'w') as f:
        json.dump(requirements, f, indent=2)
    
    print(f"Generated requirements.json at {OUTPUT_FILE}")
    print(f"Counts: Sales={len(requirements['sales'])}, HR={len(requirements['hr'])}, "
          f"Inventory={len(requirements['inventory'])}, Financial={len(requirements['financial'])}")

if __name__ == "__main__":
    main()
