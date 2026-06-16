// Persistent Client-Side Mock Database for MCSA Union App
import { supabase } from './supabaseClient';

const defaultPendingMembers = [
  { 
    id: 'APP-102', 
    name: 'Siti Aminah', 
    category: 'Confinement Care', 
    nric: '890512-14-5568',
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
    nric: '931120-10-6059',
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
    nric: '850204-08-5117',
    email: 'ramasamy@mcsa.com.my', 
    phone: '017-65432109',
    exp: '5 yrs', 
    location: 'Petaling Valley, Selangor',
    bio: 'Experienced in handling post-op stroke rehabilitation and elder nutrition planning.',
    proof: 'Nursing_Dip.pdf',
    healthCert: 'Health_Vetted_2026.pdf',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop'
  },
  {
    id: 'APP-105',
    name: 'Wong Siew Lan (黄秀兰)',
    category: 'Confinement Care, Patient Companion',
    nric: '850412-14-5896',
    email: 'siewlan@mcsa.com.my',
    phone: '012-3456789',
    exp: '6 yrs',
    location: 'Puchong, Selangor',
    bio: 'Experienced confinement nanny (月嫂) and medical outpatient companion (陪诊员). Fluent in Mandarin and Cantonese.',
    proof: 'Mock_Confinement_Escort_Cert.pdf',
    healthCert: 'Health_Vetted_2026.pdf',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop'
  }
];

const defaultUnionMembers = [
  {
    id: 'M-101',
    name: 'Li Xiulan',
    email: 'xiulan@mcsa.com.my',
    phone: '012-8888776',
    nric: '830812-14-5544',
    category: 'Elderly Caregiver',
    exp: '10 yrs',
    location: 'Bukit Bintang, KL',
    member_number: 'MCSA-2026-0009',
    expiry: '2026-07-04',
    bio: 'Specialized in geriatric care and senior support.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&fit=crop',
    contributionCompliance: 100
  },
  {
    id: 'M-102',
    name: 'Meizhen Chen',
    email: 'meizhen@mcsa.com.my',
    phone: '019-3322114',
    nric: '870615-10-5622',
    category: 'Confinement Care',
    exp: '6 yrs',
    location: 'Puchong, Selangor',
    member_number: 'MCSA-2026-1112',
    expiry: '2026-06-30',
    bio: 'Experienced infant nurse and confinement practitioner.',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop',
    contributionCompliance: 50
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
    email: 'lim@mcsa.com.my',
    accessKey: '123456',
    category: 'Confinement Care', 
    message: 'My due date is Dec 2nd 2026, looking for a confinement lady for Puchong location.', 
    date: '2026-06-04' 
  },
  {
    id: 'REQ-02',
    name: 'Mrs. Tan',
    contact: '012-7766554',
    email: 'tan@mcsa.com.my',
    accessKey: '654321',
    category: 'Babysitter Service',
    message: 'Looking for a professional babysitter for my 1-year-old child in PJ Area. Mon-Fri 9am-6pm.',
    date: '2026-06-06'
  }
];

