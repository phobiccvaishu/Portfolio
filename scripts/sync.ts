import fs from 'fs';
import path from 'path';
import { initialPortfolioData } from '../src/data/initialData';

const outPath = path.resolve('server/data/portfolio.json');
fs.writeFileSync(outPath, JSON.stringify(initialPortfolioData, null, 2), 'utf-8');
console.log('Portfolio JSON updated successfully at', outPath);
