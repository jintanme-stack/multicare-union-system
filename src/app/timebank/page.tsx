'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Award, Clock, DollarSign, BookOpen, Gift, Clipboard, FileText, CheckCircle2, ChevronRight, Upload, LogOut, ArrowRight, User } from 'lucide-react';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  nric: string;
  status: string;
  categories: string[];
  credits: number;
  rank: string;
  badges: string[];
  joinedDate: string;
}

export default function TimeBankDashboard() {
  const [lang, setLang] = useState<Language>('en');
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'log' | 'ledger' | 'shop'>('tasks');
  const [careRequests, setCareRequests] = useState<any[]>([]);
  const [serviceRecords, setServiceRecords] = useState<any[]>([]);
  const [redemptionRecords, setRedemptionRecords] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states for log service
  const [selectedTask, setSelectedTask] = useState<string>('custom');
  const [customActivity, setCustomActivity] = useState('');
  const [hours, setHours] = useState<number>(2);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [desc, setDesc] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Redemed reward modal
  const [showRedeemSuccess, setShowRedeemSuccess] = useState(false);
  const [redeemedReward, setRedeemedReward] = useState<any>(null);
  const [redemptionCode, setRedemptionCode] = useState('');

  useEffect(() => {
    // 1. Session Guard
    if (typeof window !== 'undefined') {
      const savedLang = store.getLanguage() as Language;
      setLang(savedLang);

      const loggedVolunteerStr = localStorage.getItem('mcsa_logged_volunteer');
      if (!loggedVolunteerStr) {
        window.location.href = '/login?tab=volunteer';
        return;
      }

      try {
        const loggedVol = JSON.parse(loggedVolunteerStr);
        // Sync with the central database to get latest credits
        const allVols = store.getVolunteers();
        const currentVol = allVols.find((v: any) => v.email.toLowerCase().trim() === loggedVol.email.toLowerCase().trim());
        if (currentVol) {
          setVolunteer(currentVol);
          // Update localStorage
          localStorage.setItem('mcsa_logged_volunteer', JSON.stringify(currentVol));
        } else {
          setVolunteer(loggedVol);
        }
      } catch (e) {
        window.location.href = '/login?tab=volunteer';
        return;
      }

      // 2. Fetch data from store
      setCareRequests(store.getCareRequests());
      setServiceRecords(store.getServiceRecords());
      setRedemptionRecords(store.getRedemptionRecords());
      setRewards(store.getRewards());
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mcsa_logged_volunteer');
    window.location.href = '/login';
  };

  const handleClaimTask = (reqId: string, reqType: string, reqName: string) => {
    if (!volunteer) return;

    const alertMsg = lang === 'zh'
      ? `🎉 确认接单服务：\n您已申请接单 [${reqName}] 的 ${reqType} 服务。系统已将该任务绑定 to 您的义工名录，请尽快联系患者家属或公会核验台对接服务！`
      : `🎉 Task Claimed Successfully!\nYou have claimed the ${reqType} request for ${reqName}. MCSA has assigned this request to you. Please coordinate with the family/registry desk.`;
    alert(alertMsg);

    // Create a service record as 'Pending Service'
    const newRecord = {
      id: `CLAIM-${Date.now()}`,
      volunteerEmail: volunteer.email,
      volunteerName: volunteer.name,
      activity: `${reqType} for ${reqName} (Task Claimed)`,
      hours: reqType.includes('Escort') || reqType.includes('陪诊') ? 3 : 4, // default estimate
      date: new Date().toISOString().split('T')[0],
      desc: `Claimed and assigned to help ${reqName} with their requested care.`,
      status: 'Claimed',
      approvedBy: ''
    };

    const updatedRecords = [newRecord, ...serviceRecords];
    store.setServiceRecords(updatedRecords);
    setServiceRecords(updatedRecords);
    
    // Switch to Log tab to allow logging hours
    setActiveTab('log');
    setSelectedTask(newRecord.id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPhoto(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteer) return;

    let activityTitle = customActivity || 'General Volunteer Service';
    if (selectedTask !== 'custom') {
      const matchingClaim = serviceRecords.find(r => r.id === selectedTask);
      if (matchingClaim) {
        activityTitle = matchingClaim.activity.replace(' (Task Claimed)', '');
      }
    }

    const newLog = {
      id: `CLAIM-${Date.now()}`,
      volunteerEmail: volunteer.email,
      volunteerName: volunteer.name,
      activity: activityTitle,
      hours: Number(hours),
      date: date,
      desc: desc,
      photo: photo,
      status: 'Pending',
      approvedBy: ''
    };

    // Store service records
    const updatedRecords = [newLog, ...serviceRecords];
    store.setServiceRecords(updatedRecords);
    setServiceRecords(updatedRecords);

    // Show success state
    setSubmitSuccess(true);
    setCustomActivity('');
    setDesc('');
    setPhoto('');
    setSelectedTask('custom');

    // Reset success banner after 5s
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  const handleRedeem = (reward: any) => {
    if (!volunteer) return;

    if (volunteer.credits < reward.cost) {
      const alertMsg = lang === 'zh'
        ? `❌ 积分余额不足！兑换 [${reward.title}] 需要 ${reward.cost} 积分，您当前只有 ${volunteer.credits} 积分。请继续参与志愿关怀活动累积积分！`
        : `❌ Insufficient Credits! Redeeming [${reward.title}] requires ${reward.cost} credits, and you have only ${volunteer.credits} credits. Keep helping out to earn more!`;
      alert(alertMsg);
      return;
    }

    // Deduct credits from volunteer
    const allVols = store.getVolunteers();
    const updatedVols = allVols.map((v: any) => {
      if (v.email.toLowerCase().trim() === volunteer.email.toLowerCase().trim()) {
        return {
          ...v,
          credits: v.credits - reward.cost
        };
      }
      return v;
    });

    store.setVolunteers(updatedVols);
    const updatedVol = updatedVols.find((v: any) => v.email.toLowerCase().trim() === volunteer.email.toLowerCase().trim());
    if (updatedVol) {
      setVolunteer(updatedVol);
      localStorage.setItem('mcsa_logged_volunteer', JSON.stringify(updatedVol));
    }

    // Generate random coupon code
    const couponCode = `MCSA-TB-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create redemption record
    const newRedemption = {
      id: `RED-${Date.now()}`,
      volunteerEmail: volunteer.email,
      volunteerName: volunteer.name,
      rewardId: reward.id,
      rewardTitle: reward.title,
      cost: reward.cost,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      code: couponCode
    };

    const updatedRedemptions = [newRedemption, ...redemptionRecords];
    store.setRedemptionRecords(updatedRedemptions);
    setRedemptionRecords(updatedRedemptions);

    // Create audit log
    const newAudit = {
      id: `AUDIT-${Date.now()}`,
      volunteerEmail: volunteer.email,
      type: 'Redeem',
      amount: reward.cost,
      desc: `Redeemed: ${reward.title} (Code: ${couponCode})`,
      date: new Date().toISOString()
    };
    const allAudits = store.getAuditLogs();
    store.setAuditLogs([newAudit, ...allAudits]);

    // Show modal
    setRedeemedReward(reward);
    setRedemptionCode(couponCode);
    setShowRedeemSuccess(true);
  };

  if (isLoading || !volunteer) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text)' }}>
        <div style={{ textAlign: 'center' }}>
          <Clock size={48} className="animate-spin" style={{ color: '#f59e0b', margin: '0 auto 1rem auto' }} />
          <p>{lang === 'zh' ? '正在加载义工对账账本...' : 'Loading Volunteer Time Ledger...'}</p>
        </div>
      </div>
    );
  }

  // Filter service records for this volunteer
  const myRecords = serviceRecords.filter(r => r.volunteerEmail.toLowerCase().trim() === volunteer.email.toLowerCase().trim());
  const myRedemptions = redemptionRecords.filter(r => r.volunteerEmail.toLowerCase().trim() === volunteer.email.toLowerCase().trim());
  const claimedTasks = myRecords.filter(r => r.status === 'Claimed');

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '2rem 1.5rem', color: 'var(--text)' }}>
      {/* 1. Header Hero section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 2.5rem auto',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderRadius: '24px',
        padding: '2.5rem',
        border: '1px solid rgba(245, 158, 11, 0.15)',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '2px solid #f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b',
            boxShadow: '0 8px 24px rgba(245,158,11,0.15)'
          }}>
            <User size={38} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.8rem', color: '#ffffff', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
                {volunteer.name}
              </h1>
              <span style={{
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f6ad55',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.25rem 0.75rem',
                borderRadius: '99px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Award size={13} /> {volunteer.rank}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              ✉️ {volunteer.email} | NRIC: {volunteer.nric}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {volunteer.badges.map(b => (
                <span key={b} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                  🏆 {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hour credit summary widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '2px dashed rgba(245, 158, 11, 0.4)',
            borderRadius: '20px',
            padding: '1.5rem 2rem',
            textAlign: 'center',
            minWidth: '220px',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
            position: 'relative'
          }} className="pulse-glow">
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {lang === 'zh' ? '当前累积时间积分' : 'Available Time Tokens'}
            </span>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', fontFamily: 'Outfit, sans-serif', display: 'block', margin: '0.2rem 0' }}>
              🪙 {volunteer.credits} <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>{lang === 'zh' ? '小时' : 'Hrs'}</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {lang === 'zh' ? '1 积分 = 1 小时志愿看护服务' : '1 Token = 1 Hour of companion care'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: '0.75rem',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              background: 'rgba(239, 68, 68, 0.05)',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            title={lang === 'zh' ? '安全退出' : 'Logout'}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* 2. Tabs Selector */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 2rem auto' }}>
        <div style={{
          display: 'flex',
          borderBottom: '2px solid var(--border)',
          gap: '2rem',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('tasks')}
            style={{
              padding: '1rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'tasks' ? '3px solid #f59e0b' : '3px solid transparent',
              color: activeTab === 'tasks' ? '#f59e0b' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            <Clipboard size={18} />
            {lang === 'zh' ? '寻找接单机会' : 'Available Requests'}
          </button>

          <button
            onClick={() => setActiveTab('log')}
            style={{
              padding: '1rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'log' ? '3px solid #f59e0b' : '3px solid transparent',
              color: activeTab === 'log' ? '#f59e0b' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            <Clock size={18} />
            {lang === 'zh' ? '打卡/申报工时' : 'Log Care Hours'}
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            style={{
              padding: '1rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'ledger' ? '3px solid #f59e0b' : '3px solid transparent',
              color: activeTab === 'ledger' ? '#f59e0b' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            <FileText size={18} />
            {lang === 'zh' ? '账单对账明细' : 'Time Ledger'}
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            style={{
              padding: '1rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'shop' ? '3px solid #f59e0b' : '3px solid transparent',
              color: activeTab === 'shop' ? '#f59e0b' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            <Gift size={18} />
            {lang === 'zh' ? '时间积分商城' : 'Redeem Shop'}
          </button>
        </div>
      </div>

      {/* 3. Main Tabs Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* TAB 1: AVAILABLE TASKS */}
        {activeTab === 'tasks' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                {lang === 'zh' ? '🌟 马来西亚关怀呼声 (Available Companion Jobs)' : '🌟 Care Callouts in Malaysia'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                {lang === 'zh' ? '以下是家属或医疗伴随的义工呼声。您可以承接服务。完成服务并上传签到记录即可兑换时间积分！' : 'Claim a patient escort or respite support request below. Complete the service to earn Time Tokens!'}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem'
            }}>
              {careRequests.filter(req => req.status !== 'Approved_Licensed').map((req) => {
                const reqType = req.serviceType || req.careType || 'Respite Care';
                return (
                  <div key={req.id} style={{
                    background: 'var(--card-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.25rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <span style={{
                          background: 'rgba(10, 186, 181, 0.1)',
                          color: '#0abab5',
                          border: '1px solid rgba(10, 186, 181, 0.2)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          📌 {req.location || 'Kuala Lumpur'}
                        </span>
                        <span style={{
                          color: '#f59e0b',
                          fontWeight: 800,
                          fontSize: '0.85rem'
                        }}>
                          🪙 +{reqType.includes('Escort') ? '3.0' : '4.0'} Hours
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text)' }}>
                        {reqType} - {req.patientName || req.name}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                        {req.message || req.details || 'Escort Companion support required for medical checkup clinic visits.'}
                      </p>

                      <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text-muted)' }}>
                        <span>📅 <b>Date requested:</b> {req.date || req.created_at?.split('T')[0] || '2026-06-15'}</span>
                        <span>🗣️ <b>Preferred Lang:</b> {req.language === 'zh' ? 'Mandarin / Chinese' : req.language === 'bm' ? 'Malay' : 'English'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaimTask(req.id, reqType, req.patientName || req.name)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'linear-gradient(to right, #f59e0b, #d97706)',
                        color: '#ffffff',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 10px rgba(245,158,11,0.2)'
                      }}
                    >
                      接单此志愿服务 / Claim Service <ArrowRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: LOG HOURS & SERVICE */}
        {activeTab === 'log' && (
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                {lang === 'zh' ? '✍️ 提交志愿服务打卡工时' : '✍️ Log Volunteer Service Hours'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                {lang === 'zh' ? '请填写您的关怀服务时间。管理员审核通过后，相应的积分将计入您的时间银行余额。' : 'Submit your completed care session details. Points will be credited upon audit approval.'}
              </p>
            </div>

            {submitSuccess && (
              <div style={{
                color: '#10b981',
                fontSize: '0.88rem',
                fontWeight: 600,
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                borderLeft: '4px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle2 size={18} />
                <span>
                  {lang === 'zh'
                    ? '🎉 工时申报提交成功！公会资质审核台（Registry Desk）将进行后台核对核发积分。'
                    : '🎉 Service log submitted successfully! MCSA Audit desk will verify and credit your points.'}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmitLog} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div className="form-group">
                <label className="form-label">{lang === 'zh' ? '关联接单任务' : 'Assigned/Claimed Task'}</label>
                <select
                  className="form-input"
                  style={{ width: '100%', outline: 'none' }}
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                >
                  <option value="custom">{lang === 'zh' ? '➕ 申报其他常规志愿活动 (Custom Service)' : '➕ Custom / General Volunteer Service'}</option>
                  {claimedTasks.map(t => (
                    <option key={t.id} value={t.id}>{t.activity} - Claimed {t.date}</option>
                  ))}
                </select>
              </div>

              {selectedTask === 'custom' && (
                <div className="form-group">
                  <label className="form-label">{lang === 'zh' ? '志愿活动名称' : 'Volunteer Activity Name'}</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. 陪同陈爷爷至HKL门诊拿药 (Elderly Escort)"
                    style={{ width: '100%' }}
                    value={customActivity}
                    onChange={(e) => setCustomActivity(e.target.value)}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{lang === 'zh' ? '服务实际时长 (小时)' : 'Hours Served'}</label>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    required
                    className="form-input"
                    style={{ width: '100%' }}
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'zh' ? '服务日期' : 'Service Date'}</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    style={{ width: '100%' }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{lang === 'zh' ? '服务过程与说明记录' : 'Activity Description'}</label>
                <textarea
                  required
                  rows={4}
                  className="form-input"
                  placeholder={lang === 'zh' ? '请简短说明服务情况，例如：陪诊取药、排队登记并指导家属服药剂量...' : 'Describe what help you provided, who you assisted, or any important notes...'}
                  style={{ width: '100%', resize: 'vertical' }}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{lang === 'zh' ? '服务照片现场佐证' : 'Proof of Service (Photo)'}</label>
                <div style={{
                  border: '2px dashed var(--border)',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, width: '100%', height: '100%',
                      opacity: 0, cursor: 'pointer'
                    }}
                  />
                  {photo ? (
                    <div>
                      <img src={photo} alt="Service Proof Preview" style={{ maxHeight: '140px', borderRadius: '8px', margin: '0 auto 0.75rem auto', display: 'block' }} />
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>✅ Photo Uploaded. Tap to change.</span>
                    </div>
                  ) : (
                    <div>
                      <Upload size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem auto' }} />
                      <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                        {lang === 'zh' ? '点击上传现场合照或取药单据照片' : 'Click to upload escort/respite verification photo'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Supports PNG, JPG (Max 500KB)</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#f59e0b',
                  borderColor: '#f59e0b',
                  justifyContent: 'center',
                  fontWeight: 700
                }}
              >
                {lang === 'zh' ? '🚀 确认提交工时审核' : '🚀 Submit Log for Auditing'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: LEDGER OF HOURS */}
        {activeTab === 'ledger' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                {lang === 'zh' ? '📄 时间银行积分对账明细' : '📄 Time Token Ledger Accounts'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                {lang === 'zh' ? '包含您所有的服务时长申报记录、驳回、批准与消费积分流水。' : 'History of all your service claims, approvals, and token redemptions.'}
              </p>
            </div>

            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>ID</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{lang === 'zh' ? '活动名称' : 'Activity'}</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{lang === 'zh' ? '申报日期' : 'Date'}</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{lang === 'zh' ? '工时数' : 'Hours'}</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{lang === 'zh' ? '状态' : 'Status'}</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{lang === 'zh' ? '审核人/备注' : 'Approved By / Notes'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRecords.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          {lang === 'zh' ? '🫙 暂无积分对账账单。请点击[寻找接单机会]开始您的第一单服务！' : '🫙 No logs recorded. Select "Available Requests" to get started!'}
                        </td>
                      </tr>
                    ) : (
                      myRecords.map((r, index) => (
                        <tr key={r.id} style={{ borderBottom: index < myRecords.length - 1 ? '1px solid var(--border)' : 'none' }}>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.82rem', fontFamily: 'monospace' }}>{r.id}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>{r.activity}</div>
                            {r.desc && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{r.desc}</div>}
                          </td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{r.date}</td>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: r.status === 'Approved' ? '#10b981' : '#f59e0b' }}>
                            +{r.hours} hrs
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <span style={{
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: r.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : r.status === 'Claimed' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: r.status === 'Approved' ? '#10b981' : r.status === 'Claimed' ? '#3b82f6' : '#f59e0b'
                            }}>
                              {r.status}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {r.approvedBy ? `👤 ${r.approvedBy}` : r.status === 'Claimed' ? 'Awaiting service completion' : 'Pending verification review'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Redemption table */}
            {myRedemptions.length > 0 && (
              <div style={{ marginTop: '2.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                    {lang === 'zh' ? '🎁 时间商城礼券兑换记录' : '🎁 Reward Vouchers Redemptions'}
                  </h3>
                </div>
                <div style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  overflow: 'hidden'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>Code</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{lang === 'zh' ? '礼品名称' : 'Reward'}</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{lang === 'zh' ? '兑换日期' : 'Redeemed Date'}</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{lang === 'zh' ? '扣减积分' : 'Cost'}</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{lang === 'zh' ? '状态' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myRedemptions.map((red) => (
                        <tr key={red.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.82rem', fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700 }}>{red.code || 'CODE-PENDING'}</td>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem' }}>{red.rewardTitle}</td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{red.date}</td>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: '#ef4444' }}>-{red.cost} hrs</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <span style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                              {red.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REDEEM REWARDS */}
        {activeTab === 'shop' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                {lang === 'zh' ? '🎁 时间积分兑换商城' : '🎁 Time Credits Redemption Store'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                {lang === 'zh' ? '把您辛苦积攒的工时兑换成MCSA内部高级课程、康养理疗服务或超市礼券券码。' : 'Exchange your hard-earned companion credits for advanced courses, health massage vouchers, or groceries.'}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem'
            }}>
              {rewards.map((rew) => {
                const canAfford = volunteer.credits >= rew.cost;
                return (
                  <div key={rew.id} style={{
                    background: 'var(--card-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                    opacity: canAfford ? 1 : 0.85
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <span style={{
                          background: rew.category === 'Course' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: rew.category === 'Course' ? '#3b82f6' : '#10b981',
                          border: rew.category === 'Course' ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          🏷️ {rew.category}
                        </span>
                        <span style={{
                          color: '#f59e0b',
                          fontWeight: 900,
                          fontSize: '1.1rem'
                        }}>
                          🪙 {rew.cost} {lang === 'zh' ? '积分' : 'Hrs'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text)' }}>
                        {rew.title}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                        {rew.desc}
                      </p>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        🤝 Partner: <b>{rew.partner}</b>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRedeem(rew)}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: canAfford ? 'linear-gradient(to right, #f59e0b, #d97706)' : 'var(--border)',
                        color: canAfford ? '#ffffff' : 'var(--text-muted)',
                        fontWeight: 700,
                        cursor: canAfford ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: canAfford ? '0 4px 10px rgba(245,158,11,0.15)' : 'none'
                      }}
                    >
                      {canAfford ? (lang === 'zh' ? '立即兑换奖励' : 'Redeem Now') : (lang === 'zh' ? '积分不足 (Need more tokens)' : 'Credits Insufficient')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* 4. SUCCESS REDEMPTION POPUP MODAL */}
      {showRedeemSuccess && redeemedReward && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '2px solid #f59e0b',
            borderRadius: '24px',
            padding: '2.5rem',
            maxWidth: '450px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            position: 'relative'
          }} className="animate-scale-in">
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid #10b981',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
              {lang === 'zh' ? '🎉 兑换成功！' : '🎉 Redeemed Successfully!'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {lang === 'zh'
                ? `您已成功兑换 [${redeemedReward.title}]。请出示以下券码给合作机构进行验证。`
                : `You have successfully redeemed [${redeemedReward.title}]. Please present the code below to the partner.`}
            </p>

            <div style={{
              background: 'var(--bg-input)',
              border: '1px dashed var(--border)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Redemption Coupon Code
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'monospace', color: '#f59e0b', display: 'block', marginTop: '0.25rem' }}>
                {redemptionCode}
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1.5rem' }}>
              💡 <b>How to verify:</b> Screenshot this page or write down the code. Our partner <b>{redeemedReward.partner}</b> will reconcile this with MCSA audit ledger.
            </div>

            <button
              onClick={() => {
                setShowRedeemSuccess(false);
                setRedeemedReward(null);
                setRedemptionCode('');
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(to right, #0abab5, #088c87)',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {lang === 'zh' ? '我知道了' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
