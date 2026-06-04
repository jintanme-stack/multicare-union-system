'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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

  useEffect(() => {
    setRequests(store.getCareRequests());
    setLang(store.getLanguage() as Language);
    setAnnouncements(store.getAnnouncements());
    setActivityPhotos(store.getActivityPhotos());
  }, []);

  const handlePostRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !contact || !message) return;

    const newReq = {
      id: 'REQ-' + Math.floor(100 + Math.random() * 900),
      name: clientName,
      contact,
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
    alert('Care request posted successfully! It will appear on our caregivers dispatch timeline boards.');
  };

  const t = translations[lang] || translations.en;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        background: 'radial-gradient(circle at center, rgba(37,99,235,0.15) 0%, transparent 60%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img 
            src="/mcsa-logo.png" 
            alt="MCSA Logo" 
            style={{ width: '110px', height: '110px', objectFit: 'contain', margin: '0 auto 1.5rem auto', filter: 'drop-shadow(0 4px 10px rgba(37,99,235,0.25))' }} 
          />
          <span className="badge badge-pending" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
            🏆 {lang === 'zh' ? '马来西亚优质认证护理人员工会 / MCSA 官方网站' : lang === 'bm' ? 'Persatuan Penjaga Bertauliah Terkemuka di Malaysia' : 'Top Accredited Caregiver Association in Malaysia'}
          </span>
          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            fontFamily: 'Outfit, sans-serif'
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
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/register" className="btn btn-primary" style={{ padding: '0.9rem 2rem', borderRadius: '12px' }}>
              ✍️ {t.home.registerBtn}
            </a>
            <a href="/verify" className="btn btn-outline" style={{ padding: '0.9rem 2rem', borderRadius: '12px' }}>
              🔍 {t.home.verifyBtn}
            </a>
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
            { num: '10,000+', title: lang === 'zh' ? '认证工会会员' : lang === 'bm' ? 'Ahli Bertauliah' : 'Accredited Members' },
            { num: '50+', title: lang === 'zh' ? '合作医疗机构' : lang === 'bm' ? 'Hospital Rakan Kongsi' : 'Partner Hospitals' },
            { num: '100% Vetted', title: lang === 'zh' ? '结核病与全面体检' : lang === 'bm' ? 'Saringan TB & Kesihatan' : 'TB & Health Clearance' },
            { num: 'RM 350/yr', title: lang === 'zh' ? '实惠的年度考核' : lang === 'bm' ? 'Yuran Lesen Mampu Milik' : 'Affordable Licensure' }
          ].map((stat, idx) => (
            <div key={idx} className="card" style={{ textAlign: 'center', padding: '1.5rem', margin: 0 }}>
              <h3 style={{ fontSize: '2rem', color: '#60a5fa', margin: '0 0 0.25rem 0' }}>{stat.num}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{stat.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cooperating Partners Section */}
      <section style={{ padding: '3rem 2rem', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)', backgroundColor: 'rgba(15, 23, 42, 0.2)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <span className="badge badge-active" style={{ marginBottom: '0.75rem' }}>{lang === 'zh' ? '战略合作伙伴单位' : lang === 'bm' ? 'Rakan Kongsi Saringan Strategik' : 'Strategic Vetting Partner'}</span>
            <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '1rem', fontFamily: 'Outfit' }}>
              {t.home.partnerTitle}
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
              {t.home.partnerDesc}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1 1 300px', justifyContent: 'center' }}>
            <div style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '240px'
            }}>
              <img 
                src="/caredemy-logo.jpg" 
                alt="Caredemy Logo" 
                style={{ width: '100%', height: 'auto', maxHeight: '130px', objectFit: 'contain' }} 
              />
              <span style={{ fontSize: '0.75rem', color: '#1e3a8a', fontWeight: 'bold', marginTop: '0.75rem', letterSpacing: '0.05em' }}>
                CAREDEMY TRAINING CENTER
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Notice Board */}
      <section style={{ padding: '4rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.03)', backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
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
                <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{ann.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Demands Board (Dual Column Split) */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{t.home.demandTitle} / {lang === 'zh' ? '实时诉求发布' : lang === 'bm' ? 'Siaran Permintaan Langsung' : 'Live Demand Broadcast'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{t.home.demandSubtitle}</p>
          </div>

          <div className="grid-cols-2">
            {/* Left: Request Form */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <PlusCircle size={20} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{t.home.postDemandTitle}</h3>
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
                    style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Confinement Care">🍼 {lang === 'zh' ? 'Confinement Lady / 月嫂' : lang === 'bm' ? 'Penjaga Berpantang' : 'Confinement Care'}</option>
                    <option value="Patient Companion">🏥 {lang === 'zh' ? 'Patient Companion / 陪诊人员' : lang === 'bm' ? 'Peneman Pesakit' : 'Patient Companion'}</option>
                    <option value="Elderly Caregiver">👴 {lang === 'zh' ? 'Elderly Caregiver / 养老护理员' : lang === 'bm' ? 'Penjaga Warga Emas' : 'Elderly Caregiver'}</option>
                    <option value="Rehabilitation Care Assistant">💪 {lang === 'zh' ? 'Rehab Therapist / 康复助理' : lang === 'bm' ? 'Pembantu Rehab' : 'Rehab Assistant'}</option>
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
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📅 {req.date}</span>
                      </div>
                      <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: '0 0 0.5rem 0' }}>Request by: {req.name}</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 1rem 0' }}>
                        "{req.message}"
                      </p>
                      
                      {/* Phone Masking System */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(15,23,42,0.3)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        border: '1px dashed rgba(255,255,255,0.06)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Phone size={14} style={{ color: 'var(--accent)' }} />
                          <span>{lang === 'zh' ? '联系电话: ' : lang === 'bm' ? 'Telefon: ' : 'Contact: '} </span>
                          <span style={{ 
                            filter: 'blur(4px)', 
                            backgroundColor: '#475569', 
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
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-active" style={{ marginBottom: '0.75rem' }}>📸 {lang === 'zh' ? '实操培训与公会活动' : lang === 'bm' ? 'Aktiviti Latihan & Kesatuan Serta-Merta' : 'On-Site Training & Union Activities'}</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>{lang === 'zh' ? '最新护理员考核与毕业掠影' : lang === 'bm' ? 'Kemuncak Penilaian & Graduasi Penjaga Terkini' : 'Latest Caregiver Vetting & Graduation Highlights'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{lang === 'zh' ? '在工会认证培训基地进行的合规认证、诊断筛查以及模拟演练。' : lang === 'bm' ? 'Sijil penilaian kecekapan, pemeriksaan kesihatan, dan latihan simulasi di tapak latihan rasmi kami.' : 'Vetting certifications, diagnostic clearances, and simulation drills at our designated training base.'}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {activityPhotos.map((photo) => (
              <div key={photo.id} className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden', margin: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15,23,42,0.85)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 'bold' }}>
                    {lang === 'zh' ? '工会活动' : lang === 'bm' ? 'Aktiviti Kesatuan' : 'MCSA Activity'}
                  </span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '0.5rem' }}>{photo.caption}</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {lang === 'zh' ? '在工会官方认证培训基地进行的高标准专业实操考核或急救演练。' : lang === 'bm' ? 'Penilaian praktikal standard tinggi atau latihan kecemasan yang dijalankan di pusat latihan rasmi.' : 'High-standard professional practical assessment or emergency drill conducted at our designated training base.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
