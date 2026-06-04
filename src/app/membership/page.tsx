'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DollarSign, ShieldCheck, FileText, Sparkles, Award } from 'lucide-react';

export default function MembershipPage() {
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
            MCSA Union Membership
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Accredit your caregiving skills, join the official Malaysian registry, and access private hospital routing priorities.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 2rem 5rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
          {/* Left: Benefits */}
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', color: '#ffffff' }}>Why Join MultiCare Support Malaysia Union?</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                {
                  icon: <ShieldCheck size={24} style={{ color: 'var(--accent)' }} />,
                  title: 'Official Licensure & Verification Profile',
                  desc: 'Every member receives a searchable public license profile. Hospitals and clients verify your active standing via our verify portal.'
                },
                {
                  icon: <Sparkles size={24} style={{ color: 'var(--primary)' }} />,
                  title: 'Holographic Digital Union Card',
                  desc: 'Unlock check-in prioritization at major clinics and hospitals with a secure digital ID card including a verified smart chip.'
                },
                {
                  icon: <FileText size={24} style={{ color: 'var(--health)' }} />,
                  title: 'Private Hospital SOP & Floor Guide Library',
                  desc: 'Get immediate access to maps, emergency coordinate layouts, and outpatient guidelines published directly by union admins.'
                },
                {
                  icon: <Award size={24} style={{ color: 'var(--primary)' }} />,
                  title: 'Continuous Case Dispatch Streams',
                  desc: 'Access client dispatches directly. You can view local caregiver posts and contact clients directly to confirm dispatches.'
                }
              ].map((benefit, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flexShrink: 0 }}>{benefit.icon}</div>
                  <div>
                    <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: '0 0 0.25rem 0' }}>{benefit.title}</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pricing Table */}
          <div className="card" style={{ 
            margin: 0, 
            padding: '2.5rem', 
            background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.8) 100%)', 
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div>
              <span className="badge badge-active" style={{ marginBottom: '1rem' }}>VETTED LICENSE</span>
              <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>Annual Registry License</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Active valid membership for 365 days</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent)' }}>RM</span>
                <span style={{ fontSize: '3.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'Outfit' }}>350</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', alignSelf: 'flex-end', paddingBottom: '0.75rem' }}>/ year</span>
              </div>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1.5rem' }}>
                Includes digital card validation, medical insurance coverage priority, first-aid SOP updates, and search listing placements.
              </p>
              <a href="/register" className="btn btn-primary" style={{ width: '100%', borderRadius: '10px' }}>
                Apply for Registration
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
