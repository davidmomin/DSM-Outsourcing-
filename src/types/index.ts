export interface Student {
  id: number;
  student_name: string;
  phone_number: string;
  email?: string;
  course_name: string;
  transaction_id: string;
  reg_date: string;
  payment_status: string;
  notes?: string;
}

export interface AdmissionFormData {
  student_name: string;
  phone_number: string;
  email: string;
  course_name: string;
  transaction_id: string;
  notes: string;
}

export interface DashboardStats {
  totalStudents: number;
  todayAdmissions: number;
  courseDistribution: { course_name: string; count: number }[];
  weeklyTrend: { date: string; count: number }[];
}

export interface Course {
  name: string;
  description: string;
  duration: string;
  icon: string;
  modules: string[];
  fee: string;
  ai_insight?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
