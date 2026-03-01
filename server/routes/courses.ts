import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'courses');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'course-' + uniqueSuffix + ext);
  }
});

// Multer error handler middleware
const handleMulterError = (err: any, _req: Request, _res: Response, next: any) => {
  if (err) {
    console.error('Multer error:', err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return _res.status(413).json({ error: 'File too large. Maximum size is 10MB' });
    }
    if (err.message === 'Only image files are allowed!') {
      return _res.status(400).json({ error: 'Only image files are allowed!' });
    }
  }
  next();
};

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit - increased from 5MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Public: Fetch all courses
router.get('/courses', async (_req: Request, res: Response) => {
    try {
        const courses = await getCourses();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// Admin: Upload course icon image (protected)
router.post('/courses/upload', authenticateToken as any, upload.single('icon'), handleMulterError, async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const imageUrl = `/uploads/courses/${req.file.filename}`;
        res.json({ success: true, url: imageUrl });
    } catch (err: any) {
        console.error('Upload error:', err.message);
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(413).json({ error: 'File too large. Maximum size is 10MB' });
        } else {
            res.status(500).json({ error: err.message || 'Failed to upload image' });
        }
    }
});

// Admin: Add new course (protected)
router.post('/courses', authenticateToken as any, async (req: Request, res: Response) => {
    try {
        const { name, duration, fee, description, ai_insight, icon } = req.body;
        if (!name || !duration || !fee) {
            res.status(400).json({ error: 'Name, duration, and fee are required' });
            return;
        }
        const id = await addCourse({ name, duration, fee, description, ai_insight, icon });
        res.status(201).json({ success: true, id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create course' });
    }
});

// Admin: Update course (protected)
router.put('/courses/:id', authenticateToken as any, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, duration, fee, description, ai_insight, icon } = req.body;
        await updateCourse(parseInt(id as string, 10), { name, duration, fee, description, ai_insight, icon });
        res.json({ success: true, message: 'Course updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update course' });
    }
});

// Admin: Delete course (protected)
router.delete('/courses/:id', authenticateToken as any, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteCourse(parseInt(id as string, 10));
        res.json({ success: true, message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete course' });
    }
});

export default router;
