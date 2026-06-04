'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Briefcase, Heart, Shield, Users, CheckSquare } from 'lucide-react';

export default function ServicesPage() {
  const serviceDetails = [
    {
      title: '🍼 Confinement Care / 专业月嫂',
      desc: 'Expert neonatal support, lactation guidance, infant hygiene, and recovery diet planning for new mothers.',
      skills: ['Newborn Vitals Monitoring', 'Lactation Consultation', 'Postpartum Meal Plans', 'Sleep Scheduling']
    },
    {
      title: '🏥 Patient Companion / 医院陪诊员',
      desc: 'Comprehensive outpatient navigation, clinical routing assistance, drug pickup coordination, and family communication logging.',
      skills: ['Hospital SOP Checkpoints', 'Bilingual Patient Escort', 'Prescription Retrievals', 'Doctor Recommendation Logs']
    },
    {
      title: '👴 Elderly Caregiver / 养老护理员',
      desc: 'Vital signs tracking, daily cognitive stimulation, senior diet tracking, mobility checkups, and medication reminders.',
      skills: ['Systolic/Diastolic BP Logs', 'Glucose Tracking', 'Mobility & Fall Prevention', 'Daily Vitals Sync']
    },
    {
      title: '💪 Rehabilitation Care Assistant / 康复助理',
      desc: 'Accompanying post-op stroke patients through mobility therapy, physical rehab schedules, and motor skills practice.',
      skills: ['Motor Function Exercises', 'Stroke Recovery Milestones', 'Physiotherapy Companionship', 'Coordination Assist']
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc' }}>
      <Navbar />

      <section style={{
        padding: '5rem 2rem',
        background: 'radial-gradient(circle at top, rgba(37,99,235,0.12) 0%, transparent 60%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'Outfit' }}>
            MCSA Caregiver Specializations
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Accredited caregivers are categorized based on specialized clinical skills and training paths. Click Register to enter the licensing registry.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 2rem 5rem 2rem' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem'
        }}>
          {serviceDetails.map((service, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', margin: 0 }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.75rem', fontFamily: 'Outfit' }}>
                  {service.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {service.desc}
                </p>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.03)',
                padding: '1rem 1.25rem',
                borderRadius: '10px'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                  Core Standard Competencies
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {service.skills.map((skill, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#ffffff' }}>
                      <CheckSquare size={14} style={{ color: 'var(--health)', flexShrink: 0 }} />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
