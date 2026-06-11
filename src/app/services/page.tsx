'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';
import { Briefcase, Heart, Shield, Users, CheckSquare } from 'lucide-react';

export default function ServicesPage() {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    setLang(store.getLanguage() as Language);
  }, []);

  const t = translations[lang] || translations.en;

  const serviceDetails = [
    {
      title: lang === 'zh' ? '🍼 产后月嫂母婴照护' : lang === 'bm' ? '🍼 Penjaga Berpantang (Materniti)' : '🍼 Confinement Care',
      desc: lang === 'zh' ? '为新生儿和新手妈妈提供专业的体征监测、哺乳与喂养指导、婴儿卫生和科学膳食规划。' : lang === 'bm' ? 'Sokongan neonatal pakar, panduan penyusuan, kebersihan bayi, dan perancangan diet pemulihan untuk ibu baru.' : 'Expert neonatal support, lactation guidance, infant hygiene, and recovery diet planning for new mothers.',
      skills: lang === 'zh' ? ['婴儿体征监测', '母乳喂养指导', '产后膳食规划', '科学睡眠训练'] : lang === 'bm' ? ['Pemantauan Vital Bayi', 'Konsultasi Penyusuan', 'Pelan Makanan Berpantang', 'Penjadualan Tidur'] : ['Newborn Vitals Monitoring', 'Lactation Consultation', 'Postpartum Meal Plans', 'Sleep Scheduling']
    },
    {
      title: lang === 'zh' ? '🏥 门诊就医陪诊服务' : lang === 'bm' ? '🏥 Pengiring Perubatan Pesakit Luar' : '🏥 Outpatient Patient Companion',
      desc: lang === 'zh' ? '提供全面的门诊引导、就医科室指引、处方药品代取以及详实的就医日志记录与家属沟通。' : lang === 'bm' ? 'Bantuan navigasi pesakit luar yang komprehensif, bantuan laluan klinikal, penyelarasan pengambilan ubat, dan log komunikasi keluarga.' : 'Comprehensive outpatient navigation, clinical routing assistance, drug pickup coordination, and family communication logging.',
      skills: lang === 'zh' ? ['医院 SOP 熟悉', '双语陪诊服务', '处方代取服务', '医生问诊记录'] : lang === 'bm' ? ['Pemeriksaan SOP Hospital', 'Pengiring Pesakit Dwibahasa', 'Pengambilan Preskripsi', 'Log Pengesyoran Doktor'] : ['Hospital SOP Checkpoints', 'Bilingual Patient Escort', 'Prescription Retrievals', 'Doctor Recommendation Logs']
    },
    {
      title: lang === 'zh' ? '👴 长者日常护理与陪护' : lang === 'bm' ? '👴 Penjaga Warga Emas' : '👴 Elderly Caregiver',
      desc: lang === 'zh' ? '生命体征日常跟踪、认知障碍训练、长者健康膳食记录、防跌倒和行走辅助以及用药提醒。' : lang === 'bm' ? 'Pemantauan tanda vital, rangsangan kognitif harian, pemantauan diet warga emas, bantuan mobiliti, dan peringatan ubat.' : 'Vital signs tracking, daily cognitive stimulation, senior diet tracking, mobility checkups, and medication reminders.',
      skills: lang === 'zh' ? ['生命体征记录', '血糖体征跟踪', '跌倒安全防范', '健康档案同步'] : lang === 'bm' ? ['Log Tekanan Darah', 'Pemantauan Glukosa', 'Pencegahan Jatuh & Mobiliti', 'Sinkronisasi Vital Harian'] : ['Systolic/Diastolic BP Logs', 'Glucose Tracking', 'Mobility & Fall Prevention', 'Daily Vitals Sync']
    },
    {
      title: lang === 'zh' ? '💪 肢体康复辅助照护' : lang === 'bm' ? '💪 Pembantu Pemulihan & Rehab' : '💪 Rehabilitation Care Assistant',
      desc: lang === 'zh' ? '陪伴术后或中风偏瘫患者进行肢体运动康复、日常复健计划执行，提供动作练习与保护。' : lang === 'bm' ? 'Menemani pesakit strok selepas pembedahan melalui terapi mobiliti, jadual pemulihan fizikal, dan latihan kemahiran motor.' : 'Accompanying post-op stroke patients through mobility therapy, physical rehab schedules, and motor skills practice.',
      skills: lang === 'zh' ? ['关节功能活动', '偏瘫恢复训练', '专业物理复健', '肢体协调辅助'] : lang === 'bm' ? ['Latihan Fungsi Motor', 'Pemulihan Strok', 'Pendamping Fisioterapi', 'Bantuan Koordinasi'] : ['Motor Function Exercises', 'Stroke Recovery Milestones', 'Physiotherapy Companionship', 'Coordination Assist']
    },
    {
      title: lang === 'zh' ? '👶 专业保姆与幼儿照护' : lang === 'bm' ? '👶 Pengasuh Warga Kanak-kanak (Babysitter)' : '👶 Babysitter Care Service',
      desc: lang === 'zh' ? '提供专业的婴幼儿日常起居照顾、安全活动陪护、益智游戏互动、健康饮食喂养与良好成长习惯培养。' : lang === 'bm' ? 'Penyediaan penjagaan bayi dan kanak-kanak profesional, pengawasan keselamatan aktiviti harian, interaksi permainan pendidikan, dan penyediaan makanan seimbang.' : 'Professional infant and toddler daily care, active safety supervision, educational play interaction, healthy feeding, and growth routine building.',
      skills: lang === 'zh' ? ['婴幼儿安全看护', '益智游戏互动', '日常喂养护理', '良好习惯养成'] : lang === 'bm' ? ['Penyeliaan Keselamatan', 'Permainan Pendidikan', 'Penyediaan Susu & Makanan', 'Pembangunan Rutin'] : ['Infant Safety Supervision', 'Educational Play & Games', 'Feeding & Sterilization', 'Habit & Routine Building']
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <Navbar />

      <section style={{
        padding: '5rem 2rem',
        background: 'radial-gradient(circle at top, rgba(10,186,181,0.12) 0%, transparent 60%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'Outfit', color: '#0f172a' }}>
            {t.services.title}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {t.services.subtitle}
          </p>
        </div>
      </section>

      <section style={{ padding: '0 2rem 5rem 2rem' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2.5rem'
        }}>
          {serviceDetails.map((service, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0, padding: '2rem', borderLeft: '4px solid var(--primary)', boxShadow: '0 8px 30px rgba(10, 186, 181, 0.04)' }}>
              <div>
                <h3 style={{ fontSize: '1.45rem', color: '#088c87', marginBottom: '0.75rem', fontFamily: 'Outfit', fontWeight: 800 }}>
                  {service.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  {service.desc}
                </p>
              </div>
              <div style={{
                background: 'var(--primary-light)',
                border: '1px solid rgba(10, 186, 181, 0.15)',
                padding: '1.25rem',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.75rem' }}>
                  {lang === 'zh' ? '公会核心执业胜任标准' : lang === 'bm' ? 'Kecekapan Standard Teras' : 'Core Standard Competencies'}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {service.skills.map((skill, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#1e293b' }}>
                      <CheckSquare size={15} style={{ color: 'var(--health)', flexShrink: 0 }} />
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
