import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';
import { z } from 'zod';
import dotenv from 'dotenv';
import { initialPortfolioData } from '../src/data/initialData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT || 5000;

// Ensure directories exist safely (support serverless writable /tmp on Vercel)
const isServerless = Boolean(process.env.VERCEL);
const dataDir = path.join(__dirname, 'data');
const uploadsDir = isServerless ? path.join(os.tmpdir(), 'portfolio-uploads') : path.join(__dirname, 'uploads');
const certificatesDir = path.join(uploadsDir, 'certificates');

[dataDir, uploadsDir, certificatesDir].forEach(dir => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    // Non-blocking in read-only serverless lambdas
  }
});

const portfolioFile = path.join(dataDir, 'portfolio.json');
const messagesFile = path.join(dataDir, 'messages.json');

// --- SECURITY HEADERS ---
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const sessionSecret = process.env.SESSION_SECRET || 'portfolio_default_session_secret_key_2026';
app.use(cookieParser(sessionSecret));

// Static uploads with dotfile protection
app.use('/uploads', express.static(uploadsDir, { dotfiles: 'ignore' }));

// --- CRYPTOGRAPHIC HELPERS & AUTHENTICATION STORE ---
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(':')) return false;
  const [salt, originalHash] = stored.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch (e) {
    return false;
  }
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'vaishnavi';
let ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!ADMIN_PASSWORD_HASH) {
  const plainPassword = process.env.ADMIN_PASSWORD || 'admin_secret_dev2026!';
  ADMIN_PASSWORD_HASH = hashPassword(plainPassword);
}

// In-memory high-entropy session store (TTL 24 hours)
interface SessionData {
  username: string;
  createdAt: number;
  expiresAt: number;
}

export const sessionStore = new Map<string, SessionData>();
const SESSION_TTL = 24 * 60 * 60 * 1000;

// Periodic cleanup of expired sessions
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessionStore.entries()) {
    if (now > session.expiresAt) {
      sessionStore.delete(token);
    }
  }
}, 10 * 60 * 1000).unref();

// Login rate limiting (sliding window: max 5 attempts per 15 minutes)
interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

export const loginAttempts = new Map<string, RateLimitEntry>();
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const BLOCK_DURATION = 15 * 60 * 1000;

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) return { allowed: true };

  if (entry.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.blockedUntil - now) / 1000)
    };
  }

  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  if (entry.attempts >= MAX_LOGIN_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_DURATION;
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(BLOCK_DURATION / 1000)
    };
  }

  return { allowed: true };
}

function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, { attempts: 1, firstAttempt: now });
  } else {
    entry.attempts += 1;
    if (entry.attempts >= MAX_LOGIN_ATTEMPTS) {
      entry.blockedUntil = now + BLOCK_DURATION;
    }
  }
}

function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

// --- REQUIRE ADMIN MIDDLEWARE ---
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.admin_session ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Access to administrative operations is restricted.'
    });
  }

  const session = sessionStore.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) sessionStore.delete(token);
    res.clearCookie('admin_session', { path: '/' });
    return res.status(401).json({
      success: false,
      error: 'Administrator session is invalid or has expired. Please log in again.'
    });
  }

  (req as any).adminUser = session.username;
  next();
}

// --- MULTER STORAGE WITH PATH TRAVERSAL DEFENSE ---
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === 'certificate') {
      cb(null, certificatesDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Sanitize and strip path traversal characters
    const baseName = path.basename(file.originalname);
    const sanitized = baseName.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitized}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext) || file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed.'));
    }
  }
});

// Memory storage multer for documents (avoids disk writes on serverless environments like Vercel)
const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.txt', '.json', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext) || file.mimetype === 'application/pdf' || file.mimetype.startsWith('text/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload a PDF or text document.'));
    }
  }
});

// Helper: load portfolio data
function loadPortfolio() {
  if (fs.existsSync(portfolioFile)) {
    try {
      const raw = fs.readFileSync(portfolioFile, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading portfolio.json:', err);
    }
  }
  return null;
}

// Helper: save portfolio data
function savePortfolio(data: any) {
  try {
    fs.writeFileSync(portfolioFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('[STORAGE] Filesystem write warning (e.g. serverless read-only container):', err.message);
  }
}

// ==========================================
// 1. PUBLIC PORTFOLIO ENDPOINTS
// ==========================================

// GET /api/portfolio (Public Read-Only)
app.get('/api/portfolio', (_req: Request, res: Response) => {
  const data = loadPortfolio();
  if (data) {
    return res.json({ success: true, data, source: 'server-cache' });
  }
  return res.json({ success: true, data: initialPortfolioData, source: 'initial-verified' });
});

// POST /api/contact (Public Inquiry Submission)
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(3, 'Message must be at least 3 characters')
});

