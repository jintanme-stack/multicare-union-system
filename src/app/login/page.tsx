'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Eye, EyeOff } from 'lucide-react';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';
import { supabase } from '@/lib/supabaseClient';

export default function EntryPage() {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member' | 'client' | 'volunteer'>('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [showDebugList, setShowDebugList] = useState(false);
  const [activeMembersList, setActiveMembersList] = useState<any[]>([]);
  const [showResetFlow, setShowResetFlow] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');
    setIsSendingReset(true);

    try {
      const cleanResetEmail = resetEmail.trim().toLowerCase();
      const { error } = await supabase.auth.resetPasswordForEmail(cleanResetEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        setResetError(error.message);
      } else {
        setResetMessage(lang === 'zh' 
          ? '🎉 密码重置链接已成功发送！请检查您的电子邮箱收件箱（以及垃圾邮件箱）。'
          : '🎉 Reset link sent successfully! Please check your email inbox (and spam folder).');
        setResetEmail('');
      }
    } catch (err: any) {
      setResetError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSendingReset(false);
    }
  };

  useEffect(() => {
    setLang(store.getLanguage() as Language);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'volunteer') {
        setSelectedRole('volunteer');
      }
    }
  }, []);

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    let resolvedEmail = cleanEmail;

    if (selectedRole === 'member') {
      const members = store.getUnionMembers();
      
      // Try resolving by Member ID
      let found = members.find((m: any) => 
        m.member_number && m.member_number.toLowerCase().trim() === cleanEmail
      );
      
      // Try resolving by Phone Number
      if (!found) {
        const inputDigits = cleanEmail.replace(/[^0-9]/g, '');
        if (inputDigits.length >= 7) {
          found = members.find((m: any) => {
            const memberPhoneDigits = (m.phone || '').replace(/[^0-9]/g, '');
            return memberPhoneDigits && (memberPhoneDigits === inputDigits || memberPhoneDigits.endsWith(inputDigits) || inputDigits.endsWith(memberPhoneDigits));
          });
        }
      }
      
      if (found && found.email) {
        resolvedEmail = found.email.toLowerCase().trim();
      }
    } else if (selectedRole === 'client') {
      const requests = store.getCareRequests();
      const inputDigits = cleanEmail.replace(/[^0-9]/g, '');
      if (inputDigits.length >= 7) {
        const found = requests.find((r: any) => {
          const clientPhoneDigits = (r.phone || '').replace(/[^0-9]/g, '');
          return clientPhoneDigits && (clientPhoneDigits === inputDigits || clientPhoneDigits.endsWith(inputDigits) || inputDigits.endsWith(clientPhoneDigits));
        });
        if (found && found.email) {
          resolvedEmail = found.email.toLowerCase().trim();
        }
      }
    } else if (selectedRole === 'volunteer') {
      const volunteers = store.getVolunteers();
      let found = volunteers.find((v: any) => 
        v.nric && v.nric.toLowerCase().trim() === cleanEmail
      );
      if (!found) {
        const inputDigits = cleanEmail.replace(/[^0-9]/g, '');
        if (inputDigits.length >= 7) {
          found = volunteers.find((v: any) => {
            const volPhoneDigits = (v.phone || '').replace(/[^0-9]/g, '');
            return volPhoneDigits && (volPhoneDigits === inputDigits || volPhoneDigits.endsWith(inputDigits) || inputDigits.endsWith(volPhoneDigits));
          });
        }
      }
      if (found && found.email) {
        resolvedEmail = found.email.toLowerCase().trim();
      }
    }

    if (selectedRole === 'admin') {
      window.location.href = '/admin-login';
      return;
    } else if (selectedRole === 'member') {
      store.signIn(resolvedEmail, cleanPassword)
        .then(async (res) => {
          if (res.error) {
            setErrorMessage(res.error.message);
            setIsSubmitting(false);
            return;
          }

          const userEmail = res.data.user?.email || '';
          const members = store.getUnionMembers();
          const foundActive = members.find((m: any) => 
            m.email && m.email.toLowerCase().trim() === userEmail.toLowerCase().trim()
          );

          if (foundActive) {
            localStorage.setItem('mcsa_logged_member', JSON.stringify(foundActive));
            window.location.href = '/dashboard';
          } else {
            // Check if pending
            const pending = store.getPendingMembers();
            const foundPending = pending.find((m: any) => 
              m.email && m.email.toLowerCase().trim() === userEmail.toLowerCase().trim()
            );

            if (foundPending) {
              setErrorMessage(lang === 'zh' 
                ? '⚠️ 您的会员申请正在公会审核中。批准后密码（123456）将正式激活，请耐心等待。'
                : '⚠️ Your union registration is currently under review by admin. Please check back later.');
            } else {
              setErrorMessage(lang === 'zh'
                ? '⚠️ 您的账号未在公会名册中登记。请先在首页提交申请表。'
                : '⚠️ Your email is not registered in MCSA registry database. Please submit a registration first.');
            }
            await store.signOut();
            setIsSubmitting(false);
          }
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setIsSubmitting(false);
        });
    } else if (selectedRole === 'volunteer') {
      store.signIn(resolvedEmail, cleanPassword)
        .then(async (res) => {
          if (res.error) {
            setErrorMessage(res.error.message);
            setIsSubmitting(false);
            return;
          }

          const userEmail = res.data.user?.email || '';
          const volunteers = store.getVolunteers();
          const found = volunteers.find((v: any) => 
            v.email && v.email.toLowerCase().trim() === userEmail.toLowerCase().trim()
          );

          if (found) {
            if (found.status === 'Approved') {
              localStorage.setItem('mcsa_logged_volunteer', JSON.stringify(found));
              window.location.href = '/timebank';
            } else {
              setErrorMessage(lang === 'zh'
                ? '⚠️ 您的义工申请正在审核中，审核通过后方可登录。'
                : '⚠️ Your volunteer account is pending admin approval.');
              await store.signOut();
              setIsSubmitting(false);
            }
          } else {
            setErrorMessage(lang === 'zh'
              ? '⚠️ 未在时间银行义工名录中找到该邮箱。请先在首页注册申请。'
              : '⚠️ Email not found in Care Time Bank registry. Please register first.');
            await store.signOut();
            setIsSubmitting(false);
          }
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setIsSubmitting(false);
        });
    } else {
      // Client login
      store.signIn(resolvedEmail, cleanPassword)
        .then(async (res) => {
          if (res.error) {
            setErrorMessage(res.error.message);
            setIsSubmitting(false);
            return;
          }

          const userEmail = res.data.user?.email || '';
          const requests = store.getCareRequests();
          const found = requests.find((r: any) => 
            r.email && r.email.toLowerCase().trim() === userEmail.toLowerCase().trim()
          );

          if (found) {
            localStorage.setItem('mcsa_client_email', found.email);
            window.location.href = '/portal';
          } else {
            setErrorMessage(lang === 'zh' 
              ? '⚠️ 未在需求记录中找到此联络邮箱。请确保您已在首页提交了照护需求表单。'
              : '⚠️ Contact Email not found in our care request records. Please ensure you have posted a care request on the homepage first.');
            await store.signOut();
            setIsSubmitting(false);
          }
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setIsSubmitting(false);
        });
    }
  };

  const handleForgotPassword = () => {
    if (selectedRole === 'client') {
      const alertMsg = lang === 'zh'
        ? '💡 提示：家属的访问密钥是您在官方首页提交护理需求表单时，系统自动生成的 6 位数字密钥。\n\n如果您忘记了该密钥，请联系 MCSA 资质核验台进行查询：\n📧 电子邮箱：registry@mcsa.com.my\n📞 联系电话：+60 3-2274 9988'
        : lang === 'bm'
        ? '💡 Info: Kunci Akses keluarga dijana secara automatik semasa anda menghantar borang di laman utama.\n\nSila hubungi MCSA untuk menyemak kunci anda:\n📧 E-mel: registry@mcsa.com.my\n📞 Telefon: +60 3-2274 9988'
        : '💡 Info: The family access key is a 6-digit code generated when you posted the care request on the homepage.\n\nPlease contact MCSA Audit Desk to retrieve your key:\n📧 Email: registry@mcsa.com.my\n📞 Phone: +60 3-2274 9988';
      alert(alertMsg);
      return;
    }
    // Show the dynamic password reset email flow
    setShowResetFlow(true);
  };

  const t = translations[lang] || translations.en;

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
            {lang === 'zh' ? 'MCSA 马来西亚护理公会' : 'MultiCare Support Malaysia Union'}
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
            {lang === 'zh' ? '公会内部管理与验证门户' : lang === 'bm' ? 'PORTAL DAFTAR SWASTA' : 'Private Union Registry'}
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
            onClick={() => { setSelectedRole('member'); setErrorMessage(''); setShowDebugList(false); }}
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
            onClick={() => { setSelectedRole('volunteer'); setErrorMessage(''); setShowDebugList(false); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: selectedRole === 'volunteer' ? '#f59e0b' : 'transparent',
              color: selectedRole === 'volunteer' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: selectedRole === 'volunteer' ? '0 4px 12px rgba(245,158,11,0.2)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            {lang === 'zh' ? '时间银行义工' : lang === 'bm' ? 'Sukarelawan' : 'Volunteer'}
          </button>

          <button
            onClick={() => { setSelectedRole('client'); setErrorMessage(''); setShowDebugList(false); }}
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

        {showResetFlow ? (
          <form onSubmit={handleSendResetEmail} style={{ textAlign: 'left' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.75rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
              {lang === 'zh' ? '发送密码重置邮件' : lang === 'bm' ? 'Hantar E-mel Tetap Semula' : 'Send Password Reset Link'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {lang === 'zh' 
                ? '请输入您在 MCSA 注册时填写的电子邮箱。我们将发送一封包含密码重置链接的邮件到您的邮箱。'
                : lang === 'bm'
                ? 'Sila masukkan e-mel berdaftar anda. Kami akan menghantar e-mel dengan pautan untuk menetapkan semula kata laluan.'
                : 'Enter your registered email address below. We will send a secure password reset link to your inbox.'
              }
            </p>
            
            <div className="form-group">
              <label className="form-label">{lang === 'zh' ? '注册电子邮箱' : lang === 'bm' ? 'E-mel Berdaftar' : 'Registered Email'}</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '44px' }}
                  placeholder="e.g. name@gmail.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
            </div>

            {resetMessage && (
              <div style={{
                color: '#10b981',
                fontSize: '0.82rem',
                padding: '0.75rem 1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                borderLeft: '4px solid #10b981'
              }}>
                <span>{resetMessage}</span>
              </div>
            )}

            {resetError && (
              <div style={{
                color: 'var(--danger)',
                fontSize: '0.82rem',
                padding: '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                borderLeft: '4px solid var(--danger)'
              }}>
                <span>⚠️ {resetError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSendingReset}
              className="btn btn-primary pulse-glow"
              style={{ width: '100%', marginTop: '0.5rem', height: '48px', borderRadius: '12px', justifyContent: 'center' }}
            >
              {isSendingReset 
                ? (lang === 'zh' ? '正在发送中...' : 'Sending Reset Email...') 
                : `✉️ ${lang === 'zh' ? '发送密码重置邮件' : lang === 'bm' ? 'Hantar Pautan Tetap Semula' : 'Send Reset Link'}`
              }
            </button>

            <button
              type="button"
              onClick={() => { setShowResetFlow(false); setResetError(''); setResetMessage(''); }}
              className="btn btn-outline"
              style={{ width: '100%', marginTop: '0.75rem', height: '48px', borderRadius: '12px', justifyContent: 'center' }}
            >
              {lang === 'zh' ? '返回会员登录' : lang === 'bm' ? 'Kembali Log Masuk' : 'Back to Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMockLogin} style={{ textAlign: 'left' }}>
            {selectedRole !== 'admin' && (
              <div className="form-group">
                <label className="form-label">
                  {selectedRole === 'client'
                    ? (lang === 'zh' ? '家属联络邮箱' : lang === 'bm' ? 'E-mel Rujukan Keluarga' : 'Family Contact Email')
                    : selectedRole === 'volunteer'
                    ? (lang === 'zh' ? '电子邮箱或身份证号' : lang === 'bm' ? 'E-mel atau Kad Pengenalan' : 'Email or NRIC Number')
                    : (lang === 'zh' ? '邮箱或会员执照编号' : lang === 'bm' ? 'E-mel atau ID Ahli' : 'Email or Member ID')}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '44px' }}
                    placeholder={selectedRole === 'client' ? 'e.g. lim@mcsa.com.my' : selectedRole === 'volunteer' ? 'e.g. vol@mcsa.com.my' : 'e.g. companion@mcsa.com.my'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}
            {selectedRole === 'admin' && (
              <div className="form-group">
                <label className="form-label">{lang === 'zh' ? '公会管理员邮箱' : lang === 'bm' ? 'E-mel Pentadbir' : 'Admin Registry Email'}</label>
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
              <label className="form-label">
                {selectedRole === 'client'
                  ? (lang === 'zh' ? '安全访问密钥 (Access Key)' : lang === 'bm' ? 'Kunci Akses (Access Key)' : 'Secure Access Key')
                  : t.login.passLabel}
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '44px', paddingRight: '40px' }}
                  placeholder={selectedRole === 'admin' ? 'Enter Admin Key' : selectedRole === 'client' ? 'Enter 6-digit Access Key' : selectedRole === 'volunteer' ? 'Enter Volunteer Password' : 'Enter Password'}
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.45rem' }}>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  {lang === 'zh' ? '忘记凭证？' : lang === 'bm' ? 'Lupa Kredensial?' : 'Forgot Credentials?'}
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
        )}


      </div>
    </div>
  );
}
