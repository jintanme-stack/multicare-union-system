'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !message) return;

    const newInquiry = {
      id: 'INQ-' + Math.floor(100 + Math.random() * 900),
      name,
      contact,
      message,
      status: 'Pending'
    };

    const currentInquiries = store.getInquiries();
    store.setInquiries([newInquiry, ...currentInquiries]);

    setName('');
    setContact('');
    setMessage('');
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '4rem 2rem', position: 'relative' }}>
        {/* Glow ambient */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge badge-pending" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
              📞 MCSA Support Desk
            </span>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Connect with Our Admin Team
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Need assistance with membership applications, clinic priority routing, or care scheduling? Reach out to us.
            </p>
          </div>

          <div className="grid-cols-2">
            {/* Left: Contact Info Info-blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ margin: 0 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={20} style={{ color: 'var(--primary)' }} /> Union Headquarters Office
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                  MultiCare Support Malaysia Union (MCSA)<br />
                  Level 18, Menara Centara, Jalan Tuanku Abdul Rahman,<br />
                  50100 Kuala Lumpur, Malaysia
                </p>
              </div>

              <div className="card" style={{ margin: 0 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={20} style={{ color: 'var(--health)' }} /> Phone & Email Hotlines
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Member Hotline:</span>
                    <strong style={{ color: '#ffffff' }}>+60 3-2780 1234</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Support Email:</span>
                    <strong style={{ color: '#ffffff', fontFamily: 'monospace' }}>desk@mcsa.com.my</strong>
                  </div>
                </div>
              </div>

              <div className="card" style={{ margin: 0 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={20} style={{ color: 'var(--accent)' }} /> Desk Operations Hours
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Monday - Friday: 9:00 AM - 6:00 PM (GMT+8)<br />
                  Saturday: 9:00 AM - 1:00 PM (Accreditation audits only)<br />
                  Sunday & Public Holidays: Closed
                </p>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }} className="animate-fade-in">
                  <CheckCircle size={56} style={{ color: 'var(--health)', margin: '0 auto 1.25rem auto' }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#ffffff' }}>Inquiry Submitted Successfully!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                    Thank you. Your message has been logged in our Operations Desk system database. An administrator will review it and contact you shortly.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={20} style={{ color: 'var(--accent)' }} /> Send a Message / 在线留言
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Full Name / 您的姓名</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Mr. Lim"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contact Email or Phone Number</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. 012-3456789 or lim@gmail.com"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message Details / 留言详情</label>
                      <textarea
                        required
                        rows={5}
                        className="form-input"
                        style={{ resize: 'none' }}
                        placeholder="Enter your inquiry regarding member onboarding, client demands, or licensure verification details..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }}>
                      <Send size={16} /> Send Inquiry
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
