import toast from 'react-hot-toast';

// ============================================
// Type Definitions for Error Handling
// ============================================

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    // Fix for TypeScript error with message property
    this.message = message;
  }
}

// ============================================
// Configuration Constants
// ============================================

const API_BASE = '/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

// ============================================
// Utility Functions
// ============================================

/**
 * Extracts error message from various response formats
 */
function extractErrorMessage(data: any): string {
  if (!data) return 'Unknown error occurred';
  
  // Try common error message fields
  return (
    data.error ||
    data.message ||
    data.msg ||
    data.details ||
    (typeof data === 'string' ? data : 'Unknown error occurred')
  );
}

/**
 * Creates an AbortController with timeout
 */
function createTimeoutController(timeout: number): { controller: AbortController; timeoutId: NodeJS.Timeout } {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);
  return { controller, timeoutId };
}

/**
 * Sleep function for retry delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// Main Request Function with Error Handling
// ============================================

async function request<T>(
  url: string, 
  options?: RequestOptions
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    ...fetchOptions
  } = options || {};

  const token = localStorage.getItem('dsm_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let lastError: Error | ApiError = new Error('Request failed');

  // Retry loop
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create timeout controller
      const { controller, timeoutId } = createTimeoutController(timeout);

      const res = await fetch(`${API_BASE}${url}`, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      // Clear timeout
      clearTimeout(timeoutId);

      // Check response status
      if (!res.ok) {
        let errorData: any;
        try {
          errorData = await res.json();
        } catch {
          errorData = { error: `HTTP Error: ${res.status} ${res.statusText}` };
        }

        const errorMessage = extractErrorMessage(errorData);
        lastError = new ApiError(errorMessage, res.status, errorData);

        // Don't retry on client errors (4xx)
        if (res.status >= 400 && res.status < 500) {
          throw lastError;
        }
      }

      // Parse successful response
      return await res.json();

    } catch (error: any) {
      // Handle abort/timeout errors
      if (error.name === 'AbortError') {
        lastError = new ApiError('Request timed out. Please check your connection.', 408);
      } else if (error instanceof ApiError) {
        lastError = error;
      } else {
        lastError = new Error(error.message || 'Network error occurred');
      }

      // If this is the last attempt, throw the error
      if (attempt >= retries) {
        break;
      }

      // Log retry attempt
      console.warn(`Request failed (attempt ${attempt + 1}/${retries + 1}), retrying...`);
      
      // Wait before retrying with exponential backoff
      await sleep(retryDelay * Math.pow(2, attempt));
    }
  }

  throw lastError;
}

// ============================================
// Wrapper function that shows toast on error
// ============================================

async function requestWithToast<T>(
  url: string, 
  options?: RequestOptions,
  showErrorToast: boolean = true
): Promise<T> {
  try {
    return await request<T>(url, options);
  } catch (error: any) {
    const errorMessage = error.message || 'An unexpected error occurred';
    
    if (showErrorToast) {
      toast.error(errorMessage);
    }
    
    throw error;
  }
}

// ============================================
// API Methods
// ============================================

export const api = {
  // Public
  submitAdmission: (data: any) =>
    requestWithToast('/admission', { method: 'POST', body: JSON.stringify(data) }),

  // Student
  studentLogin: (phoneNumber: string, transactionId: string) =>
    requestWithToast<{ success: boolean; student: any; error?: string }>('/student/login', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber, transaction_id: transactionId }),
    }),

  // Admin
  login: (username: string, password: string) =>
    requestWithToast<{ success: boolean; token: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getStudents: (search?: string, page: number = 1, limit: number = 1000) =>
    requestWithToast<{ data: any[]; total: number; page: number; limit: number }>(
      `/admin/students?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`
    ),

  getStats: () => requestWithToast<any>('/admin/stats'),

  deleteStudent: (id: number) =>
    requestWithToast(`/admin/students/${id}`, { method: 'DELETE' }),

  updateStudent: (id: number, data: { payment_status: string; notes?: string }) =>
    requestWithToast(`/admin/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  exportExcel: async () => {
    try {
      const token = localStorage.getItem('dsm_admin_token');
      const res = await fetch(`${API_BASE}/admin/export/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Export failed' }));
        throw new Error(error.error || 'Export failed');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dsm_students_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error.message || 'Export failed');
      throw error;
    }
  },

  downloadBackup: async () => {
    try {
      const token = localStorage.getItem('dsm_admin_token');
      const res = await fetch(`${API_BASE}/admin/backup`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Backup download failed' }));
        throw new Error(error.error || 'Backup download failed');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dsm_backup_${new Date().toISOString().split('T')[0]}.db`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error.message || 'Backup download failed');
      throw error;
    }
  },

  getCourses: () => requestWithToast<any[]>('/courses'),

  addCourse: (data: any) =>
    requestWithToast('/courses', { method: 'POST', body: JSON.stringify(data) }),

  updateCourse: (id: number, data: any) =>
    requestWithToast(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteCourse: (id: number) =>
    requestWithToast(`/courses/${id}`, { method: 'DELETE' }),

  uploadCourseIcon: async (file: File): Promise<{ url: string }> => {
    try {
      const token = localStorage.getItem('dsm_admin_token');
      const formData = new FormData();
      formData.append('icon', file);
      
      const res = await fetch(`${API_BASE}/courses/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || 'Upload failed');
      }
      return await res.json();
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
      throw error;
    }
  },

  getSuccessStories: () => requestWithToast<any[]>('/stories'),

  // Success Stories (Admin)
  addSuccessStory: (data: { name: string; course: string; story: string; avatar?: string }) =>
    requestWithToast('/stories', { method: 'POST', body: JSON.stringify(data) }),

  createSuccessStory: (data: { name: string; course: string; story: string; avatar?: string }) =>
    requestWithToast('/stories', { method: 'POST', body: JSON.stringify(data) }),

  updateSuccessStory: (id: number, data: { name?: string; course?: string; story?: string; avatar?: string }) =>
    requestWithToast(`/stories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteSuccessStory: (id: number) =>
    requestWithToast(`/stories/${id}`, { method: 'DELETE' }),
};

// ============================================
// Export raw request functions for special cases
// ============================================

export { request, requestWithToast };
export default api;
