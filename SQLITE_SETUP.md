# SQLite Database Setup Guide

## Overview
This project now uses **SQLite** for local development, making it easy to run the full website without setting up a MySQL database.

## Features
- ✅ Zero configuration - works out of the box
- ✅ Automatic database initialization
- ✅ Sample data included
- ✅ File-based storage (data persists in `data/dsm-outsourcing.db`)
- ✅ Fast performance with WAL mode

## Installation

### 1. Install Dependencies
```bash
npm install
```

This will install `better-sqlite3` and its types.

### 2. Start the Server
```bash
npm run dev
```

The SQLite database will be automatically:
- Created in `data/dsm-outsourcing.db`
- Initialized with tables
- Populated with sample courses and success stories

### 3. Access the Database
The database file is located at:
```
data/dsm-outsourcing.db
```

You can view/edit it using:
- [DB Browser for SQLite](https://sqlitebrowser.org/) (GUI)
- VS Code SQLite extension
- Command line: `sqlite3 data/dsm-outsourcing.db`

## Default Data

### Sample Courses
1. **Web Development** - 6 months, ৳15,000
2. **Graphic Design** - 4 months, ৳12,000
3. **Digital Marketing** - 3 months, ৳10,000
4. **Office Application** - 2 months, ৳5,000

### Sample Admin
- Email: `admin@dsm.com`
- Password: (set in database - update as needed)

### Sample Success Stories
Pre-loaded student testimonials for display.

## Database Schema

### Tables

#### students
- `id` (INTEGER PRIMARY KEY)
- `student_name` (TEXT)
- `phone_number` (TEXT)
- `email` (TEXT)
- `course_name` (TEXT)
- `transaction_id` (TEXT)
- `payment_status` (TEXT)
- `reg_date` (DATETIME)
- `notes` (TEXT)

#### courses
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT UNIQUE)
- `description` (TEXT)
- `duration` (TEXT)
- `fee` (TEXT)
- `icon` (TEXT)
- `modules` (TEXT - JSON array)
- `ai_insight` (TEXT)

#### success_stories
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `course` (TEXT)
- `story` (TEXT)
- `avatar` (TEXT)

#### admin_users
- `id` (INTEGER PRIMARY KEY)
- `email` (TEXT UNIQUE)
- `password_hash` (TEXT)
- `name` (TEXT)
- `role` (TEXT)

## API Endpoints

All API endpoints work as before:

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Add new course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Students/Admission
- `POST /api/admission` - Submit admission
- `GET /api/student/login` - Student login
- `GET /api/students` - Get all students (admin)

### Success Stories
- `GET /api/stories` - Get all stories
- `POST /api/stories` - Add story (admin)

### Stats
- `GET /api/admin/stats` - Get dashboard stats

## Reset Database

To reset the database and start fresh:

```bash
# Delete the database file
rm data/dsm-outsourcing.db

# Restart the server - it will recreate with sample data
npm run dev
```

## Switching to MySQL (Production)

To switch back to MySQL for production:

1. Update `server/db.ts` to use MySQL connection
2. Set environment variables in `.env`:
   ```
   DB_HOST=your-host
   DB_USER=your-user
   DB_PASSWORD=your-password
   DB_NAME=your-database
   ```
3. Run migrations to create tables in MySQL

## Troubleshooting

### better-sqlite3 installation fails
On Windows, you may need:
```bash
npm install --global windows-build-tools
```

Or use:
```bash
npm install better-sqlite3 --build-from-source
```

### Database is locked
- Ensure only one instance of the server is running
- Check that the `data/` directory is writable

### Data not persisting
- Make sure the `data/` directory exists
- Check file permissions
- Database is stored in `data/dsm-outsourcing.db`

## Benefits of SQLite for Local Development

1. **No Setup Required** - Works immediately after `npm install`
2. **Portable** - Single file database, easy to backup/restore
3. **Fast** - No network overhead, direct file access
4. **Reliable** - Battle-tested, used by millions of applications
5. **Development Friendly** - Easy to inspect and modify data

## Production Deployment

For production, consider:
- MySQL or PostgreSQL for high concurrency
- Regular database backups
- Connection pooling
- Read replicas for scaling

SQLite is perfect for:
- Local development
- Small to medium applications
- Single-user scenarios
- Prototyping and testing
