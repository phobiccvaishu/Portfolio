import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialPortfolioData } from '../src/data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const target = path.join(__dirname, 'server', 'data', 'portfolio.json');

fs.writeFileSync(target, JSON.stringify(initialPortfolioData, null, 2), 'utf-8');
console.log('Synchronized server/data/portfolio.json successfully!');
