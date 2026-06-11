'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Calendar, FileText, PhoneCall, AlertCircle, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';
import Lightbox from '@/components/Lightbox';

export default function FamilyPortal() {
  const [patientName, setPatientName] = useState('Jianguo Zhang (Grandpa Zhang)');
  const [careType, setCareType] = useState('Elderly Chronic Care');
  const [assignedCaregiver, setAssignedCaregiver] = useState('Li Xiulan (MCSA-2026-0009)');
  const [caregiverPhone, setCaregiverPhone] = useState('012-8888776');
  const [activeSession, setActiveSession] = useState<any>(null);
  const [activeConfinement, setActiveConfinement] = useState<any>(null);
  const [activeElder, setActiveElder] = useState<any>(null);
  const [lang, setLang] = useState<Language>('en');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [reportsHistory, setReportsHistory] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [showReportHistoryDetail, setShowReportHistoryDetail] = useState(false);

  // Lightbox viewer states
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState<{ url: string; caption?: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setLang(store.getLanguage() as Language);
    const email = localStorage.getItem('mcsa_client_email') || '';
    setClientEmail(email);
    
    if (!email) {
      alert(store.getLanguage() === 'zh'
        ? '🔒 为了保护患者隐私，家属实时追踪门户已被安全加密。请先登录您的家属账号。'
        : store.getLanguage() === 'bm'
        ? '🔒 Untuk keselamatan maklumat, sila log masuk ke portal keluarga.'
        : '🔒 To protect patient confidentiality, access to the Family Portal is encrypted. Please log in first.');
      window.location.href = '/login';
      return;
    }

    const requests = store.getCareRequests();
    const found = requests.find((r: any) => 
      r.email && r.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!found) {
      alert(store.getLanguage() === 'zh'
        ? '⚠️ 您的登录会话已过期或无效。请重新登录。'
        : store.getLanguage() === 'bm'
        ? '⚠️ Sesi log masuk tidak sah. Sila log masuk semula.'
        : '⚠️ Your login session is invalid. Please log in again.');
      localStorage.removeItem('mcsa_client_email');
      window.location.href = '/login';
      return;
    }

    setPatientName(`${found.name}'s Family Case`);
    setCareType(found.category);
    
    // Load confinement reports history
    const history = JSON.parse(localStorage.getItem('mcsa_confinement_history') || '[]');
    setReportsHistory(history);
    
    let sessionActive = false;

    if (found.category === 'Confinement Care' || found.category === 'Babysitter Service') {
      setAssignedCaregiver('Meizhen Chen (MCSA-2026-1112)');
      setCaregiverPhone('019-3322114');
      
      const storedConf = localStorage.getItem('mcsa_active_confinement_session');
      if (storedConf) {
        const parsed = JSON.parse(storedConf);
        if (parsed.isShared) {
          setActiveConfinement(parsed);
          setPatientName(`${parsed.babyName} (${parsed.babyAgeDays} Days Old)`);
          setCareType("Baby Confinement Care / 母婴月嫂照护");
          setAssignedCaregiver("Meizhen Chen (MCSA-2026-1112)");
          setCaregiverPhone("019-3322114");
          sessionActive = true;
        }
      }
    } else if (found.category === 'Patient Companion' || found.category === 'Outpatient Medical Escort') {
      setAssignedCaregiver('Li Xiulan (MCSA-2026-0009)');
      setCaregiverPhone('012-8888776');

      const stored = localStorage.getItem('mcsa_active_escort_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.isShared) {
          setActiveSession(parsed);
          setPatientName(`${parsed.patientName} (${parsed.patientAge} Years Old)`);
          setCareType("Outpatient Medical Escort / 就医陪诊");
          setAssignedCaregiver("Li Xiulan (MCSA-2026-0009)");
          setCaregiverPhone("012-8888776");
          sessionActive = true;
        }
      }
    } else {
      setAssignedCaregiver('Li Xiulan (MCSA-2026-0009)');
      setCaregiverPhone('012-8888776');

      const storedElder = localStorage.getItem('mcsa_active_elder_session');
      if (storedElder) {
        const parsed = JSON.parse(storedElder);
        if (parsed.isShared) {
          setActiveElder(parsed);
          setPatientName(`${parsed.patientName} (${parsed.patientAge} Years Old)`);
          setCareType("Elderly Care / 长者日常照护");
          setAssignedCaregiver("Li Xiulan (MCSA-2026-0009)");
          setCaregiverPhone("012-8888776");
          sessionActive = true;
        }
      }
    }
    setIsSessionActive(sessionActive);
  }, []);
  
  const dailyVitals = [
    { time: '12:30', bp: '134/84 mmHg', sugar: '6.2 mmol/L', pulse: '75 bpm', status: 'Normal' },
    { time: '08:30', bp: '130/82 mmHg', sugar: '5.6 mmol/L', pulse: '72 bpm', status: 'Normal' }
  ];

  const shiftEvents = [
    { time: '14:20', desc: 'Diabetes prescription retrieved from pharmacy counter.' },
    { time: '12:30', desc: 'Completed afternoon health checklist and vitals entry.' },
    { time: '10:45', desc: 'Doctor recommended increasing daily walk cycle to 20 minutes.' },
    { time: '08:30', desc: 'Shift started. In good spirits. Completed morning vitals check.' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc', paddingBottom: '3rem' }}>
      {/* Top Header */}
      <header style={{
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        color: 'white',
        padding: '1.5rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-md)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--health) 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={22} style={{ color: '#ffffff' }} />
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: '1.25rem', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
              MCSA Family Live Tracker
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Patient: {patientName}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <span className="badge badge-active" style={{ background: 'var(--health-glow)', color: 'var(--health)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'inline-flex', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--health)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span> Real-time Connected
          </span>
          <a 
            href="/" 
            onClick={() => {
              localStorage.removeItem('mcsa_client_email');
            }}
            style={{ color: '#fca5a5', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }} 
            onMouseOver={(e)=>e.currentTarget.style.color='#f87171'} 
            onMouseOut={(e)=>e.currentTarget.style.color='#fca5a5'}
          >
            🚪 {lang === 'zh' ? '安全退出' : lang === 'bm' ? 'Log Keluar' : 'Log Out'}
          </a>
        </div>
      </header>

      {/* Main Grid */}
      <main style={{ maxWidth: '1200px', margin: '2.5rem auto', padding: '0 2rem' }} className="animate-fade-in">
        
        {/* Caregiver Summary Block with Premium gradient border */}
        <div className="card" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'linear-gradient(90deg, rgba(37,99,235,0.08) 0%, rgba(30,41,59,0.5) 100%)', 
          borderLeft: '5px solid var(--primary)',
          borderRadius: '16px',
          padding: '1.5rem 2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: '0 0 0.25rem 0' }}>Active Service Assignment / 当前服务派单</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Assigned Companion: <strong style={{ color: '#ffffff' }}>{assignedCaregiver}</strong> &bull; Care Segment: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{careType}</span>
            </p>
          </div>
          <button 
            onClick={() => alert(`Dialing assigned companion hotline: ${caregiverPhone}`)}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', borderRadius: '10px' }}
          >
            <PhoneCall size={16} /> Call Companion
          </button>
        </div>

        {!isSessionActive ? (
          <div className="card animate-fade-in" style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            padding: '3.5rem 2.5rem',
            borderRadius: '20px',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '2rem auto'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(37, 99, 235, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <ShieldAlert size={36} style={{ color: 'var(--accent)' }} />
            </div>
            
            <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '1rem', fontFamily: 'Outfit' }}>
              {lang === 'zh' ? '🔒 实时照护追踪未开启' : lang === 'bm' ? '🔒 Pengesan Penjagaan Belum Aktif' : '🔒 Live Care Tracker Not Active'}
            </h3>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {lang === 'zh' 
                ? `您好，我们已通过安全访问密钥验证了您的家属身份。目前，您指定的看护人员/陪诊员尚未开启本次服务的一键实时同步。当服务开始且看护人员在工作台点击同步后，患者的生命体征、实时服务记录及就诊药单将自动呈现在此页面。`
                : lang === 'bm'
                ? `Hello. Status keluarga anda telah disahkan dengan selamat. Buat masa ini, penjaga anda belum mengaktifkan log langsung. Butiran kesihatan pesakit akan dipaparkan di sini sebaik sahaja syif bermula.`
                : `Hello. Your family portal credentials have been securely verified. Currently, your assigned caregiver has not started or synced this care session. Real-time vitals, checklists, and diagnostics will sync here once the caregiver starts the shift.`}
            </p>

            <div style={{
              display: 'inline-grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '0.75rem',
              background: 'rgba(15,23,42,0.4)',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              textAlign: 'left',
              fontSize: '0.85rem',
              border: '1px solid rgba(255,255,255,0.05)',
              maxWidth: '500px'
            }}>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>🔑</span>
              <div style={{ color: '#ffffff' }}>
                <strong>{lang === 'zh' ? '安全认证已锁：' : lang === 'bm' ? 'Kredensial Akses:' : 'Security Status:'}</strong>
                <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '0.8rem' }}>
                  {lang === 'zh' ? '授权电子邮箱：' : lang === 'bm' ? 'E-mel:' : 'Email:'} <code style={{ color: '#60a5fa' }}>{clientEmail}</code><br />
                  {lang === 'zh' ? '安全防护等级：' : lang === 'bm' ? 'Status Penyulitan:' : 'Security Status:'} <span style={{ color: 'var(--health)', fontWeight: 'bold' }}>{lang === 'zh' ? '● 严格访问控制已锁定' : lang === 'bm' ? '● Disulitkan & Selamat' : '● Encrypted & Secure'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeConfinement ? (
          /* Premium Confinement Care Family Portal Baby Live Dashboard */
          <div className="grid-cols-2" style={{ gap: '2rem' }}>
            
            {/* Left Column: Baby Wellness Vitals & Jaundice Charts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Baby Wellness Profile Card */}
              <div className="card" style={{ margin: 0, padding: '1.75rem', borderLeft: '5px solid #ec4899' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
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
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>
                      {activeConfinement.babyName} Wellness Profile
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Baby Age: <strong>{activeConfinement.babyAgeDays} Days Old (日龄)</strong> &bull; Sync: {activeConfinement.lastUpdated || 'N/A'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>🌡️ <strong>Body Temperature:</strong> <span style={{ color: '#ec4899', fontWeight: 'bold' }}>{activeConfinement.healthCheck?.temp || '36.6'} °C</span></div>
                  <div>🍥 <strong>Umbilical Cord:</strong> <span style={{ color: 'var(--health)', fontWeight: 'bold' }}>{activeConfinement.healthCheck?.umbilicalStatus || 'Dry & Healing'}</span></div>
                </div>
              </div>

              {/* Jaundice Monitoring Chart Card */}
              <div className="card" style={{ margin: 0, padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🟡 Transcutaneous Jaundice Levels / 黄疸指标实时比对
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { label: 'Forehead / 额头黄疸', val: Number(activeConfinement.healthCheck?.jaundiceForehead || 8.2), color: '#f59e0b', max: 15 },
                    { label: 'Cheeks / 脸颊黄疸', val: Number(activeConfinement.healthCheck?.jaundiceCheeks || 8.0), color: '#3b82f6', max: 15 },
                    { label: 'Chest / 胸部黄疸', val: Number(activeConfinement.healthCheck?.jaundiceChest || 7.5), color: '#10b981', max: 15 }
                  ].map((bar, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.2rem' }}>
                        <span>{bar.label}</span>
                        <strong>{bar.val} mg/dL ({bar.val < 10 ? 'Safe / 正常安全' : 'Caution / 警戒'})</strong>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${(bar.val / bar.max) * 100}%`, height: '100%', background: bar.color, borderRadius: '9999px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities Checked Card */}
              <div className="card" style={{ margin: 0, padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1.25rem' }}>
                  🚿 Care Activities Accomplished / 今日已完照护项目
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { key: 'bathing', label: 'Bathing / 洗澡' },
                    { key: 'tummyTime', label: 'Tummy Time / 抬头训练' },
                    { key: 'massage', label: 'Massage / 抚触按摩' },
                    { key: 'music', label: 'Music / 启蒙早教' }
                  ].map((act) => {
                    const isDone = !!(activeConfinement.sleepActivity?.activities?.[act.key]);
                    return (
                      <div 
                        key={act.key}
                        style={{
                          padding: '0.65rem 1rem',
                          borderRadius: '8px',
                          border: isDone ? '1px solid var(--health)' : '1px solid rgba(255,255,255,0.04)',
                          background: isDone ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.01)',
                          color: isDone ? 'var(--health)' : 'var(--text-muted)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <span>{isDone ? '✓' : '○'}</span>
                        <span>{act.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Feeding, Diaper & Sleep Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Nutritional Feed Intake Card */}
              <div className="card" style={{ margin: 0, padding: '1.75rem', borderLeft: '5px solid #ec4899' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                    🍼 Nutritional Feeding Stream / 今日喂养记录
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#f472b6', fontWeight: 'bold' }}>
                    Total Volume: {activeConfinement.feedingLog ? activeConfinement.feedingLog.reduce((sum: number, l: any) => sum + (l.formulaMl || 0), 0) : 0} ml
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {activeConfinement.feedingLog && activeConfinement.feedingLog.map((log: any) => (
                    <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '0.85rem' }}>
                      <span style={{ color: '#f472b6', fontWeight: 600 }}>🕒 {log.time}</span>
                      <span>{log.type === 'Breast' ? `Breastfeed (${log.breastLeftMins}m L / ${log.breastRightMins}m R)` : `Formula Feed (${log.formulaMl}ml)`}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diaper & Sleep Logs Card */}
              <div className="card" style={{ margin: 0, padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1.25rem' }}>
                  💩 Diaper Output & Sleep Logs / 尿布排便与睡眠
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activeConfinement.diaperRecord && activeConfinement.diaperRecord.slice(0, 3).map((log: any) => (
                    <div key={log.id} style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', fontSize: '0.82rem', lineHeight: 1.4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.2rem' }}>
                        <span>🕒 {log.time} - Diaper Change</span>
                        <span style={{ color: 'var(--health)' }}>Stool: {log.stoolColor} ({log.texture})</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)' }}>
                        Urine: {log.urine} &bull; Stool Amount: {log.amount} {log.notes ? `&bull; Note: ${log.notes}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Care Photo Gallery */}
            <div style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
              <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #3b82f6', background: 'rgba(30, 41, 59, 0.4)' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit' }}>
                  📸 {lang === 'zh' ? '实时服务照护相册' : lang === 'bm' ? 'Galeri Foto Penjagaan Langsung' : 'Live Daily Care Photo Gallery'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  {lang === 'zh'
                    ? '看护人员上传的患者日常照护状态照片（如配餐、活动、环境等），点击照片可查看高清大图。'
                    : lang === 'bm'
                    ? 'Gambar yang dimuat naik oleh penjaga semasa syif (makanan, aktiviti harian, dll). Klik untuk paparan penuh.'
                    : 'Daily care photos uploaded by your caregiver (meals, daily activities, status updates, etc). Click to preview in fullscreen.'}
                </p>
                {(() => {
                  const photos = activeConfinement.uploadedPhotos || [];
                  const validPhotos = photos.filter(Boolean);

                  if (validPhotos.length === 0) {
                    return (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, fontStyle: 'italic' }}>
                        {lang === 'zh' ? '目前暂无看护人员分享的现场照片。' : lang === 'bm' ? 'Tiada gambar dikongsi buat masa ini.' : 'No care photos uploaded by the caregiver yet.'}
                      </p>
                    );
                  }

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                      {validPhotos.map((photo: string, i: number) => (
                        <div 
                          key={i} 
                          onClick={() => {
                            const galleryList = validPhotos.map((url: string) => ({ url, caption: lang === 'zh' ? '看护现场记录 / Rekod Penjagaan' : 'Care Shift Photo' }));
                            setLightboxPhotos(galleryList);
                            setLightboxIndex(i);
                            setShowLightbox(true);
                          }}
                          style={{
                            aspectRatio: '1',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            overflow: 'hidden',
                            backgroundColor: '#1e293b',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          }}
                        >
                          <img src={photo} alt={`Care activity ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Collapsible History Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
              <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #ec4899', background: 'rgba(30, 41, 59, 0.4)' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit' }}>
                  📜 {lang === 'zh' ? '宝宝往期历史健康日志' : lang === 'bm' ? 'Arkib Laporan Kesihatan Bayi' : 'Past Baby Daily Vitals Archive'} ({reportsHistory.length})
                </h3>
                
                {reportsHistory.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                    {lang === 'zh' ? '暂无历史归档报告。当月嫂每天归档并提交服务日志后，旧数据将在此存档。' : 'No past daily reports archived yet. Daily shift logs will appear here once archived by the caregiver.'}
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {reportsHistory.map((rep) => (
                      <div 
                        key={rep.id} 
                        onClick={() => {
                          setSelectedReport(rep);
                          setShowReportHistoryDetail(true);
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '12px',
                          padding: '1rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(236,72,153,0.08)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span className="badge badge-active" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', background: 'rgba(236,72,153,0.15)', color: '#f472b6', border: '1px solid rgba(236,72,153,0.2)' }}>
                            Day {rep.babyAgeDays}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📅 {rep.date}</span>
                        </div>
                        <h4 style={{ color: '#ffffff', fontSize: '0.92rem', margin: '0 0 0.25rem 0' }}>Report for: {rep.babyName}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                          🍼 {rep.feedingLog ? rep.feedingLog.length : 0} feeds &bull; 💩 {rep.diaperRecord ? rep.diaperRecord.length : 0} diapers
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : activeElder ? (
          /* Premium Senior Care Live Dashboard (Elderly Caregiver) */
          <div className="grid-cols-2" style={{ gap: '2rem' }}>
            
            {/* Left Column: Elder Profile, Risks, and Milestones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Senior Health Profile & Risks Card */}
              <div className="card" style={{ margin: 0, padding: '1.75rem', borderLeft: '5px solid var(--primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: '2px solid var(--primary)',
                    overflow: 'hidden',
                    backgroundColor: '#1e293b'
                  }}>
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop" 
                      alt="Elder Portrait"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&fit=crop";
                      }}
                    />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
                      {activeElder.patientName} {lang === 'zh' ? '日常照护档案' : 'Daily Care Profile'}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {lang === 'zh' ? '年龄：' : 'Age: '} <strong>{activeElder.patientAge} {lang === 'zh' ? '岁' : 'Y/O'}</strong> &bull; {lang === 'zh' ? '服务阶段：' : 'Shift: '} <strong>Day {activeElder.dayNumber}</strong> &bull; {lang === 'zh' ? '同步时间：' : 'Sync: '} <strong>{activeElder.lastUpdated}</strong>
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    ⚠️ {lang === 'zh' ? '日常照护安全指标' : 'Daily Risk Metrics Check'}
                  </h4>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Fall Risk */}
                    <div style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      background: activeElder.risks?.fallRisk === 'High' ? 'rgba(239,68,68,0.1)' : activeElder.risks?.fallRisk === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                      border: `1px solid ${activeElder.risks?.fallRisk === 'High' ? 'var(--danger)' : activeElder.risks?.fallRisk === 'Medium' ? 'var(--accent)' : 'var(--health)'}`,
                      color: activeElder.risks?.fallRisk === 'High' ? 'var(--danger)' : activeElder.risks?.fallRisk === 'Medium' ? 'var(--accent)' : 'var(--health)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      🚶‍♂️ {lang === 'zh' ? '跌倒风险' : 'Fall Risk'}: {activeElder.risks?.fallRisk === 'High' ? (lang === 'zh' ? '高' : 'High') : activeElder.risks?.fallRisk === 'Medium' ? (lang === 'zh' ? '中' : 'Medium') : (lang === 'zh' ? '低' : 'Low')}
                    </div>
                    {/* Bedsores */}
                    <div style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      background: activeElder.risks?.bedsores === 'Area Check' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                      border: `1px solid ${activeElder.risks?.bedsores === 'Area Check' ? 'var(--accent)' : 'var(--health)'}`,
                      color: activeElder.risks?.bedsores === 'Area Check' ? 'var(--accent)' : 'var(--health)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      🛏️ {lang === 'zh' ? '压疮风险' : 'Bedsores'}: {activeElder.risks?.bedsores === 'Area Check' ? (lang === 'zh' ? '需特别留意' : 'Area Check') : (lang === 'zh' ? '无' : 'None')}
                    </div>
                    {/* Cognitive */}
                    <div style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      background: activeElder.risks?.cognitiveStatus === 'Declining' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                      border: `1px solid ${activeElder.risks?.cognitiveStatus === 'Declining' ? 'var(--danger)' : 'var(--health)'}`,
                      color: activeElder.risks?.cognitiveStatus === 'Declining' ? 'var(--danger)' : 'var(--health)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      🧠 {lang === 'zh' ? '认知状态' : 'Cognitive'}: {activeElder.risks?.cognitiveStatus === 'Declining' ? (lang === 'zh' ? '需注意' : 'Declining') : (lang === 'zh' ? '正常' : 'Normal')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Care Activities Checklist */}
              <div className="card" style={{ margin: 0, padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
                  🧺 {lang === 'zh' ? '今日已完成照护项目' : 'Care Activities & Milestones Completed'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {activeElder.activities && activeElder.activities.length > 0 ? (
                    activeElder.activities.map((act: any) => (
                      <div 
                        key={act.id}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          border: act.checked ? '1px solid var(--health)' : '1px solid rgba(255,255,255,0.04)',
                          background: act.checked ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.01)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ 
                              color: act.checked ? 'var(--health)' : 'var(--text-muted)', 
                              fontWeight: 'bold',
                              fontSize: '1rem' 
                            }}>
                              {act.checked ? '✓' : '○'}
                            </span>
                            <span style={{ 
                              color: act.checked ? '#ffffff' : 'var(--text-muted)', 
                              fontWeight: 600,
                              fontSize: '0.88rem' 
                            }}>
                              {act.title}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🕒 {act.time}</span>
                        </div>
                        {act.notes && (
                          <div style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--accent)', 
                            fontStyle: 'italic', 
                            paddingLeft: '1.5rem',
                            borderLeft: '2px solid rgba(245,158,11,0.3)',
                            marginTop: '0.2rem'
                          }}>
                            <strong>{lang === 'zh' ? '备注：' : 'Note: '}</strong> {act.notes}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      {lang === 'zh' ? '暂未安排照护项目流。' : 'No scheduled care activities recorded yet.'}
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Medications and Vitals Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Medication Compliance Card */}
              <div className="card" style={{ margin: 0, padding: '1.75rem', borderLeft: '5px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
                  💊 {lang === 'zh' ? '用药核对清单' : 'Medication Intake & Compliance'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activeElder.medications && activeElder.medications.length > 0 ? (
                    activeElder.medications.map((med: any) => (
                      <div 
                        key={med.id} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          background: 'rgba(255,255,255,0.01)', 
                          padding: '0.75rem 1rem', 
                          borderRadius: '8px', 
                          border: '1px solid rgba(255,255,255,0.04)', 
                          fontSize: '0.88rem' 
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>🕒 {med.time}</span>
                            <strong style={{ color: '#ffffff' }}>{med.name}</strong>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
                            {lang === 'zh' ? '剂量：' : 'Dose: '} {med.dose}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '0.3rem 0.6rem',
                          borderRadius: '6px',
                          background: med.administered ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          border: `1px solid ${med.administered ? 'var(--health)' : 'var(--danger)'}`,
                          color: med.administered ? 'var(--health)' : 'var(--danger)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}>
                          {med.administered ? '✓ ' + (lang === 'zh' ? '已服' : 'Yes') : '✗ ' + (lang === 'zh' ? '未服' : 'No')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      {lang === 'zh' ? '暂无药物服用记录。' : 'No medication records logged yet.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Vitals Monitor Card with SVG Graphs */}
              <div className="card" style={{ margin: 0, padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
                  🩺 {lang === 'zh' ? '长者日常生命体征实时监测' : 'Vitals Signs Monitor Stream'}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>🩺 {lang === 'zh' ? '血压' : 'Blood Pressure'}</span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>{activeElder.vitals?.bp || '128/82'} mmHg</strong>
                  </div>
                  <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>🍭 {lang === 'zh' ? '血糖' : 'Blood Sugar'}</span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--accent)' }}>{activeElder.vitals?.bloodSugar || '6.2'} mmol/L</strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
                      ({activeElder.vitals?.sugarType === 'Fasting' ? (lang === 'zh' ? '空腹' : 'Fasting') : (lang === 'zh' ? '餐后' : 'Post-Meal')})
                    </span>
                  </div>
                  <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>💓 {lang === 'zh' ? '心率' : 'Heart Rate'}</span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--danger)' }}>{activeElder.vitals?.heartRate || '74'} bpm</strong>
                  </div>
                  <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>🌡️ {lang === 'zh' ? '体温' : 'Body Temperature'}</span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--health)' }}>{activeElder.vitals?.bodyTemp || '36.6'} °C</strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    📈 {lang === 'zh' ? '健康数据波段动态趋势' : 'Vital Signs Graphs Trend'}
                  </h4>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      <span>{lang === 'zh' ? '收缩压/舒张压 (mmHg)' : 'BP Trends (mmHg)'}</span>
                      <span>{lang === 'zh' ? '血糖波动 (mmol/L)' : 'Glucose Trends (mmol/L)'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {/* BP Chart */}
                      <svg viewBox="0 0 160 80" style={{ width: '100%', height: '80px' }}>
                        <line x1="0" y1="20" x2="160" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />
                        <line x1="0" y1="50" x2="160" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />
                        <polyline
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="2.5"
                          points="10,40 40,35 70,38 100,30 130,36 150,33"
                        />
                        <polyline
                          fill="none"
                          stroke="var(--health)"
                          strokeWidth="2"
                          points="10,65 40,62 70,64 100,58 130,61 150,60"
                        />
                        <circle cx="150" cy="33" r="4.5" fill="var(--primary)" />
                        <circle cx="150" cy="60" r="3.5" fill="var(--health)" />
                        <text x="150" y="24" fill="var(--primary)" fontSize="7" fontWeight="bold" textAnchor="middle">
                          {activeElder.vitals?.bp?.split('/')[0] || '128'}
                        </text>
                        <text x="150" y="70" fill="var(--health)" fontSize="7" fontWeight="bold" textAnchor="middle">
                          {activeElder.vitals?.bp?.split('/')[1] || '82'}
                        </text>
                      </svg>
                      
                      {/* Glucose Chart */}
                      <svg viewBox="0 0 160 80" style={{ width: '100%', height: '80px' }}>
                        <line x1="0" y1="30" x2="160" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />
                        <line x1="0" y1="60" x2="160" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />
                        <polyline
                          fill="none"
                          stroke="var(--accent)"
                          strokeWidth="2.5"
                          points="10,50 40,55 70,45 100,52 130,48 150,44"
                        />
                        <circle cx="150" cy="44" r="4.5" fill="var(--accent)" />
                        <text x="150" y="34" fill="var(--accent)" fontSize="7" fontWeight="bold" textAnchor="middle">
                          {activeElder.vitals?.bloodSugar || '6.2'}
                        </text>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      <span>{lang === 'zh' ? '6/4 今日体征记录' : '6/4 Vitals Stream'}</span>
                      <span style={{ color: 'var(--accent)' }}>● {lang === 'zh' ? '实时更新同步' : 'Live Synced'}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Live Care Photo Gallery */}
            <div style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
              <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #3b82f6', background: 'rgba(30, 41, 59, 0.4)' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit' }}>
                  📸 {lang === 'zh' ? '实时服务照护相册' : lang === 'bm' ? 'Galeri Foto Penjagaan Langsung' : 'Live Daily Care Photo Gallery'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  {lang === 'zh'
                    ? '看护人员上传的患者日常照护状态照片（如配餐、活动、环境等），点击照片可查看高清大图。'
                    : lang === 'bm'
                    ? 'Gambar yang dimuat naik oleh penjaga semasa syif (makanan, aktiviti harian, dll). Klik untuk paparan penuh.'
                    : 'Daily care photos uploaded by your caregiver (meals, daily activities, status updates, etc). Click to preview in fullscreen.'}
                </p>
                {(() => {
                  const photos = activeElder?.uploadedPhotos || [];
                  const validPhotos = photos.filter(Boolean);

                  if (validPhotos.length === 0) {
                    return (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, fontStyle: 'italic' }}>
                        {lang === 'zh' ? '目前暂无看护人员分享的现场照片。' : lang === 'bm' ? 'Tiada gambar dikongsi buat masa ini.' : 'No care photos uploaded by the caregiver yet.'}
                      </p>
                    );
                  }

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                      {validPhotos.map((photo: string, i: number) => (
                        <div 
                          key={i} 
                          onClick={() => {
                            const galleryList = validPhotos.map((url: string) => ({ url, caption: lang === 'zh' ? '看护现场记录 / Rekod Penjagaan' : 'Care Shift Photo' }));
                            setLightboxPhotos(galleryList);
                            setLightboxIndex(i);
                            setShowLightbox(true);
                          }}
                          style={{
                            aspectRatio: '1',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            overflow: 'hidden',
                            backgroundColor: '#1e293b',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          }}
                        >
                          <img src={photo} alt={`Care activity ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>
        ) : (
          /* Default Escort / Elderly View */
          <div className="grid-cols-2">
            {/* Timeline Tracking */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
                <Calendar size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Live Shift Milestone Logs / 实时服务记录</h3>
              </div>
              
              {activeSession ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  borderLeft: '3px solid rgba(255,255,255,0.06)',
                  paddingLeft: '1.75rem',
                  marginLeft: '0.5rem',
                  position: 'relative'
                }}>
                  {[
                    { title: 'Patient Met', zh: '已接诊患者', desc: 'Companion met client at the outpatient lobby.' },
                    { title: 'Clinic Queuing', zh: '排队候诊中', desc: 'Registered and queuing outside the consultation room.' },
                    { title: 'Appointment Ongoing', zh: '医生诊疗中', desc: 'Active clinical consultation with doctor.' },
                    { title: 'Payment/Medicine', zh: '代缴费代取药', desc: 'Clearing hospital bills and dispensing prescriptions.' },
                    { title: 'Check-out/Transfer', zh: '就诊结束送回', desc: 'Outpatient checkout complete, returning patient home.' }
                  ].map((step, idx) => {
                    const isDone = idx < activeSession.statusIndex;
                    const isActive = idx === activeSession.statusIndex;
                    return (
                      <div key={idx} style={{ position: 'relative', opacity: isDone || isActive ? 1 : 0.4 }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          backgroundColor: isDone ? 'var(--health)' : isActive ? 'var(--primary)' : '#475569',
                          borderRadius: '50%',
                          position: 'absolute',
                          left: '-27px',
                          top: '4px',
                          border: '3px solid #0b1329',
                          boxShadow: isActive ? '0 0 10px var(--primary)' : isDone ? '0 0 8px var(--health)' : 'none'
                        }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ color: isActive ? 'var(--primary)' : isDone ? 'var(--health)' : '#ffffff', fontSize: '0.9rem' }}>
                            {idx + 1}. {step.title} / {step.zh}
                          </strong>
                          {isDone && <span style={{ color: 'var(--health)', fontSize: '0.75rem' }}>✓ Done</span>}
                          {isActive && <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold' }}>● Active</span>}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.3 }}>
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.75rem',
                  borderLeft: '2px solid rgba(255,255,255,0.06)',
                  paddingLeft: '1.75rem',
                  marginLeft: '0.5rem',
                  position: 'relative'
                }}>
                  {shiftEvents.map((evt, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <div style={{
                        width: '14px',
                        height: '14px',
                        backgroundColor: idx === 0 ? 'var(--primary)' : '#475569',
                        borderRadius: '50%',
                        position: 'absolute',
                        left: '-26px',
                        top: '4px',
                        border: '3px solid #0b1329',
                        boxShadow: idx === 0 ? '0 0 10px var(--primary)' : 'none'
                      }}></div>
                      
                      <span style={{ 
                        fontSize: '0.78rem', 
                        color: idx === 0 ? 'var(--primary)' : 'var(--text-muted)', 
                        fontWeight: 700,
                        background: 'rgba(255,255,255,0.03)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontFamily: 'monospace'
                      }}>
                        {evt.time}
                      </span>
                      
                      <p style={{ 
                        fontSize: '0.92rem', 
                        color: idx === 0 ? '#ffffff' : 'var(--text-muted)', 
                        marginTop: '0.4rem', 
                        lineHeight: 1.45,
                        margin: '0.4rem 0 0 0'
                      }}>
                        {evt.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vitals & Health parameters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Vitals Summary */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <Heart size={22} style={{ color: 'var(--health)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Clinical Vitals Stream / 健康指征监测</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {dailyVitals.map((v, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.06)', 
                      paddingBottom: '0.85rem' 
                    }}>
                      <div>
                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ffffff' }}>
                          BP: {v.bp} &bull; Sugar: {v.sugar}
                        </span>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          💓 Pulse: {v.pulse} &bull; Logged at {v.time} Today
                        </div>
                      </div>
                      <span className="badge badge-active" style={{ padding: '0.25rem 0.6rem' }}>
                        {v.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor Vetted Instructions */}
              {activeSession ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  {/* Doctor Note */}
                  <div className="card" style={{ borderLeft: '5px solid var(--accent)', background: 'linear-gradient(90deg, rgba(245,158,11,0.04) 0%, rgba(30,41,59,0.5) 100%)', margin: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <ShieldAlert size={22} style={{ color: 'var(--accent)' }} />
                      <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff' }}>Doctor's Diagnosis & Note / 医生诊断记录</h3>
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: 'var(--text-main)', 
                      lineHeight: 1.6,
                      background: 'rgba(255,255,255,0.01)',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.03)'
                    }}>
                      <p style={{ margin: '0 0 1rem 0', color: '#cbd5e1' }}>
                        {activeSession.doctorNote || 'No diagnosis instructions logged yet by the companion / 陪诊员暂未录入诊断说明。'}
                      </p>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span><strong>Revisit Date / 建议复诊:</strong> <span style={{ color: 'var(--accent)' }}>{activeSession.revisitDate || 'N/A'}</span></span>
                        <span><strong>Sync Time:</strong> {activeSession.lastUpdated || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Materials Grid */}
                  <div className="card" style={{ margin: 0 }}>
                    <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', color: '#ffffff' }}>
                      Uploaded Receipts & Prescriptions / 诊疗材料与收据
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {activeSession.uploadedPhotos && activeSession.uploadedPhotos.filter(Boolean).length > 0 ? (
                        (() => {
                          const validEscortPhotos = activeSession.uploadedPhotos.filter(Boolean);
                          return validEscortPhotos.map((photo: string, i: number) => (
                            <div 
                              key={i} 
                              onClick={() => {
                                const galleryList = validEscortPhotos.map((url: string) => ({ url, caption: lang === 'zh' ? '陪诊收据/药单附件' : 'Escort Attachment' }));
                                setLightboxPhotos(galleryList);
                                setLightboxIndex(i);
                                setShowLightbox(true);
                              }}
                              style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                overflow: 'hidden',
                                backgroundColor: '#1e293b',
                                cursor: 'pointer'
                              }}
                            >
                              <img src={photo} alt={`Receipt ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ));
                        })()
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                          No prescriptions or receipt photos shared yet / 暂无陪诊员上传分享的药单或收据。
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ borderLeft: '5px solid var(--accent)', background: 'linear-gradient(90deg, rgba(245,158,11,0.04) 0%, rgba(30,41,59,0.5) 100%)', margin: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <ShieldAlert size={22} style={{ color: 'var(--accent)' }} />
                    <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Critical Medical Directives / 医疗核审指示</h3>
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--text-main)', 
                    lineHeight: 1.6,
                    background: 'rgba(255,255,255,0.01)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.03)'
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                      <span>Log blood sugar values 30 minutes prior to serving insulin meals.</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                      <span>Administer morning post-breakfast Aspirin dosage with 250ml water.</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                      <span>Store critical contact protocols near the entrance display panel.</span>
                    </div>
                  </div>
                </div>
              )}

          </div>
        </div>
        )}

      </main>

      {/* Historical Report Preview Modal */}
      {showReportHistoryDetail && selectedReport && (
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
          <div className="card animate-fade-in printable-report" style={{ maxWidth: '640px', width: '100%', padding: '3rem', background: '#ffffff', color: '#1e293b', border: 'none', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ec4899', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.8rem' }}>📜</span>
                <div>
                  <h3 style={{ margin: 0, color: '#ec4899', fontSize: '1.25rem', fontFamily: 'Outfit' }}>
                    {lang === 'zh' ? '历史婴儿健康报告' : 'Historical Baby Health Report'}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>
                    Day {selectedReport.babyAgeDays} - {selectedReport.babyName}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => { setShowReportHistoryDetail(false); setSelectedReport(null); }}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
                <div><strong>Baby Name / 姓名:</strong> {selectedReport.babyName}</div>
                <div><strong>Age Days / 日龄:</strong> {selectedReport.babyAgeDays} Days</div>
                <div><strong>Report Date / 日期:</strong> {selectedReport.date}</div>
                <div><strong>Archived / 归档时间:</strong> {selectedReport.timestamp || 'N/A'}</div>
              </div>

              {/* Vitals */}
              <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>1. Physical Vitals & Jaundice / 婴儿体征</h4>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>🌡️ <strong>Body Temperature:</strong> {selectedReport.healthCheck?.temp || '36.6'} °C</li>
                <li>🍥 <strong>Umbilical Status:</strong> {selectedReport.healthCheck?.umbilicalStatus || 'Dry & Healing'}</li>
                <li>🟡 <strong>Jaundice levels (Forehead):</strong> {selectedReport.healthCheck?.jaundiceForehead || '0.0'} mg/dL</li>
                <li>🟡 <strong>Jaundice levels (Chest):</strong> {selectedReport.healthCheck?.jaundiceChest || '0.0'} mg/dL</li>
                <li>🟡 <strong>Jaundice levels (Cheeks):</strong> {selectedReport.healthCheck?.jaundiceCheeks || '0.0'} mg/dL</li>
              </ul>

              {/* Feed Log */}
              <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>2. Feeding Log / 喂养记录</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
                {selectedReport.feedingLog && selectedReport.feedingLog.length > 0 ? (
                  selectedReport.feedingLog.map((log: any) => (
                    <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span>🕒 {log.time}</span>
                      <span>{log.type === 'Breast' ? `Breastfeed (${log.breastLeftMins}m L / ${log.breastRightMins}m R)` : `Formula Feed (${log.formulaMl}ml)`}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#64748b', fontStyle: 'italic', margin: 0 }}>No feeds logged / 暂无喂奶记录。</p>
                )}
              </div>

              {/* Diaper Record */}
              <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>3. Diaper Output / 排便日志</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {selectedReport.diaperRecord && selectedReport.diaperRecord.length > 0 ? (
                  selectedReport.diaperRecord.map((log: any) => (
                    <div key={log.id} style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '0.2rem' }}>
                        <span>🕒 {log.time}</span>
                        <span style={{ color: '#ec4899' }}>Stool: {log.stoolColor} ({log.texture})</span>
                      </div>
                      <div>Urine: {log.urine} &bull; Stool Amount: {log.amount} {log.notes ? `&bull; Note: ${log.notes}` : ''}</div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#64748b', fontStyle: 'italic', margin: 0 }}>No diaper changes logged / 暂无排便排尿记录。</p>
                )}
              </div>

              {/* Activities */}
              <h4 style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>4. Accomplished Activities / 护理项目</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedReport.sleepActivity?.activities?.bathing && <span style={{ background: '#f0fdf4', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>✓ Bathing / 洗澡</span>}
                {selectedReport.sleepActivity?.activities?.tummyTime && <span style={{ background: '#f0fdf4', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>✓ Tummy Time / 抬头</span>}
                {selectedReport.sleepActivity?.activities?.massage && <span style={{ background: '#f0fdf4', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>✓ Infant Massage / 按摩</span>}
                {selectedReport.sleepActivity?.activities?.music && <span style={{ background: '#f0fdf4', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>✓ Music / 音乐启蒙</span>}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }} className="no-print">
                <button 
                  onClick={() => window.print()}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', background: '#ec4899', color: '#fff', border: 'none', fontWeight: 700 }}
                >
                  🖨️ Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Lightbox
        isOpen={showLightbox}
        photos={lightboxPhotos}
        currentIndex={lightboxIndex}
        onClose={() => setShowLightbox(false)}
        onChangeIndex={setLightboxIndex}
      />

    </div>
  );
}
