'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { Shield, PlusCircle, CheckCircle, Search, HelpCircle, Heart, Users, MapPin, Phone } from 'lucide-react';

export default function HomePage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [clientName, setClientName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('Confinement Care');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setRequests(store.getCareRequests());
  }, []);

  const handlePostRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !contact || !message) return;

    const newReq = {
      id: 'REQ-' + Math.floor(100 + Math.random() * 900),
      name: clientName,
      contact,
      category,
      message,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newReq, ...requests];
    setRequests(updated);
    store.setCareRequests(updated);

    setClientName('');
    setContact('');
    setMessage('');
    alert('Care request posted successfully! It will appear on our caregivers dispatch timeline boards.');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        background: 'radial-gradient(circle at center, rgba(37,99,235,0.15) 0%, transparent 60%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img 
            src="/mcsa-logo.png" 
            alt="MCSA Logo" 
            style={{ width: '110px', height: '110px', objectFit: 'contain', margin: '0 auto 1.5rem auto', filter: 'drop-shadow(0 4px 10px rgba(37,99,235,0.25))' }} 
          />
          <span className="badge badge-pending" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
            🏆 Top Accredited Caregiver Association in Malaysia / 马来西亚多元关怀支持公会官方网
          </span>
          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Certified Confinement Lady & Professional Care Registry
          </h1>
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '2.5rem'
          }}>
            MultiCare Support Malaysia Union (MCSA) accredits, registers, and audits medical companions, confinement practitioners (月嫂), elderly caregivers, and rehab therapists nationwide.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/register" className="btn btn-primary" style={{ padding: '0.9rem 2rem', borderRadius: '12px' }}>
              ✍️ Join Union as Caregiver
            </a>
            <a href="/find-caregivers" className="btn btn-outline" style={{ padding: '0.9rem 2rem', borderRadius: '12px' }}>
              🔍 Find Verified Caregivers
            </a>
          </div>
        </div>
      </section>

      {/* Stats Board */}
      <section style={{ padding: '2rem 2rem 4rem 2rem' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem'
        }}>
          {[
            { num: '10,000+', title: 'Accredited Members' },
            { num: '50+', title: 'Partner Hospitals' },
            { num: '100% Vetted', title: 'TB & Health Clearance' },
            { num: 'RM 350/yr', title: 'Affordable Licensure' }
          ].map((stat, idx) => (
            <div key={idx} className="card" style={{ textAlign: 'center', padding: '1.5rem', margin: 0 }}>
              <h3 style={{ fontSize: '2rem', color: '#60a5fa', margin: '0 0 0.25rem 0' }}>{stat.num}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{stat.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cooperating Partners Section */}
      <section style={{ padding: '3rem 2rem', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)', backgroundColor: 'rgba(15, 23, 42, 0.2)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <span className="badge badge-active" style={{ marginBottom: '0.75rem' }}>Strategic Vetting Partner / 战略合作伙伴单位</span>
            <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '1rem', fontFamily: 'Outfit' }}>
              Official Caregiver Training Center: Caredemy
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
              MCSA Malaysia collaborates with <strong>Caredemy Training Center</strong> to mandate high-quality professional training, first-aid drills, and hospital escort simulations. Caregivers who pass the Caredemy clinical exam are issued MCSA union serial IDs and listed on the national priority dispatch registry.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1 1 300px', justifyContent: 'center' }}>
            <div style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '240px'
            }}>
              <img 
                src="/caredemy-logo.jpg" 
                alt="Caredemy Logo" 
                style={{ width: '100%', height: 'auto', maxHeight: '130px', objectFit: 'contain' }} 
              />
              <span style={{ fontSize: '0.75rem', color: '#1e3a8a', fontWeight: 'bold', marginTop: '0.75rem', letterSpacing: '0.05em' }}>
                CAREDEMY TRAINING CENTER
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Care Demands Board (Dual Column Split) */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Live Care Demands & Client Posts / 实时诉求发布</h2>
            <p style={{ color: 'var(--text-muted)' }}>Families post care requests here. Vetted Union members can contact them directly.</p>
          </div>

          <div className="grid-cols-2">
            {/* Left: Request Form */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <PlusCircle size={20} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Post Your Care Request / 发布您的护理诉求</h3>
              </div>
              <form onSubmit={handlePostRequest}>
                <div className="form-group">
                  <label className="form-label">Client Name / 您的姓名</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Mrs. Lim"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Number (Only Union Members Can View)</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. 012-3456789 (Will be blurred)"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Required Category / 所需类别</label>
                  <select
                    className="form-input"
                    style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Confinement Care">🍼 Confinement Lady / 月嫂</option>
                    <option value="Patient Companion">🏥 Patient Companion / 陪诊人员</option>
                    <option value="Elderly Caregiver">👴 Elderly Caregiver / 养老护理员</option>
                    <option value="Rehabilitation Care Assistant">💪 Rehab Therapist / 康复助理</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Your Demands (Due dates, timeline, location, budget)</label>
                  <textarea
                    required
                    rows={4}
                    className="form-input"
                    style={{ resize: 'none' }}
                    placeholder="e.g., My due date is Dec 2nd 2026, looking for a confinement lady in Puchong location."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  📢 Post Care Demand
                </button>
              </form>
            </div>

            {/* Right: Demand Listing Board */}
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--health)' }} /> Active Client Posts ({requests.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {requests.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No care requests posted yet.</p>
                ) : (
                  requests.map((req) => (
                    <div key={req.id} className="card" style={{ margin: 0, padding: '1.25rem', borderLeft: '4px solid var(--accent)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span className="badge badge-active" style={{ fontSize: '0.72rem' }}>{req.category}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📅 {req.date}</span>
                      </div>
                      <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: '0 0 0.5rem 0' }}>Request by: {req.name}</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 1rem 0' }}>
                        "{req.message}"
                      </p>
                      
                      {/* Phone Masking System */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(15,23,42,0.3)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        border: '1px dashed rgba(255,255,255,0.06)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Phone size={14} style={{ color: 'var(--accent)' }} />
                          <span>Contact: </span>
                          <span style={{ 
                            filter: 'blur(4px)', 
                            backgroundColor: '#475569', 
                            padding: '0 0.5rem', 
                            borderRadius: '3px',
                            userSelect: 'none'
                          }}>
                            {req.contact}
                          </span>
                        </div>
                        <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
                          🔒 Member Login to View
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Photos Section */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-active" style={{ marginBottom: '0.75rem' }}>📸 On-Site Training Activities / 培训与公会活动</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>Latest Caregiver Vetting & Graduation Highlights</h2>
            <p style={{ color: 'var(--text-muted)' }}>Vetting certifications, diagnostic clearances, and simulation drills at our designated training base.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Card 1 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', margin: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src="/activity-cert.jpg" 
                  alt="Competency Vetting" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15,23,42,0.85)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 'bold' }}>
                  Competency Vetting
                </span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '0.5rem' }}>On-Site Practical Exam & Evaluation</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Caregivers undergoing detailed hands-on examinations. Successful candidates are awarded the accredited certificate, enabling their MCSA license setup.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', margin: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src="/activity-center.jpg" 
                  alt="Training Base" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15,23,42,0.85)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 'bold' }}>
                  MCSA Training Base
                </span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Intensive Clinical & Escort Simulation</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Caregivers attending the simulation workshop at Caredemy. All personnel master critical outpatient companion protocols before hospital dispatch assignments.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', margin: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src="/activity-grad.jpg" 
                  alt="Graduation Group" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15,23,42,0.85)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 'bold' }}>
                  ASSIST PLUS Graduation
                </span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Accredited Escort Program Graduation</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Graduation ceremony of MCSA escort companion care course (April 2026). Certified professionals, ready to coordinate elder priorities and hospital transports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
