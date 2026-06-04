'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Heart, Shield, RefreshCw, FileText, Download, CheckSquare, Clock, MapPin, Activity, User, BookOpen } from 'lucide-react';
import { store } from '@/lib/store';

export default function CaregiverDashboard() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'vitals' | 'maternity' | 'library' | 'card'>('timeline');
  const [selectedRole, setSelectedRole] = useState<'escort' | 'maternity' | 'elderly'>('elderly');
  const [member, setMember] = useState<any>(null);
  const [careRequests, setCareRequests] = useState<any[]>([]);
  const [libItems, setLibItems] = useState<any[]>([]);

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

      </main>
    </div>
  );
}
