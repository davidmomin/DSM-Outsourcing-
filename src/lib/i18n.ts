import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "hero_title": "Unlock Your Freelancing Career",
            "hero_subtitle": "Premium Computer Training Center in Dhaka, Bangladesh. AI-Enhanced & Production-Ready.",
            "enroll_now": "Enroll Now",
            "admin_login": "Admin Login",
            "courses": "Courses",
            "admission": "Admission",
            "success_stories": "Success Stories",
            "student_name": "Student Name",
            "phone_number": "Phone Number",
            "transaction_id": "Transaction ID",
            "submit": "Submit Admission",
            "loading": "Processing...",
        }
    },
    bn: {
        translation: {
            "hero_title": "আপনার ফ্রিল্যান্সিং ক্যারিয়ার শুরু করুন",
            "hero_subtitle": "ঢাকার সেরা কম্পিউটার প্রশিক্ষণ কেন্দ্র। এআই-সমৃদ্ধ এবং আধুনিক প্রযুক্তিতে সাজানো।",
            "enroll_now": "এখনই ভর্তি হোন",
            "admin_login": "অ্যাডমিন লগইন",
            "courses": "কোর্সসমূহ",
            "admission": "ভর্তি",
            "success_stories": "সাফল্যের গল্প",
            "student_name": "শিক্ষার্থীর নাম",
            "phone_number": "ফোন নম্বর",
            "transaction_id": "ট্রানজ্যাকশন আইডি",
            "submit": "ভর্তি সম্পন্ন করুন",
            "loading": "প্রক্রিয়াকরণ চলছে...",
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