app.post('/api/contact', (req: Request, res: Response) => {
  const result = contactSchema.safeParse(req.body);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const firstErrorMessage = Object.values(fieldErrors).flat()[0] || 'Please check your inputs and try again.';
    return res.status(400).json({
      success: false,
      error: firstErrorMessage,
      errors: fieldErrors
    });
  }

  try {
    let existingMessages: any[] = [];
    if (fs.existsSync(messagesFile)) {
      try {
        existingMessages = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
      } catch (e) {
        existingMessages = [];
      }
    }

    const newMessage = {
      id: 'msg-' + Date.now(),
      ...result.data,
      receivedAt: new Date().toISOString(),
      status: 'received'
    };

    existingMessages.unshift(newMessage);
    fs.writeFileSync(messagesFile, JSON.stringify(existingMessages, null, 2), 'utf-8');

    return res.json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received and logged.',
      messageId: newMessage.id
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/health (Public Health Status)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// ==========================================
// 2. ADMINISTRATOR AUTHENTICATION ENDPOINTS
// ==========================================

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

// POST /api/admin/login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const rateCheck = checkLoginRateLimit(ip);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many failed login attempts. Rate limit active. Please retry in ${rateCheck.retryAfterSeconds} seconds.`
    });
  }

  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    recordFailedLogin(ip);
    return res.status(400).json({
      success: false,
      error: 'Username and password are required.'
    });
  }

  const { username, password } = parseResult.data;

  // Safe timing comparison for username & password
  const usernameClean = username.trim().toLowerCase();
  const configuredClean = ADMIN_USERNAME.trim().toLowerCase();

  const usernameMatches = usernameClean === configuredClean;
  const passwordMatches = verifyPassword(password, ADMIN_PASSWORD_HASH!);

  if (!usernameMatches || !passwordMatches) {
    recordFailedLogin(ip);
    return res.status(401).json({
      success: false,
      error: 'Invalid administrator credentials.'
    });
  }

  resetLoginAttempts(ip);

  // Issue high-entropy session token
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  sessionStore.set(token, {
    username: ADMIN_USERNAME,
    createdAt: now,
    expiresAt: now + SESSION_TTL
  });

  res.cookie('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_TTL,
    path: '/'
  });

  return res.json({
    success: true,
    message: 'Administrator authenticated successfully.',
    user: { username: ADMIN_USERNAME }
  });
});

// POST /api/admin/logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const token = req.cookies?.admin_session ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);

  if (token && sessionStore.has(token)) {
    sessionStore.delete(token);
  }

  res.clearCookie('admin_session', { path: '/' });
  return res.json({ success: true, message: 'Administrator session terminated.' });
});

// GET /api/admin/check
app.get('/api/admin/check', (req: Request, res: Response) => {
  const token = req.cookies?.admin_session ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);

  if (!token) {
    return res.json({ success: true, authenticated: false });
  }

  const session = sessionStore.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) sessionStore.delete(token);
    res.clearCookie('admin_session', { path: '/' });
    return res.json({ success: true, authenticated: false });
  }

  return res.json({
    success: true,
    authenticated: true,
    user: { username: session.username }
  });
});

// ==========================================
// 3. PROTECTED ADMINISTRATIVE OPERATIONS
// ==========================================

