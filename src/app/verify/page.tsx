'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';
import { Shield, Search, CheckCircle, AlertTriangle, Calendar, User, FileCheck, HelpCircle } from 'lucide-react';

export default function VerifyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [member, setMember] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    setLang(store.getLanguage() as Language);
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setSearchQuery(id);
      handleSearch(id);
    }
  }, []);

  const handleSearch = (id: string) => {
    const cleanId = id.replace(/[\s-]/g, '').toUpperCase();
    const members = store.getUnionMembers();
    const found = members.find((m: any) => m.member_number.replace(/[\s-]/g, '').toUpperCase() === cleanId);
    
    setMember(found || null);
    setHasSearched(true);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    handleSearch(searchQuery);
  };

  const maskPhone = (phone: string) => {
    if (!phone) return '';
    return phone.slice(0, 3) + '-****' + phone.slice(-3);
  };

  const maskEmail = (email: string) => {
    if (!email) return '';
    const parts = email.split('@');
    if (parts.length < 2) return email;
    return parts[0].slice(0, 2) + '***@' + parts[1];
  };

  const t = translations[lang] || translations.en;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '4rem 2rem', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-active" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
              🛡️ {lang === 'zh' ? '实时资质在线核验' : lang === 'bm' ? 'Semakan Lesen Kesatuan Serta-Merta' : 'Live Licensure Lookup'}
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {t.verify.title}
            </h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {t.verify.subtitle}
            </p>
          </div>

          {/* Search Box */}
          <div className="card animate-fade-in" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
            <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '48px', height: '52px' }}
                  placeholder={t.verify.inputPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem', height: '52px', borderRadius: '12px' }}>
                {t.verify.searchBtn}
              </button>
            </form>
          </div>

          {/* Results Block */}
          {hasSearched && (
            <div className="animate-fade-in">
              {member ? (
                /* Found State */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Digital Card Rendering */}
                  <div style={{
                    alignSelf: 'center',
                    width: '100%',
                    maxWidth: '460px',
                    height: '276px',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    {/* Glowing highlight reflection */}
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.08) 50%, transparent 55%)',
                      pointerEvents: 'none'
                    }}></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                          MULTICARE SUPPORT UNION
                        </h3>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '0.08em' }}>
                          MCSA MALAYSIA VALIDATED REGISTRY
                        </span>
                      </div>
                      <img 
                        src="/mcsa-logo.png" 
                        alt="MCSA Logo" 
                        style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'white', padding: '1px' }} 
                      />
                    </div>
                    
                    {/* Chip & Photo Row */}
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', margin: '0.5rem 0' }}>
                      {/* Photo box */}
                      <div style={{
                        width: '70px',
                        height: '85px',
                        backgroundColor: '#1e293b',
                        border: '2px solid var(--accent)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        position: 'relative',
                        flexShrink: 0
                      }}>
                        {member.photo ? (
                          <img 
                            src={member.photo} 
                            alt={member.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '36px', height: '36px', color: 'var(--text-muted)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        )}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: 'rgba(245, 158, 11, 0.9)',
                          color: '#000000',
                          fontSize: '0.45rem',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          padding: '1px 0'
                        }}>
                          PHOTO ID
                        </div>
                      </div>

                      {/* Member Info */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                            {lang === 'zh' ? '会员执照编号' : lang === 'bm' ? 'ID Keahlian' : 'Membership ID'}
                          </span>
                          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#ffffff', letterSpacing: '0.05em' }}>
                            {member.member_number}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>{t.verify.specialty}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }}>
                            {member.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>{t.verify.holderName}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{member.name}</span>
                      </div>
                      
                      {/* Status stamp */}
                      <div style={{
                        border: '2px solid var(--health)',
                        color: 'var(--health)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        transform: 'rotate(-5deg)',
                        textTransform: 'uppercase',
                        backgroundColor: 'var(--bg-main)',
                        marginRight: 'auto',
                        marginLeft: '1rem'
                      }}>
                        ✓ {t.verify.activeStatus}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>{t.verify.expiration}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>{member.expiry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details Sheet */}
                  <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                      <CheckCircle size={24} style={{ color: 'var(--health)' }} />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{t.verify.accreditationTitle}</h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.verify.accreditationDesc}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>{t.verify.holderName}</span>
                          <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>{member.name}</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>{lang === 'zh' ? '登记类目' : lang === 'bm' ? 'Kategori Daftar' : 'Registry Category'}</span>
                          <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>{member.category}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>{t.verify.primaryLocation}</span>
                          <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>{member.location || 'Kuala Lumpur'}</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>{t.verify.experience}</span>
                          <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>{member.exp}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>{t.verify.maskedEmail}</span>
                          <span style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{maskEmail(member.email)}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>{t.verify.maskedPhone}</span>
                          <span style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{maskPhone(member.phone)}</span>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.15)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                        <FileCheck size={20} style={{ color: 'var(--health)', flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                          <strong>{t.verify.adviceTitle}</strong> {t.verify.adviceDesc}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                /* Not Found State */
                <div className="card" style={{ padding: '2.5rem', textAlign: 'center', borderColor: 'var(--danger)', borderLeft: '4px solid var(--danger)' }}>
                  <AlertTriangle size={48} style={{ color: 'var(--danger)', margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t.verify.notFoundTitle}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
                    {t.verify.notFoundDesc} (<code>{searchQuery}</code>)
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button 
                      onClick={() => { setHasSearched(false); setSearchQuery(''); }}
                      className="btn btn-outline" 
                      style={{ fontSize: '0.85rem' }}
                    >
                      {t.verify.clearBtn}
                    </button>
                    <a href="/contact" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                      {t.verify.contactBtn}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