const defaultLibItems = [
  { id: 'LIB-99', title: 'Hospital Kuala Lumpur (HKL) Emergency Route Layout', type: 'PDF Document', size: '1.2 MB', state: 'Kuala Lumpur', imageUrl: '/hospital_maps/hkl_map.jpg' },
  { id: 'LIB-100', title: 'Tung Shin Hospital Outpatient Care Checklist SOP', type: 'Image Map', size: '890 KB', state: 'Kuala Lumpur', imageUrl: '/hospital_maps/tung_shin_map.jpg' },
  { id: 'LIB-101', title: 'Hospital Selayang Block Map Layout', type: 'Image Map', size: '1.1 MB', state: 'Selangor', imageUrl: '/hospital_maps/hkl_map.jpg' },
  { id: 'LIB-102', title: 'Hospital Serdang Outpatient Checkpoint SOP', type: 'Image Map', size: '920 KB', state: 'Selangor', imageUrl: '/hospital_maps/tung_shin_map.jpg' },
  { id: 'LIB-103', title: 'Penang General Hospital Main Building Plan', type: 'Image Map', size: '1.4 MB', state: 'Penang', imageUrl: '/hospital_maps/hkl_map.jpg' },
  { id: 'LIB-104', title: 'Hospital Sultanah Aminah (Johor Bahru) Ward Guide', type: 'Image Map', size: '1.0 MB', state: 'Johor', imageUrl: '/hospital_maps/tung_shin_map.jpg' },
  { id: 'LIB-105', title: 'Sarawak General Hospital Outpatient Block Layout', type: 'Image Map', size: '1.3 MB', state: 'Sarawak', imageUrl: '/hospital_maps/hkl_map.jpg' },
  { id: 'LIB-106', title: 'Hospital Queen Elizabeth (Kota Kinabalu) Emergency Route', type: 'Image Map', size: '1.1 MB', state: 'Sabah', imageUrl: '/hospital_maps/tung_shin_map.jpg' },
  { id: 'LIB-107', title: 'Hospital Tengku Ampuan Afzan Block Guide', type: 'Image Map', size: '850 KB', state: 'Pahang', imageUrl: '/hospital_maps/hkl_map.jpg' },
  { id: 'LIB-108', title: 'Hospital Raja Permaisuri Bainun (Ipoh) SOP Plan', type: 'Image Map', size: '1.2 MB', state: 'Perak', imageUrl: '/hospital_maps/tung_shin_map.jpg' }
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

const defaultEscortForms = [
  {
    id: 'FORM-101',
    fullName: 'Grandpa Zhang',
    gender: 'Male',
    dob: '1948-03-12',
    nric: '480312-14-5567',
    phone: '012-3344556',
    address: '22, Jalan Bukit Bintang, Kuala Lumpur',
    emergencyName: 'Zhang Wei',
    emergencyPhone: '019-8765432',
    relationship: 'Son',
    appointmentDate: '2026-06-04',
    appointmentTime: '10:30',
    facility: 'Hospital Kuala Lumpur (HKL)',
    doctor: 'Dr. Tan',
    specialty: 'Cardiology',
    assistanceRequired: true,
    complaint: 'Chest discomfort and occasional palpitation during mild exercise.',
    pastHistory: ['Hypertension', 'Diabetes', 'Heart Disease'],
    drugAllergy: 'No Known Drug Allergy',
    foodAllergy: 'No',
    otherAllergy: 'No',
    takingMeds: true,
    medsList: 'Metformin 500mg (1x daily), Amlodipine 5mg (1x daily)',
    surgicalHistory: 'Angioplasty (2022, HKL)',
    mobility: 'Walk Independently',
    hearingDifficulty: false,
    speechDifficulty: false,
    visualImpairment: 'Mild cataract in left eye',
    additionalInfo: 'Needs help navigating HKL cardiology clinic building escalators.',
    clientSigned: 'Grandpa Zhang',
    signedDate: '2026-06-03',
    caregiverId: 'M-101'
  }
];

const defaultEscortSession = {
  patientName: "王大爷 (Mr. Wang)",
  patientAge: 78,
  patientId: "2026-2050333",
  hospital: "市第一人民医院 (No.1 People's Hospital)",
  department: "心血管内科 (Cardiology Dept)",
  statusIndex: 2, // 0 = Patient Met, 1 = Clinic Queuing, 2 = Appointment Ongoing, 3 = Payment/Medicine, 4 = Check-out/Transfer
  doctorNote: "心率正常，血压轻微偏高。建议低盐低脂饮食，半月后复诊核查。",
  revisitDate: "2026-06-20",
  uploadedPhotos: [
    "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=256&h=256&fit=crop", // receipt mock
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=256&h=256&fit=crop"  // prescription mock
  ],
  isShared: false,
  lastUpdated: "2026-06-04"
};

const defaultConfinementContracts = [
  {
    id: 'CONTRACT-201',
    status: 'Signed',
    caregiverId: 'M-102',
    caregiverName: 'Meizhen Chen',
    caregiverMemberNo: 'MCSA-2026-1112',
    caregiverNric: '870615-10-5622',
    caregiverPhone: '019-3322114',
    bankName: 'Maybank',
    accountName: 'Chen Meizhen',
    accountNumber: '11422334455',
    duitNow: '019-3322114',
    serviceFee: '6800',
    deposit: '2000',
    balance: '4800',
    clientName: 'Emily Tan (陈美玲)',
    clientNric: '920815-14-5226',
    clientPhone: '012-7788990',
    clientAddress: '15, Jalan Puchong Jaya, Puchong, Selangor',
    clientEdd: '2026-07-15',
    clientSignature: 'Emily Tan',
    caregiverSignature: 'Meizhen Chen',
    unionWitness: 'MCSA Witness Officer / 马来西亚华人照护工会见证代表',
    signedDate: '2026-06-05'
  }
];

const defaultElderlyContracts = [
  {
    id: 'CONTRACT-ELD-201',
    status: 'Signed',
    caregiverId: 'M-101',
    caregiverName: 'Li Xiulan',
    caregiverMemberNo: 'MCSA-2026-0009',
    caregiverNric: '830812-14-5544',
    caregiverPhone: '012-8888776',
    bankName: 'CIMB Bank',
    accountName: 'Li Xiulan',
    accountNumber: '7045566778',
    duitNow: '012-8888776',
    serviceDate: '2026-06-15 to 2026-07-15',
    serviceHours: '9:00 AM - 5:00 PM',
    serviceFee: '4500',
    deposit: '1500',
    balance: '3000',
    clientName: 'Wong Kah Fai (王家辉)',
    clientNric: '791104-14-5115',
    clientPhone: '017-6655443',
    clientAddress: '45, Jalan Bukit Bintang, Kuala Lumpur',
    clientSignature: 'Wong Kah Fai',
    caregiverSignature: 'Li Xiulan',
    unionWitness: 'MCSA Witness Officer / 马来西亚华人照护工会见证代表',
    signedDate: '2026-06-06'
  }
];

const defaultConfinementSession = {
  babyName: "LeLe (乐乐)",
  babyAgeDays: 15,
  nannyName: "Meizhen Chen",
  dateString: "2026-06-04",
  lastUpdated: "22:45",
  isShared: false,
  feedingLog: [
    { id: "feed-1", time: "03:00", type: "Breast", breastLeftMins: 15, breastRightMins: 15, formulaMl: 0 },
    { id: "feed-2", time: "06:00", type: "Formula", breastLeftMins: 0, breastRightMins: 0, formulaMl: 90 },
    { id: "feed-3", time: "09:30", type: "Formula", breastLeftMins: 0, breastRightMins: 0, formulaMl: 120 }
  ],
  diaperRecord: [
    { id: "diaper-1", time: "03:00", urine: "Small", stoolColor: "Gold", texture: "Mushy", amount: "Medium", notes: "Normal soft stool" },
    { id: "diaper-2", time: "08:15", urine: "Medium", stoolColor: "Gold", texture: "Mushy", amount: "Small", notes: "No skin redness" }
  ],
  sleepActivity: {
    sleepLogs: [
      { id: "sleep-1", enterTime: "03:00 AM", exitTime: "09:00 AM", totalHours: 6 }
    ],
    activities: { bathing: true, tummyTime: true, massage: true, music: false }
  },
  healthCheck: {
    temp: "36.6",
    jaundiceForehead: "8.2",
    jaundiceChest: "7.5",
    jaundiceCheeks: "8.0",
    umbilicalStatus: "Dry & Healing"
  }
};

const defaultElderSession = {
  patientName: "Tan Ah Teck",
  patientAge: 78,
  dayNumber: 312,
  dateString: "2026-06-04",
  lastUpdated: "23:15",
  isShared: false,
  medications: [
    { id: "med-1", time: "08:00 AM", name: "Amlodipine", dose: "5mg", administered: true },
    { id: "med-2", time: "12:00 PM", name: "Metformin", dose: "500mg", administered: false }
  ],
  risks: {
    fallRisk: "Medium",
    bedsores: "None",
    cognitiveStatus: "Normal"
  },
  vitals: {
    bp: "128/82",
    bloodSugar: "6.2",
    sugarType: "Fasting",
    heartRate: "74",
    bodyTemp: "36.6"
  },
  activities: [
    { id: "act-1", time: "09:00 AM", title: "Walk in Garden", checked: true, notes: "Completed 15 mins steady walking" },
    { id: "act-2", time: "10:30 AM", title: "Joint Exercises", checked: true, notes: "Completed arm extensions" },
    { id: "act-3", time: "14:00 PM", title: "Assisted Bathing", checked: false, notes: "" },
    { id: "act-4", time: "16:00 PM", title: "Memory Game", checked: false, notes: "" }
  ]
};

const defaultBlogPosts = [
  {
    id: 'BLOG-1',
    title: 'The Heartbeat of Home Care: A Day in the Life of a Confinement Specialist / 月子护理的一天',
    category: 'Caregiver Stories',
    date: '2026-06-10',
    readTime: '5 min read',
    author: 'MCSA Editorial',
    coverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&h=400&fit=crop',
    snippet: 'Meet Kak Aminah, an MCSA-certified confinement nanny, and read about her journey of bringing neonatal care expertise and warm support to young Malaysian families.',
    content: `### Bridging Generations and Cultures with Love

Aminah has been a professional confinement nanny (月嫂) for over 8 years. For her, confinement care is not just a job; it is a sacred trust. Today, she shares her experience supporting a young family in Puchong, Selangor.

"Every new mother faces immense anxiety," Aminah smiles. "My goal is to provide a smooth transition. I prepare postpartum wellness meals, guide mothers through breastfeeding, and monitor the newborn baby's vital signs like body temperature and jaundice level."

### Professional Vetting and Peace of Mind

Before joining MCSA, Aminah worked independently. However, she noticed that families often worried about background safety and clinical vetting.

"Since MCSA introduced mandatory chest X-ray screening for tuberculosis, criminal checks, and practical exams in training bases, families feel completely safe welcoming us into their homes. The digital union card makes verification instant."

### A Heartwarming Experience

During her last assignment, the baby developed mild physiological jaundice. Thanks to her MCSA clinical training, Aminah immediately recorded forehead bilirubin readings of 8.2 and chest readings of 7.5 using a digital validator, noting them down in the Family Portal. This kept the working parents fully informed and prevented unnecessary panic.

"We care for the future of Malaysia," Aminah concludes. "Every baby deserves a healthy start."`
  },
  {
    id: 'BLOG-2',
    title: 'Bridging the Gap: How Medical Escorts Make Hospital Visits Stress-Free / 温暖就医路',
    category: 'Caregiver Stories',
    date: '2026-06-08',
    readTime: '4 min read',
    author: 'Rajesh Kumar',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&h=400&fit=crop',
    snippet: 'Navigating busy hospital corridors can be daunting for seniors. Discover how MCSA patient companions like Raj guide elders safely through appointments at HKL.',
    content: `### Navigating the Hospital Labyrinth

For an elderly patient, a visit to a massive medical complex like Hospital Kuala Lumpur (HKL) can feel like navigating a maze. Busy corridors, multiple checkpoints, long pharmacy queues, and escalators can easily become safety hazards.

Rajesh Nathan, an MCSA-validated patient companion (陪诊员), has spent the last three years accompanying seniors to their medical visits.

"Many working children cannot take time off work for every checkup," Raj explains. "That is where we come in. We meet the elderly patients at the lobby, help them check in at the counter, guide them safely to clinic floors, and log all doctor recommendations."

### Real-Time Family Peace of Mind

Raj uses the MCSA Family Portal to log vital indicators in real-time. During Grandpa Zhang's cardiology appointment last week, Raj updated the portal at every stage:
- **09:00 AM**: Met patient at lobby.
- **10:30 AM**: Clinic appointment ongoing. Doctor advised Metformin dosage adjustment.
- **11:45 AM**: Pharmacy pickup completed.

"Grandpa Zhang's son was in a business meeting in Singapore, but he could open the Family Portal and see exactly what the doctor said and when the prescription was collected. That is high-trust care," Rajesh says proudly.`
  },
  {
    id: 'BLOG-3',
    title: 'Standardizing Vitals: Why MCSA Vetting Protects Malaysian Families / 为什么资质审核至关重要',
    category: 'Accreditation News',
    date: '2026-06-01',
    readTime: '6 min read',
    author: 'MCSA Board',
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&h=400&fit=crop',
    snippet: 'Learn about MCSA\'s strict background vetting, mandatory health screenings, and standard clinical guidelines designed to ensure safety in home care services.',
    content: `### Setting a New Benchmark for Care in Malaysia

In the past, private caregiving and home care in Malaysia operated with minimal standardization. Families hired independent caregivers without verified backgrounds or infectious disease clearances, running significant health risks.

MCSA was founded to solve this problem by establishing a unified, regulated clinical registry of caregivers.

### The Three Pillars of MCSA Licensure

To obtain a licensed MCSA Serial ID and digital membership card, every caregiver must satisfy three strict requirements:
1. **Mandatory Chest X-Ray TB Clearance**: Ensuring no active respiratory infections.
2. **Clinical Practical Competency Exams**: Validated at our certified training partner Caredemy.
3. **Background Checks**: Legal identity screening to ensure complete trust.

By requiring a RM350 annual licensing fee and clinical tracking, the union guarantees that every member remains up-to-date with modern safety SOPs.`
  }
];

const defaultTimeBankRewards = [
  {
    id: 'REWARD-1',
    title: 'Certified Confinement Caregiver Advanced Course (月子护理高级培训课程)',
    cost: 20,
    category: 'Course',
    partner: 'Caredemy',
    desc: 'Gain standard MCSA certification in postpartum care, newborn monitoring, and confinement diet plans.'
  },
  {
    id: 'REWARD-2',
    title: 'Basic First Aid & CPR Training (基础急救与 CPR 培训)',
    cost: 15,
    category: 'Course',
    partner: 'MCSA Academy',
    desc: 'Learn vital life-saving skills, emergency responses, and standard resuscitation procedures.'
  },
  {
    id: 'REWARD-3',
    title: '1-Hour Full Body Therapeutic Massage (1小时全身理疗按摩)',
    cost: 12,
    category: 'Wellness',
    partner: 'Health Oasis Retreat',
    desc: 'Redeem for a 60-minute relaxing session with professional physiotherapists.'
  },
  {
    id: 'REWARD-4',
    title: 'RM50 Grocery E-Voucher (RM50 连锁超市电子礼券)',
    cost: 10,
    category: 'Voucher',
    partner: 'Giant / Jaya Grocer Malaysia',
    desc: 'RM50 digital voucher valid for groceries and household purchases at any branch.'
  },
  {
    id: 'REWARD-5',
    title: 'Accredited Elder Companion SOP Manual (陪诊员实操标准手册)',
    cost: 5,
    category: 'Product',
    partner: 'MCSA Publishing',
    desc: 'A comprehensive handbook outlining medical escort steps, safety guidelines, and vital logs.'
  }
];

const defaultTimeBankVolunteers = [
  {
    id: 'VOL-101',
    name: 'Ah Qiang (李强)',
    email: 'qiang@timebank.com',
    phone: '012-9988112',
    nric: '940815-14-5221',
    status: 'Approved',
    categories: ['Elderly Support', 'Companionship'],
    credits: 8,
    rank: 'Silver Companion',
    badges: ['First Step', 'Elder Helper', 'Active Mind'],
    joinedDate: '2026-06-01'
  },
  {
    id: 'VOL-102',
    name: 'Fatimah Zakaria',
    email: 'fatimah@timebank.com',
    phone: '013-7766551',
    nric: '910512-08-5662',
    status: 'Approved',
    categories: ['Training', 'Teaching'],
    credits: 15,
    rank: 'Gold Caregiver',
    badges: ['First Step', 'Master Teacher', 'Community Pillar'],
    joinedDate: '2026-06-03'
  },
  {
    id: 'VOL-103',
    name: 'Tan Mei Ling',
    email: 'meiling@timebank.com',
    phone: '017-3344552',
    nric: '970204-10-5334',
    status: 'Pending',
    categories: ['General Service', 'Elderly Support'],
    credits: 0,
    rank: 'Bronze Companion',
    badges: [],
    joinedDate: '2026-06-14'
  }
];

const defaultTimeBankServiceRecords = [
  {
    id: 'CLAIM-1',
    volunteerEmail: 'qiang@timebank.com',
    volunteerName: 'Ah Qiang (李强)',
    activity: '陪同独居老人看诊 (Elderly Escort)',
    hours: 2,
    date: '2026-06-05',
    desc: 'Accompanied Grandpa Chen to HKL cardiology outpatient checkup for 2 hours, guided through pharmacy.',
    status: 'Approved',
    approvedBy: 'Admin'
  },
  {
    id: 'CLAIM-2',
    volunteerEmail: 'qiang@timebank.com',
    volunteerName: 'Ah Qiang (李强)',
    activity: '社区中心清洁服务 (Community Cleaning)',
    hours: 3,
    date: '2026-06-10',
    desc: 'Cleaned community senior activity center, wiped windows and chairs for 3 hours.',
    status: 'Approved',
    approvedBy: 'Admin'
  },
  {
    id: 'CLAIM-3',
    volunteerEmail: 'fatimah@timebank.com',
    volunteerName: 'Fatimah Zakaria',
    activity: '教导长者智能手机使用课程 (Teaching Mobile Use)',
    hours: 15,
    date: '2026-06-06',
    desc: 'Conducted a 15-hour basic course for seniors on how to use WhatsApp, check MySejahtera, and pay utility bills.',
    status: 'Approved',
    approvedBy: 'Admin'
  },
  {
    id: 'CLAIM-4',
    volunteerEmail: 'qiang@timebank.com',
    volunteerName: 'Ah Qiang (李强)',
    activity: '长者日常陪伴与聊天 (Elderly Companionship)',
    hours: 3,
    date: '2026-06-14',
    desc: 'Visited Grandma Lee, played Chinese chess with her for 3 hours.',
    status: 'Pending',
    approvedBy: ''
  }
];

const defaultTimeBankRedemptionRecords = [
  {
    id: 'RED-1',
    volunteerEmail: 'qiang@timebank.com',
    volunteerName: 'Ah Qiang (李强)',
    rewardId: 'REWARD-5',
    rewardTitle: 'Accredited Elder Companion SOP Manual (陪诊员实操标准手册)',
    cost: 5,
    date: '2026-06-12',
    status: 'Completed'
  }
];

const defaultTimeBankAuditLogs = [
  {
    id: 'AUDIT-1',
    volunteerEmail: 'qiang@timebank.com',
    type: 'Earn',
    amount: 2,
    desc: 'Hours claim approved: 陪同独居老人看诊 (Elderly Escort)',
    date: '2026-06-05T10:00:00Z'
  },
  {
    id: 'AUDIT-2',
    volunteerEmail: 'qiang@timebank.com',
    type: 'Earn',
    amount: 3,
    desc: 'Hours claim approved: 社区中心清洁服务 (Community Cleaning)',
    date: '2026-06-10T14:30:00Z'
  },
  {
    id: 'AUDIT-3',
    volunteerEmail: 'fatimah@timebank.com',
    type: 'Earn',
    amount: 15,
    desc: 'Hours claim approved: 教导长者智能手机使用课程 (Teaching Mobile Use)',
    date: '2026-06-06T17:00:00Z'
  },
  {
    id: 'AUDIT-4',
    volunteerEmail: 'qiang@timebank.com',
    type: 'Redeem',
    amount: 5,
    desc: 'Redeemed: Accredited Elder Companion SOP Manual (陪诊员实操标准手册)',
    date: '2026-06-12T11:15:00Z'
  }
];

// Helper to check window environment
const isClient = () => typeof window !== 'undefined';

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    url && url !== 'https://placeholder-url.supabase.co' &&
    key && key !== 'placeholder-anon-key-string'
  );
};

