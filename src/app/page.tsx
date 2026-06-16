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

  // Time Bank Volunteer States
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volNric, setVolNric] = useState('');
  const [volCategories, setVolCategories] = useState<string[]>([]);
  const [volPassword, setVolPassword] = useState('');
  const [volMotivation, setVolMotivation] = useState('');
  const [volSuccessMsg, setVolSuccessMsg] = useState('');
  const [volErrorMsg, setVolErrorMsg] = useState('');
  const [isRegisteringVol, setIsRegisteringVol] = useState(false);

  const handleRegisterVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    setVolErrorMsg('');
    setVolSuccessMsg('');
    setIsRegisteringVol(true);

    try {
      const cleanEmail = volEmail.trim().toLowerCase();
      
      // 1. SignUp via Supabase Auth
      try {
        await store.signUp(cleanEmail, volPassword);
      } catch (err: any) {
        console.warn('Supabase signup bypassed or error:', err.message);
      }

      // 2. Add to timebank volunteers list in store
      const volunteers = store.getVolunteers();
      const exists = volunteers.some((v: any) => v.email === cleanEmail);
      if (exists) {
        setVolErrorMsg(lang === 'zh' ? '⚠️ 该邮箱已被注册！' : '⚠️ This email is already registered.');
        setIsRegisteringVol(false);
        return;
      }

      const newVol = {
        id: `VOL-${Math.floor(100 + Math.random() * 900)}`,
        name: volName,
        email: cleanEmail,
        phone: volPhone,
        nric: volNric,
        status: 'Pending', // Requires Admin approval
        categories: volCategories.length > 0 ? volCategories : ['General Service'],
        credits: 0,
        rank: 'Bronze Companion',
        badges: [],
        joinedDate: new Date().toISOString().split('T')[0],
        motivation: volMotivation
      };

      await store.appendVolunteer(newVol);
      
      setVolSuccessMsg(lang === 'zh' 
        ? '🎉 义工加入申请提交成功！您的账户目前处于“待审核 (Pending)”状态。公会管理员审核通过后，您将可以使用该账户登录并访问您的关爱时间银行面板。'
        : '🎉 Volunteer application submitted successfully! Your account is currently "Pending" approval. Once audited by MCSA admin, you can log in to your Care Time Bank panel.');

      // Clear fields
      setVolName('');
      setVolEmail('');
      setVolPhone('');
      setVolNric('');
      setVolCategories([]);
      setVolPassword('');
      setVolMotivation('');
    } catch (err: any) {
      setVolErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsRegisteringVol(false);
    }
  };

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

    const saveRequest = async (userId?: string) => {
      const newReq = {
        id: 'REQ-' + Math.floor(100 + Math.random() * 900),
        name: clientName,
        contact,
        email: clientEmail,
        accessKey: generatedKey,
        category,
        message,
        user_id: userId || null,
        date: new Date().toISOString().split('T')[0]
      };

      await (store as any).appendCareRequest(newReq);
      setRequests(prev => [newReq, ...prev]);

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

    // Auto-provision Supabase Auth account
    store.signUp(clientEmail, generatedKey)
      .then((res) => {
        saveRequest(res.data.user?.id);
      })
      .catch((err) => {
        console.error('Client auto-signup failed, saving request locally:', err.message);
        saveRequest();
      });
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
        }} className="hero-grid">
          {/* Left Column: Text Content */}
          <div>
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
              src="/malaysian-care-real.jpg" 
              alt="Malaysian Diverse Care Group" 
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
        }} className="responsive-grid-4">
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

      {/* Care Time Bank Showcase Section */}
      <section style={{ 
        padding: '5rem 2rem', 
        borderTop: '1px solid rgba(10, 186, 181, 0.15)', 
        backgroundColor: 'var(--bg-card)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow effects */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10, 186, 181, 0.1) 0%, rgba(10, 186, 181, 0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', zIndex: 2, position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            
            {/* Left Column: Concept Introduction */}
            <div>
              <span className="badge badge-active" style={{ marginBottom: '1rem', backgroundColor: '#f59e0b', color: '#ffffff', borderColor: '#f59e0b' }}>
                ⏳ MCSA Care Time Bank / 关爱时间银行
              </span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', lineHeight: '1.2', fontFamily: 'Outfit, sans-serif' }}>
                {lang === 'zh' ? '用时间传递关爱，让奉献有迹可循' : 'Pay with Time, Gain with Love'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {lang === 'zh' 
                  ? '“关爱时间银行 (Care Time Bank)”是 MCSA 马来西亚支持关怀总会发起的社会互助机制。在这里，您付出的不是金钱，而是您的时间与爱心。'
                  : 'The Care Time Bank is a mutual support program by MCSA. Here, you contribute your time instead of money. Every hour of service earns you Time Credits that build a stronger community.'}
              </p>

              {/* Conversion Flow Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(10, 186, 181, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0bab5' }}>
                    <Heart size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {lang === 'zh' ? '1. 付出志愿服务' : '1. Volunteer Service'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {lang === 'zh' ? '陪同就医、教导电脑、社区清洁、长者陪伴等' : 'Accompany elders, teach digital skills, clean centers, etc.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                    <PlusCircle size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {lang === 'zh' ? '2. 积累时间积分 (1小时 = 1积分)' : '2. Accumulate Credits (1 Hour = 1 Credit)'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {lang === 'zh' ? '服务记录经公会核验通过后，积分自动发放至您的时间账户' : 'Approved hours are credited directly into your virtual time account.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {lang === 'zh' ? '3. 兑换丰厚回报' : '3. Redeem Rewards'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {lang === 'zh' ? '兑换专业护理认证课程、健康理疗按摩、超市与餐饮优惠券等' : 'Redeem for professional training courses, body massage, or store vouchers.'}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => setShowVolunteerModal(true)}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem' }}
                >
                  {lang === 'zh' ? '申请加入关爱时间银行' : 'Register as Volunteer'}
                </button>
                <a 
                  href="/login?tab=volunteer"
                  className="btn btn-outline"
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {lang === 'zh' ? '登录义工中心' : 'Volunteer Login'}
                </a>
              </div>
            </div>

            {/* Right Column: Visual Showcase Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)'
            }} className="card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem', textAlign: 'center' }}>
                {lang === 'zh' ? '💡 时间积分价值对照示范' : '💡 Example Conversion Rates'}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Task 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>
                      {lang === 'zh' ? '陪同孤寡老人到医院看诊' : 'Accompany lonely elder to hospital checkup'}
                    </h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'zh' ? '服务时长：2 小时' : 'Duration: 2 Hours'}</span>
                  </div>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#d97706', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                    +2 {lang === 'zh' ? '时间积分' : 'Credits'}
                  </span>
                </div>

                {/* Task 2 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>
                      {lang === 'zh' ? '参与社区活动中心清洁除尘' : 'Clean up community activity center'}
                    </h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'zh' ? '服务时长：3 小时' : 'Duration: 3 Hours'}</span>
                  </div>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#d97706', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                    +3 {lang === 'zh' ? '时间积分' : 'Credits'}
                  </span>
                </div>

                {/* Task 3 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>
                      {lang === 'zh' ? '教导老人在智能手机上安装软件' : 'Teach senior to install apps on smartphone'}
                    </h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'zh' ? '服务时长：1 小时' : 'Duration: 1 Hour'}</span>
                  </div>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#d97706', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                    +1 {lang === 'zh' ? '时间积分' : 'Credits'}
                  </span>
                </div>

                {/* Arrow indicator */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '0.2rem 0' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgba(10, 186, 181, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    ↓
                  </div>
                </div>

                {/* Redemption Demonstration */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10, 186, 181, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(10, 186, 181, 0.15)' }}>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#088c87', fontWeight: 800 }}>
                      {lang === 'zh' ? '兑换：专业急救与 CPR 认证课' : 'Redeem: Basic First Aid & CPR Course'}
                    </h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'zh' ? '公会官方高级实操课程' : 'Official MCSA Certification Course'}</span>
                  </div>
                  <span style={{ backgroundColor: '#0abab5', color: '#ffffff', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                    -15 {lang === 'zh' ? '时间积分' : 'Credits'}
                  </span>
                </div>

                {/* Wellness Demonstration */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#059669', fontWeight: 800 }}>
                      {lang === 'zh' ? '兑换：1小时专业理疗按摩代金券' : 'Redeem: 1-Hr Body Massage Voucher'}
                    </h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'zh' ? '公会合作健康护理机构提供' : 'Offered by Partner Wellness Centers'}</span>
                  </div>
                  <span style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                    -12 {lang === 'zh' ? '时间积分' : 'Credits'}
                  </span>
                </div>

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

      {/* Volunteer Registration Modal */}
      {showVolunteerModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div 
            className="animate-scale-in"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              maxWidth: '520px',
              width: '100%',
              padding: '2.5rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <button
              onClick={() => {
                setShowVolunteerModal(false);
                setVolSuccessMsg('');
                setVolErrorMsg('');
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <Heart size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {lang === 'zh' ? '申请加入关爱时间银行' : 'Register for Care Time Bank'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {lang === 'zh' ? '付出时间，积累积分，回馈社会，兑换成长' : 'Contribute your time, earn credits, support community.'}
              </p>
            </div>

            {volSuccessMsg ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ color: '#10b981', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  {volSuccessMsg}
                </div>
                <button
                  onClick={() => {
                    setShowVolunteerModal(false);
                    setVolSuccessMsg('');
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px' }}
                >
                  {lang === 'zh' ? '好的，我知道了' : 'Got it'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterVolunteer}>
                {volErrorMsg && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {volErrorMsg}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">{lang === 'zh' ? '姓名 (Full Name)' : 'Full Name'}</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ width: '100%' }}
                    placeholder={lang === 'zh' ? '请输入您的真实姓名' : 'Enter your name'}
                    value={volName}
                    onChange={(e) => setVolName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">{lang === 'zh' ? '邮箱 (Email)' : 'Email'}</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      style={{ width: '100%' }}
                      placeholder="name@example.com"
                      value={volEmail}
                      onChange={(e) => setVolEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{lang === 'zh' ? '联系电话 (Phone)' : 'Phone Number'}</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      style={{ width: '100%' }}
                      placeholder="e.g. 0123456789"
                      value={volPhone}
                      onChange={(e) => setVolPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'zh' ? '身份证/护照号 (NRIC / Passport)' : 'NRIC / Passport'}</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ width: '100%' }}
                    placeholder="e.g. 900101-14-5555"
                    value={volNric}
                    onChange={(e) => setVolNric(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'zh' ? '设置登录密码 (Password)' : 'Set Password'}</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    style={{ width: '100%' }}
                    placeholder="Min 6 characters"
                    value={volPassword}
                    onChange={(e) => setVolPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'zh' ? '意向志愿领域 (Preferred Service)' : 'Preferred Categories'}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    {[
                      { val: 'Elderly Support', zh: '陪同长者看诊', en: 'Elderly Escort' },
                      { val: 'Community Service', zh: '社区中心清洁', en: 'Community Service' },
                      { val: 'Digital Teaching', zh: '智能手机教学', en: 'Digital Teaching' },
                      { val: 'Companionship', zh: '日常陪伴聊天', en: 'Companionship' }
                    ].map((item) => {
                      const isChecked = volCategories.includes(item.val);
                      return (
                        <label key={item.val} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setVolCategories(volCategories.filter(c => c !== item.val));
                              } else {
                                setVolCategories([...volCategories, item.val]);
                              }
                            }}
                          />
                          {lang === 'zh' ? item.zh : item.en}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'zh' ? '申请理由与特长 (Motivation & Skills)' : 'Motivation & Skills'}</label>
                  <textarea
                    className="form-input"
                    style={{ width: '100%', height: '80px', resize: 'none', padding: '0.5rem' }}
                    placeholder={lang === 'zh' ? '简述您的志愿经验或特长...' : 'Tell us about your volunteering experience or special skills...'}
                    value={volMotivation}
                    onChange={(e) => setVolMotivation(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isRegisteringVol}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', marginTop: '1rem' }}
                >
                  {isRegisteringVol ? (lang === 'zh' ? '正在提交...' : 'Submitting...') : (lang === 'zh' ? '提交义工申请' : 'Submit Application')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
