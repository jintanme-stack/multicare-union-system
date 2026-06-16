'use client';

import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { store } from '@/lib/store';
import { Language } from '@/lib/translations';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [lang, setLang] = useState<Language>('en');
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    setLang(store.getLanguage() as Language);

    const verifySession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsValidSession(true);
      } else {
        // Fallback check: sometimes Next.js hash parsing takes a split second
        setTimeout(async () => {
          const { data: secondCheck } = await supabase.auth.getSession();
          if (secondCheck.session) {
            setIsValidSession(true);
          } else {
            setErrorMsg(
              lang === 'zh'
                ? '⚠️ 链接无效或已过期，请重新在登录页请求密码重置邮件。'
                : '⚠️ Invalid or expired reset link. Please request a new link from the login page.'
            );
          }
        }, 1000);
      }
    };

    verifySession();
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');

    if (password.length < 6) {
      setErrorMsg(
        lang === 'zh'
          ? '密码必须至少包含 6 个字符。'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(
        lang === 'zh'
          ? '两次输入的密码不一致！'
          : 'Passwords do not match!'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        setErrorMsg(error.message);
      } else {
        setMessage(
          lang === 'zh'
            ? '🎉 密码更新成功！您将在 3 秒内被自动重定向到登录页面。'
            : '🎉 Password updated successfully! Redirecting you to login in 3 seconds...'
        );
        setPassword('');
        setConfirmPassword('');
        
        // Sign out to clean up session
        await supabase.auth.signOut();
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
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
          <a href="/login" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
            ← {lang === 'zh' ? '返回会员登录' : lang === 'bm' ? 'Kembali ke Log Masuk' : 'Back to Login'}
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
            {lang === 'zh' ? '设置新密码' : lang === 'bm' ? 'Set Kata Laluan Baru' : 'Set New Password'}
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
            {lang === 'zh' ? '安全凭证更新' : lang === 'bm' ? 'PENGEMASKINIAN KATA LALUAN' : 'Security Credential Update'}
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">{lang === 'zh' ? '输入新密码' : lang === 'bm' ? 'Masukkan Kata Laluan Baru' : 'New Password'}</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={!isValidSession}
                className="form-input"
                style={{ width: '100%', paddingLeft: '44px', paddingRight: '40px' }}
                placeholder="Min 6 characters"
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

          <div className="form-group">
            <label className="form-label">{lang === 'zh' ? '确认新密码' : lang === 'bm' ? 'Sahkan Kata Laluan Baru' : 'Confirm New Password'}</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={!isValidSession}
                className="form-input"
                style={{ width: '100%', paddingLeft: '44px', paddingRight: '40px' }}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div style={{
              color: '#10b981',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.75rem 1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              borderLeft: '4px solid #10b981'
            }}>
              <span>{message}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{
              color: 'var(--danger)',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              borderLeft: '4px solid var(--danger)'
            }}>
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !isValidSession}
            className="btn btn-primary pulse-glow"
            style={{ width: '100%', marginTop: '0.75rem', height: '48px', borderRadius: '12px', justifyContent: 'center' }}
          >
            {isSubmitting ? (lang === 'zh' ? '正在提交新密码...' : 'Updating Password...') : `🔐 ${lang === 'zh' ? '确认修改并登录' : 'Update Password & Login'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