// User-Specific Key Partitioning config
export let currentUser: any = null;

const userSpecificKeys = [
  'mcsa_active_escort_session',
  'mcsa_active_confinement_session',
  'mcsa_active_elder_session',
  'mcsa_logged_member',
  'mcsa_client_email'
];

const getPartitionedKey = (key: string): string => {
  if (userSpecificKeys.includes(key) && currentUser) {
    return `${key}_${currentUser.id}`;
  }
  return key;
};

// Pull synchronized data from Supabase
export const pullFromCloud = async () => {
  if (!isClient() || !isSupabaseConfigured()) return;
  try {
    const { data, error } = await supabase.from('mcs_store').select('*');
    if (!error && data) {
      data.forEach((row) => {
        localStorage.setItem(row.key, JSON.stringify(row.value));
      });
      console.log('🔄 MCSA Cloud Sync: Pulled and synced data from Supabase.');
    } else if (error) {
      console.error('🔄 MCSA Cloud Sync pull error:', error.message);
    }
  } catch (err) {
    console.error('🔄 MCSA Cloud Sync pull exception:', err);
  }
};

// Initialize session state from localStorage synchronously
if (isClient()) {
  const savedUser = localStorage.getItem('mcsa_auth_user');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
    } catch (e) {}
  }

  // Subscribe to authentication changes
  if (isSupabaseConfigured()) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        window.location.href = '/reset-password' + window.location.hash;
        return;
      }
      if (session?.user) {
        currentUser = session.user;
        localStorage.setItem('mcsa_auth_user', JSON.stringify(session.user));
        pullFromCloud();
      } else {
        currentUser = null;
        localStorage.removeItem('mcsa_auth_user');
      }
    });
  }
}

