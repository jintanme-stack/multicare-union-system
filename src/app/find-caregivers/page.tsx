'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { Shield, Search, Filter, Phone, Mail, MapPin, Briefcase, CheckCircle } from 'lucide-react';

export default function FindCaregiversPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setMembers(store.getUnionMembers());
  }, []);

  // Filter logic
  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === 'All' || 
      m.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '4rem 2rem', position: 'relative' }}>
        {/* Glow ambient */}
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(37,99,235,0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-active" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
              🔍 Active Registry Directory
            </span>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Find Certified Caregivers
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              Browse active, verified union members. View their specialties, experience, locations, and credential badges.
            </p>
          </div>

          {/* Filter Bar Grid Card */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }} className="desktop-filters">
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '44px', height: '46px' }}
                  placeholder="Search by name, location, or training keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <Filter size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <select
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px', height: '46px', background: 'var(--bg-input)', color: 'white', cursor: 'pointer' }}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Specialties / 所有类别</option>
                  <option value="Confinement Care">🍼 Confinement Care / 月嫂 / 坐月护理</option>
                  <option value="Patient Companion">🏥 Patient Companion / 陪诊员 / 就医陪诊</option>
                  <option value="Elderly Caregiver">👴 Elderly Caregiver / 养老护理员</option>
                  <option value="Rehabilitation Care Assistant">💪 Rehab Therapist / 康复助理</option>
                  <option value="Babysitter Service">👶 Babysitter Service / 专业保姆</option>
                </select>
              </div>
            </div>
          </div>

          {/* Directory Listings Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
            {filteredMembers.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No certified caregivers match your query.</p>
              </div>
            ) : (
              filteredMembers.map((m) => (
                <div key={m.id} className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0 0 0.25rem 0' }}>{m.name}</h3>
                        <span className="badge badge-active" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                          {m.category}
                        </span>
                      </div>
                      <a 
                        href={`/verify?id=${m.member_number}`}
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--accent)',
                          textDecoration: 'none',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontWeight: 700,
                          backgroundColor: 'var(--accent-glow)'
                        }}
                      >
                        ID Verified
                      </a>
                    </div>

                    {/* Bio */}
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem', minHeight: '4.5rem' }}>
                      "{m.bio}"
                    </p>

                    {/* Meta stats */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.82rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-main)' }}>
                        <Briefcase size={14} style={{ color: 'var(--primary)' }} /> {m.exp} exp
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-main)' }}>
                        <MapPin size={14} style={{ color: 'var(--health)' }} /> {m.location}
                      </span>
                    </div>
                  </div>

                  {/* Masked Contact Info Panel */}
                  <div style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    border: '1px dashed rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}>
                    <div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} style={{ color: 'var(--primary)', opacity: 0.6 }} />
                      <span style={{ color: 'var(--text-muted)' }}>Phone: </span>
                      <span style={{ filter: 'blur(3.5px)', userSelect: 'none', backgroundColor: '#334155', padding: '0 0.4rem', borderRadius: '3px' }}>
                        {m.phone}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} style={{ color: 'var(--primary)', opacity: 0.6 }} />
                      <span style={{ color: 'var(--text-muted)' }}>Email: </span>
                      <span style={{ filter: 'blur(3.5px)', userSelect: 'none', backgroundColor: '#334155', padding: '0 0.4rem', borderRadius: '3px' }}>
                        {m.email}
                      </span>
                    </div>

                    <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.6rem', marginTop: '0.25rem' }}>
                      <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
                        🔒 Member Login to View Profile Details
                      </a>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
