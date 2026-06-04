'use client';

import React, { useState } from 'react';
import { store } from '@/lib/store';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
    
    // Also push to Real-time Operations log if needed by writing an alert
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(true);
    alert('Thank you! Your inquiry has been logged in our registry database. A support representative will reach out.');
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
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: 0, fontFamily: 'Outfit' }}>
                MCSA MALAYSIA
              </h4>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                马来西亚多元关怀支持公会
              </span>
            </div>
          </div>
          <p style={{ lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Accrediting and verifying professional care providers across Malaysia. Connecting families with qualified caregivers, confinement specialists, patient companions, and rehab assistants.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> KL Sentral Business Suites, Kuala Lumpur</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> +60 3-2274 9988</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> registry@mcsa.com.my</span>
          </div>
        </div>

        {/* Links column */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1.2rem', fontFamily: 'Outfit' }}>
            Directory & Portals
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home / 首页</a></li>
            <li><a href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Association / 关于工会</a></li>
            <li><a href="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Care Services / 护理服务</a></li>
            <li><a href="/find-caregivers" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Registry Search / 寻找护理员</a></li>
            <li><a href="/verify" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Verify Licensure / 卡号验证</a></li>
            <li><a href="/membership" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Membership / 加入工会</a></li>
          </ul>
        </div>

        {/* Quick Query column */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1.2rem', fontFamily: 'Outfit' }}>
            Quick Support Query / 客服咨询
          </h4>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="text"
              required
              placeholder="Your Name / 您的姓名"
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
              type="email"
              required
              placeholder="Contact Email or Phone / 联系方式"
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
              placeholder="Your inquiry details... / 咨询内容..."
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
              <Send size={14} /> Submit Query to Admin
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
        &copy; {new Date().getFullYear()} MultiCare Support Malaysia Union (MCSA). All rights reserved. Registered Association registry under Malaysia MOH compliance.
      </div>
    </footer>
  );
}