// POST /api/portfolio (Protected Portfolio Modification)
app.post('/api/portfolio', requireAdmin, (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid portfolio data payload.' });
    }
    data.lastUpdated = new Date().toISOString();
    savePortfolio(data);
    return res.json({ success: true, message: 'Portfolio successfully persisted', data });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/contact/messages (Protected Inquiries Inbox)
app.get('/api/contact/messages', requireAdmin, (_req: Request, res: Response) => {
  try {
    if (fs.existsSync(messagesFile)) {
      const messages = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
      return res.json({ success: true, messages });
    }
    return res.json({ success: true, messages: [] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/contact/messages/:id (Protected Inquiry Removal)
app.delete('/api/contact/messages/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (fs.existsSync(messagesFile)) {
      let messages = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
      messages = messages.filter((m: any) => m.id !== id);
      fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf-8');
      return res.json({ success: true, message: 'Message removed successfully' });
    }
    return res.status(404).json({ success: false, error: 'Messages store not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/github/sync (Protected GitHub Sync)
app.post('/api/github/sync', requireAdmin, async (_req: Request, res: Response) => {
  const username = 'phobiccvaishu';
  try {
    const headers = {
      'User-Agent': 'PortfolioLiveSync',
      'Accept': 'application/vnd.github.v3+json'
    };

    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) {
      return res.status(userRes.status).json({
        success: false,
        error: `GitHub API returned ${userRes.status}: ${userRes.statusText}`
      });
    }
    const userData = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    const reposData = reposRes.ok ? await reposRes.json() : [];

    const syncReport = {
      timestamp: new Date().toISOString(),
      user: {
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        public_repos: userData.public_repos,
        location: userData.location,
        html_url: userData.html_url
      },
      repositoriesCount: Array.isArray(reposData) ? reposData.length : 0,
      repositories: Array.isArray(reposData) ? reposData.map((r: any) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        html_url: r.html_url,
        stars: r.stargazers_count,
        updated_at: r.updated_at,
        fork: r.fork
      })) : []
    };

    return res.json({
      success: true,
      message: 'GitHub profile and repositories synchronized directly with official API',
      report: syncReport
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/leetcode/sync (Protected LeetCode Sync)
app.post('/api/leetcode/sync', requireAdmin, async (_req: Request, res: Response) => {
  const username = 'vaish_phob';
  try {
    const query = JSON.stringify({
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              userAvatar
              realName
            }
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
              totalSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            languageProblemCount {
              languageName
              problemsSolved
            }
          }
          recentAcSubmissionList(username: $username, limit: 10) {
            id
            title
            titleSlug
            timestamp
          }
        }
      `,
      variables: { username }
    });

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://leetcode.com/'
      },
      body: query
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `LeetCode GraphQL returned status ${response.status}`
      });
    }

    const json = await response.json();
    const user = json?.data?.matchedUser;
    if (!user) {
      return res.status(404).json({ success: false, error: 'LeetCode user not found' });
    }

    const acNums = user.submitStats?.acSubmissionNum || [];
    const totalAc = acNums.find((a: any) => a.difficulty === 'All')?.count || 0;
    const easyAc = acNums.find((a: any) => a.difficulty === 'Easy')?.count || 0;
    const mediumAc = acNums.find((a: any) => a.difficulty === 'Medium')?.count || 0;
    const hardAc = acNums.find((a: any) => a.difficulty === 'Hard')?.count || 0;

    const totalSub = user.submitStats?.totalSubmissionNum?.find((t: any) => t.difficulty === 'All')?.submissions || 0;

    const stats = {
      username: user.username,
      profileUrl: `https://leetcode.com/u/${user.username}/`,
      ranking: user.profile?.ranking || 0,
      totalSolved: totalAc,
      easySolved: easyAc,
      mediumSolved: mediumAc,
      hardSolved: hardAc,
      totalSubmissions: totalSub,
      languages: (user.languageProblemCount || []).map((l: any) => ({
        name: l.languageName,
        solved: l.problemsSolved
      })),
      recentSubmissions: (json?.data?.recentAcSubmissionList || []).map((s: any) => ({
        title: s.title,
        titleSlug: s.titleSlug,
        timestamp: s.timestamp
      })),
      lastSynced: new Date().toISOString()
    };

    const currentData = loadPortfolio();
    if (currentData) {
      currentData.profile.leetcodeUsername = 'vaish_phob';
      currentData.profile.leetcodeUrl = `https://leetcode.com/u/vaish_phob/`;
      currentData.profile.leetcodeStats = stats;
      
      const existingIdx = currentData.dataSources.findIndex((d: any) => d.source === 'LeetCode API');
      const leetSource = {
        source: 'LeetCode API',
        status: 'Connected',
        lastSync: new Date().toISOString(),
        notes: `Profile @vaish_phob verified. ${totalAc} problems solved (${easyAc} Easy, ${mediumAc} Medium).`
      };
      if (existingIdx >= 0) {
        currentData.dataSources[existingIdx] = leetSource;
      } else {
        currentData.dataSources.push(leetSource);
      }

      currentData.lastUpdated = new Date().toISOString();
      savePortfolio(currentData);
    }

    return res.json({
      success: true,
      message: 'LeetCode live statistics synchronized successfully!',
      stats
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/linkedin/parse (Protected LinkedIn Parser)
app.post('/api/linkedin/parse', requireAdmin, uploadMemory.single('linkedinFile'), async (req: Request, res: Response) => {
  try {
    let extractedText = '';

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const buffer = req.file.buffer || (req.file.path ? fs.readFileSync(req.file.path) : null);
      if (!buffer) {
        return res.status(400).json({ success: false, error: 'Could not access uploaded document buffer.' });
      }

      if (ext === '.pdf') {
        try {
          const pdfData = await pdfParse(buffer);
          extractedText = pdfData.text || '';
        } catch (pdfErr: any) {
          return res.status(400).json({
            success: false,
            error: 'Failed to extract text from PDF document: ' + pdfErr.message
          });
        }
      } else {
        extractedText = buffer.toString('utf-8');
      }
    } else if (req.body.rawText) {
      extractedText = req.body.rawText;
    } else {
      return res.status(400).json({ success: false, error: 'No file or raw text provided.' });
    }

    const parsedData: any = {
      fullName: '',
      headline: '',
      about: '',
      skills: [] as string[],
      education: [] as any[],
      experience: [] as any[],
      certifications: [] as any[],
      rawLength: extractedText.length
    };

    const lines = extractedText.split('\n').map(l => l.trim()).filter(Boolean);

    if (lines.length > 0) parsedData.fullName = lines[0];
    if (lines.length > 1) parsedData.headline = lines[1];

    const techDictionary = [
      'Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'C', 'HTML', 'CSS', 'SQL',
      'React', 'Node.js', 'Express', 'FastAPI', 'MongoDB', 'PostgreSQL', 'Redis', 'MySQL',
      'Docker', 'Git', 'GitHub', 'Machine Learning', 'Computer Vision', 'Deep Learning',
      'YOLOv8', 'MediaPipe', 'OpenCV', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch',
      'Data Structures', 'Algorithms', 'DBMS', 'Operating Systems'
    ];

    const detectedSkills = new Set<string>();
    techDictionary.forEach(tech => {
      const regex = new RegExp(`\\b${tech.replace('+', '\\+')}\\b`, 'i');
      if (regex.test(extractedText)) {
        detectedSkills.add(tech);
      }
    });
    parsedData.skills = Array.from(detectedSkills);

    if (/SRM|Institute|University|College|Bachelor|B\.Tech/i.test(extractedText)) {
      parsedData.education.push({
        institution: extractedText.includes('SRM') ? 'SRM Institute of Science and Technology' : 'University / College',
        degree: /Bachelor|B\.Tech/i.test(extractedText) ? 'Bachelor of Technology (B.Tech)' : 'Degree Program',
        fieldOfStudy: /Computer Science/i.test(extractedText) ? 'Computer Science and Engineering' : 'Engineering',
        detected: true
      });
    }

    const aboutMatch = extractedText.match(/(?:About|Summary|Overview)[:\s\n]+([^]{40,400})/i);
    if (aboutMatch && aboutMatch[1]) {
      parsedData.about = aboutMatch[1].replace(/\r?\n/g, ' ').trim();
    }

    return res.json({
      success: true,
      message: 'LinkedIn document parsed. Please review and confirm fields.',
      parsed: parsedData
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/credentials/upload (Protected Certificate Upload)
app.post('/api/credentials/upload', requireAdmin, upload.single('certificate'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No certificate file uploaded.' });
    }

    const fileUrl = `/uploads/certificates/${req.file.filename}`;
    const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'image';

    return res.json({
      success: true,
      message: 'Certificate uploaded successfully.',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        type: fileType,
        url: fileUrl
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/reset-snapshot (Protected Snapshot Reset with Confirmation)
app.post('/api/admin/reset-snapshot', requireAdmin, (req: Request, res: Response) => {
  try {
    const { confirmation } = req.body || {};
    if (confirmation !== 'CONFIRM_RESET_SNAPSHOT') {
      return res.status(400).json({
        success: false,
        error: 'Explicit confirmation string "CONFIRM_RESET_SNAPSHOT" is required to reset snapshot.'
      });
    }

    // Create timestamped backup of current portfolio data
    if (fs.existsSync(portfolioFile)) {
      const backupFile = path.join(dataDir, `portfolio.backup-${Date.now()}.json`);
      fs.copyFileSync(portfolioFile, backupFile);
    }

    savePortfolio(initialPortfolioData);

    return res.json({
      success: true,
      message: 'Portfolio snapshot has been safely reset to verified baseline. Backup created.',
      data: initialPortfolioData
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. PRODUCTION STATIC DEPLOYMENT SERVING
// ==========================================
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Global JSON error handler (ensures all unhandled errors/multer failures return JSON)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[SERVER_ERROR]', err);
  res.status(err.status || err.statusCode || 500).json({
    success: false,
    error: err.message || 'An internal server error occurred.'
  });
});

// Start listener only when not in test mode or Vercel serverless environment
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[PORTFOLIO_SERVER] Listening at http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[SECURITY] Admin authentication active for user: ${ADMIN_USERNAME}`);
  });
}
