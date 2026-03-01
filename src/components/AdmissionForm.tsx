import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, UserIcon, PhoneIcon, BookOpenIcon, CreditCardIcon, Loader2Icon, CheckCircle2Icon, MailIcon, FileTextIcon, XIcon, CheckIcon } from './icons';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import type { AdmissionFormData } from '../types';

// Validation types
interface ValidationErrors {
  student_name?: string;
  phone_number?: string;
  email?: string;
  course_name?: string;
  transaction_id?: string;
  education?: string;
  address?: string;
}

// Validation functions
const validateName = (value: string): string | undefined => {
  if (!value.trim()) return 'Name is required';
  if (value.trim().length < 2) return 'Name must be at least 2 characters';
  return undefined;
};

const validatePhone = (value: string): string | undefined => {
  if (!value.trim()) return 'Phone number is required';
  // Bangladesh phone format: 01XXXXXXXXX (11 digits starting with 01)
  const phoneRegex = /^01\d{9}$/;
  if (!phoneRegex.test(value.trim())) return 'Enter a valid Bangladesh phone number (01XXXXXXXXX)';
  return undefined;
};

const validateEmail = (value: string): string | undefined => {
  if (!value.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) return 'Enter a valid email address';
  return undefined;
};

const validateTransactionId = (value: string): string | undefined => {
  if (!value.trim()) return 'Transaction ID is required';
  if (value.trim().length < 6) return 'Transaction ID must be at least 6 characters';
  return undefined;
};

const validateCourse = (value: string): string | undefined => {
  if (!value) return 'Please select a course';
  return undefined;
};

// Normalize phone number to standard format
const normalizePhone = (value: string): string => {
  // Remove any non-digit characters except + at the start
  let cleaned = value.replace(/[^\d]/g, '');
  // If starts with 88, remove 88 and add +88 back after normalization
  if (cleaned.startsWith('8801')) {
    cleaned = '01' + cleaned.substring(3);
  } else if (cleaned.startsWith('88') && !cleaned.startsWith('880')) {
    cleaned = '01' + cleaned.substring(2);
  } else if (cleaned.startsWith('1') && cleaned.length === 10) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
};

