import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import admissionRoutes from './routes/admission.js';
import adminRoutes from './routes/admin.js';
import courseRoutes from './routes/courses.js';
import storiesRoutes from './routes/stories.js';
import studentRoutes from './routes/student.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors());

// Increase body parser limits for file uploads and large payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads'), {
  maxAge: '1d',
  etag: true,
  fallthrough: false
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// API Routes
app.use('/api', admissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', courseRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/student', studentRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║   🏆 DSM Outsourcing & Computer Training Center  ║
  ║   Server running on http://localhost:${PORT}        ║
  ║   Database: SQLite (dsm_new.db)                      ║
  ║   Excel:    dsm_students.xlsx                    ║
  ╚══════════════════════════════════════════════════╝
  `);
});