// Initial fetch from cloud
if (isClient() && isSupabaseConfigured()) {
  pullFromCloud();
}

export const getStore = (key: string, defaultValue: any) => {
  if (!isClient()) return defaultValue;
  try {
    const mappedKey = getPartitionedKey(key);
    const stored = localStorage.getItem(mappedKey);
    if (!stored) {
      localStorage.setItem(mappedKey, JSON.stringify(defaultValue));
      return defaultValue;
    }
    const parsed = JSON.parse(stored);
    if (parsed === null || parsed === undefined) {
      return defaultValue;
    }
    if (Array.isArray(defaultValue)) {
      if (!Array.isArray(parsed)) return defaultValue;
      return parsed.filter(item => item !== null && item !== undefined);
    }
    if (typeof defaultValue === 'object' && defaultValue !== null) {
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return defaultValue;
      }
    }
    return parsed;
  } catch (e) {
    console.error('getStore error:', e);
    return defaultValue;
  }
};

export const setStore = (key: string, val: any) => {
  if (!isClient()) return;
  try {
    const mappedKey = getPartitionedKey(key);
    localStorage.setItem(mappedKey, JSON.stringify(val));

    // Sync to Supabase in background
    if (isSupabaseConfigured()) {
      supabase
        .from('mcs_store')
        .upsert({ 
          key: mappedKey, 
          value: val, 
          user_id: currentUser ? currentUser.id : null,
          updated_at: new Date().toISOString() 
        })
        .then(({ error }) => {
          if (error) {
            console.error(`🔄 MCSA Cloud Sync Error for key "${mappedKey}":`, error.message);
          } else {
            console.log(`🔄 MCSA Cloud Sync: Successfully synced key "${mappedKey}".`);
          }
        });
    }
  } catch (e) {
    console.error('setStore error:', e);
    if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      alert('⚠️ Browser LocalStorage storage quota exceeded! The file you uploaded is too large. Please upload a smaller image (< 500 KB) or delete old items.\n\n⚠️ 浏览器本地存储已满！上传文件过大，请选择更小的图片（建议 500KB 以下）或删除不需要的历史文件。');
    } else {
      alert('⚠️ Error saving data / 保存数据失败: ' + (e as Error).message);
    }
  }
};

