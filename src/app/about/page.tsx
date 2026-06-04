'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';
import { Shield, CheckCircle, Heart, Users, FileText } from 'lucide-react';

export default function AboutPage() {
  const [lang, setLang] = useState<Language>('en');
  const [activityPhotos, setActivityPhotos] = useState<any[]>([]);

  useEffect(() => {
    setLang(store.getLanguage() as Language);
    setActivityPhotos(store.getActivityPhotos());
  }, []);

  const t = translations[lang] || translations.en;

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
            {t.about.title} / {lang === 'zh' ? '关于工会' : lang === 'bm' ? 'Mengenai Kesatuan' : 'About MCSA'}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {t.about.subtitle}
          </p>
        </div>
      </section>

      <section style={{ padding: '2rem 2rem 5rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {/* Row 1: Core Mission */}
          <div className="grid-cols-2" style={{ alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#ffffff' }}>{lang === 'zh' ? '工会资质监管条例' : lang === 'bm' ? 'Mandat Kawal Selia Kami' : 'Our Regulatory Mandate'}</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                {t.about.historyDesc}
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {lang === 'zh' ? '每一位持有有效 MCSA 执业序列号的护理师均已通过临床背景核查、身份审查和肺结核传染病体检筛查。' : lang === 'bm' ? 'Setiap penjaga yang memegang lesen bersiri MCSA aktif telah menjalani pemeriksaan latar belakang klinikal, tapisan identiti, dan saringan kesihatan TB.' : 'Every caregiver holding an active MCSA serial license has undergone clinical background checks, identity screening, and tuberculosis/infectious disease vetting.'}
              </p>
            </div>
            <div className="card" style={{ margin: 0, padding: '2.5rem', background: 'rgba(30,41,59,0.3)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <h3 style={{ color: 'var(--accent)', fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛡️ {lang === 'zh' ? '三大核心安全支柱' : lang === 'bm' ? 'Tiga Pilar Kualiti Teras' : 'Core Quality Pillars'}
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', listStyle: 'none' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}><CheckCircle size={16} style={{ color: 'var(--health)', flexShrink:0 }} /> {lang === 'zh' ? '结核病胸部 X 光合格证' : lang === 'bm' ? 'Kelulusan Pemeriksaan X-Ray TB Mandatori' : 'Mandatory Chest X-Ray TB Clearance'}</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><CheckCircle size={16} style={{ color: 'var(--health)', flexShrink:0 }} /> {lang === 'zh' ? '认证学术水平与急救证书' : lang === 'bm' ? 'Sijil Kecekapan & Pertolongan Cemas Disahkan' : 'Verified Academic & First-Aid Certifications'}</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><CheckCircle size={16} style={{ color: 'var(--health)', flexShrink:0 }} /> {lang === 'zh' ? '统一临床标准工作守则' : lang === 'bm' ? 'Prosedur Operasi Standard (SOP) Bersepadu' : 'Unified Standard Operating Procedures (SOPs)'}</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><CheckCircle size={16} style={{ color: 'var(--health)', flexShrink:0 }} /> {lang === 'zh' ? '持续专业职业培训积分' : lang === 'bm' ? 'Mata Pembangunan Profesional Berterusan' : 'Continuous Professional Development Points'}</li>
              </ul>
            </div>
          </div>

          {/* Row 2: Hospital Alliances */}
          <div className="card" style={{ padding: '2.5rem', background: 'rgba(15,23,42,0.4)', borderColor: 'rgba(255,255,255,0.04)' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '1rem', textAlign: 'center' }}>
              🏥 {lang === 'zh' ? '医院与卫生机构合作伙伴联盟' : lang === 'bm' ? 'Kerjasama Hospital & Kementerian' : 'Hospital & MOH Partnerships'}
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
              {lang === 'zh' ? 'MCSA 密切与马来西亚主流医疗机构合作，为受陪护患者提供绿色就医通道优先预约以及医院急救导航指导。' : lang === 'bm' ? 'MCSA bekerjasama rapat dengan institusi penjagaan kesihatan terkemuka untuk menyediakan giliran keutamaan pesakit luar dan panduan laluan kecemasan.' : 'MCSA coordinates closely with leading healthcare establishments to provide priority outpatient queues and emergency route guides for escorted patients.'}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              textAlign: 'center'
            }}>
              {[
                { title: 'Hospital Kuala Lumpur (HKL)', desc: lang === 'zh' ? '预注册临床就医优先通道' : lang === 'bm' ? 'Keutamaan Pengiring Klinikal Pra-Pendaftaran' : 'Pre-registered clinical escort Priority' },
                { title: 'Tung Shin Hospital', desc: lang === 'zh' ? '直接对接门诊柜台及就医导航图' : lang === 'bm' ? 'Peta Laluan Kaunter Pesakit Luar Langsung' : 'Direct outpatient counter coordinate routing maps' },
                { title: 'Surgeri Union-Cares Clinics', desc: lang === 'zh' ? '授权的结核病胸透健康体检测试点' : lang === 'bm' ? 'Stesen Pemeriksaan Saringan Kesihatan TB Bertauliah' : 'Accredited TB health screening testing stations' }
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
            <span className="badge badge-active" style={{ marginBottom: '0.75rem' }}>📢 {lang === 'zh' ? '实操培训与资质审查基地' : lang === 'bm' ? 'Aktiviti Tapisan & Latihan Penjaga Bertauliah' : 'Accredited Vetting Activities'}</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>{lang === 'zh' ? '专属资质审查基地与实操模拟演练' : lang === 'bm' ? 'Pusat Latihan Penilaian & Latihan Simulasi Penjaga' : 'Designated Vetting Base & Vitals Vetting Simulations'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{lang === 'zh' ? '在工会官方认证培训基地进行的高标准专业实操考核、生命体征监测和急救演练。' : lang === 'bm' ? 'Sijil penilaian kecekapan, pemeriksaan kesihatan, dan latihan simulasi di tapak latihan rasmi kami.' : 'Vetting certifications, diagnostic clearances, and simulation drills at our designated training base.'}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {activityPhotos.map((photo) => (
              <div key={photo.id} className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden', margin: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '240px', overflow: 'hidden' }}>
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <strong style={{ color: 'var(--accent)', fontSize: '0.78rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    {lang === 'zh' ? '实操考核/培训活动' : lang === 'bm' ? 'Penilaian Praktikal Tapak' : 'Practical Examination'}
                  </strong>
                  <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '0.5rem' }}>{photo.caption}</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {lang === 'zh' ? '在工会战略合作伙伴 Caredemy 培训中心进行的高标准实务技巧核查与日常照护流程演练。' : lang === 'bm' ? 'Penilaian kemahiran praktikal standard tinggi atau latihan kecemasan yang dijalankan di pusat latihan rasmi Caredemy.' : 'High-standard professional practical assessment or emergency drill conducted at our strategic partner Caredemy Training Center.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
