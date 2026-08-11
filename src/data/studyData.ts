export interface StudySubject {
  id: string;
  nameBn: string;
  nameEn: string;
}

export const STUDY_LEVELS = [
  { id: 'SSC', nameBn: 'এসএসসি (SSC)', nameEn: 'SSC' },
  { id: 'HSC', nameBn: 'এইচএসসি (HSC)', nameEn: 'HSC' },
  { id: 'University', nameBn: 'বিশ্ববিদ্যালয় / ভর্তি পরীক্ষা', nameEn: 'University' },
  { id: 'General', nameBn: 'সাধারণ শিক্ষা / স্কিল', nameEn: 'General Skill' },
];

export const STUDY_SUBJECTS: StudySubject[] = [
  { id: 'bangla', nameBn: 'বাংলা (Bangla)', nameEn: 'Bangla' },
  { id: 'english', nameBn: 'ইংরেজি (English)', nameEn: 'English' },
  { id: 'math', nameBn: 'গণিত (Mathematics)', nameEn: 'Math' },
  { id: 'physics', nameBn: 'পদার্থবিজ্ঞান (Physics)', nameEn: 'Physics' },
  { id: 'chemistry', nameBn: 'রসায়ন (Chemistry)', nameEn: 'Chemistry' },
  { id: 'biology', nameBn: 'জীববিজ্ঞান (Biology)', nameEn: 'Biology' },
  { id: 'ict', nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', nameEn: 'ICT' },
  { id: 'history', nameBn: 'ইতিহাস ও বাংলাদেশ বিষয়াবলি', nameEn: 'History & BD Affairs' },
  { id: 'geography', nameBn: 'ভূগোল ও পরিবেশ', nameEn: 'Geography' },
  { id: 'gk', nameBn: 'সাধারণ জ্ঞান (General Knowledge)', nameEn: 'General Knowledge' },
];