export const appendStore = async (key: string, newItem: any) => {
  if (!isClient()) return;
  const mappedKey = getPartitionedKey(key);
  try {
    let localList = [];
    try {
      const stored = localStorage.getItem(mappedKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          localList = parsed.filter(item => item !== null && item !== undefined);
        }
      }
    } catch (e) {}

    const getItemUniqueKey = (item: any) => {
      if (!item) return Math.random().toString();
      return item.id || item.email || item.title || item.member_number || JSON.stringify(item);
    };

    const newItemKey = getItemUniqueKey(newItem);
    let updatedLocalList = localList.filter((item: any) => getItemUniqueKey(item) !== newItemKey);
    updatedLocalList.push(newItem);
    
    localStorage.setItem(mappedKey, JSON.stringify(updatedLocalList));

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('mcs_store')
        .select('value')
        .eq('key', mappedKey);

      let finalMergedList = updatedLocalList;
      if (!error && data && data.length > 0 && Array.isArray(data[0].value)) {
        const dbVal = data[0].value;
        const map = new Map();
        
        dbVal.forEach((item: any) => {
          if (item) map.set(getItemUniqueKey(item), item);
        });
        
        updatedLocalList.forEach((item: any) => {
          if (item) map.set(getItemUniqueKey(item), item);
        });

        finalMergedList = Array.from(map.values());
      }

      localStorage.setItem(mappedKey, JSON.stringify(finalMergedList));

      const { error: upsertError } = await supabase
        .from('mcs_store')
        .upsert({
          key: mappedKey,
          value: finalMergedList,
          user_id: currentUser ? currentUser.id : null,
          updated_at: new Date().toISOString()
        });
      
      if (upsertError) {
        console.error(`🔄 MCSA Cloud Sync append Error for key "${mappedKey}":`, upsertError.message);
      } else {
        console.log(`🔄 MCSA Cloud Sync append: Successfully merged & synced "${mappedKey}".`);
      }
    }
  } catch (err) {
    console.error(`Error in appendStore for key "${mappedKey}":`, err);
  }
};

