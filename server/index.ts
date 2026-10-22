import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure directories exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
const certificatesDir = path.join(uploadsDir, 'certificates');

[dataDir, uploadsDir, certificatesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const portfolioFile = path.join(dataDir, 'portfolio.json');
const messagesFile = path.join(dataDir, 'messages.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

// Multer storage for certificates and LinkedIn PDF
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
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitized}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
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
  fs.writeFileSync(portfolioFile, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/portfolio
app.get('/api/portfolio', (_req: Request, res: Response) => {
  const data = loadPortfolio();
  if (data) {
    return res.json({ success: true, data, source: 'server-cache' });
  }
  return res.json({ success: true, data: null, source: 'fallback-initial' });
});

// POST /api/portfolio
app.post('/api/portfolio', (req: Request, res: Response) => {
  try {
    const data = req.body;
    data.lastUpdated = new Date().toISOString();
    savePortfolio(data);
    return res.json({ success: true, message: 'Portfolio successfully persisted', data });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/github/sync
app.post('/api/github/sync', async (_req: Request, res: Response) => {
  const username = 'phobiccvaishu';
  try {
    const headers = {
      'User-Agent': 'PortfolioLiveSync',
      'Accept': 'application/vnd.github.v3+json'
    };

    // Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) {
      return res.status(userRes.status).json({
        success: false,
        error: `GitHub API returned ${userRes.status}: ${userRes.statusText}`
      });
    }
    const userData = await userRes.json();

    // Fetch repositories
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

// POST /api/leetcode/sync - Synchronize live LeetCode stats for vaish_phob
app.post('/api/leetcode/sync', async (_req: Request, res: Response) => {
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

    // Update in-memory / file cache if exists
    const currentData = loadPortfolio();
    if (currentData) {
      currentData.profile.leetcodeUsername = 'vaish_phob';
      currentData.profile.leetcodeUrl = `https://leetcode.com/u/vaish_phob/`;
      currentData.profile.leetcodeStats = stats;
      
      // Update data source status
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

// POST /api/linkedin/parse - Parses uploaded LinkedIn PDF or pasted text
app.post('/api/linkedin/parse', upload.single('linkedinFile'), async (req: Request, res: Response) => {
  try {
    let extractedText = '';

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext === '.pdf') {
        const fileBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(fileBuffer);
        extractedText = pdfData.text || '';
      } else {
        // Plain text or json/csv file
        extractedText = fs.readFileSync(req.file.path, 'utf-8');
      }
    } else if (req.body.rawText) {
      extractedText = req.body.rawText;
    } else {
      return res.status(400).json({ success: false, error: 'No file or raw text provided.' });
    }

    // Heuristic extraction for LinkedIn profiles
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

    // Look for name / headline in top lines
    if (lines.length > 0) {
      parsedData.fullName = lines[0];
    }
    if (lines.length > 1) {
      parsedData.headline = lines[1];
    }

    // Extract potential skills (words matching programming terms)
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

    // Extract education keywords
    if (/SRM|Institute|University|College|Bachelor|B\.Tech/i.test(extractedText)) {
      parsedData.education.push({
        institution: extractedText.includes('SRM') ? 'SRM Institute of Science and Technology' : 'University / College',
        degree: /Bachelor|B\.Tech/i.test(extractedText) ? 'Bachelor of Technology (B.Tech)' : 'Degree Program',
        fieldOfStudy: /Computer Science/i.test(extractedText) ? 'Computer Science and Engineering' : 'Engineering',
        detected: true
      });
    }

    // Extract potential summary/about paragraph
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

// POST /api/credentials/upload - Upload a certificate (PDF, PNG, JPG)
app.post('/api/credentials/upload', upload.single('certificate'), (req: Request, res: Response) => {
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

// POST /api/contact - Validates and securely logs contact messages
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

app.post('/api/contact', (req: Request, res: Response) => {
  const result = contactSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.flatten().fieldErrors
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

// GET /api/contact/messages - Fetch all received inquiries
app.get('/api/contact/messages', (_req: Request, res: Response) => {
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

// DELETE /api/contact/messages/:id - Delete an inquiry
app.delete('/api/contact/messages/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (fs.existsSync(messagesFile)) {
      let messages = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
      messages = messages.filter((m: any) => m.id !== id);
      fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf-8');
      return res.json({ success: true, message: 'Message removed successfully' });
    }
    return res.status(404).json({ success: false, error: 'Messages file not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio API Server listening at http://localhost:${PORT}`);
});
