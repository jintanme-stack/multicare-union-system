'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Users, Briefcase, DollarSign, BookOpen, MessageSquare, Check, X, Award, FileText, Send, CheckCircle2, AlertCircle, Megaphone, User } from 'lucide-react';
import { store } from '@/lib/store';

const compressImage = (base64Str: string, maxWidth = 1200, maxHeight = 1200, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'unionMembers' | 'cases' | 'inquiries' | 'library' | 'announcements' | 'escortForms' | 'blog' | 'timebank'>('overview');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [docTab, setDocTab] = useState<'cert' | 'health' | 'icDoc'>('cert');
  const [escortForms, setEscortForms] = useState<any[]>([]);
  const [selectedEscortForm, setSelectedEscortForm] = useState<any>(null);
  const [selectedUnionCard, setSelectedUnionCard] = useState<any>(null);
  const [selectedMockIC, setSelectedMockIC] = useState<any>(null);
  const [timebankSubTab, setTimebankSubTab] = useState<'volunteers' | 'claims' | 'redemptions' | 'catalog'>('volunteers');
  
  // Vetting Registry States connected to Store
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [unionMembers, setUnionMembers] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [libItems, setLibItems] = useState<any[]>([]);
  const [careRequests, setCareRequests] = useState<any[]>([]);

  // Time Bank States
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [timebankServices, setTimebankServices] = useState<any[]>([]);
  const [timebankRedemptions, setTimebankRedemptions] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);

  // Reward Catalog Form States
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [editRewardId, setEditRewardId] = useState<string | null>(null);
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardCost, setRewardCost] = useState<number>(10);
  const [rewardCategory, setRewardCategory] = useState('Course');
  const [rewardPartner, setRewardPartner] = useState('');
  const [rewardDesc, setRewardDesc] = useState('');

  // Blog & Stories States
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Caregiver Stories');
  const [blogAuthor, setBlogAuthor] = useState('MCSA Editorial');
  const [blogCoverImage, setBlogCoverImage] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');
  const [blogContent, setBlogContent] = useState('');
  const [editBlogId, setEditBlogId] = useState<string | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);

  const [newLibTitle, setNewLibTitle] = useState('');
  const [newLibType, setNewLibType] = useState('Image Map');
  const [newLibState, setNewLibState] = useState('Kuala Lumpur');
  const [newLibImage, setNewLibImage] = useState('');
  const [newLibFileName, setNewLibFileName] = useState('');
  const [newLibFileSize, setNewLibFileSize] = useState('');
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [selectedMatchRequestId, setSelectedMatchRequestId] = useState<string>('');
  const [showMatchResults, setShowMatchResults] = useState<boolean>(false);
  const [stateFilter, setStateFilter] = useState('');
  const [adminRole, setAdminRole] = useState<'master' | 'standard'>('master');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [currentStaffPassword, setCurrentStaffPassword] = useState('CARE8268');
  const [lang, setLang] = useState<string>('en');

  // Footer Config States
  const [footerAddress, setFooterAddress] = useState('KL Sentral Business Suites, Kuala Lumpur');
  const [footerPhone, setFooterPhone] = useState('+60 3-2274 9988');
  const [footerEmail, setFooterEmail] = useState('registry@mcsa.com.my');
  const [footerDesc, setFooterDesc] = useState('Accrediting and dispatching certified healthcare companions, confinement caregivers, and elder escorts across Malaysia.');

  // Announcements & Activity Photos States
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('Training');
  const [annContent, setAnnContent] = useState('');

  const [activityPhotos, setActivityPhotos] = useState<any[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoTab, setPhotoTab] = useState<'upload' | 'url'>('upload');
  const [photoFileName, setPhotoFileName] = useState('');
  const [photoFileSize, setPhotoFileSize] = useState('');

  useEffect(() => {
    const initData = () => {
      setLang(store.getLanguage());
      setPendingMembers(store.getPendingMembers());
      setUnionMembers(store.getUnionMembers());
      setInquiries(store.getInquiries());
      setLibItems(store.getLibItems());
      setAnnouncements(store.getAnnouncements());
      setActivityPhotos(store.getActivityPhotos());
      setEscortForms(store.getEscortForms());
      setCareRequests(store.getCareRequests());
      setBlogPosts(store.getBlogPosts());
      setVolunteers(store.getVolunteers());
      setTimebankServices(store.getServiceRecords());
      setTimebankRedemptions(store.getRedemptionRecords());
      setRewards(store.getRewards());
      setCurrentStaffPassword(store.getStandardAdminPassword());

      const footerInfo = store.getFooterInfo();
      if (footerInfo) {
        setFooterAddress(footerInfo.address || 'KL Sentral Business Suites, Kuala Lumpur');
        setFooterPhone(footerInfo.phone || '+60 3-2274 9988');
        setFooterEmail(footerInfo.email || 'registry@mcsa.com.my');
        setFooterDesc(footerInfo.desc || 'Accrediting and dispatching certified healthcare companions, confinement caregivers, and elder escorts across Malaysia.');
      }
    };

    initData();

    // Pull fresh data from cloud in background and refresh UI states
    store.pullFromCloud().then(() => {
      initData();
    }).catch((e) => console.error("Admin pull error:", e));

    const loggedEmail = localStorage.getItem('mcsa_logged_admin_email');
    if (!loggedEmail) {
      window.location.href = '/admin-login';
      return;
    }
    if (loggedEmail.toLowerCase().includes('staff') || loggedEmail.toLowerCase().includes('standard')) {
      setAdminRole('standard');
      setActiveTab('members');
    } else {
      setAdminRole('master');
    }

    // Dynamic cross-tab storage sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'mcsa_pending') {
        setPendingMembers(store.getPendingMembers());
      }
      if (e.key === 'mcsa_union_members') {
        setUnionMembers(store.getUnionMembers());
      }
      if (e.key === 'mcsa_inquiries') {
        setInquiries(store.getInquiries());
      }
      if (e.key === 'mcsa_announcements') {
        setAnnouncements(store.getAnnouncements());
      }
      if (e.key === 'mcsa_activity_photos') {
        setActivityPhotos(store.getActivityPhotos());
      }
      if (e.key === 'mcsa_escort_forms') {
        setEscortForms(store.getEscortForms());
      }
      if (e.key === 'mcsa_care_requests') {
        setCareRequests(store.getCareRequests());
      }
      if (e.key === 'mcsa_blog_posts') {
        setBlogPosts(store.getBlogPosts());
      }
      if (e.key === 'mcsa_volunteers' || e.key === 'mcsa_timebank_volunteers') {
        setVolunteers(store.getVolunteers());
      }
      if (e.key === 'mcsa_service_records' || e.key === 'mcsa_timebank_service_records') {
        setTimebankServices(store.getServiceRecords());
      }
      if (e.key === 'mcsa_redemption_records' || e.key === 'mcsa_timebank_redemption_records') {
        setTimebankRedemptions(store.getRedemptionRecords());
      }
      if (e.key === 'mcsa_timebank_rewards') {
        setRewards(store.getRewards());
      }
      if (e.key === 'mcsa_footer_info') {
        const info = store.getFooterInfo();
        if (info) {
          setFooterAddress(info.address);
          setFooterPhone(info.phone);
          setFooterEmail(info.email);
          setFooterDesc(info.desc);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleUpdateStaffPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffPassword.trim()) return;
    store.setStandardAdminPassword(newStaffPassword);
    setCurrentStaffPassword(newStaffPassword);
    alert(`Standard Admin password successfully changed to: ${newStaffPassword}`);
    setNewStaffPassword('');
  };

  const handleUpdateFooterInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const info = {
      address: footerAddress,
      phone: footerPhone,
      email: footerEmail,
      desc: footerDesc
    };
    store.setFooterInfo(info);
    alert('Footer information successfully updated! All public/private headers & footers are synchronized in real-time.');
  };

  const handleResetDatabase = () => {
    const confirmMessage = lang === 'zh'
      ? '⚠️ 您确定要重置系统数据库吗？这将清除所有本地新注册的会员、激活的会员和所有申请数据，并恢复为系统初始默认状态。此操作无法撤销！'
      : lang === 'bm'
      ? '⚠️ Adakah anda pasti mahu menetapkan semula pangkalan data sistem? Ini akan memadamkan semua ahli baru, ahli aktif, dan data permohonan, serta menetapkan semula ke keadaan lalai asal. Tindakan ini tidak boleh diundurkan!'
      : '⚠️ Are you sure you want to reset the system database? This will clear all locally registered members, active members, and application data, and restore the system to its initial default state. This action cannot be undone!';

    if (confirm(confirmMessage)) {
      store.resetDatabase();
    }
  };

  const approveMember = async (id: string, name: string) => {
    const applicant = pendingMembers.find(m => m.id === id);
    if (!applicant) return;

    // Check if caregiver already exists in union registry by NRIC, phone or email
    const existingUnion = store.getUnionMembers();
    const existingMember = existingUnion.find((m: any) => 
      (applicant.nric && m.nric === applicant.nric) || 
      m.email.toLowerCase() === applicant.email.toLowerCase() || 
      m.phone === applicant.phone
    );

    let updatedUnion;
    let message = '';

    // Compress photo on approval if it exists as a base64 image
    let compressedPhoto = applicant.photo;
    if (compressedPhoto && compressedPhoto.startsWith('data:image')) {
      try {
        compressedPhoto = await compressImage(compressedPhoto, 250, 250, 0.75);
      } catch (imgErr) {
        console.error("Photo compression failed:", imgErr);
      }
    }

    if (existingMember) {
      // Split and merge categories individually to prevent duplication of comma-separated roles
      const existingCategories = (existingMember.category || '').split(',').map((c: string) => c.trim()).filter(Boolean);
      const newCategories = (applicant.category || '').split(',').map((c: string) => c.trim()).filter(Boolean);
      
      newCategories.forEach((cat: string) => {
        if (!existingCategories.includes(cat)) {
          existingCategories.push(cat);
        }
      });
      
      const mergedMember = {
        ...existingMember,
        category: existingCategories.join(', '),
        exp: applicant.exp || existingMember.exp,
        location: applicant.location || existingMember.location,
        bio: existingMember.bio + ' | ' + applicant.bio,
        photo: compressedPhoto || existingMember.photo
      };

      updatedUnion = existingUnion.map((m: any) => m.id === existingMember.id ? mergedMember : m);
      message = `Categories merged for ${name}! Added "${applicant.category}" to existing membership ID ${existingMember.member_number}.`;
    } else {
      // Create new member
      const newMemberNum = 'MCSA-2026-' + Math.floor(1000 + Math.random() * 9000);
      const newMember = {
        id: 'M-' + Math.floor(103 + Math.random() * 100),
        name: applicant.name,
        email: applicant.email,
        phone: applicant.phone,
        nric: applicant.nric || '',
        category: applicant.category,
        exp: applicant.exp,
        location: applicant.location || 'Kuala Lumpur',
        member_number: newMemberNum,
        expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        bio: applicant.bio,
        photo: compressedPhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&fit=crop',
        icDoc: applicant.icDoc || '',
        icDocData: applicant.icDocData || '',
        proof: applicant.proof || '',
        proofData: '', // Discard heavy vetting certificate to save local storage quota
        healthCert: applicant.healthCert || '',
        healthCertData: '' // Discard heavy health clearance certificate to save local storage quota
      };
      updatedUnion = [...existingUnion, newMember];
      message = `Accreditation approved for ${name}! Registered membership ID is ${newMemberNum}. Billed licensing fee.`;
    }

    const updatedPending = pendingMembers.filter(m => m.id !== id);
    
    try {
      store.setPendingMembers(updatedPending);
      store.setUnionMembers(updatedUnion);
      
      setPendingMembers(updatedPending);
      setUnionMembers(updatedUnion);
      setSelectedMember(null);
      alert(message);
    } catch (err) {
      console.error("Vetting approval database write failed:", err);
      alert(lang === 'zh'
        ? '⚠️ 批准操作保存失败！由于多次测试注册上传，您的浏览器本地存储 (LocalStorage) 已满。\n\n💡 请前往“Union Overview (公会概览)”选项卡，拉到最下方，点击危险区域的“重置公会测试数据库”按钮清理空间，然后重新测试。'
        : '⚠️ Vetting approval save failed! Your browser LocalStorage is full.\n\n💡 Please go to the "Union Overview" tab, scroll to the bottom, and click "Reset System Local Database" to clear space, then try again.');
    }
  };

  const rejectMember = (id: string, name: string) => {
    const updatedPending = pendingMembers.filter(m => m.id !== id);
    store.setPendingMembers(updatedPending);
    setPendingMembers(updatedPending);
    setSelectedMember(null);
    alert(`Rejected registration for ${name}. Notification sent.`);
  };

  const approveVolunteer = (id: string, name: string) => {
    const updatedVols = volunteers.map((v: any) => 
      v.id === id ? { ...v, status: 'Approved' } : v
    );
    try {
      store.setVolunteers(updatedVols);
      setVolunteers(updatedVols);
      alert(`Volunteer application approved for ${name}!`);
    } catch (err) {
      alert('LocalStorage quota exceeded while saving volunteer approval.');
    }
  };

  const rejectVolunteer = (id: string, name: string) => {
    const updatedVols = volunteers.map((v: any) => 
      v.id === id ? { ...v, status: 'Rejected' } : v
    );
    try {
      store.setVolunteers(updatedVols);
      setVolunteers(updatedVols);
      alert(`Volunteer application declined for ${name}.`);
    } catch (err) {
      alert('LocalStorage quota exceeded.');
    }
  };

  const approveServiceClaim = (claimId: string, email: string, hours: number, activity: string) => {
    const updatedClaims = timebankServices.map((c: any) => 
      c.id === claimId ? { ...c, status: 'Approved', approvedBy: 'MCSA Admin' } : c
    );
    
    // Find volunteer and award credits
    const updatedVols = volunteers.map((v: any) => {
      if (v.email.toLowerCase().trim() === email.toLowerCase().trim()) {
        const newCredits = (v.credits || 0) + hours;
        let rank = v.rank || 'Bronze Companion';
        const badges = [...(v.badges || [])];
        if (newCredits >= 20 && !badges.includes('Community Pillar')) {
          badges.push('Community Pillar');
          rank = 'Gold Caregiver';
        } else if (newCredits >= 10 && !badges.includes('Active Mind')) {
          badges.push('Active Mind');
          rank = 'Silver Companion';
        }
        return {
          ...v,
          credits: newCredits,
          rank,
          badges
        };
      }
      return v;
    });

    // Create audit log
    const newAudit = {
      id: 'AUDIT-' + Date.now(),
      volunteerEmail: email,
      type: 'Earn',
      amount: hours,
      desc: `Approved claim for "${activity}"`,
      date: new Date().toISOString()
    };
    
    const allAudits = store.getAuditLogs();
    const updatedAudits = [newAudit, ...allAudits];

    try {
      store.setServiceRecords(updatedClaims);
      store.setVolunteers(updatedVols);
      store.setAuditLogs(updatedAudits);
      
      setTimebankServices(updatedClaims);
      setVolunteers(updatedVols);
      alert(`Approved ${hours} hours for ${email}! Credits have been awarded.`);
    } catch (err) {
      alert('LocalStorage quota exceeded while approving claim.');
    }
  };

  const rejectServiceClaim = (claimId: string, email: string) => {
    const updatedClaims = timebankServices.map((c: any) => 
      c.id === claimId ? { ...c, status: 'Rejected', approvedBy: 'MCSA Admin' } : c
    );
    try {
      store.setServiceRecords(updatedClaims);
      setTimebankServices(updatedClaims);
      alert(`Rejected service claim for ${email}.`);
    } catch (err) {
      alert('LocalStorage quota exceeded.');
    }
  };

  const completeRedemption = (redemptionId: string) => {
    const updatedRedemptions = timebankRedemptions.map((r: any) => 
      r.id === redemptionId ? { ...r, status: 'Completed/Delivered' } : r
    );
    try {
      store.setRedemptionRecords(updatedRedemptions);
      setTimebankRedemptions(updatedRedemptions);
      alert('Redemption item marked as Completed & Delivered.');
    } catch (err) {
      alert('LocalStorage quota exceeded.');
    }
  };

  const handleSaveReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardTitle || !rewardPartner) {
      alert('Please fill out all required fields.');
      return;
    }

    let updatedRewards;
    if (editRewardId) {
      // Edit existing reward
      updatedRewards = rewards.map((r: any) =>
        r.id === editRewardId
          ? {
              ...r,
              title: rewardTitle,
              cost: Number(rewardCost),
              category: rewardCategory,
              partner: rewardPartner,
              desc: rewardDesc
            }
          : r
      );
      alert(`Successfully updated reward: ${rewardTitle}`);
    } else {
      // Add new reward
      const newReward = {
        id: `REWARD-${Date.now()}`,
        title: rewardTitle,
        cost: Number(rewardCost),
        category: rewardCategory,
        partner: rewardPartner,
        desc: rewardDesc
      };
      updatedRewards = [...rewards, newReward];
      alert(`Successfully added new reward: ${rewardTitle}`);
    }

    try {
      store.setRewards(updatedRewards);
      setRewards(updatedRewards);
      // Reset form
      setRewardTitle('');
      setRewardCost(10);
      setRewardCategory('Course');
      setRewardPartner('');
      setRewardDesc('');
      setEditRewardId(null);
      setShowRewardForm(false);
    } catch (err) {
      alert('LocalStorage quota exceeded while saving reward catalog.');
    }
  };

  const handleEditReward = (reward: any) => {
    setEditRewardId(reward.id);
    setRewardTitle(reward.title);
    setRewardCost(reward.cost);
    setRewardCategory(reward.category);
    setRewardPartner(reward.partner);
    setRewardDesc(reward.desc || '');
    setShowRewardForm(true);
  };

  const handleDeleteReward = (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from the catalog?`)) {
      return;
    }
    const updatedRewards = rewards.filter((r: any) => r.id !== id);
    try {
      store.setRewards(updatedRewards);
      setRewards(updatedRewards);
      alert(`Successfully deleted reward: ${title}`);
    } catch (err) {
      alert('LocalStorage quota exceeded.');
    }
  };

  const getValidityRange = (m: any) => {
    if (!m.expiry) return '1 Year Validity';
    const expDate = new Date(m.expiry);
    const startDate = new Date(expDate);
    startDate.setFullYear(startDate.getFullYear() - 1);
    const startStr = startDate.toISOString().split('T')[0];
    return `${startStr} ~ ${m.expiry}`;
  };

  const exportToCSV = (filteredMembers: any[]) => {
    const headers = [
      'Name (姓名)',
      'Membership ID (会员编号)',
      'NRIC (身份证号)',
      'Category/Roles (资质类别)',
      'Experience (经验)',
      'Primary Location (主要区域)',
      'Phone (联系电话)',
      'Email (电子邮箱)',
      'Membership Validity (会员期)',
      'Bio (简介)'
    ];

    const formatValue = (val: any) => {
      if (val === null || val === undefined) return '';
      const stringified = String(val).replace(/"/g, '""');
      return `"${stringified}"`;
    };

    const rows = filteredMembers.map(m => {
      return [
        m.name,
        m.member_number,
        m.nric || 'N/A',
        m.category,
        m.exp,
        m.location,
        m.phone,
        m.email,
        getValidityRange(m),
        m.bio || ''
      ].map(formatValue).join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MCSA_Union_Members_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAssignCaregiver = (req: any, member: any) => {
    // 1. Create a calendar appointment for the caregiver
    const calendarAppointments = JSON.parse(localStorage.getItem('mcsa_calendar_appointments') || '[]');
    
    // Map member category to caregiver role key
    const categoryLower = (member.category || '').toLowerCase();
    let role = 'elderly';
    if (categoryLower.includes('confinement') || categoryLower.includes('maternity')) role = 'maternity';
    else if (categoryLower.includes('companion') || categoryLower.includes('escort')) role = 'escort';
    else if (categoryLower.includes('babysitter')) role = 'babysitter';

    // Parse location from message if req.location is undefined
    let resolvedLocation = req.location || '';
    if (!resolvedLocation && req.message) {
      const msg = req.message.toLowerCase();
      if (msg.includes('puchong')) resolvedLocation = 'Puchong, Selangor';
      else if (msg.includes('petaling jaya') || msg.includes('pj ')) resolvedLocation = 'Petaling Jaya, Selangor';
      else if (msg.includes('cheras')) resolvedLocation = 'Cheras, Kuala Lumpur';
      else if (msg.includes('ampang')) resolvedLocation = 'Ampang, Selangor';
      else if (msg.includes('kepong')) resolvedLocation = 'Kepong, Kuala Lumpur';
      else if (msg.includes('klang')) resolvedLocation = 'Klang, Selangor';
      else if (msg.includes('shah alam')) resolvedLocation = 'Shah Alam, Selangor';
    }
    if (!resolvedLocation) resolvedLocation = 'Kuala Lumpur';

    const newApp = {
      id: 'APPT-' + Math.floor(100 + Math.random() * 900),
      role: role,
      date: req.date || '2026-06-05',
      time: '09:00 AM',
      clientName: req.name,
      clientPhone: req.contact || 'N/A',
      clientEmail: req.email || 'N/A',
      location: resolvedLocation,
      details: req.message,
      status: 'Scheduled'
    };
    const updatedAppts = [...calendarAppointments, newApp];
    localStorage.setItem('mcsa_calendar_appointments', JSON.stringify(updatedAppts));

    // 2. Update the care request status to 'accepted' and store caregiver name
    const updatedRequests = careRequests.map((r: any) => 
      r.id === req.id ? { ...r, status: 'accepted', assignedCaregiver: member.name } : r
    );
    store.setCareRequests(updatedRequests);
    setCareRequests(updatedRequests);

    // Reset smart match states
    setShowMatchResults(false);
    setSelectedMatchRequestId('');

    alert(`🎉 Success! Caregiver ${member.name} has been assigned to ${req.name}.\n\nThe shift is scheduled for ${newApp.date} and has been synced to the caregiver's workstation.`);
  };

  const handleLibFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewLibFileName(file.name);
    const sizeMb = file.size / (1024 * 1024);
    const formattedSize = sizeMb > 0.1 ? `${sizeMb.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
    setNewLibFileSize(formattedSize);

    const reader = new FileReader();
    reader.onload = async () => {
      const originalBase64 = reader.result as string;
      if (file.size > 150 * 1024) {
        setNewLibFileSize('Compressing... / 正在压缩图片...');
        try {
          const compressed = await compressImage(originalBase64);
          setNewLibImage(compressed);
          
          // Estimate compressed size
          const strLen = compressed.length - 'data:image/jpeg;base64,'.length;
          const approxBytes = 4 * Math.ceil(strLen / 3) * 0.5624896;
          const approxKb = Math.round(approxBytes / 1024);
          setNewLibFileSize(`${approxKb} KB (Compressed / 已压缩)`);
        } catch (err) {
          console.error('Compression failed, using original:', err);
          setNewLibImage(originalBase64);
        }
      } else {
        setNewLibImage(originalBase64);
      }
    };
    reader.readAsDataURL(file);
  };

  const publishLibItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLibTitle.trim()) return;

    let finalImageUrl = newLibImage;
    if (!finalImageUrl) {
      if (newLibType === 'Image Map') {
        finalImageUrl = '/hospital_maps/hkl_map.jpg'; // fallback default
      }
    }

    if (editItemId) {
      // Edit mode
      const updated = libItems.map((item) => {
        if (item.id === editItemId) {
          return {
            ...item,
            title: newLibTitle,
            type: newLibType,
            state: newLibState,
            size: newLibFileSize || item.size || '420 KB',
            imageUrl: finalImageUrl || item.imageUrl
          };
        }
        return item;
      });
      store.setLibItems(updated);
      setLibItems(updated);
      setEditItemId(null);
      alert('Updated guide details successfully.');
    } else {
      // Publish mode
      const newItem = {
        id: 'LIB-' + Math.floor(101 + Math.random() * 100),
        title: newLibTitle,
        type: newLibType,
        state: newLibState,
        size: newLibFileSize || '420 KB',
        imageUrl: finalImageUrl
      };
      const updated = [newItem, ...libItems];
      store.setLibItems(updated);
      setLibItems(updated);
      alert('Published new library file to caregiver databases.');
    }

    // Reset form states
    setNewLibTitle('');
    setNewLibType('Image Map');
    setNewLibState('Kuala Lumpur');
    setNewLibImage('');
    setNewLibFileName('');
    setNewLibFileSize('');
  };

  const handleEditLibItem = (item: any) => {
    setEditItemId(item.id);
    setNewLibTitle(item.title);
    setNewLibType(item.type);
    setNewLibState(item.state || 'Kuala Lumpur');
    setNewLibImage(item.imageUrl || '');
    setNewLibFileName(item.imageUrl ? 'Existing File' : '');
    setNewLibFileSize(item.size || '');
  };

  const handleCancelEdit = () => {
    setEditItemId(null);
    setNewLibTitle('');
    setNewLibType('Image Map');
    setNewLibState('Kuala Lumpur');
    setNewLibImage('');
    setNewLibFileName('');
    setNewLibFileSize('');
  };

  // Batch import library items
  const handleBatchImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          const formattedImport = parsed.map((item: any, idx: number) => ({
            id: 'LIB-IMP-' + Math.floor(1000 + Math.random() * 9000) + '-' + idx,
            title: item.title || 'Untitled Hospital Map',
            type: item.type || 'Image Map',
            state: item.state || 'Kuala Lumpur',
            size: item.size || '420 KB',
            imageUrl: item.imageUrl || '/hospital_maps/hkl_map.jpg'
          }));
          const updated = [...formattedImport, ...libItems];
          store.setLibItems(updated);
          setLibItems(updated);
          alert(`Successfully batch imported ${formattedImport.length} hospitals!`);
        } else {
          alert('Invalid JSON structure. Root element must be an array.');
        }
      } catch (err) {
        alert('Failed to parse JSON file: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const publishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    const newAnn = {
      id: 'ANN-' + Math.floor(101 + Math.random() * 900),
      title: annTitle,
      category: annCategory,
      date: new Date().toISOString().split('T')[0],
      content: annContent
    };
    const updated = [newAnn, ...announcements];
    store.setAnnouncements(updated);
    setAnnouncements(updated);
    setAnnTitle('');
    setAnnContent('');
    alert('Published announcement successfully!');
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    store.setAnnouncements(updated);
    setAnnouncements(updated);
    alert('Announcement deleted.');
  };

  const handleGalleryPhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFileName(file.name);
    const sizeMb = file.size / (1024 * 1024);
    const formattedSize = sizeMb > 0.1 ? `${sizeMb.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
    setPhotoFileSize(formattedSize);

    const reader = new FileReader();
    reader.onload = async () => {
      const originalBase64 = reader.result as string;
      if (file.size > 150 * 1024) {
        setPhotoFileSize('Compressing... / 正在压缩图片...');
        try {
          const compressed = await compressImage(originalBase64, 800, 800, 0.75);
          setPhotoUrl(compressed);
          
          // Estimate compressed size
          const strLen = compressed.length - 'data:image/jpeg;base64,'.length;
          const approxBytes = 4 * Math.ceil(strLen / 3) * 0.5624896;
          const approxKb = Math.round(approxBytes / 1024);
          setPhotoFileSize(`${approxKb} KB (Compressed / 已压缩)`);
        } catch (err) {
          console.error('Compression failed, using original:', err);
          setPhotoUrl(originalBase64);
        }
      } else {
        setPhotoUrl(originalBase64);
      }
    };
    reader.readAsDataURL(file);
  };

  const addActivityPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl.trim() || !photoCaption.trim()) return;

    let finalUrl = photoUrl.trim();
    // Auto-convert standard Google Drive sharing links to direct image links
    if (finalUrl.includes('drive.google.com')) {
      const match = finalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || finalUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        finalUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }

    const newPhoto = {
      id: 'PHOTO-' + Math.floor(101 + Math.random() * 900),
      url: finalUrl,
      caption: photoCaption
    };
    const updated = [...activityPhotos, newPhoto];
    
    try {
      store.setActivityPhotos(updated);
      setActivityPhotos(updated);
      setPhotoUrl('');
      setPhotoCaption('');
      setPhotoFileName('');
      setPhotoFileSize('');
      alert('Activity photo added to public galleries successfully!');
    } catch (err) {
      alert(lang === 'zh'
        ? '⚠️ 存储已满！无法添加该照片。请在“Overview”中重置数据库以腾出空间。'
        : '⚠️ LocalStorage quota full! Could not add this photo. Please reset database in Overview tab.');
    }
  };

  const deleteActivityPhoto = (id: string) => {
    const updated = activityPhotos.filter(p => p.id !== id);
    store.setActivityPhotos(updated);
    setActivityPhotos(updated);
    alert('Activity photo removed.');
  };

  const addOrUpdateBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) {
      alert('Title and Content are required!');
      return;
    }

    if (editBlogId) {
      // Edit Mode
      const updated = blogPosts.map((post) => {
        if (post.id === editBlogId) {
          return {
            ...post,
            title: blogTitle.trim(),
            category: blogCategory,
            author: blogAuthor.trim(),
            coverImage: blogCoverImage.trim() || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&h=400&fit=crop',
            readTime: blogReadTime.trim(),
            content: blogContent,
            snippet: blogContent.split('\n').filter(p => p.trim() && !p.startsWith('#')).join(' ').substring(0, 160) + '...'
          };
        }
        return post;
      });
      try {
        store.setBlogPosts(updated);
        setBlogPosts(updated);
        alert('Blog post updated successfully!');
        resetBlogForm();
      } catch (err) {
        alert('Failed to save changes. LocalStorage quota full!');
      }
    } else {
      // Create Mode
      const newPost = {
        id: 'BLOG-' + Date.now(),
        title: blogTitle.trim(),
        category: blogCategory,
        date: new Date().toISOString().split('T')[0],
        readTime: blogReadTime.trim() || '5 min read',
        author: blogAuthor.trim() || 'MCSA Editorial',
        coverImage: blogCoverImage.trim() || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&h=400&fit=crop',
        snippet: blogContent.split('\n').filter(p => p.trim() && !p.startsWith('#')).join(' ').substring(0, 160) + '...',
        content: blogContent
      };
      const updated = [newPost, ...blogPosts];
      try {
        store.setBlogPosts(updated);
        setBlogPosts(updated);
        alert('Blog post published successfully!');
        resetBlogForm();
      } catch (err) {
        alert('Failed to publish. LocalStorage quota full!');
      }
    }
  };

  const deleteBlogPost = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post? This will unpublish it immediately.')) {
      const updated = blogPosts.filter((post) => post.id !== id);
      store.setBlogPosts(updated);
      setBlogPosts(updated);
      alert('Blog post deleted.');
    }
  };

  const handleEditBlogPost = (post: any) => {
    setEditBlogId(post.id);
    setBlogTitle(post.title);
    setBlogCategory(post.category);
    setBlogAuthor(post.author);
    setBlogCoverImage(post.coverImage);
    setBlogReadTime(post.readTime);
    setBlogContent(post.content);
    setShowBlogForm(true);
  };

  const resetBlogForm = () => {
    setEditBlogId(null);
    setBlogTitle('');
    setBlogCategory('Caregiver Stories');
    setBlogAuthor('MCSA Editorial');
    setBlogCoverImage('');
    setBlogReadTime('5 min read');
    setBlogContent('');
    setShowBlogForm(false);
  };

  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const originalBase64 = reader.result as string;
      try {
        const compressed = await compressImage(originalBase64, 800, 800, 0.75);
        setBlogCoverImage(compressed);
        alert(lang === 'zh' ? '照片上传并自动压缩成功！' : 'Photo uploaded and compressed successfully!');
      } catch (err) {
        setBlogCoverImage(originalBase64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="app-container" style={{ background: 'var(--bg-main)' }}>
      {/* Sidebar with Glassmorphic design */}
      <aside className="sidebar" style={{ background: 'rgba(15, 23, 42, 0.9)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="sidebar-logo" style={{ fontSize: '1rem', whiteSpace: 'nowrap' }}>
          🛡️ MCSA {adminRole === 'master' ? 'MASTER' : 'STANDARD'} ADMIN
        </div>
        <ul className="sidebar-menu">
          <li>
            <button 
              onClick={() => setActiveTab('overview')}
              className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Shield size={18} /> Union Overview
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('members')}
              className={`sidebar-link ${activeTab === 'members' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Users size={18} /> Member Audit ({pendingMembers.length})
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('unionMembers')}
              className={`sidebar-link ${activeTab === 'unionMembers' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Users size={18} /> Active Members ({unionMembers.length})
            </button>
          </li>

          {adminRole === 'master' ? (
            <>
              <li>
                <button 
                  onClick={() => setActiveTab('cases')}
                  className={`sidebar-link ${activeTab === 'cases' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <Briefcase size={18} /> Match Dispatch
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('inquiries')}
                  className={`sidebar-link ${activeTab === 'inquiries' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <MessageSquare size={18} /> Client Inquiries
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('library')}
                  className={`sidebar-link ${activeTab === 'library' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <BookOpen size={18} /> Library SOPs
                </button>
              </li>
            </>
          ) : (
            <>
              <li style={{ opacity: 0.45 }}>
                <div className="sidebar-link" style={{ cursor: 'not-allowed', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={18} /> Match Dispatch 🔒
                </div>
              </li>
              <li style={{ opacity: 0.45 }}>
                <div className="sidebar-link" style={{ cursor: 'not-allowed', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={18} /> Client Inquiries 🔒
                </div>
              </li>
              <li style={{ opacity: 0.45 }}>
                <div className="sidebar-link" style={{ cursor: 'not-allowed', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} /> Library SOPs 🔒
                </div>
              </li>
            </>
          )}

          <li>
            <button 
              onClick={() => setActiveTab('announcements')}
              className={`sidebar-link ${activeTab === 'announcements' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Megaphone size={18} /> Announcements & Photos
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('escortForms')}
              className={`sidebar-link ${activeTab === 'escortForms' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <User size={18} /> Patient Records
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('blog')}
              className={`sidebar-link ${activeTab === 'blog' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <FileText size={18} /> Blog & News
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('timebank')}
              className={`sidebar-link ${activeTab === 'timebank' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Award size={18} /> Care Time Bank
            </button>
          </li>
          <li style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
            <a 
              href="/" 
              onClick={() => {
                localStorage.removeItem('mcsa_logged_admin_email');
              }}
              className="sidebar-link" 
              style={{ color: '#fca5a5' }}
            >
              🚪 {lang === 'zh' ? '安全退出' : 'Logout Admin'}
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Workspace */}
      <main className="workspace animate-fade-in">
        
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: 'var(--text-light)' }}>Union Status & Operations Dashboard</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Global summary metrics for 10,000+ active scale caregivers.</p>

            {/* Statistics */}
            <div className="grid-cols-3" style={{ marginBottom: '2.5rem' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ padding: '0.85rem', background: 'var(--primary-glow)', borderRadius: '12px', color: 'var(--primary)' }}>
                  <Users size={32} />
                </div>
                <div>
                  <h4 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-light)' }}>10,240</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>Registered Members</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ padding: '0.85rem', background: 'var(--health-glow)', borderRadius: '12px', color: 'var(--health)' }}>
                  <Briefcase size={32} />
                </div>
                <div>
                  <h4 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-light)' }}>3,150</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>Active Dispatches</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ padding: '0.85rem', background: 'var(--accent-glow)', borderRadius: '12px', color: 'var(--accent)' }}>
                  <DollarSign size={32} />
                </div>
                <div>
                  <h4 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-light)' }}>RM 358.4K</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>License Revenues</p>
                </div>
              </div>
            </div>

            {/* System Log Details */}
            <div className="card">
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>⚡ Real-time Operations Event Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(37,99,235,0.03)', borderLeft: '3px solid var(--primary)', borderRadius: '8px', borderTop: '1px solid rgba(255,255,255,0.01)' }}>
                  <strong>[16:42:01] System Auto-Trigger:</strong> New registration received from siti@mcsa.com.my. Vetting queue entry created.
                </div>
                <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(16,185,129,0.03)', borderLeft: '3px solid var(--health)', borderRadius: '8px', borderTop: '1px solid rgba(255,255,255,0.01)' }}>
                  <strong>[16:30:12] Case Match Success:</strong> Companion ID CH-2026-0009 dispatched to patient Grandpa Zhang (Hospital Kuala Lumpur).
                </div>
                <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(245,158,11,0.03)', borderLeft: '3px solid var(--accent)', borderRadius: '8px', borderTop: '1px solid rgba(255,255,255,0.01)' }}>
                  <strong>[16:15:45] Payment Gate Recipient:</strong> Annual fee renewal completed for Caregiver 264. License expiry pushed.
                </div>
              </div>
            </div>

            {/* Standard Admin Account Control (Master Admin Only) */}
            {adminRole === 'master' && (
              <>
                <div className="card" style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
                    🛡️ Standard Admin Account Control / 标准管理员账户管理
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    As the Master Admin, you can update the credential code for standard administrative hires (e.g., when staff resign or rotate roles). Changes immediately invalidate prior session keys.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.3)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', marginTop: 0 }}>Current Staff Account Details / 当前员工账户信息</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <div>Email Address: <strong style={{ color: '#ffffff' }}>staff@mcsa.com.my</strong></div>
                        <div>Role Permission: <strong style={{ color: 'var(--primary)' }}>Standard Admin (Restricted)</strong></div>
                        <div>Current Access Key: <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{currentStaffPassword}</strong></div>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateStaffPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>New Standard Admin Password / 新密码</label>
                        <input 
                          type="text" 
                          required 
                          minLength={6}
                          className="form-input" 
                          placeholder="e.g. CARE8268, MCSA2026staff"
                          value={newStaffPassword}
                          onChange={(e) => setNewStaffPassword(e.target.value)}
                          style={{ height: '40px', fontSize: '0.85rem' }}
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        style={{ 
                          height: '40px',
                          background: 'linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)',
                          boxShadow: '0 4px 12px var(--primary-glow)',
                          fontSize: '0.85rem',
                          fontWeight: 700
                        }}
                      >
                        Update Staff Access Key / 更新凭证
                      </button>
                    </form>
                  </div>
                </div>

                {/* Footer Info Control Card */}
                <div className="card" style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
                    🏢 Association Footer & Contact Details / 协会页脚及联系方式管理
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    As the Master Admin, you can dynamically edit the public contact details, physical address, and organization bio presented in the site-wide footer. Changes will immediately sync across all portal screens.
                  </p>
                  <form onSubmit={handleUpdateFooterInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Association Phone / 协会联络电话</label>
                        <input 
                          type="text" 
                          required 
                          className="form-input" 
                          placeholder="+60 3-2274 9988"
                          value={footerPhone}
                          onChange={(e) => setFooterPhone(e.target.value)}
                          style={{ height: '40px', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Association Email / 官方电子邮箱</label>
                        <input 
                          type="email" 
                          required 
                          className="form-input" 
                          placeholder="registry@mcsa.com.my"
                          value={footerEmail}
                          onChange={(e) => setFooterEmail(e.target.value)}
                          style={{ height: '40px', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Physical Office Address / 协会实体办公地址</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        placeholder="KL Sentral Business Suites, Kuala Lumpur"
                        value={footerAddress}
                        onChange={(e) => setFooterAddress(e.target.value)}
                        style={{ height: '40px', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Association Brief Bio / 协会简介宣传文案</label>
                      <textarea 
                        required 
                        rows={3}
                        className="form-input" 
                        placeholder="Describe the union accreditation mission..."
                        value={footerDesc}
                        onChange={(e) => setFooterDesc(e.target.value)}
                        style={{ fontSize: '0.85rem', resize: 'none' }}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      style={{ 
                        height: '40px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)',
                        boxShadow: '0 4px 12px var(--primary-glow)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        alignSelf: 'flex-start',
                        padding: '0 2rem'
                      }}
                    >
                      Save Footer Settings / 保存页脚设置
                    </button>
                  </form>
                </div>

                {/* Danger Zone / Database Reset Card */}
                <div className="card" style={{ marginTop: '2.5rem', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.02)', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.05)' }}>
                  <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5' }}>
                    ⚠️ Danger Zone: Reset System Database / 危险区域：重置系统数据库 / Zon Bahaya: Tetap Semula Pangkalan Data
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {lang === 'zh' 
                      ? '如果您在审批会员或保存数据时遇到“本地存储已满 (LocalStorage Full)”的提示，可以使用此功能清除本地缓存。重置操作将清除所有新注册的会员、正在申请的会员、客户咨询以及排班表，并恢复为系统的初始演示 data。'
                      : lang === 'bm'
                      ? 'Jika anda menghadapi amaran "Penyimpanan Tempatan Penuh (LocalStorage Full)" semasa meluluskan ahli atau menyimpan data, anda boleh menggunakan fungsi ini untuk mengosongkan cache tempatan. Tindakan ini akan memadamkan semua ahli baru, permohonan, pertanyaan pelanggan dan jadual, serta menetapkan semula ke data demo asal sistem.'
                      : 'If you encounter "LocalStorage Full" quota exceeded warnings when approving members or saving data, you can use this utility to clear the local browser storage. This will purge all newly registered caregivers, pending applications, client inquiries, and schedules, reverting the database to initial clean system defaults.'}
                  </p>
                  <button 
                    onClick={handleResetDatabase}
                    className="btn"
                    style={{ 
                      height: '40px',
                      background: 'linear-gradient(135deg, var(--danger) 0%, #b91c1c 100%)',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      border: 'none',
                      padding: '0 2rem',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    🚨 {lang === 'zh' ? '重置系统本地数据库' : lang === 'bm' ? 'Tetap Semula Pangkalan Data Sistem' : 'Reset System Local Database'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff' }}>Union Membership Registry Vetting</h2>
              <button 
                onClick={() => { 
                  store.pullFromCloud()
                    .then(() => {
                      setPendingMembers(store.getPendingMembers()); 
                      alert('Vetting queue refreshed from cloud! / 申请列表已同步刷新！'); 
                    })
                    .catch((err) => {
                      setPendingMembers(store.getPendingMembers());
                      alert('Local refresh complete / 本地列表已刷新');
                    });
                }} 
                className="btn btn-outline" 
                style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.4rem 0.85rem', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff'
                }}
              >
                🔄 Refresh List / 刷新列表
              </button>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Audit qualifications and clearance forms. Click Details to verify medical diagnostics.</p>

            <div className="card" style={{ overflowX: 'auto', padding: '1rem' }}>
              <table style={{ width: '100%', minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Role Category</th>
                    <th>Experience</th>
                    <th>Vetting Attachment</th>
                    <th>Verification Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingMembers.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <strong style={{ color: '#ffffff' }}>{m.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{m.email}</div>
                      </td>
                      <td>
                        <span className="badge badge-pending" style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}>
                          {m.category}
                        </span>
                      </td>
                      <td><strong style={{ color: '#ffffff' }}>{m.exp}</strong></td>
                      <td>
                        <span 
                          onClick={() => { setSelectedMember(m); setDocTab('cert'); }}
                          style={{ textDecoration: 'underline', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          📄 {m.proof}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button 
                          onClick={() => { setSelectedMember(m); setDocTab('cert'); }} 
                          className="btn btn-outline" 
                          style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                        >
                          🔍 Audit Details
                        </button>
                        <button 
                          onClick={() => approveMember(m.id, m.name)} 
                          className="btn btn-primary" 
                          style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', background: 'var(--health)', boxShadow: '0 2px 8px var(--health-glow)' }}
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => rejectMember(m.id, m.name)} 
                          className="btn btn-outline" 
                          style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                        >
                          <X size={14} /> Decline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'unionMembers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff' }}>MCSA Active Union Members Registry / 现役会员花名册</h2>
                <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0', fontSize: '0.95rem' }}>
                  Registry of verified, active Malaysia care companions, confinement ladies, elder caregivers, rehab assistants, and babysitters.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  onClick={() => { 
                    store.pullFromCloud()
                      .then(() => {
                        setUnionMembers(store.getUnionMembers()); 
                        alert('Union member list refreshed from cloud! / 盟友花名册已同步刷新！'); 
                      })
                      .catch((err) => {
                        setUnionMembers(store.getUnionMembers());
                        alert('Local refresh complete / 本地名册已刷新');
                      });
                  }} 
                  className="btn btn-outline" 
                  style={{ 
                    fontSize: '0.8rem', 
                    padding: '0.4rem 0.85rem', 
                    height: '38px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem',
                    borderColor: 'rgba(255,255,255,0.15)',
                    color: '#ffffff'
                  }}
                >
                  🔄 Refresh / 刷新
                </button>
              </div>
            </div>

            {(() => {
              const query = memberSearchQuery.toLowerCase().trim();
              const filteredMembers = unionMembers.filter((m: any) => {
                if (!query) return true;
                return (
                  (m.name || '').toLowerCase().includes(query) ||
                  (m.member_number || '').toLowerCase().includes(query) ||
                  (m.nric || '').toLowerCase().includes(query) ||
                  (m.category || '').toLowerCase().includes(query) ||
                  (m.location || '').toLowerCase().includes(query) ||
                  (m.phone || '').toLowerCase().includes(query) ||
                  (m.email || '').toLowerCase().includes(query)
                );
              });

              return (
                <>
                  {/* Search and Export Actions Panel */}
                  <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', background: 'rgba(15, 23, 42, 0.3)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="🔍 Search name, ID, NRIC, category, phone, location... / 搜索姓名、会员号、身份证、类别、地区..."
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                        style={{ height: '40px', fontSize: '0.88rem', paddingLeft: '2.5rem', background: 'rgba(30, 41, 59, 0.5)' }}
                      />
                    </div>
                    <button
                      onClick={() => exportToCSV(filteredMembers)}
                      className="btn btn-primary"
                      style={{
                        height: '40px',
                        padding: '0 1.25rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      📥 Export Excel / 导出表格 ({filteredMembers.length})
                    </button>
                  </div>

                  <div className="card" style={{ overflowX: 'auto', padding: '1rem' }}>
                    <table style={{ width: '100%', minWidth: '1000px' }}>
                      <thead>
                        <tr>
                          <th>Member Profile</th>
                          <th>Membership ID</th>
                          <th>NRIC / ID Number</th>
                          <th>Category / Role</th>
                          <th>Contact details</th>
                          <th>Primary Location</th>
                          <th>Membership Validity</th>
                          <th>Guild Contribution / 公会奉献</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.length === 0 ? (
                          <tr>
                            <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                              ❌ No matching members found. / 未找到符合条件的会员记录。
                            </td>
                          </tr>
                        ) : (
                          filteredMembers.map((m: any) => (
                            <tr key={m.id}>
                              <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--accent)', backgroundColor: '#1e293b' }}>
                                  <img src={m.photo} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                  <strong style={{ color: '#ffffff' }}>{m.name}</strong>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Exp: {m.exp}</div>
                                </div>
                              </td>
                              <td>
                                <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--primary)' }}>
                                  {m.member_number}
                                </span>
                              </td>
                              <td>
                                <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
                                  {m.nric || 'N/A'}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                  {(m.category || '').split(',').map((cat: string, idx: number) => {
                                    const trimmed = cat.trim();
                                    return (
                                      <span key={idx} className="badge badge-active" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--health)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                        {trimmed === 'Confinement Care' && '🍼 Confinement'}
                                        {trimmed === 'Patient Companion' && '🏥 Companion'}
                                        {trimmed === 'Elderly Caregiver' && '👴 Elderly'}
                                        {trimmed === 'Rehabilitation Care Assistant' && '💪 Rehab'}
                                        {trimmed === 'Babysitter Service' && '👶 Babysitter'}
                                        {!['Confinement Care', 'Patient Companion', 'Elderly Caregiver', 'Rehabilitation Care Assistant', 'Babysitter Service'].includes(trimmed) && trimmed}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.82rem', color: '#ffffff' }}>{m.phone}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.email}</div>
                              </td>
                              <td><span style={{ fontSize: '0.82rem', color: '#ffffff' }}>{m.location}</span></td>
                              <td>
                                <span style={{ fontSize: '0.82rem', color: '#cbd5e1', whiteSpace: 'nowrap' }}>
                                  📅 {getValidityRange(m)}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: '150px' }}>
                                  <select
                                    value={m.contributionCompliance !== undefined ? m.contributionCompliance : 100}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      const updated = unionMembers.map((item: any) => {
                                        if (item.id === m.id) {
                                          return { ...item, contributionCompliance: val };
                                        }
                                        return item;
                                      });
                                      store.setUnionMembers(updated);
                                      setUnionMembers(updated);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      fontSize: '0.78rem',
                                      borderRadius: '6px',
                                      background: 'var(--bg-input)',
                                      color: 'var(--text-light)',
                                      border: '1px solid var(--border)',
                                      cursor: 'pointer',
                                      outline: 'none'
                                    }}
                                  >
                                    <option value={100}>100% Compliant / 奉献达标</option>
                                    <option value={80}>80% Standard / 奉献良好</option>
                                    <option value={50}>50% Low / 贡献偏低</option>
                                    <option value={0}>0% None / 零贡献</option>
                                  </select>
                                  {(() => {
                                    const comp = m.contributionCompliance !== undefined ? m.contributionCompliance : 100;
                                    if (comp >= 90) return <span style={{ fontSize: '0.7rem', color: 'var(--health)', fontWeight: 'bold' }}>⚡ High Priority / 优先派单</span>;
                                    if (comp >= 50) return <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 'bold' }}>✔️ Standard / 正常派单</span>;
                                    if (comp > 0) return <span style={{ fontSize: '0.7rem', color: 'var(--warning)', fontWeight: 'bold' }}>⚠️ Low / 限流派单</span>;
                                    return <span style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 'bold' }}>🚫 Restricted / 限制派单</span>;
                                  })()}
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  <button 
                                    onClick={() => {
                                      setSelectedUnionCard(m);
                                    }}
                                    className="btn btn-outline" 
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                                  >
                                    💳 Card
                                  </button>
                                  {m.icDocData ? (
                                    <a 
                                      href={m.icDocData} 
                                      download={m.icDoc || 'NRIC_Copy.pdf'}
                                      className="btn btn-outline" 
                                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderColor: 'var(--primary)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center' }}
                                    >
                                      📁 ID Copy
                                    </a>
                                  ) : (
                                    <button 
                                      onClick={() => {
                                        setSelectedMockIC(m);
                                      }}
                                      className="btn btn-outline" 
                                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.15)', color: '#cbd5e1' }}
                                    >
                                      🛡️ MyKad
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to remove ${m.name} from the active registry? This will de-license them.`)) {
                                        const updated = unionMembers.filter((item: any) => item.id !== m.id);
                                        store.setUnionMembers(updated);
                                        setUnionMembers(updated);
                                        alert(`${m.name} has been removed.`);
                                      }
                                    }}
                                    className="btn btn-outline" 
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {activeTab === 'cases' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: 'var(--text-light)' }}>Match Dispatch & Case Assignments / 智能匹配与派单管理</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Match incoming case requests to vetted, verified caregivers.</p>

            <div className="grid-cols-2">
              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem', color: 'var(--text-light)' }}>Active Dispatched Assignments / 现役已派单订单</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Default mock assignments */}
                  <div style={{ border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '12px', background: 'var(--primary-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <strong style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>Grandpa Zhang (Chronic Care)</strong>
                      <span className="badge badge-active">Active Shift</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>Assigned Caregiver: Li Xiulan (MCSA-2026-0009)</p>
                  </div>
                  <div style={{ border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '12px', background: 'var(--primary-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <strong style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>Baby Wang & Mom (Confinement)</strong>
                      <span className="badge badge-active">Active Shift</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>Assigned Caregiver: Meizhen Chen (MCSA-2026-1112)</p>
                  </div>

                  {/* Dynamically assigned assignments */}
                  {careRequests.filter((r: any) => r.status === 'accepted').map((r: any) => (
                    <div key={r.id} style={{ border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '12px', background: 'var(--primary-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <strong style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>{r.name} ({r.category})</strong>
                        <span className="badge badge-active">Active Shift</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>Assigned Caregiver: {r.assignedCaregiver || 'Vetted Caregiver'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Location: {r.location || 'Kuala Lumpur'} | Date: {r.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem', color: 'var(--text-light)' }}>Smart Match Suggestion Engine / 智能配单推荐系统</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                    Execute matching algorithms factoring in hospital coordinates, caregiver specialized categories, and clinical ratings.
                  </p>

                  {/* Dropdown to select a pending care request */}
                  {(() => {
                    const pendingRequests = careRequests.filter((r: any) => r.status !== 'accepted');
                    if (pendingRequests.length === 0) {
                      return (
                        <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-input)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                          <span style={{ fontSize: '2rem' }}>🎉</span>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            All dispatches assigned! / 所有需求均已分发。
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                            Select Pending Client Request / 选择待派单的客户需求：
                          </label>
                          <select
                            className="form-input"
                            value={selectedMatchRequestId}
                            onChange={(e) => {
                              setSelectedMatchRequestId(e.target.value);
                              setShowMatchResults(false);
                            }}
                            style={{ height: '42px', fontSize: '0.88rem', background: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border)', cursor: 'pointer' }}
                          >
                            <option value="">-- Choose pending request / 请选择需求 --</option>
                            {pendingRequests.map((r: any) => (
                              <option key={r.id} value={r.id}>
                                {r.name} - {r.category} ({r.location || 'Selangor/KL'})
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedMatchRequestId && (() => {
                          const selectedReq = pendingRequests.find(r => r.id === selectedMatchRequestId);
                          if (!selectedReq) return null;
                          return (
                            <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                              <p style={{ margin: '0 0 0.5rem 0' }}>📝 <strong>Client Needs:</strong> {selectedReq.message}</p>
                              <p style={{ margin: 0 }}>📅 <strong>Requested Date:</strong> {selectedReq.date || '2026-06-05'}</p>
                            </div>
                          );
                        })()}

                        {/* Smart Match Execution button */}
                        <button 
                          onClick={() => {
                            if (!selectedMatchRequestId) {
                              alert('Please select a pending request first.');
                              return;
                            }
                            setShowMatchResults(true);
                          }} 
                          disabled={!selectedMatchRequestId}
                          className="btn btn-primary"
                          style={{ 
                            width: '100%', 
                            background: 'linear-gradient(135deg, var(--accent) 0%, #d97706 100%)', 
                            boxShadow: '0 4px 14px var(--accent-glow)',
                            opacity: selectedMatchRequestId ? 1 : 0.5,
                            cursor: selectedMatchRequestId ? 'pointer' : 'not-allowed'
                          }}
                        >
                          ⚡ Execute Smart Match Recommendation / 执行智能配单推荐
                        </button>
                      </div>
                    );
                  })()}
                </div>

                {/* Recommendations list (displayed after executing match) */}
                {showMatchResults && selectedMatchRequestId && (() => {
                  const req = careRequests.find(r => r.id === selectedMatchRequestId);
                  if (!req) return null;

                  // Execute simple matching algorithm
                  // Category match = +30 points, Location match = +15 points, ratings = random/deterministic mock
                  const getMockCaregiverDetails = (name: string) => {
                    if (name === 'Li Xiulan') return { rating: 4.8, reviews: 32, stars: '⭐⭐⭐⭐☆' };
                    if (name === 'Meizhen Chen') return { rating: 5.0, reviews: 48, stars: '⭐⭐⭐⭐⭐' };
                    return { rating: 4.7, reviews: 15, stars: '⭐⭐⭐⭐☆' };
                  };

                  const computedRecommendations = unionMembers.map((m: any) => {
                    const details = getMockCaregiverDetails(m.name);
                    const catMatch = (m.category || '').toLowerCase().includes(req.category.toLowerCase().split(' ')[0]);
                    const reqLocation = (req.location || 'Selangor').toLowerCase();
                    const mLocation = (m.location || 'KL').toLowerCase();
                    const locMatch = reqLocation.includes(mLocation) || mLocation.includes(reqLocation) || req.message.toLowerCase().includes(mLocation.split(',')[0].trim());

                    const comp = m.contributionCompliance !== undefined ? m.contributionCompliance : 100;
                    let contributionBonus = 0;
                    if (comp >= 90) contributionBonus = 15;
                    else if (comp >= 50) contributionBonus = 0;
                    else if (comp > 0) contributionBonus = -30;
                    else contributionBonus = -50;

                    let score = 50;
                    if (catMatch) score += 30;
                    if (locMatch) score += 15;
                    score += Math.round((details.rating - 4.0) * 6);
                    score += contributionBonus;
                    if (score < 10) score = 10;
                    if (score > 98) score = 98; // maximum match score representation

                    return {
                      caregiver: m,
                      score: score,
                      details: details,
                      catMatch: catMatch,
                      locMatch: locMatch
                    };
                  }).sort((a, b) => b.score - a.score);

                  return (
                    <div className="animate-fade-in" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                      <h4 style={{ color: 'var(--text-light)', margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 800 }}>
                        📊 Top Matches for {req.name} (最佳推荐看护人列表)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {computedRecommendations.map((rec: any) => (
                          <div 
                            key={rec.caregiver.id} 
                            style={{ 
                              padding: '1rem', 
                              borderRadius: '12px', 
                              background: 'var(--bg-input)', 
                              border: `1.5px solid ${rec.score >= 85 ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.75rem'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--accent)' }}>
                                  <img src={rec.caregiver.photo} alt={rec.caregiver.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                  <strong style={{ color: 'var(--text-light)', fontSize: '0.92rem' }}>{rec.caregiver.name}</strong>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                    {rec.caregiver.category} ({rec.caregiver.exp} exp)
                                  </div>
                                  <div style={{ fontSize: '0.7rem', marginTop: '0.15rem' }}>
                                    {(() => {
                                      const comp = rec.caregiver.contributionCompliance !== undefined ? rec.caregiver.contributionCompliance : 100;
                                      if (comp >= 90) return <span style={{ color: 'var(--health)', fontWeight: 'bold' }}>⭐ Guild Contributor ({comp}%)</span>;
                                      if (comp >= 50) return <span style={{ color: 'var(--accent)' }}>✔️ Standard Dues ({comp}%)</span>;
                                      if (comp > 0) return <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>⚠️ Low Dues ({comp}%) - Throttled</span>;
                                      return <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>🚫 Restricted ({comp}%) - Throttled</span>;
                                    })()}
                                  </div>
                                </div>
                              </div>
                              <span 
                                className="badge" 
                                style={{ 
                                  fontSize: '0.68rem', 
                                  padding: '0.15rem 0.5rem', 
                                  backgroundColor: rec.score >= 85 ? 'rgba(16,185,129,0.1)' : 'var(--bg-card)',
                                  color: rec.score >= 85 ? 'var(--health)' : 'var(--text-muted)',
                                  border: rec.score >= 85 ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--border)'
                                }}
                              >
                                {rec.score}% Match
                              </span>
                            </div>

                            {/* Ratings & Matching Criteria Display */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', background: 'var(--primary-light)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
                                  {rec.details.stars} <span style={{ color: 'var(--text-main)', fontSize: '0.75rem' }}>{rec.details.rating}</span>
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                  {rec.details.reviews} clinical reviews / 临床评价
                                </span>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', textAlign: 'right', fontSize: '0.72rem' }}>
                                <span style={{ color: rec.catMatch ? 'var(--health)' : 'var(--danger)' }}>
                                  {rec.catMatch ? '✅ Category Matches / 类别契合' : '❌ Mismatch / 类别不符'}
                                </span>
                                <span style={{ color: rec.locMatch ? 'var(--health)' : 'var(--text-muted)' }}>
                                  {rec.locMatch ? '✅ Area Proximity / 距离接近' : '⚠️ Area Mismatch / 跨区域'}
                                </span>
                              </div>
                            </div>

                            {/* Dispatch Action button */}
                            <button
                              onClick={() => handleAssignCaregiver(req, rec.caregiver)}
                              className="btn btn-outline"
                              style={{
                                width: '100%',
                                padding: '0.4rem',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                borderColor: 'var(--health)',
                                color: 'var(--health)',
                                background: 'rgba(16, 185, 129, 0.02)'
                              }}
                            >
                              🤝 Confirm Dispatch & Sync Shift / 确认派单并同步排班
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Customer Inquiries Logs</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Public feedback submissions tracked from Web homepage footer forms.</p>

            <div className="card" style={{ overflowX: 'auto', padding: '1rem' }}>
              <table style={{ width: '100%', minWidth: '700px' }}>
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Contact Info</th>
                    <th>Message Details</th>
                    <th>Resolution Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq) => (
                    <tr key={inq.id}>
                      <td><strong style={{ color: '#ffffff' }}>{inq.name}</strong></td>
                      <td><span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{inq.contact}</span></td>
                      <td style={{ maxWidth: '300px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>{inq.message}</td>
                      <td>
                        <button 
                          onClick={() => {
                            const updated = inquiries.filter(i => i.id !== inq.id);
                            store.setInquiries(updated);
                            setInquiries(updated);
                            alert('Inquiry marked as solved and archived.');
                          }}
                          className="btn btn-outline" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', borderColor: 'var(--health)', color: 'var(--health)' }}
                        >
                          Resolve & Contact
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Hospital Guidelines & SOP Library</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Manage hospital floor guides, states categorization, and routing maps for caregiver operations.</p>

            <div className="grid-cols-2">
              {/* Form panel: Publish or Update */}
              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem', color: '#ffffff' }}>
                  {editItemId ? '✏️ Edit Hospital Guide SOP' : '➕ Publish New Guide SOP'}
                </h3>
                <form onSubmit={publishLibItem}>
                  <div className="form-group">
                    <label className="form-label">Resource Title / 医院及地图名称</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. Hospital Kuala Lumpur cardiology route map"
                      value={newLibTitle}
                      onChange={(e) => setNewLibTitle(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Malaysia State / 所属州属</label>
                      <select 
                        className="form-input"
                        style={{ background: 'var(--bg-input)', color: 'white', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}
                        value={newLibState}
                        onChange={(e) => setNewLibState(e.target.value)}
                      >
                        {['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Sarawak', 'Sabah', 'Perak', 'Pahang', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Perlis', 'Terengganu'].map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Format Type / 格式文件</label>
                      <select 
                        className="form-input"
                        style={{ background: 'var(--bg-input)', color: 'white', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}
                        value={newLibType}
                        onChange={(e) => setNewLibType(e.target.value)}
                      >
                        <option value="Image Map">Image Map (JPG/PNG)</option>
                        <option value="PDF Document">PDF Document</option>
                        <option value="Spreadsheet Log">Spreadsheet Log</option>
                      </select>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Upload Hospital block map (JPG/PNG) / 上传医院地图文件</label>
                    
                    <div style={{
                      border: '2px dashed rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '12px',
                      padding: '1.5rem 1rem',
                      textAlign: 'center',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLibFileChange}
                        style={{
                          opacity: 0,
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          cursor: 'pointer',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                      
                      {newLibImage ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--primary)' }}>
                            <img src={newLibImage} alt="Selected preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 600 }}>{newLibFileName || 'Selected Map Image'}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{newLibFileSize}</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>📁</span>
                          <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Click to browse JPG map</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Supports JPG, JPEG, PNG</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      {editItemId ? '💾 Update Map Details / 保存修改' : '🚀 Publish and Notify Caregivers / 发布'}
                    </button>
                    {editItemId && (
                      <button type="button" onClick={handleCancelEdit} className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}>
                        Cancel / 取消
                      </button>
                    )}
                  </div>
                </form>

                {/* Batch import json */}
                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1.5px dashed rgba(255,255,255,0.06)' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 700 }}>⚡ Batch Import 50+ Hospitals (.json)</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                    Instantly load dozens of hospital records, coordinates, and routes using a structured JSON list file.
                  </p>
                  <input type="file" accept=".json" onChange={handleBatchImport} style={{ display: 'none' }} id="batch-json-upload" />
                  <label htmlFor="batch-json-upload" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', borderColor: 'var(--accent)', color: 'var(--accent)', fontWeight: 700 }}>
                    📥 Upload JSON Batch List / 导入JSON数据列表
                  </label>
                </div>
              </div>

              {/* Published Items List panel */}
              <div className="card">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Published Resources</h3>
                
                {/* Search & State Filters */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="🔍 Search hospital maps..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input"
                    style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem', height: '36px' }}
                  />
                  <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="form-input"
                    style={{ width: '130px', padding: '0.5rem', fontSize: '0.85rem', height: '36px', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <option value="">All States</option>
                    {['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Sarawak', 'Sabah', 'Perak', 'Pahang', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Perlis', 'Terengganu'].map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {(() => {
                    const filtered = libItems.filter((item) => {
                      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesState = stateFilter === '' || item.state === stateFilter;
                      return matchesSearch && matchesState;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div style={{ textAlign: 'center', opacity: 0.5, padding: '2rem 0' }}>
                          <span style={{ fontSize: '1.5rem' }}>🔍</span>
                          <p style={{ fontSize: '0.82rem', margin: '0.5rem 0 0 0' }}>No matching resources found.</p>
                        </div>
                      );
                    }

                    return filtered.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', minWidth: 0, flex: 1 }}>
                          {item.imageUrl ? (
                            <div style={{ width: '54px', height: '54px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, backgroundColor: '#0f172a' }}>
                              <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ) : (
                            <div style={{ width: '54px', height: '54px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ fontSize: '1.2rem' }}>📄</span>
                            </div>
                          )}
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <strong style={{ color: '#ffffff', fontSize: '0.92rem', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {item.title}
                            </strong>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                              <span className="badge badge-active" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                                {item.state || 'Kuala Lumpur'}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {item.type} &bull; {item.size}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                          <button 
                            onClick={() => handleEditLibItem(item)}
                            className="btn btn-outline" 
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 600 }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => {
                              const updated = libItems.filter(l => l.id !== item.id);
                              store.setLibItems(updated);
                              setLibItems(updated);
                              alert('Deleted guide.');
                            }}
                            className="btn btn-outline" 
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 600 }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Announcements & Activities Hub</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Publish new union-wide notifications and register dynamic training activity photos.</p>

            <div className="grid-cols-2">
              {/* Form 1: Announcements */}
              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>Publish Announcement</h3>
                <form onSubmit={publishAnnouncement}>
                  <div className="form-group">
                    <label className="form-label">Announcement Title</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. Mandatory Training Seminar"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      className="form-input"
                      style={{ background: 'var(--bg-input)', color: 'white', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}
                      value={annCategory}
                      onChange={(e) => setAnnCategory(e.target.value)}
                    >
                      <option value="Training">Training</option>
                      <option value="Union News">Union News</option>
                      <option value="General Notification">General Notification</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Content Description</label>
                    <textarea 
                      required 
                      className="form-input" 
                      style={{ minHeight: '100px', resize: 'vertical' }}
                      placeholder="Enter the notice details here..."
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    📢 Publish Announcement
                  </button>
                </form>
              </div>

              {/* Form 2: Activity Photos */}
              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>Add Activity Gallery Photo</h3>
                
                {/* Upload Mode Selector Tab */}
                <div style={{
                  display: 'flex',
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '0.25rem',
                  borderRadius: '10px',
                  marginBottom: '1.25rem'
                }}>
                  <button
                    type="button"
                    onClick={() => { setPhotoTab('upload'); setPhotoUrl(''); setPhotoFileName(''); }}
                    style={{
                      flex: 1,
                      padding: '0.45rem',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      background: photoTab === 'upload' ? '#2563eb' : 'transparent',
                      color: photoTab === 'upload' ? '#ffffff' : 'var(--text-muted)',
                      transition: 'all 0.2s'
                    }}
                  >
                    📁 Local Upload / 本地上传
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhotoTab('url'); setPhotoUrl(''); setPhotoFileName(''); }}
                    style={{
                      flex: 1,
                      padding: '0.45rem',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      background: photoTab === 'url' ? '#2563eb' : 'transparent',
                      color: photoTab === 'url' ? '#ffffff' : 'var(--text-muted)',
                      transition: 'all 0.2s'
                    }}
                  >
                    🔗 Image URL / 图片链接
                  </button>
                </div>

                <form onSubmit={addActivityPhoto}>
                  {photoTab === 'upload' ? (
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">UPLOAD PHOTO FILE / 选择本地图片</label>
                      <div style={{
                        border: '2px dashed rgba(255,255,255,0.1)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.02)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)'}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                      >
                        <input 
                          type="file" 
                          required={!photoUrl}
                          accept="image/*"
                          onChange={handleGalleryPhotoFileChange}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer'
                          }}
                        />
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          {photoFileName ? (
                            <div>
                              <span style={{ color: 'white', fontWeight: 'bold' }}>{photoFileName}</span>
                              <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--accent)', marginTop: '0.25rem' }}>{photoFileSize}</span>
                            </div>
                          ) : (
                            <div>
                              <span>📁 Drag & Drop or Click to Select / 拖拽或点击上传</span>
                              <span style={{ display: 'block', fontSize: '0.7rem', marginTop: '0.25rem' }}>(Supports JPG, PNG. Dynamic Compression)</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {photoUrl && photoUrl.startsWith('data:image') && (
                        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                          <img src={photoUrl} alt="Preview" style={{ maxHeight: '110px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', objectFit: 'contain' }} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">Photo Image URL / 图片网址</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        placeholder="e.g. /activity-center.jpg or custom HTTPS URL"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        style={{ height: '40px', fontSize: '0.85rem' }}
                      />
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Caption / Description / 照片说明</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. Practical Skills Assessment Room"
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                      style={{ height: '40px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', height: '40px', fontWeight: 700, fontSize: '0.88rem' }}
                    disabled={!photoUrl}
                  >
                    📸 Add Gallery Image / 添加至相册
                  </button>
                </form>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem' }} className="grid-cols-2">
              {/* Display list of announcements */}
              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>Current Published Announcements</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {announcements.map((ann) => (
                    <div key={ann.id} style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: '#ffffff', fontSize: '0.95rem', display: 'block' }}>{ann.title}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{ann.category} &bull; {ann.date}</div>
                        </div>
                        <button 
                          onClick={() => deleteAnnouncement(ann.id)}
                          className="btn btn-outline" 
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)', flexShrink: 0 }}
                        >
                          Delete
                        </button>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Display list of activity photos */}
              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>Current Gallery Photos</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                  {activityPhotos.map((photo) => (
                    <div key={photo.id} style={{ border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ width: '100%', height: '80px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#1e293b' }}>
                        <img src={photo.url} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {photo.caption}
                      </span>
                      <button 
                        onClick={() => deleteActivityPhoto(photo.id)}
                        className="btn btn-outline" 
                        style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem', borderColor: 'var(--danger)', color: 'var(--danger)', width: '100%', marginTop: 'auto' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'escortForms' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: 'var(--text-light)' }}>Patient Profiles & Escort Agreements / 病人记录与服务协议</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>View patient information sheets, health history profiles, and medical escort agreements.</p>

            {selectedEscortForm ? (
              <div>
                <button 
                  onClick={() => setSelectedEscortForm(null)}
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
                      <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent)' }}>{selectedEscortForm.id}</div>
                    </div>
                  </div>

                  <h2 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '2rem', fontFamily: 'Outfit' }}>📝 Medical Escort Service – Client Information Form</h2>

                  {/* Section 1 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>1. Personal Information / 个人信息</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>Full Name / 姓名:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.fullName}</span></div>
                      <div><strong>Gender / 性别:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.gender}</span></div>
                      <div><strong>Date of Birth / 出生日期:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.dob || 'N/A'}</span></div>
                      <div><strong>NRIC or Passport / 证件号:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.nric}</span></div>
                      <div><strong>Contact Number / 电话:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.phone || 'N/A'}</span></div>
                      <div><strong>Home Address / 地址:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.address || 'N/A'}</span></div>
                      <div><strong>Emergency Contact / 紧急联系人:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.emergencyName || 'N/A'}</span></div>
                      <div><strong>Emergency Phone / 联系电话:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.emergencyPhone || 'N/A'}</span></div>
                      <div><strong>Relationship / 关系:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.relationship || 'N/A'}</span></div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>2. Escort Service Details / 陪诊服务详情</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>Appointment Date / 就诊日期:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.appointmentDate || 'N/A'}</span></div>
                      <div><strong>Appointment Time / 就诊时间:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.appointmentTime || 'N/A'}</span></div>
                      <div><strong>Medical Facility / 就诊医院:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.facility || 'N/A'}</span></div>
                      <div><strong>Doctor Name / 医生姓名:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.doctor || 'N/A'}</span></div>
                      <div><strong>Department or Specialty / 科室:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.specialty || 'N/A'}</span></div>
                      <div><strong>Admin Tasks Required / 协助取药/付款/登记:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.assistanceRequired ? 'Yes / 是' : 'No / 否'}</span></div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>3. Health & Medical History / 健康与既往病史</h4>
                    <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div><strong>Main Complaint / 就诊主诉:</strong> <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: '0.25rem 0 0 0' }}>{selectedEscortForm.complaint || 'N/A'}</p></div>
                      <div>
                        <strong>Past Medical History / 既往病史:</strong>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                          {selectedEscortForm.pastHistory && selectedEscortForm.pastHistory.length > 0 ? (
                            selectedEscortForm.pastHistory.map((h: string, i: number) => (
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
                      <div><strong>Drug Allergies / 药物过敏:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.drugAllergy}</span></div>
                      <div><strong>Food Allergies / 食物过敏:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.foodAllergy}</span></div>
                      <div><strong>Other Allergies / 其他过敏:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.otherAllergy}</span></div>
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>5. Current Medication / 当前用药情况</h4>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>Taking medications or supplements / 是否正在服药:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.takingMeds ? 'Yes / 是' : 'No / 否'}</span>
                      {selectedEscortForm.takingMeds && (
                        <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: '0.4rem 0 0 0', whiteSpace: 'pre-wrap' }}>{selectedEscortForm.medsList}</p>
                      )}
                    </div>
                  </div>

                  {/* Section 6 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>6. Surgical History / 手术史</h4>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>History of surgeries or procedures / 手术史:</strong>
                      <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: '0.4rem 0 0 0' }}>{selectedEscortForm.surgicalHistory || 'No / 无'}</p>
                    </div>
                  </div>

                  {/* Section 7 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>7. Functional & Mobility Assessment / 行动与感官功能评估</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>Mobility Difficulty / 行动评估:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.mobility}</span></div>
                      <div><strong>Hearing Difficulties / 听力困难:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.hearingDifficulty ? 'Yes / 有' : 'No / 无'}</span></div>
                      <div><strong>Speech Difficulties / 语言困难:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.speechDifficulty ? 'Yes / 有' : 'No / 无'}</span></div>
                      <div><strong>Visual Impairment / 视力受损情况:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.visualImpairment || 'No / 无'}</span></div>
                    </div>
                  </div>

                  {/* Section 8 */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>8. Additional Information / 额外备注</h4>
                    <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: 0 }}>{selectedEscortForm.additionalInfo || 'None / 无'}</p>
                  </div>

                  {/* Escort Authorization & Liability Agreement (陪诊协议条款) */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', marginBottom: '2.5rem', fontSize: '0.85rem' }}>
                    <h3 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>🤝 Medical Escort Service Authorization & Liability Agreement / 陪诊服务协议与责任告知书</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '240px', overflowY: 'auto', paddingRight: '0.5rem', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '8px', background: 'var(--bg-main)' }}>
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
                          ✍️ {selectedEscortForm.clientSigned}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed Date / 签署日期: {selectedEscortForm.signedDate}</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Escort Service Provider / 陪诊师</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#60a5fa', margin: '0.9rem 0' }}>
                          🛡️ {(() => {
                            const members = store.getUnionMembers();
                            const found = members.find((m: any) => m.id === selectedEscortForm.caregiverId || m.member_number === selectedEscortForm.caregiverId || m.name.toLowerCase().includes(String(selectedEscortForm.caregiverId || '').toLowerCase()));
                            return found ? `${found.name} (${found.member_number})` : (selectedEscortForm.caregiverId || 'Unassigned');
                          })()}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status / 执照状态: Active Licensed Vetted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '700px' }}>
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Companion / 陪诊人员</th>
                      <th>Appointment Date</th>
                      <th>Medical Facility</th>
                      <th>Emergency Contact</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {escortForms.map((f: any) => (
                      <tr key={f.id}>
                        <td>
                          <strong style={{ color: 'var(--text-light)' }}>{f.fullName}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{f.gender} &bull; {f.nric}</div>
                        </td>
                        <td>
                          {(() => {
                            const members = store.getUnionMembers();
                            const found = members.find((m: any) => m.id === f.caregiverId || m.member_number === f.caregiverId || m.name.toLowerCase().includes(String(f.caregiverId || '').toLowerCase()));
                            return found ? (
                              <div>
                                <strong style={{ color: 'var(--text-light)' }}>{found.name}</strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>ID: {found.member_number}</div>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>{f.caregiverId || 'Unassigned'}</span>
                            );
                          })()}
                        </td>
                        <td>
                          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{f.appointmentDate}</span>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>🕒 {f.appointmentTime}</div>
                        </td>
                        <td>
                          <span style={{ color: 'var(--text-main)' }}>{f.facility}</span>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{f.specialty} ({f.doctor || 'N/A'})</div>
                        </td>
                        <td>
                          <span style={{ color: 'var(--text-main)' }}>{f.emergencyName}</span>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>📞 {f.emergencyPhone} ({f.relationship})</div>
                        </td>
                        <td>
                          <button 
                            onClick={() => setSelectedEscortForm(f)}
                            className="btn btn-outline"
                            style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                          >
                            🔍 View Details & Agreement
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'blog' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div>
                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: 'var(--text-light)' }}>
                  📰 Blog & Caregiver Stories Manager / 博客故事与新闻管理
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                  Publish stories of certified caregivers, accreditation highlights, and standard health guide SOPs to show public transparency.
                </p>
              </div>
              <button
                onClick={() => {
                  resetBlogForm();
                  setShowBlogForm(true);
                }}
                className="btn btn-primary"
                style={{
                  background: 'var(--primary)',
                  boxShadow: '0 4px 12px var(--primary-glow)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem'
                }}
              >
                ➕ Write New Article / 发布新文章
              </button>
            </div>

            {/* Articles Table Card */}
            <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem' }}>Cover</th>
                    <th style={{ padding: '0.75rem' }}>Title & Category</th>
                    <th style={{ padding: '0.75rem' }}>Author & Date</th>
                    <th style={{ padding: '0.75rem' }}>Read Time</th>
                    <th style={{ padding: '0.75rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    if (blogPosts.length === 0) {
                      return (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            No blog posts published yet. Click "Write New Article" to get started!
                          </td>
                        </tr>
                      );
                    }

                    return blogPosts.map((post) => (
                      <tr key={post.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <img
                            src={post.coverImage || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&h=400&fit=crop'}
                            alt={post.title}
                            style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                          />
                        </td>
                        <td style={{ padding: '0.75rem', maxWidth: '350px' }}>
                          <div style={{ fontWeight: 'bold', color: 'var(--text-light)', fontSize: '0.92rem', marginBottom: '0.35rem', lineHeight: '1.4' }}>
                            {post.title}
                          </div>
                          <span className="badge badge-active" style={{
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.5rem',
                            backgroundColor: post.category === 'Caregiver Stories' ? 'rgba(16, 185, 129, 0.1)' : post.category === 'Accreditation News' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: post.category === 'Caregiver Stories' ? 'var(--health)' : post.category === 'Accreditation News' ? 'var(--primary)' : 'var(--accent)',
                            border: '1px solid transparent'
                          }}>
                            {post.category}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>{post.author}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>📅 {post.date}</div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{post.readTime}</span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleEditBlogPost(post)}
                              className="btn btn-outline"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => deleteBlogPost(post.id)}
                              className="btn btn-outline"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>

            {/* Modal Form Overlay */}
            {showBlogForm && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(11, 19, 41, 0.8)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
              }}>
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  width: '92%',
                  maxWidth: '960px',
                  maxHeight: '90vh',
                  borderRadius: '24px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  border: '1px solid var(--border)'
                }}>
                  {/* Modal Header */}
                  <div style={{
                    padding: '1.25rem 2rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-sidebar)',
                    color: '#ffffff'
                  }}>
                    <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
                      {editBlogId ? '✏️ Edit Blog & Story Post' : '📰 Publish New Story / News'}
                    </h3>
                    <button 
                      onClick={resetBlogForm}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: 'none',
                        color: '#ffffff',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Modal Scroll Content */}
                  <form onSubmit={addOrUpdateBlogPost} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                    <div style={{ overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Left side: fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ color: 'var(--text-main)', fontWeight: 600 }}>Article Title / 文章标题</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Caregiver Journey: Making Home Vitals Safe"
                              className="form-input"
                              value={blogTitle}
                              onChange={(e) => setBlogTitle(e.target.value)}
                              style={{ height: '42px', background: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ color: 'var(--text-main)', fontWeight: 600 }}>Category / 分类</label>
                              <select
                                className="form-input"
                                value={blogCategory}
                                onChange={(e) => setBlogCategory(e.target.value)}
                                style={{ height: '42px', background: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                              >
                                <option value="Caregiver Stories">Caregiver Stories</option>
                                <option value="Accreditation News">Accreditation News</option>
                                <option value="Health Tips">Health Tips</option>
                              </select>
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ color: 'var(--text-main)', fontWeight: 600 }}>Read Time / 阅读时长</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. 5 min read"
                                className="form-input"
                                value={blogReadTime}
                                onChange={(e) => setBlogReadTime(e.target.value)}
                                style={{ height: '42px', background: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ color: 'var(--text-main)', fontWeight: 600 }}>Author / 作者</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. MCSA Editorial"
                                className="form-input"
                                value={blogAuthor}
                                onChange={(e) => setBlogAuthor(e.target.value)}
                                style={{ height: '42px', background: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                              />
                            </div>

                             <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ color: 'var(--text-main)', fontWeight: 600 }}>Cover Image / 封面图片 (URL / Upload)</label>
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  placeholder="Paste image URL or upload file..."
                                  className="form-input"
                                  value={blogCoverImage}
                                  onChange={(e) => setBlogCoverImage(e.target.value)}
                                  style={{ height: '42px', flex: 1, background: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                                />
                                <label
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '42px',
                                    padding: '0 1rem',
                                    background: 'var(--primary-glow)',
                                    color: 'var(--primary)',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    border: '1.5px solid var(--primary)',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  📷 {lang === 'zh' ? '上传照片' : 'Upload'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBlogImageUpload}
                                    style={{ display: 'none' }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Cover Presets */}
                          <div>
                            <label className="form-label" style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.5rem' }}>Select Preset Cover / 精选封面库</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                              {[
                                {
                                  name: 'Elderly Care',
                                  url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&h=400&fit=crop',
                                  desc: 'Seniors, physical rehab'
                                },
                                {
                                  name: 'Confinement Care',
                                  url: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=600&h=400&fit=crop',
                                  desc: 'Newborns, lactation, postpartum'
                                },
                                {
                                  name: 'Patient Companion',
                                  url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&h=400&fit=crop',
                                  desc: 'Hospital escorting, clinics'
                                },
                                {
                                  name: 'Vetting & Exams',
                                  url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&h=400&fit=crop',
                                  desc: 'Accreditation, safety checks'
                                },
                                {
                                  name: 'Babysitter & Mother',
                                  url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&h=400&fit=crop',
                                  desc: 'Infant care, parenting'
                                }
                              ].map((preset) => (
                                <button
                                  key={preset.url}
                                  type="button"
                                  onClick={() => setBlogCoverImage(preset.url)}
                                  style={{
                                    border: blogCoverImage === preset.url ? '2px solid var(--primary)' : '1px solid var(--border)',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    background: blogCoverImage === preset.url ? 'var(--primary-glow)' : 'var(--bg-card)',
                                    padding: '6px 12px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    width: '100%',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <img src={preset.url} alt={preset.name} style={{ width: '45px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{preset.name}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{preset.desc}</div>
                                  </div>
                                  {blogCoverImage === preset.url && (
                                    <span style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>✓</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right side: content */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label className="form-label" style={{ color: 'var(--text-main)', fontWeight: 600 }}>Article Body Content / 文章正文</label>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                              💡 Use double enter/line breaks to separate paragraphs. Use <code>## Heading 2</code> or <code>### Heading 3</code> for subsections.
                            </div>
                            <textarea
                              required
                              placeholder="Start writing the story or news article here..."
                              className="form-input"
                              value={blogContent}
                              onChange={(e) => setBlogContent(e.target.value)}
                              style={{ flex: 1, minHeight: '320px', resize: 'vertical', padding: '12px', fontSize: '0.9rem', lineHeight: '1.5', fontFamily: 'inherit', background: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div style={{
                      padding: '1.25rem 2rem',
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '0.75rem',
                      backgroundColor: 'var(--bg-sidebar)'
                    }}>
                      <button
                        type="button"
                        onClick={resetBlogForm}
                        className="btn btn-outline"
                        style={{ minWidth: '100px', borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'transparent' }}
                      >
                        Cancel / 取消
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                          minWidth: '150px',
                          background: 'var(--primary)',
                          boxShadow: '0 4px 12px var(--primary-glow)'
                        }}
                      >
                        {editBlogId ? 'Save Changes / 保存修改' : 'Publish / 发布文章'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timebank' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div>
                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: 'var(--text-light)' }}>
                  ⏱️ Care Time Bank (关爱时间银行) Manager
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                  Manage community volunteers, approve service hours, and process time-credit reward redemptions.
                </p>
              </div>
            </div>

            {/* Aggregate Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Volunteers / 活跃义工人数</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-light)', fontFamily: 'Outfit, sans-serif' }}>
                  {volunteers.filter(v => v.status === 'Approved').length}
                </span>
              </div>
              
              <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Applications / 待审核义工</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: volunteers.filter(v => v.status === 'Pending').length > 0 ? 'var(--accent)' : 'var(--text-light)', fontFamily: 'Outfit, sans-serif' }}>
                  {volunteers.filter(v => v.status === 'Pending').length}
                </span>
              </div>

              <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Claims / 待审核工时</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: timebankServices.filter(c => c.status === 'Pending').length > 0 ? 'var(--accent)' : 'var(--text-light)', fontFamily: 'Outfit, sans-serif' }}>
                  {timebankServices.filter(c => c.status === 'Pending').length}
                </span>
              </div>

              <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Service Hours / 累计贡献工时</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--health)', fontFamily: 'Outfit, sans-serif' }}>
                  {timebankServices.filter(c => c.status === 'Approved').reduce((acc, curr) => acc + (curr.hours || 0), 0)} H
                </span>
              </div>
            </div>

            {/* Subtab Navigation */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <button
                onClick={() => setTimebankSubTab('volunteers')}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  background: timebankSubTab === 'volunteers' ? 'var(--primary)' : 'transparent',
                  color: timebankSubTab === 'volunteers' ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: timebankSubTab === 'volunteers' ? '0 4px 12px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                👥 Volunteers / 义工审核与名册
              </button>
              <button
                onClick={() => setTimebankSubTab('claims')}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  background: timebankSubTab === 'claims' ? 'var(--primary)' : 'transparent',
                  color: timebankSubTab === 'claims' ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: timebankSubTab === 'claims' ? '0 4px 12px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                ⏱️ Hours Claims / 工时审核 {timebankServices.filter(c => c.status === 'Pending').length > 0 && `(${timebankServices.filter(c => c.status === 'Pending').length})`}
              </button>
              <button
                onClick={() => setTimebankSubTab('redemptions')}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  background: timebankSubTab === 'redemptions' ? 'var(--primary)' : 'transparent',
                  color: timebankSubTab === 'redemptions' ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: timebankSubTab === 'redemptions' ? '0 4px 12px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                🎁 Redemptions / 礼品兑换审核 {timebankRedemptions.filter(r => r.status === 'Pending').length > 0 && `(${timebankRedemptions.filter(r => r.status === 'Pending').length})`}
              </button>
              <button
                onClick={() => setTimebankSubTab('catalog')}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  background: timebankSubTab === 'catalog' ? 'var(--primary)' : 'transparent',
                  color: timebankSubTab === 'catalog' ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: timebankSubTab === 'catalog' ? '0 4px 12px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                🛍️ Reward Catalog / 礼品库管理
              </button>
            </div>

            {/* Subtab Contents */}
            {timebankSubTab === 'volunteers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {/* Vetting Applications */}
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-light)', marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
                    📋 Pending Volunteer Applications / 待审核义工申请
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <th style={{ padding: '0.75rem' }}>Applicant Name</th>
                          <th style={{ padding: '0.75rem' }}>Contact Details</th>
                          <th style={{ padding: '0.75rem' }}>NRIC</th>
                          <th style={{ padding: '0.75rem' }}>Interests / Skills</th>
                          <th style={{ padding: '0.75rem' }}>Applied Date</th>
                          <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {volunteers.filter(v => v.status === 'Pending').length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                              No pending applications. / 暂无待审核申请
                            </td>
                          </tr>
                        ) : (
                          volunteers.filter(v => v.status === 'Pending').map((v) => (
                            <tr key={v.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>{v.name}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ color: 'var(--text-main)' }}>{v.email}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.phone}</div>
                              </td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{v.nric}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                  {v.categories?.map((cat: string) => (
                                    <span key={cat} style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 600 }}>
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{v.joinedDate}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => approveVolunteer(v.id, v.name)}
                                    className="btn btn-primary"
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: 'var(--health)', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    onClick={() => rejectVolunteer(v.id, v.name)}
                                    className="btn btn-outline"
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderColor: 'var(--danger)', color: 'var(--danger)', background: 'transparent', cursor: 'pointer' }}
                                  >
                                    ✗ Decline
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Approved Roster */}
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-light)', marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
                    👥 Active Volunteers Roster / 义工名册
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <th style={{ padding: '0.75rem' }}>Volunteer</th>
                          <th style={{ padding: '0.75rem' }}>Contact Info</th>
                          <th style={{ padding: '0.75rem' }}>Credits / 积分</th>
                          <th style={{ padding: '0.75rem' }}>Rank / 等级</th>
                          <th style={{ padding: '0.75rem' }}>Badges / 勋章</th>
                          <th style={{ padding: '0.75rem' }}>Joined Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {volunteers.filter(v => v.status === 'Approved').length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                              No active volunteers. / 暂无激活义工
                            </td>
                          </tr>
                        ) : (
                          volunteers.filter(v => v.status === 'Approved').map((v) => (
                            <tr key={v.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>{v.name}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ color: 'var(--text-main)' }}>{v.email}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.phone}</div>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{v.credits || 0}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.2rem' }}>credits</span>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <span style={{
                                  fontSize: '0.75rem',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '6px',
                                  fontWeight: 700,
                                  background: v.rank?.includes('Gold') ? 'var(--accent-glow)' : v.rank?.includes('Silver') ? 'rgba(100,116,139,0.1)' : 'rgba(180,83,9,0.05)',
                                  color: v.rank?.includes('Gold') ? 'var(--accent-dark)' : v.rank?.includes('Silver') ? '#334155' : 'var(--accent)'
                                }}>
                                  🏆 {v.rank}
                                </span>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                  {v.badges?.map((badge: string) => (
                                    <span key={badge} style={{ fontSize: '0.7rem', padding: '0.15rem 0.40rem', background: 'var(--bg-input)', color: 'var(--text-main)', borderRadius: '4px', border: '1px solid var(--border)' }}>
                                      🎖️ {badge}
                                    </span>
                                  ))}
                                  {(!v.badges || v.badges.length === 0) && <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>None</span>}
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{v.joinedDate}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {timebankSubTab === 'claims' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {/* Pending Claims */}
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-light)', marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
                    📋 Pending Service Hours Claims / 待审核服务工时申报
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <th style={{ padding: '0.75rem' }}>Volunteer</th>
                          <th style={{ padding: '0.75rem' }}>Activity</th>
                          <th style={{ padding: '0.75rem' }}>Hours</th>
                          <th style={{ padding: '0.75rem' }}>Service Date</th>
                          <th style={{ padding: '0.75rem' }}>Description & Proof</th>
                          <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timebankServices.filter(c => c.status === 'Pending').length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                              No pending claims to approve. / 暂无待审核申报
                            </td>
                          </tr>
                        ) : (
                          timebankServices.filter(c => c.status === 'Pending').map((c) => (
                            <tr key={c.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{c.volunteerName}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.volunteerEmail}</div>
                              </td>
                              <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-light)' }}>{c.activity}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>{c.hours}</span> H
                              </td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{c.date}</td>
                              <td style={{ padding: '0.75rem', maxWidth: '300px', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4' }}>{c.desc}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => approveServiceClaim(c.id, c.volunteerEmail, c.hours, c.activity)}
                                    className="btn btn-primary"
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: 'var(--health)', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    onClick={() => rejectServiceClaim(c.id, c.volunteerEmail)}
                                    className="btn btn-outline"
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderColor: 'var(--danger)', color: 'var(--danger)', background: 'transparent', cursor: 'pointer' }}
                                  >
                                    ✗ Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Claims History */}
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-light)', marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
                    ⏱️ Claims History Log / 工时申报记录历史
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <th style={{ padding: '0.75rem' }}>Volunteer</th>
                          <th style={{ padding: '0.75rem' }}>Activity</th>
                          <th style={{ padding: '0.75rem' }}>Hours</th>
                          <th style={{ padding: '0.75rem' }}>Date</th>
                          <th style={{ padding: '0.75rem' }}>Status</th>
                          <th style={{ padding: '0.75rem' }}>Handled By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timebankServices.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                              No service records found. / 暂无服务申报记录
                            </td>
                          </tr>
                        ) : (
                          timebankServices.map((c) => (
                            <tr key={c.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{c.volunteerName}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.volunteerEmail}</div>
                              </td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{c.activity}</td>
                              <td style={{ padding: '0.75rem', fontWeight: 600 }}>{c.hours} H</td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{c.date}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <span style={{
                                  fontSize: '0.75rem',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '6px',
                                  fontWeight: 700,
                                  background: c.status === 'Approved' ? 'var(--health-glow)' : c.status === 'Rejected' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                                  color: c.status === 'Approved' ? 'var(--health-dark)' : c.status === 'Rejected' ? 'var(--danger)' : 'var(--accent-dark)'
                                }}>
                                  {c.status}
                                </span>
                              </td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{c.approvedBy || '-'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {timebankSubTab === 'redemptions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-light)', marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
                    🎁 Reward Redemptions Registry / 兑换申请管理
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <th style={{ padding: '0.75rem' }}>Volunteer</th>
                          <th style={{ padding: '0.75rem' }}>Reward Title</th>
                          <th style={{ padding: '0.75rem' }}>Cost / 积分花费</th>
                          <th style={{ padding: '0.75rem' }}>Redeemed Date</th>
                          <th style={{ padding: '0.75rem' }}>Status</th>
                          <th style={{ padding: '0.75rem' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timebankRedemptions.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                              No redemption requests found. / 暂无兑换记录
                            </td>
                          </tr>
                        ) : (
                          timebankRedemptions.map((r) => (
                            <tr key={r.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{r.volunteerName}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.volunteerEmail}</div>
                              </td>
                              <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-light)' }}>{r.rewardTitle}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent)' }}>{r.cost}</span> credits
                              </td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{r.date}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <span style={{
                                  fontSize: '0.75rem',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '6px',
                                  fontWeight: 700,
                                  background: r.status === 'Completed' || r.status === 'Completed/Delivered' ? 'var(--health-glow)' : 'rgba(245,158,11,0.08)',
                                  color: r.status === 'Completed' || r.status === 'Completed/Delivered' ? 'var(--health-dark)' : 'var(--accent-dark)'
                                }}>
                                  {r.status}
                                </span>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                {r.status === 'Pending' ? (
                                  <button
                                    onClick={() => completeRedemption(r.id)}
                                    className="btn btn-primary"
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: 'var(--primary)', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                                  >
                                    ✓ Mark Completed
                                  </button>
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Processed</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {timebankSubTab === 'catalog' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-light)', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                      🛍️ Rewards Catalog / 礼品库列表
                    </h3>
                    <button
                      onClick={() => {
                        setEditRewardId(null);
                        setRewardTitle('');
                        setRewardCost(10);
                        setRewardCategory('Course');
                        setRewardPartner('');
                        setRewardDesc('');
                        setShowRewardForm(true);
                      }}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--primary)', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer', borderRadius: '8px' }}
                    >
                      ➕ Add New Reward / 上架新礼品
                    </button>
                  </div>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <th style={{ padding: '0.75rem' }}>Reward Info</th>
                          <th style={{ padding: '0.75rem' }}>Category</th>
                          <th style={{ padding: '0.75rem' }}>Cost / 兑换积分</th>
                          <th style={{ padding: '0.75rem' }}>Partner</th>
                          <th style={{ padding: '0.75rem' }}>Description</th>
                          <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rewards.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                              No rewards in the catalog. / 暂无商品
                            </td>
                          </tr>
                        ) : (
                          rewards.map((rew) => (
                            <tr key={rew.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>{rew.title}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <span style={{
                                  fontSize: '0.72rem',
                                  padding: '0.15rem 0.45rem',
                                  background: 'var(--primary-glow)',
                                  color: 'var(--primary)',
                                  borderRadius: '4px',
                                  fontWeight: 600
                                }}>
                                  {rew.category}
                                </span>
                              </td>
                              <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent)', fontSize: '1.05rem' }}>{rew.cost} H</td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{rew.partner}</td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{rew.desc}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => handleEditReward(rew)}
                                    className="btn btn-outline"
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderColor: 'var(--primary)', color: 'var(--primary)', background: 'transparent', cursor: 'pointer', fontWeight: 700 }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteReward(rew.id, rew.title)}
                                    className="btn btn-outline"
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderColor: 'var(--danger)', color: 'var(--danger)', background: 'transparent', cursor: 'pointer' }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Time Bank Reward Form Modal Overlay */}
      {showRewardForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(11, 19, 41, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            width: '92%',
            maxWidth: '520px',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 2rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-sidebar)',
              color: '#ffffff'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif' }}>
                {editRewardId ? '📝 Edit Reward / 编辑礼品' : '➕ Add New Reward / 上架新礼品'}
              </h3>
              <button 
                onClick={() => setShowRewardForm(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveReward} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Reward Title / 礼品名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RM50 Giant Grocery Voucher"
                  value={rewardTitle}
                  onChange={(e) => setRewardTitle(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-light)',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Cost / 所需积分 *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={rewardCost}
                    onChange={(e) => setRewardCost(Number(e.target.value))}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-light)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Category / 分类 *</label>
                  <select
                    value={rewardCategory}
                    onChange={(e) => setRewardCategory(e.target.value)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-light)',
                      outline: 'none',
                      height: '42px'
                    }}
                  >
                    <option value="Course">Course (课程)</option>
                    <option value="Wellness">Wellness (健康康养)</option>
                    <option value="Voucher">Voucher (礼券)</option>
                    <option value="Product">Product (商品/手册)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Partner / 合作赞助商 *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MCSA Academy / Jaya Grocer"
                  value={rewardPartner}
                  onChange={(e) => setRewardPartner(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-light)',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Description / 礼品描述</label>
                <textarea
                  rows={3}
                  placeholder="Describe the reward details, terms, or how to redeem..."
                  value={rewardDesc}
                  onChange={(e) => setRewardDesc(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-light)',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowRewardForm(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save Reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Credential Vetting Modal Overlay */}
      {selectedMember && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(11, 19, 41, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            width: '92%',
            maxWidth: '1120px',
            height: '85vh',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 2rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-sidebar)',
              color: '#ffffff'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Shield size={22} style={{
                  color: 'var(--accent)'
                }} />
                <div>
                  <h3 style={{
                    margin: 0,
                    color: '#ffffff',
                    fontSize: '1.25rem',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    Member Credential Audit Panel / 成员资质核审面板
                  </h3>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}>
                    Application ID: {selectedMember.id} &bull; Received via MCSA API Vetting Queue
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content - Split Layout */}
            <div style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden'
            }}>
              {/* Left Side: Applicant Summary (35%) */}
              <div style={{
                width: '35%',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                padding: '2rem 1.5rem',
                overflowY: 'auto',
                backgroundColor: '#0f172a',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                {/* Avatar and Badge */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
                    border: '2px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedMember.photo ? (
                      <img 
                        src={selectedMember.photo} 
                        alt={selectedMember.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'white' }}>
                        {selectedMember.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      color: '#ffffff',
                      margin: 0
                    }}>{selectedMember.name}</h4>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      margin: '0.2rem 0 0 0'
                    }}>{selectedMember.email}</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {(selectedMember.category || '').split(',').map((catStr: string, idx: number) => {
                      const cat = catStr.trim();
                      return (
                        <span key={idx} className="badge badge-pending" style={{
                          padding: '0.4rem 0.95rem',
                          borderRadius: '20px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          margin: 0
                        }}>
                          {cat === 'Confinement Care' && 'Confinement Care / 月嫂 / 坐月护理'}
                          {cat === 'Patient Companion' && 'Patient Companion / 陪诊员 / 就医陪诊'}
                          {cat === 'Elderly Caregiver' && 'Elderly Caregiver / 养老护理员'}
                          {cat === 'Rehabilitation Care Assistant' && 'Rehabilitation Care Assistant / 康复助理'}
                          {cat === 'Babysitter Service' && 'Babysitter Service / 专业保姆'}
                          {!['Confinement Care', 'Patient Companion', 'Elderly Caregiver', 'Rehabilitation Care Assistant', 'Babysitter Service'].includes(cat) && cat}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <hr style={{
                  border: '0',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  margin: '0.5rem 0'
                }} />

                {/* Quick Metrics */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  fontSize: '0.9rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      color: 'var(--text-muted)'
                    }}>Experience:</span>
                    <strong style={{
                      color: '#ffffff'
                    }}>{selectedMember.exp}</strong>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      color: 'var(--text-muted)'
                    }}>Location:</span>
                    <strong style={{
                      color: '#ffffff',
                      textAlign: 'right'
                    }}>{selectedMember.location}</strong>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      color: 'var(--text-muted)'
                    }}>Phone:</span>
                    <strong style={{
                      color: '#ffffff'
                    }}>{selectedMember.phone}</strong>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      color: 'var(--text-muted)'
                    }}>NRIC / ID:</span>
                    <strong style={{
                      color: 'var(--accent)',
                      fontFamily: 'monospace'
                    }}>{selectedMember.nric || 'N/A'}</strong>
                  </div>
                </div>

                <hr style={{
                  border: '0',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  margin: '0.5rem 0'
                }} />

                {/* Biography */}
                <div>
                  <h5 style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Applicant Statement / 申请陈述
                  </h5>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: '1.5',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.04)',
                    margin: 0
                  }}>
                    "{selectedMember.bio}"
                  </p>
                </div>

                {/* Vetting Checklist */}
                <div style={{
                  marginTop: 'auto'
                }}>
                  <h5 style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Vetting Verification Checklist / 核审清单
                  </h5>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: docTab === 'icDoc' ? 'var(--accent)' : 'var(--health)'
                    }}>
                      {docTab === 'icDoc' ? <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid var(--accent)',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}></span> : <CheckCircle2 size={16} />}
                      <span>Identity / NRIC Match Verified</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: docTab === 'cert' ? 'var(--accent)' : 'var(--health)'
                    }}>
                      {docTab === 'cert' ? <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid var(--accent)',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}></span> : <CheckCircle2 size={16} />}
                      <span>Professional Qualification Audited</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: docTab === 'health' ? 'var(--accent)' : 'var(--health)'
                    }}>
                      {docTab === 'health' ? <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid var(--accent)',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}></span> : <CheckCircle2 size={16} />}
                      <span>Health & TB Vetting Vouching</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Document Preview (65%) */}
              <div style={{
                width: '65%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: '#111827'
              }}>
                {/* Tab Selector */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  padding: '0.5rem 1rem 0 1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  gap: '0.25rem'
                }}>
                  <button
                    onClick={() => setDocTab('icDoc')}
                    style={{
                      padding: '0.85rem 1.25rem',
                      border: 'none',
                      background: docTab === 'icDoc' ? 'var(--bg-card)' : 'transparent',
                      borderRadius: '12px 12px 0 0',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: docTab === 'icDoc' ? 'var(--text-light)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      borderTop: docTab === 'icDoc' ? '3px solid var(--primary)' : '3px solid transparent',
                      marginTop: '-3px',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🛡️ ID Card / IC Copy
                  </button>
                  <button
                    onClick={() => setDocTab('cert')}
                    style={{
                      padding: '0.85rem 1.25rem',
                      border: 'none',
                      background: docTab === 'cert' ? 'var(--bg-card)' : 'transparent',
                      borderRadius: '12px 12px 0 0',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: docTab === 'cert' ? 'var(--text-light)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      borderTop: docTab === 'cert' ? '3px solid var(--primary)' : '3px solid transparent',
                      marginTop: '-3px',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    📜 Qualification Certificate
                  </button>
                  <button
                    onClick={() => setDocTab('health')}
                    style={{
                      padding: '0.85rem 1.25rem',
                      border: 'none',
                      background: docTab === 'health' ? 'var(--bg-card)' : 'transparent',
                      borderRadius: '12px 12px 0 0',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: docTab === 'health' ? 'var(--text-light)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      borderTop: docTab === 'health' ? '3px solid var(--primary)' : '3px solid transparent',
                      marginTop: '-3px',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🏥 Health Clearance
                  </button>
                </div>

                {/* Tab Content Box */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '2.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start'
                }}>
                  {docTab === 'icDoc' ? (
                    selectedMember.icDocData ? (
                      /* User Uploaded IC Document Preview */
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: '#1f2937', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Uploaded NRIC / IC Document Copy: <strong style={{ color: 'white' }}>{selectedMember.icDoc}</strong></span>
                        {selectedMember.icDocData.startsWith('data:image/') ? (
                          <img src={selectedMember.icDocData} alt={selectedMember.icDoc} style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'contain' }} />
                        ) : (
                          <iframe src={selectedMember.icDocData} title={selectedMember.icDoc} style={{ width: '100%', height: '420px', borderRadius: '8px', border: 'none', background: 'white' }} />
                        )}
                        <a href={selectedMember.icDocData} download={selectedMember.icDoc} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                          📥 Download ID Document
                        </a>
                      </div>
                    ) : (
                      /* Malaysian NRIC MyKad CSS Render */
                      <div style={{
                        width: '100%',
                        maxWidth: '520px',
                        aspectRatio: '1.586',
                        background: 'linear-gradient(135deg, #a5f3fc 0%, #0ea5e9 50%, #0369a1 100%)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        position: 'relative',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: '#0f172a',
                        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflow: 'hidden'
                      }}>
                        {/* Background wave decorations */}
                        <div style={{
                          position: 'absolute',
                          top: '-20%',
                          left: '-20%',
                          width: '140%',
                          height: '140%',
                          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                          pointerEvents: 'none'
                        }}></div>

                        {/* Top Bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(15,23,42,0.15)', paddingBottom: '0.5rem', zIndex: 1 }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', color: '#03396c' }}>MALAYSIA</h4>
                            <span style={{ fontSize: '0.55rem', fontWeight: 600, color: '#03396c', letterSpacing: '0.05em' }}>KAD PENGENALAN</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {/* Small Malaysian flag emblem */}
                            <div style={{ width: '24px', height: '14px', background: 'linear-gradient(to bottom, #1e3a8a 50%, #b91c1c 50%)', border: '1px solid rgba(255,255,255,0.5)', position: 'relative', overflow: 'hidden' }}>
                              <div style={{ width: '12px', height: '7px', backgroundColor: '#1e3a8a', position: 'absolute', top: 0, left: 0 }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Middle Content */}
                        <div style={{ display: 'flex', gap: '1.25rem', flex: 1, marginTop: '0.75rem', zIndex: 1 }}>
                          {/* Left: Chip, NRIC, Name, Address */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {/* Chip */}
                            <div style={{ 
                              width: '45px', 
                              height: '35px', 
                              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)', 
                              borderRadius: '6px',
                              border: '1px solid rgba(0,0,0,0.15)',
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
                              position: 'relative'
                            }}>
                              {/* Chip lines */}
                              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(0,0,0,0.2)' }}></div>
                              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(0,0,0,0.2)' }}></div>
                            </div>

                            {/* NRIC */}
                            <div>
                              <div style={{ fontSize: '0.55rem', color: 'rgba(15,23,42,0.6)', fontWeight: 600 }}>NO. KAD PENGENALAN</div>
                              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.05em', fontFamily: 'monospace' }}>
                                {selectedMember.nric || 'N/A'}
                              </div>
                            </div>

                            {/* Name */}
                            <div>
                              <div style={{ fontSize: '0.55rem', color: 'rgba(15,23,42,0.6)', fontWeight: 600 }}>NAMA</div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', lineHeight: 1.2 }}>
                                {selectedMember.name}
                              </div>
                            </div>

                            {/* Citizen / Warganegara */}
                            <div style={{ marginTop: 'auto' }}>
                              <span style={{ fontSize: '0.6rem', fontWeight: 700, backgroundColor: 'rgba(3,57,108,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(3,57,108,0.2)', color: '#03396c' }}>
                                WARGANEGARA / CITIZEN
                              </span>
                            </div>
                          </div>

                          {/* Right: Photo */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <div style={{ 
                              width: '95px', 
                              height: '115px', 
                              borderRadius: '6px', 
                              border: '2px solid rgba(255,255,255,0.8)', 
                              boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                              overflow: 'hidden',
                              backgroundColor: '#e2e8f0'
                            }}>
                              <img 
                                src={selectedMember.photo} 
                                alt={selectedMember.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'/%3E%3C/svg%3E";
                                }}
                              />
                            </div>
                            
                            {/* Small ghost photo at bottom right */}
                            <div style={{ 
                              width: '32px', 
                              height: '38px', 
                              borderRadius: '3px', 
                              opacity: 0.35, 
                              overflow: 'hidden',
                              alignSelf: 'flex-end',
                              marginRight: '0.25rem',
                              filter: 'contrast(1.2) brightness(0.9) grayscale(1)'
                            }}>
                              <img 
                                src={selectedMember.photo} 
                                alt="Ghost Copy" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'/%3E%3C/svg%3E";
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Audit Stamp Overlay */}
                        <div style={{
                          position: 'absolute',
                          top: '25%',
                          left: '15%',
                          border: '4px solid #16a34a',
                          color: '#16a34a',
                          padding: '0.4rem 1rem',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          transform: 'rotate(-10deg)',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(240, 253, 250, 0.9)',
                          pointerEvents: 'none',
                          zIndex: 2,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                          🛡️ IDENTITY VERIFIED
                        </div>
                      </div>
                    )
                  ) : docTab === 'cert' ? (
                    selectedMember.proofData ? (
                      /* User Uploaded Certificate Preview */
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: '#1f2937', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Uploaded Professional Qualification: <strong style={{ color: 'white' }}>{selectedMember.proof}</strong></span>
                        {selectedMember.proofData.startsWith('data:image/') ? (
                          <img src={selectedMember.proofData} alt={selectedMember.proof} style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'contain' }} />
                        ) : (
                          <iframe src={selectedMember.proofData} title={selectedMember.proof} style={{ width: '100%', height: '420px', borderRadius: '8px', border: 'none', background: 'white' }} />
                        )}
                        <a href={selectedMember.proofData} download={selectedMember.proof} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                          📥 Download Certificate
                        </a>
                      </div>
                    ) : (
                      /* Professional Certificate CSS Render */
                      <div style={{
                        width: '100%',
                        maxWidth: '640px',
                        background: 'linear-gradient(135deg, #fdfbf7 0%, #f6f1e5 100%)',
                        border: '15px double #c5a880',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                        padding: '3rem 2rem',
                        borderRadius: '8px',
                        position: 'relative',
                        textAlign: 'center',
                        color: '#3e2723',
                        fontFamily: 'Outfit, Georgia, serif'
                      }}>
                        {/* Vintage Corner Accents */}
                        <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '2px solid #c5a880', borderLeft: '2px solid #c5a880' }}></div>
                        <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderTop: '2px solid #c5a880', borderRight: '2px solid #c5a880' }}></div>
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '20px', borderBottom: '2px solid #c5a880', borderLeft: '2px solid #c5a880' }}></div>
                        <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderBottom: '2px solid #c5a880', borderRight: '2px solid #c5a880' }}></div>

                        {/* Ribbon Logo */}
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#c5a880' }}>🏅</div>

                        <h4 style={{
                          fontSize: '1.1rem',
                          letterSpacing: '0.1em',
                          color: '#5d4037',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          margin: '0 0 0.5rem 0',
                          fontFamily: 'Outfit, sans-serif'
                        }}>
                          Malaysia Care & Confinement Board
                        </h4>
                        <p style={{
                          fontSize: '0.75rem',
                          letterSpacing: '0.05em',
                          color: '#8d6e63',
                          fontStyle: 'italic',
                          margin: '0 0 2rem 0'
                        }}>
                          Accredited Caregiver Guild of MultiCare Support Malaysia Union
                        </p>

                        <h2 style={{
                          fontSize: '1.8rem',
                          color: '#3e2723',
                          fontWeight: 'bold',
                          margin: '0 0 1rem 0',
                          fontFamily: 'Outfit, sans-serif'
                        }}>
                          Certificate of Competency
                        </h2>
                        
                        <p style={{
                          fontSize: '0.9rem',
                          color: '#5d4037',
                          margin: '0 0 1.5rem 0'
                        }}>
                          This professional qualification is awarded to
                        </p>

                        <h3 style={{
                          fontSize: '1.6rem',
                          fontFamily: 'Georgia, serif',
                          textDecoration: 'underline',
                          color: '#1e3a8a',
                          margin: '0 0 1.5rem 0',
                          fontWeight: 'bold'
                        }}>
                          {selectedMember.name}
                        </h3>

                        <p style={{
                          fontSize: '0.85rem',
                          lineHeight: '1.6',
                          color: '#5d4037',
                          maxWidth: '480px',
                          margin: '0 auto 2rem auto'
                        }}>
                          having demonstrated exceptional knowledge, compliance, and clinical hours in:
                          <br />
                          <strong style={{
                            color: '#1e3a8a',
                            fontSize: '1.05rem'
                          }}>
                            {(selectedMember.category || '').split(',').map((catStr: string) => {
                              const cat = catStr.trim();
                              if (cat === 'Confinement Care') return 'Confinement Care & Neonatal Support (月嫂 / 坐月护理)';
                              if (cat === 'Patient Companion') return 'Patient Medical Accompaniment & Clinic Protocol (就医陪诊 / 陪诊员)';
                              if (cat === 'Elderly Caregiver') return 'Geriatric Support & Elder Care Management (养老护理)';
                              if (cat === 'Rehabilitation Care Assistant') return 'Rehabilitation Care Assistant (康复助理)';
                              if (cat === 'Babysitter Service') return 'Babysitter Service & Infant/Child Care (专业保姆)';
                              return cat;
                            }).join(' & ')}
                          </strong>
                          <br />
                          and meeting all training milestones required by MCSA Union policies.
                        </p>

                        {/* Footer of Certificate */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '1.5rem',
                          padding: '0 1rem'
                        }}>
                          <div style={{
                            textAlign: 'left'
                          }}>
                            <div style={{
                              fontSize: '0.8rem',
                              fontFamily: 'Georgia, serif',
                              fontStyle: 'italic',
                              textDecoration: 'underline'
                            }}>Dr. Raymond Chen</div>
                            <div style={{
                              fontSize: '0.65rem',
                              color: '#8d6e63'
                            }}>Guild Registry Director</div>
                          </div>

                          {/* Red Gold Seal */}
                          <div style={{
                            width: '75px',
                            height: '75px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, #e53935 0%, #b71c1c 100%)',
                            border: '3px dotted #c5a880',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#c5a880',
                            fontSize: '0.55rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                            transform: 'rotate(-5deg)'
                          }}>
                            <span>MCSA</span>
                            <span>VERIFIED</span>
                            <span style={{
                              fontSize: '0.45rem'
                            }}>2026</span>
                          </div>

                          <div style={{
                            textAlign: 'right'
                          }}>
                            <div style={{
                              fontSize: '0.7rem',
                              fontWeight: 'bold'
                            }}>MCSA-GP-{selectedMember.id}</div>
                            <div style={{
                              fontSize: '0.65rem',
                              color: '#8d6e63'
                            }}>License Expiry: May 2027</div>
                          </div>
                        </div>

                        {/* Audit Overlay Stamp */}
                        <div style={{
                          position: 'absolute',
                          top: '15%',
                          right: '10%',
                          border: '4px solid #2e7d32',
                          color: '#2e7d32',
                          padding: '0.5rem 1rem',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          transform: 'rotate(15deg)',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(232, 245, 233, 0.85)',
                          pointerEvents: 'none'
                        }}>
                          ✅ CREDENTIAL MATCH
                        </div>
                      </div>
                    )
                  ) : (
                    selectedMember.healthCertData ? (
                      /* User Uploaded Health Report Preview */
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: '#1f2937', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Uploaded Health Diagnostics: <strong style={{ color: 'white' }}>{selectedMember.healthCert}</strong></span>
                        {selectedMember.healthCertData.startsWith('data:image/') ? (
                          <img src={selectedMember.healthCertData} alt={selectedMember.healthCert} style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'contain' }} />
                        ) : (
                          <iframe src={selectedMember.healthCertData} title={selectedMember.healthCert} style={{ width: '100%', height: '420px', borderRadius: '8px', border: 'none', background: 'white' }} />
                        )}
                        <a href={selectedMember.healthCertData} download={selectedMember.healthCert} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                          📥 Download Health Record
                        </a>
                      </div>
                    ) : (
                      /* Health Screening Report CSS Render */
                      <div style={{
                        width: '100%',
                        maxWidth: '640px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                        padding: '2.5rem 2rem',
                        borderRadius: '8px',
                        color: '#1e293b',
                        fontFamily: 'monospace, Courier, monospace'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderBottom: '2px solid #0284c7',
                          paddingBottom: '1rem',
                          marginBottom: '1.5rem'
                        }}>
                          <div>
                            <h3 style={{
                              margin: 0,
                              color: '#0284c7',
                              fontFamily: 'monospace',
                              fontSize: '1.1rem',
                              fontWeight: 'bold'
                            }}>
                              🏥 CLINICAL HEALTH AUDIT SHEET
                            </h3>
                            <p style={{
                              margin: 0,
                              fontSize: '0.7rem',
                              color: '#64748b'
                            }}>
                              Poliklinik & Surgeri Union-Cares Group Malaysia
                            </p>
                          </div>
                          <div style={{
                            textAlign: 'right',
                            fontSize: '0.7rem',
                            color: '#64748b'
                          }}>
                            <div>Report Ref: HSR-2026-{selectedMember.id}</div>
                            <div>Date: 12th May 2026</div>
                          </div>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.75rem',
                          fontSize: '0.8rem',
                          marginBottom: '1.5rem',
                          backgroundColor: '#f8fafc',
                          padding: '0.75rem',
                          borderRadius: '6px'
                        }}>
                          <div><strong>Patient Name:</strong> {selectedMember.name}</div>
                          <div><strong>Application Cat:</strong> {selectedMember.category}</div>
                          <div><strong>Vetting Protocol:</strong> MCSA Guild Form 4B</div>
                          <div><strong>Status:</strong> COMPLETED & VOUCHED</div>
                        </div>

                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '0.8rem',
                          marginBottom: '2rem'
                        }}>
                          <thead>
                            <tr style={{
                              borderBottom: '2px solid #cbd5e1',
                              color: '#64748b'
                            }}>
                              <th style={{
                                textAlign: 'left',
                                padding: '0.5rem 0'
                              }}>SCREENING PROTOCOL PANEL</th>
                              <th style={{
                                textAlign: 'center',
                                padding: '0.5rem 0'
                              }}>RESULT</th>
                              <th style={{
                                textAlign: 'right',
                                padding: '0.5rem 0'
                              }}>VETTING STATUS</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{
                              borderBottom: '1px solid #f1f5f9'
                            }}>
                              <td style={{
                                padding: '0.75rem 0'
                              }}>1. Chest X-Ray (Tuberculosis Screening)</td>
                              <td style={{
                                textAlign: 'center',
                                color: '#15803d',
                                fontWeight: 'bold'
                              }}>CLEAR</td>
                              <td style={{
                                textAlign: 'right',
                                color: '#15803d'
                              }}>PASS &bull; Negative TB</td>
                            </tr>
                            <tr style={{
                              borderBottom: '1px solid #f1f5f9'
                            }}>
                              <td style={{
                                padding: '0.75rem 0'
                              }}>2. Hepatitis B Antigen (HBsAg)</td>
                              <td style={{
                                textAlign: 'center',
                                color: '#15803d',
                                fontWeight: 'bold'
                              }}>NON-REACTIVE</td>
                              <td style={{
                                textAlign: 'right',
                                color: '#15803d'
                              }}>PASS &bull; Immunized</td>
                            </tr>
                            <tr style={{
                              borderBottom: '1px solid #f1f5f9'
                            }}>
                              <td style={{
                                padding: '0.75rem 0'
                              }}>3. Typhoid Vaccination Status (Valid to 2029)</td>
                              <td style={{
                                textAlign: 'center',
                                color: '#15803d',
                                fontWeight: 'bold'
                              }}>ACTIVE</td>
                              <td style={{
                                textAlign: 'right',
                                color: '#15803d'
                              }}>PASS &bull; Compliant</td>
                            </tr>
                            <tr style={{
                              borderBottom: '1px solid #f1f5f9'
                            }}>
                              <td style={{
                                padding: '0.75rem 0'
                              }}>4. Physical & Psychiatric Health Assessment</td>
                              <td style={{
                                textAlign: 'center',
                                color: '#15803d',
                                fontWeight: 'bold'
                              }}>NORMAL</td>
                              <td style={{
                                textAlign: 'right',
                                color: '#15803d'
                              }}>PASS &bull; Fit for Care</td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Medical Sign-off */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                          fontSize: '0.75rem'
                        }}>
                          <div>
                            <div style={{
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              color: '#94a3b8'
                            }}>
                              [ Signed digitally: Dr. J. Tan ]
                            </div>
                            <div style={{
                              borderTop: '1px solid #cbd5e1',
                              paddingTop: '0.25rem'
                            }}>
                              <strong>Dr. Jeffrey Tan</strong>
                              <div style={{
                                fontSize: '0.65rem',
                                color: '#64748b'
                              }}>MMC Registered Practitioner #45892</div>
                            </div>
                          </div>
                          
                          <div style={{
                            border: '3px solid #16a34a',
                            color: '#16a34a',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            transform: 'rotate(-5deg)',
                            backgroundColor: 'rgba(240, 253, 250, 0.85)'
                          }}>
                            🩺 HEALTH VETTED
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.25rem 2rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-sidebar)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)'
              }}>
                <span>Audited Category:</span>
                <strong style={{
                  color: 'var(--accent)'
                }}>
                  {(selectedMember.category || '').split(',').map((catStr: string) => {
                    const cat = catStr.trim();
                    if (cat === 'Confinement Care') return 'Confinement Care Specialist (月嫂 / 坐月)';
                    if (cat === 'Patient Companion') return 'Patient Companion (陪诊员 / 陪诊)';
                    if (cat === 'Elderly Caregiver') return 'Elderly Caregiver (养老护理员)';
                    if (cat === 'Rehabilitation Care Assistant') return 'Rehabilitation Care Assistant (康复助理)';
                    if (cat === 'Babysitter Service') return 'Babysitter Service Specialist (专业保姆)';
                    return cat;
                  }).join(', ')}
                </strong>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '0.75rem'
              }}>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="btn btn-outline"
                  style={{
                    minWidth: '100px',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'var(--text-muted)'
                  }}
                >
                  Close / 关闭
                </button>
                <button 
                  onClick={() => {
                    rejectMember(selectedMember.id, selectedMember.name);
                    setSelectedMember(null);
                  }}
                  className="btn btn-outline"
                  style={{
                    borderColor: 'var(--danger)',
                    color: 'var(--danger)'
                  }}
                >
                  <X size={16} /> Decline / 拒绝
                </button>
                <button 
                  onClick={() => {
                    approveMember(selectedMember.id, selectedMember.name);
                    setSelectedMember(null);
                  }}
                  className="btn btn-primary"
                  style={{
                    background: 'var(--health)',
                    boxShadow: '0 4px 12px var(--health-glow)'
                  }}
                >
                  <Check size={16} /> Approve & Generate MCSA Member ID
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedUnionCard && (
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
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontWeight: 800 }}>
              MCSA Digital Membership Card / 会员卡预览
            </h3>

            {/* Card Render */}
            <div className="union-member-card admin-theme">
              {/* Glowing highlight reflection */}
              <div className="union-member-card-glow"></div>

              <div className="union-member-card-header">
                <div>
                  <h3 className="union-member-card-title">
                    MULTICARE SUPPORT UNION
                  </h3>
                  <span className="union-member-card-subtitle">
                    MCSA MALAYSIA VALIDATED REGISTRY
                  </span>
                </div>
                <div className="union-member-card-logo-container">
                  {(selectedUnionCard?.category || '').includes('Patient Companion') && (
                    <img 
                      src="/aplus-assist-logo.jpg" 
                      alt="A+ Assist Logo" 
                      className="union-member-card-logo aplus" 
                    />
                  )}
                  <img 
                    src="/mcsa-logo.png" 
                    alt="MCSA Logo" 
                    className="union-member-card-logo" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              
              <div className="union-member-card-body">
                <div className="union-member-card-photo-frame">
                  <img 
                    src={selectedUnionCard.photo} 
                    alt={selectedUnionCard.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div className="union-member-card-photo-tag">
                    PHOTO ID
                  </div>
                </div>

                <div className="union-member-card-info-col">
                  <div>
                    <span className="union-member-card-label">
                      Membership ID
                    </span>
                    <span className="union-member-card-val-id">
                      {selectedUnionCard.member_number}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '3.6cqw' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="union-member-card-label">Specialty Roles</span>
                      <span className="union-member-card-val-spec">
                        {selectedUnionCard.category}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="union-member-card-label">NRIC / ID No.</span>
                      <span className="union-member-card-val-mono">
                        {selectedUnionCard.nric || '830812-14-5544'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="union-member-card-footer">
                <div className="union-member-card-footer-item">
                  <span className="union-member-card-label">Holder Name</span>
                  <span className="union-member-card-val-text">{selectedUnionCard.name}</span>
                </div>
                
                <div className="union-member-card-status-stamp admin-style">
                  ✓ ACTIVE
                </div>

                <div className="union-member-card-footer-item" style={{ textAlign: 'right' }}>
                  <span className="union-member-card-label">Expiration</span>
                  <span className="union-member-card-val-mono">{selectedUnionCard.expiry}</span>
                </div>
              </div>
            </div>

            <div style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              background: 'var(--primary-light)',
              border: '1px solid var(--border)',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Contribution Compliance / 奉献达标率:</span>
                <strong style={{ color: 'var(--text-light)' }}>
                  {selectedUnionCard.contributionCompliance !== undefined ? selectedUnionCard.contributionCompliance : 100}%
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Dispatch Priority / 派单优先级:</span>
                {(() => {
                  const comp = selectedUnionCard.contributionCompliance !== undefined ? selectedUnionCard.contributionCompliance : 100;
                  if (comp >= 90) return <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--health)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>⚡ High Priority / 优先派单</span>;
                  if (comp >= 50) return <span className="badge" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent)', border: '1px solid rgba(37, 99, 235, 0.2)', fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>✔️ Standard / 正常派单</span>;
                  if (comp > 0) return <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>⚠️ Low / 限流派单</span>;
                  return <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>🚫 Restricted / 限制派单</span>;
                })()}
              </div>
            </div>

            <button 
              onClick={() => setSelectedUnionCard(null)} 
              className="btn btn-primary"
              style={{ width: '100%', height: '42px' }}
            >
              Close / 关闭
            </button>
          </div>
        </div>
      )}

      {selectedMockIC && (
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
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '2rem',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontWeight: 800 }}>
              Malaysian MyKad ID Preview / 身份证预览
            </h3>

            {/* Card Render */}
            <div style={{
              width: '100%',
              maxWidth: '520px',
              aspectRatio: '1.586',
              background: 'linear-gradient(135deg, #a5f3fc 0%, #0ea5e9 50%, #0369a1 100%)',
              borderRadius: '16px',
              padding: '1.5rem',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#0f172a',
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-20%',
                width: '140%',
                height: '140%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                pointerEvents: 'none'
              }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(15,23,42,0.15)', paddingBottom: '0.5rem', zIndex: 1 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', color: '#03396c' }}>MALAYSIA</h4>
                  <span style={{ fontSize: '0.55rem', fontWeight: 600, color: '#03396c', letterSpacing: '0.05em' }}>KAD PENGENALAN</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: '24px', height: '14px', background: 'linear-gradient(to bottom, #1e3a8a 50%, #b91c1c 50%)', border: '1px solid rgba(255,255,255,0.5)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: '12px', height: '7px', backgroundColor: '#1e3a8a', position: 'absolute', top: 0, left: 0 }}></div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', flex: 1, marginTop: '0.75rem', zIndex: 1 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '45px', 
                    height: '35px', 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)', 
                    borderRadius: '6px',
                    border: '1px solid rgba(0,0,0,0.15)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
                    position: 'relative'
                  }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(0,0,0,0.2)' }}></div>
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(0,0,0,0.2)' }}></div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(15,23,42,0.6)', fontWeight: 600 }}>NO. KAD PENGENALAN</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.05em', fontFamily: 'monospace' }}>
                      {selectedMockIC.nric || 'N/A'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(15,23,42,0.6)', fontWeight: 600 }}>NAMA</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', lineHeight: 1.2 }}>
                      {selectedMockIC.name}
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, backgroundColor: 'rgba(3,57,108,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(3,57,108,0.2)', color: '#03396c' }}>
                      WARGANEGARA / CITIZEN
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '95px', 
                    height: '115px', 
                    borderRadius: '6px', 
                    border: '2px solid rgba(255,255,255,0.8)', 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                    overflow: 'hidden',
                    backgroundColor: '#e2e8f0'
                  }}>
                    <img 
                      src={selectedMockIC.photo} 
                      alt={selectedMockIC.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  
                  <div style={{ 
                    width: '32px', 
                    height: '38px', 
                    borderRadius: '3px', 
                    opacity: 0.35, 
                    overflow: 'hidden',
                    alignSelf: 'flex-end',
                    marginRight: '0.25rem',
                    filter: 'contrast(1.2) brightness(0.9) grayscale(1)'
                  }}>
                    <img 
                      src={selectedMockIC.photo} 
                      alt="Ghost Copy" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{
                position: 'absolute',
                top: '25%',
                left: '15%',
                border: '4px solid #16a34a',
                color: '#16a34a',
                padding: '0.4rem 1rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                transform: 'rotate(-10deg)',
                borderRadius: '6px',
                backgroundColor: 'rgba(240, 253, 250, 0.9)',
                pointerEvents: 'none',
                zIndex: 2,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                🛡️ IDENTITY VERIFIED
              </div>
            </div>

            <button 
              onClick={() => setSelectedMockIC(null)} 
              className="btn btn-primary"
              style={{ width: '100%', height: '42px' }}
            >
              Close / 关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
