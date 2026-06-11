'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Lightbox from '@/components/Lightbox';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';
import { Shield, CheckCircle, Heart, Users, FileText } from 'lucide-react';

export default function AboutPage() {
  const [lang, setLang] = useState<Language>('en');
  const [activityPhotos, setActivityPhotos] = useState<any[]>([]);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setLang(store.getLanguage() as Language);
    setActivityPhotos(store.getActivityPhotos());
  }, []);

  const t = (translations[lang] && translations[lang].about) ? translations[lang] : translations.en;
  const tAbout = t.about || {};
  const photos = Array.isArray(activityPhotos) ? activityPhotos : [];

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
            {tAbout.title || 'About MCSA'} / {lang === 'zh' ? '关于公会' : lang === 'bm' ? 'Mengenai Kesatuan' : 'About MCSA'}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {tAbout.subtitle || ''}
          </p>
        </div>
      </section>

      <section style={{ padding: '2rem 2rem 5rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {/* Row 1: Core Mission */}
          <div className="grid-cols-2" style={{ alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#ffffff' }}>{lang === 'zh' ? '公会资质监管条例' : lang === 'bm' ? 'Mandat Kawal Selia Kami' : 'Our Regulatory Mandate'}</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                {tAbout.historyDesc || ''}
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
            <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '1.25rem', textAlign: 'center' }}>
              🏥 {lang === 'zh' ? '医院与卫生机构合作前景' : lang === 'bm' ? 'SOP Rangkaian Hospital & Kerjasama' : 'Hospital SOP Frameworks & Collaboration'}
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center', maxWidth: '800px', margin: '0 auto 1.75rem auto' }}>
              {lang === 'zh' ? '为建立规范化的就医陪诊体系，MCSA 致力于与马来西亚各大医院及医疗机构达成紧密协作，为受陪护患者提供规范的就医通道引导以及医院急救 SOP 路线指引。' : lang === 'bm' ? 'Bagi membina sistem pengiring perubatan yang standard, MCSA komited untuk menjalinkan kerjasama rapat dengan institusi penjagaan kesihatan di Malaysia untuk panduan laluan SOP.' : 'To establish a standardized medical escort system, MCSA is committed to building close coordination protocols with leading healthcare institutions to provide SOP workflow route guides for escorted patients.'}
            </p>

            {/* Partnership Invitation Banner */}
            <div style={{
              padding: '1.75rem 2rem',
              borderRadius: '12px',
              background: 'rgba(37, 99, 235, 0.06)',
              border: '1px solid rgba(37, 99, 235, 0.15)',
              textAlign: 'center'
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
                maxWidth: '750px',
                margin: '0 auto'
              }}>
                🤝 <strong>{lang === 'zh' ? '欢迎建立官方合作伙伴关系：' : lang === 'bm' ? 'Peluang Kerjasama Rakan Hospital & Klinik:' : 'Healthcare Partner Collaboration Invitation:'}</strong>
                <span>
                  {lang === 'zh'
                    ? '公会在此诚挚欢迎各大医院、医疗诊所及健康体检机构与 MCSA 开展官方深度合作。让我们携手推动照护陪诊行业的规范化与健康发展，确保马来西亚的每一个家庭都能得到最专业、贴心的照料！'
                    : lang === 'bm'
                    ? 'Kami amat mengalu-alukan kerjasama rasmi daripada pihak hospital, klinik & institusi kesihatan untuk bersama-sama menstandardkan industri penjagaan, memastikan setiap keluarga di Malaysia dijaga dengan baik.'
                    : 'MCSA warmly welcomes official partnerships from hospitals, medical clinics, and healthcare entities. Together, we can regulate and elevate the caregiving industry to ensure every family in Malaysia receives safe, healthy, and high-quality care.'}
                </span>
              </p>
              <div style={{ marginTop: '1rem' }}>
                <a 
                  href="/contact" 
                  style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    color: 'var(--primary)', 
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#60a5fa'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary)'}
                >
                  {lang === 'zh' ? '与我们取得联系探讨合作 ➔' : lang === 'bm' ? 'Hubungi kami sekarang untuk bekerjasama ➔' : 'Contact us to discuss collaboration opportunities ➔'}
                </a>
              </div>
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
            <p style={{ color: 'var(--text-muted)' }}>{lang === 'zh' ? '在公会官方认证培训基地进行的高标准专业实操考核、生命体征监测和急救演练。' : lang === 'bm' ? 'Sijil penilaian kecekapan, pemeriksaan kesihatan, dan latihan simulasi di tapak latihan rasmi kami.' : 'Vetting certifications, diagnostic clearances, and simulation drills at our designated training base.'}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {photos.map((photo, index) => (
              <div 
                key={photo?.id || Math.random()} 
                onClick={() => {
                  setLightboxIndex(index);
                  setShowLightbox(true);
                }}
                className="card animate-fade-in" 
                style={{ padding: 0, overflow: 'hidden', margin: 0, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              >
                <div style={{ height: '240px', overflow: 'hidden' }}>
                  {photo?.url && (
                    <img 
                      src={photo.url} 
                      alt={photo.caption || 'Activity'} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  )}
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <strong style={{ color: 'var(--accent)', fontSize: '0.78rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    {lang === 'zh' ? '实操考核/培训活动' : lang === 'bm' ? 'Penilaian Praktikal Tapak' : 'Practical Examination'}
                  </strong>
                  <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '0.5rem' }}>{photo?.caption || ''}</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {lang === 'zh' ? '在公会战略合作伙伴 Caredemy 培训中心进行的高标准实务技巧核查与日常照护流程演练。' : lang === 'bm' ? 'Penilaian kemahiran praktikal standard tinggi atau latihan kecemasan yang dijalankan di pusat latihan rasmi Caredemy.' : 'High-standard professional practical assessment or emergency drill conducted at our strategic partner Caredemy Training Center.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        isOpen={showLightbox}
        photos={photos.map(p => ({ url: p.url, caption: p.caption }))}
        currentIndex={lightboxIndex}
        onClose={() => setShowLightbox(false)}
        onChangeIndex={setLightboxIndex}
      />

      <Footer />
    </div>
  );
}
