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
  const [category, setCategory] = useState('Confinement Care');
  const [exp, setExp] = useState('1 yr');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [proof, setProof] = useState('Accredited_Caregiver_Diploma.pdf');
  const [healthCert, setHealthCert] = useState('TB_Health_Clearance_Record.pdf');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=256&h=256&fit=crop');
  
  const [submitted, setSubmitted] = useState(false);
  const [assignedAppId, setAssignedAppId] = useState('');
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    setLang(store.getLanguage() as Language);
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !bio || !location) return;

    const appId = 'APP-' + Math.floor(105 + Math.random() * 900);
    
    const newPending = {
      id: appId,
      name,
      category,
      email,
      phone,
      exp,
      location,
      bio,
      proof,
      healthCert,
      photo
    };

    const currentPending = store.getPendingMembers();
    store.setPendingMembers([...currentPending, newPending]);

    setAssignedAppId(appId);
    setSubmitted(true);
  };

  const t = translations[lang] || translations.en;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
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
              
              <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.75rem' }}>
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
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: '#ffffff' }}>
                    1. {lang === 'zh' ? '基本身份信息' : lang === 'bm' ? 'Maklumat Identiti & Perhubungan' : 'Identity & Contact Details'}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
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

                  <h3 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: '#ffffff' }}>
                    2. {lang === 'zh' ? '护理师专业资质登记' : lang === 'bm' ? 'Butiran Pentauliahan Penjaga' : 'Caregiver Accreditation Details'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">{t.register.category}</label>
                      <select
                        className="form-input"
                        style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="Confinement Care">🍼 {lang === 'zh' ? 'Confinement Lady (月嫂)' : lang === 'bm' ? 'Penjaga Berpantang (Materniti)' : 'Confinement Lady'}</option>
                        <option value="Patient Companion">🏥 {lang === 'zh' ? 'Patient Companion (陪诊人员)' : lang === 'bm' ? 'Peneman Pesakit' : 'Patient Companion'}</option>
                        <option value="Elderly Caregiver">👴 {lang === 'zh' ? 'Elderly Caregiver (养老护理员)' : lang === 'bm' ? 'Penjaga Warga Emas' : 'Elderly Caregiver'}</option>
                        <option value="Rehabilitation Care Assistant">💪 {lang === 'zh' ? 'Rehabilitation Therapist (康复助理)' : lang === 'bm' ? 'Pembantu Rehab' : 'Rehab Assistant'}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t.register.experience}</label>
                      <select
                        className="form-input"
                        style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }}
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

                  <h3 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: '#ffffff' }}>
                    3. {t.register.presetPhoto}
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

                    {/* Presets and URL select */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label className="form-label">{lang === 'zh' ? '选择专业职业半身照预设' : lang === 'bm' ? 'Pilih Potret Pilihan' : 'Select Professional Headshot Preset'}</label>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {[
                          { name: 'Preset A (Malay Female)', url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=256&h=256&fit=crop' },
                          { name: 'Preset B (Chinese Female)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&fit=crop' },
                          { name: 'Preset C (Indian Male)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop' },
                          { name: 'Preset D (Chinese Male)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop' }
                        ].map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            className={`btn ${photo === preset.url ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px', cursor: 'pointer' }}
                            onClick={() => setPhoto(preset.url)}
                          >
                            {preset.name.split(' ')[0] + ' ' + preset.name.split(' ')[1]}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'zh' ? '或输入自定义头像链接：' : lang === 'bm' ? 'Atau masukkan URL imej:' : 'Or enter custom image URL:'}</span>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', fontSize: '0.82rem', padding: '0.4rem 0.75rem', height: '36px' }}
                          placeholder="https://example.com/my-photo.jpg"
                          value={photo}
                          onChange={(e) => setPhoto(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: '#ffffff' }}>
                    4. {lang === 'zh' ? '学术资格与体检诊断附件' : lang === 'bm' ? 'Sijil & Dokumen Lampiran Kesihatan' : 'Credentials & Diagnostics Attachments'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">{lang === 'zh' ? '专业资格证书文件名称' : lang === 'bm' ? 'Nama Fail Sijil Kecekapan' : 'Professional Certification File Name'}</label>
                      <div style={{ position: 'relative' }}>
                        <FileText size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          required
                          className="form-input"
                          style={{ width: '100%', paddingLeft: '44px' }}
                          value={proof}
                          onChange={(e) => setProof(e.target.value)}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'zh' ? '提供证明文件全称 (例: Certification.pdf)' : lang === 'bm' ? 'Nama fail dokumen (cth: Sijil_Kecemerlangan.pdf)' : 'Provide document filename (e.g. Doula_Diploma.pdf)'}</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{lang === 'zh' ? '肺结核体检诊断合格报告名称' : lang === 'bm' ? 'Nama Fail Laporan Kesihatan / TB' : 'TB & Medical Clearance Record Name'}</label>
                      <div style={{ position: 'relative' }}>
                        <FileText size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          required
                          className="form-input"
                          style={{ width: '100%', paddingLeft: '44px' }}
                          value={healthCert}
                          onChange={(e) => setHealthCert(e.target.value)}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'zh' ? '提供体检合格证全称 (例: TB_Clearance.pdf)' : lang === 'bm' ? 'Nama fail laporan perubatan (cth: Rekod_Kesihatan.pdf)' : 'Provide health diagnostic record (e.g. HKL_Medical_Report.pdf)'}</span>
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
