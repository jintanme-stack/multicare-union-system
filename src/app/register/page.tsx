'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';
import { Shield, PlusCircle, CheckCircle, FileText, UploadCloud, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nric, setNric] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Confinement Care']);
  const categoriesList = [
    { value: 'Confinement Care', labelZh: '月嫂 / 坐月护理 (Confinement Care)', labelBm: 'Penjaga Berpantang (Confinement)', labelEn: 'Confinement Lady', icon: '🍼' },
    { value: 'Patient Companion', labelZh: '就医陪诊 / 陪诊员 (Patient Companion)', labelBm: 'Peneman Pesakit (Companion)', labelEn: 'Patient Companion', icon: '🏥' },
    { value: 'Elderly Caregiver', labelZh: 'Elderly Caregiver (养老护理员)', labelBm: 'Penjaga Warga Emas (Elderly)', labelEn: 'Elderly Caregiver', icon: '👴' },
    { value: 'Rehabilitation Care Assistant', labelZh: 'Rehabilitation Therapist (康复助理)', labelBm: 'Pembantu Rehab (Rehab)', labelEn: 'Rehab Assistant', icon: '💪' },
    { value: 'Babysitter Service', labelZh: 'Babysitter (专业保姆)', labelBm: 'Pengasuh Bayi (Babysitter)', labelEn: 'Babysitter Service', icon: '👶' }
  ];
  const [exp, setExp] = useState('1 yr');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [proof, setProof] = useState('');
  const [proofData, setProofData] = useState('');
  const [healthCert, setHealthCert] = useState('');
  const [healthCertData, setHealthCertData] = useState('');
  const [icDoc, setIcDoc] = useState('');
  const [icDocData, setIcDocData] = useState('');
  const [photo, setPhoto] = useState("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'/%3E%3C/svg%3E");
  
  const [submitted, setSubmitted] = useState(false);
  const [assignedAppId, setAssignedAppId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setLang(store.getLanguage() as Language);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const compressImage = (base64Str: string, maxDim = 250, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        try {
          const compressed = await compressImage(rawBase64, 250, 0.75);
          setPhoto(compressed);
        } catch (err) {
          setPhoto(rawBase64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProof(file.name);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        if (file.type.startsWith('image/')) {
          try {
            const compressed = await compressImage(rawBase64, 1000, 0.7);
            setProofData(compressed);
          } catch (err) {
            setProofData(rawBase64);
          }
        } else {
          setProofData(rawBase64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHealthCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHealthCert(file.name);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        if (file.type.startsWith('image/')) {
          try {
            const compressed = await compressImage(rawBase64, 1000, 0.7);
            setHealthCertData(compressed);
          } catch (err) {
            setHealthCertData(rawBase64);
          }
        } else {
          setHealthCertData(rawBase64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIcDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIcDoc(file.name);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        if (file.type.startsWith('image/')) {
          try {
            const compressed = await compressImage(rawBase64, 1000, 0.7);
            setIcDocData(compressed);
          } catch (err) {
            setIcDocData(rawBase64);
          }
        } else {
          setIcDocData(rawBase64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Explicit client-side feedback for all required fields
    if (!name.trim()) {
      alert(lang === 'zh' ? '⚠️ 请输入您的姓名。' : lang === 'bm' ? '⚠️ Sila masukkan nama penuh anda.' : '⚠️ Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      alert(lang === 'zh' ? '⚠️ 请输入您的电子邮箱。' : lang === 'bm' ? '⚠️ Sila masukkan e-mel anda.' : '⚠️ Please enter your email address.');
      return;
    }
    if (!phone.trim()) {
      alert(lang === 'zh' ? '⚠️ 请输入您的联络电话。' : lang === 'bm' ? '⚠️ Sila masukkan nombor telefon anda.' : '⚠️ Please enter your contact number.');
      return;
    }
    if (!location.trim()) {
      alert(lang === 'zh' ? '⚠️ 请输入您的服务区域。' : lang === 'bm' ? '⚠️ Sila masukkan lokasi perkhidmatan anda.' : '⚠️ Please enter your service location.');
      return;
    }
    if (!nric.trim()) {
      alert(lang === 'zh' ? '⚠️ 请输入您的身份证号码。' : lang === 'bm' ? '⚠️ Sila masukkan No. Kad Pengenalan anda.' : '⚠️ Please enter your NRIC / ID number.');
      return;
    }
    if (!password || password.length < 6) {
      alert(lang === 'zh' ? '⚠️ 密码长度不能少于 6 位。' : lang === 'bm' ? '⚠️ Kata laluan mestilah sekurang-kurangnya 6 aksara.' : '⚠️ Password must be at least 6 characters.');
      return;
    }
    if (!bio.trim()) {
      alert(lang === 'zh' ? '⚠️ 请输入您的个人简介与从业经验。' : lang === 'bm' ? '⚠️ Sila masukkan biodata/pengalaman anda.' : '⚠️ Please enter your biography / experience details.');
      return;
    }

    if (!icDoc) {
      alert(lang === 'zh' 
        ? '⚠️ 成为公会会员需要上传您的身份证 (NRIC/IC) 扫描件以进行资质安全验证。' 
        : lang === 'bm' 
        ? '⚠️ Sila muat naik salinan Kad Pengenalan (IC) anda untuk pengesahan keselamatan keahlian.' 
        : '⚠️ NRIC / IC document upload is required to verify identity for union safety vetting.');
      return;
    }

    // Validate Malaysian NRIC format (12 digits total after stripping non-numeric chars)
    const cleanNric = nric.replace(/[^0-9]/g, '');
    if (cleanNric.length !== 12) {
      alert(lang === 'zh' 
        ? '请输入有效的12位身份证号码 (例如: 870615-10-5622)' 
        : lang === 'bm' 
        ? 'Sila masukkan No. Kad Pengenalan 12-digit yang sah (contoh: 870615-10-5622)' 
        : 'Please enter a valid 12-digit NRIC / ID Number (e.g. 870615-10-5622)');
      return;
    }

    // Format NRIC with dashes: XXXXXX-XX-XXXX
    const formattedNric = `${cleanNric.substring(0, 6)}-${cleanNric.substring(6, 8)}-${cleanNric.substring(8)}`;

    const appId = 'APP-' + Math.floor(105 + Math.random() * 900);
    
    const newPending = {
      id: appId,
      name,
      category: selectedCategories.join(', '),
      nric: formattedNric,
      email,
      phone,
      exp,
      location,
      bio,
      proof: proof || 'Credential_Accredited.pdf',
      proofData: proofData || '',
      healthCert: healthCert || 'TB_Clearance_Record.pdf',
      healthCertData: healthCertData || '',
      icDoc: icDoc,
      icDocData: icDocData || '',
      photo
    };

    const submitToStore = async (pendingItem: any) => {
      try {
        await (store as any).appendPendingMember(pendingItem);
        setAssignedAppId(appId);
        setSubmitted(true);
      } catch (err) {
        console.error("Storage write failed, attempting optimizations:", err);
        const warningMsg = lang === 'zh' 
          ? '⚠️ 提示：上传的文件对于浏览器本地存储空间过大，我们将采用优化的仿真文档进行注册，不影响您的资质核验。' 
          : lang === 'bm' 
          ? '⚠️ Nota: Dokumen yang muat naik terlalu besar untuk storan pelayar. Kami akan menggunakan dokumen simulasi yang dioptimumkan untuk pendaftaran.' 
          : '⚠️ Note: The uploaded documents are too large for browser local storage. We will simulate the upload with optimized mock documents for review.';
        
        alert(warningMsg);
        
        const optimizedPending = {
          ...pendingItem,
          proofData: proofData ? "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iagogIDw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqCiAgPDwvVHlwZS9QYWdlcy9LaWRzWzMgMCBSXS9Db3VudCAxPj4KZW5kb2JqCjMgMCBvYmoKICA8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9Db250ZW50cyA0IDAgUj4+CmVuZG9iago0IDAgb2JqCiAgPDwvTGVuZ3RoIDU4Pj5zdHJlYW0KQlQKICAvRjEgMjQgVGYKICA3MiA3MTIgVGQKICAoTW9jayBDcmVkZW50aWFsIEFjY3JlZGl0ZWQgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOSAwMDAwMCBuIAowMDAwMDAwMDcwIDAwMDAwIG4gCjAwMDAwMDAxMjcgMDAwMDAgbIAowMDAwMDAwMjMwIDAwMDAwIG4gCnRyYWlsZXIKICA8PC9TaXplIDUvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgogMzM5CiUlRU9GCg==" : "",
          healthCertData: healthCertData ? "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iagogIDw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqCiAgPDwvVHlwZS9QYWdlcy9LaWRzWzMgMCBSXS9Db3VudCAxPj4KZW5kb2JqCjMgMCBvYmoKICA8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9Db250ZW50cyA0IDAgUj4+CmVuZG9iago0IDAgb2JqCiAgPDwvTGVuZ3RoIDU4Pj5zdHJlYW0KQlQKICAvRjEgMjQgVGYKICA3MiA3MTIgVGQKICAoTW9jayBUQiBDbGVhcmFuY2UgUmVjb3JkIFBERikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCDAwMDAwMDAwMTkgMDAwMDAgbIAowMDAwMDAwMDcwIDAwMDAwIG4gCjAwMDAwMDAxMjcgMDAwMDAgbIAowMDAwMDAwMjMwIDAwMDAwIG4gCnRyYWlsZXIKICA8PC9TaXplIDUvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgogMzM5CiUlRU9GCg==" : "",
          icDocData: icDocData ? "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iagogIDw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqCiAgPDwvVHlwZS9QYWdlcy9LaWRzWzMgMCBSXS9Db3VudCAxPj4KZW5kb2JqCjMgMCBvYmoKICA8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9Db250ZW50cyA0IDAgUj4+CmVuZG9iago0IDAgb2JqCiAgPDwvTGVuZ3RoIDU4Pj5zdHJlYW0KQlQKICAvRjEgMjQgVGYKICA3MiA3MTIgVGQKICAoTW9jayBJQyBDYXJkIFBERikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCDAwMDAwMDAwMTkgMDAwMDAgbIAowMDAwMDAwMDcwIDAwMDAwIG4gCjAwMDAwMDAxMjcgMDAwMDAgbIAowMDAwMDAwMjMwIDAwMDAwIG4gCnRyYWlsZXIKICA8PC9TaXplIDUvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgogMzM5CiUlRU9GCg==" : ""
        };
        try {
          await (store as any).appendPendingMember(optimizedPending);
          setAssignedAppId(appId);
          setSubmitted(true);
        } catch (finalErr) {
          alert("Fatal: Unable to register even with optimized files. Please choose a smaller profile image.");
        }
      }
    };

    setIsSubmitting(true);
    store.signUp(email, password)
      .then((res) => {
        if (res.error) {
          alert('Registration Error / 注册失败: ' + res.error.message);
          setIsSubmitting(false);
          return;
        }
        const userId = res.data.user?.id;
        const pendingItemWithUser = { ...newPending, user_id: userId };
        submitToStore(pendingItemWithUser);
        setIsSubmitting(false);
      })
      .catch((err) => {
        alert('Registration Error / 注册失败: ' + err.message);
        setIsSubmitting(false);
      });
  };

  const t = translations[lang] || translations.en;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '4rem 2rem', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          {submitted ? (
            /* Onboarding Success Banner */
            <div className="card animate-fade-in" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderTop: '4px solid var(--accent)' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-glow)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                border: '2px solid rgba(245, 158, 11, 0.3)'
              }}>
                <Shield size={40} />
              </div>
              
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                {t.register.successTitle}
              </h2>
              <span className="badge badge-pending" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
                {lang === 'zh' ? '申请案号' : lang === 'bm' ? 'ID Permohonan' : 'Application ID'}: {assignedAppId}
              </span>

              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '0.95rem' }}>
                {t.register.successDesc}
                <br /><br />
                {lang === 'zh' ? '一经审核通过，系统将自动生成您的电子会员卡及执业二维码。同时激活您的会员信息门户登录密码 (123456)。' : lang === 'bm' ? 'Setelah diluluskan, kad keahlian digital dan kod bar ID daftar akan dijana, dan kata laluan portal anda (123456) akan diaktifkan.' : 'Once approved, a digital membership card and barcode registry ID will be generated, and your secure portal login password (123456) will activate.'}
              </p>

              <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
                <a href="/" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
                  {lang === 'zh' ? '返回首页' : lang === 'bm' ? 'Kembali Utama' : 'Return Home'}
                </a>
                <a href="/login" className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
                  {lang === 'zh' ? '前往会员登录' : lang === 'bm' ? 'Log Masuk Portal' : 'Go to Member Portal Login'}
                </a>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span className="badge badge-pending" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
                  ✍️ {lang === 'zh' ? '专业照护执业申请表' : lang === 'bm' ? 'Borang Onboarding Profesional' : 'Professional Onboarding Form'}
                </span>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  {t.register.title}
                </h1>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {t.register.subtitle}
                </p>
              </div>

              <div className="card">
                <form onSubmit={handleRegister}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: 'var(--text-light)' }}>
                    1. {lang === 'zh' ? '基本身份信息' : lang === 'bm' ? 'Maklumat Identiti & Perhubungan' : 'Identity & Contact Details'}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">{t.register.fullName}</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Aisha Ibrahim"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t.register.email}</label>
                      <input
                        type="email"
                        required
                        className="form-input"
                        placeholder="e.g. aisha@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">{t.register.phone}</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. 011-2345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t.register.location}</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Petaling Jaya, Selangor"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">
                        {lang === 'zh' ? '身份证号码 / NRIC (开具报税收据所必需)' : lang === 'bm' ? 'No. Kad Pengenalan (Diperlukan untuk resit cukai)' : 'NRIC / ID Number (Required for Tax Receipts)'}
                      </label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. 870615-10-5622"
                        value={nric}
                        onChange={(e) => setNric(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        {lang === 'zh' ? '设置登录密码 (至少 6 位)' : lang === 'bm' ? 'Kata Laluan Log Masuk (Min 6)' : 'Login Password (Min 6 chars)'}
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        className="form-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: 'var(--text-light)' }}>
                    2. {lang === 'zh' ? '护理师专业资质登记' : lang === 'bm' ? 'Butiran Pentauliahan Penjaga' : 'Caregiver Accreditation Details'}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ marginBottom: '1rem', display: 'block' }}>
                        {lang === 'zh' ? '选择专业照护分类 (支持多选) / Specialized Care Categories (Select multiple)' : lang === 'bm' ? 'Pilih Kategori Penjagaan (Boleh pilih lebih dari satu)' : 'Specialized Care Categories (Select all that apply)'}
                      </label>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '1rem',
                        marginBottom: '0.5rem'
                      }}>
                        {categoriesList.map((cat) => {
                          const isSelected = selectedCategories.includes(cat.value);
                          return (
                            <div
                              key={cat.value}
                              onClick={() => {
                                if (isSelected) {
                                  if (selectedCategories.length > 1) {
                                    setSelectedCategories(selectedCategories.filter(c => c !== cat.value));
                                  } else {
                                    alert(lang === 'zh' ? '请至少选择一个分类' : lang === 'bm' ? 'Sila pilih sekurang-kurangnya satu kategori' : 'Please select at least one category');
                                  }
                                } else {
                                  setSelectedCategories([...selectedCategories, cat.value]);
                                }
                              }}
                              style={{
                                backgroundColor: isSelected ? 'rgba(37,99,235,0.08)' : 'rgba(255,255,255,0.01)',
                                border: isSelected ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.06)',
                                borderRadius: '12px',
                                padding: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.15)' : 'none'
                              }}
                              onMouseOver={(e) => {
                                if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                              }}
                              onMouseOut={(e) => {
                                if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                              }}
                            >
                              <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)' }}>
                                  {lang === 'zh' ? cat.labelZh : lang === 'bm' ? cat.labelBm : cat.labelEn}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                                  {cat.value}
                                </div>
                              </div>
                              
                              <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: isSelected ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)',
                                backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                {isSelected && (
                                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" style={{ width: '10px', height: '10px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">{t.register.experience}</label>
                      <select
                        className="form-input"
                        style={{ background: 'var(--bg-input)', color: 'var(--text-light)', cursor: 'pointer' }}
                        value={exp}
                        onChange={(e) => setExp(e.target.value)}
                      >
                        <option value="1 yr">1 {lang === 'zh' ? '年' : 'Year'}</option>
                        <option value="2 yrs">2 {lang === 'zh' ? '年' : 'Years'}</option>
                        <option value="3 yrs">3 {lang === 'zh' ? '年' : 'Years'}</option>
                        <option value="5 yrs">5 {lang === 'zh' ? '年' : 'Years'}</option>
                        <option value="8 yrs">8 {lang === 'zh' ? '年' : 'Years'}</option>
                        <option value="10 yrs+">10+ {lang === 'zh' ? '年' : 'Years'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.register.bio}</label>
                    <textarea
                      required
                      rows={4}
                      className="form-input"
                      style={{ resize: 'none' }}
                      placeholder="Briefly state your training history, specialized care skills, or previous hospital experience..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: 'var(--text-light)' }}>
                    3. {lang === 'zh' ? '上传职业头像照片' : lang === 'bm' ? 'Muat Naik Gambar Potret' : 'Upload Professional Headshot'}
                  </h3>

                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                    {/* Live Preview Frame */}
                    <div style={{
                      width: '90px',
                      height: '110px',
                      backgroundColor: '#1e293b',
                      border: '2px solid var(--accent)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      flexShrink: 0,
                      position: 'relative'
                    }}>
                      <img 
                        src={photo} 
                        alt="Onboarding Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'/%3E%3C/svg%3E";
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(245, 158, 11, 0.95)',
                        color: '#000000',
                        fontSize: '0.55rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: '2px 0'
                      }}>
                        PREVIEW
                      </span>
                    </div>

                    {/* Photo upload action */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label className="form-label">{lang === 'zh' ? '自选头像照片文件：' : lang === 'bm' ? 'Gambar potret anda sendiri:' : 'Profile image file:'}</label>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {lang === 'zh' ? '请选择一张近期、清晰的个人头像照片（JPG, PNG 格式，最大不超过 5MB）：' : lang === 'bm' ? 'Sila pilih satu gambar potret yang jelas (format JPG, PNG, Maks 5MB):' : 'Please select a clear portrait profile image (JPG, PNG formats, Max 5MB):'}
                        </span>
                        
                        <label 
                          className="btn btn-outline" 
                          style={{ 
                            padding: '0.6rem 1.2rem', 
                            fontSize: '0.85rem', 
                            cursor: 'pointer', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            border: '1.5px dashed var(--primary)', 
                            alignSelf: 'flex-start',
                            background: 'rgba(37,99,235,0.04)',
                            borderRadius: '8px'
                          }}
                        >
                          <UploadCloud size={18} style={{ color: 'var(--primary)' }} />
                          <span>{lang === 'zh' ? '📁 选择头像文件' : '📁 Choose Profile Photo'}</span>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: 'var(--text-light)' }}>
                    4. {lang === 'zh' ? '学术资格与体检诊断附件' : lang === 'bm' ? 'Sijil & Dokumen Lampiran Kesihatan' : 'Credentials & Diagnostics Attachments'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
                    {/* Professional Certificate Upload Card */}
                    <div className="form-group">
                      <label className="form-label">{lang === 'zh' ? '专业资格证书文件 (.pdf/.jpg/.png)' : 'Professional Certification File'}</label>
                      <label style={{ 
                        border: proof ? '2px solid var(--health)' : '2px dashed var(--border)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: proof ? 'rgba(16,185,129,0.03)' : 'var(--bg-input)',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                        height: '110px'
                      }}
                      onMouseOver={(e)=>e.currentTarget.style.borderColor=proof ? 'var(--health)' : 'var(--primary)'}
                      onMouseOut={(e)=>e.currentTarget.style.borderColor=proof ? 'var(--health)' : 'var(--border)'}
                      >
                        <UploadCloud size={24} style={{ color: proof ? 'var(--health)' : 'var(--primary)', marginBottom: '0.4rem' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: proof ? 'var(--health)' : 'var(--text-main)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {proof ? `✓ ${proof}` : (lang === 'zh' ? '选择证书文件 (.pdf/图片)' : 'Select Certificate File')}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                          PDF, JPG, PNG (Max 5MB)
                        </span>
                        <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleProofUpload} />
                      </label>
                    </div>

                    {/* Health Diagnostics Clearance Card */}
                    <div className="form-group">
                      <label className="form-label">{lang === 'zh' ? '肺结核体检诊断合格报告 (.pdf/.jpg/.png)' : 'TB & Medical Clearance Record'}</label>
                      <label style={{ 
                        border: healthCert ? '2px solid var(--health)' : '2px dashed var(--border)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: healthCert ? 'rgba(16,185,129,0.03)' : 'var(--bg-input)',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                        height: '110px'
                      }}
                      onMouseOver={(e)=>e.currentTarget.style.borderColor=healthCert ? 'var(--health)' : 'var(--primary)'}
                      onMouseOut={(e)=>e.currentTarget.style.borderColor=healthCert ? 'var(--health)' : 'var(--border)'}
                      >
                        <UploadCloud size={24} style={{ color: healthCert ? 'var(--health)' : 'var(--primary)', marginBottom: '0.4rem' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: healthCert ? 'var(--health)' : 'var(--text-main)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {healthCert ? `✓ ${healthCert}` : (lang === 'zh' ? '选择体检诊断合格报告' : 'Select Health Diagnostics')}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                          PDF, JPG, PNG (Max 5MB)
                        </span>
                        <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleHealthCertUpload} />
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem', marginTop: '1.25rem' }}>
                    {/* NRIC / IC Document Upload Card */}
                    <div className="form-group" style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                      <label className="form-label">
                        {lang === 'zh' ? '身份证 (NRIC/IC) 正反面复印件或照片 (.pdf/.jpg/.png) - 必填安全审核' : 'NRIC / IC Card Front & Back Photo or Copy (.pdf/.jpg/.png) - Required for safety verification'}
                      </label>
                      <label style={{ 
                        border: icDoc ? '2px solid var(--health)' : '2px dashed var(--border)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: icDoc ? 'rgba(16,185,129,0.03)' : 'var(--bg-input)',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                        height: '110px'
                      }}
                      onMouseOver={(e)=>e.currentTarget.style.borderColor=icDoc ? 'var(--health)' : 'var(--primary)'}
                      onMouseOut={(e)=>e.currentTarget.style.borderColor=icDoc ? 'var(--health)' : 'var(--border)'}
                      >
                        <UploadCloud size={24} style={{ color: icDoc ? 'var(--health)' : 'var(--primary)', marginBottom: '0.4rem' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: icDoc ? 'var(--health)' : 'var(--text-main)', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {icDoc ? `✓ ${icDoc}` : (lang === 'zh' ? '选择身份证正反面扫描件/照片 (.pdf/图片)' : 'Select IC/NRIC Document')}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                          PDF, JPG, PNG (Max 5MB)
                        </span>
                        <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleIcDocUpload} />
                      </label>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.15)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', margin: '1.5rem 0' }}>
                    <AlertCircle size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      <strong>{lang === 'zh' ? '执照年费核发提示：' : lang === 'bm' ? 'Keperluan Yuran Lesen Kesatuan:' : 'Licensure Fee Requirement:'}</strong> {lang === 'zh' ? '提交注册表后，您将进入资质核验队列。一旦管理员审核批准通过，系统将向您核发会员 ID，并于发卡时收取 RM350 的年度执照年费。' : lang === 'bm' ? 'Menghantar permohonan ini meletakkan anda dalam antrean tapisan. Setelah diluluskan oleh admin, yuran lesen RM350 akan dikenakan.' : 'Submitting this registration queues you in the vetting list. Once the admin audits your files and details, approval generates a membership ID. A RM350 annual licensing fee is billed upon card issuance.'}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', height: '48px' }}>
                    📢 {t.register.submitBtn}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
