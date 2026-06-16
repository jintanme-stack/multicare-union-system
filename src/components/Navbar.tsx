'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ExternalLink, Menu, X } from 'lucide-react';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<any>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isMember, setIsMember] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isVolunteer, setIsVolunteer] = useState<boolean>(false);
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  useEffect(() => {
    setLang(store.getLanguage() as Language);
    setUser(store.getCurrentUser());
    setAdminEmail(localStorage.getItem('mcsa_logged_admin_email'));
    setIsMember(!!localStorage.getItem('mcsa_logged_member'));
    setIsClient(!!localStorage.getItem('mcsa_client_email'));
    setIsVolunteer(!!localStorage.getItem('mcsa_logged_volunteer'));
  }, []);

  const handleLogout = async () => {
    await store.signOut();
    localStorage.removeItem('mcsa_logged_admin_email');
    localStorage.removeItem('mcsa_logged_volunteer');
    localStorage.removeItem('mcsa_logged_member');
    localStorage.removeItem('mcsa_client_email');
    window.location.href = '/';
  };

  const handleLangChange = (newLang: Language) => {
    store.setLanguage(newLang);
    setLang(newLang);
    window.location.reload();
  };

  const t = translations[lang] || translations.en;

  const navLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.services, href: '/services' },
    { label: t.nav.verify, href: '/verify' },
    { label: t.nav.membership, href: '/membership' },
    { label: t.nav.blog || 'Blog', href: '/blog' },
    { label: t.register.title || 'Apply License', href: '/register', highlight: true }
  ];

  return (
    <nav style={{
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(10, 186, 181, 0.12)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#1e293b'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img 
          src="/mcsa-logo.png" 
          alt="MCSA Logo" 
          style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '50%', backgroundColor: '#ffffff', padding: '2px', border: '1px solid rgba(10, 186, 181, 0.15)' }} 
        />
        <a href="/" style={{
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center'
        }}>
          <span style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#088c87',
            fontFamily: 'Outfit, sans-serif',
            letterSpacing: '0.02em',
            lineHeight: '1.1'
          }}>MCSA MALAYSIA</span>
          <span style={{
            fontSize: '0.62rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            marginTop: '1px',
            letterSpacing: '0.05em'
          }}>马来西亚支持关怀总会</span>
        </a>
      </div>

      {/* Desktop Menu */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'nowrap', flexShrink: 0 }} className="desktop-nav">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              color: currentPath === link.href ? '#088c87' : 'var(--text-muted)',
              borderBottom: currentPath === link.href ? '2px solid var(--primary)' : '2px solid transparent',
              paddingBottom: '0.2rem',
              transition: 'color 0.2s',
              background: link.highlight ? 'var(--primary-glow)' : 'transparent',
              padding: link.highlight ? '0.4rem 0.8rem' : 'initial',
              borderRadius: link.highlight ? '6px' : 'none',
              border: link.highlight ? '1px solid rgba(10, 186, 181, 0.2)' : 'none'
            }}
            onMouseOver={(e) => {
              if (!link.highlight) e.currentTarget.style.color = '#0abab5';
            }}
            onMouseOut={(e) => {
              if (!link.highlight && currentPath !== link.href) e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            {link.label}
          </a>
        ))}

        {user || adminEmail ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              👤 {user ? user.email : adminEmail}
            </span>
            {adminEmail && (
              <a
                href="/admin"
                className="btn btn-primary"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                {lang === 'zh' ? '管理后台' : 'Admin Panel'}
              </a>
            )}
            {!adminEmail && isMember && (
              <a
                href="/dashboard"
                className="btn btn-primary"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                {lang === 'zh' ? '会员中心' : 'Member Portal'}
              </a>
            )}
            {!adminEmail && isClient && (
              <a
                href="/portal"
                className="btn btn-primary"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                {lang === 'zh' ? '家属中心' : 'Family Portal'}
              </a>
            )}
            {!adminEmail && isVolunteer && (
              <a
                href="/timebank"
                className="btn btn-primary"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  backgroundColor: '#f59e0b',
                  borderColor: '#f59e0b'
                }}
              >
                {lang === 'zh' ? '义工中心' : 'Volunteer Portal'}
              </a>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                borderColor: '#ef4444',
                color: '#ef4444',
                background: 'transparent'
              }}
            >
              {lang === 'zh' ? '安全退出' : 'Logout'}
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="btn btn-primary"
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.82rem',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            {t.nav.portalLogin} <ExternalLink size={14} />
          </a>
        )}

        {/* Language Switcher Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
          <select 
            value={lang} 
            onChange={(e) => handleLangChange(e.target.value as Language)}
            style={{
              backgroundColor: 'rgba(240, 251, 251, 0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(10, 186, 181, 0.2)',
              borderRadius: '6px',
              padding: '0.35rem 0.6rem',
              color: '#1e293b',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231e293b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '12px',
              paddingRight: '24px'
            }}
          >
            <option value="en" style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>EN</option>
            <option value="bm" style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>BM</option>
            <option value="zh" style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>中文</option>
          </select>
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: '#1e293b',
          cursor: 'pointer',
          padding: '0.25rem',
          outline: 'none'
        }}
        className="mobile-toggle"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(10, 186, 181, 0.15)',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 99
          }}
          className="mobile-nav animate-fade-in"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                textDecoration: 'none',
                color: currentPath === link.href ? '#088c87' : 'var(--text-muted)',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(0,0,0,0.04)'
              }}
            >
              {link.label}
            </a>
          ))}
          {user || adminEmail ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Logged in as: {user ? user.email : adminEmail}
              </span>
              {adminEmail && (
                <a
                  href="/admin"
                  className="btn btn-primary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    textAlign: 'center'
                  }}
                >
                  {lang === 'zh' ? '进入管理后台' : 'Go to Admin Panel'}
                </a>
              )}
              {!adminEmail && isMember && (
                <a
                  href="/dashboard"
                  className="btn btn-primary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    textAlign: 'center'
                  }}
                >
                  {lang === 'zh' ? '进入会员中心' : 'Go to Member Portal'}
                </a>
              )}
              {!adminEmail && isClient && (
                <a
                  href="/portal"
                  className="btn btn-primary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    textAlign: 'center'
                  }}
                >
                  {lang === 'zh' ? '进入家属中心' : 'Go to Family Portal'}
                </a>
              )}
              {!adminEmail && isVolunteer && (
                <a
                  href="/timebank"
                  className="btn btn-primary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    backgroundColor: '#f59e0b',
                    borderColor: '#f59e0b'
                  }}
                >
                  {lang === 'zh' ? '进入义工中心' : 'Go to Volunteer Portal'}
                </a>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                {lang === 'zh' ? '安全退出' : 'Logout'}
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="btn btn-primary"
              style={{
                padding: '0.6rem 1.25rem',
                fontSize: '0.9rem',
                borderRadius: '8px',
                textAlign: 'center',
                justifyContent: 'center',
                marginTop: '0.5rem'
              }}
            >
              {t.nav.portalLogin} <ExternalLink size={14} />
            </a>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Language / 语言:</span>
            <select 
              value={lang} 
              onChange={(e) => handleLangChange(e.target.value as Language)}
              style={{
                backgroundColor: 'rgba(240, 251, 251, 0.8)',
                border: '1px solid rgba(10, 186, 181, 0.2)',
                borderRadius: '6px',
                padding: '0.35rem 0.6rem',
                color: '#1e293b',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <option value="en">EN</option>
              <option value="bm">BM</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      )}
    </nav>
  );
}
