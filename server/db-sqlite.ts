import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path
const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'dsm-outsourcing.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Create database connection
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize database tables
export function initializeDatabase() {
  // Students table
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      email TEXT,
      course_name TEXT NOT NULL,
      transaction_id TEXT NOT NULL,
      reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      payment_status TEXT DEFAULT 'Pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Courses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      duration TEXT NOT NULL,
      fee TEXT NOT NULL,
      icon TEXT DEFAULT '📚',
      modules TEXT, -- JSON array
      ai_insight TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Success stories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS success_stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      course TEXT NOT NULL,
      story TEXT NOT NULL,
      avatar TEXT DEFAULT '👤',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admin users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert sample admin user (password: admin123)
  const adminExists = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  if (adminExists.count === 0) {
    db.prepare(`
      INSERT INTO admin_users (email, password_hash, name, role)
      VALUES (?, ?, ?, ?)
    `).run(
      'admin@dsm.com',
      '$2a$10$YourHashHere', // In production, use proper bcrypt hashing
      'Administrator',
      'admin'
    );
  }

  // Insert sample courses if none exist
  const coursesExist = db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number };
  if (coursesExist.count === 0) {
    const sampleCourses = [
      {
        name: 'Web Development',
        description: 'Learn modern web development with HTML, CSS, JavaScript, React, and Node.js. Build real-world projects and deploy them.',
        duration: '6 Months',
        fee: '৳15,000',
        icon: '💻',
        modules: JSON.stringify(['HTML & CSS', 'JavaScript', 'React.js', 'Node.js', 'Database', 'Deployment']),
        ai_insight: 'Web developers are in high demand with salaries increasing 15% annually.'
      },
      {
        name: 'Graphic Design',
        description: 'Master Adobe Photoshop, Illustrator, and design principles. Create stunning visuals for print and digital media.',
        duration: '4 Months',
        fee: '৳12,000',
        icon: '🎨',
        modules: JSON.stringify(['Design Principles', 'Photoshop', 'Illustrator', 'Branding', 'Portfolio']),
        ai_insight: 'Graphic design industry is growing rapidly with remote work opportunities.'
      },
      {
        name: 'Digital Marketing',
        description: 'Learn SEO, social media marketing, content strategy, and analytics. Drive growth for businesses online.',
        duration: '3 Months',
        fee: '৳10,000',
        icon: '📱',
        modules: JSON.stringify(['SEO', 'Social Media', 'Content Strategy', 'Analytics', 'Ads']),
        ai_insight: 'Digital marketing roles have grown 30% in the last year alone.'
      },
      {
        name: 'Office Application',
        description: 'Comprehensive Microsoft Office training including Word, Excel, PowerPoint for professional environments.',
        duration: '2 Months',
        fee: '৳5,000',
        icon: '📊',
        modules: JSON.stringify(['MS Word', 'MS Excel', 'MS PowerPoint', 'Data Entry']),
        ai_insight: 'Office skills are essential for 90% of administrative positions.'
      }
    ];

    const insertCourse = db.prepare(`
      INSERT INTO courses (name, description, duration, fee, icon, modules, ai_insight)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    sampleCourses.forEach(course => {
      insertCourse.run(
        course.name,
        course.description,
        course.duration,
        course.fee,
        course.icon,
        course.modules,
        course.ai_insight
      );
    });
  }

  // Insert sample success stories if none exist
  const storiesExist = db.prepare('SELECT COUNT(*) as count FROM success_stories').get() as { count: number };
  if (storiesExist.count === 0) {
    const sampleStories = [
      {
        name: 'Rahim Khan',
        course: 'Web Development',
        story: 'After completing the course, I got a job as a frontend developer at a reputed IT company. The hands-on projects really prepared me for real-world challenges.',
        avatar: '👨‍💻'
      },
      {
        name: 'Fatima Begum',
        course: 'Graphic Design',
        story: 'I started my own freelance design business after this course. Now I work with clients from all over the world from my home in Bangladesh.',
        avatar: '👩‍🎨'
      }
    ];

    const insertStory = db.prepare(`
      INSERT INTO success_stories (name, course, story, avatar)
      VALUES (?, ?, ?, ?)
    `);

    sampleStories.forEach(story => {
      insertStory.run(story.name, story.course, story.story, story.avatar);
    });
  }

  console.log('✅ SQLite database initialized successfully');
  console.log(`📁 Database location: ${DB_PATH}`);
}

// Database helper functions
export const sqliteDB = {
  // Students
  getAllStudents: (search?: string, limit: number = 10, offset: number = 0) => {
    let query = 'SELECT * FROM students';
    const params: any[] = [];
    
    if (search) {
      query += ' WHERE student_name LIKE ? OR phone_number LIKE ? OR email LIKE ?';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY reg_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    return db.prepare(query).all(...params);
  },

  getStudentsCount: (search?: string) => {
    let query = 'SELECT COUNT(*) as count FROM students';
    const params: any[] = [];
    
    if (search) {
      query += ' WHERE student_name LIKE ? OR phone_number LIKE ? OR email LIKE ?';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    return db.prepare(query).get(...params) as { count: number };
  },

  getStudentByPhoneAndTransaction: (phone: string, transactionId: string) => {
    return db.prepare(
      'SELECT * FROM students WHERE phone_number = ? AND transaction_id = ?'
    ).get(phone, transactionId);
  },

  createStudent: (student: any) => {
    const result = db.prepare(`
      INSERT INTO students (student_name, phone_number, email, course_name, transaction_id, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      student.student_name,
      student.phone_number,
      student.email,
      student.course_name,
      student.transaction_id,
      student.notes || null
    );
    return result.lastInsertRowid;
  },

  updateStudent: (id: number, updates: any) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    db.prepare(`UPDATE students SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values);
    return true;
  },

  deleteStudent: (id: number) => {
    db.prepare('DELETE FROM students WHERE id = ?').run(id);
    return true;
  },

  // Courses
  getAllCourses: () => {
    const courses = db.prepare('SELECT * FROM courses').all();
    return courses.map((course: any) => ({
      ...course,
      modules: JSON.parse(course.modules || '[]')
    }));
  },

  getCourseById: (id: number) => {
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
    if (course) {
      return {
        ...course,
        modules: JSON.parse((course as any).modules || '[]')
      };
    }
    return null;
  },

  createCourse: (course: any) => {
    const result = db.prepare(`
      INSERT INTO courses (name, description, duration, fee, icon, modules, ai_insight)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      course.name,
      course.description,
      course.duration,
      course.fee,
      course.icon || '📚',
      JSON.stringify(course.modules || []),
      course.ai_insight || null
    );
    return result.lastInsertRowid;
  },

  updateCourse: (id: number, updates: any) => {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (key === 'modules') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    values.push(id);
    db.prepare(`UPDATE courses SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values);
    return true;
  },

  deleteCourse: (id: number) => {
    db.prepare('DELETE FROM courses WHERE id = ?').run(id);
    return true;
  },

  // Success Stories
  getAllSuccessStories: () => {
    return db.prepare('SELECT * FROM success_stories ORDER BY created_at DESC').all();
  },

  createSuccessStory: (story: any) => {
    const result = db.prepare(`
      INSERT INTO success_stories (name, course, story, avatar)
      VALUES (?, ?, ?, ?)
    `).run(story.name, story.course, story.story, story.avatar || '👤');
    return result.lastInsertRowid;
  },

  updateSuccessStory: (id: number, updates: any) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    db.prepare(`UPDATE success_stories SET ${fields} WHERE id = ?`).run(...values);
    return true;
  },

  deleteSuccessStory: (id: number) => {
    db.prepare('DELETE FROM success_stories WHERE id = ?').run(id);
    return true;
  },

  // Stats
  getStats: () => {
    const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };
    const todayAdmissions = db.prepare(`
      SELECT COUNT(*) as count FROM students 
      WHERE date(reg_date) = date('now')
    `).get() as { count: number };
    
    const courseDistribution = db.prepare(`
      SELECT course_name, COUNT(*) as count 
      FROM students 
      GROUP BY course_name
    `).all();

    const weeklyTrend = db.prepare(`
      SELECT date(reg_date) as date, COUNT(*) as count 
      FROM students 
      WHERE reg_date >= date('now', '-7 days')
      GROUP BY date(reg_date)
      ORDER BY date
    `).all();

    return {
      totalStudents: totalStudents.count,
      todayAdmissions: todayAdmissions.count,
      courseDistribution,
      weeklyTrend
    };
  },

  // Admin
  getAdminByEmail: (email: string) => {
    return db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email);
  }
};

export default db;
