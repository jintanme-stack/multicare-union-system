'use client';

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  const [footerInfo, setFooterInfo] = useState({
    address: 'KL Sentral Business Suites, Kuala Lumpur',
    phone: '+60 3-2274 9988',
    email: 'registry@mcsa.com.my',
    desc: ''
  });

  useEffect(() => {
    setLang(store.getLanguage() as Language);
    const info = store.getFooterInfo();
    if (info) {
      setFooterInfo(info);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'mcsa_footer_info') {
        const updatedInfo = store.getFooterInfo();
        if (updatedInfo) {
          setFooterInfo(updatedInfo);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const t = translations[lang] || translations.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const inquiries = store.getInquiries();
    const newInquiry = {
      id: 'INQ-' + Math.floor(100 + Math.random() * 900),
      name,
      contact: email,
      message
    };
    store.setInquiries([newInquiry, ...inquiries]);
    
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(true);
    alert(lang === 'zh' ? '谢谢！您的咨询已被记录到后台数据库中。客服代表将尽快联系您。' : lang === 'bm' ? 'Terima kasih! Pertanyaan anda telah direkodkan dalam pangkalan data. Wakil sokongan akan menghubungi anda.' : 'Thank you! Your inquiry has been logged in our registry database. A support representative will reach out.');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <footer style={{
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '4rem 2rem 2rem 2rem',
      color: '#94a3b8',
      fontSize: '0.9rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr 1fr',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        {/* About column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
            <img 
              src="/mcsa-logo.png" 
              alt="MCSA Logo" 
              style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'white', padding: '2px' }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: 0, fontFamily: 'Outfit', lineHeight: '1.1' }}>
                MCSA MALAYSIA
              </h4>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                marginTop: '2px',
                letterSpacing: '0.05em'
              }}>马来西亚支持关怀总会</span>
            </div>
          </div>
          <p style={{ lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {footerInfo.desc || t.footer.desc}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {footerInfo.address}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> {footerInfo.phone}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {footerInfo.email}</span>
          </div>
        </div>

        {/* Links column */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1.2rem', fontFamily: 'Outfit' }}>
            {t.footer.quickLinks}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t.nav.home}</a></li>
            <li><a href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t.nav.about}</a></li>
            <li><a href="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t.nav.services}</a></li>
            <li><a href="/verify" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t.nav.verify}</a></li>
            <li><a href="/membership" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t.nav.membership}</a></li>
          </ul>
        </div>

        {/* Quick Query column */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1.2rem', fontFamily: 'Outfit' }}>
            {lang === 'zh' ? '客服咨询' : lang === 'bm' ? 'Pertanyaan Sokongan Segera' : 'Quick Support Query'}
          </h4>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="text"
              required
              placeholder={lang === 'zh' ? '您的姓名' : lang === 'bm' ? 'Nama Anda' : 'Your Name'}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              required
              placeholder={lang === 'zh' ? '联系方式 (电话 / 邮箱)' : lang === 'bm' ? 'Telefon atau E-mel' : 'Contact Email or Phone'}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              required
              rows={3}
              placeholder={lang === 'zh' ? '咨询内容描述...' : lang === 'bm' ? 'Butiran pertanyaan anda...' : 'Your inquiry details...'}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                color: '#ffffff',
                fontSize: '0.85rem',
                resize: 'none'
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '0.5rem',
                fontSize: '0.82rem',
                borderRadius: '6px',
                justifyContent: 'center'
              }}
            >
              <Send size={14} /> {lang === 'zh' ? '提交咨询给后台' : lang === 'bm' ? 'Hantar Pertanyaan' : 'Submit Query to Admin'}
            </button>
          </form>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '1.5rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        {t.footer.copyright}
      </div>
    </footer>
  );
}
