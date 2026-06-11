'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';
import { DollarSign, ShieldCheck, FileText, Sparkles, Award } from 'lucide-react';

export default function MembershipPage() {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    setLang(store.getLanguage() as Language);
  }, []);

  const t = translations[lang] || translations.en;

  const benefitsList = [
    {
      icon: <ShieldCheck size={24} style={{ color: 'var(--accent)' }} />,
      title: lang === 'zh' ? '官方执业资格与在线核验档案' : lang === 'bm' ? 'Lesen Rasmi & Profil Pengesahan' : 'Official Licensure & Verification Profile',
      desc: lang === 'zh' ? '每位会员都拥有可供公开查询的个人执业验证页面。医院和客户可通过公会平台秒级查验你的执业状态。' : lang === 'bm' ? 'Setiap ahli menerima profil lesen awam yang boleh dicari. Hospital dan pelanggan mengesahkan status aktif anda melalui portal sah kami.' : 'Every member receives a searchable public license profile. Hospitals and clients verify your active standing via our verify portal.'
    },
    {
      icon: <Sparkles size={24} style={{ color: 'var(--primary)' }} />,
      title: lang === 'zh' ? '全息渐变数字公会卡' : lang === 'bm' ? 'Kad Digital Kesatuan Holografik' : 'Holographic Digital Union Card',
      desc: lang === 'zh' ? '内置加密智能芯片效果，方便在各大合作医院与门诊出示以享受优先排队和就医便利。' : lang === 'bm' ? 'Dapatkan keutamaan daftar masuk di klinik dan hospital utama dengan kad ID digital selamat termasuk cip pintar.' : 'Unlock check-in prioritization at major clinics and hospitals with a secure digital ID card including a verified smart chip.'
    },
    {
      icon: <FileText size={24} style={{ color: 'var(--health)' }} />,
      title: lang === 'zh' ? '合作医院 SOP 与楼层急救导引库' : lang === 'bm' ? 'Perpustakaan SOP & Peta Laluan Hospital' : 'Private Hospital SOP & Floor Guide Library',
      desc: lang === 'zh' ? '直接获取由公会管理员发布和更新的各大私立医院楼层图纸、就医绿道指引及处方拿药流程。' : lang === 'bm' ? 'Akses segera kepada peta, susun atur koordinat kecemasan, dan garis panduan pesakit luar yang diterbitkan terus oleh admin kesatuan.' : 'Get immediate access to maps, emergency coordinate layouts, and outpatient guidelines published directly by union admins.'
    },
    {
      icon: <Award size={24} style={{ color: 'var(--primary)' }} />,
      title: lang === 'zh' ? '持续、稳定的患者护理派单流' : lang === 'bm' ? 'Aliran Tugasan Penjagaan Berterusan' : 'Continuous Case Dispatch Streams',
      desc: lang === 'zh' ? '直接进入公会内部派单池，能够实时查看附近家庭发布的陪诊与月嫂需求，自由沟通接单。' : lang === 'bm' ? 'Akses terus tugasan pelanggan. Anda boleh melihat tawaran penjagaan tempatan dan menghubungi pelanggan secara langsung.' : 'Access client dispatches directly. You can view local caregiver posts and contact clients directly to confirm dispatches.'
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
            {t.membership.title}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {t.membership.subtitle}
          </p>
        </div>
      </section>

      <section style={{ padding: '0 2rem 5rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'start' }}>
          {/* Left: Benefits */}
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', color: '#ffffff' }}>
              {lang === 'zh' ? '为什么要加入 MCSA 马来西亚公会？' : lang === 'bm' ? 'Kenapa Sertai Kesatuan MCSA Malaysia?' : 'Why Join MultiCare Support Malaysia Union?'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {benefitsList.map((benefit, idx) => (
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
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div>
              <span className="badge badge-active" style={{ marginBottom: '1rem' }}>
                {lang === 'zh' ? '通过安全审查的执照' : lang === 'bm' ? 'LESEN DISAHKAN' : 'VETTED LICENSE'}
              </span>
              <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>{t.membership.feeTitle}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t.membership.feeDesc}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent)' }}>RM</span>
                <span style={{ fontSize: '3.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'Outfit' }}>350</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', alignSelf: 'flex-end', paddingBottom: '0.75rem' }}>/ {lang === 'zh' ? '年' : lang === 'bm' ? 'tahun' : 'year'}</span>
              </div>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1.5rem' }}>
                {lang === 'zh' ? '包含电子会员卡核验、医疗纠纷险权益、急救工作标准以及优先派遣推荐展示。' : lang === 'bm' ? 'Termasuk pengesahan kad digital, keutamaan perlindungan insurans, kemas kini SOP, dan kedudukan carian.' : 'Includes digital card validation, medical insurance coverage priority, first-aid SOP updates, and search listing placements.'}
              </p>
              <a href="/register" className="btn btn-primary" style={{ width: '100%', borderRadius: '10px' }}>
                {t.membership.registerNow}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
