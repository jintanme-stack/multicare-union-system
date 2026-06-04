'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, CheckCircle, Heart, Users, FileText } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc' }}>
      <Navbar />

      <section style={{
        padding: '5rem 2rem',
        background: 'radial-gradient(circle at top, rgba(37,99,235,0.12) 0%, transparent 60%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img 
            src="/mcsa-logo.png" 
            alt="MCSA Logo" 
            style={{ width: '96px', height: '96px', objectFit: 'contain', margin: '0 auto 1.5rem auto', filter: 'drop-shadow(0 4px 8px rgba(37,99,235,0.2))' }} 
          />
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'Outfit' }}>
            About MCSA Union / 关于工会
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            MultiCare Support Malaysia Union (MCSA) is the regulatory organization representing certified caregivers, confinement care practitioners, and health assistants across the federation.
          </p>
        </div>
      </section>

      <section style={{ padding: '2rem 2rem 5rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {/* Row 1: Core Mission */}
          <div className="grid-cols-2" style={{ alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#ffffff' }}>Our Regulatory Mandate</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Established in response to the growing demand for verified home care and confinement nursing, MCSA regulates licenses and establishes standard guidelines for caregivers in Malaysia.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Every caregiver holding an active MCSA serial license has undergone clinical background checks, identity screening, and tuberculosis/infectious disease vetting.
              </p>
            </div>
            <div className="card" style={{ margin: 0, padding: '2.5rem', background: 'rgba(30,41,59,0.3)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <h3 style={{ color: 'var(--accent)', fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛡️ Core Quality Pillars
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', listStyle: 'none' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}><CheckCircle size={16} style={{ color: 'var(--health)', flexShrink:0 }} /> Mandatory Chest X-Ray TB Clearance</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><CheckCircle size={16} style={{ color: 'var(--health)', flexShrink:0 }} /> Verified Academic & First-Aid Certifications</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><CheckCircle size={16} style={{ color: 'var(--health)', flexShrink:0 }} /> Unified Standard Operating Procedures (SOPs)</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><CheckCircle size={16} style={{ color: 'var(--health)', flexShrink:0 }} /> Continuous Professional Development Points</li>
              </ul>
            </div>
          </div>

          {/* Row 2: Hospital Alliances */}
          <div className="card" style={{ padding: '2.5rem', background: 'rgba(15,23,42,0.4)', borderColor: 'rgba(255,255,255,0.04)' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '1rem', textAlign: 'center' }}>
              🏥 Hospital & MOH Partnerships
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
              MCSA coordinates closely with leading healthcare establishments to provide priority outpatient queues and emergency route guides for escorted patients.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              textAlign: 'center'
            }}>
              {[
                { title: 'Hospital Kuala Lumpur (HKL)', desc: 'Pre-registered clinical escort Priority' },
                { title: 'Tung Shin Hospital', desc: 'Direct outpatient counter coordinate routing maps' },
                { title: 'Surgeri Union-Cares Clinics', desc: 'Accredited TB health screening testing stations' }
              ].map((partner, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>{partner.title}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{partner.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vetting Base & Activities Gallery */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.03)', backgroundColor: 'rgba(15, 23, 42, 0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-active" style={{ marginBottom: '0.75rem' }}>📢 Accredited Vetting Activities / 资质审查与实训基地</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>Designated Vetting Base & Vitals Vetting Simulations</h2>
            <p style={{ color: 'var(--text-muted)' }}>Vetting certifications, diagnostic clearances, and simulation drills at our designated training base.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Activity 1 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', margin: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <img 
                  src="/activity-cert.jpg" 
                  alt="On-Site Examination" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <strong style={{ color: 'var(--accent)', fontSize: '0.78rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>On-Site Practical Exam</strong>
                <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Competency Vetting Assessments</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Caregivers undergoing detailed hands-on examinations. Successful candidates are awarded the accredited certificate, enabling their MCSA license setup.
                </p>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', margin: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <img 
                  src="/activity-center.jpg" 
                  alt="Official Training Base" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <strong style={{ color: 'var(--accent)', fontSize: '0.78rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>MCSA Vetting Base</strong>
                <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Caregiver Vitals & Care Simulations</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Caregivers attending the simulation workshop at Caredemy. All personnel master critical outpatient companion protocols before hospital dispatch assignments.
                </p>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', margin: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <img 
                  src="/activity-grad.jpg" 
                  alt="Companion Graduation" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <strong style={{ color: 'var(--accent)', fontSize: '0.78rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Vetted & Graduated</strong>
                <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Companion Vetting Courses</h4>
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
