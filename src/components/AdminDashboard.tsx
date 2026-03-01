import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UsersIcon, UserPlusIcon, BookOpenIcon, TrendingUpIcon, SearchIcon, Trash2Icon,
  DownloadIcon, PrinterIcon, LogOutIcon, RefreshCwIcon, GraduationCapIcon,
  XIcon, BarChart3Icon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, Edit2Icon, StarIcon
} from './icons';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { Student, DashboardStats } from '../types';

interface Props {
  onLogout: () => void;
}

// Types for success stories
interface SuccessStory {
  id: number;
  name: string;
  course: string;
  story: string;
  avatar?: string;
  created_at?: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard({ onLogout }: Props) {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'courses' | 'stories'>('overview');
  const [courses, setCourses] = useState<any[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  
  // Course form state
  const [courseForm, setCourseForm] = useState<{ name: string; duration: string; fee: string; description: string; ai_insight: string; icon: string; modules: string; iconFile?: File; iconPreview?: string }>({ name: '', duration: '', fee: '', description: '', ai_insight: '', icon: '', modules: '' });
  
  // Story form state
  const [storyForm, setStoryForm] = useState<{ name: string; course: string; story: string; avatar: string }>({ name: '', course: '', story: '', avatar: '' });

  // Load stats data
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const statsData = await api.getStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to load stats:', err);
      if (err.message === 'Unauthorized' || err.message === 'Session expired') {
        toast.error('Session expired');
        handleLogout();
      }
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Load students data with pagination
  const loadStudents = useCallback(async (page: number = 1) => {
    setStudentsLoading(true);
    try {
      const response = await api.getStudents(search || undefined, page, ITEMS_PER_PAGE);
      setStudents(response.data || []);
      setTotalStudents(response.total || 0);
      setCurrentPage(page);
    } catch (err: any) {
      console.error('Failed to load students:', err);
      if (err.message === 'Unauthorized' || err.message === 'Session expired') {
        toast.error('Session expired');
        handleLogout();
      } else {
        toast.error('Failed to load students');
      }
    } finally {
      setStudentsLoading(false);
    }
  }, [search]);

  // Load courses
  const loadCourses = useCallback(async () => {
    try {
      const coursesData = await api.getCourses();
      setCourses(coursesData);
    } catch (err: any) {
      console.error('Failed to load courses:', err);
    }
  }, []);

  // Load success stories
  const loadStories = useCallback(async () => {
    try {
      const storiesData = await api.getSuccessStories();
      setStories(storiesData);
    } catch (err: any) {
      console.error('Failed to load stories:', err);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadStats(),
          loadCourses(),
          loadStories(),
          loadStudents(1)
        ]);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  // Reload students when search changes
  useEffect(() => {
    loadStudents(1);
  }, [search, loadStudents]);

  const handleDelete = async (id: number) => {
    try {
      await api.deleteStudent(id);
      toast.success('Student record deleted');
      setDeleteConfirm(null);
      loadStudents(currentPage);
      loadStats();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      await api.updateStudent(editingStudent.id, {
        payment_status: editingStudent.payment_status,
        notes: editingStudent.notes,
      });
      toast.success('Student updated');
      setEditingStudent(null);
      loadStudents(currentPage);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await api.updateCourse(editingCourse.id, {
          ...courseForm,
          modules: courseForm.modules.split('\n').filter(m => m.trim()),
        });
        toast.success('Course updated');
      } else {
        await api.addCourse({
          ...courseForm,
          modules: courseForm.modules.split('\n').filter(m => m.trim()),
        });
        toast.success('Course added');
      }
      setEditingCourse(null);
      setIsCreatingCourse(false);
      setCourseForm({ name: '', duration: '', fee: '', description: '', ai_insight: '', icon: '', modules: '' });
      loadCourses();
      loadStats();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.deleteCourse(id);
      toast.success('Course deleted');
      loadCourses();
      loadStats();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStory) {
        await api.updateSuccessStory(editingStory.id, storyForm);
        toast.success('Story updated');
      } else {
        await api.createSuccessStory(storyForm);
        toast.success('Story added');
      }
      setEditingStory(null);
      setIsCreatingStory(false);
      setStoryForm({ name: '', course: '', story: '', avatar: '' });
      loadStories();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteStory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      await api.deleteSuccessStory(id);
      toast.success('Story deleted');
      loadStories();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/admin');
  };

  const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <RefreshCwIcon className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-gold-500/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center">
                <GraduationCapIcon className="w-6 h-6 text-dark-900" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold gold-text">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">DSM Outsourcing & Training</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                View Website
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOutIcon className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading ? (
            <div className="col-span-4 text-center py-8">
              <RefreshCwIcon className="w-6 h-6 text-gold-500 animate-spin mx-auto" />
            </div>
          ) : (
            <>
              {[
                { icon: UsersIcon, label: 'Total Students', value: stats?.totalStudents ?? '—', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { icon: UserPlusIcon, label: "Today's Admissions", value: stats?.todayAdmissions ?? '—', color: 'text-green-400', bg: 'bg-green-500/10' },
                { icon: BookOpenIcon, label: 'Active Courses', value: stats?.courseDistribution?.length ?? '—', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { icon: TrendingUpIcon, label: 'This Week', value: stats?.weeklyTrend?.reduce((s, d) => s + d.count, 0) ?? '—', color: 'text-gold-400', bg: 'bg-gold-500/10' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 sm:p-6"
                >
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gold-500/20 pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3Icon },
            { id: 'students', label: 'Students', icon: UsersIcon },
            { id: 'courses', label: 'Courses', icon: BookOpenIcon },
            { id: 'stories', label: 'Stories', icon: StarIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-gold-500/20 text-gold-400'
                  : 'text-gray-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly Trend Chart */}
              <div className="glass-card p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUpIcon className="w-5 h-5 text-gold-500" />
                  <h3 className="text-lg font-semibold text-white">Weekly Admissions</h3>
                </div>
                {stats?.weeklyTrend && stats.weeklyTrend.length > 0 ? (
                  <div className="h-48 flex items-end gap-2">
                    {(() => {
                      const maxVal = Math.max(...stats.weeklyTrend.map((t: any) => t.count));
                      return stats.weeklyTrend.map((day: any, i: number) => {
                        const heightPct = maxVal > 0 ? (day.count / maxVal) * 100 : 0;
                        return (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(heightPct, 5)}%` }}
                            transition={{ delay: i * 0.1 }}
                            className="flex-1 bg-gold-500/30 hover:bg-gold-500/50 rounded-t transition-colors relative group"
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {day.count} on {new Date(day.date).toLocaleDateString()}
                            </div>
                          </motion.div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No data available</p>
                )}
              </div>

              {/* Course Distribution */}
              <div className="glass-card p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpenIcon className="w-5 h-5 text-gold-500" />
                  <h3 className="text-lg font-semibold text-white">Course Distribution</h3>
                </div>
                <div className="space-y-3">
                  {stats?.courseDistribution?.map((course: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{course.course_name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-dark-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(course.count / (stats?.totalStudents || 1)) * 100}%` }}
                            className="h-full bg-gold-500"
                          />
                        </div>
                        <span className="text-sm text-gold-400 w-8">{course.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={async () => {
                      try {
                        await api.downloadExcel();
                        toast.success('Excel downloaded');
                      } catch (err: any) {
                        toast.error(err.message);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-gray-300 transition-colors"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Excel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await api.downloadBackup();
                        toast.success('Backup downloaded');
                      } catch (err: any) {
                        toast.error(err.message);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-gray-300 transition-colors"
                  >
                    <RefreshCwIcon className="w-4 h-4" />
                    Backup
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-gray-300 transition-colors"
                  >
                    <PrinterIcon className="w-4 h-4" />
                    Print
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-11 w-full"
                />
              </div>

              {/* Students Table */}
              {studentsLoading ? (
                <div className="text-center py-8">
                  <RefreshCwIcon className="w-6 h-6 text-gold-500 animate-spin mx-auto" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  {search ? 'No students match your search.' : 'No students enrolled yet.'}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gold-500/20">
                          <th className="pb-3 text-sm font-medium text-gray-400">Name</th>
                          <th className="pb-3 text-sm font-medium text-gray-400">Course</th>
                          <th className="pb-3 text-sm font-medium text-gray-400">Phone</th>
                          <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                          <th className="pb-3 text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold-500/10">
                        {students.map((student) => (
                          <tr key={student.id} className="group">
                            <td className="py-3">
                              <div>
                                <p className="text-white font-medium">{student.student_name}</p>
                                <p className="text-xs text-gray-500">{student.email}</p>
                              </div>
                            </td>
                            <td className="py-3 text-sm text-gray-300">{student.course_name}</td>
                            <td className="py-3 text-sm text-gray-300">{student.phone_number}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                student.payment_status === 'Paid'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {student.payment_status}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setEditingStudent(student)}
                                  className="p-1 hover:text-gold-400 transition-colors"
                                  title="Edit"
                                >
                                  <Edit2Icon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(student.id)}
                                  className="p-1 hover:text-red-400 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2Icon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={() => loadStudents(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Previous
                      </button>
                      <span className="text-sm text-gray-400">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => loadStudents(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <button
                onClick={() => setIsCreatingCourse(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add New Course
              </button>

              {courses.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <BookOpenIcon className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p>No courses available.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <div key={course.id} className="glass-card p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center text-2xl">
                            {course.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{course.name}</h4>
                            <p className="text-sm text-gold-400">{course.fee}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCourse(course);
                              setCourseForm({
                                name: course.name,
                                duration: course.duration,
                                fee: course.fee,
                                description: course.description,
                                ai_insight: course.ai_insight || '',
                                icon: course.icon,
                                modules: course.modules?.join('\n') || '',
                              });
                            }}
                            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                          >
                            <Edit2Icon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-red-400"
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stories Tab */}
          {activeTab === 'stories' && (
            <div className="space-y-4">
              <button
                onClick={() => setIsCreatingStory(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add New Story
              </button>

              {stories.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <StarIcon className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p>No success stories yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {stories.map((story) => (
                    <div key={story.id} className="glass-card p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-xl">
                            {story.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{story.name}</h4>
                            <p className="text-xs text-gold-400">{story.course}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingStory(story);
                              setStoryForm({
                                name: story.name,
                                course: story.course,
                                story: story.story,
                                avatar: story.avatar || '👤',
                              });
                            }}
                            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                          >
                            <Edit2Icon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStory(story.id)}
                            className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-red-400"
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-3">{story.story}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {editingStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setEditingStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Edit Student</h3>
                <button onClick={() => setEditingStudent(null)}>
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateStudent} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Payment Status</label>
                  <select
                    value={editingStudent.payment_status}
                    onChange={(e) => setEditingStudent({ ...editingStudent, payment_status: e.target.value })}
                    className="input-field"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Notes</label>
                  <textarea
                    value={editingStudent.notes || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditingStudent(null)} className="flex-1 gold-btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 gold-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2Icon className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Delete Student?</h3>
              <p className="text-gray-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 gold-btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Form Modal */}
      <AnimatePresence>
        {(isCreatingCourse || editingCourse) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => {
              setIsCreatingCourse(false);
              setEditingCourse(null);
              setCourseForm({ name: '', duration: '', fee: '', description: '', ai_insight: '', icon: '', modules: '' });
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingCourse(false);
                    setEditingCourse(null);
                    setCourseForm({ name: '', duration: '', fee: '', description: '', ai_insight: '', icon: '', modules: '' });
                  }}
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Course Name</label>
                  <input
                    type="text"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Duration</label>
                    <input
                      type="text"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Fee</label>
                    <input
                      type="text"
                      value={courseForm.fee}
                      onChange={(e) => setCourseForm({ ...courseForm, fee: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Icon (emoji)</label>
                  <input
                    type="text"
                    value={courseForm.icon}
                    onChange={(e) => setCourseForm({ ...courseForm, icon: e.target.value })}
                    className="input-field"
                    placeholder="💻"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Description</label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">AI Career Insight</label>
                  <textarea
                    value={courseForm.ai_insight}
                    onChange={(e) => setCourseForm({ ...courseForm, ai_insight: e.target.value })}
                    className="input-field"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Modules (one per line)</label>
                  <textarea
                    value={courseForm.modules}
                    onChange={(e) => setCourseForm({ ...courseForm, modules: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Module 1&#10;Module 2&#10;Module 3"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingCourse(false);
                      setEditingCourse(null);
                      setCourseForm({ name: '', duration: '', fee: '', description: '', ai_insight: '', icon: '', modules: '' });
                    }}
                    className="flex-1 gold-btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 gold-btn">
                    {editingCourse ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Form Modal */}
      <AnimatePresence>
        {(isCreatingStory || editingStory) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => {
              setIsCreatingStory(false);
              setEditingStory(null);
              setStoryForm({ name: '', course: '', story: '', avatar: '' });
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {editingStory ? 'Edit Story' : 'Add New Story'}
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingStory(false);
                    setEditingStory(null);
                    setStoryForm({ name: '', course: '', story: '', avatar: '' });
                  }}
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleStorySubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Student Name</label>
                  <input
                    type="text"
                    value={storyForm.name}
                    onChange={(e) => setStoryForm({ ...storyForm, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Course</label>
                  <input
                    type="text"
                    value={storyForm.course}
                    onChange={(e) => setStoryForm({ ...storyForm, course: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Avatar (emoji)</label>
                  <input
                    type="text"
                    value={storyForm.avatar}
                    onChange={(e) => setStoryForm({ ...storyForm, avatar: e.target.value })}
                    className="input-field"
                    placeholder="👤"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Story</label>
                  <textarea
                    value={storyForm.story}
                    onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })}
                    className="input-field"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingStory(false);
                      setEditingStory(null);
                      setStoryForm({ name: '', course: '', story: '', avatar: '' });
                    }}
                    className="flex-1 gold-btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 gold-btn">
                    {editingStory ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
