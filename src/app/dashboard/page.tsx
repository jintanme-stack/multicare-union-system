'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Heart, Shield, RefreshCw, FileText, Download, CheckSquare, Clock, MapPin, Activity, User, BookOpen, Trash2, TrendingUp, Share2, Check, X, PlusCircle, ShieldAlert, AlertCircle, LayoutDashboard } from 'lucide-react';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';
import Lightbox from '@/components/Lightbox';

const defaultCalendarAppts = [
  // Escort appointments
  {
    id: 'appt-esc-1',
    role: 'escort',
    date: '2026-06-04',
    time: '10:30 AM',
    clientName: 'Grandpa Zhang (张爷爷)',
    location: 'Hospital Kuala Lumpur (HKL) - Cardiology Dept',
    details: 'Occasional palpitations. Needs escort guide for cardiology clinic building escalators.',
    status: 'Completed'
  },
  {
    id: 'appt-esc-2',
    role: 'escort',
    date: '2026-06-05',
    time: '09:00 AM',
    clientName: '王大爷 (Mr. Wang)',
    location: '市第一人民医院 (No.1 People\'s Hospital)',
    details: 'Live tracking appointment. Cardiology Dept consultation.',
    status: 'In Progress'
  },
  {
    id: 'appt-esc-3',
    role: 'escort',
    date: '2026-06-10',
    time: '14:00 PM',
    clientName: 'Puan Aminah',
    location: 'Pantai Hospital KL - Orthopedics',
    details: 'Routine post-surgery leg checkup.',
    status: 'Scheduled'
  },
  {
    id: 'appt-esc-4',
    role: 'escort',
    date: '2026-06-18',
    time: '08:30 AM',
    clientName: 'Mr. Tan Ah Teck',
    location: 'Tung Shin Hospital - Geriatrics',
    details: 'Routine general geriatric assessment and eye exam.',
    status: 'Scheduled'
  },
  {
    id: 'appt-esc-5',
    role: 'escort',
    date: '2026-06-25',
    time: '10:00 AM',
    clientName: 'Madam Lim',
    location: 'Gleneagles KL - Endocrinology',
    details: 'Diabetes follow-up and blood test results review.',
    status: 'Scheduled'
  },
  // Maternity appointments
  {
    id: 'appt-mat-1',
    role: 'maternity',
    date: '2026-06-04',
    time: '08:00 AM',
    clientName: 'Madam Chen & Baby LeLe',
    location: 'Puchong Residency',
    details: 'Daily neonatal bath, morning feeding logging, sleep checking, jaundice levels measurement.',
    status: 'Completed'
  },
  {
    id: 'appt-mat-2',
    role: 'maternity',
    date: '2026-06-05',
    time: '09:30 AM',
    clientName: 'Siti Nur & Baby Daniel',
    location: 'Ampang Jaya Residential',
    details: 'Breastfeeding and latching support, lactation consultation, cord care inspection.',
    status: 'Scheduled'
  },
  {
    id: 'appt-mat-3',
    role: 'maternity',
    date: '2026-06-12',
    time: '11:00 AM',
    clientName: 'Mrs. Wong & Baby Chloe',
    location: 'Cheras Height Condominium',
    details: 'Postpartum herbal bath preparation, mother diet plan review, baby tummy time exercise.',
    status: 'Scheduled'
  },
  {
    id: 'appt-mat-4',
    role: 'maternity',
    date: '2026-06-20',
    time: '15:00 PM',
    clientName: 'Madam Chen & Baby LeLe',
    location: 'Puchong Residency',
    details: 'Follow-up jaundice checks and infant massage instruction.',
    status: 'Scheduled'
  },
  {
    id: 'appt-mat-5',
    role: 'maternity',
    date: '2026-06-28',
    time: '09:00 AM',
    clientName: 'Mrs. Lee & Twins',
    location: 'Mont Kiara Residential',
    details: 'Twin feeding cycle optimization, sleep logging, general postpartum checklist auditing.',
    status: 'Scheduled'
  },
  // Elderly appointments
  {
    id: 'appt-eld-1',
    role: 'elderly',
    date: '2026-06-04',
    time: '09:00 AM',
    clientName: 'Mr. Tan Ah Teck',
    location: 'Bukit Bintang Home Site',
    details: 'Vitals logging (systolic/sugar/temp), garden walk, memory game exercises.',
    status: 'Completed'
  },
  {
    id: 'appt-eld-2',
    role: 'elderly',
    date: '2026-06-05',
    time: '14:00 PM',
    clientName: 'Uncle Lim',
    location: 'Jalan Ipoh Elderly Apartment',
    details: 'Joint stretching exercises, assist bathing, log medicine administration.',
    status: 'Scheduled'
  },
  {
    id: 'appt-eld-3',
    role: 'elderly',
    date: '2026-06-15',
    time: '10:30 AM',
    clientName: 'Grandma Loke',
    location: 'Subang Jaya Care Site',
    details: 'Cognitive memory training, verify stroke rehabilitation exercise compliance.',
    status: 'Scheduled'
  },
  {
    id: 'appt-eld-4',
    role: 'elderly',
    date: '2026-06-22',
    time: '16:00 PM',
    clientName: 'Mr. Tan Ah Teck',
    location: 'Bukit Bintang Home Site',
    details: 'Bi-weekly bedsores assessment, assist with wheelchair transfer, check vitals.',
    status: 'Scheduled'
  },
  {
    id: 'appt-eld-5',
    role: 'elderly',
    date: '2026-06-29',
    time: '13:30 PM',
    clientName: 'Auntie Fatimah',
    location: 'Kepong Village Residence',
    details: 'Blood sugar tracking (fasting vs post-meal), log hypertension medication, review fall risk parameters.',
    status: 'Scheduled'
  }
];

