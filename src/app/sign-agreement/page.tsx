'use client';

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { Shield, PlusCircle, CheckCircle, Heart, Phone, MapPin, Activity, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SignAgreementPage() {
  const [caregiverId, setCaregiverId] = useState('');
  const [caregiverName, setCaregiverName] = useState('MCSA Certified Companion');
  const [isSigned, setIsSigned] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [nric, setNric] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [facility, setFacility] = useState('');
  const [doctor, setDoctor] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [assistanceRequired, setAssistanceRequired] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [pastHistory, setPastHistory] = useState<string[]>([]);
  const [drugAllergy, setDrugAllergy] = useState('No Known Drug Allergy');
  const [foodAllergy, setFoodAllergy] = useState('No');
  const [otherAllergy, setOtherAllergy] = useState('No');
  const [takingMeds, setTakingMeds] = useState(false);
  const [medsList, setMedsList] = useState('');
  const [surgicalHistory, setSurgicalHistory] = useState('');
  const [mobility, setMobility] = useState('Walk Independently');
  const [hearingDifficulty, setHearingDifficulty] = useState(false);
  const [speechDifficulty, setSpeechDifficulty] = useState(false);
  const [visualImpairment, setVisualImpairment] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [clientSigned, setClientSigned] = useState('');
  const [signedDate, setSignedDate] = useState('');

  useEffect(() => {
    // Client-side parse search params
    const searchParams = new URLSearchParams(window.location.search);
    const cgId = searchParams.get('caregiver');
    if (cgId) {
      setCaregiverId(cgId);
      const members = store.getUnionMembers();
      const found = members.find((m: any) => m.id === cgId || m.member_number === cgId || m.name.toLowerCase().includes(cgId.toLowerCase()));
      if (found) {
        setCaregiverName(found.name);
      } else {
        setCaregiverName(cgId);
      }
    }
    setSignedDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleCheckboxChange = (cond: string, checked: boolean) => {
    if (checked) {
      setPastHistory([...pastHistory, cond]);
    } else {
      setPastHistory(pastHistory.filter(h => h !== cond));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !nric.trim() || !clientSigned.trim()) {
      alert('Please fill out all required fields (Full Name, NRIC/Passport, and Signature).');
      return;
    }

    const newForm = {
      id: 'FORM-' + Math.floor(102 + Math.random() * 900),
      fullName,
      gender,
      dob,
      nric,
      phone,
      address,
      emergencyName,
      emergencyPhone,
      relationship,
      appointmentDate,
      appointmentTime,
      facility,
      doctor,
      specialty,
      assistanceRequired,
      complaint,
      pastHistory,
      drugAllergy,
      foodAllergy,
      otherAllergy,
      takingMeds,
      medsList,
      surgicalHistory,
      mobility,
      hearingDifficulty,
      speechDifficulty,
      visualImpairment,
      additionalInfo,
      clientSigned,
      signedDate,
      caregiverId: caregiverId || 'Unassigned'
    };

    const currentForms = store.getEscortForms();
    store.setEscortForms([newForm, ...currentForms]);

    setIsSigned(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc' }}>
      <Navbar />

      <section style={{
        padding: '4rem 2rem',
        background: 'radial-gradient(circle at center, rgba(37,99,235,0.12) 0%, transparent 60%)'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          {isSigned ? (
            <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '4rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--health-glow)', color: 'var(--health)', display: 'flex', alignItems: 'center', justifyCenter: 'center', border: '2px solid var(--health)' }}>
                <CheckCircle size={48} style={{ margin: 'auto' }} />
              </div>
              <h2 style={{ fontSize: '2rem', color: '#ffffff', margin: 0 }}>Agreement Signed Successfully / 协议签署成功</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '600px', margin: 0 }}>
                Thank you for completing the medical escort information form and authorization agreement. All records have been securely registered and synced to your escort's dashboard **({caregiverName})**.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', width: '100%', maxWidth: '400px', textAlign: 'left', fontSize: '0.9rem' }}>
                <div><strong>Client Name:</strong> <span style={{ color: 'white' }}>{fullName}</span></div>
                <div style={{ marginTop: '0.4rem' }}><strong>Vetted Companion:</strong> <span style={{ color: 'white' }}>{caregiverName}</span></div>
                <div style={{ marginTop: '0.4rem' }}><strong>Signing Date:</strong> <span style={{ color: 'white' }}>{signedDate}</span></div>
              </div>
              <a href="/" className="btn btn-outline" style={{ marginTop: '1rem', padding: '0.8rem 2rem', borderRadius: '8px' }}>
                Exit Portal / 返回首页
              </a>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span className="badge badge-active" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
                  🤝 Official MCSA Escort Authorization Portal
                </span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit' }}>
                  陪诊服务建档与责任协议书
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
                  Assigned Companion: <strong style={{ color: 'var(--accent)' }}>{caregiverName}</strong> &bull; Secure Encrypted Submission
                </p>
              </div>

              <div className="card" style={{ padding: '3rem' }}>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Dear Valued Client,<br />
                  To ensure our medical escort (陪诊师) can provide you with safe, personalized, and effective support during your medical visit, we kindly ask you to fill out the following personal and health-related information. Please rest assured that all data will be kept strictly confidential and used only for service coordination and emergency purposes.
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Section 1 Form */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>1. Personal Information / 个人基本信息</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name / 客户姓名 *</label>
                        <input type="text" required className="form-input" placeholder="e.g. Grandpa Zhang" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender / 性别</label>
                        <select className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }} value={gender} onChange={(e) => setGender(e.target.value)}>
                          <option value="Male">Male / 男</option>
                          <option value="Female">Female / 女</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date of Birth / 出生日期</label>
                        <input type="date" className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff' }} value={dob} onChange={(e) => setDob(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">NRIC or Passport / 证件号 *</label>
                        <input type="text" required className="form-input" placeholder="e.g. 480312-14-5567" value={nric} onChange={(e) => setNric(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Contact Phone / 联系电话</label>
                        <input type="text" className="form-input" placeholder="e.g. 012-3344556" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Home Address / 住宅地址</label>
                        <input type="text" className="form-input" placeholder="e.g. 22, Jalan Bukit Bintang, KL" value={address} onChange={(e) => setAddress(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Emergency Contact Name / 紧急联系人</label>
                        <input type="text" className="form-input" placeholder="e.g. Zhang Wei" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Emergency Contact Phone / 紧急电话</label>
                        <input type="text" className="form-input" placeholder="e.g. 019-8765432" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Relationship / 与客户关系</label>
                        <input type="text" className="form-input" placeholder="e.g. Son" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Section 2 Form */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>2. Escort Service Details / 就诊陪护详情</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Appointment Date / 就诊日期</label>
                        <input type="date" className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff' }} value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Appointment Time / 就诊时间</label>
                        <input type="time" className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff' }} value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Medical Facility / 医院或诊所</label>
                        <input type="text" className="form-input" placeholder="e.g. Hospital Kuala Lumpur" value={facility} onChange={(e) => setFacility(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Doctor Name / 医生姓名</label>
                        <input type="text" className="form-input" placeholder="e.g. Dr. Tan" value={doctor} onChange={(e) => setDoctor(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Department or Specialty / 科室名称</label>
                        <input type="text" className="form-input" placeholder="e.g. Cardiology Dept" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <label className="form-label">Need administrative help? / 是否需协助缴费/取药/办手续</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.4rem' }}>
                          <input type="checkbox" style={{ width: '18px', height: '18px' }} checked={assistanceRequired} onChange={(e) => setAssistanceRequired(e.target.checked)} />
                          <span>Yes, assistance required / 需要协助</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 Form */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>3. Health & Medical History / 健康主诉与病史</h4>
                    <div className="form-group">
                      <label className="form-label">Main Complaint or Reason for Consultation / 就诊主诉与原因</label>
                      <textarea className="form-input" placeholder="Describe current symptoms or consultation purpose..." rows={3} style={{ resize: 'vertical' }} value={complaint} onChange={(e) => setComplaint(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Past Medical History / 既往病史 (Select all that apply)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginTop: '0.5rem' }}>
                        {['Hypertension', 'Diabetes', 'Heart Disease', 'Stroke', 'Cancer', 'Kidney Disease', 'Asthma', 'Mental Health Condition', 'Dementia / Alzheimer\'s Disease', 'Parkinson\'s Disease'].map((cond) => (
                          <label key={cond} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem', cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={pastHistory.includes(cond)}
                              onChange={(e) => handleCheckboxChange(cond, e.target.checked)}
                            />
                            <span>{cond}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 4 Form */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>4. Allergy Information / 过敏信息</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Drug Allergies / 药物过敏史</label>
                        <input type="text" className="form-input" placeholder="e.g. No Known Drug Allergy or penicillin (hives)" value={drugAllergy} onChange={(e) => setDrugAllergy(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Food Allergies / 食物过敏史</label>
                        <input type="text" className="form-input" placeholder="e.g. No or Peanuts (anaphylaxis)" value={foodAllergy} onChange={(e) => setFoodAllergy(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Other Allergies / 其它过敏（如乳胶等）</label>
                        <input type="text" className="form-input" placeholder="e.g. No or Latex (skin rash)" value={otherAllergy} onChange={(e) => setOtherAllergy(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Section 5 & 6 Form */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>5. Current Medication & Surgeries / 用药与手术史</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                          <input type="checkbox" checked={takingMeds} onChange={(e) => setTakingMeds(e.target.checked)} />
                          <strong className="form-label" style={{ margin: 0 }}>Currently taking medication or supplements / 正在服用药物或保健品</strong>
                        </label>
                        {takingMeds && (
                          <textarea className="form-input" placeholder="List medications with dosage & frequency (e.g. Metformin 500mg - 1x daily)" rows={3} style={{ resize: 'vertical' }} value={medsList} onChange={(e) => setMedsList(e.target.value)} />
                        )}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Surgical History / 手术或医疗史</label>
                        <input type="text" className="form-input" placeholder="e.g. Knee Replacement (2020), Heart Bypass (2022) or No" value={surgicalHistory} onChange={(e) => setSurgicalHistory(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Section 7 Form */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>6. Functional & Mobility Assessment / 行动与日常功能评估</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Mobility Difficulties / 行动困难评估</label>
                        <select className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }} value={mobility} onChange={(e) => setMobility(e.target.value)}>
                          <option value="Walk Independently">Walk Independently / 独立行走</option>
                          <option value="Require Walking Stick">Require Walking Stick / 需拐杖</option>
                          <option value="Require Walker">Require Walker / 需助行架</option>
                          <option value="Wheelchair User">Wheelchair User / 轮椅使用者</option>
                          <option value="Require Assistance Walking">Require Assistance Walking / 需助行</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyCenter: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.4rem' }}>
                          <input type="checkbox" checked={hearingDifficulty} onChange={(e) => setHearingDifficulty(e.target.checked)} />
                          <span>Hearing difficulties / 听力障碍</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={speechDifficulty} onChange={(e) => setSpeechDifficulty(e.target.checked)} />
                          <span>Speech difficulties / 语言沟通障碍</span>
                        </label>
                      </div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Visual Impairment / 视力障碍描述 (if any)</label>
                        <input type="text" className="form-input" placeholder="e.g. Cataract in right eye, or No" value={visualImpairment} onChange={(e) => setVisualImpairment(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Section 8 Form */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>7. Additional Information / 其他特别备注</h4>
                    <div className="form-group">
                      <textarea className="form-input" placeholder="Any specific requirements or instructions..." rows={2} style={{ resize: 'vertical' }} value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} />
                    </div>
                  </div>

                  {/* Legal Terms Block */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem', fontSize: '0.85rem' }}>
                    <h4 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '1rem', fontFamily: 'Outfit' }}>🤝 Medical Escort Service Authorization & Liability Agreement / 陪诊服务协议与责任告知书</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '160px', overflowY: 'auto', paddingRight: '0.5rem', border: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem', borderRadius: '8px', background: '#0b1329', lineHeight: '1.4' }}>
                      <p><strong>第一条 服务内容 / Article 1 Service Scope</strong><br />乙方仅提供非医疗类流程协助，包括陪同挂号、就诊引导、代取药、代缴费、路线指引等，不属于急救及临床医护监护范畴。</p>
                      <p><strong>第二条 医疗行为禁止声明 / Article 2 Prohibition of Medical Practice</strong><br />乙方及陪诊员非注册医生或护士，不提供任何临床诊疗意见及诊断决策。</p>
                      <p><strong>第三条 医疗文件代签授权与限制 / Article 3 Authorization & Restriction for Signing</strong><br />甲方书面同意乙方代签纯行政/非医疗登记，但绝对严禁代替甲方签署任何手术、麻醉及高危医疗处置知情同意书。</p>
                      <p><strong>第四条 紧急情况处理 / Article 4 Emergency Procedure</strong><br />若就诊期间突发急症、晕倒，乙方仅负责联系医院医护施救，同时立即联系紧急联系人，不承担任何医疗决策连带责任。</p>
                      <p><strong>第五条 个人数据保护 (PDPA 2010) / Article 6 Personal Data Protection</strong><br />遵守《2010年个人数据保护法》(PDPA 2010)，收集的客户及患者隐私病史健康资料，仅用于本次陪诊服务安全保障目的。</p>
                    </div>
                  </div>

                  {/* Signature */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.82rem', margin: '0 0 1rem 0', color: 'var(--text-muted)' }}>
                      * Agreement Terms Declaration: I hereby authorize MCSA companion to assist during hospital outpatient activities. I confirm that all medical history is accurate.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Client Digital Signature (Type Name) *</label>
                        <input type="text" required className="form-input" placeholder="Type your full name to sign" value={clientSigned} onChange={(e) => setClientSigned(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Signed Date</label>
                        <input type="date" className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff' }} value={signedDate} onChange={(e) => setSignedDate(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', background: 'var(--primary)', boxShadow: '0 2px 8px var(--primary-glow)' }}>
                    ✍️ Submit & Sign Agreement / 确认并签署协议
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