export const store = {
  pullFromCloud: pullFromCloud,
  appendPendingMember: (member: any) => appendStore('mcsa_pending', member),
  appendInquiry: (inquiry: any) => appendStore('mcsa_inquiries', inquiry),
  appendCareRequest: (request: any) => appendStore('mcsa_care_requests', request),
  signUp: async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }
    return await supabase.auth.signUp({ email, password });
  },
  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (res.data?.user) {
      currentUser = res.data.user;
      localStorage.setItem('mcsa_auth_user', JSON.stringify(res.data.user));
      await pullFromCloud();
    }
    return res;
  },
  signOut: async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    currentUser = null;
    localStorage.removeItem('mcsa_auth_user');
    // Clear user-specific keys and their partitioned values
    userSpecificKeys.forEach((k) => {
      localStorage.removeItem(k);
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const localKey = localStorage.key(i);
        if (localKey && localKey.startsWith(k)) {
          localStorage.removeItem(localKey);
        }
      }
    });
    localStorage.removeItem('mcsa_logged_member');
    localStorage.removeItem('mcsa_client_email');
    localStorage.removeItem('mcsa_logged_admin_email');
  },
  getCurrentUser: () => {
    return currentUser;
  },
  getLanguage: () => {
    if (!isClient()) return 'en';
    return localStorage.getItem('mcsa_lang') || 'en';
  },
  setLanguage: (lang: string) => {
    if (!isClient()) return;
    localStorage.setItem('mcsa_lang', lang);
  },

  getPendingMembers: () => {
    const list = getStore('mcsa_pending', defaultPendingMembers);
    if (!Array.isArray(list)) return [];
    const validList = list.filter(m => m && typeof m === 'object');
    if (isClient() && !validList.some((m: any) => m.email === 'siewlan@mcsa.com.my')) {
      const siewlan = {
        id: 'APP-105',
        name: 'Wong Siew Lan (黄秀兰)',
        category: 'Confinement Care, Patient Companion',
        nric: '850412-14-5896',
        email: 'siewlan@mcsa.com.my',
        phone: '012-3456789',
        exp: '6 yrs',
        location: 'Puchong, Selangor',
        bio: 'Experienced confinement nanny (月嫂) and medical outpatient companion (陪诊员). Fluent in Mandarin and Cantonese.',
        proof: 'Mock_Confinement_Escort_Cert.pdf',
        healthCert: 'Health_Vetted_2026.pdf',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop'
      };
      const updated = [...validList, siewlan];
      localStorage.setItem('mcsa_pending', JSON.stringify(updated));
      return updated;
    }
    return validList;
  },
  setPendingMembers: (members: any) => setStore('mcsa_pending', members),
  
  getUnionMembers: () => getStore('mcsa_union_members', defaultUnionMembers),
  setUnionMembers: (members: any) => setStore('mcsa_union_members', members),
  
  getInquiries: () => getStore('mcsa_inquiries', defaultInquiries),
  setInquiries: (inquiries: any) => setStore('mcsa_inquiries', inquiries),
  
  getCareRequests: () => {
    const list = getStore('mcsa_care_requests', defaultCareRequests);
    if (!Array.isArray(list)) return [];
    const validList = list.filter(r => r && typeof r === 'object');
    let modified = false;
    const migrated = validList.map((r: any) => {
      let updated = { ...r };
      if (!r.email) {
        updated.email = r.contact && r.contact.includes('@') ? r.contact : `${(r.name || 'client').toLowerCase().replace(/\s+/g, '')}@mcsa.com.my`;
        modified = true;
      }
      if (!r.accessKey) {
        updated.accessKey = r.id === 'REQ-01' ? '123456' : r.id === 'REQ-02' ? '654321' : Math.floor(100000 + Math.random() * 900000).toString();
        modified = true;
      }
      return updated;
    });
    if (modified && typeof window !== 'undefined') {
      localStorage.setItem('mcsa_care_requests', JSON.stringify(migrated));
    }
    return migrated;
  },
  setCareRequests: (requests: any) => setStore('mcsa_care_requests', requests),
  
  getLibItems: () => getStore('mcsa_lib_items', defaultLibItems),
  setLibItems: (items: any) => setStore('mcsa_lib_items', items),

  getAnnouncements: () => getStore('mcsa_announcements', defaultAnnouncements),
  setAnnouncements: (announcements: any) => setStore('mcsa_announcements', announcements),

  getActivityPhotos: () => getStore('mcsa_activity_photos', defaultActivityPhotos),
  setActivityPhotos: (photos: any) => setStore('mcsa_activity_photos', photos),

  getEscortForms: () => getStore('mcsa_escort_forms', defaultEscortForms),
  setEscortForms: (forms: any) => setStore('mcsa_escort_forms', forms),

  getActiveEscortSession: () => getStore('mcsa_active_escort_session', defaultEscortSession),
  setActiveEscortSession: (session: any) => setStore('mcsa_active_escort_session', session),

  getActiveConfinementSession: () => getStore('mcsa_active_confinement_session', defaultConfinementSession),
  setActiveConfinementSession: (session: any) => setStore('mcsa_active_confinement_session', session),

  getActiveElderSession: () => getStore('mcsa_active_elder_session', defaultElderSession),
  setActiveElderSession: (session: any) => setStore('mcsa_active_elder_session', session),

  getConfinementContracts: () => getStore('mcsa_confinement_contracts', defaultConfinementContracts),
  setConfinementContracts: (contracts: any) => setStore('mcsa_confinement_contracts', contracts),

  getElderlyContracts: () => getStore('mcsa_elderly_contracts', defaultElderlyContracts),
  setElderlyContracts: (contracts: any) => setStore('mcsa_elderly_contracts', contracts),

  getStandardAdminPassword: () => {
    if (!isClient()) return 'CARE8268';
    return localStorage.getItem('mcsa_standard_admin_password') || 'CARE8268';
  },
  setStandardAdminPassword: (password: string) => {
    if (!isClient()) return;
    localStorage.setItem('mcsa_standard_admin_password', password);
  },

  getFooterInfo: () => getStore('mcsa_footer_info', {
    address: 'KL Sentral Business Suites, Kuala Lumpur',
    phone: '+60 3-2274 9988',
    email: 'registry@mcsa.com.my',
    desc: 'Accrediting and dispatching certified healthcare companions, confinement caregivers, and elder escorts across Malaysia.'
  }),
  setFooterInfo: (info: any) => setStore('mcsa_footer_info', info),

  getBlogPosts: () => getStore('mcsa_blog_posts', defaultBlogPosts),
  setBlogPosts: (posts: any) => setStore('mcsa_blog_posts', posts),

  getVolunteers: () => getStore('mcsa_timebank_volunteers', defaultTimeBankVolunteers),
  setVolunteers: (volunteers: any) => setStore('mcsa_timebank_volunteers', volunteers),
  appendVolunteer: (volunteer: any) => appendStore('mcsa_timebank_volunteers', volunteer),

  getServiceRecords: () => getStore('mcsa_timebank_service_records', defaultTimeBankServiceRecords),
  setServiceRecords: (records: any) => setStore('mcsa_timebank_service_records', records),
  appendServiceRecord: (record: any) => appendStore('mcsa_timebank_service_records', record),

  getRedemptionRecords: () => getStore('mcsa_timebank_redemption_records', defaultTimeBankRedemptionRecords),
  setRedemptionRecords: (records: any) => setStore('mcsa_timebank_redemption_records', records),
  appendRedemptionRecord: (record: any) => appendStore('mcsa_timebank_redemption_records', record),

  getRewards: () => getStore('mcsa_timebank_rewards', defaultTimeBankRewards),
  setRewards: (rewards: any) => setStore('mcsa_timebank_rewards', rewards),

  getAuditLogs: () => getStore('mcsa_timebank_audit_logs', defaultTimeBankAuditLogs),
  setAuditLogs: (logs: any) => setStore('mcsa_timebank_audit_logs', logs),
  appendAuditLog: (log: any) => appendStore('mcsa_timebank_audit_logs', log),

  resetDatabase: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('mcsa_pending');
    localStorage.removeItem('mcsa_union_members');
    localStorage.removeItem('mcsa_inquiries');
    localStorage.removeItem('mcsa_care_requests');
    localStorage.removeItem('mcsa_lib_items');
    localStorage.removeItem('mcsa_announcements');
    localStorage.removeItem('mcsa_activity_photos');
    localStorage.removeItem('mcsa_escort_forms');
    localStorage.removeItem('mcsa_active_escort_session');
    localStorage.removeItem('mcsa_active_confinement_session');
    localStorage.removeItem('mcsa_active_elder_session');
    localStorage.removeItem('mcsa_confinement_contracts');
    localStorage.removeItem('mcsa_elderly_contracts');
    localStorage.removeItem('mcsa_footer_info');
    localStorage.removeItem('mcsa_calendar_appointments');
    localStorage.removeItem('mcsa_blog_posts');
    localStorage.removeItem('mcsa_timebank_volunteers');
    localStorage.removeItem('mcsa_timebank_service_records');
    localStorage.removeItem('mcsa_timebank_redemption_records');
    localStorage.removeItem('mcsa_timebank_rewards');
    localStorage.removeItem('mcsa_timebank_audit_logs');

    // Clear in cloud if Supabase is active
    if (isSupabaseConfigured()) {
      supabase
        .from('mcs_store')
        .delete()
        .in('key', [
          'mcsa_pending', 'mcsa_union_members', 'mcsa_inquiries', 'mcsa_care_requests',
          'mcsa_lib_items', 'mcsa_announcements', 'mcsa_activity_photos', 'mcsa_escort_forms',
          'mcsa_active_escort_session', 'mcsa_active_confinement_session', 'mcsa_active_elder_session',
          'mcsa_confinement_contracts', 'mcsa_elderly_contracts', 'mcsa_footer_info',
          'mcsa_calendar_appointments', 'mcsa_blog_posts',
          'mcsa_timebank_volunteers', 'mcsa_timebank_service_records',
          'mcsa_timebank_redemption_records', 'mcsa_timebank_rewards', 'mcsa_timebank_audit_logs'
        ])
        .then(() => {
          window.location.reload();
        });
    } else {
      window.location.reload();
    }
  }
};