export default function CaregiverDashboard() {
  const [activeTab, setActiveTab] = useState<'live' | 'timeline' | 'vitals' | 'maternity' | 'library' | 'card' | 'escortForm' | 'confinementContract' | 'elderlyContract'>('live');
  const [selectedRole, setSelectedRole] = useState<'escort' | 'maternity' | 'elderly' | 'babysitter'>('elderly');

  // Live Checklist State
  const [liveChecklist, setLiveChecklist] = useState<Record<string, { id: number, text: string, checked: boolean }[]>>({
    elderly: [
      { id: 1, text: 'Verify patient identity, clinical care plan and emergency contacts', checked: true },
      { id: 2, text: 'Measure morning blood pressure, heart rate, and body temperature', checked: true },
      { id: 3, text: 'Administer hypertension and diabetes medications after morning meal', checked: true },
      { id: 4, text: 'Remind patient to take afternoon meds after lunch', checked: false },
      { id: 5, text: 'Assist patient with wheelchair transfer and daily stretching exercises', checked: false },
      { id: 6, text: 'Log memory game performance and check skin for bedsore warning areas', checked: false }
    ],
    maternity: [
      { id: 1, text: 'Verify mother & baby identity and check postpartum care profile', checked: true },
      { id: 2, text: 'Prepare morning herbal confinement bath for the mother', checked: true },
      { id: 3, text: 'Clean baby\'s umbilical cord area and apply recovery ointment', checked: true },
      { id: 4, text: 'Log morning baby feeding volume (formula/breast milk)', checked: false },
      { id: 5, text: 'Measure baby\'s body temperature and check jaundice forehead index', checked: false },
      { id: 6, text: 'Prepare lunch confinement meal & assist mother with breast feeding latching', checked: false }
    ],
    escort: [
      { id: 1, text: 'Verify patient identity and emergency contacts / 核对患者身份与紧急联系人', checked: true },
      { id: 2, text: 'Meet patient at hospital lobby / 于医院大厅接诊患者', checked: false },
      { id: 3, text: 'Assist with registration & queue / 协助挂号与排队候诊', checked: false },
      { id: 4, text: 'Accompany doctor consultation & log notes / 陪同看诊并记录医嘱', checked: false },
      { id: 5, text: 'Assist with payment & pharmacy / 协助缴费与取药', checked: false },
      { id: 6, text: 'Safely checkout & guide patient home / 诊毕送回并安全交接', checked: false }
    ],
    babysitter: [
      { id: 1, text: 'Confirm arrival time, feeding schedules & baby formula rules / 确认接岗时间、喂奶周期与奶粉冲调比例', checked: true },
      { id: 2, text: 'Prepare baby bottles & sterilize feeding equipment / 准备奶瓶并进行消毒处理', checked: false },
      { id: 3, text: 'Feed infant & perform burping routine / 喂奶并完成拍嗝', checked: false },
      { id: 4, text: 'Assist with baby bathing & change diapers / 协助婴儿洗澡与更换纸尿裤', checked: false },
      { id: 5, text: 'Perform tummy time & sensory play / 进行趴撑练习与感官互动游戏', checked: false },
      { id: 6, text: 'Sanitize play area & check baby body temperature / 消毒玩具及活动区域，测量婴儿体温', checked: false }
    ]
  });

  const toggleLiveChecklist = (role: 'elderly' | 'maternity' | 'escort' | 'babysitter', id: number) => {
    setLiveChecklist(prev => ({
      ...prev,
      [role]: prev[role].map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    }));
  };
  const [lang, setLang] = useState<Language>('en');
  const [member, setMember] = useState<any>(null);
  const isRehab = (member?.category || '').includes('Rehabilitation');


  const [careRequests, setCareRequests] = useState<any[]>([]);
  const [libItems, setLibItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedMapItem, setSelectedMapItem] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [escortForms, setEscortForms] = useState<any[]>([]);

  // Calendar states
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(5); // June is 5 (0-indexed)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-06-05');
  const [calendarAppointments, setCalendarAppointments] = useState<any[]>([]);
  const [showAddApptModal, setShowAddApptModal] = useState<boolean>(false);
  const [activeEscortTrackingId, setActiveEscortTrackingId] = useState<string | null>(null);

  // Confinement Contract Mode and Fields
  const [confinementContracts, setConfinementContracts] = useState<any[]>([]);
  const [confinementFormMode, setConfinementFormMode] = useState<'list' | 'create' | 'view'>('list');
  const [currentViewConfinementContract, setCurrentViewConfinementContract] = useState<any>(null);

  const [confinementBankName, setConfinementBankName] = useState('Maybank');
  const [confinementAccountName, setConfinementAccountName] = useState('');
  const [confinementAccountNumber, setConfinementAccountNumber] = useState('11422334455');
  const [confinementDuitNow, setConfinementDuitNow] = useState('');
  const [confinementServiceFee, setConfinementServiceFee] = useState('6800');
  const [confinementDeposit, setConfinementDeposit] = useState('2000');
  const [confinementBalance, setConfinementBalance] = useState('4800');

  // Elderly Contract Mode and Fields
  const [elderlyContracts, setElderlyContracts] = useState<any[]>([]);
  const [elderlyFormMode, setElderlyFormMode] = useState<'list' | 'create' | 'view'>('list');
  const [currentViewElderlyContract, setCurrentViewElderlyContract] = useState<any>(null);

  const [elderlyBankName, setElderlyBankName] = useState('CIMB Bank');
  const [elderlyAccountName, setElderlyAccountName] = useState('');
  const [elderlyAccountNumber, setElderlyAccountNumber] = useState('');
  const [elderlyDuitNow, setElderlyDuitNow] = useState('');
  const [elderlyServiceDate, setElderlyServiceDate] = useState('');
  const [elderlyServiceHours, setElderlyServiceHours] = useState('9:00 AM - 5:00 PM');
  const [elderlyServiceFee, setElderlyServiceFee] = useState('4500');
  const [elderlyDeposit, setElderlyDeposit] = useState('1500');
  const [elderlyBalance, setElderlyBalance] = useState('3000');

  // Escort Form Mode and Fields
  const [formMode, setFormMode] = useState<'list' | 'create' | 'view'>('list');
  const [currentViewForm, setCurrentViewForm] = useState<any>(null);

  const [formFullName, setFormFullName] = useState('');
  const [formGender, setFormGender] = useState('Male');
  const [formDob, setFormDob] = useState('');
  const [formNric, setFormNric] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formEmergencyName, setFormEmergencyName] = useState('');
  const [formEmergencyPhone, setFormEmergencyPhone] = useState('');
  const [formRelationship, setFormRelationship] = useState('');
  const [formApptDate, setFormApptDate] = useState('');
  const [formApptTime, setFormApptTime] = useState('');
  const [formFacility, setFormFacility] = useState('');
  const [formDoctor, setFormDoctor] = useState('');
  const [formSpecialty, setFormSpecialty] = useState('');
  const [formAssist, setFormAssist] = useState(false);
  const [formComplaint, setFormComplaint] = useState('');
  const [formHistory, setFormHistory] = useState<string[]>([]);
  const [formDrugAllergy, setFormDrugAllergy] = useState('No Known Drug Allergy');
  const [formFoodAllergy, setFormFoodAllergy] = useState('No');
  const [formOtherAllergy, setFormOtherAllergy] = useState('No');
  const [formTakingMeds, setFormTakingMeds] = useState(false);
  const [formMedsList, setFormMedsList] = useState('');
  const [formSurgicalHistory, setFormSurgicalHistory] = useState('');
  const [formMobility, setFormMobility] = useState('Walk Independently');
  const [formHearing, setFormHearing] = useState(false);
  const [formSpeech, setFormSpeech] = useState(false);
  const [formVisual, setFormVisual] = useState('');
  const [formAdditional, setFormAdditional] = useState('');
  const [formSigned, setFormSigned] = useState('');
  const [formSignedDate, setFormSignedDate] = useState('');

  // Receipt generator states
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptAppt, setReceiptAppt] = useState<any>(null);
  const [receiptFee, setReceiptFee] = useState('180');
  const [clientNric, setClientNric] = useState('');
  const [providerNric, setProviderNric] = useState('');

  const openReceiptGenerator = (appt: any) => {
    setReceiptAppt(appt);
    setReceiptFee('180');
    setClientNric('');
    setProviderNric(member?.nric || '830812-14-5544');
    setShowReceiptModal(true);
  };

  // Custom booking form state
  const [newApptClient, setNewApptClient] = useState('');
  const [newApptTime, setNewApptTime] = useState('09:00 AM');
  const [newApptLocation, setNewApptLocation] = useState('');
  const [newApptDetails, setNewApptDetails] = useState('');
  const [newApptStatus, setNewApptStatus] = useState('Scheduled');

  // Membership Renewal Modal States
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalYears, setRenewalYears] = useState(1);
  const [renewalMethod, setRenewalMethod] = useState('banking');
  const [paymentAccount, setPaymentAccount] = useState('');
  const [paymentExpiry, setPaymentExpiry] = useState('');
  const [paymentCVV, setPaymentCVV] = useState('');
  const [isRenewing, setIsRenewing] = useState(false);


  // Escort Tracking Session (实时就医进度与材料分享)
  const [escortSession, setEscortSession] = useState<any>({
    patientName: "王大爷 (Mr. Wang)",
    patientAge: 78,
    patientId: "2026-2050333",
    hospital: "市第一人民医院 (No.1 People's Hospital)",
    department: "心血管内科 (Cardiology Dept)",
    statusIndex: 2,
    doctorNote: "",
    revisitDate: "2026-06-20",
    uploadedPhotos: [],
    isShared: false
  });


  // Vitals State
  const [systolic, setSystolic] = useState('130');
  const [sugar, setSugar] = useState('5.6');
  const [pulse, setPulse] = useState('72');
  const [vitalLogs, setVitalLogs] = useState([
    { id: '1', bp: '130/82 mmHg', sugar: '5.6 mmol/L', pulse: '72 bpm', status: 'Normal', time: '08:30' },
    { id: '2', bp: '134/84 mmHg', sugar: '6.2 mmol/L', pulse: '75 bpm', status: 'Normal', time: '12:30' }
  ]);

  // Confinement Session state
  const [confinementSession, setConfinementSession] = useState<any>({
    babyName: "LeLe (乐乐)",
    babyAgeDays: 15,
    nannyName: "Meizhen Chen",
    dateString: "2026-06-04",
    lastUpdated: "22:45",
    isShared: false,
    feedingLog: [],
    diaperRecord: [],
    sleepActivity: { sleepLogs: [], activities: {} },
    healthCheck: {}
  });

  // Feeding Form states
  const [feedTime, setFeedTime] = useState('06:00');
  const [feedType, setFeedType] = useState('Formula');
  const [breastLeftMins, setBreastLeftMins] = useState('15');
  const [breastRightMins, setBreastRightMins] = useState('15');
  const [feedFormulaMl, setFeedFormulaMl] = useState('90');

  // Diaper Form states
  const [diaperTime, setDiaperTime] = useState('08:00');
  const [diaperUrine, setDiaperUrine] = useState('Medium');
  const [diaperStoolColor, setDiaperStoolColor] = useState('Gold');
  const [diaperTexture, setDiaperTexture] = useState('Mushy');
  const [diaperAmount, setDiaperAmount] = useState('Medium');
  const [diaperNotes, setDiaperNotes] = useState('');

  // Sleep states
  const [sleepEnter, setSleepEnter] = useState('06:00 AM');
  const [sleepExit, setSleepExit] = useState('09:30 AM');

  // Health Vitals states
  const [healthTemp, setHealthTemp] = useState('36.6');
  const [jaundiceForehead, setJaundiceForehead] = useState('8.2');
  const [jaundiceChest, setJaundiceChest] = useState('7.5');
  const [jaundiceCheeks, setJaundiceCheeks] = useState('8.0');
  const [umbilicalStatus, setUmbilicalStatus] = useState('Dry & Healing');

  // Modals state
  const [showChartsModal, setShowChartsModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedApptToAdjust, setSelectedApptToAdjust] = useState<any | null>(null);
  const [adjustDate, setAdjustDate] = useState('');
  const [adjustTime, setAdjustTime] = useState('');
  const [adjustDetails, setAdjustDetails] = useState('');
  const [showEscortReportModal, setShowEscortReportModal] = useState(false);

  // Senior Health / Elder Session state
  const [elderSession, setElderSession] = useState<any>({
    patientName: "Tan Ah Teck",
    patientAge: 78,
    dayNumber: 312,
    dateString: "2026-06-04",
    lastUpdated: "23:15",
    isShared: false,
    medications: [],
    risks: { fallRisk: "Medium", bedsores: "None", cognitiveStatus: "Normal" },
    vitals: { bp: "128/82", bloodSugar: "6.2", sugarType: "Fasting", heartRate: "74", bodyTemp: "36.6" },
    activities: []
  });

  // Medication Form states
  const [medTime, setMedTime] = useState('08:00 AM');
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medAdministered, setMedAdministered] = useState<boolean>(true);

  // Vitals Monitor Form states
  const [elderBP, setElderBP] = useState('128/82');
  const [elderBloodSugar, setElderBloodSugar] = useState('6.2');
  const [elderSugarType, setElderSugarType] = useState('Fasting');
  const [elderHeartRate, setElderHeartRate] = useState('74');
  const [elderBodyTemp, setElderBodyTemp] = useState('36.6');

  // Modal visual charts state for Elder Care
  const [showElderChartsModal, setShowElderChartsModal] = useState(false);
  const [showElderReportModal, setShowElderReportModal] = useState(false);

  // Appointments
  const [appointments, setAppointments] = useState([
    { id: '1', time: '2026-06-04 10:30', hospital: 'Hospital Kuala Lumpur (HKL)', dept: 'Cardiology Dept', symptoms: 'Occasional palpitations' }
  ]);

  // Lightbox and Image Upload States & Handlers
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState<{ url: string; caption?: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Image Compression helper
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleEscortPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      let photos = [...(escortSession.uploadedPhotos || [])];
      while (photos.length <= index) {
        photos.push("");
      }
      photos[index] = compressed;
      const updated = { ...escortSession, uploadedPhotos: photos };
      setEscortSession(updated);
      store.setActiveEscortSession(updated);
      e.target.value = '';
    } catch (err) {
      console.error(err);
      alert('Error compressing or uploading image.');
    }
  };

  const removeEscortPhoto = (index: number) => {
    let photos = [...(escortSession.uploadedPhotos || [])];
    if (photos[index]) {
      photos[index] = "";
    }
    const updated = { ...escortSession, uploadedPhotos: photos };
    setEscortSession(updated);
    store.setActiveEscortSession(updated);
  };

  const handleDailyPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      if (selectedRole === 'maternity' || selectedRole === 'babysitter') {
        const currentPhotos = confinementSession.uploadedPhotos || [];
        const updatedPhotos = [...currentPhotos, compressed];
        const updated = { ...confinementSession, uploadedPhotos: updatedPhotos };
        setConfinementSession(updated);
        store.setActiveConfinementSession(updated);
      } else if (selectedRole === 'elderly') {
        const currentPhotos = elderSession.uploadedPhotos || [];
        const updatedPhotos = [...currentPhotos, compressed];
        const updated = { ...elderSession, uploadedPhotos: updatedPhotos };
        setElderSession(updated);
        store.setActiveElderSession(updated);
      }
      e.target.value = '';
    } catch (err) {
      console.error(err);
      alert('Error compressing or uploading image.');
    }
  };

  const removeDailyPhoto = (photoIndex: number) => {
    if (selectedRole === 'maternity' || selectedRole === 'babysitter') {
      const currentPhotos = confinementSession.uploadedPhotos || [];
      const updatedPhotos = currentPhotos.filter((_: any, idx: number) => idx !== photoIndex);
      const updated = { ...confinementSession, uploadedPhotos: updatedPhotos };
      setConfinementSession(updated);
      store.setActiveConfinementSession(updated);
    } else if (selectedRole === 'elderly') {
      const currentPhotos = elderSession.uploadedPhotos || [];
      const updatedPhotos = currentPhotos.filter((_: any, idx: number) => idx !== photoIndex);
      const updated = { ...elderSession, uploadedPhotos: updatedPhotos };
      setElderSession(updated);
      store.setActiveElderSession(updated);
    }
  };

  useEffect(() => {
    setLang(store.getLanguage() as Language);
    
    // Sync old mock member expiries in local storage to new test expiries
    const allMembers = store.getUnionMembers();
    let storeModified = false;
    const updatedMembers = allMembers.map((m: any) => {
      if (m.expiry === '2027-05-28' && m.member_number === 'MCSA-2026-0009') {
        storeModified = true;
        return { ...m, expiry: '2026-07-04' };
      }
      if (m.expiry === '2027-04-12' && m.member_number === 'MCSA-2026-1112') {
        storeModified = true;
        return { ...m, expiry: '2026-06-30' };
      }
      return m;
    });
    if (storeModified) {
      store.setUnionMembers(updatedMembers);
    }

    const logged = localStorage.getItem('mcsa_logged_member');
    let currentMember = null;
    if (logged) {
      let parsed = JSON.parse(logged);
      if (parsed.expiry === '2027-05-28' && parsed.member_number === 'MCSA-2026-0009') {
        parsed.expiry = '2026-07-04';
        localStorage.setItem('mcsa_logged_member', JSON.stringify(parsed));
      } else if (parsed.expiry === '2027-04-12' && parsed.member_number === 'MCSA-2026-1112') {
        parsed.expiry = '2026-06-30';
        localStorage.setItem('mcsa_logged_member', JSON.stringify(parsed));
      }
      setMember(parsed);
      currentMember = parsed;
      const catLower = (parsed.category || '').toLowerCase();
      if (catLower.includes('confinement')) {
        setSelectedRole('maternity');
      } else if (catLower.includes('babysitter')) {
        setSelectedRole('babysitter');
      } else if (catLower.includes('companion')) {
        setSelectedRole('escort');
      } else if (catLower.includes('elderly')) {
        setSelectedRole('elderly');
      } else {
        setSelectedRole('elderly');
      }
    } else {
      const fallback = store.getUnionMembers()[0];
      setMember(fallback);
      currentMember = fallback;
      setSelectedRole('elderly');
    }

    setCareRequests(store.getCareRequests());
    setLibItems(store.getLibItems());
    
    // Filter escort forms by caregiver ID
    const allForms = store.getEscortForms();
    const cgId = currentMember ? (currentMember.id || currentMember.member_number) : '';
    const filtered = allForms.filter((f: any) => f.caregiverId === cgId);
    setEscortForms(filtered);

    // Load active escort session
    setEscortSession(store.getActiveEscortSession());
    setConfinementSession(store.getActiveConfinementSession());

    // Load active elder session
    const elder = store.getActiveElderSession();
    setElderSession(elder);
    if (elder && elder.vitals) {
      setElderBP(elder.vitals.bp || '128/82');
      setElderBloodSugar(elder.vitals.bloodSugar || '6.2');
      setElderSugarType(elder.vitals.sugarType || 'Fasting');
      setElderHeartRate(elder.vitals.heartRate || '74');
      setElderBodyTemp(elder.vitals.bodyTemp || '36.6');
    }

    setConfinementContracts(store.getConfinementContracts());
    setElderlyContracts(store.getElderlyContracts());
    if (currentMember) {
      setConfinementAccountName(currentMember.name || '');
      setConfinementDuitNow(currentMember.phone || '');
      setElderlyAccountName(currentMember.name || '');
      setElderlyDuitNow(currentMember.phone || '');
    }
 
    // Load calendar appointments
    const storedAppts = localStorage.getItem('mcsa_calendar_appointments');
    if (storedAppts) {
      setCalendarAppointments(JSON.parse(storedAppts));
    } else {
      setCalendarAppointments(defaultCalendarAppts);
      localStorage.setItem('mcsa_calendar_appointments', JSON.stringify(defaultCalendarAppts));
    }
  }, []);

  // Calendar Utility Functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getDayAppointments = (dayNum: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    const dayStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    return calendarAppointments.filter(a => a.date === dayStr && a.role === selectedRole);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDateStr(todayStr);
  };

  const submitCustomAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApptClient.trim() || !newApptLocation.trim()) {
      alert('Please fill out client name and location.');
      return;
    }
    const newAppt = {
      id: 'appt-custom-' + Math.floor(Math.random() * 100000),
      role: selectedRole,
      date: selectedDateStr,
      time: newApptTime,
      clientName: newApptClient,
      location: newApptLocation,
      details: newApptDetails,
      status: newApptStatus
    };
    const updated = [...calendarAppointments, newAppt];
    setCalendarAppointments(updated);
    localStorage.setItem('mcsa_calendar_appointments', JSON.stringify(updated));
    setNewApptClient('');
    setNewApptLocation('');
    setNewApptDetails('');
    setShowAddApptModal(false);
    alert('📅 Custom appointment scheduled successfully!');
  };



  const updateApptStatus = (apptId: string, newStatus: string) => {
    const updated = calendarAppointments.map(a => 
      a.id === apptId ? { ...a, status: newStatus } : a
    );
    setCalendarAppointments(updated);
    localStorage.setItem('mcsa_calendar_appointments', JSON.stringify(updated));
    
    // If the appointment status is updated, we also update the active session values if relevant
    const appt = updated.find(a => a.id === apptId);
    if (appt && appt.role === 'escort' && activeEscortTrackingId === apptId) {
      setEscortSession((prev: any) => ({
        ...prev,
        statusIndex: newStatus === 'Completed' ? 4 : newStatus === 'In Progress' ? 2 : 0
      }));
    }
  };

  const handleReleaseCase = (appt: any) => {
    const confirmMessage = lang === 'zh'
      ? `⚠️ 您确定要放弃并释放此护理派单吗？\n\n释放后，此日程将从您的工作台移除，且该需求将重新公开重新匹配，供其他看护人接收。`
      : lang === 'bm'
      ? `⚠️ Adakah anda pasti mahu melepaskan tugasan penjagaan ini?\n\nSetelah dilepaskan, syif ini akan dikeluarkan dari kalendar anda dan permohonan tersebut akan dikembalikan ke kolam tugasan terbuka untuk penjaga lain.`
      : `⚠️ Are you sure you want to release this care dispatch assignment?\n\nOnce released, this shift will be removed from your calendar and the request will return to the public open pool for other caregivers.`;

    if (!confirm(confirmMessage)) return;

    // 1. Remove the appointment from calendarAppointments
    const updatedAppts = calendarAppointments.filter(a => a.id !== appt.id);
    setCalendarAppointments(updatedAppts);
    localStorage.setItem('mcsa_calendar_appointments', JSON.stringify(updatedAppts));

    // 2. Find and release the care request in the store
    const requestsList = store.getCareRequests();
    const req = requestsList.find((r: any) => r.name === appt.clientName && r.status === 'accepted');
    if (req) {
      const updatedRequests = requestsList.map((r: any) =>
        r.id === req.id ? { ...r, status: 'pending', assignedCaregiver: '' } : r
      );
      store.setCareRequests(updatedRequests);
      setCareRequests(updatedRequests);
      
      // Dispatch storage event to notify other tabs (like Admin Panel)
      localStorage.setItem('mcsa_care_requests', JSON.stringify(updatedRequests));
    }

    const successMessage = lang === 'zh'
      ? '🎉 派单已成功释放，需求已重新放回公会公开匹配池。'
      : lang === 'bm'
      ? '🎉 Tugasan berjaya dilepaskan! Permohonan telah dikembalikan ke kolam terbuka.'
      : '🎉 Assignment released successfully! The client demand has returned to the public matching pool.';
      
    alert(successMessage);
  };

  const openAdjustScheduleModal = (appt: any) => {
    setSelectedApptToAdjust(appt);
    setAdjustDate(appt.date);
    setAdjustTime(appt.time);
    setAdjustDetails(appt.details || '');
    setShowAdjustModal(true);
  };

  const handleSaveAdjustedSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApptToAdjust) return;

    const updated = calendarAppointments.map(a => 
      a.id === selectedApptToAdjust.id 
        ? { ...a, date: adjustDate, time: adjustTime, details: adjustDetails } 
        : a
    );

    setCalendarAppointments(updated);
    localStorage.setItem('mcsa_calendar_appointments', JSON.stringify(updated));

    // Also update current active session date if editing the active confinement session
    if (selectedApptToAdjust.role === 'maternity' && confinementSession) {
      const updatedConf = { ...confinementSession, dateString: adjustDate };
      setConfinementSession(updatedConf);
      store.setActiveConfinementSession(updatedConf);
    } else if (selectedApptToAdjust.role === 'elderly' && elderSession) {
      const updatedElder = { ...elderSession, dateString: adjustDate };
      setElderSession(updatedElder);
      store.setActiveElderSession(updatedElder);
    }

    setShowAdjustModal(false);
    setSelectedApptToAdjust(null);
    alert(lang === 'zh' 
      ? '📅 排班日程已成功调整！' 
      : lang === 'bm' 
      ? '📅 Jadual syif berjaya diubah!' 
      : '📅 Appointment schedule adjusted successfully!'
    );
  };

  // Helper to calculate membership expiry remaining days
  const getRenewalAlertInfo = () => {
    if (!member || !member.expiry) return { showAlert: false, daysLeft: 0, isExpired: false };
    const parts = member.expiry.split('-');
    if (parts.length !== 3) return { showAlert: false, daysLeft: 0, isExpired: false };
    
    const expiryDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const today = new Date(2026, 5, 6); // Mock today is 2026-06-06
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      showAlert: daysLeft <= 30,
      daysLeft,
      isExpired: daysLeft <= 0
    };
  };

  const handleRenewMembership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    setIsRenewing(true);
    setTimeout(() => {
      setIsRenewing(false);
      const alertInfo = getRenewalAlertInfo();
      const parts = (member.expiry || '2026-06-06').split('-');
      const baseDate = alertInfo.isExpired 
        ? new Date(2026, 5, 6) 
        : new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      baseDate.setFullYear(baseDate.getFullYear() + renewalYears);
      
      const year = baseDate.getFullYear();
      const month = String(baseDate.getMonth() + 1).padStart(2, '0');
      const day = String(baseDate.getDate()).padStart(2, '0');
      const newExpiryStr = `${year}-${month}-${day}`;
      
      const updatedMember = { ...member, expiry: newExpiryStr };
      const allMembers = store.getUnionMembers();
      const updatedMembers = allMembers.map((m: any) => 
        (m.id === member.id || m.member_number === member.member_number) ? updatedMember : m
      );
      
      store.setUnionMembers(updatedMembers);
      localStorage.setItem('mcsa_logged_member', JSON.stringify(updatedMember));
      setMember(updatedMember);
      setShowRenewalModal(false);
      setPaymentAccount('');
      setPaymentExpiry('');
      setPaymentCVV('');
      
      alert(lang === 'zh' 
        ? `🎉 会员续费成功！您的会员资格已成功延长 ${renewalYears} 年，新有效期至：${newExpiryStr}。` 
        : lang === 'bm' 
        ? `🎉 Pembaharuan keahlian berjaya! Keahlian anda telah dilanjutkan selama ${renewalYears} tahun sehingga ${newExpiryStr}.` 
        : `🎉 Membership renewal successful! Your membership has been extended by ${renewalYears} year(s) until ${newExpiryStr}.`
      );
    }, 1500);
  };

  const archiveDailyReport = () => {
    const reportDate = confinementSession.dateString || new Date().toISOString().split('T')[0];
    const newReport = {
      id: 'REP-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      date: reportDate,
      babyAgeDays: confinementSession.babyAgeDays || 15,
      babyName: confinementSession.babyName || 'LeLe',
      feedingLog: confinementSession.feedingLog || [],
      diaperRecord: confinementSession.diaperRecord || [],
      sleepActivity: confinementSession.sleepActivity || {},
      healthCheck: confinementSession.healthCheck || {},
      timestamp: new Date().toLocaleString()
    };

    const currentHistory = JSON.parse(localStorage.getItem('mcsa_confinement_history') || '[]');
    const updatedHistory = [newReport, ...currentHistory];
    localStorage.setItem('mcsa_confinement_history', JSON.stringify(updatedHistory));

    // Calculate next day
    const nextDay = (confinementSession.babyAgeDays || 15) + 1;
    // Advance date by 1 day
    let currentDate = new Date(reportDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const nextDateStr = currentDate.toISOString().split('T')[0];

    const updatedSession = {
      ...confinementSession,
      babyAgeDays: nextDay,
      dateString: nextDateStr,
      feedingLog: [],
      diaperRecord: [],
      sleepActivity: {
        sleepLogs: [],
        activities: { bathing: false, tummyTime: false, massage: false, music: false }
      },
      healthCheck: {
        temp: "36.6",
        jaundiceForehead: "0.0",
        jaundiceChest: "0.0",
        jaundiceCheeks: "0.0",
        umbilicalStatus: "Dry & Healing"
      },
      isShared: false
    };

    setConfinementSession(updatedSession);
    store.setActiveConfinementSession(updatedSession);

    alert(lang === 'zh'
      ? `🎉 婴儿护理报告已成功保存归档！\n📅 归档日期：${newReport.date} (宝宝出生第 ${newReport.babyAgeDays} 天)\n\n系统已自动为您清空今日记录并生成第 ${nextDay} 天的日志工作台，您可以开始记录新一天的活动了。`
      : `🎉 Daily baby care report archived successfully!\n📅 Date: ${newReport.date} (Day ${newReport.babyAgeDays})\n\nToday's data has been saved to history. The workspace is now advanced to Day ${nextDay} for new records.`
    );
  };

  const openEscortTrackerForAppt = (appt: any) => {
    setEscortSession({
      patientName: appt.clientName,
      patientAge: appt.id === 'appt-esc-2' ? 78 : 72,
      patientId: appt.id === 'appt-esc-2' ? "2026-2050333" : "2026-" + Math.floor(100000 + Math.random() * 900000),
      hospital: appt.location.split(' - ')[0],
      department: appt.location.split(' - ')[1] || "General Outpatient",
      statusIndex: appt.status === 'Completed' ? 4 : appt.status === 'In Progress' ? 2 : 0,
      doctorNote: appt.details || "",
      revisitDate: "2026-06-20",
      uploadedPhotos: appt.id === 'appt-esc-2' ? [
        "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=256&h=256&fit=crop",
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=256&h=256&fit=crop"
      ] : [],
      isShared: false
    });
    setActiveEscortTrackingId(appt.id);
    setActiveTab('live');
  };

  const submitVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      id: String(vitalLogs.length + 1),
      bp: `${systolic}/82 mmHg`,
      sugar: `${sugar} mmol/L`,
      pulse: `${pulse} bpm`,
      status: Number(systolic) >= 140 || Number(sugar) >= 7.0 ? 'High Risk' : 'Normal',
      time: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setVitalLogs([newLog, ...vitalLogs]);
    alert('Vitals updated and synced to family portal database.');
  };

  // Senior Health Dashboard Handlers
  const submitMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !medDose.trim()) {
      alert('Please fill out medication name and dosage.');
      return;
    }
    const newMed = {
      id: "med-" + Math.floor(Math.random() * 10000),
      time: medTime,
      name: medName,
      dose: medDose,
      administered: medAdministered
    };
    const updated = {
      ...elderSession,
      medications: [...(elderSession.medications || []), newMed],
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setElderSession(updated);
    store.setActiveElderSession(updated);
    setMedName('');
    setMedDose('');
    alert('💊 Medication administration logged successfully!');
  };

  const toggleMedAdministered = (medId: string) => {
    const updatedMeds = (elderSession.medications || []).map((m: any) => 
      m.id === medId ? { ...m, administered: !m.administered } : m
    );
    const updated = {
      ...elderSession,
      medications: updatedMeds,
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setElderSession(updated);
    store.setActiveElderSession(updated);
  };

  const deleteMedication = (medId: string) => {
    const updatedMeds = (elderSession.medications || []).filter((m: any) => m.id !== medId);
    const updated = {
      ...elderSession,
      medications: updatedMeds,
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setElderSession(updated);
    store.setActiveElderSession(updated);
  };

  const updateElderRisk = (field: string, val: string) => {
    const updated = {
      ...elderSession,
      risks: {
        ...(elderSession.risks || {}),
        [field]: val
      },
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setElderSession(updated);
    store.setActiveElderSession(updated);
  };

  const submitElderVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...elderSession,
      vitals: {
        bp: elderBP,
        bloodSugar: elderBloodSugar,
        sugarType: elderSugarType,
        heartRate: elderHeartRate,
        bodyTemp: elderBodyTemp
      },
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setElderSession(updated);
    store.setActiveElderSession(updated);
    alert('🩺 Senior vital signs updated successfully!');
  };

  const toggleElderActivityChecked = (actId: string) => {
    const updatedActs = (elderSession.activities || []).map((a: any) => 
      a.id === actId ? { ...a, checked: !a.checked } : a
    );
    const updated = {
      ...elderSession,
      activities: updatedActs,
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setElderSession(updated);
    store.setActiveElderSession(updated);
  };

  const updateElderActivityNote = (actId: string, text: string) => {
    const updatedActs = (elderSession.activities || []).map((a: any) => 
      a.id === actId ? { ...a, notes: text } : a
    );
    const updated = {
      ...elderSession,
      activities: updatedActs
    };
    setElderSession(updated);
    store.setActiveElderSession(updated);
  };

  const [customActTitle, setCustomActTitle] = useState('');
  const [customActTime, setCustomActTime] = useState('09:00 AM');
  
  const addElderActivityCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customActTitle.trim()) return;
    const newAct = {
      id: "act-" + Math.floor(Math.random() * 10000),
      time: customActTime,
      title: customActTitle,
      checked: false,
      notes: ""
    };
    const updated = {
      ...elderSession,
      activities: [...(elderSession.activities || []), newAct],
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setElderSession(updated);
    store.setActiveElderSession(updated);
    setCustomActTitle('');
    alert('➕ Custom care event scheduled successfully!');
  };

  const shareElderWithFamily = () => {
    const updated = {
      ...elderSession,
      isShared: true,
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setElderSession(updated);
    store.setActiveElderSession(updated);
    alert('📢 Senior care logs synchronized with Family Portal in real-time! / 长者日常健康日志已成功一键同步给家属。');
  };

  const submitBabyFeeding = (e: React.FormEvent) => {
    e.preventDefault();
    const newFeed = {
      id: "feed-" + Math.floor(Math.random() * 10000),
      time: feedTime,
      type: feedType,
      breastLeftMins: feedType === 'Breast' ? Number(breastLeftMins) : 0,
      breastRightMins: feedType === 'Breast' ? Number(breastRightMins) : 0,
      formulaMl: feedType === 'Formula' ? Number(feedFormulaMl) : 0
    };
    const updated = {
      ...confinementSession,
      feedingLog: [newFeed, ...(confinementSession.feedingLog || [])],
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setConfinementSession(updated);
    store.setActiveConfinementSession(updated);
    alert('🍼 Baby Feeding log added successfully!');
  };

  const submitBabyDiaper = (e: React.FormEvent) => {
    e.preventDefault();
    const newDiaper = {
      id: "diaper-" + Math.floor(Math.random() * 10000),
      time: diaperTime,
      urine: diaperUrine,
      stoolColor: diaperStoolColor,
      texture: diaperTexture,
      amount: diaperAmount,
      notes: diaperNotes
    };
    const updated = {
      ...confinementSession,
      diaperRecord: [newDiaper, ...(confinementSession.diaperRecord || [])],
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setConfinementSession(updated);
    store.setActiveConfinementSession(updated);
    setDiaperNotes('');
    alert('💩 Diaper record added successfully!');
  };

  const submitBabySleep = (e: React.FormEvent) => {
    e.preventDefault();
    const hrs = Math.max(1, Math.floor(2 + Math.random() * 5)); 
    const newSleep = {
      id: "sleep-" + Math.floor(Math.random() * 10000),
      enterTime: sleepEnter,
      exitTime: sleepExit,
      totalHours: hrs
    };
    const updated = {
      ...confinementSession,
      sleepActivity: {
        ...confinementSession.sleepActivity,
        sleepLogs: [newSleep, ...(confinementSession.sleepActivity?.sleepLogs || [])]
      },
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setConfinementSession(updated);
    store.setActiveConfinementSession(updated);
    alert('💤 Sleep log added successfully!');
  };

  const toggleBabyActivity = (actKey: string) => {
    const prevActs = confinementSession.sleepActivity?.activities || { bathing: false, tummyTime: false, massage: false, music: false };
    const updatedActs = { ...prevActs, [actKey]: !prevActs[actKey] };
    const updated = {
      ...confinementSession,
      sleepActivity: {
        ...confinementSession.sleepActivity,
        activities: updatedActs
      },
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setConfinementSession(updated);
    store.setActiveConfinementSession(updated);
  };

  const submitBabyHealth = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...confinementSession,
      healthCheck: {
        temp: healthTemp,
        jaundiceForehead: jaundiceForehead,
        jaundiceChest: jaundiceChest,
        jaundiceCheeks: jaundiceCheeks,
        umbilicalStatus: umbilicalStatus
      },
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setConfinementSession(updated);
    store.setActiveConfinementSession(updated);
    alert('🩺 Health vitals and Jaundice levels updated successfully!');
  };

  const shareConfinementWithFamily = () => {
    const updated = {
      ...confinementSession,
      isShared: true,
      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setConfinementSession(updated);
    store.setActiveConfinementSession(updated);
    alert('📢 Confinement Baby Care log synchronized with Family Portal in real-time! / 婴儿护理记录已成功一键同步给家属。');
  };

  const submitEscortForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim() || !formNric.trim() || !formSigned.trim()) {
      alert('Please fill out all required fields (Full Name, NRIC/Passport, and Signature).');
      return;
    }
    const cgId = member ? (member.id || member.member_number) : 'Unassigned';
    const newForm = {
      id: 'FORM-' + Math.floor(102 + Math.random() * 900),
      fullName: formFullName,
      gender: formGender,
      dob: formDob,
      nric: formNric,
      phone: formPhone,
      address: formAddress,
      emergencyName: formEmergencyName,
      emergencyPhone: formEmergencyPhone,
      relationship: formRelationship,
      appointmentDate: formApptDate,
      appointmentTime: formApptTime,
      facility: formFacility,
      doctor: formDoctor,
      specialty: formSpecialty,
      assistanceRequired: formAssist,
      complaint: formComplaint,
      pastHistory: formHistory,
      drugAllergy: formDrugAllergy,
      foodAllergy: formFoodAllergy,
      otherAllergy: formOtherAllergy,
      takingMeds: formTakingMeds,
      medsList: formMedsList,
      surgicalHistory: formSurgicalHistory,
      mobility: formMobility,
      hearingDifficulty: formHearing,
      speechDifficulty: formSpeech,
      visualImpairment: formVisual,
      additionalInfo: formAdditional,
      clientSigned: formSigned,
      signedDate: formSignedDate || new Date().toISOString().split('T')[0],
      caregiverId: cgId
    };

    const allForms = store.getEscortForms();
    const updatedAll = [newForm, ...allForms];
    store.setEscortForms(updatedAll);

    // Update state with only filtered forms for the current caregiver
    const filtered = updatedAll.filter((f: any) => f.caregiverId === cgId);
    setEscortForms(filtered);

    // Reset fields
    setFormFullName('');
    setFormDob('');
    setFormNric('');
    setFormPhone('');
    setFormAddress('');
    setFormEmergencyName('');
    setFormEmergencyPhone('');
    setFormRelationship('');
    setFormApptDate('');
    setFormApptTime('');
    setFormFacility('');
    setFormDoctor('');
    setFormSpecialty('');
    setFormAssist(false);
    setFormComplaint('');
    setFormHistory([]);
    setFormDrugAllergy('No Known Drug Allergy');
    setFormFoodAllergy('No');
    setFormOtherAllergy('No');
    setFormTakingMeds(false);
    setFormMedsList('');
    setFormSurgicalHistory('');
    setFormMobility('Walk Independently');
    setFormHearing(false);
    setFormSpeech(false);
    setFormVisual('');
    setFormAdditional('');
    setFormSigned('');
    setFormSignedDate('');

    setFormMode('list');
    alert('Medical Escort Client Information Form and Agreement submitted successfully!');
  };

  // Escort Tracker Handlers
  const updateEscortStatus = (index: number) => {
    const updated = { ...escortSession, statusIndex: index, lastUpdated: new Date().toLocaleTimeString().substring(0, 5) };
    setEscortSession(updated);
    store.setActiveEscortSession(updated);
  };

  const handleEscortFieldChange = (field: string, value: any) => {
    const updated = { ...escortSession, [field]: value };
    setEscortSession(updated);
    store.setActiveEscortSession(updated);
  };

  const toggleEscortPhoto = (index: number) => {
    const defaultPhotos = [
      "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=256&h=256&fit=crop", // receipt mockup
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=256&h=256&fit=crop", // prescription mockup
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=256&h=256&fit=crop"  // medical record mockup
    ];
    let photos = [...(escortSession.uploadedPhotos || [])];
    if (photos[index]) {
      photos[index] = "";
    } else {
      photos[index] = defaultPhotos[index] || defaultPhotos[0];
    }
    const updated = { ...escortSession, uploadedPhotos: photos };
    setEscortSession(updated);
    store.setActiveEscortSession(updated);
  };

  const shareEscortWithFamily = () => {
    const updated = { ...escortSession, isShared: true, lastUpdated: new Date().toLocaleTimeString().substring(0, 5) };
    setEscortSession(updated);
    store.setActiveEscortSession(updated);
    alert("📢 Shared with Family Portal successfully! / 实时就医数据与材料已成功分享给家属。");
  };

  

  const submitElderlyContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!elderlyServiceDate.trim() || !elderlyServiceFee.trim() || !elderlyAccountNumber.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const newContract = {
      id: 'CONTRACT-ELD-' + Math.floor(202 + Math.random() * 900),
      status: 'Pending',
      caregiverId: member ? member.id : 'M-101',
      caregiverName: member ? member.name : 'Li Xiulan',
      caregiverMemberNo: member ? member.member_number : 'MCSA-2026-0009',
      caregiverNric: member ? member.nric : '830812-14-5544',
      caregiverPhone: member ? member.phone : '012-8888776',
      bankName: elderlyBankName,
      accountName: elderlyAccountName,
      accountNumber: elderlyAccountNumber,
      duitNow: elderlyDuitNow,
      serviceDate: elderlyServiceDate,
      serviceHours: elderlyServiceHours,
      serviceFee: elderlyServiceFee,
      deposit: elderlyDeposit,
      balance: elderlyBalance,
      clientName: '',
      clientNric: '',
      clientPhone: '',
      clientAddress: '',
      clientSignature: '',
      caregiverSignature: member ? member.name : 'Li Xiulan',
      unionWitness: 'MCSA Witness Officer / 马来西亚华人照护工会见证代表',
      signedDate: ''
    };

    const updated = [newContract, ...elderlyContracts];
    setElderlyContracts(updated);
    store.setElderlyContracts(updated);

    setElderlyFormMode('list');
    alert('Elderly Care Service Agreement created successfully!');
  };

  const submitConfinementContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confinementServiceFee.trim() || !confinementAccountNumber.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const newContract = {
      id: 'CONTRACT-' + Math.floor(202 + Math.random() * 900),
      status: 'Pending',
      caregiverId: member ? member.id : 'M-102',
      caregiverName: member ? member.name : 'Meizhen Chen',
      caregiverMemberNo: member ? member.member_number : 'MCSA-2026-1112',
      caregiverNric: member ? member.nric : '870615-10-5622',
      caregiverPhone: member ? member.phone : '019-3322114',
      bankName: confinementBankName,
      accountName: confinementAccountName,
      accountNumber: confinementAccountNumber,
      duitNow: confinementDuitNow,
      serviceFee: confinementServiceFee,
      deposit: confinementDeposit,
      balance: confinementBalance,
      clientName: '',
      clientNric: '',
      clientPhone: '',
      clientAddress: '',
      clientEdd: '',
      clientSignature: '',
      caregiverSignature: member ? member.name : 'Meizhen Chen',
      unionWitness: 'MCSA Witness Officer / 马来西亚华人照护工会见证代表',
      signedDate: ''
    };

    const updated = [newContract, ...confinementContracts];
    setConfinementContracts(updated);
    store.setConfinementContracts(updated);

    setConfinementFormMode('list');
    alert('Confinement Care Service Agreement created successfully!');
  };

  const t = translations[lang] || translations.en;

  return (
    <div className="app-container" style={{ background: '#0b1329' }}>
      {/* Sidebar with Glassmorphic design */}
      <aside className="sidebar" style={{ background: 'rgba(15, 23, 42, 0.9)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
            border: '2px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem'
          }}>
            {member?.photo ? (
              <img 
                src={member.photo} 
                alt={member.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <span style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800 }}>
                {member ? member.name.split(' ').map((n: string) => n[0]).join('') : 'L'}
              </span>
            )}
          </div>
          <h4 style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>{member ? member.name : 'Li Xiulan'}</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {member ? member.member_number : 'MCSA-2026-0009'}</span>
        </div>

        {/* Identity Selector */}
        <div className="form-group" style={{ margin: '0 0 1.5rem 0' }}>
          <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Role Identity Segment</label>
          <select 
            className="form-input" 
            style={{ 
              padding: '0.5rem', 
              fontSize: '0.85rem', 
              background: 'rgba(255,255,255,0.04)', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
          >
            <option value="elderly" style={{ color: 'black' }}>
              {isRehab 
                ? (lang === 'zh' ? '💪 康复照护助理 (Rehab Assistant)' : lang === 'bm' ? '💪 Pembantu Rehab' : '💪 Rehab Assistant')
                : (lang === 'zh' ? '👴 养老护理员 (Elderly Care)' : lang === 'bm' ? '👴 Penjaga Warga Emas' : '👴 Elderly Caregiver')
              }
            </option>
            <option value="maternity" style={{ color: 'black' }}>
              {lang === 'zh' ? '🍼 月嫂 / 坐月护理 (Confinement Lady)' : lang === 'bm' ? '🍼 Penjaga Berpantang' : '🍼 Confinement Lady'}
            </option>
            <option value="escort" style={{ color: 'black' }}>
              {lang === 'zh' ? '🏥 就医陪诊 / 陪诊员 (Patient Companion)' : lang === 'bm' ? '🏥 Peneman Pesakit' : '🏥 Patient Companion'}
            </option>
            <option value="babysitter" style={{ color: 'black' }}>
              {lang === 'zh' ? '👶 专业保姆 (Babysitter)' : lang === 'bm' ? '👶 Pengasuh Bayi' : '👶 Babysitter Service'}
            </option>
          </select>
        </div>

        <ul className="sidebar-menu">
          <li>
            <button 
              onClick={() => setActiveTab('live')}
              className={`sidebar-link ${activeTab === 'live' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <LayoutDashboard size={18} /> {t.dashboard.tabLive || (lang === 'zh' ? '服务工作台' : lang === 'bm' ? 'Papan Kerja Servis' : 'Service Dashboard')}
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`sidebar-link ${activeTab === 'timeline' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Calendar size={18} /> {t.dashboard.tabTimeline}
            </button>
          </li>
          
          {selectedRole === 'elderly' && (
            <>
              <li>
                <button 
                  onClick={() => setActiveTab('vitals')}
                  className={`sidebar-link ${activeTab === 'vitals' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <Heart size={18} /> {isRehab ? (lang === 'zh' ? '康复照护日志' : lang === 'bm' ? 'Log Penjagaan Rehab' : 'Rehab Care Log') : t.dashboard.tabVitals}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('elderlyContract')}
                  className={`sidebar-link ${activeTab === 'elderlyContract' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <FileText size={18} /> {isRehab ? (lang === 'zh' ? '康复服务合约' : lang === 'bm' ? 'Kontrak Perkhidmatan Rehab' : 'Rehab Care Contract') : (lang === 'zh' ? '服务合约协议' : lang === 'bm' ? 'Kontrak Perkhidmatan' : 'Elderly Care Contract')}
                </button>
              </li>
            </>
          )}

          {(selectedRole === 'maternity' || selectedRole === 'babysitter') && (
            <>
              <li>
                <button 
                  onClick={() => setActiveTab('maternity')}
                  className={`sidebar-link ${activeTab === 'maternity' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <Activity size={18} /> {selectedRole === 'babysitter' ? (lang === 'zh' ? '婴幼儿护理日志' : lang === 'bm' ? 'Log Penjagaan Bayi' : 'Child Care Log') : t.dashboard.tabMaternity}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('confinementContract')}
                  className={`sidebar-link ${activeTab === 'confinementContract' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <FileText size={18} /> {lang === 'zh' ? '服务合约协议' : lang === 'bm' ? 'Kontrak Perkhidmatan' : 'Confinement Contract'}
                </button>
              </li>
            </>
          )}

          {selectedRole === 'escort' && (
            <li>
              <button 
                onClick={() => setActiveTab('escortForm')}
                className={`sidebar-link ${activeTab === 'escortForm' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <User size={18} /> {lang === 'zh' ? '病人记录' : lang === 'bm' ? 'Profil Pesakit' : 'Profiles (Patients)'}
              </button>
            </li>
          )}

          <li>
            <button 
              onClick={() => setActiveTab('library')}
              className={`sidebar-link ${activeTab === 'library' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <FileText size={18} /> Hospital Guides
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('card')}
              className={`sidebar-link ${activeTab === 'card' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <CreditCard size={18} /> My MCSA Card
            </button>
          </li>
          <li style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
            <a 
              href="/" 
              onClick={() => {
                localStorage.removeItem('mcsa_logged_member');
              }}
              className="sidebar-link" 
              style={{ color: '#fca5a5' }}
            >
              🚪 {lang === 'zh' ? '安全退出' : lang === 'bm' ? 'Log Keluar' : 'Log Out'}
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Workspace */}
      <main className="workspace animate-fade-in">
        
        {/* Membership Renewal Alert Banner */}
        {(() => {
          const alertInfo = getRenewalAlertInfo();
          if (!alertInfo.showAlert) return null;
          return (
            <div style={{
              background: alertInfo.isExpired 
                ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)' 
                : 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)',
              border: alertInfo.isExpired ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
              borderLeft: alertInfo.isExpired ? '5px solid #ef4444' : '5px solid #f59e0b',
              borderRadius: '16px',
              padding: '1.25rem 2rem',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: alertInfo.isExpired ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldAlert size={24} style={{ color: alertInfo.isExpired ? '#ef4444' : '#f59e0b' }} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: '#ffffff', fontWeight: 800 }}>
                    {lang === 'zh' ? (alertInfo.isExpired ? '您的公会会员资格已过期！' : `您的公会会员资格即将到期（剩余 ${alertInfo.daysLeft} 天）`) : 
                     lang === 'bm' ? (alertInfo.isExpired ? 'Keahlian MCSA anda telah tamat tempoh!' : `Keahlian MCSA anda akan tamat (Tinggal ${alertInfo.daysLeft} hari)`) : 
                     (alertInfo.isExpired ? 'Your MCSA Membership has expired!' : `Your MCSA Membership is expiring soon (${alertInfo.daysLeft} days left)`)}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {lang === 'zh' ? `当前有效期至：${member?.expiry || 'N/A'}。请及时缴费续期以保持现役状态并享有公会派单、开具就医免税收据等会员权益。` : 
                     lang === 'bm' ? `Tarikh luput semasa: ${member?.expiry || 'N/A'}. Sila perbaharui segera untuk mengekalkan status aktif tugasan kesatuan.` : 
                     `Current expiry date: ${member?.expiry || 'N/A'}. Renew now to maintain active union registry status and claim matching care dispatches.`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowRenewalModal(true)}
                className="btn btn-primary"
                style={{
                  background: alertInfo.isExpired ? '#ef4444' : 'var(--primary)',
                  boxShadow: alertInfo.isExpired ? '0 4px 14px rgba(239, 68, 68, 0.3)' : '0 4px 14px rgba(37, 99, 235, 0.3)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.65rem 1.5rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <CreditCard size={16} />
                {lang === 'zh' ? '立即续费' : lang === 'bm' ? 'Perbaharui Keahlian' : 'Renew Membership'}
              </button>
            </div>
          );
        })()}

        {activeTab === 'live' && (
          <div className="animate-fade-in">
            {selectedRole === 'escort' && activeEscortTrackingId !== null ? (
              // New Interactive Medical Escort Tracker Workspace (Activated from Calendar Appointment)
              <div>
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => { setActiveEscortTrackingId(null); setActiveTab('timeline'); }}
                    className="btn btn-outline"
                    style={{
                      borderColor: 'rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.02)',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 1.25rem',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ◀ {lang === 'zh' ? '返回日常排班日历' : lang === 'bm' ? 'Kembali ke Kalendar' : 'Back to Calendar Schedule'}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff', fontFamily: 'Outfit' }}>
                      Welcome, {member ? member.name.split(' ')[0] : 'Zhang'} Guide! Status: <span style={{ color: 'var(--health)', fontWeight: 'bold' }}>ACTIVE</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
                      Real-time outpatient companion control room.
                    </p>
                  </div>
                  <span className="badge badge-active" style={{ background: 'var(--health-glow)', color: 'var(--health)' }}>
                    🟢 Shift Connected
                  </span>
                </div>

                {/* Patient Header Block */}
                <div className="card" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'linear-gradient(90deg, rgba(245,158,11,0.08) 0%, rgba(30,41,59,0.5) 100%)',
                  borderLeft: '5px solid var(--accent)',
                  borderRadius: '16px',
                  padding: '1.5rem 2rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid var(--accent)',
                      backgroundColor: '#1e293b'
                    }}>
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop" 
                        alt="Patient" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: '0 0 0.25rem 0' }}>
                        Current Escort: {escortSession.patientName}, {escortSession.patientAge} Years Old
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        Patient ID: <span style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>{escortSession.patientId}</span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Initiating telephone connection to client: 017-9988776`)}
                    className="btn btn-outline"
                    style={{
                      borderColor: 'var(--accent)',
                      color: 'var(--accent)',
                      padding: '0.6rem 1.5rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    📞 Call Client
                  </button>
                </div>

                <div className="grid-cols-2" style={{ gap: '2rem' }}>
                  {/* Left Column: Location & Live Progress Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Location Card */}
                    <div className="card" style={{ margin: 0, padding: '1.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                        🏥 Hospital Location & Department
                      </span>
                      <h4 style={{ color: '#ffffff', fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={18} style={{ color: 'var(--primary)' }} /> {escortSession.hospital}
                      </h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--accent)', fontWeight: 600, margin: '0.4rem 0 0 0', paddingLeft: '1.4rem' }}>
                        ❤️ {escortSession.department}
                      </p>
                    </div>

                    {/* Progress Timeline */}
                    <div className="card" style={{ margin: 0, padding: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          ⚡ 实时就医进度轴
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Last Update: {escortSession.lastUpdated || 'N/A'}
                        </span>
                      </div>

                      {/* Vertical Progress Bar */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        borderLeft: '3px solid rgba(255,255,255,0.06)',
                        paddingLeft: '2rem',
                        marginLeft: '0.75rem',
                        position: 'relative'
                      }}>
                        {[
                          { title: 'Patient Met', zh: '已接诊患者', desc: 'Companion met client at the outpatient lobby.' },
                          { title: 'Clinic Queuing', zh: '排队候诊中', desc: 'Registered and queuing outside the consultation room.' },
                          { title: 'Appointment Ongoing', zh: '医生诊疗中', desc: 'Active clinical consultation with doctor.' },
                          { title: 'Payment/Medicine', zh: '代缴费代取药', desc: 'Clearing hospital bills and dispensing prescriptions.' },
                          { title: 'Check-out/Transfer', zh: '就诊结束送回', desc: 'Outpatient checkout complete, returning patient home.' }
                        ].map((step, idx) => {
                          const isDone = idx < escortSession.statusIndex;
                          const isActive = idx === escortSession.statusIndex;
                          return (
                            <div 
                              key={idx} 
                              onClick={() => updateEscortStatus(idx)}
                              style={{ position: 'relative', cursor: 'pointer', opacity: isDone || isActive ? 1 : 0.4, transition: 'opacity 0.2s' }}
                            >
                              {/* Connector Dot */}
                              <div style={{
                                width: '18px',
                                height: '18px',
                                backgroundColor: isDone ? 'var(--health)' : isActive ? 'var(--primary)' : '#475569',
                                borderRadius: '50%',
                                position: 'absolute',
                                left: '-31px',
                                top: '3px',
                                border: '4px solid #0b1329',
                                boxShadow: isActive ? '0 0 10px var(--primary)' : isDone ? '0 0 8px var(--health)' : 'none',
                                transition: 'all 0.2s'
                              }}></div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <strong style={{ color: isActive ? 'var(--primary)' : isDone ? 'var(--health)' : '#ffffff', fontSize: '0.95rem' }}>
                                  {idx + 1}. {step.title} / {step.zh}
                                </strong>
                                {isDone && <span style={{ color: 'var(--health)', fontSize: '0.8rem' }}>✓ Completed</span>}
                                {isActive && <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}>● Ongoing</span>}
                              </div>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.3 }}>
                                {step.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          if (escortSession.statusIndex < 4) {
                            updateEscortStatus(escortSession.statusIndex + 1);
                          } else {
                            alert("Already reached the final stage! / 就诊已结束。");
                          }
                        }}
                        className="btn btn-outline"
                        style={{
                          width: '100%',
                          marginTop: '2rem',
                          borderColor: 'var(--primary)',
                          color: 'var(--primary)',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          fontWeight: 700
                        }}
                      >
                        ⚡ UPDATE STATUS / 下一步进度
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Doctor's Note & Receipts upload */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ margin: 0, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📋 就医记录与材料上传
                      </h3>

                      {/* Diagnosis */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">DOCTOR'S DIAGNOSIS / NOTE / 医生诊断与交代事项</label>
                        <textarea 
                          className="form-input" 
                          placeholder="Please enter diagnostic instructions or doctor's directives here..."
                          rows={4}
                          style={{ resize: 'vertical', padding: '0.75rem', background: 'var(--bg-input)' }}
                          value={escortSession.doctorNote}
                          onChange={(e) => handleEscortFieldChange('doctorNote', e.target.value)}
                        />
                      </div>

                      {/* Revisit date */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">REVISIT DATE / 建议复诊日期</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          style={{ background: 'var(--bg-input)', color: '#ffffff' }}
                          value={escortSession.revisitDate}
                          onChange={(e) => handleEscortFieldChange('revisitDate', e.target.value)}
                        />
                      </div>

                      {/* Photo Upload block */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.50rem' }}>
                        <label className="form-label" style={{ margin: 0 }}>PHOTO UPLOAD / 上传单据、处方或药袋</label>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                          {[0, 1, 2].map((idx) => {
                            const isUploaded = !!(escortSession.uploadedPhotos && escortSession.uploadedPhotos[idx]);
                            return (
                              <div 
                                key={idx}
                                style={{
                                  position: 'relative',
                                  width: '80px',
                                  height: '80px',
                                }}
                              >
                                <input
                                  type="file"
                                  id={`escort-file-input-${idx}`}
                                  style={{ display: 'none' }}
                                  accept="image/*"
                                  onChange={(e) => handleEscortPhotoUpload(e, idx)}
                                />
                                <div 
                                  onClick={() => {
                                    if (!isUploaded) {
                                      document.getElementById(`escort-file-input-${idx}`)?.click();
                                    } else {
                                      const escortPhotos = (escortSession.uploadedPhotos || []).filter(Boolean).map((url: string) => ({ url, caption: 'Escort Outpatient Attachment / 就医陪诊附件' }));
                                      const activeUrl = escortSession.uploadedPhotos[idx];
                                      const activeIndex = escortPhotos.findIndex((p: any) => p.url === activeUrl);
                                      setLightboxPhotos(escortPhotos);
                                      setLightboxIndex(activeIndex >= 0 ? activeIndex : 0);
                                      setShowLightbox(true);
                                    }
                                  }}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '12px',
                                    border: isUploaded ? '2px solid var(--primary)' : '2px dashed rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.02)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {isUploaded ? (
                                    <>
                                      <img 
                                        src={escortSession.uploadedPhotos[idx]} 
                                        alt={`Attachment ${idx + 1}`} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                      />
                                      {/* Remove button overlay */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeEscortPhoto(idx);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          top: '4px',
                                          right: '4px',
                                          background: 'rgba(239, 68, 68, 0.85)',
                                          border: 'none',
                                          color: 'white',
                                          borderRadius: '50%',
                                          width: '18px',
                                          height: '18px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          cursor: 'pointer',
                                          fontSize: '10px',
                                          padding: 0,
                                          zIndex: 5
                                        }}
                                        title="Delete"
                                      >
                                        <X size={10} />
                                      </button>
                                    </>
                                  ) : (
                                    <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.2)' }}>+</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {lang === 'zh' 
                            ? '[+ 点击方块上传实际医疗收据/处方，再次点击已上传的图片可进行全屏预览]'
                            : '[+ Click block to upload actual medical receipts/prescriptions, click on uploaded photo to preview in full screen]'}
                        </span>
                      </div>

                      {/* Share Buttons Container */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button
                          onClick={shareEscortWithFamily}
                          className="btn btn-primary"
                          style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            background: 'var(--primary)',
                            boxShadow: '0 2px 8px var(--primary-glow)',
                            borderRadius: '8px',
                            fontWeight: 700
                          }}
                        >
                          🚀 SHARE WITH FAMILY / 一键同步给家属
                        </button>
                        <button
                          onClick={() => {
                            shareEscortWithFamily();
                            setShowEscortReportModal(true);
                          }}
                          className="btn btn-outline"
                          style={{
                            width: '100%',
                            padding: '0.9rem',
                            fontSize: '0.95rem',
                            borderColor: 'var(--accent)',
                            color: 'var(--accent)',
                            borderRadius: '8px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          📄 PREVIEW & PRINT/PDF / 预览并导出PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Checklist / Dispatch broadcast layout for Confinement Lady & Elderly Caregiver
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff', fontFamily: 'Outfit' }}>
                      {lang === 'zh' ? '照护工作台' : lang === 'bm' ? 'Papan Kerja Penjagaan' : 'Care Dashboard'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
                      {lang === 'zh' ? '管理您的每日照护检查清单与公会派遣任务。' : lang === 'bm' ? 'Urus senarai semak penjagaan harian dan siaran tugasan kesatuan.' : 'Manage your daily care checklists and union dispatch broadcasts.'}
                    </p>
                  </div>
                  <span className="badge badge-active" style={{ background: 'var(--health-glow)', color: 'var(--health)' }}>
                    🟢 {lang === 'zh' ? '已排班上岗' : lang === 'bm' ? 'Syif Aktif' : 'Shift Active'}
                  </span>
                </div>

                <div className="grid-cols-2" style={{ gap: '2rem' }}>
                  {/* Left Column: Shift Tasks Checklist */}
                  <div className="card" style={{ margin: 0, padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <CheckSquare size={20} style={{ color: selectedRole === 'maternity' ? '#ec4899' : 'var(--primary)' }} />
                      <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontFamily: 'Outfit' }}>
                        {lang === 'zh' ? '今日照护任务清单' : lang === 'bm' ? 'Senarai Semak Tugasan Syif' : 'Shift Tasks Checklist'}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {(liveChecklist[selectedRole] || []).map((item) => (
                        <label 
                          key={item.id} 
                          style={{
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: '0.75rem', 
                            cursor: 'pointer',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            background: item.checked ? 'rgba(16,185,129,0.02)' : 'rgba(255,255,255,0.01)',
                            border: item.checked ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(255,255,255,0.04)',
                            transition: 'all 0.2s',
                            color: item.checked ? 'var(--text-muted)' : '#ffffff'
                          }}
                        >
                          <input 
                            type="checkbox" 
                            checked={item.checked}
                            onChange={() => toggleLiveChecklist(selectedRole as any, item.id)}
                            style={{ 
                              marginTop: '0.2rem',
                              width: '18px', 
                              height: '18px', 
                              accentColor: selectedRole === 'maternity' ? '#ec4899' : 'var(--primary)',
                              cursor: 'pointer'
                            }}
                          />
                          <span style={{ fontSize: '0.9rem', textDecoration: item.checked ? 'line-through' : 'none', lineHeight: 1.4 }}>
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Open Client Dispatches matching category */}
                  <div className="card" style={{ margin: 0, padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <Activity size={20} style={{ color: 'var(--accent)' }} />
                      <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontFamily: 'Outfit' }}>
                        {lang === 'zh' ? '公开派遣广播 (符合您的资质)' : lang === 'bm' ? 'Siaran Tugasan Kesatuan (Padanan Kelayakan)' : 'Open Union Dispatch Broadcasts (Matching Specialty)'}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '450px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                      {(() => {
                        const getMatchingCategory = (role: string) => {
                          if (role === 'escort') return 'companion';
                          if (role === 'maternity') return 'confinement';
                          if (role === 'elderly') return 'elderly';
                          if (role === 'babysitter') return 'babysitter';
                          return 'elder';
                        };
                        const matchKey = getMatchingCategory(selectedRole);
                        const filteredRequests = careRequests.filter((r: any) => {
                          if (r.status === 'accepted') return false;
                          const cat = (r.category || '').toLowerCase();
                          return cat.includes(matchKey) || (selectedRole === 'maternity' && cat.includes('confinement'));
                        });

                        if (filteredRequests.length === 0) {
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', textAlign: 'center', opacity: 0.6 }}>
                              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📡</span>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                {lang === 'zh' ? '目前没有符合您资质的待接单派遣。' : lang === 'bm' ? 'Tiada siaran tugasan yang sepadan buat masa ini.' : 'No new matching dispatches found.'}
                              </p>
                            </div>
                          );
                        }

                        return filteredRequests.map((req: any) => (
                          <div 
                            key={req.id} 
                            style={{
                              border: '1px solid rgba(255,255,255,0.06)',
                              padding: '1.2rem',
                              borderRadius: '14px',
                              background: 'rgba(30,41,59,0.3)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.75rem',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                              <span style={{ color: 'var(--accent)', fontWeight: 800, fontFamily: 'monospace' }}>{req.id}</span>
                              <span style={{ color: 'var(--text-muted)' }}>📅 {req.date || '2026-06-05'}</span>
                            </div>
                            <h4 style={{ color: 'white', margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>{req.name}</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                              📍 <strong>{lang === 'zh' ? '地点' : lang === 'bm' ? 'Lokasi' : 'Location'}:</strong> {req.location}<br />
                              💼 <strong>{lang === 'zh' ? '类别' : lang === 'bm' ? 'Kategori' : 'Category'}:</strong> {req.category}<br />
                              📝 <strong>{lang === 'zh' ? '要求' : lang === 'bm' ? 'Keperluan' : 'Needs'}:</strong> {req.message}
                            </p>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                              <button
                                onClick={() => {
                                  const shiftDate = req.date || '2026-06-05';
                                  const newApp = {
                                    id: 'appt-custom-' + Math.floor(Math.random() * 100000),
                                    role: selectedRole,
                                    date: shiftDate,
                                    time: '09:00 AM',
                                    clientName: req.name,
                                    location: req.location,
                                    details: req.message,
                                    status: 'Scheduled'
                                  };
                                  const updatedAppts = [...calendarAppointments, newApp];
                                  setCalendarAppointments(updatedAppts);
                                  localStorage.setItem('mcsa_calendar_appointments', JSON.stringify(updatedAppts));

                                  const updatedRequests = careRequests.map((r: any) => 
                                    r.id === req.id ? { ...r, status: 'accepted' } : r
                                  );
                                  setCareRequests(updatedRequests);
                                  store.setCareRequests(updatedRequests);
                                  setSelectedDateStr(shiftDate);
                                  alert(lang === 'zh' ? '接单成功！该排班已同步至您的日常排班日程。' : lang === 'bm' ? 'Tugasan diterima! Syif telah ditambahkan ke Kalendar anda.' : 'Dispatch accepted! Assigned shift scheduled and active in Daily Calendar.');
                                }}
                                className="btn btn-primary" 
                                style={{ 
                                  padding: '0.45rem 1rem', 
                                  fontSize: '0.78rem', 
                                  borderRadius: '8px', 
                                  fontWeight: 700,
                                  border: 'none',
                                  background: selectedRole === 'maternity' ? '#ec4899' : 'var(--primary)',
                                  boxShadow: selectedRole === 'maternity' ? '0 2px 6px rgba(236,72,153,0.3)' : '0 2px 6px var(--primary-glow)'
                                }}
                              >
                                {lang === 'zh' ? '确认接单' : lang === 'bm' ? 'Terima Tugasan' : 'Accept Shift'}
                              </button>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>

                {/* Daily Care Photo Gallery Card */}
                <div className="card animate-fade-in" style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(15,23,42,0.4)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Activity size={20} style={{ color: selectedRole === 'maternity' ? '#ec4899' : 'var(--primary)' }} />
                      <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontFamily: 'Outfit' }}>
                        {lang === 'zh' ? '📸 每日照护相册' : lang === 'bm' ? '📸 Galeri Gambar Penjagaan Harian' : '📸 Daily Care Photo Gallery'}
                      </h3>
                    </div>
                    <div>
                      <input
                        type="file"
                        id="daily-care-photo-upload"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleDailyPhotoUpload}
                      />
                      <button 
                        onClick={() => document.getElementById('daily-care-photo-upload')?.click()}
                        className="btn btn-primary"
                        style={{
                          padding: '0.55rem 1.25rem',
                          fontSize: '0.85rem',
                          borderRadius: '8px',
                          background: selectedRole === 'maternity' ? '#ec4899' : 'var(--primary)',
                          border: 'none',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {lang === 'zh' ? '上传照片' : lang === 'bm' ? 'Muat Naik Foto' : 'Upload Photo'}
                      </button>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '-0.5rem', marginBottom: '1.5rem' }}>
                    {lang === 'zh' 
                      ? '在这里上传您在日常照护（如餐食准备、活动锻炼、睡眠照看等）中的照片，照片将实时共享到家属端系统。' 
                      : lang === 'bm' 
                      ? 'Muat naik gambar penjagaan harian (seperti penyediaan makanan, aktiviti fizikal, tidur, dll) untuk dikongsi dengan portal keluarga secara langsung.' 
                      : 'Upload photos of daily activities (e.g., meals prepared, exercises, baby bath, etc.) to share live with the family portal.'}
                  </p>

                  {/* Grid of uploaded photos */}
                  {(() => {
                    const sessionPhotos = (selectedRole === 'maternity' || selectedRole === 'babysitter')
                      ? (confinementSession?.uploadedPhotos || [])
                      : (elderSession?.uploadedPhotos || []);

                    const validPhotos = sessionPhotos.filter(Boolean);

                    if (validPhotos.length === 0) {
                      return (
                        <div style={{ 
                          border: '2px dashed rgba(255,255,255,0.06)',
                          borderRadius: '12px',
                          padding: '2.5rem',
                          textAlign: 'center',
                          background: 'rgba(255,255,255,0.01)'
                        }}>
                          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📸</span>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                            {lang === 'zh' ? '暂无照护照片。点击右上角上传第一张照片！' : lang === 'bm' ? 'Tiada foto penjagaan lagi. Muat naik foto pertama anda!' : 'No care photos uploaded yet. Upload your first photo now!'}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.25rem' }}>
                        {validPhotos.map((photoUrl: string, idx: number) => (
                          <div 
                            key={idx}
                            style={{
                              position: 'relative',
                              aspectRatio: '1',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              border: '1px solid rgba(255,255,255,0.08)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              const galleryList = validPhotos.map((url: string) => ({ 
                                url, 
                                caption: lang === 'zh' ? '每日照护记录 / Rekod Penjagaan Harian' : 'Daily Care Activity Photo' 
                              }));
                              setLightboxPhotos(galleryList);
                              setLightboxIndex(idx);
                              setShowLightbox(true);
                            }}
                          >
                            <img 
                              src={photoUrl} 
                              alt="Care activity" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDailyPhoto(idx);
                              }}
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'rgba(239, 68, 68, 0.85)',
                                border: 'none',
                                color: 'white',
                                borderRadius: '50%',
                                width: '22px',
                                height: '22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                zIndex: 10
                              }}
                              title="Delete Photo"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
              // Monthly Calendar Schedule View (For all caregiver roles)
              <div className="animate-fade-in">
                {/* Header Banner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff', fontFamily: 'Outfit' }}>
                      {lang === 'zh' ? '日常排班日程' : lang === 'bm' ? 'Jadual Harian' : 'Daily Schedule'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
                      {lang === 'zh' ? '系统自动排班，点击日期单元格查看详情或录入新预约。' : lang === 'bm' ? 'Temujanji dijadualkan secara automatik. Klik tarikh untuk butiran atau tambah tugasan.' : 'Appointments are auto-scheduled. Click a date cell to view details or book new.'}
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setShowAddApptModal(true)}
                      className="btn btn-primary"
                      style={{
                        padding: '0.65rem 1.25rem',
                        fontSize: '0.88rem',
                        borderRadius: '10px',
                        background: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <PlusCircle size={16} /> {lang === 'zh' ? '预约排班' : lang === 'bm' ? 'Tambah Temujanji' : 'Book Appointment'}
                    </button>
                  </div>
                </div>

                <div className="calendar-layout-grid">
                  {/* Calendar Matrix Card */}
                  <div className="card" style={{ margin: 0, padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {/* Month Picker / Year Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#ffffff', fontWeight: 700, fontFamily: 'Outfit' }}>
                        {(() => {
                          const monthNames: Record<string, string[]> = {
                            en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            bm: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'],
                            zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                          };
                          return `${monthNames[lang]?.[currentMonth] || monthNames.en[currentMonth]} ${currentYear}`;
                        })()}
                      </h3>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          onClick={handlePrevMonth}
                          className="btn btn-outline" 
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
                        >
                          ◀
                        </button>
                        <button 
                          onClick={handleGoToToday}
                          className="btn btn-outline" 
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                        >
                          {lang === 'zh' ? '今天' : lang === 'bm' ? 'Hari Ini' : 'Today'}
                        </button>
                        <button 
                          onClick={handleNextMonth}
                          className="btn btn-outline" 
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
                        >
                          ▶
                        </button>
                      </div>
                    </div>

                    {/* Week Header */}
                    <section className="calendar-week-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '0.75rem' }}>
                      {(() => {
                        const dayInitials: Record<string, string[]> = {
                          en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                          bm: ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'],
                          zh: ['日', '一', '二', '三', '四', '五', '六']
                        };
                        return dayInitials[lang] || dayInitials.en;
                      })().map((d: string, idx: number) => (
                        <span key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, paddingBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          {d}
                        </span>
                      ))}
                    </section>

                    {/* Days Matrix */}
                    <section className="calendar-days-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                      {/* Placeholders for offset offset */}
                      {Array.from({ length: getFirstDayOfMonth(currentYear, currentMonth) }).map((_, idx) => (
                        <div key={`offset-${idx}`} style={{ aspectRatio: '1/1', background: 'transparent' }} />
                      ))}

                      {/* Day Grid cells */}
                      {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const formattedMonth = String(currentMonth + 1).padStart(2, '0');
                        const formattedDay = String(dayNum).padStart(2, '0');
                        const dayStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
                        
                        const isSelected = selectedDateStr === dayStr;
                        const appts = getDayAppointments(dayNum);
                        const hasAppt = appts.length > 0;
                        
                        const today = new Date();
                        const isToday = today.getDate() === dayNum && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
                        
                        // Theme coloring based on current specialty
                        const accentColor = selectedRole === 'escort' 
                          ? '#f59e0b' 
                          : selectedRole === 'maternity' 
                            ? '#10b981' 
                            : '#3b82f6';
                        
                        const glowShadow = selectedRole === 'escort' 
                          ? 'rgba(245,158,11,0.3)' 
                          : selectedRole === 'maternity' 
                            ? 'rgba(16,185,129,0.3)' 
                            : 'rgba(59,130,246,0.3)';

                        return (
                          <button
                            key={`day-btn-${dayNum}`}
                            onClick={() => setSelectedDateStr(dayStr)}
                            style={{
                              aspectRatio: '1/1',
                              background: isSelected ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.01)',
                              border: isSelected 
                                ? `2.5px solid ${accentColor}` 
                                : isToday 
                                  ? '2px solid rgba(245,158,11,0.6)' 
                                  : '1px solid rgba(255,255,255,0.04)',
                              borderRadius: '12px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.45rem',
                              cursor: 'pointer',
                              outline: 'none',
                              position: 'relative',
                              transition: 'all 0.2s ease-in-out',
                              boxShadow: isSelected ? `0 0 12px ${glowShadow}` : 'none'
                            }}
                          >
                            {/* Day digit */}
                            <span style={{ 
                              fontSize: '0.95rem', 
                              fontWeight: isSelected || isToday ? 800 : 500, 
                              color: isToday ? '#f59e0b' : isSelected ? '#ffffff' : 'rgba(255,255,255,0.85)',
                              marginTop: '0.1rem'
                            }}>
                              {dayNum}
                            </span>

                            {/* Dot badge indicator */}
                            {hasAppt && (
                              <span 
                                className="pulse"
                                style={{
                                  width: '7px',
                                  height: '7px',
                                  backgroundColor: accentColor,
                                  borderRadius: '50%',
                                  marginBottom: '0.15rem',
                                  boxShadow: `0 0 8px ${accentColor}`,
                                  display: 'block'
                                }} 
                              />
                            )}
                          </button>
                        );
                      })}
                    </section>
                  </div>

                  {/* Sidebar Schedule Details List */}
                  <div className="card" style={{ margin: 0, padding: '1.5rem', minHeight: '350px', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff', fontFamily: 'Outfit' }}>
                        📅 {selectedDateStr}
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {lang === 'zh' ? '本日预约安排' : lang === 'bm' ? 'Temujanji Hari Ini' : 'Scheduled Appointments'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto', maxHeight: '420px', paddingRight: '0.25rem' }}>
                      {calendarAppointments.filter(a => a.date === selectedDateStr && a.role === selectedRole).length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', textAlign: 'center', opacity: 0.6 }}>
                          <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</span>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                            {lang === 'zh' ? '本日暂无排班预约。' : lang === 'bm' ? 'Tiada temujanji dijadualkan.' : 'No appointments scheduled.'}
                          </p>
                          <button
                            onClick={() => setShowAddApptModal(true)}
                            className="btn btn-link"
                            style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            {lang === 'zh' ? '+ 录入新预约' : lang === 'bm' ? '+ Atur syif baru' : '+ Book custom shift'}
                          </button>
                        </div>
                      ) : (
                        calendarAppointments.filter(a => a.date === selectedDateStr && a.role === selectedRole).map((appt) => (
                          <div 
                            key={appt.id} 
                            style={{
                              background: 'rgba(30, 41, 59, 0.5)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                              borderRadius: '14px',
                              padding: '1.2rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.85rem',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 800, fontFamily: 'monospace' }}>
                                🕒 {appt.time}
                              </span>
                              <span style={{
                                fontSize: '0.72rem',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '8px',
                                fontWeight: 800,
                                background: appt.status === 'Completed' 
                                  ? 'rgba(16,185,129,0.15)' 
                                  : appt.status === 'In Progress' 
                                    ? 'rgba(37,99,235,0.15)' 
                                    : 'rgba(245,158,11,0.15)',
                                color: appt.status === 'Completed' 
                                  ? '#10b981' 
                                  : appt.status === 'In Progress' 
                                    ? '#3b82f6' 
                                    : '#f59e0b'
                              }}>
                                {appt.status === 'Completed' 
                                  ? (lang === 'zh' ? '已完成' : lang === 'bm' ? 'Selesai' : 'Completed') 
                                  : appt.status === 'In Progress' 
                                    ? (lang === 'zh' ? '进行中' : lang === 'bm' ? 'Aktif' : 'In Progress') 
                                    : (lang === 'zh' ? '已安排' : lang === 'bm' ? 'Dijadualkan' : 'Scheduled')}
                              </span>
                            </div>

                            {(() => {
                              const phone = appt.clientPhone || (
                                appt.clientName.includes('Zhang') || appt.clientName.includes('张') ? '012-345 6789' :
                                appt.clientName.includes('Wang') || appt.clientName.includes('王') ? '017-665 4321' :
                                appt.clientName.includes('Aminah') ? '019-876 5432' :
                                appt.clientName.includes('Tan') ? '011-234 5678' :
                                appt.clientName.includes('Lim') ? '016-789 1234' :
                                appt.clientName.includes('Chen') ? '012-987 6543' :
                                appt.clientName.includes('Siti') ? '013-456 7890' :
                                appt.clientName.includes('Wong') ? '018-765 4321' :
                                appt.clientName.includes('Lee') ? '014-321 0987' :
                                appt.clientName.includes('Loke') ? '015-678 9012' :
                                appt.clientName.includes('Fatimah') ? '017-890 1234' :
                                '012-345 6789'
                              );
                              const email = appt.clientEmail || (
                                appt.clientName.includes('Zhang') || appt.clientName.includes('张') ? 'zhang@mcsa.com.my' :
                                appt.clientName.includes('Wang') || appt.clientName.includes('王') ? 'wang@mcsa.com.my' :
                                appt.clientName.includes('Aminah') ? 'aminah@mcsa.com.my' :
                                appt.clientName.includes('Tan') ? 'tan@mcsa.com.my' :
                                appt.clientName.includes('Lim') ? 'lim@mcsa.com.my' :
                                appt.clientName.includes('Chen') ? 'chen@mcsa.com.my' :
                                appt.clientName.includes('Siti') ? 'siti@mcsa.com.my' :
                                appt.clientName.includes('Wong') ? 'wong@mcsa.com.my' :
                                appt.clientName.includes('Lee') ? 'lee@mcsa.com.my' :
                                appt.clientName.includes('Loke') ? 'loke@mcsa.com.my' :
                                appt.clientName.includes('Fatimah') ? 'fatimah@mcsa.com.my' :
                                'client@mcsa.com.my'
                              );
                              return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                  <span style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 800 }}>
                                    {appt.clientName}
                                  </span>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                    📍 {appt.location || 'Kuala Lumpur'}
                                  </span>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--accent)', display: 'flex', flexDirection: 'column', gap: '0.15rem', marginTop: '0.15rem' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                                      📞 {lang === 'zh' ? '电话: ' : lang === 'bm' ? 'Tel: ' : 'Phone: '}{phone}
                                    </span>
                                    {email && (
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#94a3b8' }}>
                                        ✉️ {lang === 'zh' ? '邮箱: ' : lang === 'bm' ? 'E-mel: ' : 'Email: '}{email}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}

                            {appt.details && (
                              <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.85rem', borderRadius: '8px', borderLeft: '3.5px solid var(--primary)', lineHeight: 1.4 }}>
                                {appt.details}
                              </p>
                            )}

                            {/* Appointment Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                              {appt.role === 'escort' && (
                                <button
                                  onClick={() => openEscortTrackerForAppt(appt)}
                                  className="btn btn-primary"
                                  style={{ flex: 1.5, padding: '0.5rem 0.75rem', fontSize: '0.8rem', borderRadius: '8px', background: 'var(--primary)', border: 'none', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', cursor: 'pointer' }}
                                >
                                  ⚡ {lang === 'zh' ? '开启就医追踪' : lang === 'bm' ? 'Jejak Pengiring' : 'Open Live Tracker'}
                                </button>
                              )}

                              {appt.role === 'maternity' && (
                                <button
                                  onClick={() => setActiveTab('maternity')}
                                  className="btn btn-primary"
                                  style={{ flex: 1.5, padding: '0.5rem 0.75rem', fontSize: '0.8rem', borderRadius: '8px', background: 'var(--health)', border: 'none', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', cursor: 'pointer' }}
                                >
                                  🍼 {lang === 'zh' ? '母婴护理日志' : lang === 'bm' ? 'Buka Log Materniti' : 'Maternity Care Log'}
                                </button>
                              )}

                              {appt.role === 'elderly' && (
                                <button
                                  onClick={() => setActiveTab('vitals')}
                                  className="btn btn-primary"
                                  style={{ flex: 1.5, padding: '0.5rem 0.75rem', fontSize: '0.8rem', borderRadius: '8px', background: 'var(--primary)', border: 'none', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', cursor: 'pointer' }}
                                >
                                  👴 {lang === 'zh' ? '长者护理日志' : lang === 'bm' ? 'Buka Log Warga Emas' : 'Senior Care Log'}
                                </button>
                              )}

                              {appt.status === 'Completed' && (
                                <button
                                  onClick={() => openReceiptGenerator(appt)}
                                  className="btn btn-outline"
                                  style={{
                                    flex: 1.5,
                                    padding: '0.5rem 0.75rem',
                                    fontSize: '0.8rem',
                                    borderRadius: '8px',
                                    borderColor: 'var(--accent)',
                                    color: 'var(--accent)',
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.25rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  🧾 {lang === 'zh' ? '开具报税收据' : lang === 'bm' ? 'Resit Cukai' : 'Tax Receipt'}
                                </button>
                              )}

                              {/* Status Toggler Select */}
                              <select
                                value={appt.status}
                                onChange={(e) => updateApptStatus(appt.id, e.target.value)}
                                style={{
                                  flex: 1.2,
                                  background: 'rgba(255,255,255,0.06)',
                                  color: '#fff',
                                  border: '1px solid rgba(255,255,255,0.12)',
                                  borderRadius: '8px',
                                  padding: '0.45rem 0.6rem',
                                  fontSize: '0.78rem',
                                  cursor: 'pointer',
                                  outline: 'none'
                                }}
                              >
                                <option value="Scheduled" style={{ color: 'black' }}>{lang === 'zh' ? '已安排' : lang === 'bm' ? 'Dijadual' : 'Scheduled'}</option>
                                <option value="In Progress" style={{ color: 'black' }}>{lang === 'zh' ? '进行中' : lang === 'bm' ? 'Aktif' : 'In Progress'}</option>
                                <option value="Completed" style={{ color: 'black' }}>{lang === 'zh' ? '已完成' : lang === 'bm' ? 'Selesai' : 'Completed'}</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => openAdjustScheduleModal(appt)}
                                className="btn btn-outline"
                                style={{
                                  flex: 1.2,
                                  padding: '0.45rem 0.6rem',
                                  fontSize: '0.78rem',
                                  borderRadius: '8px',
                                  borderColor: 'rgba(255,255,255,0.2)',
                                  color: '#cbd5e1',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.25rem',
                                  cursor: 'pointer',
                                  background: 'rgba(255,255,255,0.03)'
                                }}
                              >
                                ✏️ {lang === 'zh' ? '调整日程' : lang === 'bm' ? 'Ubah Tarikh' : 'Adjust Date'}
                              </button>

                              {appt.status !== 'Completed' && (
                                <button
                                  type="button"
                                  onClick={() => handleReleaseCase(appt)}
                                  className="btn btn-outline"
                                  style={{
                                    flex: '1 1 100%',
                                    padding: '0.45rem 0.6rem',
                                    fontSize: '0.78rem',
                                    borderRadius: '8px',
                                    borderColor: '#ef4444',
                                    color: '#ef4444',
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.25rem',
                                    cursor: 'pointer',
                                    background: 'rgba(239, 68, 68, 0.05)',
                                    marginTop: '0.25rem'
                                  }}
                                >
                                  🔓 {lang === 'zh' ? '释放退单 / 重新放回公开匹配池' : lang === 'bm' ? 'Lepaskan Syif (Batal)' : 'Release Case / Return to Pool'}
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
        )}



        {activeTab === 'vitals' && (
          <div className="animate-fade-in" style={{ color: '#f8fafc' }}>
            {/* Senior Care Hub Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(30,41,59,0.7) 100%)',
              border: '1px solid rgba(37,99,235,0.2)',
              borderRadius: '20px',
              padding: '1.25rem 2rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
                }}>
                  <User size={24} style={{ color: 'white' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.35rem', color: '#ffffff', margin: 0, fontWeight: 700, fontFamily: 'Outfit' }}>
                    {isRehab ? 'Rehabilitation & Care Management - Caregiver Backend' : 'Senior Health & Care Management - Caregiver Backend'}
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Caregiver: <strong>{member ? member.name : 'Li Xiulan'}</strong> &bull; Segment: <strong style={{ color: 'var(--primary)' }}>{isRehab ? 'Rehabilitation Care / 康复照护' : 'Elder Care / 养老看护'}</strong>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  background: 'rgba(15,23,42,0.5)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '0.4rem 1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Calendar size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{elderSession.patientName || 'Tan Ah Teck'}, {elderSession.patientAge || 78} Yrs, Day {elderSession.dayNumber || 312}</span>
                </div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '2px solid var(--primary)',
                  overflow: 'hidden',
                  backgroundColor: '#1e293b'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop" 
                    alt="Elder Patient" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
              
              {/* Card 1: Medication Tracker */}
              <div className="card" style={{ margin: 0, padding: '1.75rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  💊 Medication Tracker / 药品服药管理
                </h3>
                
                <form onSubmit={submitMedication}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Admin Time / 时间</label>
                      <select 
                        className="form-input" 
                        value={medTime} 
                        onChange={(e) => setMedTime(e.target.value)}
                        style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }}
                      >
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Administered? / 是否服药</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {[true, false].map((val) => (
                          <button
                            key={val ? 'yes' : 'no'}
                            type="button"
                            onClick={() => setMedAdministered(val)}
                            className={`btn ${medAdministered === val ? 'btn-primary' : 'btn-outline'}`}
                            style={{ 
                              flex: 1, 
                              padding: '0.4rem 0.6rem', 
                              fontSize: '0.8rem', 
                              borderRadius: '8px', 
                              background: medAdministered === val ? (val ? 'var(--health)' : 'var(--danger)') : 'transparent',
                              borderColor: medAdministered === val ? (val ? 'var(--health)' : 'var(--danger)') : 'rgba(255,255,255,0.08)'
                            }}
                          >
                            {val ? (lang === 'zh' ? '✓ 已服' : '✓ Yes') : (lang === 'zh' ? '✗ 未服' : '✗ No')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Medication Name / 药品名称</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Amlodipine" 
                        value={medName} 
                        onChange={(e) => setMedName(e.target.value)} 
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Dosage / 剂量</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. 5mg" 
                        value={medDose} 
                        onChange={(e) => setMedDose(e.target.value)} 
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: 'var(--primary)', border: 'none' }}>
                    + Add Medication Entry / 添加服药记录
                  </button>
                </form>

                {/* Medications List */}
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem' }}>TODAY'S MEDICATIONS / 今日服药表：</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                    {(elderSession.medications && elderSession.medications.length > 0) ? (
                      elderSession.medications.map((med: any) => (
                        <div key={med.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => toggleMedAdministered(med.id)}
                              style={{
                                background: med.administered ? 'var(--health-glow)' : 'rgba(239,68,68,0.1)',
                                color: med.administered ? 'var(--health)' : 'var(--danger)',
                                border: 'none',
                                width: '22px',
                                height: '22px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              {med.administered ? <Check size={14} /> : <X size={14} />}
                            </button>
                            <div>
                              <strong style={{ color: 'white' }}>{med.name} ({med.dose})</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>🕒 {med.time}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteMedication(med.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No medications added.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Daily Risk Assessment */}
              <div className="card" style={{ margin: 0, padding: '1.75rem', borderLeft: '4px solid var(--accent)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📋 Daily Risk Assessment / 每日照护评估
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
                  {/* Fall Risk */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Fall Risk / 防跌倒风险评估</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['Low', 'Medium', 'High'].map((risk) => {
                        const active = elderSession.risks?.fallRisk === risk;
                        const bg = active ? (risk === 'Low' ? 'var(--health)' : risk === 'Medium' ? 'var(--accent)' : 'var(--danger)') : 'rgba(255,255,255,0.02)';
                        return (
                          <button
                            key={risk}
                            type="button"
                            onClick={() => updateElderRisk('fallRisk', risk)}
                            className="btn"
                            style={{
                              flex: 1,
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.8rem',
                              borderRadius: '8px',
                              background: bg,
                              color: active ? '#ffffff' : 'var(--text-muted)',
                              border: active ? 'none' : '1px solid rgba(255,255,255,0.06)',
                              fontWeight: active ? 'bold' : 'normal',
                              cursor: 'pointer'
                            }}
                          >
                            {risk}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bedsores */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Bedsores / 褥疮溃疡评估</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['None', 'Area Check'].map((val) => {
                        const active = elderSession.risks?.bedsores === val;
                        const bg = active ? (val === 'None' ? 'var(--health)' : 'val === "Area Check" ? var(--danger) : var(--danger)') : 'rgba(255,255,255,0.02)';
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateElderRisk('bedsores', val)}
                            className="btn"
                            style={{
                              flex: 1,
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.8rem',
                              borderRadius: '8px',
                              background: active ? (val === 'None' ? 'var(--health)' : 'var(--danger)') : 'rgba(255,255,255,0.02)',
                              color: active ? '#ffffff' : 'var(--text-muted)',
                              border: active ? 'none' : '1px solid rgba(255,255,255,0.06)',
                              fontWeight: active ? 'bold' : 'normal',
                              cursor: 'pointer'
                            }}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cognitive Status */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Cognitive Status / 认知意识状况</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['Normal', 'Declining'].map((val) => {
                        const active = elderSession.risks?.cognitiveStatus === val;
                        const bg = active ? (val === 'Normal' ? 'var(--health)' : 'var(--danger)') : 'rgba(255,255,255,0.02)';
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateElderRisk('cognitiveStatus', val)}
                            className="btn"
                            style={{
                              flex: 1,
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.8rem',
                              borderRadius: '8px',
                              background: bg,
                              color: active ? '#ffffff' : 'var(--text-muted)',
                              border: active ? 'none' : '1px solid rgba(255,255,255,0.06)',
                              fontWeight: active ? 'bold' : 'normal',
                              cursor: 'pointer'
                            }}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Vital Signs Monitor */}
              <div className="card" style={{ margin: 0, padding: '1.75rem', borderLeft: '4px solid var(--health)' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🩺 Vital Signs Monitor / 生命体征监测
                </h3>

                <form onSubmit={submitElderVitals}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    {/* BP */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Blood Pressure / 血压 (mmHg)</span>
                        <span onClick={() => setShowElderChartsModal(true)} style={{ color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <TrendingUp size={12} /> Trends
                        </span>
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={elderBP} 
                        onChange={(e) => setElderBP(e.target.value)} 
                      />
                    </div>
                    {/* Heart Rate */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Heart Rate / 心率 (bpm)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={elderHeartRate} 
                        onChange={(e) => setElderHeartRate(e.target.value)} 
                      />
                    </div>
                    {/* Blood Sugar */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Blood Sugar / 血糖 (mmol/L)</label>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={elderBloodSugar} 
                          onChange={(e) => setElderBloodSugar(e.target.value)} 
                          style={{ flex: 1.2 }}
                        />
                        <select
                          className="form-input"
                          value={elderSugarType}
                          onChange={(e) => setElderSugarType(e.target.value)}
                          style={{ flex: 1, padding: '0.4rem 0.25rem', fontSize: '0.75rem', background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }}
                        >
                          <option value="Fasting">Fasting</option>
                          <option value="Post-Meal">Post-Meal</option>
                        </select>
                      </div>
                    </div>
                    {/* Body Temp */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Body Temp / 体温 (°C)</span>
                        <span onClick={() => setShowElderChartsModal(true)} style={{ color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <TrendingUp size={12} /> Trends
                        </span>
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={elderBodyTemp} 
                        onChange={(e) => setElderBodyTemp(e.target.value)} 
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: 'var(--health)', border: 'none', color: 'white' }}>
                    ⚡ Log Vital Signs / 录入更新体征数据
                  </button>
                </form>
              </div>

              {/* Card 4: Activities & Rota */}
              <div className="card" style={{ margin: 0, padding: '1.75rem', borderLeft: '4px solid var(--accent)', gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🚶 Activities & Rota / 日常起居照护与活动计划
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Task Checked Ratio: <strong>{elderSession.activities ? (elderSession.activities.filter((a: any) => a.checked).length) : 0}/{elderSession.activities ? elderSession.activities.length : 0} Done</strong>
                  </span>
                </div>

                {/* Event Logs list */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {elderSession.activities && elderSession.activities.map((act: any) => {
                    const isBathing = act.title === 'Assisted Bathing';
                    return (
                      <div 
                        key={act.id} 
                        style={{ 
                          padding: '1rem', 
                          borderRadius: '12px', 
                          background: act.checked ? 'rgba(16,185,129,0.02)' : isBathing ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.01)', 
                          border: act.checked ? '1px solid rgba(16,185,129,0.2)' : isBathing ? '1.5px solid var(--accent)' : '1px solid rgba(255,255,255,0.04)',
                          boxShadow: isBathing && !act.checked ? '0 0 12px rgba(245,158,11,0.1)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: isBathing ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 'bold', fontFamily: 'monospace' }}>🕒 {act.time}</span>
                          <input 
                            type="checkbox" 
                            checked={act.checked} 
                            onChange={() => toggleElderActivityChecked(act.id)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--health)' }}
                          />
                        </div>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '0.92rem', fontWeight: 700 }}>
                          {act.title}
                        </h4>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Add observations/note..." 
                          value={act.notes || ''} 
                          onChange={(e) => updateElderActivityNote(act.id, e.target.value)}
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', height: '30px' }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Inline form to quick add custom activities */}
                <form onSubmit={addElderActivityCustom} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <input 
                      type="text" 
                      required
                      placeholder="Add custom care task (e.g. Memory Game)" 
                      className="form-input" 
                      value={customActTitle} 
                      onChange={(e) => setCustomActTitle(e.target.value)} 
                      style={{ height: '36px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div style={{ width: '100px' }}>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 16:00 PM" 
                      className="form-input" 
                      value={customActTime} 
                      onChange={(e) => setCustomActTime(e.target.value)} 
                      style={{ height: '36px', padding: '0.4rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-outline" style={{ height: '36px', fontSize: '0.8rem', padding: '0 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <PlusCircle size={14} /> Schedule Task
                  </button>
                </form>
              </div>

            </div>

            {/* Bottom Actions Toolbar */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'flex-start', background: 'rgba(15,23,42,0.4)', padding: '1.25rem 2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <button 
                onClick={() => {
                  const title = prompt('Enter custom event title:');
                  if (title) {
                    const time = prompt('Enter scheduled time (e.g., 03:00 PM):', '03:00 PM');
                    const newAct = {
                      id: "act-" + Math.floor(Math.random() * 10000),
                      time: time || '03:00 PM',
                      title: title,
                      checked: false,
                      notes: ""
                    };
                    const updated = {
                      ...elderSession,
                      activities: [...(elderSession.activities || []), newAct],
                      lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
                    };
                    setElderSession(updated);
                    store.setActiveElderSession(updated);
                  }
                }}
                className="btn btn-outline" 
                style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                ➕ Quick Add Event
              </button>
              <button 
                onClick={() => setShowElderChartsModal(true)} 
                className="btn btn-outline" 
                style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                📈 View Trends Charts
              </button>
              <button 
                onClick={() => setShowElderReportModal(true)} 
                className="btn btn-outline" 
                style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                📄 Preview Daily Health Report
              </button>
              <button 
                onClick={() => {
                  shareElderWithFamily();
                  setShowElderReportModal(true);
                }} 
                className="btn btn-primary" 
                style={{ marginLeft: 'auto', background: 'var(--primary)', border: 'none', fontSize: '0.88rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px var(--primary-glow)' }}
              >
                <Share2 size={16} /> Generate Report & Send to Family (Backup/Share)
              </button>
            </div>

            {/* Elder Trends charts modal */}
            {showElderChartsModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(11, 19, 41, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '2rem'
              }}>
                <div className="card animate-fade-in" style={{ maxWidth: '680px', width: '100%', padding: '2.5rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, color: 'white' }}>📈 Senior Vital Signs Monitor Vitals Trend Charts</h3>
                    <button 
                      onClick={() => setShowElderChartsModal(false)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Chart 1: BP and sugar levels */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--primary)', fontSize: '0.92rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      🟡 Blood Pressure Trends / 血压健康走势比对 (mmHg)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      {[
                        { label: 'Systolic BP (收缩压) - Currently logged', val: Number(elderSession.vitals?.bp?.split('/')[0] || 128), color: '#3b82f6', max: 180, normal: 120 },
                        { label: 'Diastolic BP (舒张压) - Currently logged', val: Number(elderSession.vitals?.bp?.split('/')[1] || 82), color: '#10b981', max: 110, normal: 80 }
                      ].map((bar, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.2rem' }}>
                            <span>{bar.label}</span>
                            <strong>{bar.val} mmHg (Normal Reference: ~{bar.normal})</strong>
                          </div>
                          <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div style={{ width: `${(bar.val / bar.max) * 100}%`, height: '100%', background: bar.color, borderRadius: '9999px' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chart 2: Blood Sugar Trends */}
                  <div>
                    <h4 style={{ color: 'var(--health)', fontSize: '0.92rem', marginBottom: '0.8rem' }}>
                      🩸 Blood Sugar Analysis / 血糖健康波动比对 (mmol/L)
                    </h4>
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', gap: '1rem', height: '120px', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: '1rem', borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>
                        {[
                          { day: '6/1 (Fasting)', vol: 5.8, height: '65px' },
                          { day: '6/2 (Post-Meal)', vol: 7.2, height: '80px' },
                          { day: '6/3 (Fasting)', vol: 5.6, height: '62px' },
                          { day: '6/4 (Today)', vol: Number(elderSession.vitals?.bloodSugar || 6.2), height: '70px', highlight: true }
                        ].map((col, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70px' }}>
                            <span style={{ fontSize: '0.7rem', color: col.highlight ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '0.2rem' }}>{col.vol}</span>
                            <div style={{ width: '20px', height: col.height, background: col.highlight ? 'linear-gradient(0deg, var(--primary) 0%, #3b82f6 100%)' : '#475569', borderRadius: '4px 4px 0 0' }}></div>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.3rem', whiteSpace: 'nowrap' }}>{col.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Elder Daily Report preview modal */}
            {showElderReportModal && (
              <div className="printable-modal-wrapper" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(11, 19, 41, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '2rem'
              }}>
                <div className="card animate-fade-in printable-report" style={{ maxWidth: '640px', width: '100%', padding: '3rem', background: '#ffffff', color: '#1e293b', border: 'none', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--primary)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>👴</span>
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.25rem', fontFamily: 'Outfit' }}>Care Connect Hub</h3>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Daily Senior Health & Care Report</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowElderReportModal(false)}
                      className="no-print"
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
                      <div><strong>Patient Name (患者姓名):</strong> {elderSession.patientName || 'Tan Ah Teck'}</div>
                      <div><strong>Patient Age (患者年龄):</strong> {elderSession.patientAge || 78} Yrs</div>
                      <div><strong>Caregiver (专属照护员):</strong> {member ? member.name : 'Li Xiulan'}</div>
                      <div><strong>Report Date (日志日期):</strong> {elderSession.dateString || '2026-06-04'}</div>
                      <div style={{ gridColumn: '1 / -1' }}><strong>Care Segment (照护科室):</strong> Elder Care / 养老看护</div>
                    </div>

                    {/* Vitals */}
                    <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>1. Vital Signs Monitor / 生命体征数据</h4>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <li>Blood Pressure: <strong>{elderSession.vitals?.bp || '128/82'} mmHg</strong></li>
                      <li>Blood Sugar: <strong>{elderSession.vitals?.bloodSugar || '6.2'} mmol/L</strong> ({elderSession.vitals?.sugarType || 'Fasting'})</li>
                      <li>Heart Rate: <strong>{elderSession.vitals?.heartRate || '74'} bpm</strong> &bull; Body Temp: <strong>{elderSession.vitals?.bodyTemp || '36.6'} °C</strong></li>
                    </ul>

                    {/* Risk Assessments */}
                    <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>2. Risk Assessment Indicators / 临床照护评估</h4>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <li>Fall Risk: <strong style={{ color: elderSession.risks?.fallRisk === 'High' ? '#ef4444' : '#f59e0b' }}>{elderSession.risks?.fallRisk || 'Medium'}</strong></li>
                      <li>Bedsores ulcer warning: <strong style={{ color: elderSession.risks?.bedsores === 'None' ? '#10b981' : '#ef4444' }}>{elderSession.risks?.bedsores || 'None'}</strong></li>
                      <li>Cognitive/Conscious Status: <strong>{elderSession.risks?.cognitiveStatus || 'Normal'}</strong></li>
                    </ul>

                    {/* Medications */}
                    <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>3. Medication Tracking Log / 药品服药记录</h4>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                      {elderSession.medications && elderSession.medications.map((med: any) => (
                        <li key={med.id}>
                          🕒 {med.time} - <strong>{med.name} ({med.dose})</strong>: {med.administered ? '✓ Administered (已安全服药)' : '✗ Not Administered (尚未服药)'}
                        </li>
                      ))}
                      {(!elderSession.medications || elderSession.medications.length === 0) && (
                        <li>No medications administered today.</li>
                      )}
                    </ul>

                    {/* Activities */}
                    <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>4. Scheduled Activities Checklist / 起居与康复活动</h4>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                      {elderSession.activities && elderSession.activities.map((act: any) => (
                        <li key={act.id} style={{ marginBottom: '0.25rem' }}>
                          [{act.checked ? '✓' : ' '}] <strong>{act.time} - {act.title}</strong> {act.notes ? `(${act.notes})` : ''}
                        </li>
                      ))}
                    </ul>

                    {/* Family Portal Scanner QR */}
                    <div className="no-print" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        width: '70px',
                        height: '70px',
                        background: '#ffffff',
                        border: '2px solid var(--primary)',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {/* Styled QR Code Mockup */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px', width: '100%', height: '100%', background: '#000000', padding: '2px' }}>
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} style={{ background: (i % 3 === 0 || i % 4 === 1 || i === 0 || i === 4 || i === 20 || i === 24) ? '#000000' : '#ffffff' }}></div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 style={{ color: '#1e3a8a', margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>Scan to Sync Live / 扫码查看实时长者日志</h5>
                        <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0, lineHeight: 1.3 }}>
                          Scan to open the Family Portal and track daily blood pressure trends, medications, and risk assessments in real-time.
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        window.print();
                      }}
                      className="btn btn-primary no-print"
                      style={{ width: '100%', marginTop: '1rem', background: 'var(--primary)', border: 'none', color: 'white' }}
                    >
                      🖨️ Print Daily Report / 打印长者照护日报
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'maternity' && (
          <div className="animate-fade-in" style={{ color: '#f8fafc' }}>
            {/* YueShao Care Hub Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(30,41,59,0.7) 100%)',
              border: '1px solid rgba(236,72,153,0.2)',
              borderRadius: '20px',
              padding: '1.25rem 2rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#ec4899',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(236,72,153,0.3)'
                }}>
                  <Heart size={24} style={{ color: '#ffffff' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', margin: 0, fontFamily: 'Outfit', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    YueShao Care Hub <span style={{ fontSize: '0.8rem', background: 'rgba(236,72,153,0.2)', color: '#f472b6', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>Baby Log</span>
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Nanny: <strong style={{ color: '#ffffff' }}>{member ? member.name : 'Meizhen Chen'} (ID: {member ? member.member_number : 'MCSA-2026-1112'})</strong>
                  </span>
                </div>
              </div>

              {/* Active Baby selection */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  background: 'rgba(15,23,42,0.5)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '0.4rem 1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Calendar size={16} style={{ color: '#f472b6' }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>2026-06-04, Day {confinementSession.babyAgeDays || 15} ({confinementSession.babyName || 'LeLe'})</span>
                </div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '2px solid #ec4899',
                  overflow: 'hidden',
                  backgroundColor: '#1e293b'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=256&h=256&fit=crop" 
                    alt="Baby" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              </div>
            </div>

            {/* Main Interactive Nanny Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
              
              {/* Card 1: Feeding Log */}
              <div className="card" style={{ margin: 0, padding: '1.75rem', borderLeft: '4px solid #f472b6' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🍼 Feeding Log / 喂奶记录
                </h3>
                
                <form onSubmit={submitBabyFeeding}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Time / 喂奶时间</label>
                      <input type="time" className="form-input" value={feedTime} onChange={(e) => setFeedTime(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Feed Type / 类型</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {['Breast', 'Formula'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFeedType(type)}
                            className={`btn ${feedType === type ? 'btn-primary' : 'btn-outline'}`}
                            style={{ 
                              flex: 1, 
                              padding: '0.4rem 0.6rem', 
                              fontSize: '0.8rem', 
                              borderRadius: '8px', 
                              background: feedType === type ? '#ec4899' : 'transparent',
                              borderColor: feedType === type ? '#ec4899' : 'rgba(255,255,255,0.08)'
                            }}
                          >
                            {type === 'Breast' ? 'Breast / 母乳' : 'Formula / 配方奶'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {feedType === 'Breast' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Left breast mins / 左侧(分)</label>
                        <input type="number" className="form-input" value={breastLeftMins} onChange={(e) => setBreastLeftMins(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Right breast mins / 右侧(分)</label>
                        <input type="number" className="form-input" value={breastRightMins} onChange={(e) => setBreastRightMins(e.target.value)} />
                      </div>
                    </div>
                  ) : (
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Formula ml / 配方奶量 (毫升)</label>
                      <input type="number" className="form-input" placeholder="e.g. 90" value={feedFormulaMl} onChange={(e) => setFeedFormulaMl(e.target.value)} />
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#ec4899', border: 'none' }}>
                    + Add Feeding Entry / 添加记录
                  </button>
                </form>

                {/* Feeding summary list */}
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem' }}>TODAY'S LOGS / 今日日志：</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '140px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                    {(confinementSession.feedingLog && confinementSession.feedingLog.length > 0) ? (
                      confinementSession.feedingLog.map((log: any) => (
                        <div key={log.id} style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem' }}>
                          <div>
                            <span style={{ color: '#f472b6', fontWeight: 700 }}>🕒 {log.time}</span>
                            <span style={{ marginLeft: '0.75rem', color: 'white' }}>
                              {log.type === 'Breast' ? `Breast (${log.breastLeftMins}m L / ${log.breastRightMins}m R)` : `Formula (${log.formulaMl}ml)`}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No feeds logged today.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Diaper Record */}
              <div className="card" style={{ margin: 0, padding: '1.75rem', borderLeft: '4px solid #10b981' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  💩 Diaper Record / 尿布排便记录
                </h3>

                <form onSubmit={submitBabyDiaper}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Time / 记录时间</label>
                      <input type="time" className="form-input" value={diaperTime} onChange={(e) => setDiaperTime(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Urine / 尿量</label>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {['Small', 'Medium', 'Large'].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setDiaperUrine(sz)}
                            className={`btn ${diaperUrine === sz ? 'btn-primary' : 'btn-outline'}`}
                            style={{ 
                              flex: 1, 
                              padding: '0.35rem 0.2rem', 
                              fontSize: '0.72rem', 
                              borderRadius: '6px', 
                              background: diaperUrine === sz ? '#10b981' : 'transparent',
                              borderColor: diaperUrine === sz ? '#10b981' : 'rgba(255,255,255,0.08)'
                            }}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stool Color */}
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Stool Color / 便便颜色</label>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {[
                        { name: 'Gold / 金黄', val: 'Gold', color: '#f59e0b' },
                        { name: 'Green / 绿色', val: 'Green', color: '#16a34a' },
                        { name: 'Mixed / 混合', val: 'Mixed', color: '#854d0e' }
                      ].map((st) => (
                        <button
                          key={st.val}
                          type="button"
                          onClick={() => setDiaperStoolColor(st.val)}
                          className="btn"
                          style={{
                            flex: 1,
                            padding: '0.4rem 0.2rem',
                            fontSize: '0.72rem',
                            borderRadius: '6px',
                            border: diaperStoolColor === st.val ? `2px solid ${st.color}` : '1.5px solid rgba(255,255,255,0.06)',
                            background: diaperStoolColor === st.val ? 'rgba(255,255,255,0.03)' : 'transparent',
                            color: '#ffffff'
                          }}
                        >
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: st.color, display: 'inline-block', marginRight: '0.2rem' }}></span>
                          {st.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stool Texture */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Texture / 性状</label>
                      <select className="form-input" style={{ background: 'var(--bg-input)', fontSize: '0.8rem', padding: '0.4rem 0.75rem', height: '34px', cursor: 'pointer' }} value={diaperTexture} onChange={(e) => setDiaperTexture(e.target.value)}>
                        <option value="Mushy">Mushy / 软糊</option>
                        <option value="Liquid">Liquid / 水样</option>
                        <option value="Hard">Hard / 干硬</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Amount / 便量</label>
                      <select className="form-input" style={{ background: 'var(--bg-input)', fontSize: '0.8rem', padding: '0.4rem 0.75rem', height: '34px', cursor: 'pointer' }} value={diaperAmount} onChange={(e) => setDiaperAmount(e.target.value)}>
                        <option value="Small">Small / 少</option>
                        <option value="Medium">Medium / 中</option>
                        <option value="Large">Large / 多</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Irritation Notes / 便便备注/红屁股观察</label>
                    <input type="text" className="form-input" style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }} placeholder="Stool Description/Irritation..." value={diaperNotes} onChange={(e) => setDiaperNotes(e.target.value)} />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#10b981', border: 'none' }}>
                    + Log Diaper Check / 添加排便
                  </button>
                </form>
              </div>

              {/* Card 3: Sleep & Activity */}
              <div className="card" style={{ margin: 0, padding: '1.75rem', borderLeft: '4px solid #6366f1' }}>
                <h3 style={{ fontSize: '1.2', marginBottom: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  💤 Sleep & Activity / 睡眠与日常活动
                </h3>

                <form onSubmit={submitBabySleep}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Sleep Start / 入睡时间</label>
                      <input type="text" className="form-input" style={{ padding: '0.4rem 0.75rem' }} value={sleepEnter} onChange={(e) => setSleepEnter(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Wake Up / 醒来时间</label>
                      <input type="text" className="form-input" style={{ padding: '0.4rem 0.75rem' }} value={sleepExit} onChange={(e) => setSleepExit(e.target.value)} />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#6366f1', border: 'none', marginBottom: '1.5rem' }}>
                    + Add Sleep Cycle / 添加睡眠
                  </button>
                </form>

                {/* Daily activities checkboxes */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Daily Activities / 今日活动</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { key: 'bathing', label: '🚿 Bathing / 洗澡' },
                      { key: 'tummyTime', label: '👶 Tummy Time / 抬头训练' },
                      { key: 'massage', label: '💆 Massage / 抚触抚摩' },
                      { key: 'music', label: '🎵 Music / 早教音乐' }
                    ].map((act) => {
                      const isActive = !!(confinementSession.sleepActivity?.activities?.[act.key]);
                      return (
                        <label 
                          key={act.key} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            fontSize: '0.82rem', 
                            background: 'rgba(255,255,255,0.02)', 
                            padding: '0.6rem 0.75rem', 
                            borderRadius: '8px', 
                            border: isActive ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.04)',
                            cursor: 'pointer',
                            color: isActive ? '#818cf8' : '#cbd5e1'
                          }}
                        >
                          <input 
                            type="checkbox" 
                            checked={isActive}
                            onChange={() => toggleBabyActivity(act.key)}
                            style={{ accentColor: '#6366f1' }}
                          />
                          <span>{act.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card 4: Health Check & Jaundice */}
              <div className="card" style={{ margin: 0, padding: '1.75rem', borderLeft: '4px solid #f59e0b' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🩺 Health Check & Vitals / 体温与黄疸监测
                </h3>

                <form onSubmit={submitBabyHealth}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Body Temp / 体温 (°C)</label>
                      <input type="number" step="0.1" className="form-input" value={healthTemp} onChange={(e) => setHealthTemp(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Umbilical / 肚脐护理</label>
                      <select className="form-input" style={{ background: 'var(--bg-input)', fontSize: '0.8rem', padding: '0.4rem 0.5rem', height: '34px', cursor: 'pointer' }} value={umbilicalStatus} onChange={(e) => setUmbilicalStatus(e.target.value)}>
                        <option value="Dry & Healing">Dry & Healing / 干燥已愈</option>
                        <option value="Mild Redness">Mild Redness / 轻微发红</option>
                        <option value="Moist / Unhealed">Moist / 潮湿未愈</option>
                      </select>
                    </div>
                  </div>

                  {/* Jaundice Levels Forehead, Chest, Cheeks */}
                  <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Jaundice Levels / 经皮黄疸指数 (mg/dL)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Forehead / 额头</label>
                      <input type="number" step="0.1" className="form-input" style={{ padding: '0.4rem 0.5rem', fontSize: '0.85rem' }} value={jaundiceForehead} onChange={(e) => setJaundiceForehead(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Chest / 胸部</label>
                      <input type="number" step="0.1" className="form-input" style={{ padding: '0.4rem 0.5rem', fontSize: '0.85rem' }} value={jaundiceChest} onChange={(e) => setJaundiceChest(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cheeks / 脸颊</label>
                      <input type="number" step="0.1" className="form-input" style={{ padding: '0.4rem 0.5rem', fontSize: '0.85rem' }} value={jaundiceCheeks} onChange={(e) => setJaundiceCheeks(e.target.value)} />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#f59e0b', border: 'none' }}>
                    ⚡ Update Health Data / 更新数据
                  </button>
                </form>
              </div>
            </div>

            {/* Key Metrics Summary Cards Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div className="card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>🍼 Total Feed Volume (ml)</span>
                <strong style={{ fontSize: '1.8rem', color: '#f472b6', fontFamily: 'Outfit' }}>
                  {(() => {
                    const logs = confinementSession.feedingLog || [];
                    const total = logs.reduce((sum: number, log: any) => sum + (log.formulaMl || 0), 0);
                    return total;
                  })()} ml
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                  ({(() => {
                    const logs = confinementSession.feedingLog || [];
                    const breasts = logs.filter((l: any) => l.type === 'Breast').length;
                    return `${breasts} breastfeeds logged`;
                  })()})
                </span>
              </div>

              <div className="card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>💩 Diaper Count (Checks)</span>
                <strong style={{ fontSize: '1.8rem', color: '#10b981', fontFamily: 'Outfit' }}>
                  {confinementSession.diaperRecord ? confinementSession.diaperRecord.length : 0} times
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>Urine & stool frequency</span>
              </div>

              <div className="card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>💤 Total Sleep Duration</span>
                <strong style={{ fontSize: '1.8rem', color: '#818cf8', fontFamily: 'Outfit' }}>
                  {(() => {
                    const logs = confinementSession.sleepActivity?.sleepLogs || [];
                    const total = logs.reduce((sum: number, log: any) => sum + (log.totalHours || 0), 0);
                    return total;
                  })()} hrs
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>Newborn rest logs</span>
              </div>
            </div>

            {/* Bottom Actions Toolbar */}
            <div style={{
              display: 'flex',
              gap: '1.25rem',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => {
                  const updated = {
                    ...confinementSession,
                    feedingLog: [
                      { id: "feed-mock-1", time: "11:00", type: "Formula", breastLeftMins: 0, breastRightMins: 0, formulaMl: 100 },
                      ...(confinementSession.feedingLog || [])
                    ],
                    diaperRecord: [
                      { id: "diaper-mock-1", time: "11:20", urine: "Medium", stoolColor: "Gold", texture: "Mushy", amount: "Medium", notes: "Mild diaper cream applied" },
                      ...(confinementSession.diaperRecord || [])
                    ],
                    lastUpdated: new Date().toTimeString().split(' ')[0].substring(0, 5)
                  };
                  setConfinementSession(updated);
                  store.setActiveConfinementSession(updated);
                  alert("⚡ Quick mock events injected successfully! / 模拟护理记录已快捷写入。");
                }}
                className="btn btn-outline"
                style={{ borderRadius: '10px' }}
              >
                ➕ Quick Add Event
              </button>

              <button 
                onClick={() => setShowChartsModal(true)}
                className="btn btn-outline"
                style={{ borderRadius: '10px' }}
              >
                📊 View History Charts
              </button>

              <button 
                onClick={() => setShowReportModal(true)}
                className="btn btn-outline"
                style={{ borderRadius: '10px' }}
              >
                📄 Preview Daily Report
              </button>

              <button 
                onClick={archiveDailyReport}
                className="btn btn-primary"
                style={{ 
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                  padding: '0.85rem 1.5rem',
                  marginLeft: '1rem',
                  marginRight: '1rem'
                }}
              >
                💾 {lang === 'zh' ? '归档并生成今日报告' : lang === 'bm' ? 'Simpan & Arkib Laporan' : 'Save & Archive Daily'}
              </button>

              <button 
                onClick={shareConfinementWithFamily}
                className="btn btn-primary"
                style={{ 
                  borderRadius: '10px', 
                  marginLeft: 'auto', 
                  background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                  boxShadow: '0 4px 14px rgba(236,72,153,0.3)',
                  padding: '0.85rem 2rem'
                }}
              >
                🔗 Generate Report & Send to Client (Backup/Share)
              </button>
            </div>

            {/* History Charts Modal */}
            {showChartsModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(11, 19, 41, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '2rem'
              }}>
                <div className="card animate-fade-in" style={{ maxWidth: '680px', width: '100%', padding: '2.5rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, color: 'white' }}>📈 Baby Development Vitals Trend Charts</h3>
                    <button 
                      onClick={() => setShowChartsModal(false)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Chart 1: Jaundice level forehead/cheeks/chest */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ec4899', fontSize: '0.92rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      🟡 Transcutaneous Jaundice Trend / 经皮黄疸比对 (mg/dL)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      {[
                        { label: 'Forehead (额头)', val: Number(confinementSession.healthCheck?.jaundiceForehead || 8.2), color: '#f59e0b', max: 15 },
                        { label: 'Cheeks (脸颊)', val: Number(confinementSession.healthCheck?.jaundiceCheeks || 8.0), color: '#3b82f6', max: 15 },
                        { label: 'Chest (胸部)', val: Number(confinementSession.healthCheck?.jaundiceChest || 7.5), color: '#10b981', max: 15 }
                      ].map((bar, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.2rem' }}>
                            <span>{bar.label}</span>
                            <strong>{bar.val} mg/dL ({bar.val < 10 ? 'Safe/正常' : 'Caution/警戒'})</strong>
                          </div>
                          <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div style={{ width: `${(bar.val / bar.max) * 100}%`, height: '100%', background: bar.color, borderRadius: '9999px', transition: 'all 0.5s ease' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chart 2: Daily feeding trends */}
                  <div>
                    <h4 style={{ color: '#10b981', fontSize: '0.92rem', marginBottom: '0.8rem' }}>
                      🍼 Feeding Volume Analysis / 奶量摄入走势 (ml)
                    </h4>
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', gap: '1rem', height: '120px', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: '1rem', borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>
                        {[
                          { day: '6/1', vol: 480, height: '70px' },
                          { day: '6/2', vol: 500, height: '75px' },
                          { day: '6/3', vol: 520, height: '80px' },
                          { day: '6/4 (Today)', vol: 550, height: '90px', highlight: true }
                        ].map((col, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
                            <span style={{ fontSize: '0.7rem', color: col.highlight ? '#ec4899' : 'var(--text-muted)', marginBottom: '0.2rem' }}>{col.vol}ml</span>
                            <div style={{ width: '20px', height: col.height, background: col.highlight ? 'linear-gradient(0deg, #ec4899 0%, #f472b6 100%)' : '#475569', borderRadius: '4px 4px 0 0', position: 'relative' }}></div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.3rem', whiteSpace: 'nowrap' }}>{col.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}



            {/* Daily Report Preview Modal */}
            {showReportModal && (
              <div className="printable-modal-wrapper" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(11, 19, 41, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '2rem'
              }}>
                <div className="card animate-fade-in printable-report" style={{ maxWidth: '640px', width: '100%', padding: '3rem', background: '#ffffff', color: '#1e293b', border: 'none', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ec4899', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>🍼</span>
                      <div>
                        <h3 style={{ margin: 0, color: '#ec4899', fontSize: '1.25rem', fontFamily: 'Outfit' }}>YueShao Care Hub</h3>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Daily Baby Wellness Report</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowReportModal(false)}
                      className="no-print"
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
                      <div><strong>Baby Name (宝宝姓名):</strong> {confinementSession.babyName || 'LeLe'}</div>
                      <div><strong>Age Days (婴儿日龄):</strong> {confinementSession.babyAgeDays || 15} Days</div>
                      <div><strong>Nanny (专职月嫂):</strong> {member ? member.name : 'Meizhen Chen'}</div>
                      <div><strong>Report Date (日期):</strong> {confinementSession.dateString || '2026-06-04'}</div>
                    </div>

                    {/* Vitals */}
                    <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>1. Physical Vitals & Jaundice / 婴儿指征</h4>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <li>Body Temperature: <strong>{confinementSession.healthCheck?.temp || '36.6'} °C</strong> (Normal/正常)</li>
                      <li>Jaundice Forehead: <strong>{confinementSession.healthCheck?.jaundiceForehead || '8.2'} mg/dL</strong> &bull; Chest: <strong>{confinementSession.healthCheck?.jaundiceChest || '7.5'}</strong> &bull; Cheeks: <strong>{confinementSession.healthCheck?.jaundiceCheeks || '8.0'}</strong></li>
                      <li>Umbilical Cord Status: <strong>{confinementSession.healthCheck?.umbilicalStatus || 'Dry & Healing'}</strong></li>
                    </ul>

                    {/* Feeding */}
                    <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>2. Nutritional Feed Intake / 今日喂奶量</h4>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      Total Formula intake: <strong>{(() => {
                        const logs = confinementSession.feedingLog || [];
                        return logs.reduce((sum: number, l: any) => sum + (l.formulaMl || 0), 0);
                      })()} ml</strong>
                    </p>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                      {confinementSession.feedingLog && confinementSession.feedingLog.map((log: any) => (
                        <li key={log.id}>
                          Time: {log.time} &bull; {log.type === 'Breast' ? `Breastfeed (${log.breastLeftMins}m / ${log.breastRightMins}m)` : `Formula Feed (${log.formulaMl}ml)`}
                        </li>
                      ))}
                    </ul>

                    {/* Diapers */}
                    <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>3. Diaper Output Logs / 排便尿布历史</h4>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                      {confinementSession.diaperRecord && confinementSession.diaperRecord.map((log: any) => (
                        <li key={log.id}>
                          Time: {log.time} &bull; Urine: {log.urine} &bull; Stool: {log.stoolColor} ({log.texture}, {log.amount}) &bull; {log.notes ? `Note: ${log.notes}` : ''}
                        </li>
                      ))}
                    </ul>

                    {/* Activities */}
                    <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>4. Completed Care Activities / 照护活动</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                      {confinementSession.sleepActivity?.activities?.bathing && <span style={{ background: '#f0fdf4', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>✓ Bathing (洗完澡)</span>}
                      {confinementSession.sleepActivity?.activities?.tummyTime && <span style={{ background: '#f0fdf4', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>✓ Tummy Time (抬头训练)</span>}
                      {confinementSession.sleepActivity?.activities?.massage && <span style={{ background: '#f0fdf4', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>✓ Infant Massage (婴儿抚触)</span>}
                      {confinementSession.sleepActivity?.activities?.music && <span style={{ background: '#f0fdf4', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>✓ Music (听音乐)</span>}
                    </div>

                    {/* Family Portal Scanner QR */}
                    <div className="no-print" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        width: '70px',
                        height: '70px',
                        background: '#ffffff',
                        border: '2px solid #ec4899',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {/* Styled QR Code Mockup */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px', width: '100%', height: '100%', background: '#000000', padding: '2px' }}>
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} style={{ background: (i % 3 === 0 || i % 4 === 1 || i === 0 || i === 4 || i === 20 || i === 24) ? '#000000' : '#ffffff' }}></div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 style={{ color: '#1e3a8a', margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>Scan to Sync Live / 扫码查看实时母婴日志</h5>
                        <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0, lineHeight: 1.3 }}>
                          Scanning this code allows the family to monitor real-time feeding, diaper changes, and jaundice measurements instantly.
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        window.print();
                      }}
                      className="btn btn-primary no-print"
                      style={{ width: '100%', marginTop: '1rem', background: '#ec4899', border: 'none', color: 'white' }}
                    >
                      🖨️ Print Daily Report / 打印婴儿日报
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Escort Daily Report Preview Modal */}
            {showEscortReportModal && (
              <div className="printable-modal-wrapper" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(11, 19, 41, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '2rem'
              }}>
                <div className="card animate-fade-in printable-report" style={{ maxWidth: '640px', width: '100%', padding: '3rem', background: '#ffffff', color: '#1e293b', border: 'none', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--primary)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>🏥</span>
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.25rem', fontFamily: 'Outfit' }}>Care Connect Hub</h3>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Daily Medical Escort Report</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowEscortReportModal(false)}
                      className="no-print"
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
                      <div><strong>Patient Name (患者姓名):</strong> {escortSession.patientName}</div>
                      <div><strong>Patient Age (患者年龄):</strong> {escortSession.patientAge} Yrs</div>
                      <div><strong>Caregiver (专属陪诊师):</strong> {member ? member.name : 'Li Xiulan'}</div>
                      <div><strong>Report Date (日志日期):</strong> {selectedDateStr || '2026-06-05'}</div>
                      <div style={{ gridColumn: '1 / -1' }}><strong>Medical Facility (就诊医院):</strong> {escortSession.hospital} ({escortSession.department})</div>
                    </div>

                    {/* Progress Timeline */}
                    <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>1. Escort Milestones Timeline / 诊疗服务进度</h4>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {[
                        { title: 'Patient Met', zh: '已接诊患者', desc: 'Companion met client at the outpatient lobby.' },
                        { title: 'Clinic Queuing', zh: '排队候诊中', desc: 'Registered and queuing outside the consultation room.' },
                        { title: 'Appointment Ongoing', zh: '医生诊疗中', desc: 'Active clinical consultation with doctor.' },
                        { title: 'Payment/Medicine', zh: '代缴费代取药', desc: 'Clearing hospital bills and dispensing prescriptions.' },
                        { title: 'Check-out/Transfer', zh: '就诊结束送回', desc: 'Outpatient checkout complete, returning patient home.' }
                      ].map((step, idx) => {
                        const isDone = idx < escortSession.statusIndex;
                        const isActive = idx === escortSession.statusIndex;
                        return (
                          <li key={idx} style={{ color: isDone ? '#10b981' : isActive ? 'var(--primary)' : '#64748b' }}>
                            <strong>[{isDone ? '✓ Completed' : isActive ? '● Ongoing' : 'Pending'}] {step.title} ({step.zh})</strong>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{step.desc}</div>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Diagnosis & Notes */}
                    <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>2. Doctor's Diagnosis & Notes / 医生诊断与交代事项</h4>
                    <p style={{ margin: '0 0 1.5rem 0', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', color: '#334155', fontStyle: escortSession.doctorNote ? 'normal' : 'italic' }}>
                      {escortSession.doctorNote || 'No diagnosis or directives logged by the companion.'}
                    </p>

                    {/* Revisit Date */}
                    <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>3. Revisit Recommendation / 建议复诊日期</h4>
                    <p style={{ margin: '0 0 1.5rem 0', fontWeight: 'bold', color: 'var(--accent-dark)' }}>
                      📅 {escortSession.revisitDate || 'No follow-up revisit recommended.'}
                    </p>

                    {/* Attached Photos */}
                    <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>4. Attached Medical Receipts & Documents / 上传单据材料</h4>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                      {escortSession.uploadedPhotos && escortSession.uploadedPhotos.filter((p: string) => !!p).length > 0 ? (
                        escortSession.uploadedPhotos.filter((p: string) => !!p).map((photo: string, index: number) => (
                          <div key={index} style={{ width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                            <img src={photo} alt={`Medical Document ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic', margin: 0 }}>No files or photos uploaded.</p>
                      )}
                    </div>

                    {/* Family Portal Scanner QR */}
                    <div className="no-print" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{
                        width: '70px',
                        height: '70px',
                        background: '#ffffff',
                        border: '2px solid var(--primary)',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {/* Styled QR Code Mockup */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px', width: '100%', height: '100%', background: '#000000', padding: '2px' }}>
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} style={{ background: (i % 3 === 0 || i % 4 === 1 || i === 0 || i === 4 || i === 20 || i === 24) ? '#000000' : '#ffffff' }}></div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 style={{ color: '#1e3a8a', margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>Scan to Track Live / 扫码查看实时就医进度</h5>
                        <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0, lineHeight: 1.3 }}>
                          Scanning this code redirects the family directly to the live Family Portal where they can monitor maps, patient steps, and chat in real-time.
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        window.print();
                      }}
                      className="btn btn-primary no-print"
                      style={{ width: '100%', marginTop: '1rem', background: 'var(--primary)', border: 'none', color: 'white' }}
                    >
                      🖨️ Print Daily Report / 打印陪诊报告
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'library' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff', fontFamily: 'Outfit' }}>
              🏥 Hospital Guidelines & SOP Library / 医院大楼导航与SOP
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Check internal hospital maps, routing lists, and outpatient checkpoints. Easily search and open JPG floor plans.
            </p>

            {/* Search Bar & State Filter Dropdown */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              background: 'rgba(15,23,42,0.4)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <input 
                type="text" 
                placeholder="🔍 Search hospital name or keywords..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ flex: 1, height: '40px', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              />
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="form-input"
                style={{ 
                  width: '180px', 
                  height: '40px', 
                  background: 'var(--bg-input)', 
                  color: 'white', 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  padding: '0 0.75rem',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">All States / 所有州属</option>
                {['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Sarawak', 'Sabah', 'Perak', 'Pahang', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Perlis', 'Terengganu'].map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Grid of Hospital Items */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {(() => {
                const filtered = libItems.filter((item) => {
                  const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesState = stateFilter === '' || item.state === stateFilter;
                  return matchesSearch && matchesState;
                });

                if (filtered.length === 0) {
                  return (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', opacity: 0.6 }}>
                      <span style={{ fontSize: '2rem' }}>🔍</span>
                      <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>No guides match your search criteria.</p>
                    </div>
                  );
                }

                return filtered.map((item) => (
                  <div 
                    key={item.id} 
                    className="card" 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between', 
                      margin: 0,
                      padding: 0,
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      background: 'rgba(30,41,59,0.35)'
                    }}
                  >
                    {/* Visual Card Image Header for JPG floor plans */}
                    {item.imageUrl ? (
                      <div 
                        onClick={() => {
                          setSelectedMapItem(item);
                          setZoomLevel(1);
                          setShowMapModal(true);
                        }}
                        style={{ width: '100%', height: '160px', overflow: 'hidden', cursor: 'pointer', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#0f172a' }}
                      >
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} 
                        />
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: 'rgba(11, 19, 41, 0.8)',
                          color: 'var(--accent)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          backdropFilter: 'blur(4px)'
                        }}>
                          📍 {item.state || 'Kuala Lumpur'}
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(0deg, rgba(15,23,42,0.9) 0%, transparent 100%)',
                          padding: '1.5rem 1rem 0.5rem 1rem',
                          color: '#fff',
                          fontSize: '0.78rem',
                          fontWeight: 500
                        }}>
                          Click to preview block plan
                        </div>
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--primary)' }}></div>
                    )}

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <BookOpen size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff', lineHeight: 1.3 }}>{item.title}</h3>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
                          Accredited clinic route layout guide and clinical checkpoint list. Published for active caregivers and student navigations.
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {item.imageUrl && (
                          <button 
                            onClick={() => {
                              setSelectedMapItem(item);
                              setZoomLevel(1);
                              setShowMapModal(true);
                            }}
                            className="btn btn-outline"
                            style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 600 }}
                          >
                            🔍 Preview
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = item.imageUrl || '/hospital_maps/hkl_map.jpg';
                            link.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            alert(`Downloading file: ${item.title}`);
                          }} 
                          className="btn btn-primary"
                          style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', background: 'var(--primary)' }}
                        >
                          <Download size={15} /> Download ({item.size})
                        </button>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* High-Fidelity interactive Zoomable Modal for maps */}
            {showMapModal && selectedMapItem && (
              <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(11, 19, 41, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '1.5rem'
              }}>
                <div className="card animate-fade-in" style={{
                  maxWidth: '900px',
                  width: '100%',
                  height: '90vh',
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: 0
                }}>
                  {/* Modal Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem 2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedMapItem.title}</h3>
                      <span className="badge badge-active" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'var(--primary-glow)', color: 'var(--primary)', marginTop: '0.3rem', display: 'inline-block' }}>
                        📍 {selectedMapItem.state || 'Kuala Lumpur'}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => setShowMapModal(false)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Modal Map Zoom Area */}
                  <div style={{
                    flex: 1,
                    overflow: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#070a13',
                    padding: '1rem',
                    position: 'relative'
                  }}>
                    <div style={{
                      transform: `scale(${zoomLevel})`,
                      transition: 'transform 0.15s ease-out',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img 
                        src={selectedMapItem.imageUrl || '/hospital_maps/hkl_map.jpg'} 
                        alt={selectedMapItem.title} 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '70vh',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                      />
                    </div>

                    {/* On-screen Zoom Indicators */}
                    <div style={{
                      position: 'absolute',
                      bottom: '1.5rem',
                      right: '1.5rem',
                      display: 'flex',
                      gap: '0.5rem',
                      background: 'rgba(15,23,42,0.85)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '30px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(8px)',
                      alignItems: 'center'
                    }}>
                      <button 
                        onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', width: '24px' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1', minWidth: '40px', textAlign: 'center', fontWeight: 'bold' }}>
                        {Math.round(zoomLevel * 100)}%
                      </span>
                      <button 
                        onClick={() => setZoomLevel(Math.min(3.0, zoomLevel + 0.25))}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', width: '24px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '1.25rem 2rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    background: '#090d1a',
                    gap: '1rem'
                  }}>
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = selectedMapItem.imageUrl || '/hospital_maps/hkl_map.jpg';
                        link.download = `${selectedMapItem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="btn btn-primary"
                      style={{ padding: '0.6rem 1.5rem', fontSize: '0.88rem', background: 'var(--primary)', fontWeight: 700 }}
                    >
                      📥 Download Map File ({selectedMapItem.size})
                    </button>
                    <button 
                      onClick={() => setShowMapModal(false)}
                      className="btn btn-outline"
                      style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem', borderColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                    >
                      Close / 关闭
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'card' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Digital Union Membership Card</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Presents verified MCSA registry identification for clinical audits.</p>

            <div className="card-layout-grid">
              {/* Premium Holographic Card Component */}
              <div style={{
                width: '100%',
                maxWidth: '460px',
                height: '276px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {/* Glowing highlight reflection */}
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.08) 50%, transparent 55%)',
                  pointerEvents: 'none'
                }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                      MULTICARE SUPPORT UNION
                    </h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '0.08em' }}>
                      MCSA MALAYSIA VALIDATED REGISTRY
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {(member?.category || '').includes('Patient Companion') && (
                      <img 
                        src="/aplus-assist-logo.jpg" 
                        alt="A+ Assist Logo" 
                        style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: '#0d162d', objectFit: 'contain', padding: '1px' }} 
                      />
                    )}
                    <img 
                      src="/mcsa-logo.png" 
                      alt="MCSA Logo" 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'white', padding: '1px' }} 
                    />
                  </div>
                </div>
                {/* Chip & Photo Row */}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', margin: '0.5rem 0' }}>
                  {/* Photo box */}
                  <div style={{
                    width: '70px',
                    height: '85px',
                    backgroundColor: '#1e293b',
                    border: '2px solid var(--accent)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    position: 'relative',
                    flexShrink: 0
                  }}>
                    {member?.photo ? (
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '36px', height: '36px', color: 'var(--text-muted)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(245, 158, 11, 0.9)',
                      color: '#000000',
                      fontSize: '0.45rem',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: '1px 0'
                    }}>
                      PHOTO ID
                    </div>
                  </div>

                  {/* Member Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                        Membership ID
                      </span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#ffffff', letterSpacing: '0.05em' }}>
                        {member ? member.member_number : 'MCSA-2026-0009'}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Specialty</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }}>
                        {member ? member.category : 'Elderly Caregiver'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Holder Name</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{member ? member.name : 'Li Xiulan'}</span>
                  </div>

                  <div style={{ marginLeft: '1rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>NRIC / ID No.</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>{member?.nric || '830812-14-5544'}</span>
                  </div>
                  
                  {/* Status stamp */}
                  <div style={{
                    border: '2px solid var(--health)',
                    color: 'var(--health)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    transform: 'rotate(-5deg)',
                    textTransform: 'uppercase',
                    backgroundColor: 'var(--bg-main)',
                    marginRight: 'auto',
                    marginLeft: '1rem'
                  }}>
                    ✓ Active Vetted
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Expiration</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>{member ? member.expiry : '2027-05-28'}</span>
                  </div>
                </div>
              </div>

              {/* Security audit advice */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="card" style={{ margin: 0, height: '100%', background: 'rgba(30,41,59,0.3)', borderColor: 'rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: 'var(--accent)', fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🛡️ Digital Credential Vetted
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    This membership card operates with encrypted registry validation. You can present this QR-bound serial card to clinic or hospital supervisors to access outpatient priorities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'escortForm' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff', fontFamily: 'Outfit' }}>
                  {lang === 'zh' ? '病人记录与服务协议' : lang === 'bm' ? 'Rekod Pesakit & Perjanjian' : 'Patient Profiles & Agreements'}
                </h2>
                <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
                  {lang === 'zh' ? '管理患者健康档案与陪诊服务责任告知协议。' : lang === 'bm' ? 'Urus profil kesihatan pesakit dan perjanjian pengiring perubatan.' : 'Manage client health profiles and medical escort liability agreements.'}
                </p>
              </div>
              {formMode === 'list' && (
                <button 
                  onClick={() => {
                    setFormMode('create');
                    setFormSignedDate(new Date().toISOString().split('T')[0]);
                  }}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', boxShadow: '0 2px 8px var(--primary-glow)' }}
                >
                  ➕ {lang === 'zh' ? '新建病人档案' : lang === 'bm' ? 'Profil Pesakit Baru' : 'New Patient Profile'}
                </button>
              )}
            </div>

            {formMode === 'list' && (
              <div style={{
                background: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem', display: 'block', marginBottom: '0.2rem' }}>🔗 Share Agreement Link with Client / 分享签署链接给病人</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Send this encrypted page URL to your client. Once they fill out their health profile and sign, it will dynamically register on your dashboard.
                  </span>
                </div>
                <button
                  onClick={() => {
                    const link = window.location.origin + '/sign-agreement?caregiver=' + (member ? member.id : 'M-101');
                    navigator.clipboard.writeText(link);
                    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                    const linkMsg = 'Signing Link copied to clipboard:\n' + link + 
                      (isLocal ? '\n\n💡 提示 / Tip:\n当前网站运行在您的电脑本地开发环境 (localhost)，此链接只能在您当前的这台电脑浏览器上打开测试。\n\n如需在手机上或让客户测试，请将链接中的 "localhost" 替换为您电脑的局域网 IP (例如 192.168.x.x)，或者在部署到公网服务器域名 (如 https://mcsa.com.my) 后再分享。' : '');
                    alert(linkMsg);
                  }}
                  className="btn btn-outline"
                  style={{
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  📋 Copy Client Sign Link / 复制签署链接
                </button>
              </div>
            )}

            {formMode === 'list' && (
              <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '700px' }}>
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Appointment</th>
                      <th>Medical Facility</th>
                      <th>Emergency Contact</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {escortForms.map((f: any) => (
                      <tr key={f.id}>
                        <td>
                          <strong style={{ color: '#ffffff' }}>{f.fullName}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{f.gender} &bull; {f.nric}</div>
                        </td>
                        <td>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{f.appointmentDate}</span>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>🕒 {f.appointmentTime}</div>
                        </td>
                        <td>
                          <span style={{ color: '#ffffff' }}>{f.facility}</span>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{f.specialty} ({f.doctor || 'N/A'})</div>
                        </td>
                        <td>
                          <span style={{ color: '#ffffff' }}>{f.emergencyName}</span>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>📞 {f.emergencyPhone} ({f.relationship})</div>
                        </td>
                        <td>
                          <button 
                            onClick={() => {
                              setCurrentViewForm(f);
                              setFormMode('view');
                            }}
                            className="btn btn-outline"
                            style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                          >
                            🔍 View & Sign / 详情与协议
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {formMode === 'view' && currentViewForm && (
              <div>
                <button 
                  onClick={() => setFormMode('list')}
                  className="btn btn-outline"
                  style={{ marginBottom: '1.5rem', padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  ← Back to List / 返回列表
                </button>

                <div className="card animate-fade-in" style={{ padding: '3rem', background: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '900px', margin: '0 auto' }}>
                  {/* Digital Signature & Form Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src="/aplus-assist-logo.jpg" alt="A+ Assist" style={{ width: '50px', height: '50px', backgroundColor: '#0d162d', borderRadius: '50%', padding: '2px', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'contain' }} />
                      <img src="/mcsa-logo.png" alt="MCSA" style={{ width: '50px', height: '50px', backgroundColor: 'white', borderRadius: '50%', padding: '2px' }} />
                      <div>
                        <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.3rem', fontFamily: 'Outfit' }}>MCSA MALAYSIA</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Medical Escort Client Record / 陪诊档案资料</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Document ID:</span>
                      <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent)' }}>{currentViewForm.id}</div>
                    </div>
                  </div>

                  <h2 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '2rem', fontFamily: 'Outfit' }}>📝 Medical Escort Service – Client Information Form</h2>

                  {/* Section 1 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>1. Personal Information / 个人信息</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>Full Name / 姓名:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.fullName}</span></div>
                      <div><strong>Gender / 性别:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.gender}</span></div>
                      <div><strong>Date of Birth / 出生日期:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.dob || 'N/A'}</span></div>
                      <div><strong>NRIC or Passport / 证件号:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.nric}</span></div>
                      <div><strong>Contact Number / 电话:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.phone || 'N/A'}</span></div>
                      <div><strong>Home Address / 地址:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.address || 'N/A'}</span></div>
                      <div><strong>Emergency Contact / 紧急联系人:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.emergencyName || 'N/A'}</span></div>
                      <div><strong>Emergency Phone / 联系电话:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.emergencyPhone || 'N/A'}</span></div>
                      <div><strong>Relationship / 关系:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.relationship || 'N/A'}</span></div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>2. Escort Service Details / 陪诊服务详情</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>Appointment Date / 就诊日期:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.appointmentDate || 'N/A'}</span></div>
                      <div><strong>Appointment Time / 就诊时间:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.appointmentTime || 'N/A'}</span></div>
                      <div><strong>Medical Facility / 就诊医院:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.facility || 'N/A'}</span></div>
                      <div><strong>Doctor Name / 医生姓名:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.doctor || 'N/A'}</span></div>
                      <div><strong>Department or Specialty / 科室:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.specialty || 'N/A'}</span></div>
                      <div><strong>Admin Tasks Required / 协助取药/付款/登记:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.assistanceRequired ? 'Yes / 是' : 'No / 否'}</span></div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>3. Health & Medical History / 健康与既往病史</h4>
                    <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div><strong>Main Complaint / 就诊主诉:</strong> <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: '0.25rem 0 0 0' }}>{currentViewForm.complaint || 'N/A'}</p></div>
                      <div>
                        <strong>Past Medical History / 既往病史:</strong>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                          {currentViewForm.pastHistory && currentViewForm.pastHistory.length > 0 ? (
                            currentViewForm.pastHistory.map((h: string, i: number) => (
                              <span key={i} className="badge badge-active" style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}>{h}</span>
                            ))
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>None / 无</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>4. Allergy Information / 过敏史</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
                      <div><strong>Drug Allergies / 药物过敏:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.drugAllergy}</span></div>
                      <div><strong>Food Allergies / 食物过敏:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.foodAllergy}</span></div>
                      <div><strong>Other Allergies / 其他过敏:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.otherAllergy}</span></div>
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>5. Current Medication / 当前用药情况</h4>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>Taking medications or supplements / 是否正在服药:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.takingMeds ? 'Yes / 是' : 'No / 否'}</span>
                      {currentViewForm.takingMeds && (
                        <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: '0.4rem 0 0 0', whiteSpace: 'pre-wrap' }}>{currentViewForm.medsList}</p>
                      )}
                    </div>
                  </div>

                  {/* Section 6 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>6. Surgical History / 手术史</h4>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>History of surgeries or procedures / 手术史:</strong>
                      <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: '0.4rem 0 0 0' }}>{currentViewForm.surgicalHistory || 'No / 无'}</p>
                    </div>
                  </div>

                  {/* Section 7 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>7. Functional & Mobility Assessment / 行动与感官功能评估</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>Mobility Difficulty / 行动评估:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.mobility}</span></div>
                      <div><strong>Hearing Difficulties / 听力困难:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.hearingDifficulty ? 'Yes / 有' : 'No / 无'}</span></div>
                      <div><strong>Speech Difficulties / 语言困难:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.speechDifficulty ? 'Yes / 有' : 'No / 无'}</span></div>
                      <div><strong>Visual Impairment / 视力受损情况:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.visualImpairment || 'No / 无'}</span></div>
                    </div>
                  </div>

                  {/* Section 8 */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>8. Additional Information / 额外备注</h4>
                    <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: 0 }}>{currentViewForm.additionalInfo || 'None / 无'}</p>
                  </div>

                  {/* Escort Authorization & Liability Agreement (陪诊协议条款) */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', marginBottom: '2.5rem', fontSize: '0.85rem' }}>
                    <h3 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>🤝 Medical Escort Service Authorization & Liability Agreement / 陪诊服务协议与责任告知书</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '240px', overflowY: 'auto', paddingRight: '0.5rem', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '8px', background: '#0b1329' }}>
                      <p><strong>第一条 服务内容 / Article 1 Service Scope</strong><br />
                      乙方仅提供非医疗类流程协助，包括：陪同挂号、排队、缴费、检查引导、取药、办理出入院手续、送检、引导路线、协助沟通。<br />
                      Provider only provides non-medical process assistance, including escorting registration, queuing, payment, examination guidance, medication collection, admission/discharge procedures, sample delivery, route guidance, and communication assistance.</p>
                      <p><strong>第二条 医疗行为禁止声明 / Article 2 Prohibition of Medical Practice</strong><br />
                      1. 乙方并非马来西亚注册医生、护士或医护人员，严禁从事任何医疗行为，否则属违法。<br />
                      Provider is not a registered medical practitioner, nurse or healthcare personnel in Malaysia. Any medical practice is strictly prohibited and illegal.<br />
                      2. 甲方确认：陪诊员无权替代医生/护士提供任何医疗判断或治疗。<br />
                      Client confirms that the escort has no authority to replace doctors/nurses for any medical judgment or treatment.</p>
                      <p><strong>第三条 医疗文件代签授权与限制 / Article 3 Authorization & Restriction for Signing</strong><br />
                      1. 甲方许可书面授权乙方代签纯行政/非医疗文件，仅限登记表等。<br />
                      Client may authorize Provider in writing to sign pure administrative/non-medical documents only.<br />
                      2. 乙方绝对不得代签：手术同意书、麻醉同意书、侵入性检查同意书等涉及医疗决策的文件。<br />
                      Provider SHALL NOT sign any surgery consent, anesthesia consent, invasive procedure consent, or any medical decision-related documents.</p>
                      <p><strong>第四条 紧急情况处理 / Article 4 Emergency Procedure</strong><br />
                      1. 服务期间如发生突发疾病、晕倒等急症，乙方仅可立即呼叫医院医护/急诊，不做任何医疗处置。<br />
                      In case of sudden illness, Provider shall immediately call hospital staff/emergency department and shall not perform any medical intervention.<br />
                      2. 乙方可协助联系甲方紧急联系人，但不承担医疗决策责任。<br />
                      Provider may assist to contact Client's emergency contact but shall not bear medical decision-making liability.</p>
                      <p><strong>第五条 风险告知与责任免除 / Article 5 Risk Disclosure & Liability Exclusion</strong><br />
                      陪诊服务不改变病情发展，因自身疾病、隐瞒病史等后果，乙方不承担责任。<br />
                      Escort service does not change medical condition. Provider is not liable for any consequences caused by own illness, withheld medical history, or allergy.</p>
                      <p><strong>第六条 个人数据保护 (PDPA 2010) / Article 6 Personal Data Protection</strong><br />
                      双方遵守马来西亚《2010年个人数据保护法》(PDPA 2010)。患者健康及个人信息属于敏感敏感数据，仅限本次服务使用，服务结束后不予留存。<br />
                      Both Parties comply with Personal Data Protection Act 2010 (PDPA 2010). Patient health and personal data are sensitive and used only for this service.</p>
                    </div>
                  </div>

                  {/* Declaration & Signatures */}
                  <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.5rem', fontSize: '0.9rem' }}>
                    <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                      "I hereby confirm that the information provided above is true and accurate. I understand that the information will be used solely for medical escort service coordination. / 我在此确认上述提供的信息真实准确。我明白此信息将仅用于陪诊服务协调及紧急救援目的。"
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Client Digital Signature / 甲方客户签字</span>
                        <div style={{ fontSize: '1.3rem', fontFamily: 'Outfit, sans-serif', fontStyle: 'italic', fontWeight: 'bold', color: 'var(--accent)', margin: '0.75rem 0' }}>
                          ✍️ {currentViewForm.clientSigned}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed Date / 签署日期: {currentViewForm.signedDate}</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Escort Service Provider / 乙方陪诊师确认</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#60a5fa', margin: '0.9rem 0' }}>
                          🛡️ {(() => {
                            const members = store.getUnionMembers();
                            const found = members.find((m: any) => m.id === currentViewForm.caregiverId || m.member_number === currentViewForm.caregiverId);
                            return found ? found.name : (currentViewForm.caregiverId || 'Unassigned');
                          })()}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status / 执照状态: Active Licensed Vetted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formMode === 'create' && (
              <div>
                <button 
                  onClick={() => setFormMode('list')}
                  className="btn btn-outline"
                  style={{ marginBottom: '1.5rem', padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  ← Back to List / 返回列表
                </button>

                <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
                  <h3 style={{ color: '#ffffff', marginBottom: '1.5rem', textAlign: 'center' }}>📋 Fill New Client Escort Intake Form</h3>
                  <form onSubmit={submitEscortForm}>
                    
                    {/* Section 1 Form */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>1. Personal Information / 个人基本信息</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Full Name / 客户姓名 *</label>
                          <input type="text" required className="form-input" placeholder="e.g. Grandpa Zhang" value={formFullName} onChange={(e) => setFormFullName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Gender / 性别</label>
                          <select className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }} value={formGender} onChange={(e) => setFormGender(e.target.value)}>
                            <option value="Male">Male / 男</option>
                            <option value="Female">Female / 女</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Date of Birth / 出生日期</label>
                          <input type="date" className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff' }} value={formDob} onChange={(e) => setFormDob(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">NRIC or Passport / 证件号 *</label>
                          <input type="text" required className="form-input" placeholder="e.g. 480312-14-5567" value={formNric} onChange={(e) => setFormNric(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Contact Phone / 联系电话</label>
                          <input type="text" className="form-input" placeholder="e.g. 012-3344556" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label className="form-label">Home Address / 住宅地址</label>
                          <input type="text" className="form-input" placeholder="e.g. 22, Jalan Bukit Bintang, KL" value={formAddress} onChange={(e) => setFormAddress(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Emergency Contact Name / 紧急联系人</label>
                          <input type="text" className="form-input" placeholder="e.g. Zhang Wei" value={formEmergencyName} onChange={(e) => setFormEmergencyName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Emergency Contact Phone / 紧急电话</label>
                          <input type="text" className="form-input" placeholder="e.g. 019-8765432" value={formEmergencyPhone} onChange={(e) => setFormEmergencyPhone(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Relationship / 与客户关系</label>
                          <input type="text" className="form-input" placeholder="e.g. Son" value={formRelationship} onChange={(e) => setFormRelationship(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Section 2 Form */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>2. Escort Service Details / 就诊陪护详情</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Appointment Date / 就诊日期</label>
                          <input type="date" className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff' }} value={formApptDate} onChange={(e) => setFormApptDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Appointment Time / 就诊时间</label>
                          <input type="time" className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff' }} value={formApptTime} onChange={(e) => setFormApptTime(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Medical Facility / 医院或诊所</label>
                          <input type="text" className="form-input" placeholder="e.g. Hospital Kuala Lumpur" value={formFacility} onChange={(e) => setFormFacility(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Doctor Name / 医生姓名</label>
                          <input type="text" className="form-input" placeholder="e.g. Dr. Tan" value={formDoctor} onChange={(e) => setFormDoctor(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Department or Specialty / 科室名称</label>
                          <input type="text" className="form-input" placeholder="e.g. Cardiology Dept" value={formSpecialty} onChange={(e) => setFormSpecialty(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <label className="form-label">Need administrative help? / 是否需协助缴费/取药/办手续</label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.4rem' }}>
                            <input type="checkbox" style={{ width: '18px', height: '18px' }} checked={formAssist} onChange={(e) => setFormAssist(e.target.checked)} />
                            <span>Yes, assistance required / 需要协助</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Section 3 Form */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>3. Health & Medical History / 健康主诉与病史</h4>
                      <div className="form-group">
                        <label className="form-label">Main Complaint or Reason for Consultation / 就诊主诉与原因</label>
                        <textarea className="form-input" placeholder="Describe current symptoms or consultation purpose..." rows={3} style={{ resize: 'vertical' }} value={formComplaint} onChange={(e) => setFormComplaint(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Past Medical History / 既往病史 (Select all that apply)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginTop: '0.5rem' }}>
                          {['Hypertension', 'Diabetes', 'Heart Disease', 'Stroke', 'Cancer', 'Kidney Disease', 'Asthma', 'Mental Health Condition', 'Dementia / Alzheimer\'s Disease', 'Parkinson\'s Disease'].map((cond) => (
                            <label key={cond} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={formHistory.includes(cond)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormHistory([...formHistory, cond]);
                                  } else {
                                    setFormHistory(formHistory.filter(h => h !== cond));
                                  }
                                }}
                              />
                              <span>{cond}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 4 Form */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>4. Allergy Information / 过敏信息</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Drug Allergies / 药物过敏史</label>
                          <input type="text" className="form-input" placeholder="e.g. No Known Drug Allergy or penicillin (hives)" value={formDrugAllergy} onChange={(e) => setFormDrugAllergy(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Food Allergies / 食物过敏史</label>
                          <input type="text" className="form-input" placeholder="e.g. No or Peanuts (anaphylaxis)" value={formFoodAllergy} onChange={(e) => setFormFoodAllergy(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Other Allergies / 其它过敏（如乳胶等）</label>
                          <input type="text" className="form-input" placeholder="e.g. No or Latex (skin rash)" value={formOtherAllergy} onChange={(e) => setFormOtherAllergy(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Section 5 & 6 Form */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>5. Current Medication & Surgeries / 用药与手术史</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                            <input type="checkbox" checked={formTakingMeds} onChange={(e) => setFormTakingMeds(e.target.checked)} />
                            <strong className="form-label" style={{ margin: 0 }}>Currently taking medication or supplements / 正在服用药物或保健品</strong>
                          </label>
                          {formTakingMeds && (
                            <textarea className="form-input" placeholder="List medications with dosage & frequency (e.g. Metformin 500mg - 1x daily)" rows={3} style={{ resize: 'vertical' }} value={formMedsList} onChange={(e) => setFormMedsList(e.target.value)} />
                          )}
                        </div>
                        <div className="form-group">
                          <label className="form-label">Surgical History / 手术或医疗史</label>
                          <input type="text" className="form-input" placeholder="e.g. Knee Replacement (2020), Heart Bypass (2022) or No" value={formSurgicalHistory} onChange={(e) => setFormSurgicalHistory(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Section 7 Form */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>6. Functional & Mobility Assessment / 行动与日常功能评估</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Mobility Difficulties / 行动困难评估</label>
                          <select className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }} value={formMobility} onChange={(e) => setFormMobility(e.target.value)}>
                            <option value="Walk Independently">Walk Independently / 独立行走</option>
                            <option value="Require Walking Stick">Require Walking Stick / 需拐杖</option>
                            <option value="Require Walker">Require Walker / 需助行架</option>
                            <option value="Wheelchair User">Wheelchair User / 轮椅使用者</option>
                            <option value="Require Assistance Walking">Require Assistance Walking / 需助行</option>
                          </select>
                        </div>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.4rem' }}>
                            <input type="checkbox" checked={formHearing} onChange={(e) => setFormHearing(e.target.checked)} />
                            <span>Hearing difficulties / 听力障碍</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={formSpeech} onChange={(e) => setFormSpeech(e.target.checked)} />
                            <span>Speech difficulties / 语言沟通障碍</span>
                          </label>
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label className="form-label">Visual Impairment / 视力障碍描述 (if any)</label>
                          <input type="text" className="form-input" placeholder="e.g. Cataract in right eye, or No" value={formVisual} onChange={(e) => setFormVisual(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Section 8 Form */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>7. Additional Information / 其他特别备注</h4>
                      <div className="form-group">
                        <textarea className="form-input" placeholder="Any specific requirements or instructions for our medical escort..." rows={2} style={{ resize: 'vertical' }} value={formAdditional} onChange={(e) => setFormAdditional(e.target.value)} />
                      </div>
                    </div>

                    {/* Signature */}
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                      <p style={{ fontSize: '0.82rem', margin: '0 0 1rem 0', color: 'var(--text-muted)' }}>
                        * Agreement Terms Declaration: I hereby authorize MCSA companion to assist during hospital outpatient activities. I confirm that all medical history is accurate.
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Client Digital Signature (Type Name) *</label>
                          <input type="text" required className="form-input" placeholder="Client signature name" value={formSigned} onChange={(e) => setFormSigned(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Signed Date</label>
                          <input type="date" className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff' }} value={formSignedDate} onChange={(e) => setFormSignedDate(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', background: 'var(--primary)', boxShadow: '0 2px 8px var(--primary-glow)' }}>
                      💾 Submit Intake Form & Sign Agreement
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'confinementContract' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff' }}>Confinement Service Agreement / 产后护理服务协议</h2>
                <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>Generate and manage agreements for maternity care clients.</p>
              </div>
              {confinementFormMode === 'list' && (
                <button 
                  onClick={() => {
                    setConfinementFormMode('create');
                  }}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', boxShadow: '0 2px 8px var(--primary-glow)' }}
                >
                  ➕ Create Agreement / 新建月子协议
                </button>
              )}
            </div>

            {confinementFormMode === 'list' && (
              <div style={{
                background: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem', display: 'block', marginBottom: '0.2rem' }}>🔗 Share Agreement Link with Client / 分享协议链接给长者家属</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Copy the link below or click "📋 Copy" on a pending contract to send to the client. Once signed, the contract will update automatically here.
                  </span>
                </div>
              </div>
            )}

            {confinementFormMode === 'list' && (
              <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '700px' }}>
                  <thead>
                    <tr>
                      <th>Contract ID</th>
                      <th>Client Name</th>
                      <th>Expected Due Date (EDD)</th>
                      <th>Service Fee</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confinementContracts.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                          No agreements created yet. / 暂无服务协议。
                        </td>
                      </tr>
                    ) : (
                      confinementContracts.map((c: any) => (
                        <tr key={c.id}>
                          <td>
                            <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{c.id}</strong>
                          </td>
                          <td>
                            {c.clientName ? (
                              <div>
                                <strong style={{ color: '#ffffff' }}>{c.clientName}</strong>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{c.clientPhone}</div>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Waiting for Client / 等待家属填写</span>
                            )}
                          </td>
                          <td>
                            <span style={{ color: '#ffffff' }}>{c.clientEdd || '-'}</span>
                            {c.signedDate && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Signed: {c.signedDate}</div>}
                          </td>
                          <td>
                            <strong style={{ color: '#ffffff' }}>RM {c.serviceFee}</strong>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Dep: RM {c.deposit}</div>
                          </td>
                          <td>
                            <span className={`badge ${c.status === 'Signed' ? 'badge-active' : 'badge-inactive'}`}>
                              {c.status === 'Signed' ? '✓ Signed / 已签署' : '⏱ Pending / 待签署'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                onClick={() => {
                                  setCurrentViewConfinementContract(c);
                                  setConfinementFormMode('view');
                                }}
                                className="btn btn-outline"
                                style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                              >
                                {c.status === 'Signed' ? '🔍 View / 详情' : '🔍 Preview / 预览'}
                              </button>
                              {c.status !== 'Signed' && (
                                <button
                                  onClick={() => {
                                    const link = window.location.origin + '/sign-agreement?type=confinement&contractId=' + c.id;
                                    navigator.clipboard.writeText(link);
                                    alert('Client Signing Link copied to clipboard:\n' + link);
                                  }}
                                  className="btn btn-primary"
                                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                                >
                                  📋 Copy Link
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {confinementFormMode === 'view' && currentViewConfinementContract && (
              <div>
                <button 
                  onClick={() => setConfinementFormMode('list')}
                  className="btn btn-outline"
                  style={{ marginBottom: '1.5rem', padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  ← Back to List / 返回列表
                </button>

                <div id="confinement-agreement-print-area" className="card animate-fade-in" style={{ padding: '3rem', background: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '900px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src="/mcsa-logo.png" alt="MCSA" style={{ width: '50px', height: '50px', backgroundColor: 'white', borderRadius: '50%', padding: '2px' }} />
                      <div>
                        <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.3rem', fontFamily: 'Outfit' }}>MCSA MALAYSIA</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confinement Agreement / 产后护理协议</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Contract ID / 协议编号:</span>
                      <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent)' }}>{currentViewConfinementContract.id}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>Status / 状态:</span>
                      <span className={`badge ${currentViewConfinementContract.status === 'Signed' ? 'badge-active' : 'badge-inactive'}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                        {currentViewConfinementContract.status === 'Signed' ? 'Signed / 已签署' : 'Pending Client / 待签署'}
                      </span>
                    </div>
                  </div>

                  <h2 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '2rem', fontFamily: 'Outfit', fontSize: '1.8rem' }}>
                    产后护理服务协议 / POSTNATAL CARE SERVICE AGREEMENT
                  </h2>

                  <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    本协议由以下双方签订 / This Agreement is made between:
                  </p>

                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      <div>
                        <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                          甲方（客户/家属）Client / Family Representative
                        </h4>
                        {currentViewConfinementContract.clientName ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
                            <div><strong>姓名 Name:</strong> <span style={{ color: 'white' }}>{currentViewConfinementContract.clientName}</span></div>
                            <div><strong>身份证/护照号码 NRIC/Passport No.:</strong> <span style={{ color: 'white' }}>{currentViewConfinementContract.clientNric}</span></div>
                            <div><strong>联系电话 Contact No.:</strong> <span style={{ color: 'white' }}>{currentViewConfinementContract.clientPhone}</span></div>
                            <div><strong>预产期 Expected Due Date (EDD):</strong> <span style={{ color: 'white' }}>{currentViewConfinementContract.clientEdd}</span></div>
                            <div><strong>地址 Address:</strong> <span style={{ color: 'white' }}>{currentViewConfinementContract.clientAddress}</span></div>
                          </div>
                        ) : (
                          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.88rem' }}>
                            Waiting for client to sign and complete information.<br />
                            等待客户签署并完善信息。
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                          乙方（照护人员）Caregiver
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
                          <div><strong>姓名 Name:</strong> <span style={{ color: 'white' }}>{currentViewConfinementContract.caregiverName}</span></div>
                          <div><strong>会员编号 Membership No.:</strong> <span style={{ color: 'white' }}>{currentViewConfinementContract.caregiverMemberNo}</span></div>
                          <div><strong>联系电话 Contact No.:</strong> <span style={{ color: 'white' }}>{currentViewConfinementContract.caregiverPhone}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                      第一条 服务内容 / Scope of Services
                    </h4>
                    <p style={{ fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
                      妈妈护理、宝宝护理、母乳喂养协助、宝宝洗澡、衣物清洗、月子护理及相关照护支持。<br />
                      <span style={{ color: 'var(--text-muted)' }}>Mother care, baby care, breastfeeding support, baby bathing, laundry and confinement care support.</span>
                    </p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                      第二条 服务费用与订金 / Service Fees and Deposit
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
                      <div><strong>服务费用 Fee:</strong> <span style={{ color: 'white' }}>RM {currentViewConfinementContract.serviceFee}</span></div>
                      <div><strong>订金 Deposit:</strong> <span style={{ color: 'white' }}>RM {currentViewConfinementContract.deposit}</span></div>
                      <div><strong>尾款 Balance Payment:</strong> <span style={{ color: 'white' }}>RM {currentViewConfinementContract.balance}</span></div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: '#ffffff', margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>
                      💳 收款账户信息 / Payment Bank Details
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                      <div><strong>银行名称 Bank Name:</strong> <span style={{ color: 'white' }}>{currentViewConfinementContract.bankName}</span></div>
                      <div><strong>账户名称 Account Name:</strong> <span style={{ color: 'white' }}>{currentViewConfinementContract.accountName}</span></div>
                      <div><strong>账户号码 Account Number:</strong> <span style={{ color: 'white' }}>{currentViewConfinementContract.accountNumber}</span></div>
                      <div><strong>DuitNow:</strong> <span style={{ color: 'white' }}>{currentViewConfinementContract.duitNow || 'N/A'}</span></div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                      工会声明 / Union Declaration
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.06)', padding: '0.85rem', borderRadius: '8px', background: '#0b1329', fontSize: '0.82rem', lineHeight: '1.5' }}>
                      <p>
                        1. 工会仅作为会员管理、培训及服务配对平台。 / The Union acts solely as a membership, training and matching platform.
                      </p>
                      <p>
                        2. 乙方为独立自雇人士。 / The Caregiver is an independent self-employed service provider.
                      </p>
                      <p>
                        3. 所有服务安排、收费、责任及义务均由甲乙双方自行承担。 / All services, payments, responsibilities and obligations are solely between the Client and the Caregiver.
                      </p>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.5rem', fontSize: '0.88rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>甲方（客户/家属）Client Signature</span>
                        {currentViewConfinementContract.clientSignature ? (
                          <>
                            <div style={{ fontSize: '1.3rem', fontFamily: 'Outfit, sans-serif', fontStyle: 'italic', fontWeight: 'bold', color: 'var(--accent)', margin: '0.75rem 0' }}>
                              ✍️ {currentViewConfinementContract.clientSignature}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed Date / 签署日期: {currentViewConfinementContract.signedDate}</span>
                          </>
                        ) : (
                          <div style={{ margin: '1rem 0', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            ✍️ Pending Signature / 待家属签署
                          </div>
                        )}
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>乙方（照护人员）Caregiver Signature</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#60a5fa', margin: '0.85rem 0' }}>
                          🛡️ {currentViewConfinementContract.caregiverSignature}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vetted Union Caregiver / 工会认证照护员</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                  <button 
                    onClick={() => {
                      window.print();
                    }}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    🖨️ Print Agreement / 打印或存为 PDF
                  </button>
                </div>
              </div>
            )}

            {confinementFormMode === 'create' && (
              <div>
                <button 
                  onClick={() => setConfinementFormMode('list')}
                  className="btn btn-outline"
                  style={{ marginBottom: '1.5rem', padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  ← Back to List / 返回列表
                </button>

                <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
                  <h3 style={{ color: '#ffffff', marginBottom: '1.5rem', textAlign: 'center' }}>📋 Generate Confinement Service Agreement / 创建月子照护服务协议</h3>
                  <form onSubmit={submitConfinementContract}>
                    
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>
                        1. Caregiver Information / 照护人员（已预填，工会已核验）
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Caregiver Name / 照护人员姓名</label>
                          <input type="text" readOnly className="form-input" style={{ opacity: 0.7 }} value={member ? member.name : 'Meizhen Chen'} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Membership Number / 会员编号</label>
                          <input type="text" readOnly className="form-input" style={{ opacity: 0.7 }} value={member ? member.member_number : 'MCSA-2026-1112'} />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>
                        2. Pricing & Payments / 服务费用与订金 (RM)
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Total Fee / 服务费用 (RM) *</label>
                          <input type="number" required className="form-input" value={confinementServiceFee} onChange={(e) => {
                            setConfinementServiceFee(e.target.value);
                            const bal = Number(e.target.value) - Number(confinementDeposit);
                            setConfinementBalance(String(bal >= 0 ? bal : 0));
                          }} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Deposit / 订金金额 (RM) *</label>
                          <input type="number" required className="form-input" value={confinementDeposit} onChange={(e) => {
                            setConfinementDeposit(e.target.value);
                            const bal = Number(confinementServiceFee) - Number(e.target.value);
                            setConfinementBalance(String(bal >= 0 ? bal : 0));
                          }} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Balance / 尾款金额 (RM)</label>
                          <input type="number" readOnly className="form-input" style={{ opacity: 0.7 }} value={confinementBalance} />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>
                        3. Receiving Bank Account / 收款银行信息
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Bank Name / 开户银行 *</label>
                          <select className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }} value={confinementBankName} onChange={(e) => setConfinementBankName(e.target.value)}>
                            <option value="Maybank">Maybank</option>
                            <option value="CIMB Bank">CIMB Bank</option>
                            <option value="Public Bank">Public Bank</option>
                            <option value="RHB Bank">RHB Bank</option>
                            <option value="Hong Leong Bank">Hong Leong Bank</option>
                            <option value="AmBank">AmBank</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Account Holder Name / 账户名称 *</label>
                          <input type="text" required className="form-input" placeholder="Account Name" value={confinementAccountName} onChange={(e) => setConfinementAccountName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Account Number / 银行卡号 *</label>
                          <input type="text" required className="form-input" placeholder="Account Number" value={confinementAccountNumber} onChange={(e) => setConfinementAccountNumber(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">DuitNow ID (Optional / 选填)</label>
                          <input type="text" className="form-input" placeholder="e.g. Phone or NRIC for DuitNow" value={confinementDuitNow} onChange={(e) => setConfinementDuitNow(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', background: 'var(--primary)', boxShadow: '0 2px 8px var(--primary-glow)' }}>
                      ⚡ Generate Service Agreement / 确认并生成协议
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        

        {activeTab === 'elderlyContract' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff' }}>
                  {isRehab ? 'Rehabilitation Care Service Agreement / 康复照护服务协议' : 'Elderly Care Service Agreement / 老人照护服务协议'}
                </h2>
                <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
                  {isRehab ? 'Generate and manage agreements for rehabilitation care clients.' : 'Generate and manage agreements for senior care clients.'}
                </p>
              </div>
              {elderlyFormMode === 'list' && (
                <button 
                  onClick={() => {
                    setElderlyFormMode('create');
                    const today = new Date().toISOString().split('T')[0];
                    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    setElderlyServiceDate(`${today} to ${nextMonth}`);
                  }}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', boxShadow: '0 2px 8px var(--primary-glow)' }}
                >
                  {isRehab ? '➕ Create Agreement / 新建康复协议' : '➕ Create Agreement / 新建照护协议'}
                </button>
              )}
            </div>

            {elderlyFormMode === 'list' && (
              <div style={{
                background: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem', display: 'block', marginBottom: '0.2rem' }}>
                    {isRehab ? '🔗 Share Agreement Link with Client / 分享协议链接给康复客户家属' : '🔗 Share Agreement Link with Client / 分享协议链接给长者家属'}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Copy the link below or click "📋 Copy" on a pending contract to send to the client. Once signed, the contract will update automatically here.
                  </span>
                </div>
              </div>
            )}

            {elderlyFormMode === 'list' && (
              <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '700px' }}>
                  <thead>
                    <tr>
                      <th>Contract ID</th>
                      <th>Client Name</th>
                      <th>Service Period</th>
                      <th>Service Fee</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {elderlyContracts.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                          No agreements created yet. / 暂无服务协议。
                        </td>
                      </tr>
                    ) : (
                      elderlyContracts.map((c: any) => (
                        <tr key={c.id}>
                          <td>
                            <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{c.id}</strong>
                          </td>
                          <td>
                            {c.clientName ? (
                              <div>
                                <strong style={{ color: '#ffffff' }}>{c.clientName}</strong>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{c.clientPhone}</div>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Waiting for Client / 等待家属填写</span>
                            )}
                          </td>
                          <td>
                            <span style={{ color: '#ffffff' }}>{c.serviceDate}</span>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>🕒 {c.serviceHours}</div>
                          </td>
                          <td>
                            <strong style={{ color: '#ffffff' }}>RM {c.serviceFee}</strong>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Dep: RM {c.deposit}</div>
                          </td>
                          <td>
                            <span className={`badge ${c.status === 'Signed' ? 'badge-active' : 'badge-inactive'}`}>
                              {c.status === 'Signed' ? '✓ Signed / 已签署' : '⏱ Pending / 待签署'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                onClick={() => {
                                  setCurrentViewElderlyContract(c);
                                  setElderlyFormMode('view');
                                }}
                                className="btn btn-outline"
                                style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                              >
                                {c.status === 'Signed' ? '🔍 View / 详情' : '🔍 Preview / 预览'}
                              </button>
                              {c.status !== 'Signed' && (
                                <button
                                  onClick={() => {
                                    const link = window.location.origin + '/sign-agreement?type=elderly&contractId=' + c.id;
                                    navigator.clipboard.writeText(link);
                                    alert('Client Signing Link copied to clipboard:\n' + link);
                                  }}
                                  className="btn btn-primary"
                                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                                >
                                  📋 Copy Link
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {elderlyFormMode === 'view' && currentViewElderlyContract && (
              <div>
                <button 
                  onClick={() => setElderlyFormMode('list')}
                  className="btn btn-outline"
                  style={{ marginBottom: '1.5rem', padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  ← Back to List / 返回列表
                </button>

                <div id="elderly-agreement-print-area" className="card animate-fade-in" style={{ padding: '3rem', background: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '900px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src="/mcsa-logo.png" alt="MCSA" style={{ width: '50px', height: '50px', backgroundColor: 'white', borderRadius: '50%', padding: '2px' }} />
                      <div>
                        <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.3rem', fontFamily: 'Outfit' }}>MCSA MALAYSIA</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Elderly Care Agreement / 老人照护协议</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Contract ID / 协议编号:</span>
                      <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent)' }}>{currentViewElderlyContract.id}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>Status / 状态:</span>
                      <span className={`badge ${currentViewElderlyContract.status === 'Signed' ? 'badge-active' : 'badge-inactive'}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                        {currentViewElderlyContract.status === 'Signed' ? 'Signed / 已签署' : 'Pending Client / 待签署'}
                      </span>
                    </div>
                  </div>

                  <h2 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '2rem', fontFamily: 'Outfit', fontSize: '1.8rem' }}>
                    老人照护服务协议 / ELDERLY CARE SERVICE AGREEMENT
                  </h2>

                  <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    本协议由以下双方签订 / This Agreement is made between:
                  </p>

                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      <div>
                        <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                          甲方（客户/家属）Client / Family Representative
                        </h4>
                        {currentViewElderlyContract.clientName ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
                            <div><strong>姓名 Name:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.clientName}</span></div>
                            <div><strong>身份证/护照号码 NRIC/Passport No.:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.clientNric}</span></div>
                            <div><strong>联系电话 Contact No.:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.clientPhone}</span></div>
                            <div><strong>地址 Address:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.clientAddress}</span></div>
                          </div>
                        ) : (
                          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.88rem' }}>
                            Waiting for client to sign and complete information.<br />
                            等待客户签署并完善信息。
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                          乙方（照护人员）Caregiver
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
                          <div><strong>姓名 Name:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.caregiverName}</span></div>
                          <div><strong>会员编号 Membership No.:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.caregiverMemberNo}</span></div>
                          <div><strong>联系电话 Contact No.:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.caregiverPhone}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                      第一条 服务内容 / Scope of Services
                    </h4>
                    <p style={{ fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
                      乙方同意向甲方指定之长者提供非医疗性质之照护服务，包括日常生活照顾、陪伴服务、协助进食、个人卫生护理、服药提醒、陪诊服务、简单家务及其他约定服务。<br />
                      <span style={{ color: 'var(--text-muted)' }}>The Caregiver agrees to provide non-medical care services including daily living assistance, companionship, feeding assistance, hygiene assistance, medication reminders, medical escort services, light housekeeping and other agreed services.</span>
                    </p>
                    <p style={{ fontSize: '0.88rem', marginTop: '0.5rem', fontWeight: 600 }}>
                      乙方并非医生、护士或医疗专业人员。<br />
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>The Caregiver is not a doctor, nurse, or licensed medical practitioner.</span>
                    </p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                      第二条 服务期限与费用 / Service Period and Fees
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
                      <div><strong>服务日期 Service Date:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.serviceDate}</span></div>
                      <div><strong>服务时间 Service Hours:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.serviceHours}</span></div>
                      <div><strong>服务费用 Service Fee:</strong> <span style={{ color: 'white' }}>RM {currentViewElderlyContract.serviceFee}</span></div>
                      <div><strong>订金 Deposit:</strong> <span style={{ color: 'white' }}>RM {currentViewElderlyContract.deposit}</span></div>
                      <div style={{ gridColumn: 'span 2' }}><strong>尾款 Balance Payment:</strong> <span style={{ color: 'white' }}>RM {currentViewElderlyContract.balance}</span></div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: '#ffffff', margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>
                      💳 收款账户信息 / Payment Bank Details
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                      <div><strong>银行名称 Bank Name:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.bankName}</span></div>
                      <div><strong>账户名称 Account Name:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.accountName}</span></div>
                      <div><strong>账户号码 Account Number:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.accountNumber}</span></div>
                      <div><strong>DuitNow:</strong> <span style={{ color: 'white' }}>{currentViewElderlyContract.duitNow || 'N/A'}</span></div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                      照护条款细则 / Terms & Conditions
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem', border: '1px solid rgba(255,255,255,0.06)', padding: '0.85rem', borderRadius: '8px', background: '#0b1329', fontSize: '0.82rem', lineHeight: '1.5' }}>
                      <p>
                        <strong>第三条 健康资料披露 / Health Information Disclosure</strong><br />
                        甲方须如实披露长者健康状况，包括慢性疾病、过敏记录、服药情况及其他相关资料。若因隐瞒或错误资料导致损失，乙方无需承担责任。<br />
                        The Client shall fully disclose all relevant health information. The Caregiver shall not be liable for incidents resulting from incomplete or inaccurate disclosure.
                      </p>
                      <p>
                        <strong>第四条 医疗紧急情况 / Medical Emergencies</strong><br />
                        发生紧急情况时，乙方有权联络家属、呼叫救护车或安排送院。相关医疗费用由甲方承担。<br />
                        In emergencies, the Caregiver may contact family members, call emergency services, or arrange hospital admission. Medical expenses shall be borne by the Client.
                      </p>
                      <p>
                        <strong>第五条 风险告知及免责 / Risk Acknowledgement and Limitation of Liability</strong><br />
                        甲方理解长者可能因年龄、身体状况或既有疾病而发生跌倒、受伤、住院或死亡等风险。除故意行为或重大疏忽外，乙方不承担赔偿责任。<br />
                        The Client acknowledges the inherent risks associated with aging and pre-existing conditions. Except for intentional misconduct or gross negligence, the Caregiver shall not be liable.
                      </p>
                      <p>
                        <strong>第六条 药物管理 / Medication Management</strong><br />
                        乙方仅负责提醒服药，不负责药物处方、剂量决定或医疗判断。<br />
                        The Caregiver only provides medication reminders and is not responsible for prescriptions, dosage decisions, or medical judgments.
                      </p>
                      <p>
                        <strong>第七条 财物责任 / Personal Property</strong><br />
                        甲方应妥善保管现金及贵重物品。除有明确证据证明乙方故意行为外，乙方无需承担财物损失责任。<br />
                        The Client shall safeguard valuables. The Caregiver shall not be liable unless intentional misconduct is proven.
                      </p>
                      <p>
                        <strong>第八条 平台声明 / Platform Disclaimer</strong><br />
                        本服务由乙方以独立服务提供者身份提供。公会/协会仅提供会员管理、培训及服务配对平台，并非服务提供者、雇主、医疗机构或护理机构，因此不承担相关法律责任。<br />
                        The service is provided by the Caregiver as an independent service provider. The Association/Union only provides a platform and shall not be liable for service-related claims or disputes.
                      </p>
                      <p>
                        <strong>第九条 服务终止 / Termination</strong><br />
                        如发生暴力、骚扰、拖欠费用或严重违约，乙方有权终止服务。<br />
                        The Caregiver may terminate the service in cases of violence, harassment, non-payment, or material breach.
                      </p>
                      <p>
                        <strong>第十条 适用法律 / Governing Law</strong><br />
                        本协议受马来西亚法律管辖。<br />
                        This Agreement shall be governed by the laws of Malaysia.
                      </p>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.5rem', fontSize: '0.88rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>甲方（客户/家属）Client Signature</span>
                        {currentViewElderlyContract.clientSignature ? (
                          <>
                            <div style={{ fontSize: '1.3rem', fontFamily: 'Outfit, sans-serif', fontStyle: 'italic', fontWeight: 'bold', color: 'var(--accent)', margin: '0.75rem 0' }}>
                              ✍️ {currentViewElderlyContract.clientSignature}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed Date / 签署日期: {currentViewElderlyContract.signedDate}</span>
                          </>
                        ) : (
                          <div style={{ margin: '1rem 0', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            ✍️ Pending Signature / 待家属签署
                          </div>
                        )}
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>乙方（照护人员）Caregiver Signature</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#60a5fa', margin: '0.85rem 0' }}>
                          🛡️ {currentViewElderlyContract.caregiverSignature}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vetted Union Caregiver / 工会认证照护员</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                  <button 
                    onClick={() => {
                      window.print();
                    }}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    🖨️ Print Agreement / 打印或存为 PDF
                  </button>
                  {currentViewElderlyContract.status !== 'Signed' && (
                    <button
                      onClick={() => {
                        const link = window.location.origin + '/sign-agreement?type=elderly&contractId=' + currentViewElderlyContract.id;
                        navigator.clipboard.writeText(link);
                        alert('Signing Link copied to clipboard:\n' + link);
                      }}
                      className="btn btn-outline"
                    >
                      📋 Copy Client Sign Link / 复制签署链接
                    </button>
                  )}
                </div>
              </div>
            )}

            {elderlyFormMode === 'create' && (
              <div>
                <button 
                  onClick={() => setElderlyFormMode('list')}
                  className="btn btn-outline"
                  style={{ marginBottom: '1.5rem', padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  ← Back to List / 返回列表
                </button>

                <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
                  <h3 style={{ color: '#ffffff', marginBottom: '1.5rem', textAlign: 'center' }}>
                    {isRehab ? '📋 Generate Rehabilitation Care Service Agreement / 创建康复照护服务协议' : '📋 Generate Elderly Care Service Agreement / 创建老人照护服务协议'}
                  </h3>
                  <form onSubmit={submitElderlyContract}>
                    
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>
                        1. Caregiver Information / 照护人员（已预填，工会已核验）
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Caregiver Name / 照护人员姓名</label>
                          <input type="text" readOnly className="form-input" style={{ opacity: 0.7 }} value={member ? member.name : 'Li Xiulan'} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Membership Number / 会员编号</label>
                          <input type="text" readOnly className="form-input" style={{ opacity: 0.7 }} value={member ? member.member_number : 'MCSA-2026-0009'} />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>
                        2. Service Details & Schedule / 服务期限与时间
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Service Date Range / 服务日期范围 *</label>
                          <input type="text" required className="form-input" placeholder="e.g. 2026-06-15 to 2026-07-15" value={elderlyServiceDate} onChange={(e) => setElderlyServiceDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Service Hours / 工作时段 *</label>
                          <input type="text" required className="form-input" placeholder="e.g. 9:00 AM - 5:00 PM or 24 Hours" value={elderlyServiceHours} onChange={(e) => setElderlyServiceHours(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>
                        3. Pricing & Payments / 服务费用与订金 (RM)
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Total Fee / 服务费用 (RM) *</label>
                          <input type="number" required className="form-input" value={elderlyServiceFee} onChange={(e) => {
                            setElderlyServiceFee(e.target.value);
                            const bal = Number(e.target.value) - Number(elderlyDeposit);
                            setElderlyBalance(String(bal >= 0 ? bal : 0));
                          }} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Deposit / 订金金额 (RM) *</label>
                          <input type="number" required className="form-input" value={elderlyDeposit} onChange={(e) => {
                            setElderlyDeposit(e.target.value);
                            const bal = Number(elderlyServiceFee) - Number(e.target.value);
                            setElderlyBalance(String(bal >= 0 ? bal : 0));
                          }} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Balance / 尾款金额 (RM)</label>
                          <input type="number" readOnly className="form-input" style={{ opacity: 0.7 }} value={elderlyBalance} />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>
                        4. Receiving Bank Account / 收款银行信息
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Bank Name / 开户银行 *</label>
                          <select className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }} value={elderlyBankName} onChange={(e) => setElderlyBankName(e.target.value)}>
                            <option value="CIMB Bank">CIMB Bank</option>
                            <option value="Maybank">Maybank</option>
                            <option value="Public Bank">Public Bank</option>
                            <option value="RHB Bank">RHB Bank</option>
                            <option value="Hong Leong Bank">Hong Leong Bank</option>
                            <option value="AmBank">AmBank</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Account Holder Name / 账户名称 *</label>
                          <input type="text" required className="form-input" placeholder="Account Name" value={elderlyAccountName} onChange={(e) => setElderlyAccountName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Account Number / 银行卡号 *</label>
                          <input type="text" required className="form-input" placeholder="Account Number" value={elderlyAccountNumber} onChange={(e) => setElderlyAccountNumber(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">DuitNow ID (Optional / 选填)</label>
                          <input type="text" className="form-input" placeholder="e.g. Phone or NRIC for DuitNow" value={elderlyDuitNow} onChange={(e) => setElderlyDuitNow(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', background: 'var(--primary)', boxShadow: '0 2px 8px var(--primary-glow)' }}>
                      ⚡ Generate Service Agreement / 确认并生成协议
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Appointment Booking Modal */}
        {showAddApptModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(11, 19, 41, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}>
            <div className="card animate-fade-in" style={{
              width: '100%',
              maxWidth: '500px',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#0f172a',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#ffffff', fontWeight: 700 }}>
                  📅 {lang === 'zh' ? '录入新安排预约' : lang === 'bm' ? 'Atur Temujanji Baru' : 'Book New Care Appointment'}
                </h3>
                <button 
                  onClick={() => setShowAddApptModal(false)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.25rem' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={submitCustomAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{lang === 'zh' ? '客户端客户姓名' : lang === 'bm' ? 'Nama Pelanggan' : 'Client / Patient Name'}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. Grandma Lim"
                    value={newApptClient}
                    onChange={(e) => setNewApptClient(e.target.value)}
                    style={{ background: 'var(--bg-input)', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">{lang === 'zh' ? '预定日期' : lang === 'bm' ? 'Tarikh Temujanji' : 'Appointment Date'}</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      required 
                      value={selectedDateStr}
                      onChange={(e) => setSelectedDateStr(e.target.value)}
                      style={{ background: 'var(--bg-input)', color: '#fff' }}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">{lang === 'zh' ? '具体时间' : lang === 'bm' ? 'Waktu Temujanji' : 'Appointment Time'}</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      placeholder="e.g. 10:30 AM"
                      value={newApptTime}
                      onChange={(e) => setNewApptTime(e.target.value)}
                      style={{ background: 'var(--bg-input)', color: '#fff' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{lang === 'zh' ? '医院 / 服务地点' : lang === 'bm' ? 'Lokasi Hospital / Tempat' : 'Hospital / Service Location'}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. Hospital Kuala Lumpur (HKL)"
                    value={newApptLocation}
                    onChange={(e) => setNewApptLocation(e.target.value)}
                    style={{ background: 'var(--bg-input)', color: '#fff' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{lang === 'zh' ? '就诊详情 / 照护指示' : lang === 'bm' ? 'Butiran Temujanji' : 'Checkup Details / Care Guidelines'}</label>
                  <textarea 
                    className="form-input" 
                    placeholder="e.g. Routine blood sugar checkup and prescription pick up."
                    value={newApptDetails}
                    onChange={(e) => setNewApptDetails(e.target.value)}
                    rows={3}
                    style={{ background: 'var(--bg-input)', color: '#fff', resize: 'vertical' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{lang === 'zh' ? '预约初始状态' : lang === 'bm' ? 'Status Temujanji' : 'Initial Status'}</label>
                  <select
                    className="form-input"
                    value={newApptStatus}
                    onChange={(e) => setNewApptStatus(e.target.value)}
                    style={{ background: 'var(--bg-input)', color: '#fff', cursor: 'pointer' }}
                  >
                    <option value="Scheduled">{lang === 'zh' ? '已安排 (Scheduled)' : lang === 'bm' ? 'Dijadual' : 'Scheduled'}</option>
                    <option value="In Progress">{lang === 'zh' ? '进行中 (In Progress)' : lang === 'bm' ? 'Aktif' : 'In Progress'}</option>
                    <option value="Completed">{lang === 'zh' ? '已完成 (Completed)' : lang === 'bm' ? 'Selesai' : 'Completed'}</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowAddApptModal(false)}
                    className="btn btn-outline" 
                    style={{ flex: 1, borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  >
                    {lang === 'zh' ? '取消' : lang === 'bm' ? 'Batal' : 'Cancel'}
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flex: 1, background: 'var(--primary)', border: 'none', color: '#fff', fontWeight: 600 }}
                  >
                    {lang === 'zh' ? '确认添加预约' : lang === 'bm' ? 'Atur Sekarang' : 'Confirm Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {showReceiptModal && receiptAppt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(11, 19, 41, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '2rem',
          overflowY: 'auto'
        }} className="no-print-bg">
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            width: '100%',
            maxWidth: '680px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }} className="receipt-modal-container">
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 2rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }} className="no-print">
              <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontWeight: 800 }}>
                {lang === 'zh' ? '自雇人士报税收据生成器' : lang === 'bm' ? 'Penjana Resit Cukai Swakerja' : 'Self-Employed Tax Receipt Generator'}
              </h3>
              <button
                onClick={() => setShowReceiptModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Receipt Parameters Form */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }} className="no-print">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>
                    {lang === 'zh' ? '实收金额 (RM)' : lang === 'bm' ? 'Jumlah Bayaran (RM)' : 'Billed Service Fee (RM)'}
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={receiptFee}
                    onChange={(e) => setReceiptFee(e.target.value)}
                    style={{ background: '#0f172a', width: '100%' }}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>
                    {lang === 'zh' ? '看护身份证号码 / NRIC' : lang === 'bm' ? 'No. KP Pengasuh' : 'Caregiver NRIC / ID'}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={providerNric}
                    onChange={(e) => setProviderNric(e.target.value)}
                    style={{ background: '#0f172a', width: '100%' }}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>
                    {lang === 'zh' ? '客户身份证号码 / NRIC' : lang === 'bm' ? 'No. KP Pelanggan' : 'Client NRIC / ID'}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 800101-14-5566"
                    value={clientNric}
                    onChange={(e) => setClientNric(e.target.value)}
                    style={{ background: '#0f172a', width: '100%' }}
                  />
                </div>
              </div>

              {/* Physical Receipt Template layout for PDF/Print */}
              <div id="printable-receipt" style={{
                backgroundColor: '#ffffff',
                color: '#1e293b',
                padding: '2.5rem',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                lineHeight: 1.5
              }}>
                {/* Logo & Header */}
                <div style={{ display: 'flex', justifyView: 'space-between', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a8a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      MultiCare Support Union (MCSA)
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                      Official self-employed care practitioner receipt
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>RECEIPT / 收据</div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>
                      No: REC-{receiptAppt.id.toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
                  {/* Left Column: Caregiver (Issuer) info */}
                  <div>
                    <div style={{ textTransform: 'uppercase', fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>
                      Issued By (Care Provider / 开具人)
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                      {member ? member.name : 'Li Xiulan'}
                    </div>
                    <div style={{ color: '#475569' }}>
                      <strong>Union Serial:</strong> {member ? member.member_number : 'MCSA-2026-0009'}<br />
                      <strong>Accreditation:</strong> {member ? member.category : 'Elderly Caregiver'}<br />
                      <strong>Provider NRIC:</strong> {providerNric}
                    </div>
                  </div>

                  {/* Right Column: Client info */}
                  <div>
                    <div style={{ textTransform: 'uppercase', fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>
                      Billed To (Recipient / 付款客户)
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                      {receiptAppt.clientName}
                    </div>
                    <div style={{ color: '#475569' }}>
                      <strong>Client NRIC:</strong> {clientNric || 'N/A'}<br />
                      <strong>Service Location:</strong> {receiptAppt.location}<br />
                      <strong>Billing Date:</strong> {receiptAppt.date || '2026-06-06'}
                    </div>
                  </div>
                </div>

                {/* Services Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem 0', color: '#475569' }}>Description of Care Services</th>
                      <th style={{ padding: '0.5rem 0', textAlign: 'right', color: '#475569' }}>Amount (RM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.75rem 0', color: '#0f172a' }}>
                        Professional {member ? member.category : 'Elderly Caregiver'} Services
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
                          Performed on date: {receiptAppt.date} &bull; Time: {receiptAppt.time}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        RM {receiptFee}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.75rem 0', fontWeight: 800, color: '#1e3a8a' }}>TOTAL PAID (Paid in Full)</td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 800, color: '#1e3a8a', fontSize: '1.05rem' }}>
                        RM {receiptFee}.00
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Stamp & Tax relief statement */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  color: '#475569',
                  lineHeight: 1.4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    border: '3px double #10b981',
                    color: '#10b981',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.5rem',
                    transform: 'rotate(-10deg)',
                    flexShrink: 0,
                    backgroundColor: 'white'
                  }}>
                    <span>MCSA</span>
                    <span>VERIFIED</span>
                    <span style={{ fontSize: '0.35rem' }}>TAX RELIEF</span>
                  </div>
                  <div>
                    <strong>Malaysia LHDN Tax Relief Eligibility / 所得税报税退税凭证说明:</strong><br />
                    Under Section 46 of Income Tax Act 1967, medical companion/escort and elderly care expenses for parents are eligible for tax relief up to <strong>RM 8,000</strong>. Child care/babysitter fees paid to registered operators are tax-deductible up to <strong>RM 3,000</strong>. Keep this receipt with MCSA caregiver registration serial for tax auditing purposes.<br />
                    <span style={{ color: '#047857', fontWeight: 600 }}>依据马来西亚所得税法，本收据由 MCSA 认证合格之自雇护理师开具，可作为个人所得税申报父母医疗/子女育儿抚养退税之正式合法凭证。</span>
                  </div>
                </div>

                {/* Signatures */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                  <div>
                    <div style={{ borderBottom: '1px solid #94a3b8', width: '150px', marginBottom: '0.25rem' }}></div>
                    Authorized Union Seal & Signature
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ borderBottom: '1px solid #94a3b8', width: '150px', marginBottom: '0.25rem' }}></div>
                    Caregiver Member Signature
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.25rem 2rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }} className="no-print">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="btn btn-outline"
                style={{ fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}
              >
                {lang === 'zh' ? '关闭' : lang === 'bm' ? 'Tutup' : 'Close'}
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="btn btn-primary"
                style={{ fontSize: '0.9rem', padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                🖨️ {lang === 'zh' ? '打印收据 / 保存PDF' : lang === 'bm' ? 'Cetak & Simpan PDF' : 'Print & Save PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Adjustment Modal */}
      {showAdjustModal && selectedApptToAdjust && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 19, 41, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '2rem'
        }}>
          <div className="card animate-fade-in" style={{ maxWidth: '480px', width: '100%', padding: '2rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.25rem', fontFamily: 'Outfit' }}>
                📅 {lang === 'zh' ? '调整服务排班日程' : lang === 'bm' ? 'Ubah Tarikh Syif' : 'Adjust Service Schedule'}
              </h3>
              <button 
                onClick={() => { setShowAdjustModal(false); setSelectedApptToAdjust(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustedSchedule}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                {lang === 'zh' 
                  ? `正在调整与客户 ${selectedApptToAdjust.clientName} 的约定服务排班。如果由于宝宝出生较晚/早于预期而需要调整日程，您可以在此人为设置实际的开始日期。`
                  : `Adjusting service schedule with ${selectedApptToAdjust.clientName}. You can manually adjust the date and details to align with the actual baby delivery date.`}
              </p>

              <div className="form-group">
                <label className="form-label">{lang === 'zh' ? '服务日期 (Date)' : 'Service Date'}</label>
                <input 
                  type="date" 
                  required 
                  className="form-input" 
                  value={adjustDate} 
                  onChange={(e) => setAdjustDate(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{lang === 'zh' ? '服务时间 (Time)' : 'Service Time'}</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. 09:00 AM, 24 Hours, Day Shift"
                  value={adjustTime} 
                  onChange={(e) => setAdjustTime(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{lang === 'zh' ? '备注说明 (Details/Expected Due Date Notes)' : 'Details / Notes'}</label>
                <textarea 
                  rows={3} 
                  className="form-input" 
                  style={{ resize: 'none' }}
                  placeholder="e.g. Adjusted to actual birth date, or expected due date note updates."
                  value={adjustDetails} 
                  onChange={(e) => setAdjustDetails(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => { setShowAdjustModal(false); setSelectedApptToAdjust(null); }}
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 1.25rem', borderRadius: '8px' }}
                >
                  {lang === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', background: selectedApptToAdjust.role === 'maternity' ? '#ec4899' : 'var(--primary)' }}
                >
                  💾 {lang === 'zh' ? '保存更改' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Membership Renewal Modal */}
      {showRenewalModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 19, 41, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '2rem',
          overflowY: 'auto'
        }}>
          <div className="card animate-fade-in" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '2.5rem',
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.35rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CreditCard size={22} style={{ color: 'var(--primary)' }} />
                {lang === 'zh' ? '公会年度会员费续期' : lang === 'bm' ? 'Pembaharuan Keahlian Tahunan' : 'Annual Membership Fee Renewal'}
              </h3>
              <button 
                onClick={() => { if (!isRenewing) setShowRenewalModal(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRenewMembership}>
              {/* Caregiver Profile Summary */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={member?.photo} alt={member?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 'bold' }}>{member?.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {lang === 'zh' ? `会员卡号：${member?.member_number}` : `Member No: ${member?.member_number}`} &bull; 
                    <span style={{ color: 'var(--accent)', marginLeft: '0.25rem', fontWeight: 'bold' }}>
                      {lang === 'zh' ? `当前有效期至：${member?.expiry}` : `Expires: ${member?.expiry}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Renewal Plan Selection */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">{lang === 'zh' ? '选择续费方案' : lang === 'bm' ? 'Pilih Pelan Pembaharuan' : 'Select Renewal Duration'}</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.4rem' }}>
                  {[
                    { years: 1, price: 360, labelEn: '1 Year Plan (Standard)', labelZh: '1 年期方案 (标准)', labelBm: 'Plan 1 Tahun (Standard)' },
                    { years: 2, price: 700, labelEn: '2 Years Plan (Save RM 20)', labelZh: '2 年期方案 (省 RM 20)', labelBm: 'Plan 2 Tahun (Jimat RM 20)' },
                    { years: 3, price: 1000, labelEn: '3 Years Plan (Save RM 80)', labelZh: '3 年期方案 (省 RM 80)', labelBm: 'Plan 3 Tahun (Jimat RM 80)' }
                  ].map((plan) => (
                    <label 
                      key={plan.years}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1.25rem',
                        borderRadius: '12px',
                        background: renewalYears === plan.years ? 'rgba(37, 99, 235, 0.08)' : 'rgba(255,255,255,0.02)',
                        border: renewalYears === plan.years ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <input 
                          type="radio" 
                          name="renewalYears" 
                          checked={renewalYears === plan.years}
                          onChange={() => setRenewalYears(plan.years)}
                          style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: renewalYears === plan.years ? 'bold' : 'normal' }}>
                          {lang === 'zh' ? plan.labelZh : lang === 'bm' ? plan.labelBm : plan.labelEn}
                        </span>
                      </div>
                      <span style={{ fontSize: '1rem', color: 'var(--accent)', fontWeight: 800 }}>RM {plan.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">{lang === 'zh' ? '选择支付方式' : lang === 'bm' ? 'Pilih Kaedah Pembayaran' : 'Select Payment Method'}</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.4rem' }}>
                  {[
                    { id: 'banking', labelEn: 'FPX Banking', labelZh: '网银转账', labelBm: 'FPX Perbankan' },
                    { id: 'card', labelEn: 'Credit Card', labelZh: '信用卡', labelBm: 'Kad Kredit' },
                    { id: 'wallet', labelEn: 'Grab / TNG', labelZh: '电子钱包', labelBm: 'Dompet Digital' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => { setRenewalMethod(method.id); setPaymentAccount(''); }}
                      style={{
                        padding: '0.65rem 0.5rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        background: renewalMethod === method.id ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                        color: renewalMethod === method.id ? '#ffffff' : 'var(--text-muted)',
                        boxShadow: renewalMethod === method.id ? '0 4px 10px rgba(37,99,235,0.2)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      {lang === 'zh' ? method.labelZh : lang === 'bm' ? method.labelBm : method.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Payment Inputs */}
              {renewalMethod === 'banking' && (
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">{lang === 'zh' ? '选择您的银行 (FPX)' : 'Select Your Bank'}</label>
                  <select 
                    className="form-input" 
                    required
                    style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }}
                    value={paymentAccount}
                    onChange={(e) => setPaymentAccount(e.target.value)}
                  >
                    <option value="" style={{ color: 'black' }}>-- {lang === 'zh' ? '选择银行' : 'Select Bank'} --</option>
                    <option value="maybank" style={{ color: 'black' }}>Maybank2u</option>
                    <option value="cimb" style={{ color: 'black' }}>CIMB Clicks</option>
                    <option value="public" style={{ color: 'black' }}>Public Bank</option>
                    <option value="rhb" style={{ color: 'black' }}>RHB Now</option>
                    <option value="hongleong" style={{ color: 'black' }}>Hong Leong Connect</option>
                  </select>
                </div>
              )}

              {renewalMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">{lang === 'zh' ? '卡号 (Card Number)' : 'Card Number'}</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input"
                      placeholder="XXXX XXXX XXXX XXXX" 
                      value={paymentAccount}
                      onChange={(e) => setPaymentAccount(e.target.value)}
                      maxLength={19}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">{lang === 'zh' ? '有效期 (Expiry)' : 'Expiry Date'}</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input"
                        placeholder="MM/YY" 
                        value={paymentExpiry}
                        onChange={(e) => setPaymentExpiry(e.target.value)}
                        maxLength={5}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">CVV</label>
                      <input 
                        type="password" 
                        required 
                        className="form-input"
                        placeholder="***" 
                        value={paymentCVV}
                        onChange={(e) => setPaymentCVV(e.target.value)}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {renewalMethod === 'wallet' && (
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">{lang === 'zh' ? '手机号码 / 电子钱包 ID' : 'Mobile Number / Wallet ID'}</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    placeholder="e.g. 012-3456789" 
                    value={paymentAccount}
                    onChange={(e) => setPaymentAccount(e.target.value)}
                  />
                </div>
              )}

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowRenewalModal(false)}
                  disabled={isRenewing}
                  className="btn btn-outline" 
                  style={{ flex: 1, borderColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.65rem' }}
                >
                  {lang === 'zh' ? '取消' : lang === 'bm' ? 'Batal' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  disabled={isRenewing || (renewalMethod === 'banking' && !paymentAccount) || (renewalMethod === 'card' && (!paymentAccount || !paymentExpiry || !paymentCVV)) || (renewalMethod === 'wallet' && !paymentAccount)}
                  className="btn btn-primary" 
                  style={{ 
                    flex: 1, 
                    background: 'var(--primary)', 
                    border: 'none', 
                    color: '#fff', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem'
                  }}
                >
                  {isRenewing ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#ffffff',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }}></div>
                      {lang === 'zh' ? '正在处理支付...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      {lang === 'zh' ? '确认支付续费' : lang === 'bm' ? 'Bayar Sekarang' : 'Confirm Payment'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt, #printable-receipt *,
          #printable-contract, #printable-contract * {
            visibility: visible;
          }
          #printable-receipt,
          #printable-contract {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print-bg {
            background: none !important;
            backdrop-filter: none !important;
            padding: 0 !important;
          }
          .receipt-modal-container {
            background: none !important;
            border: none !important;
            box-shadow: none !important;
            max-height: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <Lightbox
        isOpen={showLightbox}
        photos={lightboxPhotos}
        currentIndex={lightboxIndex}
        onClose={() => setShowLightbox(false)}
        onChangeIndex={setLightboxIndex}
      />

      </main>
    </div>
  );
}
