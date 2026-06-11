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
  const [showDebugList, setShowDebugList] = useState(false);
  const [activeMembersList, setActiveMembersList] = useState<any[]>([]);

  useEffect(() => {
    setLang(store.getLanguage() as Language);
  }, []);

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      if (selectedRole === 'admin') {
        const isStaff = cleanEmail.includes('staff') || cleanEmail.includes('standard');
        const expectedPassword = isStaff ? store.getStandardAdminPassword() : 'Drjin3194';

        if (cleanPassword === expectedPassword) {
          localStorage.setItem('mcsa_logged_admin_email', cleanEmail || 'admin@mcsa.com.my');
          window.location.href = '/admin';
        } else {
          setErrorMessage(lang === 'zh' ? '管理员授权密码错误，拒接访问。' : lang === 'bm' ? 'Kod pentadbir salah. Akses ditolak.' : 'Incorrect admin code. Access denied.');
        }
      } else if (selectedRole === 'member') {
        if (cleanPassword === '123456') {
          const members = store.getUnionMembers();
          const found = members.find((m: any) => 
            (m.email && m.email.toLowerCase().trim() === cleanEmail) || 
            (m.member_number && m.member_number.toLowerCase().trim() === cleanEmail)
          );
          
          if (found) {
            localStorage.setItem('mcsa_logged_member', JSON.stringify(found));
            window.location.href = '/dashboard';
          } else {
            setErrorMessage(lang === 'zh' 
              ? '⚠️ 未在公会现役名册中找到此会员编号。请确保您的注册申请已被管理员批准。' 
              : lang === 'bm' 
              ? '⚠️ ID Ahli tidak ditemui dalam rekod MCSA. Sila pastikan permohonan anda telah diluluskan.' 
              : '⚠️ Member ID or email not found in MCSA active registry. Please make sure your application is approved.');
          }
        } else {
          setErrorMessage(lang === 'zh' ? '会员验证凭证无效，请核对公会名册记录。' : lang === 'bm' ? 'Kredensial ahli tidak sah. Periksa rekod MCSA.' : 'Invalid member credentials. Check MCSA registry records.');
        }
      } else {
        const requests = store.getCareRequests();
        const found = requests.find((r: any) => 
          r.email && r.email.toLowerCase().trim() === cleanEmail
        );
        
        if (found) {
          if (found.accessKey === cleanPassword) {
            localStorage.setItem('mcsa_client_email', found.email);
            window.location.href = '/portal';
          } else {
            setErrorMessage(lang === 'zh' ? '安全访问密钥错误，拒绝访问。' : lang === 'bm' ? 'Kunci Akses tidak sah. Akses ditolak.' : 'Incorrect Secure Access Key. Access denied.');
          }
        } else {
          setErrorMessage(lang === 'zh' 
            ? '⚠️ 未在需求记录中找到此联络邮箱。请确保您已在首页提交了照护需求表单。' 
            : lang === 'bm' 
            ? '⚠️ E-mel tidak ditemui dalam rekod permohonan. Sila hantar permohonan penjagaan dahulu.' 
            : '⚠️ Contact Email not found in our care request records. Please ensure you have posted a care request on the homepage first.');
        }
      }
    }, 800);
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
    const alertMsg = lang === 'zh'
      ? '💡 提示：公会新注册的在册照护人员审核通过后，默认密码均为 123456。\n\n如果您忘记了修改后的自定义密码，请联系 MCSA 资质核验台进行密码重置：\n📧 电子邮箱：registry@mcsa.com.my\n📞 联系电话：+60 3-2274 9988'
      : lang === 'bm'
      ? '💡 Nota: Kata laluan lalai untuk ahli yang baru diluluskan ialah 123456.\n\nJika anda telah menukar kata laluan dan terlupa, sila hubungi Kaunter Audit MCSA untuk menetapkan semula:\n📧 E-mel: registry@mcsa.com.my\n📞 Telefon: +60 3-2274 9988'
      : '💡 Info: All newly approved union caregivers are assigned the default password 123456.\n\nIf you have customized and forgotten your password, please contact the MCSA Audit Desk to request a reset:\n📧 Email: registry@mcsa.com.my\n📞 Phone: +60 3-2274 9988';
    alert(alertMsg);
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
            onClick={() => { setSelectedRole('admin'); setErrorMessage(''); setShowDebugList(false); }}
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

        <form onSubmit={handleMockLogin} style={{ textAlign: 'left' }}>
          {selectedRole !== 'admin' && (
            <div className="form-group">
              <label className="form-label">
                {selectedRole === 'client'
                  ? (lang === 'zh' ? '家属联络邮箱' : lang === 'bm' ? 'E-mel Rujukan Keluarga' : 'Family Contact Email')
                  : (lang === 'zh' ? '邮箱或会员执照编号' : lang === 'bm' ? 'E-mel atau ID Ahli' : 'Email or Member ID')}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '44px' }}
                  placeholder={selectedRole === 'client' ? 'e.g. lim@mcsa.com.my' : 'e.g. companion@mcsa.com.my'}
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
                placeholder={selectedRole === 'admin' ? 'Enter Admin Key' : selectedRole === 'client' ? 'Enter 6-digit Access Key' : 'Enter Password'}
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

        {/* Debug Registry Helper */}
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', textAlign: 'left' }}>
          <button
            type="button"
            onClick={() => {
              if (selectedRole === 'client') {
                setActiveMembersList(store.getCareRequests());
              } else {
                setActiveMembersList(store.getUnionMembers());
              }
              setShowDebugList(!showDebugList);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: 0,
              margin: '0 auto'
            }}
          >
            🔍 {showDebugList ? (lang === 'zh' ? '隐藏测试账号' : 'Hide Test Accounts') : (lang === 'zh' ? '查看测试账号' : 'View Test Accounts')}
          </button>
          
          {showDebugList && (
            <div className="card animate-fade-in" style={{ padding: '0.75rem', marginTop: '1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(255,255,255,0.1)', margin: '1rem 0 0 0' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                {selectedRole === 'client'
                  ? (lang === 'zh' ? '点击可自动填充邮箱与密钥。' : 'Click to autofill Email & Access Key.')
                  : (lang === 'zh' ? '点击可自动填充卡号。默认密码均为 123456。' : 'Click to autofill ID/Email. Default password is 123456.')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                {activeMembersList.map((m: any) => (
                  <div 
                    key={m.id || m.member_number}
                    onClick={() => {
                      if (selectedRole === 'client') {
                        setEmail(m.email || '');
                        setPassword(m.accessKey || '');
                      } else {
                        setEmail(m.member_number || m.email || '');
                        setPassword('123456');
                      }
                      setErrorMessage('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.08)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {selectedRole !== 'client' ? (
                        <img src={m.photo} alt={m.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>👤</div>
                      )}
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'white', fontWeight: 'bold' }}>{m.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {selectedRole === 'client' ? `Email: ${m.email} / Key: ${m.accessKey}` : m.member_number}
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-active" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
                      {selectedRole === 'client' ? m.category : (m.category || '').split(',')[0].trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
