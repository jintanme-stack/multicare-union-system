'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Heart, Shield, RefreshCw, FileText, Download, CheckSquare, Clock, MapPin, Activity, User, BookOpen } from 'lucide-react';
import { store } from '@/lib/store';

export default function CaregiverDashboard() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'vitals' | 'maternity' | 'library' | 'card' | 'escortForm'>('timeline');
  const [selectedRole, setSelectedRole] = useState<'escort' | 'maternity' | 'elderly'>('elderly');
  const [member, setMember] = useState<any>(null);
  const [careRequests, setCareRequests] = useState<any[]>([]);
  const [libItems, setLibItems] = useState<any[]>([]);
  const [escortForms, setEscortForms] = useState<any[]>([]);
  
  // Escort Form Mode and Fields
  const [formMode, setFormMode] = useState<'list' | 'create' | 'view'>('list');
  const [currentViewForm, setCurrentViewForm] = useState<any>(null);

  const [formFullName, setFormFullName] = useState('');
  const [formGender, setFormGender] = useState('Male');
  const [formDob, setFormDob] = useState('');
  const [formNric, setFormNric] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formEmergencyName, setFormEmergencyName] = useState('');
  const [formEmergencyPhone, setFormEmergencyPhone] = useState('');
  const [formRelationship, setFormRelationship] = useState('');
  const [formApptDate, setFormApptDate] = useState('');
  const [formApptTime, setFormApptTime] = useState('');
  const [formFacility, setFormFacility] = useState('');
  const [formDoctor, setFormDoctor] = useState('');
  const [formSpecialty, setFormSpecialty] = useState('');
  const [formAssist, setFormAssist] = useState(false);
  const [formComplaint, setFormComplaint] = useState('');
  const [formHistory, setFormHistory] = useState<string[]>([]);
  const [formDrugAllergy, setFormDrugAllergy] = useState('No Known Drug Allergy');
  const [formFoodAllergy, setFormFoodAllergy] = useState('No');
  const [formOtherAllergy, setFormOtherAllergy] = useState('No');
  const [formTakingMeds, setFormTakingMeds] = useState(false);
  const [formMedsList, setFormMedsList] = useState('');
  const [formSurgicalHistory, setFormSurgicalHistory] = useState('');
  const [formMobility, setFormMobility] = useState('Walk Independently');
  const [formHearing, setFormHearing] = useState(false);
  const [formSpeech, setFormSpeech] = useState(false);
  const [formVisual, setFormVisual] = useState('');
  const [formAdditional, setFormAdditional] = useState('');
  const [formSigned, setFormSigned] = useState('');
  const [formSignedDate, setFormSignedDate] = useState('');

  // Vitals State
  const [systolic, setSystolic] = useState('130');
  const [sugar, setSugar] = useState('5.6');
  const [pulse, setPulse] = useState('72');
  const [vitalLogs, setVitalLogs] = useState([
    { id: '1', bp: '130/82 mmHg', sugar: '5.6 mmol/L', pulse: '72 bpm', status: 'Normal', time: '08:30' },
    { id: '2', bp: '134/84 mmHg', sugar: '6.2 mmol/L', pulse: '75 bpm', status: 'Normal', time: '12:30' }
  ]);

  // Confinement Logs
  const [babyWeight, setBabyWeight] = useState('3.2');
  const [formulaMl, setFormulaMl] = useState('90');
  const [breastMins, setBreastMins] = useState('15');
  const [confinementLogs, setConfinementLogs] = useState([
    { id: '1', type: 'Feeding', desc: 'Formula 90ml', time: '09:30' },
    { id: '2', type: 'Diaper', desc: 'Urine pale yellow, soft stool', time: '11:15' }
  ]);

  // Appointments
  const [appointments, setAppointments] = useState([
    { id: '1', time: '2026-06-04 10:30', hospital: 'Hospital Kuala Lumpur (HKL)', dept: 'Cardiology Dept', symptoms: 'Occasional palpitations' }
  ]);

  useEffect(() => {
    const logged = localStorage.getItem('mcsa_logged_member');
    if (logged) {
      const parsed = JSON.parse(logged);
      setMember(parsed);
      if (parsed.category === 'Confinement Care') {
        setSelectedRole('maternity');
      } else if (parsed.category === 'Patient Companion') {
        setSelectedRole('escort');
      } else {
        setSelectedRole('elderly');
      }
    } else {
      const fallback = store.getUnionMembers()[0];
      setMember(fallback);
      setSelectedRole('elderly');
    }

    setCareRequests(store.getCareRequests());
    setLibItems(store.getLibItems());
    setEscortForms(store.getEscortForms());
  }, []);

  const submitVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      id: String(vitalLogs.length + 1),
      bp: `${systolic}/82 mmHg`,
      sugar: `${sugar} mmol/L`,
      pulse: `${pulse} bpm`,
      status: Number(systolic) >= 140 || Number(sugar) >= 7.0 ? 'High Risk' : 'Normal',
      time: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setVitalLogs([newLog, ...vitalLogs]);
    alert('Vitals updated and synced to family portal database.');
  };

  const submitConfinement = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      id: String(confinementLogs.length + 1),
      type: 'Feeding',
      desc: `Formula ${formulaMl}ml / Breastfed ${breastMins} mins`,
      time: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setConfinementLogs([newLog, ...confinementLogs]);
    alert('Confinement care log updated.');
  };

  const submitEscortForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim() || !formNric.trim() || !formSigned.trim()) {
      alert('Please fill out all required fields (Full Name, NRIC/Passport, and Signature).');
      return;
    }
    const newForm = {
      id: 'FORM-' + Math.floor(102 + Math.random() * 900),
      fullName: formFullName,
      gender: formGender,
      dob: formDob,
      nric: formNric,
      phone: formPhone,
      address: formAddress,
      emergencyName: formEmergencyName,
      emergencyPhone: formEmergencyPhone,
      relationship: formRelationship,
      appointmentDate: formApptDate,
      appointmentTime: formApptTime,
      facility: formFacility,
      doctor: formDoctor,
      specialty: formSpecialty,
      assistanceRequired: formAssist,
      complaint: formComplaint,
      pastHistory: formHistory,
      drugAllergy: formDrugAllergy,
      foodAllergy: formFoodAllergy,
      otherAllergy: formOtherAllergy,
      takingMeds: formTakingMeds,
      medsList: formMedsList,
      surgicalHistory: formSurgicalHistory,
      mobility: formMobility,
      hearingDifficulty: formHearing,
      speechDifficulty: formSpeech,
      visualImpairment: formVisual,
      additionalInfo: formAdditional,
      clientSigned: formSigned,
      signedDate: formSignedDate || new Date().toISOString().split('T')[0]
    };

    const updated = [newForm, ...escortForms];
    setEscortForms(updated);
    store.setEscortForms(updated);

    // Reset fields
    setFormFullName('');
    setFormDob('');
    setFormNric('');
    setFormPhone('');
    setFormAddress('');
    setFormEmergencyName('');
    setFormEmergencyPhone('');
    setFormRelationship('');
    setFormApptDate('');
    setFormApptTime('');
    setFormFacility('');
    setFormDoctor('');
    setFormSpecialty('');
    setFormAssist(false);
    setFormComplaint('');
    setFormHistory([]);
    setFormDrugAllergy('No Known Drug Allergy');
    setFormFoodAllergy('No');
    setFormOtherAllergy('No');
    setFormTakingMeds(false);
    setFormMedsList('');
    setFormSurgicalHistory('');
    setFormMobility('Walk Independently');
    setFormHearing(false);
    setFormSpeech(false);
    setFormVisual('');
    setFormAdditional('');
    setFormSigned('');
    setFormSignedDate('');

    setFormMode('list');
    alert('Medical Escort Client Information Form and Agreement submitted successfully!');
  };

  return (
    <div className="app-container" style={{ background: '#0b1329' }}>
      {/* Sidebar with Glassmorphic design */}
      <aside className="sidebar" style={{ background: 'rgba(15, 23, 42, 0.9)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
            border: '2px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem'
          }}>
            {member?.photo ? (
              <img 
                src={member.photo} 
                alt={member.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <span style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800 }}>
                {member ? member.name.split(' ').map((n: string) => n[0]).join('') : 'L'}
              </span>
            )}
          </div>
          <h4 style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>{member ? member.name : 'Li Xiulan'}</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {member ? member.member_number : 'MCSA-2026-0009'}</span>
        </div>

        {/* Identity Selector */}
        <div className="form-group" style={{ margin: '0 0 1.5rem 0' }}>
          <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Role Identity Segment</label>
          <select 
            className="form-input" 
            style={{ 
              padding: '0.5rem', 
              fontSize: '0.85rem', 
              background: 'rgba(255,255,255,0.04)', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
          >
            <option value="elderly" style={{ color: 'black' }}>👴 Elderly Caregiver</option>
            <option value="maternity" style={{ color: 'black' }}>🍼 Confinement Lady</option>
            <option value="escort" style={{ color: 'black' }}>🏥 Patient Companion</option>
          </select>
        </div>

        <ul className="sidebar-menu">
          <li>
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`sidebar-link ${activeTab === 'timeline' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Calendar size={18} /> Daily Schedule
            </button>
          </li>
          
          {selectedRole === 'elderly' && (
            <li>
              <button 
                onClick={() => setActiveTab('vitals')}
                className={`sidebar-link ${activeTab === 'vitals' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <Heart size={18} /> Vitals Tracking
              </button>
            </li>
          )}

          {selectedRole === 'maternity' && (
            <li>
              <button 
                onClick={() => setActiveTab('maternity')}
                className={`sidebar-link ${activeTab === 'maternity' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <Activity size={18} /> Maternity Log
              </button>
            </li>
          )}

          {selectedRole === 'escort' && (
            <li>
              <button 
                onClick={() => setActiveTab('escortForm')}
                className={`sidebar-link ${activeTab === 'escortForm' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <FileText size={18} /> Escort Forms
              </button>
            </li>
          )}

          <li>
            <button 
              onClick={() => setActiveTab('library')}
              className={`sidebar-link ${activeTab === 'library' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <FileText size={18} /> Hospital Guides
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('card')}
              className={`sidebar-link ${activeTab === 'card' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <CreditCard size={18} /> My MCSA Card
            </button>
          </li>
          <li style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
            <a href="/" className="sidebar-link" style={{ color: '#fca5a5' }}>🚪 Log Out SaaS</a>
          </li>
        </ul>
      </aside>

      {/* Main Workspace */}
      <main className="workspace animate-fade-in">
        
        {activeTab === 'timeline' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff' }}>Daily Schedule & Shift Tasks</h2>
                <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>Welcome back, Li Xiulan. Vetting shift parameters.</p>
              </div>
              <span className="badge badge-active">🟢 Shift Active</span>
            </div>

            <div className="grid-cols-2">
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <CheckSquare size={20} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Shift Tasks Checklist</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  {[
                    { text: 'Verify patient identity and emergency profile', checked: true },
                    { text: 'Log morning blood sugar and blood pressure', checked: true },
                    { text: 'Remind patient to take diabetes medication post lunch', checked: false },
                    { text: 'Log shift timeline milestones to family portal', checked: false }
                  ].map((task, idx) => (
                    <label key={idx} style={{ 
                      display: 'flex', 
                      gap: '0.75rem', 
                      alignItems: 'center', 
                      fontSize: '0.92rem',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="checkbox" 
                        defaultChecked={task.checked} 
                        style={{ 
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '4px',
                          accentColor: 'var(--primary)',
                          cursor: 'pointer'
                        }} 
                      />
                      <span style={{ color: task.checked ? 'var(--text-muted)' : '#ffffff', textDecoration: task.checked ? 'line-through' : 'none' }}>
                        {task.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <Clock size={20} style={{ color: 'var(--accent)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Active Medical Escort Assignments</h3>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  {appointments.map((a) => (
                    <div key={a.id} style={{ 
                      background: 'rgba(30,41,59,0.5)',
                      border: '1px solid rgba(255,255,255,0.06)', 
                      padding: '1.25rem', 
                      borderRadius: '12px',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: '#60a5fa', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                        <MapPin size={16} /> {a.hospital}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        🏥 {a.dept} &bull; 🕒 {a.time}
                      </div>
                      <p style={{ 
                        fontSize: '0.88rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        padding: '0.75rem 1rem', 
                        borderRadius: '8px', 
                        margin: 0, 
                        color: 'var(--text-main)',
                        borderLeft: '3px solid var(--accent)'
                      }}>
                        <strong>Chief Symptoms:</strong> {a.symptoms}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Open Client Dispatches matching category */}
            <div className="card" style={{ marginTop: '1.5rem', gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Activity size={20} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Open Union Dispatch Broadcasts (Matching Specialty)</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {careRequests.filter((r: any) => r.category.toLowerCase().includes((member?.category || 'elderly').toLowerCase().split(' ')[0])).length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No new matching dispatches found.</p>
                ) : (
                  careRequests.filter((r: any) => r.category.toLowerCase().includes((member?.category || 'elderly').toLowerCase().split(' ')[0])).map((req: any) => (
                    <div key={req.id} style={{
                      border: '1px solid var(--border)',
                      padding: '1.2rem',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{req.id}</span>
                          <span style={{ color: 'var(--text-muted)' }}>📅 {req.date}</span>
                        </div>
                        <h4 style={{ color: 'white', margin: '0 0 0.4rem 0', fontSize: '0.95rem' }}>Client: {req.name}</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 1rem 0' }}>"{req.message}"</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem' }}>
                        <span>Contact: <strong>{req.contact}</strong></span>
                        <button 
                          onClick={() => {
                            const newApp = {
                              id: String(appointments.length + 1),
                              time: new Date().toISOString().split('T')[0] + ' 09:00',
                              hospital: `Client Site (${req.name})`,
                              dept: req.category,
                              symptoms: req.message
                            };
                            setAppointments([...appointments, newApp]);
                            const remainingRequests = careRequests.filter((r: any) => r.id !== req.id);
                            setCareRequests(remainingRequests);
                            store.setCareRequests(remainingRequests);
                            alert('Dispatch accepted! Assigned shift scheduled and active.');
                          }}
                          className="btn btn-primary" 
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px' }}
                        >
                          Accept Shift
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'vitals' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Vitals logs (Elderly Care Unit)</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sync patient vitals. Values are uploaded in real-time to the family supervisor database.</p>

            <div className="grid-cols-2">
              <div className="card">
                <h3>Log New Vitals</h3>
                <form onSubmit={submitVitals} style={{ marginTop: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Systolic BP (mmHg)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Blood Sugar (mmol/L)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="form-input" 
                      value={sugar}
                      onChange={(e) => setSugar(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pulse Rate (bpm)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    ⚡ Upload & Sync Vitals Data
                  </button>
                </form>
              </div>

              <div className="card">
                <h3>Logged History (Today)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                  {vitalLogs.map((log) => (
                    <div key={log.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.06)', 
                      paddingBottom: '0.85rem' 
                    }}>
                      <div>
                        <strong style={{ fontSize: '1rem', color: '#ffffff' }}>BP: {log.bp} &bull; Sugar: {log.sugar}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          🩺 Pulse: {log.pulse} &bull; Logged at {log.time}
                        </div>
                      </div>
                      <span className={`badge ${log.status === 'Normal' ? 'badge-active' : 'badge-danger'}`} style={{ padding: '0.3rem 0.6rem' }}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maternity' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Maternity Log (Confinement Unit)</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Record newborn metrics, formula input, and feeding parameters.</p>

            <div className="grid-cols-2">
              <div className="card">
                <h3>Log Feeding & parameters</h3>
                <form onSubmit={submitConfinement} style={{ marginTop: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Baby Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="form-input" 
                      value={babyWeight}
                      onChange={(e) => setBabyWeight(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Formula Milk (ml)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={formulaMl}
                      onChange={(e) => setFormulaMl(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Breastfeeding Duration (minutes)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={breastMins}
                      onChange={(e) => setBreastMins(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    🍼 Log Confinement Activity
                  </button>
                </form>
              </div>

              <div className="card">
                <h3>Activity Timeline</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                  {confinementLogs.map((log) => (
                    <div key={log.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.06)', 
                      paddingBottom: '0.85rem' 
                    }}>
                      <div>
                        <strong style={{ color: '#ffffff', fontSize: '1rem' }}>🍼 {log.type}</strong>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{log.desc}</div>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Hospital Guidelines & SOP Library</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Check internal hospital maps, routing lists, and outpatient checkpoints.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {libItems.map((item) => (
                <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <BookOpen size={20} style={{ color: 'var(--primary)' }} />
                      <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{item.title}</h3>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
                      Accredited training resource and clinical layout guide. Published for active caregiver operations.
                    </p>
                  </div>
                  <button 
                    onClick={() => alert(`Downloading file: ${item.title.toLowerCase().replace(/ /g, '_')}.pdf`)} 
                    className="btn btn-outline"
                    style={{ width: '100%' }}
                  >
                    <Download size={16} /> Download {item.type} ({item.size})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'card' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Digital Union Membership Card</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Presents verified MCSA registry identification for clinical audits.</p>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              {/* Premium Holographic Card Component */}
              <div style={{
                width: '100%',
                maxWidth: '460px',
                height: '276px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {/* Glowing highlight reflection */}
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.08) 50%, transparent 55%)',
                  pointerEvents: 'none'
                }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                      MULTICARE SUPPORT UNION
                    </h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '0.08em' }}>
                      MCSA MALAYSIA VALIDATED REGISTRY
                    </span>
                  </div>
                  <img 
                    src="/mcsa-logo.png" 
                    alt="MCSA Logo" 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'white', padding: '1px' }} 
                  />
                </div>
                {/* Chip & Photo Row */}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', margin: '0.5rem 0' }}>
                  {/* Photo box */}
                  <div style={{
                    width: '70px',
                    height: '85px',
                    backgroundColor: '#1e293b',
                    border: '2px solid var(--accent)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    position: 'relative',
                    flexShrink: 0
                  }}>
                    {member?.photo ? (
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '36px', height: '36px', color: 'var(--text-muted)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(245, 158, 11, 0.9)',
                      color: '#000000',
                      fontSize: '0.45rem',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: '1px 0'
                    }}>
                      PHOTO ID
                    </div>
                  </div>

                  {/* Member Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                        Membership ID
                      </span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#ffffff', letterSpacing: '0.05em' }}>
                        {member ? member.member_number : 'MCSA-2026-0009'}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Specialty</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }}>
                        {member ? member.category : 'Elderly Caregiver'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Holder Name</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{member ? member.name : 'Li Xiulan'}</span>
                  </div>
                  
                  {/* Status stamp */}
                  <div style={{
                    border: '2px solid var(--health)',
                    color: 'var(--health)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    transform: 'rotate(-5deg)',
                    textTransform: 'uppercase',
                    backgroundColor: 'var(--bg-main)',
                    marginRight: 'auto',
                    marginLeft: '1rem'
                  }}>
                    ✓ Active Vetted
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Expiration</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>{member ? member.expiry : '2027-05-28'}</span>
                  </div>
                </div>
              </div>

              {/* Security audit advice */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="card" style={{ margin: 0, height: '100%', background: 'rgba(30,41,59,0.3)', borderColor: 'rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: 'var(--accent)', fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🛡️ Digital Credential Vetted
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    This membership card operates with encrypted registry validation. You can present this QR-bound serial card to clinic or hospital supervisors to access outpatient priorities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'escortForm' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff' }}>Medical Escort Intake & Agreements / 陪诊服务建档协议</h2>
                <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>Fill and manage Client Information Forms & Liability Agreements.</p>
              </div>
              {formMode === 'list' && (
                <button 
                  onClick={() => {
                    setFormMode('create');
                    setFormSignedDate(new Date().toISOString().split('T')[0]);
                  }}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', boxShadow: '0 2px 8px var(--primary-glow)' }}
                >
                  ➕ New Intake Form / 新建陪诊表单
                </button>
              )}
            </div>

            {formMode === 'list' && (
              <div style={{
                background: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem', display: 'block', marginBottom: '0.2rem' }}>🔗 Share Agreement Link with Client / 分享签署链接给病人</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Send this encrypted page URL to your client. Once they fill out their health profile and sign, it will dynamically register on your dashboard.
                  </span>
                </div>
                <button
                  onClick={() => {
                    const link = window.location.origin + '/sign-agreement?caregiver=' + (member ? member.id : 'M-101');
                    navigator.clipboard.writeText(link);
                    alert('Signing Link copied to clipboard:\n' + link);
                  }}
                  className="btn btn-outline"
                  style={{
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  📋 Copy Client Sign Link / 复制签署链接
                </button>
              </div>
            )}

            {formMode === 'list' && (
              <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '700px' }}>
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Appointment</th>
                      <th>Medical Facility</th>
                      <th>Emergency Contact</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {escortForms.map((f: any) => (
                      <tr key={f.id}>
                        <td>
                          <strong style={{ color: '#ffffff' }}>{f.fullName}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{f.gender} &bull; {f.nric}</div>
                        </td>
                        <td>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{f.appointmentDate}</span>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>🕒 {f.appointmentTime}</div>
                        </td>
                        <td>
                          <span style={{ color: '#ffffff' }}>{f.facility}</span>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{f.specialty} ({f.doctor || 'N/A'})</div>
                        </td>
                        <td>
                          <span style={{ color: '#ffffff' }}>{f.emergencyName}</span>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>📞 {f.emergencyPhone} ({f.relationship})</div>
                        </td>
                        <td>
                          <button 
                            onClick={() => {
                              setCurrentViewForm(f);
                              setFormMode('view');
                            }}
                            className="btn btn-outline"
                            style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                          >
                            🔍 View & Sign / 详情与协议
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {formMode === 'view' && currentViewForm && (
              <div>
                <button 
                  onClick={() => setFormMode('list')}
                  className="btn btn-outline"
                  style={{ marginBottom: '1.5rem', padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  ← Back to List / 返回列表
                </button>

                <div className="card animate-fade-in" style={{ padding: '3rem', background: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '900px', margin: '0 auto' }}>
                  {/* Digital Signature & Form Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src="/mcsa-logo.png" alt="MCSA" style={{ width: '50px', height: '50px', backgroundColor: 'white', borderRadius: '50%', padding: '2px' }} />
                      <div>
                        <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.3rem', fontFamily: 'Outfit' }}>MCSA MALAYSIA</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Medical Escort Client Record / 陪诊档案资料</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Document ID:</span>
                      <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent)' }}>{currentViewForm.id}</div>
                    </div>
                  </div>

                  <h2 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '2rem', fontFamily: 'Outfit' }}>📝 Medical Escort Service – Client Information Form</h2>

                  {/* Section 1 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>1. Personal Information / 个人信息</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>Full Name / 姓名:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.fullName}</span></div>
                      <div><strong>Gender / 性别:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.gender}</span></div>
                      <div><strong>Date of Birth / 出生日期:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.dob || 'N/A'}</span></div>
                      <div><strong>NRIC or Passport / 证件号:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.nric}</span></div>
                      <div><strong>Contact Number / 电话:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.phone || 'N/A'}</span></div>
                      <div><strong>Home Address / 地址:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.address || 'N/A'}</span></div>
                      <div><strong>Emergency Contact / 紧急联系人:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.emergencyName || 'N/A'}</span></div>
                      <div><strong>Emergency Phone / 联系电话:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.emergencyPhone || 'N/A'}</span></div>
                      <div><strong>Relationship / 关系:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.relationship || 'N/A'}</span></div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>2. Escort Service Details / 陪诊服务详情</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>Appointment Date / 就诊日期:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.appointmentDate || 'N/A'}</span></div>
                      <div><strong>Appointment Time / 就诊时间:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.appointmentTime || 'N/A'}</span></div>
                      <div><strong>Medical Facility / 就诊医院:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.facility || 'N/A'}</span></div>
                      <div><strong>Doctor Name / 医生姓名:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.doctor || 'N/A'}</span></div>
                      <div><strong>Department or Specialty / 科室:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.specialty || 'N/A'}</span></div>
                      <div><strong>Admin Tasks Required / 协助取药/付款/登记:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.assistanceRequired ? 'Yes / 是' : 'No / 否'}</span></div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>3. Health & Medical History / 健康与既往病史</h4>
                    <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div><strong>Main Complaint / 就诊主诉:</strong> <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: '0.25rem 0 0 0' }}>{currentViewForm.complaint || 'N/A'}</p></div>
                      <div>
                        <strong>Past Medical History / 既往病史:</strong>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                          {currentViewForm.pastHistory && currentViewForm.pastHistory.length > 0 ? (
                            currentViewForm.pastHistory.map((h: string, i: number) => (
                              <span key={i} className="badge badge-active" style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}>{h}</span>
                            ))
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>None / 无</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>4. Allergy Information / 过敏史</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
                      <div><strong>Drug Allergies / 药物过敏:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.drugAllergy}</span></div>
                      <div><strong>Food Allergies / 食物过敏:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.foodAllergy}</span></div>
                      <div><strong>Other Allergies / 其他过敏:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.otherAllergy}</span></div>
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>5. Current Medication / 当前用药情况</h4>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>Taking medications or supplements / 是否正在服药:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.takingMeds ? 'Yes / 是' : 'No / 否'}</span>
                      {currentViewForm.takingMeds && (
                        <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: '0.4rem 0 0 0', whiteSpace: 'pre-wrap' }}>{currentViewForm.medsList}</p>
                      )}
                    </div>
                  </div>

                  {/* Section 6 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>6. Surgical History / 手术史</h4>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>History of surgeries or procedures / 手术史:</strong>
                      <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: '0.4rem 0 0 0' }}>{currentViewForm.surgicalHistory || 'No / 无'}</p>
                    </div>
                  </div>

                  {/* Section 7 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>7. Functional & Mobility Assessment / 行动与感官功能评估</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>Mobility Difficulty / 行动评估:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.mobility}</span></div>
                      <div><strong>Hearing Difficulties / 听力困难:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.hearingDifficulty ? 'Yes / 有' : 'No / 无'}</span></div>
                      <div><strong>Speech Difficulties / 语言困难:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.speechDifficulty ? 'Yes / 有' : 'No / 无'}</span></div>
                      <div><strong>Visual Impairment / 视力受损情况:</strong> <span style={{ color: '#ffffff' }}>{currentViewForm.visualImpairment || 'No / 无'}</span></div>
                    </div>
                  </div>

                  {/* Section 8 */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>8. Additional Information / 额外备注</h4>
                    <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: 0 }}>{currentViewForm.additionalInfo || 'None / 无'}</p>
                  </div>

                  {/* Escort Authorization & Liability Agreement (陪诊协议条款) */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', marginBottom: '2.5rem', fontSize: '0.85rem' }}>
                    <h3 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>🤝 Medical Escort Service Authorization & Liability Agreement / 陪诊服务协议与责任告知书</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '240px', overflowY: 'auto', paddingRight: '0.5rem', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '8px', background: '#0b1329' }}>
                      <p><strong>第一条 服务内容 / Article 1 Service Scope</strong><br />
                      乙方仅提供非医疗类流程协助，包括：陪同挂号、排队、缴费、检查引导、取药、办理出入院手续、送检、引导路线、协助沟通。<br />
                      Provider only provides non-medical process assistance, including escorting registration, queuing, payment, examination guidance, medication collection, admission/discharge procedures, sample delivery, route guidance, and communication assistance.</p>
                      <p><strong>第二条 医疗行为禁止声明 / Article 2 Prohibition of Medical Practice</strong><br />
                      1. 乙方并非马来西亚注册医生、护士或医护人员，严禁从事任何医疗行为，否则属违法。<br />
                      Provider is not a registered medical practitioner, nurse or healthcare personnel in Malaysia. Any medical practice is strictly prohibited and illegal.<br />
                      2. 甲方确认：陪诊员无权替代医生/护士提供任何医疗判断或治疗。<br />
                      Client confirms that the escort has no authority to replace doctors/nurses for any medical judgment or treatment.</p>
                      <p><strong>第三条 医疗文件代签授权与限制 / Article 3 Authorization & Restriction for Signing</strong><br />
                      1. 甲方许可书面授权乙方代签纯行政/非医疗文件，仅限登记表等。<br />
                      Client may authorize Provider in writing to sign pure administrative/non-medical documents only.<br />
                      2. 乙方绝对不得代签：手术同意书、麻醉同意书、侵入性检查同意书等涉及医疗决策的文件。<br />
                      Provider SHALL NOT sign any surgery consent, anesthesia consent, invasive procedure consent, or any medical decision-related documents.</p>
                      <p><strong>第四条 紧急情况处理 / Article 4 Emergency Procedure</strong><br />
                      1. 服务期间如发生突发疾病、晕倒等急症，乙方仅可立即呼叫医院医护/急诊，不做任何医疗处置。<br />
                      In case of sudden illness, Provider shall immediately call hospital staff/emergency department and shall not perform any medical intervention.<br />
                      2. 乙方可协助联系甲方紧急联系人，但不承担医疗决策责任。<br />
                      Provider may assist to contact Client's emergency contact but shall not bear medical decision-making liability.</p>
                      <p><strong>第五条 风险告知与责任免除 / Article 5 Risk Disclosure & Liability Exclusion</strong><br />
                      陪诊服务不改变病情发展，因自身疾病、隐瞒病史等后果，乙方不承担责任。<br />
                      Escort service does not change medical condition. Provider is not liable for any consequences caused by own illness, withheld medical history, or allergy.</p>
                      <p><strong>第六条 个人数据保护 (PDPA 2010) / Article 6 Personal Data Protection</strong><br />
                      双方遵守马来西亚《2010年个人数据保护法》(PDPA 2010)。患者健康及个人信息属于敏感敏感数据，仅限本次服务使用，服务结束后不予留存。<br />
                      Both Parties comply with Personal Data Protection Act 2010 (PDPA 2010). Patient health and personal data are sensitive and used only for this service.</p>
                    </div>
                  </div>

                  {/* Declaration & Signatures */}
                  <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.5rem', fontSize: '0.9rem' }}>
                    <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                      "I hereby confirm that the information provided above is true and accurate. I understand that the information will be used solely for medical escort service coordination. / 我在此确认上述提供的信息真实准确。我明白此信息将仅用于陪诊服务协调及紧急救援目的。"
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Client Digital Signature / 甲方客户签字</span>
                        <div style={{ fontSize: '1.3rem', fontFamily: 'Outfit, sans-serif', fontStyle: 'italic', fontWeight: 'bold', color: 'var(--accent)', margin: '0.75rem 0' }}>
                          ✍️ {currentViewForm.clientSigned}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed Date / 签署日期: {currentViewForm.signedDate}</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Escort Service Provider / 乙方陪诊师确认</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#60a5fa', margin: '0.9rem 0' }}>
                          🛡️ {member ? member.name : 'Li Xiulan'}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status / 执照状态: Active Licensed Vetted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formMode === 'create' && (
              <div>
                <button 
                  onClick={() => setFormMode('list')}
                  className="btn btn-outline"
                  style={{ marginBottom: '1.5rem', padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  ← Back to List / 返回列表
                </button>

                <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
                  <h3 style={{ color: '#ffffff', marginBottom: '1.5rem', textAlign: 'center' }}>📋 Fill New Client Escort Intake Form</h3>
                  <form onSubmit={submitEscortForm}>
                    
                    {/* Section 1 Form */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>1. Personal Information / 个人基本信息</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Full Name / 客户姓名 *</label>
                          <input type="text" required className="form-input" placeholder="e.g. Grandpa Zhang" value={formFullName} onChange={(e) => setFormFullName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Gender / 性别</label>
                          <select className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }} value={formGender} onChange={(e) => setFormGender(e.target.value)}>
                            <option value="Male">Male / 男</option>
                            <option value="Female">Female / 女</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Date of Birth / 出生日期</label>
                          <input type="date" className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff' }} value={formDob} onChange={(e) => setFormDob(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">NRIC or Passport / 证件号 *</label>
                          <input type="text" required className="form-input" placeholder="e.g. 480312-14-5567" value={formNric} onChange={(e) => setFormNric(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Contact Phone / 联系电话</label>
                          <input type="text" className="form-input" placeholder="e.g. 012-3344556" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label className="form-label">Home Address / 住宅地址</label>
                          <input type="text" className="form-input" placeholder="e.g. 22, Jalan Bukit Bintang, KL" value={formAddress} onChange={(e) => setFormAddress(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Emergency Contact Name / 紧急联系人</label>
                          <input type="text" className="form-input" placeholder="e.g. Zhang Wei" value={formEmergencyName} onChange={(e) => setFormEmergencyName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Emergency Contact Phone / 紧急电话</label>
                          <input type="text" className="form-input" placeholder="e.g. 019-8765432" value={formEmergencyPhone} onChange={(e) => setFormEmergencyPhone(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Relationship / 与客户关系</label>
                          <input type="text" className="form-input" placeholder="e.g. Son" value={formRelationship} onChange={(e) => setFormRelationship(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Section 2 Form */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>2. Escort Service Details / 就诊陪护详情</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Appointment Date / 就诊日期</label>
                          <input type="date" className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff' }} value={formApptDate} onChange={(e) => setFormApptDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Appointment Time / 就诊时间</label>
                          <input type="time" className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff' }} value={formApptTime} onChange={(e) => setFormApptTime(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Medical Facility / 医院或诊所</label>
                          <input type="text" className="form-input" placeholder="e.g. Hospital Kuala Lumpur" value={formFacility} onChange={(e) => setFormFacility(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Doctor Name / 医生姓名</label>
                          <input type="text" className="form-input" placeholder="e.g. Dr. Tan" value={formDoctor} onChange={(e) => setFormDoctor(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Department or Specialty / 科室名称</label>
                          <input type="text" className="form-input" placeholder="e.g. Cardiology Dept" value={formSpecialty} onChange={(e) => setFormSpecialty(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <label className="form-label">Need administrative help? / 是否需协助缴费/取药/办手续</label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.4rem' }}>
                            <input type="checkbox" style={{ width: '18px', height: '18px' }} checked={formAssist} onChange={(e) => setFormAssist(e.target.checked)} />
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
                        <textarea className="form-input" placeholder="Describe current symptoms or consultation purpose..." rows={3} style={{ resize: 'vertical' }} value={formComplaint} onChange={(e) => setFormComplaint(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Past Medical History / 既往病史 (Select all that apply)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginTop: '0.5rem' }}>
                          {['Hypertension', 'Diabetes', 'Heart Disease', 'Stroke', 'Cancer', 'Kidney Disease', 'Asthma', 'Mental Health Condition', 'Dementia / Alzheimer\'s Disease', 'Parkinson\'s Disease'].map((cond) => (
                            <label key={cond} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={formHistory.includes(cond)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormHistory([...formHistory, cond]);
                                  } else {
                                    setFormHistory(formHistory.filter(h => h !== cond));
                                  }
                                }}
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
                          <input type="text" className="form-input" placeholder="e.g. No Known Drug Allergy or penicillin (hives)" value={formDrugAllergy} onChange={(e) => setFormDrugAllergy(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Food Allergies / 食物过敏史</label>
                          <input type="text" className="form-input" placeholder="e.g. No or Peanuts (anaphylaxis)" value={formFoodAllergy} onChange={(e) => setFormFoodAllergy(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Other Allergies / 其它过敏（如乳胶等）</label>
                          <input type="text" className="form-input" placeholder="e.g. No or Latex (skin rash)" value={formOtherAllergy} onChange={(e) => setFormOtherAllergy(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Section 5 & 6 Form */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>5. Current Medication & Surgeries / 用药与手术史</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                            <input type="checkbox" checked={formTakingMeds} onChange={(e) => setFormTakingMeds(e.target.checked)} />
                            <strong className="form-label" style={{ margin: 0 }}>Currently taking medication or supplements / 正在服用药物或保健品</strong>
                          </label>
                          {formTakingMeds && (
                            <textarea className="form-input" placeholder="List medications with dosage & frequency (e.g. Metformin 500mg - 1x daily)" rows={3} style={{ resize: 'vertical' }} value={formMedsList} onChange={(e) => setFormMedsList(e.target.value)} />
                          )}
                        </div>
                        <div className="form-group">
                          <label className="form-label">Surgical History / 手术或医疗史</label>
                          <input type="text" className="form-input" placeholder="e.g. Knee Replacement (2020), Heart Bypass (2022) or No" value={formSurgicalHistory} onChange={(e) => setFormSurgicalHistory(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Section 7 Form */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>6. Functional & Mobility Assessment / 行动与日常功能评估</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Mobility Difficulties / 行动困难评估</label>
                          <select className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff', cursor: 'pointer' }} value={formMobility} onChange={(e) => setFormMobility(e.target.value)}>
                            <option value="Walk Independently">Walk Independently / 独立行走</option>
                            <option value="Require Walking Stick">Require Walking Stick / 需拐杖</option>
                            <option value="Require Walker">Require Walker / 需助行架</option>
                            <option value="Wheelchair User">Wheelchair User / 轮椅使用者</option>
                            <option value="Require Assistance Walking">Require Assistance Walking / 需助行</option>
                          </select>
                        </div>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.4rem' }}>
                            <input type="checkbox" checked={formHearing} onChange={(e) => setFormHearing(e.target.checked)} />
                            <span>Hearing difficulties / 听力障碍</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={formSpeech} onChange={(e) => setFormSpeech(e.target.checked)} />
                            <span>Speech difficulties / 语言沟通障碍</span>
                          </label>
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label className="form-label">Visual Impairment / 视力障碍描述 (if any)</label>
                          <input type="text" className="form-input" placeholder="e.g. Cataract in right eye, or No" value={formVisual} onChange={(e) => setFormVisual(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Section 8 Form */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>7. Additional Information / 其他特别备注</h4>
                      <div className="form-group">
                        <textarea className="form-input" placeholder="Any specific requirements or instructions for our medical escort..." rows={2} style={{ resize: 'vertical' }} value={formAdditional} onChange={(e) => setFormAdditional(e.target.value)} />
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
                          <input type="text" required className="form-input" placeholder="Client signature name" value={formSigned} onChange={(e) => setFormSigned(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Signed Date</label>
                          <input type="date" className="form-input" style={{ background: 'var(--bg-input)', color: '#ffffff' }} value={formSignedDate} onChange={(e) => setFormSignedDate(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', background: 'var(--primary)', boxShadow: '0 2px 8px var(--primary-glow)' }}>
                      💾 Submit Intake Form & Sign Agreement
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
