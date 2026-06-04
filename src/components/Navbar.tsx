'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ExternalLink, Menu, X } from 'lucide-react';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  useEffect(() => {
    setLang(store.getLanguage() as Language);
  }, []);

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
    { label: t.register.title || 'Apply License', href: '/register', highlight: true }
  ];

  return (
    <nav style={{
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#ffffff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img 
          src="/mcsa-logo.png" 
          alt="MCSA Logo" 
          style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '50%', backgroundColor: '#ffffff', padding: '2px' }} 
        />
        <a href="/" style={{
          fontSize: '1.1rem',
          fontWeight: 800,
          color: '#ffffff',
          textDecoration: 'none',
          fontFamily: 'Outfit, sans-serif',
          letterSpacing: '0.02em',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <span style={{ fontSize: '1.05rem', lineHeight: '1.1' }}>MCSA MALAYSIA</span>
          <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>多元关怀支持公会</span>
        </a>
      </div>

      {/* Desktop Menu */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="desktop-nav">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              color: currentPath === link.href ? '#ffffff' : 'var(--text-muted)',
              borderBottom: currentPath === link.href ? '2px solid var(--primary)' : '2px solid transparent',
              paddingBottom: '0.2rem',
              transition: 'color 0.2s',
              background: link.highlight ? 'var(--primary-glow)' : 'transparent',
              padding: link.highlight ? '0.4rem 0.8rem' : 'initial',
              borderRadius: link.highlight ? '6px' : 'none',
              border: link.highlight ? '1px solid rgba(37,99,235,0.2)' : 'none'
            }}
            onMouseOver={(e) => {
              if (!link.highlight) e.currentTarget.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              if (!link.highlight && currentPath !== link.href) e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            {link.label}
          </a>
        ))}

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

        {/* Language Switcher Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
          <select 
            value={lang} 
            onChange={(e) => handleLangChange(e.target.value as Language)}
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '0.35rem 0.6rem',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '12px',
              paddingRight: '24px'
            }}
          >
            <option value="en" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>EN</option>
            <option value="bm" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>BM</option>
            <option value="zh" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>中文</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
