import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function parseCSV(csvText: string) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => {
            let val = values[i]?.trim();
            if (val !== '' && !isNaN(Number(val))) {
                obj[h] = Number(val);
            } else {
                obj[h] = val;
            }
        });
        return obj;
    });
}

export async function GET() {
    const resultsDir = 'D:\\Projects\\DocuMind\\datasources\\Test\\Results';

    const readData = (filename: string) => {
        const p = path.join(resultsDir, filename);
        if (fs.existsSync(p)) {
            const content = fs.readFileSync(p, 'utf-8');
            return parseCSV(content);
        }
        return [];
    };

    return NextResponse.json({
        rq1: readData('rq1_data.csv'),
        rq2: readData('rq2_data.csv'),
        rq3: readData('rq3_data.csv'),
        rq4: readData('rq4_data.csv'),
    });
}
