'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Calendar, FileText, PhoneCall, AlertCircle, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';
import { store } from '@/lib/store';

export default function FamilyPortal() {
  const [patientName, setPatientName] = useState('Jianguo Zhang (Grandpa Zhang)');
  const [careType, setCareType] = useState('Elderly Chronic Care');
  const [assignedCaregiver, setAssignedCaregiver] = useState('Li Xiulan (MCSA-2026-0009)');
  const [caregiverPhone, setCaregiverPhone] = useState('012-8888776');

  useEffect(() => {
    const clientEmail = localStorage.getItem('mcsa_client_email');
    if (clientEmail) {
      const requests = store.getCareRequests();
      const found = requests.find((r: any) => 
        r.name.toLowerCase().includes(clientEmail.toLowerCase()) || 
        r.contact.includes(clientEmail)
      );

      if (found) {
        setPatientName(`${found.name}'s Family Case`);
        setCareType(found.category);
        
        if (found.category === 'Confinement Care') {
          setAssignedCaregiver('Meizhen Chen (MCSA-2026-1112)');
          setCaregiverPhone('019-3322114');
        } else {
          setAssignedCaregiver('Li Xiulan (MCSA-2026-0009)');
          setCaregiverPhone('012-8888776');
        }
      }
    }
  }, []);
  
  const dailyVitals = [
    { time: '12:30', bp: '134/84 mmHg', sugar: '6.2 mmol/L', pulse: '75 bpm', status: 'Normal' },
    { time: '08:30', bp: '130/82 mmHg', sugar: '5.6 mmol/L', pulse: '72 bpm', status: 'Normal' }
  ];

  const shiftEvents = [
    { time: '14:20', desc: 'Diabetes prescription retrieved from pharmacy counter.' },
    { time: '12:30', desc: 'Completed afternoon health checklist and vitals entry.' },
    { time: '10:45', desc: 'Doctor recommended increasing daily walk cycle to 20 minutes.' },
    { time: '08:30', desc: 'Shift started. In good spirits. Completed morning vitals check.' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc', paddingBottom: '3rem' }}>
      {/* Top Header */}
      <header style={{
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        color: 'white',
        padding: '1.5rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-md)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--health) 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={22} style={{ color: '#ffffff' }} />
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: '1.25rem', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
              MCSA Family Live Tracker
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Patient: {patientName}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <span className="badge badge-active" style={{ background: 'var(--health-glow)', color: 'var(--health)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'inline-flex', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--health)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span> Real-time Connected
          </span>
          <a href="/" style={{ color: '#fca5a5', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.color='#f87171'} onMouseOut={(e)=>e.currentTarget.style.color='#fca5a5'}>Log Out Portal</a>
        </div>
      </header>

      {/* Main Grid */}
      <main style={{ maxWidth: '1200px', margin: '2.5rem auto', padding: '0 2rem' }} className="animate-fade-in">
        
        {/* Caregiver Summary Block with Premium gradient border */}
        <div className="card" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'linear-gradient(90deg, rgba(37,99,235,0.08) 0%, rgba(30,41,59,0.5) 100%)', 
          borderLeft: '5px solid var(--primary)',
          borderRadius: '16px',
          padding: '1.5rem 2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: '0 0 0.25rem 0' }}>Active Service Assignment / 当前服务派单</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Assigned Companion: <strong style={{ color: '#ffffff' }}>{assignedCaregiver}</strong> &bull; Care Segment: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{careType}</span>
            </p>
          </div>
          <button 
            onClick={() => alert(`Dialing assigned companion hotline: ${caregiverPhone}`)}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', borderRadius: '10px' }}
          >
            <PhoneCall size={16} /> Call Companion
          </button>
        </div>

        <div className="grid-cols-2">
          {/* Timeline Tracking */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
              <Calendar size={22} style={{ color: 'var(--primary)' }} />
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Live Shift Milestone Logs / 实时服务记录</h3>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              borderLeft: '2px solid rgba(255,255,255,0.06)',
              paddingLeft: '1.75rem',
              marginLeft: '0.5rem',
              position: 'relative'
            }}>
              {shiftEvents.map((evt, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  {/* Glowing Node Point */}
                  <div style={{
                    width: '14px',
                    height: '14px',
                    backgroundColor: idx === 0 ? 'var(--primary)' : '#475569',
                    borderRadius: '50%',
                    position: 'absolute',
                    left: '-26px',
                    top: '4px',
                    border: '3px solid #0b1329',
                    boxShadow: idx === 0 ? '0 0 10px var(--primary)' : 'none'
                  }}></div>
                  
                  <span style={{ 
                    fontSize: '0.78rem', 
                    color: idx === 0 ? 'var(--primary)' : 'var(--text-muted)', 
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.03)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontFamily: 'monospace'
                  }}>
                    {evt.time}
                  </span>
                  
                  <p style={{ 
                    fontSize: '0.92rem', 
                    color: idx === 0 ? '#ffffff' : 'var(--text-muted)', 
                    marginTop: '0.4rem', 
                    lineHeight: 1.45,
                    margin: '0.4rem 0 0 0'
                  }}>
                    {evt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vitals & Health parameters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Vitals Summary */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Heart size={22} style={{ color: 'var(--health)' }} />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Clinical Vitals Stream / 健康指征监测</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {dailyVitals.map((v, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.06)', 
                    paddingBottom: '0.85rem' 
                  }}>
                    <div>
                      <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ffffff' }}>
                        BP: {v.bp} &bull; Sugar: {v.sugar}
                      </span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        💓 Pulse: {v.pulse} &bull; Logged at {v.time} Today
                      </div>
                    </div>
                    <span className="badge badge-active" style={{ padding: '0.25rem 0.6rem' }}>
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Vetted Instructions */}
            <div className="card" style={{ borderLeft: '5px solid var(--accent)', background: 'linear-gradient(90deg, rgba(245,158,11,0.04) 0%, rgba(30,41,59,0.5) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ShieldAlert size={22} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Critical Medical Directives / 医疗核审指示</h3>
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: 'var(--text-main)', 
                lineHeight: 1.6,
                background: 'rgba(255,255,255,0.01)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.03)'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Log blood sugar values 30 minutes prior to serving insulin meals.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Administer morning post-breakfast Aspirin dosage with 250ml water.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Store critical contact protocols near the entrance display panel.</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
