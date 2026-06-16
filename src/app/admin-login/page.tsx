'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Eye, EyeOff, Lock } from 'lucide-react';
import { store } from '@/lib/store';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState<'en' | 'zh'>('en');

  useEffect(() => {
    const savedLang = store.getLanguage();
    if (savedLang === 'zh') {
      setLang('zh');
    } else {
      setLang('en');
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const isStaff = cleanEmail.includes('staff') || cleanEmail.includes('standard');
    const expectedPassword = isStaff ? store.getStandardAdminPassword() : 'Drjin3194';

    if (cleanPassword === expectedPassword) {
      localStorage.setItem('mcsa_logged_admin_email', cleanEmail);
      window.location.href = '/admin';
    } else {
      setErrorMessage(
        lang === 'zh'
          ? '❌ 管理员授权凭证错误，访问拒绝。'
          : '❌ Incorrect admin authorization credentials. Access denied.'
      );
      setIsSubmitting(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'zh' : 'en';
    setLang(newLang);
    store.setLanguage(newLang);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-main)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Security Ambient Background Glows */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>

      {/* Main glass card */}
      <div
        className="animate-fade-in"
        style={{
          maxWidth: '460px',
          width: '100%',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(239, 68, 68, 0.2)', // Slight reddish border indicating high security zone
          padding: '3rem 2.5rem',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7), 0 0 40px rgba(239, 68, 68, 0.05)',
          textAlign: 'center',
          zIndex: 5
        }}
       miniatures>
        {/* Language switch */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 600 }}>
            ← {lang === 'zh' ? '回首页' : 'Home'}
          </a>
          <button
            onClick={toggleLanguage}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              color: 'var(--text-light)',
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🌐 {lang === 'en' ? '中文' : 'English'}
          </button>
        </div>

        {/* Security Shield Lock Icon */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
          }}>
            <Lock size={34} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', fontFamily: 'Outfit, sans-serif', fontWeight: 800, margin: 0 }}>
            {lang === 'zh' ? '安全网关验证' : 'Secure Admin Gateway'}
          </h2>
          <span style={{
            fontSize: '0.78rem',
            color: 'rgba(239, 68, 68, 0.85)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'block',
            marginTop: '0.4rem'
          }}>
            {lang === 'zh' ? 'MCSA 马来西亚护理公会 · 管理端' : 'MCSA Malaysia Union · Operations'}
          </span>
        </div>

        <form onSubmit={handleAdminLogin} style={{ textAlign: 'left' }}>
          {errorMessage && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              lineHeight: 1.5
            }}>
              {errorMessage}
            </div>
          )}

          {/* Email Input */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ color: 'var(--text-light)', fontSize: '0.82rem', fontWeight: 600 }}>
              {lang === 'zh' ? '管理员工作邮箱 (Admin Email)' : 'Admin Work Email'}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                className="form-input"
                style={{ width: '100%', paddingLeft: '42px', height: '44px', background: 'rgba(15, 23, 42, 0.6)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                placeholder="e.g. master@mcsa.com.my"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ color: 'var(--text-light)', fontSize: '0.82rem', fontWeight: 600 }}>
              {lang === 'zh' ? '安全认证密码 (Security Code)' : 'Security Passcode'}
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                style={{ width: '100%', paddingLeft: '42px', paddingRight: '44px', height: '44px', background: 'rgba(15, 23, 42, 0.6)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{
              width: '100%',
              height: '46px',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: '#ef4444', // Red color emphasizing high security operations
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
              border: 'none'
            }}
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Shield size={16} />
                <span>{lang === 'zh' ? '验证并登入管理终端' : 'Verify & Enter Terminal'}</span>
              </>
            )}
          </button>
        </form>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2.5rem', lineHeight: 1.5 }}>
          {lang === 'zh' 
            ? '⚠️ 警告：此系统受马来西亚华人照护工会安全机制保护。非授权访问将被记录审计，构成网络犯罪行为。'
            : '⚠️ WARNING: MCSA Union Intranet System. Unauthorized entry attempts are logged and prosecuted under Malaysian cyberlaw.'}
        </p>
      </div>
    </div>
  );
}
