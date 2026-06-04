'use client';

import React from 'react';
import { Shield, ExternalLink, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Find Caregivers', href: '/find-caregivers' },
    { label: 'Verify Member', href: '/verify' },
    { label: 'Membership', href: '/membership' },
    { label: 'Contact', href: '/contact' },
    { label: 'Register as Caregiver', href: '/register', highlight: true }
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
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }} className="desktop-nav">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontSize: '0.88rem',
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
            padding: '0.5rem 1.1rem',
            fontSize: '0.85rem',
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          Portal Login <ExternalLink size={14} />
        </a>
      </div>
    </nav>
  );
}
