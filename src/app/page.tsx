'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Lightbox from '@/components/Lightbox';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';
import { Shield, PlusCircle, CheckCircle, Search, HelpCircle, Heart, Users, MapPin, Phone, Megaphone } from 'lucide-react';

export default function HomePage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [clientName, setClientName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('Confinement Care');
  const [message, setMessage] = useState('');

  const [lang, setLang] = useState<Language>('en');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activityPhotos, setActivityPhotos] = useState<any[]>([]);
  
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setRequests(store.getCareRequests());
    setLang(store.getLanguage() as Language);
    setAnnouncements(store.getAnnouncements());
    setActivityPhotos(store.getActivityPhotos());
  }, []);

  const handlePostRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !contact || !message) return;

    const generatedKey = Math.floor(100000 + Math.random() * 900000).toString();
    const clientEmail = contact.includes('@') ? contact.trim() : `${clientName.toLowerCase().replace(/\s+/g, '')}@mcsa.com.my`;

    const newReq = {
      id: 'REQ-' + Math.floor(100 + Math.random() * 900),
      name: clientName,
      contact,
      email: clientEmail,
      accessKey: generatedKey,
      category,
      message,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newReq, ...requests];
    setRequests(updated);
    store.setCareRequests(updated);

    setClientName('');
    setContact('');
    setMessage('');

    const alertMsg = lang === 'zh'
      ? `🎉 照护需求发布成功！\n\n您的家属追踪门户登录凭证如下：\n📧 联络邮箱：${clientEmail}\n🔑 安全访问密钥 (Access Key)：${generatedKey}\n\n💡 提示：您可以使用此邮箱与密钥登录 [Family Portal / 家属实时门诊追踪通道]，随时查看健康记录与看护进度。请妥善保存！`
      : lang === 'bm'
      ? `🎉 Permohonan Penjagaan Berjaya Dihantar!\n\nButiran log masuk Portal Keluarga anda:\n📧 E-mel: ${clientEmail}\n🔑 Kunci Akses (Access Key): ${generatedKey}\n\n💡 Info: Sila simpan kredensial ini! Anda boleh menggunakannya untuk log masuk ke [Family Portal] untuk menjejaki kemajuan penjagaan secara langsung.`
      : `🎉 Care Request Posted Successfully!\n\nYour Family Portal login credentials:\n📧 Contact Email: ${clientEmail}\n🔑 Secure Access Key (Access Key): ${generatedKey}\n\n💡 Info: Please save these details! You can use them to log into the [Family Portal] to track live care progress and logs.`;
    alert(alertMsg);
  };

  const t = translations[lang] || translations.en;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem',
        position: 'relative',
        background: 'linear-gradient(135deg, #f0fbfb 0%, #ffffff 100%)',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '4rem',
          alignItems: 'center',
        }} className="grid-cols-2">
          {/* Left Column: Text Content */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <img 
                src="/mcsa-logo.png" 
                alt="MCSA Logo" 
                style={{ display: 'block', width: '64px', height: '64px', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(10, 186, 181, 0.2))' }} 
              />
              <span className="badge badge-pending" style={{ display: 'inline-block', padding: '0.4rem 1rem', margin: 0 }}>
                🏆 {lang === 'zh' ? '马来西亚优质认证护理人员公会' : lang === 'bm' ? 'Persatuan Penjaga Bertauliah Terkemuka' : 'Top Accredited Caregiver Association'}
              </span>
            </div>
            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              fontFamily: 'Outfit, sans-serif',
              color: '#0f172a'
            }}>
              {t.home.heroTitle}
            </h1>
            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '2.5rem'
            }}>
              {t.home.heroSubtitle}
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="/register" className="btn btn-primary" style={{ padding: '0.9rem 2rem', borderRadius: '12px' }}>
                ✍️ {t.home.registerBtn}
              </a>
              <a href="/verify" className="btn btn-outline" style={{ padding: '0.9rem 2rem', borderRadius: '12px', borderColor: '#0abab5', color: '#088c87' }}>
                🔍 {t.home.verifyBtn}
              </a>
            </div>
          </div>

          {/* Right Column: Illustration */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Backdrop Glow */}
            <div style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'rgba(10, 186, 181, 0.15)',
              filter: 'blur(50px)',
              zIndex: 0
            }}></div>
            <img 
              src="/malaysian-care-hero.png" 
              alt="Malaysian Diverse Care" 
              style={{
                width: '100%',
                maxWidth: '460px',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(10, 186, 181, 0.12)',
                border: '1px solid rgba(255,255,255,0.8)',
                zIndex: 1,
                position: 'relative'
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats Board */}
      <section style={{ padding: '2rem 2rem 4rem 2rem' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem'
        }}>
          {[
            { num: '10,000+', title: lang === 'zh' ? '认证公会会员' : lang === 'bm' ? 'Ahli Bertauliah' : 'Accredited Members' },
            { num: '50+', title: lang === 'zh' ? '合作医疗机构' : lang === 'bm' ? 'Hospital Rakan Kongsi' : 'Partner Hospitals' },
            { num: '100% Vetted', title: lang === 'zh' ? '结核病与全面体检' : lang === 'bm' ? 'Saringan TB & Kesihatan' : 'TB & Health Clearance' },
            { num: 'RM 350/yr', title: lang === 'zh' ? '实惠的年度考核' : lang === 'bm' ? 'Yuran Lesen Mampu Milik' : 'Affordable Licensure' }
          ].map((stat, idx) => (
            <div key={idx} className="card" style={{ textAlign: 'center', padding: '1.5rem', margin: 0 }}>
              <h3 style={{ fontSize: '2rem', color: '#0abab5', margin: '0 0 0.25rem 0' }}>{stat.num}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{stat.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cooperating Partners Section */}
      <section style={{ padding: '3rem 2rem', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f0fbfb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <span className="badge badge-active" style={{ marginBottom: '0.75rem' }}>{lang === 'zh' ? '战略合作伙伴单位' : lang === 'bm' ? 'Rakan Kongsi Saringan Strategik' : 'Strategic Vetting Partner'}</span>
            <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '1rem', fontFamily: 'Outfit' }}>
              {t.home.partnerTitle}
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
              {t.home.partnerDesc}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1 1 400px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Caredemy Logo */}
            <div style={{
              background: '#ffffff',
              padding: '1.25rem',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(10, 186, 181, 0.08)',
              border: '1px solid rgba(10, 186, 181, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '180px',
              height: '180px',
              justifyContent: 'center'
            }}>
              <img 
                src="/caredemy-logo.jpg" 
                alt="Caredemy Logo" 
                style={{ width: '100%', height: 'auto', maxHeight: '95px', objectFit: 'contain' }} 
              />
              <span style={{ fontSize: '0.65rem', color: '#088c87', fontWeight: 'bold', marginTop: '0.5rem', letterSpacing: '0.05em', textAlign: 'center' }}>
                CAREDEMY TRAINING CENTER
              </span>
            </div>

            {/* A+ Assist Logo Link */}
            <a 
              href="https://www.facebook.com/share/g/1EKSwSZ9Nj/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ textDecoration: 'none', display: 'block', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: '16px',
                boxShadow: '0 8px 30px rgba(10, 186, 181, 0.08)',
                border: '1px solid rgba(10, 186, 181, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '180px',
                height: '180px',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <img 
                  src="/aplus-assist-logo.jpg" 
                  alt="A+ Assist Logo" 
                  style={{ width: '100%', height: 'auto', maxHeight: '135px', objectFit: 'contain', borderRadius: '8px' }} 
                />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Announcements Notice Board */}
      <section style={{ padding: '4rem 2rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fcfdfd' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-pending" style={{ marginBottom: '0.75rem', padding: '0.3rem 0.8rem' }}>
              📢 {t.home.bulletinTitle}
            </span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.home.bulletinSubtitle}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {announcements.map((ann) => (
              <div key={ann.id} className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: '1.5rem', borderLeft: '3px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-active" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>{ann.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📅 {ann.date}</span>
                </div>
                <h4 style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{ann.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Demands Board (Dual Column Split) */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: '#0f172a' }}>{t.home.demandTitle} / {lang === 'zh' ? '实时诉求发布' : lang === 'bm' ? 'Siaran Permintaan Langsung' : 'Live Demand Broadcast'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{t.home.demandSubtitle}</p>
          </div>

          {/* Family Portal Login Reminder & Security Guard Notice */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fbfb 0%, #ffffff 100%)',
            border: '1px solid rgba(10, 186, 181, 0.15)',
            borderLeft: '5px solid var(--primary)',
            padding: '1.75rem 2.25rem',
            borderRadius: '20px',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            textAlign: 'left',
            boxShadow: '0 10px 30px rgba(10, 186, 181, 0.04)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'var(--primary-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Shield size={28} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '0 0 0.4rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
                {lang === 'zh' ? '🔒 家属追踪门户安全登录指引' : lang === 'bm' ? '🔒 Panduan Log Masuk Portal Keluarga Selamat' : '🔒 Secure Family Portal Access Guide'}
                <span className="badge badge-active" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--health)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  {lang === 'zh' ? '安全认证加密' : lang === 'bm' ? 'Diverifikasi' : 'Security Vetted'}
                </span>
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {lang === 'zh' 
                  ? '所有发布护理需求的家属均会获得系统生成的 6 位安全访问密钥 (Access Key)。您可以通过顶栏的“公会入口”选择“患者家属”面板，使用您的联络邮箱和密钥登录，实时追踪护理员的每日生命体征、康复进度及母婴照护日志。我们的系统已实施严格 of 二段匹配鉴权，以确保您的隐私绝不外泄。'
                  : lang === 'bm'
                  ? 'Setiap permohonan penjagaan akan menjana Kunci Akses 6-digit yang selamat. Anda boleh log masuk di tab "Portal Keluarga" melalui butang "Portal Kesatuan" di atas menggunakan e-mel serta kunci tersebut untuk menjejaki catatan harian dan laporan kesihatan pesakit secara masa nyata.'
                  : 'Every posted care request generates a unique 6-digit Secure Access Key. Click "Union Portal" at the top, select the "Family Portal" tab, and log in with your contact email and access key to view real-time health diaries, newborn logs, and shift milestones. Our strict credential-matching keeps your family data safe.'}
              </p>
              <div style={{ marginTop: '0.85rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <a href="/login" style={{ fontSize: '0.82rem', color: '#088c87', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  🔑 {lang === 'zh' ? '立即前往家属登录入口' : lang === 'bm' ? 'Log Masuk Portal Keluarga Sekarang' : 'Go to Family Login Portal'} &rarr;
                </a>
              </div>
            </div>
          </div>

          <div className="grid-cols-2">
            {/* Left: Request Form */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <PlusCircle size={20} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>{t.home.postDemandTitle}</h3>
              </div>
              <form onSubmit={handlePostRequest}>
                <div className="form-group">
                  <label className="form-label">{t.home.nameLabel}</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Mrs. Lim"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t.home.contactLabel}</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. 012-3456789 (Will be blurred)"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t.home.categoryLabel}</label>
                  <select
                    className="form-input"
                    style={{ background: 'var(--bg-input)', color: 'var(--text-main)', cursor: 'pointer', border: '1.5px solid var(--border)' }}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Confinement Care">🍼 {lang === 'zh' ? '月嫂 / 坐月护理 (Confinement Care)' : lang === 'bm' ? 'Penjaga Berpantang' : 'Confinement Care'}</option>
                    <option value="Patient Companion">🏥 {lang === 'zh' ? '就医陪诊 / 陪诊员 (Patient Companion)' : lang === 'bm' ? 'Peneman Pesakit' : 'Patient Companion'}</option>
                    <option value="Elderly Caregiver">👴 {lang === 'zh' ? 'Elderly Caregiver / 养老护理员' : lang === 'bm' ? 'Penjaga Warga Emas' : 'Elderly Caregiver'}</option>
                    <option value="Rehabilitation Care Assistant">💪 {lang === 'zh' ? 'Rehab Therapist / 康复助理' : lang === 'bm' ? 'Pembantu Rehab' : 'Rehab Assistant'}</option>
                    <option value="Babysitter Service">👶 {lang === 'zh' ? 'Babysitter / 专业保姆' : lang === 'bm' ? 'Pengasuh Bayi' : 'Babysitter Service'}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{lang === 'zh' ? '您的具体要求 (预产期、地点、预算等)' : lang === 'bm' ? 'Keperluan Penjagaan Anda (Tarikh, lokasi, bajet)' : 'Your Care Demands (Dates, location, budget)'}</label>
                  <textarea
                    required
                    rows={4}
                    className="form-input"
                    style={{ resize: 'none' }}
                    placeholder="e.g., My due date is Dec 2nd 2026, looking for a confinement lady in Puchong location."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  📢 {t.home.submitRequest}
                </button>
              </form>
            </div>

            {/* Right: Demand Listing Board */}
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--health)' }} /> {lang === 'zh' ? '公开护理调度单' : lang === 'bm' ? 'Tugasan Terbuka Awam' : 'Active Client Dispatches'} ({requests.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {requests.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No care requests posted yet.</p>
                ) : (
                  requests.map((req) => (
                    <div key={req.id} className="card" style={{ margin: 0, padding: '1.25rem', borderLeft: '4px solid var(--accent)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span className="badge badge-active" style={{ fontSize: '0.72rem' }}>{req.category}</span>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className={`badge ${req.status === 'accepted' ? 'badge-active' : 'badge-pending'}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', border: req.status === 'accepted' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(245,158,11,0.2)' }}>
                            {req.status === 'accepted' 
                              ? (lang === 'zh' ? '已匹配派单' : lang === 'bm' ? 'Tugasan Dipadankan' : 'Assigned') 
                              : (lang === 'zh' ? '寻找看护中' : lang === 'bm' ? 'Mencari Penjaga' : 'Matching...')}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📅 {req.date}</span>
                        </div>
                      </div>
                      <h4 style={{ color: '#0f172a', fontSize: '1.05rem', margin: '0 0 0.5rem 0' }}>Request by: {req.name}</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 1rem 0' }}>
                        "{req.message}"
                      </p>
                      
                      {/* Phone Masking System */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(240, 251, 251, 0.5)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        border: '1px dashed rgba(10, 186, 181, 0.2)',
                        color: '#1e293b'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Phone size={14} style={{ color: 'var(--accent)' }} />
                          <span>{lang === 'zh' ? '联系电话: ' : lang === 'bm' ? 'Telefon: ' : 'Contact: '} </span>
                          <span style={{ 
                            filter: 'blur(4px)', 
                            backgroundColor: '#cbd5e1', 
                            padding: '0 0.5rem', 
                            borderRadius: '3px',
                            userSelect: 'none'
                          }}>
                            {req.contact}
                          </span>
                        </div>
                        <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
                          🔒 {lang === 'zh' ? '会员登录后查看' : lang === 'bm' ? 'Log Masuk Ahli untuk Lihat' : 'Member Login to View'}
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Photos Section */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#fcfdfd' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-active" style={{ marginBottom: '0.75rem' }}>📸 {lang === 'zh' ? '实操培训与公会活动' : lang === 'bm' ? 'Aktiviti Latihan & Kesatuan Serta-Merta' : 'On-Site Training & Union Activities'}</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: '#0f172a' }}>{lang === 'zh' ? '最新护理员考核与毕业掠影' : lang === 'bm' ? 'Kemuncak Penilaian & Graduasi Penjaga Terkini' : 'Latest Caregiver Vetting & Graduation Highlights'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{lang === 'zh' ? '在公会认证培训基地进行的合规认证、诊断筛查以及模拟演练。' : lang === 'bm' ? 'Sijil penilaian kecekapan, pemeriksaan kesihatan, dan latihan simulasi di tapak latihan rasmi kami.' : 'Vetting certifications, diagnostic clearances, and simulation drills at our designated training base.'}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {activityPhotos.map((photo, index) => (
              <div 
                key={photo.id} 
                onClick={() => {
                  setLightboxIndex(index);
                  setShowLightbox(true);
                }}
                className="card animate-fade-in" 
                style={{ padding: 0, overflow: 'hidden', margin: 0, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              >
                <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(10, 186, 181, 0.85)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', color: '#ffffff', fontWeight: 'bold' }}>
                    {lang === 'zh' ? '公会活动' : lang === 'bm' ? 'Aktiviti Kesatuan' : 'MCSA Activity'}
                  </span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: '#0f172a', fontSize: '1.15rem', marginBottom: '0.5rem' }}>{photo.caption}</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {lang === 'zh' ? '在公会官方认证培训基地进行的高标准专业实操考核或急救演练。' : lang === 'bm' ? 'Penilaian praktikal standard tinggi atau latihan kecemasan yang dijalankan di pusat latihan rasmi.' : 'High-standard professional practical assessment or emergency drill conducted at our designated training base.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <Lightbox 
        isOpen={showLightbox}
        photos={activityPhotos}
        currentIndex={lightboxIndex}
        onClose={() => setShowLightbox(false)}
        onChangeIndex={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