export default function AdmissionForm() {
  const [courses, setCourses] = useState<any[]>([]);
  const [form, setForm] = useState<AdmissionFormData>({
    student_name: '',
    phone_number: '',
    email: '',
    course_name: '',
    transaction_id: '',
    notes: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Validate individual fields
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'student_name':
        return validateName(value);
      case 'phone_number':
        return validatePhone(value);
      case 'email':
        return validateEmail(value);
      case 'course_name':
        return validateCourse(value);
      case 'transaction_id':
        return validateTransactionId(value);
      default:
        return undefined;
    }
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      !validateName(form.student_name) &&
      !validatePhone(form.phone_number) &&
      !validateEmail(form.email) &&
      !validateCourse(form.course_name) &&
      !validateTransactionId(form.transaction_id) &&
      form.student_name.trim() &&
      form.phone_number.trim() &&
      form.email.trim() &&
      form.course_name &&
      form.transaction_id.trim()
    );
  }, [form]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.getCourses();
        setCourses(data);
      } catch (err: any) {
        console.error('Failed to load courses:', err);
        toast.error(err.message || 'Failed to load courses');
      }
    };
    loadCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Normalize phone number on change
    let newValue = value;
    if (name === 'phone_number') {
      newValue = normalizePhone(value);
    }
    
    setForm({ ...form, [name]: newValue });
    
    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: ValidationErrors = {
      student_name: validateName(form.student_name),
      phone_number: validatePhone(form.phone_number),
      email: validateEmail(form.email),
      course_name: validateCourse(form.course_name),
      transaction_id: validateTransactionId(form.transaction_id),
    };
    
    setErrors(newErrors);
    setTouched({
      student_name: true,
      phone_number: true,
      email: true,
      course_name: true,
      transaction_id: true,
    });
    
    // Check if form is valid
    if (Object.values(newErrors).some((error) => error)) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Prevent duplicate submission
    if (loading) return;

    setLoading(true);
    try {
      // Normalize phone before submitting
      const normalizedForm = {
        ...form,
        phone_number: normalizePhone(form.phone_number),
      };
      await api.submitAdmission(normalizedForm);
      setSuccess(true);
      setFormSubmitted(true);
      toast.success('Admission submitted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ student_name: '', phone_number: '', email: '', course_name: '', transaction_id: '', notes: '' });
    setErrors({});
    setTouched({});
    setSuccess(false);
    setFormSubmitted(false);
  };

  // Get input field class based on validation state
  const getInputClass = (fieldName: string, baseClass: string) => {
    if (!touched[fieldName]) return baseClass;
    const hasError = errors[fieldName as keyof ValidationErrors];
    if (hasError) {
      return `${baseClass} border-red-500 focus:border-red-500`;
    }
    const fieldValue = form[fieldName as keyof AdmissionFormData];
    if (fieldValue && typeof fieldValue === 'string' && fieldValue.trim()) {
      return `${baseClass} border-green-500 focus:border-green-500`;
    }
    return baseClass;
  };

  return (
    <section id="admission" className="py-24 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-0 w-80 h-80 bg-gold-600/5 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-2 mb-6"
          >
            <span className="text-gold-400 text-sm font-medium">📝 Easy Enrollment</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Start Your <span className="gold-text">Journey</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Fill out the form below to enroll in your chosen course. Our team will confirm your admission within 24 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-8 text-center"
              >
                <motion.div 
                  className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <CheckCircle2Icon className="w-10 h-10 text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">Application Submitted!</h3>
                <p className="text-gray-400 mb-6">
                  Thank you for your application. We will review your details and contact you shortly via phone or email.
                </p>
                <button
                  onClick={resetForm}
                  className="gold-btn"
                >
                  Submit Another Application
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="glass-card p-8"
              >
                <div className="space-y-6">
                  {/* Student Name */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Full Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-gold-400 transition-colors" />
                      <input
                        type="text"
                        name="student_name"
                        placeholder="Enter your full name"
                        className={getInputClass('student_name', 'input-field pl-11')}
                        value={form.student_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {touched.student_name && !errors.student_name && form.student_name && (
                        <CheckIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                    </div>
                    {touched.student_name && errors.student_name && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-1"
                      >
                        {errors.student_name}
                      </motion.p>
                    )}
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block">Phone Number</label>
                      <div className="relative group">
                        <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-gold-400 transition-colors" />
                        <input
                          type="tel"
                          name="phone_number"
                          placeholder="01XXXXXXXXX"
                          className={getInputClass('phone_number', 'input-field pl-11')}
                          value={form.phone_number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />
                        {touched.phone_number && !errors.phone_number && form.phone_number && (
                          <CheckIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                        )}
                      </div>
                      {touched.phone_number && errors.phone_number && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-1"
                        >
                          {errors.phone_number}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block">Email Address</label>
                      <div className="relative group">
                        <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-gold-400 transition-colors" />
                        <input
                          type="email"
                          name="email"
                          placeholder="your@email.com"
                          className={getInputClass('email', 'input-field pl-11')}
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />
                        {touched.email && !errors.email && form.email && (
                          <CheckIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                        )}
                      </div>
                      {touched.email && errors.email && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Course Selection */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Select Course</label>
                    <div className="relative group">
                      <BookOpenIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-gold-400 transition-colors" />
                      <select
                        name="course_name"
                        className={getInputClass('course_name', 'input-field pl-11 appearance-none')}
                        value={form.course_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="">Choose a course...</option>
                        {courses.map((course) => (
                          <option key={course.name} value={course.name}>
                            {course.name} - {course.fee}
                          </option>
                        ))}
                      </select>
                    </div>
                    {touched.course_name && errors.course_name && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-1"
                      >
                        {errors.course_name}
                      </motion.p>
                    )}
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Payment Transaction ID</label>
                    <div className="relative group">
                      <CreditCardIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-gold-400 transition-colors" />
                      <input
                        type="text"
                        name="transaction_id"
                        placeholder="bKash / Nagad Transaction ID"
                        className={getInputClass('transaction_id', 'input-field pl-11')}
                        value={form.transaction_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {touched.transaction_id && !errors.transaction_id && form.transaction_id && (
                        <CheckIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                    </div>
                    {touched.transaction_id && errors.transaction_id && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-1"
                      >
                        {errors.transaction_id}
                      </motion.p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Send course fee to 01774471120 (bKash/Nagad Personal)
                    </p>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Additional Notes (Optional)</label>
                    <div className="relative group">
                      <FileTextIcon className="absolute left-4 top-4 w-4 h-4 text-gray-600 group-focus-within:text-gold-400 transition-colors" />
                      <textarea
                        name="notes"
                        placeholder="Any additional information..."
                        className="input-field pl-11 min-h-[100px] resize-none"
                        value={form.notes}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || !isFormValid}
                    whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                    whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                    className="gold-btn w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2Icon className="w-5 h-5" />
                    ) : (
                      <>
                        Submit Application <SendIcon className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
