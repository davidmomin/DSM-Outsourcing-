import { Router, Request, Response } from 'express';
import { verifyAdmin, getStudents, getStats, deleteStudent, updateStudent, getExcelPath, getSQLitePath, importFromExcel } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';
import fs from 'fs';

const router = Router();
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = isProduction 
  ? (process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET required in production'); })())
  : (process.env.JWT_SECRET || 'dev_fallback_secret_2026');

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const admin = await verifyAdmin(username);
    if (admin && await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected Routes
router.use(authenticateToken as any);

// Get students with pagination
router.get('/students', async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 1000;
  
  const result = await getStudents(search, page, limit);
  res.json(result);
});

// Get stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err: any) {
    console.error('Stats fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Delete student (soft delete)
router.delete('/students/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const studentId = parseInt(id as string, 10);

    if (isNaN(studentId)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const deleted = await deleteStudent(studentId);
    if (deleted) {
      res.json({ success: true, message: 'Student record deleted' });
    } else {
      res.status(404).json({ error: 'Student not found or already deleted' });
    }
  } catch (err: any) {
    console.error('Delete student error:', err);
    res.status(500).json({ error: 'Failed to delete student record' });
  }
});

// Update student (payment status, notes)
router.put('/students/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { payment_status, notes } = req.body;
    const studentId = parseInt(id as string, 10);

    if (isNaN(studentId)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    await updateStudent(studentId, { payment_status, notes });
    res.json({ success: true, message: 'Student record updated' });
  } catch (err: any) {
    console.error('Update student error:', err);
    res.status(500).json({ error: 'Failed to update student record' });
  }
});

// Export XLSX
router.get('/export/students', async (_req: Request, res: Response) => {
  const xlsxPath = getExcelPath();
  res.download(xlsxPath, 'dsm_students.xlsx');
});

import multer from 'multer';
import path from 'path';

// Multer setup for file uploads
const adminUploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(adminUploadDir)) {
  fs.mkdirSync(adminUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, adminUploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for Excel imports
});

// Multer error handler middleware for admin routes
const handleAdminMulterError = (err: any, _req: Request, _res: Response, next: any) => {
  if (err) {
    console.error('Multer error:', err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return _res.status(413).json({ error: 'File too large. Maximum size is 10MB' });
    }
  }
  next();
};

// Import XLSX
router.post('/import/students', upload.single('file'), handleAdminMulterError, async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const result = await importFromExcel(req.file.path);
    // Optionally delete the file after import
    fs.unlinkSync(req.file.path);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Backup SQLite
router.get('/backup', async (_req: Request, res: Response) => {
  const dbPath = getSQLitePath();
  if (fs.existsSync(dbPath)) {
    res.download(dbPath, `dsm_backup_${new Date().toISOString().split('T')[0]}.db`);
  } else {
    res.status(404).json({ error: 'No SQLite database found' });
  }
});

export default router;
