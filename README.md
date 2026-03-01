# DSM Outsourcing & Computer Training Center

A modern, responsive web application for a computer training center with admin dashboard, student portal, course management, and admission system.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.2.0-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.3.3-3178C6.svg)
![Tailwind](https://img.shields.io/badge/tailwind-4.0.0-06B6D4.svg)
![SQLite](https://img.shields.io/badge/sqlite-local-003B57.svg)

## ✨ Features

### For Students
- 🎓 Browse professional courses with detailed information
- 📝 Online admission form with validation
- 👤 Student dashboard to view admission status
- 📱 Mobile-friendly responsive design

### For Admins
- 📊 Dashboard with statistics and charts
- 👥 Student management (CRUD operations)
- 📚 Course management with icons and modules
- ⭐ Success stories management
- 🔐 Secure authentication with Supabase

### Technical Features
- ⚡ Built with React 18 + TypeScript + Vite
- 🎨 Tailwind CSS with custom gold theme
- 🗄️ SQLite database for local development
- 🔒 Supabase authentication
- 🎯 Custom SVG icons (no external icon library)
- 🌊 Animated CSS backgrounds (no images)
- 📱 Fully responsive (mobile, tablet, desktop)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download the project**
```bash
cd DSM-Outsourcing
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3001
```

The application will automatically:
- Initialize SQLite database
- Create necessary tables
- Load sample data (courses, success stories)

## 🗄️ Database (SQLite)

The project uses SQLite for zero-configuration local development.

### Database Location
```
data/dsm-outsourcing.db
```

### Default Data Included

**Courses:**
- Web Development (6 months, ৳15,000)
- Graphic Design (4 months, ৳12,000)
- Digital Marketing (3 months, ৳10,000)
- Office Application (2 months, ৳5,000)

**Admin Login:**
- Email: `admin@dsm.com`
- Password: Set during first run or via database

### Reset Database
```bash
# Delete database file
rm data/dsm-outsourcing.db

# Restart server - database will be recreated
npm run dev
```

## 📁 Project Structure

```
DSM-Outsourcing/
├── data/                          # SQLite database
│   └── dsm-outsourcing.db
├── server/                        # Backend API
│   ├── db-sqlite.ts              # Database implementation
│   ├── db.ts                     # Database exports
│   ├── index.ts                  # Server entry
│   ├── middleware/
│   │   └── auth.ts               # Auth middleware
│   └── routes/
│       ├── admin.ts              # Admin routes
│       ├── admission.ts          # Admission routes
│       ├── courses.ts            # Course routes
│       ├── stories.ts            # Success stories
│       └── student.ts            # Student routes
├── src/
│   ├── components/               # React components
│   │   ├── icons/index.tsx       # 40+ SVG icons
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── AdmissionForm.tsx
│   │   ├── AnimatedBackground.tsx
│   │   ├── Courses.tsx
│   │   ├── Hero.tsx
│   │   ├── MatrixBackground.tsx
│   │   └── ...
│   ├── lib/                      # Utilities
│   │   ├── api.ts                # API client
│   │   ├── auth.tsx              # Auth context
│   │   ├── supabase.ts           # Supabase config
│   │   └── theme.tsx             # Theme provider
│   ├── pages/                    # Page components
│   │   ├── Admin.tsx
│   │   ├── Home.tsx
│   │   ├── UserDashboard.tsx
│   │   └── ...
│   ├── types/                    # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css                 # Styles + animations
│   └── main.tsx
├── .env                          # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Supabase Configuration (optional for local dev)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Supabase Setup (Optional)

For production authentication:

1. Create project at [supabase.com](https://supabase.com)
2. Enable Email provider in Auth settings
3. Add URL and anon key to `.env`
4. Create admin user in Supabase dashboard

Without Supabase, the app uses local fallback authentication for development.

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  gold: {
    500: '#d4af37',  // Primary gold
    600: '#b8860b',  // Dark gold
  }
}
```

### Adding New Courses
Edit `server/db-sqlite.ts` in the `initializeDatabase()` function.

### Icons
All icons are custom SVG in `src/components/icons/index.tsx`.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 641px - 1024px
- **Desktop**: > 1024px

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: SQLite (better-sqlite3)
- **Auth**: Supabase (with local fallback)
- **Icons**: Custom SVG
- **Animations**: CSS + Framer Motion

## 📄 API Endpoints

### Public
- `GET /api/courses` - List all courses
- `GET /api/stories` - Get success stories
- `POST /api/admission` - Submit admission
- `POST /api/student/login` - Student login

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/students` - List students
- `POST /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student
- `POST /api/courses` - Add course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

## 🔒 Authentication

The app supports two authentication modes:

1. **Supabase Auth** (Production) - Email/password with JWT
2. **Local Fallback** (Development) - Simple token-based for testing

## 🎯 Key Features Explained

### Matrix Background
Animated falling characters effect (gold color scheme) using HTML5 Canvas.

### Custom SVG Icons
40+ hand-crafted SVG icons replacing external libraries for better performance.

### Animated Backgrounds
4 variants: gradient orbs, floating particles, grid pattern, animated waves.

### Mobile-First Design
Fully responsive with touch-friendly targets (44px minimum).

## 🐛 Troubleshooting

### better-sqlite3 installation fails
```bash
npm install --global windows-build-tools
# or
npm install better-sqlite3 --build-from-source
```

### Port already in use
Change PORT in `.env` or kill existing process:
```bash
npx kill-port 3001
```

### Database locked
Ensure only one server instance is running.

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

- Built with ❤️ for DSM Outsourcing & Computer Training Center
- Gold theme inspired by luxury branding
- Matrix effect inspired by The Matrix (but in gold!)

---

**Happy Coding!** 🚀
