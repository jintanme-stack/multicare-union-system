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

  // Agreement Type
  const [agreementType, setAgreementType] = useState<'escort' | 'elderly' | 'confinement'>('escort');
  const [contractId, setContractId] = useState('');
  const [elderlyContract, setElderlyContract] = useState<any>(null);
  const [confinementContract, setConfinementContract] = useState<any>(null);
  const [clientAddress, setClientAddress] = useState('');
  const [clientEdd, setClientEdd] = useState('');

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const searchParams = new URLSearchParams(window.location.search);
    const typeParam = searchParams.get('type');
    const contractIdParam = searchParams.get('contractId');
    const cgId = searchParams.get('caregiver');

    if (typeParam === 'elderly' && contractIdParam) {
      setAgreementType('elderly');
      setContractId(contractIdParam);
      const allContracts = store.getElderlyContracts();
      const found = allContracts.find((c: any) => c.id === contractIdParam);
      if (found) {
        setElderlyContract(found);
        setCaregiverName(found.caregiverName);
        setCaregiverId(found.caregiverId);
      }
    } else if (typeParam === 'confinement' && contractIdParam) {
      setAgreementType('confinement');
      setContractId(contractIdParam);
      const allContracts = store.getConfinementContracts();
      const found = allContracts.find((c: any) => c.id === contractIdParam);
      if (found) {
        setConfinementContract(found);
        setCaregiverName(found.caregiverName);
        setCaregiverId(found.caregiverId);
      }
    } else if (cgId) {
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

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
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

    if (agreementType === 'confinement') {
      if (!fullName.trim() || !nric.trim() || !clientSigned.trim() || !phone.trim() || !clientAddress.trim() || !clientEdd.trim()) {
        alert('Please fill out all required fields / 请填写所有必填字段 (Name, NRIC, Phone, Address, EDD, Signature).');
        return;
      }
      const allContracts = store.getConfinementContracts();
      const updated = allContracts.map((c: any) => {
        if (c.id === contractId) {
          return {
            ...c,
            status: 'Signed',
            clientName: fullName,
            clientNric: nric,
            clientPhone: phone,
            clientAddress: clientAddress,
            clientEdd: clientEdd,
            clientSignature: clientSigned,
            signedDate: signedDate || new Date().toISOString().split('T')[0]
          };
        }
        return c;
      });
      store.setConfinementContracts(updated);
      setIsSigned(true);
      return;
    }

    if (!fullName.trim() || !nric.trim() || !clientSigned.trim()) {
      alert('Please fill out all required fields (Full Name, NRIC/Passport, and Signature).');
      return;
    }

    if (agreementType === 'elderly') {
      const allContracts = store.getElderlyContracts();
      const updated = allContracts.map((c: any) => {
        if (c.id === contractId) {
          return {
            ...c,
            status: 'Signed',
            clientName: fullName,
            clientNric: nric,
            clientPhone: phone,
            clientAddress: address,
            clientSignature: clientSigned,
            signedDate: signedDate
          };
        }
        return c;
      });
      store.setElderlyContracts(updated);
      setIsSigned(true);
      return;
    }

    // Default: escort
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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Navbar />

       <section className="agreement-section">
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          {isSigned ? (
            <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '4rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--health-glow)', color: 'var(--health)', display: 'flex', alignItems: 'center', justifyCenter: 'center', border: '2px solid var(--health)' }}>
                <CheckCircle size={48} style={{ margin: 'auto' }} />
              </div>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Agreement Signed Successfully / 协议签署成功</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '600px', margin: 0 }}>
                {agreementType === 'confinement' 
                  ? `Thank you for completing the postnatal care service agreement. All details have been securely synced to your maternity caregiver's dashboard (${caregiverName}).`
                  : agreementType === 'elderly'
                  ? `Thank you for completing the elderly care service agreement. All details have been securely synced to your elder caregiver's dashboard (${caregiverName}).`
                  : `Thank you for completing the medical escort information form and authorization agreement. All records have been securely registered and synced to your escort's dashboard (${caregiverName}).`
                }
              </p>
              <div style={{ background: 'var(--bg-input)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border)', width: '100%', maxWidth: '400px', textAlign: 'left', fontSize: '0.9rem' }}>
                <div><strong>Client Name:</strong> <span style={{ color: 'var(--text-main)' }}>{fullName}</span></div>
                <div style={{ marginTop: '0.4rem' }}>
                  <strong>{agreementType === 'confinement' || agreementType === 'elderly' ? 'Caregiver Name:' : 'Vetted Companion:'}</strong> <span style={{ color: 'var(--text-main)' }}>{caregiverName}</span>
                </div>
                {contractId && <div style={{ marginTop: '0.4rem' }}><strong>Contract ID:</strong> <span style={{ color: 'var(--text-main)' }}>{contractId}</span></div>}
                <div style={{ marginTop: '0.4rem' }}><strong>Signing Date:</strong> <span style={{ color: 'var(--text-main)' }}>{signedDate}</span></div>
              </div>
              <a href="/" className="btn btn-outline" style={{ marginTop: '1rem', padding: '0.8rem 2rem', borderRadius: '8px' }}>
                Exit Portal / 返回首页
              </a>
            </div>
          ) : agreementType === 'elderly' ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span className="badge badge-active" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
                  🤝 Official MCSA Elderly Care Agreement Portal
                </span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>
                  老人照护服务协议
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
                  Caregiver Name: <strong style={{ color: 'var(--accent)' }}>{caregiverName}</strong> &bull; Secure Encrypted Submission
                </p>
              </div>

              <div className="card agreement-card">
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Dear Valued Client,<br />
                  Please review the service details, pricing, and bank account for payment. Fill in your personal details, review the terms and conditions, and complete your digital signature to sign the agreement.
                </p>

                {elderlyContract && (
                  <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
                    <h4 style={{ color: 'var(--text-main)', margin: '0 0 1rem 0', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
                      📋 Service Details & Bank Info / 服务明细与收款账户
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div><strong>Service Date Range / 服务期限:</strong> <span style={{ color: 'var(--text-main)' }}>{elderlyContract.serviceDate}</span></div>
                      <div><strong>Service Hours / 工作时间:</strong> <span style={{ color: 'var(--text-main)' }}>{elderlyContract.serviceHours}</span></div>
                      <div><strong>Total Service Fee / 服务费:</strong> <span style={{ color: 'var(--text-main)' }}>RM {elderlyContract.serviceFee}</span></div>
                      <div><strong>Deposit / 订金:</strong> <span style={{ color: 'var(--text-main)' }}>RM {elderlyContract.deposit}</span></div>
                      <div><strong>Balance / 尾款:</strong> <span style={{ color: 'var(--text-main)' }}>RM {elderlyContract.balance}</span></div>
                    </div>
                    <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                      <div><strong>Bank Name / 银行名称:</strong> <span style={{ color: 'var(--text-main)' }}>{elderlyContract.bankName}</span></div>
                      <div><strong>Account Name / 收款人姓名:</strong> <span style={{ color: 'var(--text-main)' }}>{elderlyContract.accountName}</span></div>
                      <div><strong>Account Number / 收款账号:</strong> <span style={{ color: 'var(--text-main)' }}>{elderlyContract.accountNumber}</span></div>
                      <div><strong>DuitNow:</strong> <span style={{ color: 'var(--text-main)' }}>{elderlyContract.duitNow || 'N/A'}</span></div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Part 1: Client Personal Details */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>
                      甲方客户/家属信息 Client Info
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group" style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                        <label className="form-label">Client / Family Representative Name / 甲方姓名 *</label>
                        <input type="text" required className="form-input" placeholder="e.g. Wong Kah Fai" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">NRIC or Passport / 身份证号 *</label>
                        <input type="text" required className="form-input" placeholder="e.g. 791104-14-5115" value={nric} onChange={(e) => setNric(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Contact Phone / 联系电话 *</label>
                        <input type="text" required className="form-input" placeholder="e.g. 017-6655443" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                        <label className="form-label">Address / 地址 *</label>
                        <input type="text" required className="form-input" placeholder="e.g. 45, Jalan Bukit Bintang, KL" value={address} onChange={(e) => setAddress(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Clauses */}
                  <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem', fontSize: '0.85rem' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '1rem', fontFamily: 'Outfit' }}>
                      🤝 老人照护条款细则 / Terms & Conditions
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '200px', overflowY: 'auto', paddingRight: '0.5rem', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-main)', lineHeight: '1.5' }}>
                      <p>
                        <strong>第一条 服务内容 / Scope of Services</strong><br />
                        乙方同意向甲方指定之长者提供非医疗性质之照护服务，包括日常生活照顾、陪伴服务、协助进食、个人卫生护理、服药提醒、陪诊服务、简单家务及其他约定服务。<br />
                        The Caregiver agrees to provide non-medical care services including daily living assistance, companionship, feeding assistance, hygiene assistance, medication reminders, medical escort services, light housekeeping and other agreed services.
                      </p>
                      <p>
                        <strong>第二条 医疗资质免责 / Medical Disclaimer</strong><br />
                        乙方并非医生、护士或医疗专业人员，不提供临床诊断或医疗决定。<br />
                        The Caregiver is not a doctor, nurse, or licensed medical practitioner, and does not provide clinical diagnosis or medical decisions.
                      </p>
                      <p>
                        <strong>第三条 健康资料披露 / Health Information Disclosure</strong><br />
                        甲方须如实披露长者健康状况，包括慢性疾病、过敏记录、服药情况及其他相关资料。若因隐瞒或错误资料导致损失，乙方无需承担责任。<br />
                        The Client shall fully disclose all relevant health information. The Caregiver shall not be liable for incidents resulting from incomplete or inaccurate disclosure.
                      </p>
                      <p>
                        <strong>第四条 医疗紧急情况 / Medical Emergencies</strong><br />
                        发生紧急情况时，乙方有权联络家属、呼叫救护车或安排送院。相关医疗费用由甲方承担。<br />
                        In emergencies, the Caregiver may contact family members, call emergency services, or arrange hospital admission. Medical expenses shall be borne by the Client.
                      </p>
                      <p>
                        <strong>第五条 风险告知及免责 / Risk Acknowledgement and Limitation of Liability</strong><br />
                        甲方理解长者可能因年龄、身体状况或既有疾病而发生跌倒、受伤、住院或死亡等风险。除故意行为或重大疏忽外，乙方不承担赔偿责任。<br />
                        The Client acknowledges the inherent risks associated with aging and pre-existing conditions. Except for intentional misconduct or gross negligence, the Caregiver shall not be liable.
                      </p>
                      <p>
                        <strong>第六条 药物管理 / Medication Management</strong><br />
                        乙方仅负责提醒服药，不负责药物处方、剂量决定或医疗判断。<br />
                        The Caregiver only provides medication reminders and is not responsible for prescriptions, dosage decisions, or medical judgments.
                      </p>
                      <p>
                        <strong>第七条 财物责任 / Personal Property</strong><br />
                        甲方应妥善保管现金及贵重物品。除有明确证据证明乙方故意行为外，乙方无需承担财物损失责任。<br />
                        The Client shall safeguard valuables. The Caregiver shall not be liable unless intentional misconduct is proven.
                      </p>
                      <p>
                        <strong>第八条 平台声明 / Platform Disclaimer</strong><br />
                        本服务由乙方以独立服务提供者身份提供。公会/协会仅提供会员管理、培训及服务配对平台，并非服务提供者、雇主、医疗机构或护理机构，因此不承担相关法律责任。<br />
                        The service is provided by the Caregiver as an independent service provider. The Association/Union only provides a platform and shall not be liable for service-related claims or disputes.
                      </p>
                      <p>
                        <strong>第九条 服务终止 / Termination</strong><br />
                        如发生暴力、骚扰、拖欠费用或严重违约，乙方有权终止服务。<br />
                        The Caregiver may terminate the service in cases of violence, harassment, non-payment, or material breach.
                      </p>
                      <p>
                        <strong>第十条 适用法律 / Governing Law</strong><br />
                        本协议受马来西亚法律管辖。<br />
                        This Agreement shall be governed by the laws of Malaysia.
                      </p>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.82rem', margin: '0 0 1rem 0', color: 'var(--text-muted)' }}>
                      *本人确认已阅读、理解并同意本协议全部条款。/ I confirm that I have read, understood, and agreed to all terms and conditions of this agreement.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Client Digital Signature (Type Name) / 甲方签名 *</label>
                        <input type="text" required className="form-input" placeholder="Type name to sign" value={clientSigned} onChange={(e) => setClientSigned(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Signed Date / 签署日期</label>
                        <input type="date" className="form-input" style={{ background: 'var(--bg-input)' }} value={signedDate} onChange={(e) => setSignedDate(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', background: 'var(--primary)', boxShadow: '0 2px 8px var(--primary-glow)' }}>
                    ✍️ Confirm & Sign Agreement / 确认并签署协议
                  </button>
                </form>
              </div>
            </div>
          ) : agreementType === 'confinement' ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span className="badge badge-active" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
                  🤝 Official MCSA Confinement Agreement Portal
                </span>
                <h2 style={{ fontSize: '2.3rem', fontWeight: 800, fontFamily: 'Outfit' }}>
                  产后护理服务协议书 / Confinement Care Agreement
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
                  Assigned Caregiver: <strong style={{ color: 'var(--accent)' }}>{caregiverName}</strong> &bull; Secure Encrypted Submission
                </p>
              </div>

              <div className="card agreement-card">
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Dear Valued Client,<br />
                  To secure your confinement care service and reserve the scheduled dates, please review the contract details set by your caregiver and fill in your client information. Rest assured that all personal data is safely processed in accordance with MCSA union standards.
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Part 1: Parties Information */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>
                      第一部分：双方信息 / Part 1: Parties Information
                    </h4>
                    {/* Caregiver Info (Read-only) */}
                    <div style={{ background: 'var(--bg-input)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem', textTransform: 'uppercase', fontWeight: 700 }}>Union Caregiver (Second Party) / 乙方（工会会员护理师）</span>
                      <div className="responsive-modal-grid-2" style={{ gap: '0.75rem', fontSize: '0.88rem' }}>
                        <div><strong>姓名 Name:</strong> <span style={{ color: 'var(--text-main)' }}>{confinementContract?.caregiverName}</span></div>
                        <div><strong>会员编号 Member ID:</strong> <span style={{ color: 'var(--text-main)' }}>{confinementContract?.caregiverMemberNo}</span></div>
                        <div><strong>身份证号码 NRIC:</strong> <span style={{ color: 'var(--text-main)' }}>{confinementContract?.caregiverNric}</span></div>
                        <div><strong>联络电话 Phone:</strong> <span style={{ color: 'var(--text-main)' }}>{confinementContract?.caregiverPhone}</span></div>
                      </div>
                    </div>

                    {/* Client Info (Inputs) */}
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem', textTransform: 'uppercase', fontWeight: 700 }}>Client Details (First Party) / 甲方（客户）</span>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Client Name / 客户姓名 *</label>
                        <input type="text" required className="form-input" placeholder="e.g. Emily Tan" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">NRIC or Passport / 身份证号 *</label>
                        <input type="text" required className="form-input" placeholder="e.g. 920815-14-5226" value={nric} onChange={(e) => setNric(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Contact Phone / 联络电话 *</label>
                        <input type="text" required className="form-input" placeholder="e.g. 012-7788990" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Expected Due Date (EDD) / 预产期 *</label>
                        <input type="date" required className="form-input" style={{ background: 'var(--bg-input)' }} value={clientEdd} onChange={(e) => setClientEdd(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                        <label className="form-label">Service Address / 服务地址 *</label>
                        <input type="text" required className="form-input" placeholder="e.g. 15, Jalan Puchong Jaya, Puchong, Selangor" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Part 2: Payment Account (Read-only) */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>第二部分：收款账户资料 / Part 2: Payment Account</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.88rem', background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px' }}>
                      <div><strong>银行名称 Bank:</strong><br /> <span style={{ color: 'var(--text-main)' }}>{confinementContract?.bankName}</span></div>
                      <div><strong>账户名称 Name:</strong><br /> <span style={{ color: 'var(--text-main)' }}>{confinementContract?.accountName}</span></div>
                      <div><strong>银行账号 Account:</strong><br /> <span style={{ color: 'var(--text-main)' }}>{confinementContract?.accountNumber}</span></div>
                      <div><strong>DuitNow:</strong><br /> <span style={{ color: 'var(--text-main)' }}>{confinementContract?.duitNow || '-'}</span></div>
                    </div>
                  </div>

                  {/* Part 3: Fees & Deposit (Read-only) */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>第三部分：服务费用及订金 / Part 3: Fees and Deposit</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.88rem', background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '1.2rem', borderRadius: '12px' }}>
                      <div><strong>服务费用 Fee:</strong><br /> <span style={{ color: 'var(--text-main)' }}>RM {confinementContract?.serviceFee}</span></div>
                      <div><strong>订金金额 Deposit:</strong><br /> <span style={{ color: 'var(--text-main)' }}>RM {confinementContract?.deposit}</span></div>
                      <div><strong>尾款金额 Balance:</strong><br /> <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>RM {confinementContract?.balance}</span></div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', paddingLeft: '0.5rem' }}>
                      <div>• 所有订金均不予退还。 / All deposits are non-refundable.</div>
                      <div>• 订金用于保留预产期前后六（6）周档期。 / The deposit reserves six (6) weeks surrounding the expected due date.</div>
                    </div>
                  </div>

                  {/* Part 4: Union Declaration */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>第四部分：工会声明 / Part 4: Union Declaration</h4>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', lineHeight: '1.4' }}>
                      <div>1. 工会仅作为会员管理、培训及服务配对平台。 / The Union acts solely as a membership, training and matching platform.</div>
                      <div>2. 乙方为独立自雇人士。 / The Caregiver is an independent self-employed service provider.</div>
                      <div>3. 所有服务安排、收费、责任及义务均由甲乙双方自行承担。 / All services, responsibilities and obligations are solely between the Client and the Caregiver.</div>
                    </div>
                  </div>

                  {/* Part 5: Scope of Service */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>
                      第五部分：服务范围及条款细则 / Part 5: Scope of Service and Terms & Conditions
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '280px', overflowY: 'auto', paddingRight: '0.5rem', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', background: 'var(--bg-main)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                      
                      <p>
                        <strong>第一条 服务内容 / Article 1: Scope of Service</strong><br />
                        乙方根据专业培训知识，为甲方提供产后护理服务，包括但不限于：<br />
                        The Caregiver (Second Party) shall provide postnatal care services to the Client (First Party) based on professional training knowledge, including but not limited to:<br /><br />
                        <strong>一、产妇护理 / I. Maternal Care:</strong><br />
                        • 协助产妇日常生活照顾 (Assistance with maternal daily life care)<br />
                        • 协助伤口观察及护理 (Assistance with wound observation and care)<br />
                        • 协助乳房护理及母乳喂养指导 (Assistance with breast care and lactation guidance)<br />
                        • 观察产妇身体恢复状况 (Observation of maternal physical recovery status)<br />
                        • 协助记录产妇饮食及休息情况 (Assistance with recording maternal diet and rest)<br />
                        • 协助产妇情绪关怀与支持 (Assistance with maternal emotional care and support)<br />
                        • 准备及烹煮月子餐（如双方约定） (Preparation and cooking of confinement meals, if agreed by both parties)<br /><br />
                        <strong>二、新生儿护理 / II. Newborn Care:</strong><br />
                        • 新生儿喂奶 (Newborn feeding)<br />
                        • 拍嗝 (Burping)<br />
                        • 换尿布 (Diaper changing)<br />
                        • 洗澡 (Bathing)<br />
                        • 脐带护理 (Umbilical cord care)<br />
                        • 睡眠照顾 (Sleep care)<br />
                        • 新生儿日常观察记录 (Newborn daily observation and recording)<br />
                        • 奶瓶清洁与消毒 (Baby bottle cleaning and sterilization)<br /><br />
                        <strong>三、家务范围 / III. Housework Limits:</strong><br />
                        仅限于与产妇及婴儿有关之工作 (Only limited to tasks directly related to the mother and baby):<br />
                        • 清洗宝宝衣物 (Washing baby clothes)<br />
                        • 清洗宝宝用品 (Washing baby products)<br />
                        • 清洁奶瓶及喂养工具 (Cleaning baby bottles and feeding utensils)<br />
                        • 整理产妇房间 (Tidying up the mother's room)
                      </p>
                      <p>
                        <strong>第二条 非服务范围 / Article 2: Exclusions (Out of Scope)</strong><br />
                        乙方并非医生、护士或医疗人员，因此以下事项不属于服务范围：<br />
                        The Caregiver is not a doctor, nurse, or medical professional; therefore, the following matters are strictly excluded from the scope of service:<br />
                        • 医疗诊断 (Medical diagnosis)<br />
                        • 开药或提供医疗建议 (Prescribing medication or offering medical advice)<br />
                        • 注射或医疗操作 (Injections or medical procedures)<br />
                        • 陪同看诊（除非另有约定） (Accompanying to medical consultations, unless otherwise agreed)<br />
                        • 照顾其他家庭成员 (Caring for other family members)<br />
                        • 打扫全屋卫生 (Whole-house cleaning)<br />
                        • 照顾宠物 (Pet care)<br />
                        • 洗车 (Car washing)<br />
                        • 家庭佣人工作 (Domestic helper/maid tasks)<br />
                        • 照顾访客或亲属 (Caring for visitors or relatives)
                      </p>
                      <p>
                        <strong>第三条 医疗免责条款 / Article 3: Medical Disclaimer</strong><br />
                        甲方了解并同意 / The Client understands and agrees that:<br />
                        1. 乙方仅提供非医疗性质之护理服务。 (The Caregiver only provides care services of a non-medical nature.)<br />
                        2. 婴儿如出现以下情况，乙方应立即通知甲方，并建议送医：发烧、黄疸加重、呼吸困难、抽搐、呕吐异常、拒奶、其他异常情况。 (If the baby exhibits any of the following conditions, the Caregiver shall immediately notify the Client and recommend medical attention: fever, worsening jaundice, breathing difficulties, convulsions, abnormal vomiting, milk refusal, or other abnormal conditions.)<br />
                        3. 乙方无权作出任何医疗诊断。 (The Caregiver has no authority to make any medical diagnosis.)<br />
                        4. 婴儿之先天性疾病、遗传疾病、染色体异常、发育迟缓、神经系统疾病、心脏疾病、代谢疾病或其他出生前已存在之健康问题，均不属于乙方责任范围。 (Congenital diseases, genetic disorders, chromosomal abnormalities, developmental delays, neurological disorders, heart diseases, metabolic diseases, or other health issues pre-existing before birth are strictly excluded from the Caregiver's scope of responsibility.)<br />
                        5. 婴儿因先天性疾病、遗传因素或出生前健康状况所引起之任何后果，乙方不承担法律责任。 (The Caregiver bears no legal liability for any consequences arising from the baby's congenital diseases, genetic factors, or prenatal health conditions.)<br />
                        6. 产妇因怀孕期间、生产期间或既有疾病所导致之健康问题，乙方不承担医疗责任。 (The Caregiver bears no medical liability for health problems of the mother resulting from pregnancy, childbirth, or pre-existing medical conditions.)
                      </p>
                      <p>
                        <strong>第四条 紧急情况处理 / Article 4: Emergency Handling</strong><br />
                        如发生以下情况：婴儿发烧、呼吸困难、昏迷、抽搐、严重黄疸、意外受伤、产妇大量出血、昏厥，乙方有权立即通知家属、拨打急救电话或送医处理。相关医疗费用由甲方承担。<br />
                        In case of emergencies such as: baby fever, breathing difficulties, coma, convulsions, severe jaundice, accidental injury, heavy maternal bleeding, or fainting, the Caregiver is authorized to immediately notify family members, call emergency services, or seek medical evacuation. All related medical expenses shall be borne by the Client.
                      </p>
                      <p>
                        <strong>第五条 客户责任 / Article 5: Client Responsibilities</strong><br />
                        甲方应 / The Client shall:<br />
                        • 如实告知母婴健康状况。 (Truthfully disclose the health status of both mother and baby.)<br />
                        • 提供安全工作环境。 (Provide a safe working environment.)<br />
                        • 提供基本住宿（住家月嫂适用）。 (Provide basic accommodation, applicable to live-in caregivers.)<br />
                        • 提供合理休息时间。 (Provide reasonable rest periods.)<br />
                        • 配合乙方执行护理计划。 (Cooperate with the Caregiver to execute the care plan.)<br />
                        • 如甲方隐瞒病史、传染病或特殊情况而导致损失，乙方不承担责任。 (If the Client conceals medical history, infectious diseases, or special conditions resulting in losses, the Caregiver shall bear no responsibility.)
                      </p>
                      <p>
                        <strong>第六条 责任限制 / Article 6: Limitation of Liability</strong><br />
                        乙方仅对因故意行为或重大疏忽所造成之损失承担责任。对于以下情况，乙方无需承担责任：先天性疾病、遗传疾病、医疗并发症、医院诊断错误、家属未遵守护理建议、不可抗力事件、婴儿自然生理变化。<br />
                        The Caregiver shall only be liable for losses caused by willful misconduct or gross negligence. Under no circumstances shall the Caregiver be liable for: congenital diseases, genetic disorders, medical complications, hospital misdiagnoses, family members' failure to follow care recommendations, force majeure events, or the baby's natural physiological changes.
                      </p>

                    </div>
                  </div>

                  {/* Part 6: Signature */}
                  <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem' }}>
                    <p style={{ fontSize: '0.82rem', margin: '0 0 1rem 0', color: 'var(--text-muted)' }}>
                       我确认上述所有信息真实有效。我已阅读并同意本协议中列出的所有责任条款和工会免责声明。<br />
                      I hereby confirm that all information is accurate. I have read and agree to all responsibility terms and witness rules outlined in this agreement.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Client Digital Signature (Type Name) / 客户签名 *</label>
                        <input type="text" required className="form-input" placeholder="Type your full name to sign" value={clientSigned} onChange={(e) => setClientSigned(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Signing Date / 签署日期</label>
                        <input type="date" className="form-input" style={{ background: 'var(--bg-input)' }} value={signedDate} onChange={(e) => setSignedDate(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', background: 'var(--primary)', boxShadow: '0 2px 8px var(--primary-glow)' }}>
                    ✍️ Submit & Sign Agreement / 签署并发送协议
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span className="badge badge-active" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
                  🤝 Official MCSA Escort Authorization Portal
                </span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>
                  陪诊服务建档与责任协议书
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
                  Assigned Companion: <strong style={{ color: 'var(--accent)' }}>{caregiverName}</strong> &bull; Secure Encrypted Submission
                </p>
              </div>

              <div className="card agreement-card">
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Dear Valued Client,<br />
                  To ensure our medical escort (陪诊师) can provide you with safe, personalized, and effective support during your medical visit, we kindly ask you to fill out the following personal and health-related information. Please rest assured that all data will be kept strictly confidential and used only for service coordination and emergency purposes.
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Section 1 Form */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>1. Personal Information / 个人基本信息</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name / 客户姓名 *</label>
                        <input type="text" required className="form-input" placeholder="e.g. Grandpa Zhang" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender / 性别</label>
                        <select className="form-input" style={{ background: 'var(--bg-input)', cursor: 'pointer' }} value={gender} onChange={(e) => setGender(e.target.value)}>
                          <option value="Male">Male / 男</option>
                          <option value="Female">Female / 女</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date of Birth / 出生日期</label>
                        <input type="date" className="form-input" style={{ background: 'var(--bg-input)' }} value={dob} onChange={(e) => setDob(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">NRIC or Passport / 证件号 *</label>
                        <input type="text" required className="form-input" placeholder="e.g. 480312-14-5567" value={nric} onChange={(e) => setNric(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Contact Phone / 联系电话</label>
                        <input type="text" className="form-input" placeholder="e.g. 012-3344556" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
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
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>2. Escort Service Details / 就诊陪护详情</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Appointment Date / 就诊日期</label>
                        <input type="date" className="form-input" style={{ background: 'var(--bg-input)' }} value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Appointment Time / 就诊时间</label>
                        <input type="time" className="form-input" style={{ background: 'var(--bg-input)' }} value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
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
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>3. Health & Medical History / 健康主诉与病史</h4>
                    <div className="form-group">
                      <label className="form-label">Main Complaint or Reason for Consultation / 就诊主诉与原因</label>
                      <textarea className="form-input" placeholder="Describe current symptoms or consultation purpose..." rows={3} style={{ resize: 'vertical' }} value={complaint} onChange={(e) => setComplaint(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Past Medical History / 既往病史 (Select all that apply)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '0.65rem', marginTop: '0.5rem' }}>
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
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>4. Allergy Information / 过敏信息</h4>
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
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>5. Current Medication & Surgeries / 用药与手术史</h4>
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
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>6. Functional & Mobility Assessment / 行动与日常功能评估</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Mobility Difficulties / 行动困难评估</label>
                        <select className="form-input" style={{ background: 'var(--bg-input)', cursor: 'pointer' }} value={mobility} onChange={(e) => setMobility(e.target.value)}>
                          <option value="Walk Independently">Walk Independently / 独立行走</option>
                          <option value="Require Walking Stick">Require Walking Stick / 需拐杖</option>
                          <option value="Require Walker">Require Walker / 需助行架</option>
                          <option value="Wheelchair User">Wheelchair User / 轮椅使用者</option>
                          <option value="Require Assistance Walking">Require Assistance Walking / 需助行</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.4rem' }}>
                          <input type="checkbox" checked={hearingDifficulty} onChange={(e) => setHearingDifficulty(e.target.checked)} />
                          <span>Hearing difficulties / 听力障碍</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={speechDifficulty} onChange={(e) => setSpeechDifficulty(e.target.checked)} />
                          <span>Speech difficulties / 语言沟通障碍</span>
                        </label>
                      </div>
                      <div className="form-group" style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                        <label className="form-label">Visual Impairment / 视力障碍描述 (if any)</label>
                        <input type="text" className="form-input" placeholder="e.g. Cataract in right eye, or No" value={visualImpairment} onChange={(e) => setVisualImpairment(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Section 8 Form */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>7. Additional Information / 其他特别备注</h4>
                    <div className="form-group">
                      <textarea className="form-input" placeholder="Any specific requirements or instructions..." rows={2} style={{ resize: 'vertical' }} value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} />
                    </div>
                  </div>

                  {/* Legal Terms Block */}
                  <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem', fontSize: '0.85rem' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '1rem', fontFamily: 'Outfit' }}>🤝 Medical Escort Service Authorization & Liability Agreement / 陪诊服务协议与责任告知书</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '320px', overflowY: 'auto', paddingRight: '0.5rem', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', background: 'var(--bg-main)', lineHeight: '1.6' }}>
                      <p>
                        <strong>第一条 服务内容 / Article 1 Service Scope</strong><br />
                        1. 乙方仅提供非医疗类流程协助，包括：陪同挂号、排队、缴费、检查引导、取药、办理入出院行政手续、送检、引导路线、协助沟通。<br />
                        2. 乙方不提供任何医疗服务，不做诊断、不开药、不解释检查报告、不提供医疗建议、不执行护理操作、不进行急救、不注射、不喂药、不更换敷料。<br />
                        3. 本服务不等于医疗监护、护理服务、救护车或急救服务。<br />
                        <em>Provider only provides non-medical process assistance, including escorting registration, queuing, payment, examination guidance, medication collection, admission/discharge administrative procedures, sample delivery, route guidance, and communication assistance. Provider does not provide any medical service, no diagnosis, no prescription, no test result interpretation, no medical advice, no nursing care, no first aid, no injection, no medication administration, no dressing change. This service is not equivalent to medical supervision, nursing care, ambulance or emergency service.</em>
                      </p>

                      <p>
                        <strong>第二条 医疗行为禁止声明（马来西亚法律强制）/ Article 2 Prohibition of Medical Practice</strong><br />
                        1. 乙方非马来西亚注册医生、护士或医护人员，严禁从事任何医疗行为，否则属违法。<br />
                        2. 甲方确认：陪诊员无权替代医生/护士提供任何医疗判断或治疗。<br />
                        3. 本服务严格遵守马来西亚《1971年医疗法》(Medical Act 1971)、《1998年私立医疗机构与服务法》(PHFSA 1998)。<br />
                        <em>Provider is not a registered medical practitioner, nurse or healthcare personnel in Malaysia. Any medical practice is strictly prohibited and illegal. Client confirms that the escort has no authority to replace doctors/nurses for any medical judgment or treatment. This service complies with Medical Act 1971 and Private Healthcare Facilities & Services Act 1998.</em>
                      </p>

                      <p>
                        <strong>第三条 医疗文件代签授权与限制 / Article 3 Authorization & Restriction for Signing</strong><br />
                        1. 甲方可书面授权乙方代签纯行政/非医疗文件。<br />
                        2. 乙方绝对不得代签：手术同意书、麻醉同意书、侵入性检查同意书、高危治疗同意书、入院知情同意书、病危通知、放弃治疗文件等任何涉及医疗决策的文件。<br />
                        3. 未成年人、无民事行为能力人、意识不清者，必须由法定监护人签署医疗同意文件，陪诊员无权代签。<br />
                        <em>Client may authorize Provider in writing to sign pure administrative/non-medical documents only. Provider SHALL NOT sign any surgery consent, anesthesia consent, invasive procedure consent, high-risk treatment consent, admission consent, critical notice, withdrawal of treatment, or any medical decision-related documents. Minors, persons without capacity, or unconscious patients must have legal guardian sign medical consents; escort has no signing authority.</em>
                      </p>

                      <p>
                        <strong>第四条 紧急情况处理 / Article 4 Emergency Procedure</strong><br />
                        1. 服务期间如发生突发疾病、晕倒、呼吸困难、胸痛、出血等急症，乙方仅可立即呼叫医院医护/急诊，不做任何医疗处置。<br />
                        2. 乙方可协助联系甲方紧急联系人，但不承担医疗决策责任。<br />
                        3. 甲方同意医院按医疗规范处理，乙方不承担因此产生的任何医疗责任与费用。<br />
                        <em>In case of sudden illness, fainting, breathing difficulty, chest pain, bleeding or other emergencies during service, Provider shall immediately call hospital staff/emergency department only and shall not perform any medical intervention. Provider may assist to contact Client’s emergency contact but shall not bear medical decision-making liability. Client agrees hospital will treat per standard protocol; Provider shall not be liable for any medical responsibility or cost.</em>
                      </p>

                      <p>
                        <strong>第五条 风险告知与责任免除 / Article 5 Risk Disclosure & Liability Exclusion</strong><br />
                        甲方充分知悉并同意：<br />
                        1. 陪诊服务不改变病情发展，因自身疾病、隐瞒病史、过敏史、医院规定、医院操作、不可抗力导致的一切后果，乙方不承担责任。<br />
                        2. 因甲方未按时到场、提供错误信息、拒绝配合流程导致的延误，乙方不承担责任。<br />
                        3. 乙方对未明确交付并登记的个人物品、现金、贵重物品不承担保管责任。<br />
                        <em>Client fully understands and agrees: 1. Escort service does not change medical condition. Provider is not liable for any consequences caused by own illness, withheld medical history, allergy, hospital rules, hospital operation, or force majeure. 2. Provider is not liable for delay caused by Client’s late arrival, wrong information, or refusal to cooperate. 3. Provider is not responsible for personal belongings, cash, valuables not explicitly handed over and registered.</em>
                      </p>

                      <p>
                        <strong>第六条 个人数据保护（PDPA 2010）/ Article 6 Personal Data Protection</strong><br />
                        1. 双方遵守马来西亚《2010年个人数据保护法》(PDPA 2010)。<br />
                        2. 患者健康信息、个人资料属于敏感个人数据，仅限本次服务使用，服务结束后不予留存。<br />
                        3. 未经甲方书面同意，乙方不得向任何第三方披露、复制、传播。<br />
                        <em>Both Parties comply with Personal Data Protection Act 2010 (PDPA 2010). Patient health information and personal data are sensitive personal data, used only for this service, not retained after service. No disclosure, copy, or distribution to third parties without Client’s written consent.</em>
                      </p>

                      <p>
                        <strong>第七条 服务费用 / Article 7 Service Fees</strong><br />
                        费用包含：指定时段陪诊服务；不含：药费、检查费、治疗费、停车费、交通费等第三方费用。<br />
                        <em>Fees include: escort service during agreed time; exclude: medication, tests, treatment, parking, transportation, and other third-party costs.</em>
                      </p>

                      <p>
                        <strong>第八条 取消与改期 / Article 8 Cancellation & Rescheduling</strong><br />
                        1. 服务前 24 小时取消：可免费改期或退还已付费用。<br />
                        2. 不足 24 小时取消或未到场：费用不予退还。<br />
                        3. 医院临时停诊/紧急医疗情况：双方可免费改期。<br />
                        <em>Cancellation 24 hours before service: free reschedule or full refund. Less than 24 hours or no-show: fee non-refundable. Hospital closure or emergency: free reschedule.</em>
                      </p>

                      <p>
                        <strong>第九条 保密条款 / Article 9 Confidentiality</strong><br />
                        双方对服务过程中知悉的所有信息保密，协议终止后依然有效。<br />
                        <em>Both Parties keep all information confidential during and after termination of this Agreement.</em>
                      </p>

                      <p>
                        <strong>第十条 争议解决 / Article 10 Dispute Resolution</strong><br />
                        因本协议产生争议，先友好协商；协商不成，提交马来西亚法院管辖处理。<br />
                        <em>Disputes shall first be resolved amicably; failing which, shall be subject to the jurisdiction of courts in Malaysia.</em>
                      </p>

                      <p>
                        <strong>第十一条 协议生效 / Article 11 Effectiveness</strong><br />
                        本协议一式两份，甲乙双方各执一份，签字后生效。<br />
                        <em>This Agreement is made in two copies, one for each Party, effective upon signature.</em>
                      </p>

                      <p>
                        <strong>第十三条 交通责任与车辆使用免责条款 / Article 13 Transportation Liability & Vehicle Usage Disclaimer</strong><br />
                        1. 如甲方、甲方家属或相关第三方自愿提供车辆供乙方驾驶或乘坐，以完成陪诊服务期间之交通安排，双方同意任何因交通事故、车辆损坏、第三者责任、交通罚单、道路风险或其他交通意外所产生之损失、赔偿、索赔或责任，应依据相关机动车保险、第三者责任保险及马来西亚现行法律规定处理。<br />
                        2. 除非能够证明乙方存在故意行为（Wilful Misconduct）或严重疏忽（Gross Negligence），否则乙方不承担任何车辆维修费用、保险自付额（Insurance Excess）、车辆贬值损失、人身伤害赔偿、第三方索赔或其他相关损失责任。<br />
                        3. 甲方确认陪诊服务并非专业司机服务（Professional Chauffeur Service），乙方仅为协助完成陪诊服务而进行必要之交通安排。道路交通风险属于无法完全控制之风险，双方同意相关责任应由保险公司及有关法定机构依法处理。<br />
                        4. 甲方应确保所提供车辆具有合法有效之道路税（Road Tax）、保险保障（Insurance Coverage）及合法上路资格。若因车辆保险失效、道路税逾期、车辆不适航或其他与车辆合法性相关之问题而导致任何损失、罚款、索赔或法律责任，均由甲方自行承担，与乙方无关。<br />
                        <em>Where the Client, the Client’s family member, or any related third party voluntarily provides a vehicle for the Provider to drive or use for transportation arrangements during the escort service, both Parties agree that any loss, damage, compensation, liability, traffic summons, road hazard, vehicle damage, third-party claim, or transportation-related incident shall be handled in accordance with the applicable motor vehicle insurance, third-party insurance coverage, and the laws of Malaysia. Unless it can be proven that the Provider acted with wilful misconduct or gross negligence, the Provider shall not be liable for any vehicle repair costs, insurance excess payments, vehicle depreciation, personal injury compensation, third-party claims, or any other related losses. The Client acknowledges that the escort service is not a professional chauffeur service and that the Provider only undertakes necessary transportation arrangements in connection with the escort service. Road traffic risks are beyond the Provider’s full control, and both Parties agree that such matters shall be resolved through the relevant insurance providers and competent authorities in accordance with applicable laws. The Client shall ensure that the vehicle provided has a valid Road Tax, Insurance Coverage, and is legally roadworthy. Any loss, fine, claim, or legal liability arising from expired insurance, expired road tax, unroadworthy condition, or any issue relating to the legality of the vehicle shall be borne solely by the Client and shall not be the responsibility of the Provider.</em>
                      </p>
                    </div>
                  </div>

                  {/* Signature */}
                  <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.82rem', margin: '0 0 1rem 0', color: 'var(--text-muted)' }}>
                      * Agreement Terms Declaration: I hereby authorize MCSA companion to assist during hospital outpatient activities. I confirm that all medical history is accurate.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Client Digital Signature (Type Name) *</label>
                        <input type="text" required className="form-input" placeholder="Type your full name to sign" value={clientSigned} onChange={(e) => setClientSigned(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Signed Date</label>
                        <input type="date" className="form-input" style={{ background: 'var(--bg-input)' }} value={signedDate} onChange={(e) => setSignedDate(e.target.value)} />
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
