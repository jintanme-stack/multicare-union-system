'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Eye, EyeOff } from 'lucide-react';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';

export default function EntryPage() {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member' | 'client'>('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    setLang(store.getLanguage() as Language);
  }, []);

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (selectedRole === 'admin') {
        if (password === 'Drjin3194') {
          window.location.href = '/admin';
        } else {
          setErrorMessage(lang === 'zh' ? '管理员授权密码错误，拒接访问。' : lang === 'bm' ? 'Kod pentadbir salah. Akses ditolak.' : 'Incorrect admin code. Access denied.');
        }
      } else if (selectedRole === 'member') {
        if (password === '123456') {
          const members = store.getUnionMembers();
          const found = members.find((m: any) => m.email.toLowerCase() === email.toLowerCase() || m.member_number.toLowerCase() === email.toLowerCase());
          
          if (found) {
            localStorage.setItem('mcsa_logged_member', JSON.stringify(found));
          } else {
            localStorage.setItem('mcsa_logged_member', JSON.stringify(members[0]));
          }
          window.location.href = '/dashboard';
        } else {
          setErrorMessage(lang === 'zh' ? '会员验证凭证无效，请核对工会名册记录。' : lang === 'bm' ? 'Kredensial ahli tidak sah. Periksa rekod MCSA.' : 'Invalid member credentials. Check MCSA registry records.');
        }
      } else {
        if (email.trim() !== '') {
          localStorage.setItem('mcsa_client_email', email);
          window.location.href = '/portal';
        } else {
          setErrorMessage(lang === 'zh' ? '请输入您的客户联络电子邮箱。' : lang === 'bm' ? 'Sila masukkan e-mel rujukan pelanggan.' : 'Please enter your client reference email.');
        }
      }
    }, 800);
  };

  const t = translations[lang] || translations.en;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0b1329',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Ambient Background Glow Circles */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(37, 99, 235, 0) 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>

      {/* Main card box with Glassmorphism */}
      <div 
        className="animate-fade-in"
        style={{
          maxWidth: '480px',
          width: '100%',
          background: 'rgba(30, 41, 59, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '3rem 2.5rem',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          textAlign: 'center',
          zIndex: 5
        }}
      >
        {/* Back Link to Public Site */}
        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
          <a href="/" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
            ← {lang === 'zh' ? '返回官方首页' : lang === 'bm' ? 'Kembali ke Laman Utama' : 'Back to Public Website'}
          </a>
        </div>

        {/* Logo Badge */}
        <div style={{ marginBottom: '2rem' }}>
          <img 
            src="/mcsa-logo.png" 
            alt="MCSA Logo" 
            style={{ 
              width: '78px', 
              height: '78px', 
              borderRadius: '50%', 
              backgroundColor: '#ffffff', 
              padding: '4px',
              margin: '0 auto 1.25rem auto',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
              border: '1px solid rgba(255,255,255,0.1)'
            }} 
          />
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
            {lang === 'zh' ? 'MCSA 马来西亚护理工会' : 'MultiCare Support Malaysia Union'}
          </h2>
          <span style={{ 
            fontSize: '0.8rem', 
            color: 'var(--accent)', 
            fontWeight: 700, 
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'block',
            marginTop: '0.4rem'
          }}>
            {lang === 'zh' ? '工会内部管理与验证门户' : lang === 'bm' ? 'PORTAL DAFTAR SWASTA' : 'Private Union Registry'}
          </span>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '0.35rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => { setSelectedRole('member'); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: selectedRole === 'member' ? '#2563eb' : 'transparent',
              color: selectedRole === 'member' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: selectedRole === 'member' ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            {t.login.memberTab}
          </button>
          <button
            onClick={() => { setSelectedRole('admin'); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: selectedRole === 'admin' ? '#2563eb' : 'transparent',
              color: selectedRole === 'admin' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: selectedRole === 'admin' ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            {t.login.adminTab}
          </button>
          <button
            onClick={() => { setSelectedRole('client'); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: selectedRole === 'client' ? '#2563eb' : 'transparent',
              color: selectedRole === 'client' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: selectedRole === 'client' ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            {lang === 'zh' ? '患者家属' : lang === 'bm' ? 'Portal Keluarga' : 'Family Portal'}
          </button>
        </div>

        <form onSubmit={handleMockLogin} style={{ textAlign: 'left' }}>
          {selectedRole !== 'admin' && (
            <div className="form-group">
              <label className="form-label">{lang === 'zh' ? '邮箱或会员执照编号' : lang === 'bm' ? 'E-mel atau ID Ahli' : 'Email or Member ID'}</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '44px' }}
                  placeholder="e.g. companion@mcsa.com.my"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}
          {selectedRole === 'admin' && (
            <div className="form-group">
              <label className="form-label">{lang === 'zh' ? '工会管理员邮箱' : lang === 'bm' ? 'E-mel Pentadbir' : 'Admin Registry Email'}</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '44px' }}
                  placeholder="admin@mcsa.com.my"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">{t.login.passLabel}</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                style={{ width: '100%', paddingLeft: '44px', paddingRight: '40px' }}
                placeholder={selectedRole === 'admin' ? 'Enter Admin Key' : 'Enter Password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '14px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div style={{
              color: 'var(--danger)',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              borderLeft: '4px solid var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⚠️ {errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary pulse-glow"
            style={{ width: '100%', marginTop: '0.75rem', height: '48px', borderRadius: '12px' }}
          >
            {isSubmitting ? (lang === 'zh' ? '正在核验注册名录...' : 'Verifying Registry Database...') : `🔐 ${lang === 'zh' ? '授权并进入信息门户' : 'Verify & Authorize Access'}`}
          </button>
        </form>

        <div style={{ 
          marginTop: '2rem', 
          fontSize: '0.8rem', 
          color: 'var(--text-muted)',
          background: 'rgba(15, 23, 42, 0.3)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.03)'
        }}>
          🛡️ {lang === 'zh' ? '工会安全凭证快速指南：' : lang === 'bm' ? 'Panduan Kelayakan Portal Kesatuan:' : 'Private Union Portal Credentials Vetted:'}<br/>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '0.5rem' }}>
            <span>Admin Key: <strong style={{ color: 'var(--accent)' }}>Drjin3194</strong></span>
            <span>Caregiver Key: <strong style={{ color: 'var(--accent)' }}>123456</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
