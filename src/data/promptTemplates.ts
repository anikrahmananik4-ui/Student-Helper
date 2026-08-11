export interface SamplePrompt {
  id: string;
  category: string;
  titleBn: string;
  promptBn: string;
}

export const PROMPT_TEMPLATES: SamplePrompt[] = [
  {
    id: '1',
    category: 'Writing',
    titleBn: 'ফেসবুক মার্কেটিং পোস্ট',
    promptBn: 'একটি নতুন কফি শপের জন্য ফেসবুক প্রোমোশনাল পোস্ট লিখে দাও যাতে ২০% ছাড়ের অফার এবং হাসিখুশি বার্তা থাকে।',
  },
  {
    id: '2',
    category: 'Study',
    titleBn: 'পদার্থবিজ্ঞানের কঠিন কনসেপ্ট ব্যাখ্যা',
    promptBn: 'আইনস্টাইনের আপেক্ষিকতা তত্ত্ব একজন ১০ বছরের বাচ্চাকে যেভাবে বুঝানো যায় সেভাবে সহজ বাংলায় বুঝিয়ে দাও।',
  },
  {
    id: '3',
    category: 'Business',
    titleBn: 'ছুটির আবেদনের ইমেইল',
    promptBn: 'অফিসের ম্যানেজারের কাছে ৩ দিনের শারীরিক অসুস্থতার জন্য ছুটির একটি প্রফেশনাল ইমেইল লিখে দাও।',
  },
  {
    id: '4',
    category: 'Coding',
    titleBn: 'React State Management ব্যাখ্যা',
    promptBn: 'React-এ useState এবং useEffect ব্যবহারের একটি সহজ বাংলা টিউটোরিয়াল ও কোড এক্সাম্পল দাও।',
  },
  {
    id: '5',
    category: 'Image generation',
    titleBn: 'সুন্দর বাংলাদেশী গ্রামীণ দৃশ্য প্রম্পট',
    promptBn: 'Generates a vivid ultra-realistic image prompt for Midjourney: A serene Bangladeshi rural village at golden hour with green paddy fields and a wooden boat on a quiet river.',
  },
];
