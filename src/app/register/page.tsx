'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { Shield, PlusCircle, CheckCircle, FileText, UploadCloud, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Confinement Care');
  const [exp, setExp] = useState('1 yr');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [proof, setProof] = useState('Accredited_Caregiver_Diploma.pdf');
  const [healthCert, setHealthCert] = useState('TB_Health_Clearance_Record.pdf');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=256&h=256&fit=crop');
  
  const [submitted, setSubmitted] = useState(false);
  const [assignedAppId, setAssignedAppId] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !bio || !location) return;

    const appId = 'APP-' + Math.floor(105 + Math.random() * 900);
    
    const newPending = {
      id: appId,
      name,
      category,
      email,
      phone,
      exp,
      location,
      bio,
      proof,
      healthCert,
      photo
    };

    const currentPending = store.getPendingMembers();
    store.setPendingMembers([...currentPending, newPending]);

    setAssignedAppId(appId);
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '4rem 2rem', position: 'relative' }}>
        {/* Glow ambient */}
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          {submitted ? (
            /* Onboarding Success Banner */
            <div className="card animate-fade-in" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderTop: '4px solid var(--accent)' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-glow)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                border: '2px solid rgba(245, 158, 11, 0.3)'
              }}>
                <Shield size={40} />
              </div>
              
              <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.75rem' }}>
                Application Queued for Vetting
              </h2>
              <span className="badge badge-pending" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
                Application ID: {assignedAppId}
              </span>

              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '0.95rem' }}>
                Thank you for applying to MultiCare Support Malaysia Union (MCSA). Your qualifications, NRIC credentials, and medical/TB diagnostics files are queued in our private administrator vetting deck.
                <br /><br />
                Once approved, a digital membership card and barcode registry ID will be generated, and your secure portal login password (<code>123456</code>) will activate.
              </p>

              <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
                <a href="/" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
                  Return Home
                </a>
                <a href="/login" className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
                  Go to Member Portal Login
                </a>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span className="badge badge-pending" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
                  ✍️ Professional Onboarding Form
                </span>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  Register as an MCSA Caregiver
                </h1>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Join Malaysia's unified union registry. Fill out your certifications, professional categories, and health declarations below to submit for audit.
                </p>
              </div>

              <div className="card">
                <form onSubmit={handleRegister}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: '#ffffff' }}>
                    1. Identity & Contact Details
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name (Matching NRIC/Passport)</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Aisha Ibrahim"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        required
                        className="form-input"
                        placeholder="e.g. aisha@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Contact Phone Number</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. 011-2345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Preferred Work Location (City, State)</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Petaling Jaya, Selangor"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: '#ffffff' }}>
                    2. Caregiver Accreditation Details
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Accreditation Category</label>
                      <select
                        className="form-input"
                        style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="Confinement Care">🍼 Confinement Lady (月嫂)</option>
                        <option value="Patient Companion">🏥 Patient Companion (陪诊人员)</option>
                        <option value="Elderly Caregiver">👴 Elderly Caregiver (养老护理员)</option>
                        <option value="Rehabilitation Care Assistant">💪 Rehabilitation Therapist (康复助理)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Years of Experience</label>
                      <select
                        className="form-input"
                        style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }}
                        value={exp}
                        onChange={(e) => setExp(e.target.value)}
                      >
                        <option value="1 yr">1 Year</option>
                        <option value="2 yrs">2 Years</option>
                        <option value="3 yrs">3 Years</option>
                        <option value="5 yrs">5 Years</option>
                        <option value="8 yrs">8 Years</option>
                        <option value="10 yrs+">10+ Years</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Professional Statement & Bio Description</label>
                    <textarea
                      required
                      rows={4}
                      className="form-input"
                      style={{ resize: 'none' }}
                      placeholder="Briefly state your training history, specialized care skills, or previous hospital experience..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: '#ffffff' }}>
                    3. Passport Photo Identity / 证件照片
                  </h3>

                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                    {/* Live Preview Frame */}
                    <div style={{
                      width: '90px',
                      height: '110px',
                      backgroundColor: '#1e293b',
                      border: '2px solid var(--accent)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      flexShrink: 0,
                      position: 'relative'
                    }}>
                      <img 
                        src={photo} 
                        alt="Onboarding Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'/%3E%3C/svg%3E";
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(245, 158, 11, 0.95)',
                        color: '#000000',
                        fontSize: '0.55rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: '2px 0'
                      }}>
                        PREVIEW
                      </span>
                    </div>

                    {/* Presets and URL select */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label className="form-label">Select Professional Headshot Preset</label>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {[
                          { name: 'Preset A (Malay Female)', url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=256&h=256&fit=crop' },
                          { name: 'Preset B (Chinese Female)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&fit=crop' },
                          { name: 'Preset C (Indian Male)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop' },
                          { name: 'Preset D (Chinese Male)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop' }
                        ].map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            className={`btn ${photo === preset.url ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px', cursor: 'pointer' }}
                            onClick={() => setPhoto(preset.url)}
                          >
                            {preset.name.split(' ')[0] + ' ' + preset.name.split(' ')[1]}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Or enter custom image URL:</span>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', fontSize: '0.82rem', padding: '0.4rem 0.75rem', height: '36px' }}
                          placeholder="https://example.com/my-photo.jpg"
                          value={photo}
                          onChange={(e) => setPhoto(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: '#ffffff' }}>
                    4. Credentials & Diagnostics Attachments
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Professional Certification File Name</label>
                      <div style={{ position: 'relative' }}>
                        <FileText size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          required
                          className="form-input"
                          style={{ width: '100%', paddingLeft: '44px' }}
                          value={proof}
                          onChange={(e) => setProof(e.target.value)}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Provide document filename (e.g. Doula_Diploma.pdf)</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">TB & Medical Clearance Record Name</label>
                      <div style={{ position: 'relative' }}>
                        <FileText size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          required
                          className="form-input"
                          style={{ width: '100%', paddingLeft: '44px' }}
                          value={healthCert}
                          onChange={(e) => setHealthCert(e.target.value)}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Provide health diagnostic record (e.g. HKL_Medical_Report.pdf)</span>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.15)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', margin: '1.5rem 0' }}>
                    <AlertCircle size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      <strong>Licensure Fee Requirement:</strong> Submitting this registration queues you in the vetting list. Once the admin audits your files and details, approval generates a membership ID. A RM350 annual licensing fee is billed upon card issuance.
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', height: '48px' }}>
                    📢 Submit Registry Onboarding
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
