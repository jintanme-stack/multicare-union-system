// Persistent Client-Side Mock Database for MCSA Union App

const defaultPendingMembers = [
  { 
    id: 'APP-102', 
    name: 'Siti Aminah', 
    category: 'Confinement Care', 
    email: 'siti@mcsa.com.my', 
    phone: '011-23456789',
    exp: '8 yrs', 
    location: 'Ampang, Selangor',
    bio: 'Specialized in lactation guidance, confinement diet plans, and neonatal wellness checkups.',
    proof: 'Doula_Cert_L3.pdf',
    healthCert: 'Health_Vetted_2026.pdf',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=256&h=256&fit=crop'
  },
  { 
    id: 'APP-103', 
    name: 'Joshua Wong', 
    category: 'Patient Companion', 
    email: 'joshua@mcsa.com.my', 
    phone: '016-87654321',
    exp: '3 yrs', 
    location: 'Cheras, Kuala Lumpur',
    bio: 'Familiar with Hospital Kuala Lumpur clinic steps. Speaks Mandarin, Malay, and English.',
    proof: 'First_Aid_Cert.pdf',
    healthCert: 'Health_Vetted_2026.pdf',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop'
  },
  { 
    id: 'APP-104', 
    name: 'Ramasamy Nathan', 
    category: 'Elderly Caregiver', 
    email: 'ramasamy@mcsa.com.my', 
    phone: '017-65432109',
    exp: '5 yrs', 
    location: 'Petaling Valley, Selangor',
    bio: 'Experienced in handling post-op stroke rehabilitation and elder nutrition planning.',
    proof: 'Nursing_Dip.pdf',
    healthCert: 'Health_Vetted_2026.pdf',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop'
  }
];

const defaultUnionMembers = [
  {
    id: 'M-101',
    name: 'Li Xiulan',
    email: 'xiulan@mcsa.com.my',
    phone: '012-8888776',
    category: 'Elderly Caregiver',
    exp: '10 yrs',
    location: 'Bukit Bintang, KL',
    member_number: 'MCSA-2026-0009',
    expiry: '2027-05-28',
    bio: 'Specialized in geriatric care and senior support.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&fit=crop'
  },
  {
    id: 'M-102',
    name: 'Meizhen Chen',
    email: 'meizhen@mcsa.com.my',
    phone: '019-3322114',
    category: 'Confinement Care',
    exp: '6 yrs',
    location: 'Puchong, Selangor',
    member_number: 'MCSA-2026-1112',
    expiry: '2027-04-12',
    bio: 'Experienced infant nurse and confinement practitioner.',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop'
  }
];

const defaultInquiries = [
  { id: 'INQ-44', name: 'Mr. Lim', contact: '012-3456789', message: 'Do caregivers bring their own medical gear?' },
  { id: 'INQ-45', name: 'Puan Halimah', contact: 'halimah@gmail.com', message: 'I need a confinement lady for December 2026. Can I book now?' }
];

const defaultCareRequests = [
  { 
    id: 'REQ-01', 
    name: 'Madam Lim', 
    contact: '017-9988776', 
    category: 'Confinement Care', 
    message: 'My due date is Dec 2nd 2026, looking for a confinement lady for Puchong location.', 
    date: '2026-06-04' 
  }
];

const defaultLibItems = [
  { id: 'LIB-99', title: 'Hospital Kuala Lumpur (HKL) Emergency Route Layout', type: 'PDF Document', size: '1.2 MB' },
  { id: 'LIB-100', title: 'Tung Shin Hospital Outpatient Care Checklist SOP', type: 'Image Map', size: '890 KB' }
];

const defaultAnnouncements = [
  {
    id: 'ANN-1',
    title: 'MCSA Professional Caregiver Training Registrations Open',
    category: 'Training',
    date: '2026-06-04',
    content: 'Advanced companion care and infant nursing classes are open. Certification is jointly issued by Caredemy.'
  },
  {
    id: 'ANN-2',
    title: 'Mandatory Caregiver Health Clearance Updates',
    category: 'Union News',
    date: '2026-05-28',
    content: 'All active union caregivers must submit updated TB tests and background clearances by June 30th to maintain active status.'
  }
];

const defaultActivityPhotos = [
  { id: 'PHOTO-1', url: '/activity-center.jpg', caption: 'MCSA Training Base - Caregiver Practical Training Room' },
  { id: 'PHOTO-2', url: '/activity-cert.jpg', caption: 'Competency Vetting - Clinical Skill Assessments' },
  { id: 'PHOTO-3', url: '/activity-grad.jpg', caption: 'Companion Course Graduation Ceremony' }
];

// Helper to check window environment
const isClient = () => typeof window !== 'undefined';

export const getStore = (key: string, defaultValue: any) => {
  if (!isClient()) return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(stored);
};

export const setStore = (key: string, val: any) => {
  if (!isClient()) return;
  localStorage.setItem(key, JSON.stringify(val));
};

export const store = {
  getLanguage: () => {
    if (!isClient()) return 'en';
    return localStorage.getItem('mcsa_lang') || 'en';
  },
  setLanguage: (lang: string) => {
    if (!isClient()) return;
    localStorage.setItem('mcsa_lang', lang);
  },

  getPendingMembers: () => getStore('mcsa_pending', defaultPendingMembers),
  setPendingMembers: (members: any) => setStore('mcsa_pending', members),
  
  getUnionMembers: () => getStore('mcsa_union_members', defaultUnionMembers),
  setUnionMembers: (members: any) => setStore('mcsa_union_members', members),
  
  getInquiries: () => getStore('mcsa_inquiries', defaultInquiries),
  setInquiries: (inquiries: any) => setStore('mcsa_inquiries', inquiries),
  
  getCareRequests: () => getStore('mcsa_care_requests', defaultCareRequests),
  setCareRequests: (requests: any) => setStore('mcsa_care_requests', requests),
  
  getLibItems: () => getStore('mcsa_lib_items', defaultLibItems),
  setLibItems: (items: any) => setStore('mcsa_lib_items', items),

  getAnnouncements: () => getStore('mcsa_announcements', defaultAnnouncements),
  setAnnouncements: (announcements: any) => setStore('mcsa_announcements', announcements),

  getActivityPhotos: () => getStore('mcsa_activity_photos', defaultActivityPhotos),
  setActivityPhotos: (photos: any) => setStore('mcsa_activity_photos', photos)
};
