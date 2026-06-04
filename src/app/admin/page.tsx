'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Users, Briefcase, DollarSign, BookOpen, MessageSquare, Check, X, Award, FileText, Send, CheckCircle2, AlertCircle, Megaphone } from 'lucide-react';
import { store } from '@/lib/store';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'cases' | 'inquiries' | 'library' | 'announcements' | 'escortForms'>('overview');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [docTab, setDocTab] = useState<'cert' | 'health'>('cert');
  const [escortForms, setEscortForms] = useState<any[]>([]);
  const [selectedEscortForm, setSelectedEscortForm] = useState<any>(null);
  
  // Vetting Registry States connected to Store
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [libItems, setLibItems] = useState<any[]>([]);

  const [newLibTitle, setNewLibTitle] = useState('');
  const [newLibType, setNewLibType] = useState('PDF Document');

  // Announcements & Activity Photos States
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('Training');
  const [annContent, setAnnContent] = useState('');

  const [activityPhotos, setActivityPhotos] = useState<any[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');

  useEffect(() => {
    setPendingMembers(store.getPendingMembers());
    setInquiries(store.getInquiries());
    setLibItems(store.getLibItems());
    setAnnouncements(store.getAnnouncements());
    setActivityPhotos(store.getActivityPhotos());
    setEscortForms(store.getEscortForms());
  }, []);

  const approveMember = (id: string, name: string) => {
    const applicant = pendingMembers.find(m => m.id === id);
    if (!applicant) return;

    const newMemberNum = 'MCSA-2026-' + Math.floor(1000 + Math.random() * 9000);
    const newMember = {
      id: 'M-' + Math.floor(103 + Math.random() * 100),
      name: applicant.name,
      email: applicant.email,
      phone: applicant.phone,
      category: applicant.category,
      exp: applicant.exp,
      location: applicant.location || 'Kuala Lumpur',
      member_number: newMemberNum,
      expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      bio: applicant.bio,
      photo: applicant.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&fit=crop'
    };

    const updatedPending = pendingMembers.filter(m => m.id !== id);
    const updatedUnion = [...store.getUnionMembers(), newMember];
    
    store.setPendingMembers(updatedPending);
    store.setUnionMembers(updatedUnion);

    setPendingMembers(updatedPending);
    setSelectedMember(null);

    alert(`Accreditation approved for ${name}! Registered membership ID is ${newMemberNum}. Billed licensing fee.`);
  };

  const rejectMember = (id: string, name: string) => {
    const updatedPending = pendingMembers.filter(m => m.id !== id);
    store.setPendingMembers(updatedPending);
    setPendingMembers(updatedPending);
    setSelectedMember(null);
    alert(`Rejected registration for ${name}. Notification sent.`);
  };

  const publishLibItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLibTitle.trim()) return;
    const newItem = {
      id: 'LIB-' + Math.floor(101 + Math.random() * 100),
      title: newLibTitle,
      type: newLibType,
      size: '420 KB'
    };
    const updated = [newItem, ...libItems];
    store.setLibItems(updated);
    setLibItems(updated);
    setNewLibTitle('');
    alert('Published new library file to caregiver databases.');
  };

  const publishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    const newAnn = {
      id: 'ANN-' + Math.floor(101 + Math.random() * 900),
      title: annTitle,
      category: annCategory,
      date: new Date().toISOString().split('T')[0],
      content: annContent
    };
    const updated = [newAnn, ...announcements];
    store.setAnnouncements(updated);
    setAnnouncements(updated);
    setAnnTitle('');
    setAnnContent('');
    alert('Published announcement successfully!');
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    store.setAnnouncements(updated);
    setAnnouncements(updated);
    alert('Announcement deleted.');
  };

  const addActivityPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl.trim() || !photoCaption.trim()) return;
    const newPhoto = {
      id: 'PHOTO-' + Math.floor(101 + Math.random() * 900),
      url: photoUrl,
      caption: photoCaption
    };
    const updated = [...activityPhotos, newPhoto];
    store.setActivityPhotos(updated);
    setActivityPhotos(updated);
    setPhotoUrl('');
    setPhotoCaption('');
    alert('Activity photo added to public galleries.');
  };

  const deleteActivityPhoto = (id: string) => {
    const updated = activityPhotos.filter(p => p.id !== id);
    store.setActivityPhotos(updated);
    setActivityPhotos(updated);
    alert('Activity photo removed.');
  };

  return (
    <div className="app-container" style={{ background: '#0b1329' }}>
      {/* Sidebar with Glassmorphic design */}
      <aside className="sidebar" style={{ background: 'rgba(15, 23, 42, 0.9)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="sidebar-logo">
          🛡️ MCSA UNION ADMIN
        </div>
        <ul className="sidebar-menu">
          <li>
            <button 
              onClick={() => setActiveTab('overview')}
              className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Shield size={18} /> Union Overview
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('members')}
              className={`sidebar-link ${activeTab === 'members' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Users size={18} /> Member Audit ({pendingMembers.length})
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('cases')}
              className={`sidebar-link ${activeTab === 'cases' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Briefcase size={18} /> Match Dispatch
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('inquiries')}
              className={`sidebar-link ${activeTab === 'inquiries' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <MessageSquare size={18} /> Client Inquiries
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('library')}
              className={`sidebar-link ${activeTab === 'library' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <BookOpen size={18} /> Library SOPs
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('announcements')}
              className={`sidebar-link ${activeTab === 'announcements' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Megaphone size={18} /> Announcements & Photos
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('escortForms')}
              className={`sidebar-link ${activeTab === 'escortForms' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <FileText size={18} /> Escort Forms
            </button>
          </li>
          <li style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
            <a href="/" className="sidebar-link" style={{ color: '#fca5a5' }}>🚪 Logout Admin</a>
          </li>
        </ul>
      </aside>

      {/* Main Workspace */}
      <main className="workspace animate-fade-in">
        
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Union Status & Operations Dashboard</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Global summary metrics for 10,000+ active scale caregivers.</p>

            {/* Statistics */}
            <div className="grid-cols-3" style={{ marginBottom: '2.5rem' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ padding: '0.85rem', background: 'var(--primary-glow)', borderRadius: '12px', color: 'var(--primary)' }}>
                  <Users size={32} />
                </div>
                <div>
                  <h4 style={{ fontSize: '2rem', margin: 0, color: '#ffffff' }}>10,240</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>Registered Members</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ padding: '0.85rem', background: 'var(--health-glow)', borderRadius: '12px', color: 'var(--health)' }}>
                  <Briefcase size={32} />
                </div>
                <div>
                  <h4 style={{ fontSize: '2rem', margin: 0, color: '#ffffff' }}>3,150</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>Active Dispatches</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ padding: '0.85rem', background: 'var(--accent-glow)', borderRadius: '12px', color: 'var(--accent)' }}>
                  <DollarSign size={32} />
                </div>
                <div>
                  <h4 style={{ fontSize: '2rem', margin: 0, color: '#ffffff' }}>RM 358.4K</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>License Revenues</p>
                </div>
              </div>
            </div>

            {/* System Log Details */}
            <div className="card">
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>⚡ Real-time Operations Event Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(37,99,235,0.03)', borderLeft: '3px solid var(--primary)', borderRadius: '8px', borderTop: '1px solid rgba(255,255,255,0.01)' }}>
                  <strong>[16:42:01] System Auto-Trigger:</strong> New registration received from siti@mcsa.com.my. Vetting queue entry created.
                </div>
                <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(16,185,129,0.03)', borderLeft: '3px solid var(--health)', borderRadius: '8px', borderTop: '1px solid rgba(255,255,255,0.01)' }}>
                  <strong>[16:30:12] Case Match Success:</strong> Companion ID CH-2026-0009 dispatched to patient Grandpa Zhang (Hospital Kuala Lumpur).
                </div>
                <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(245,158,11,0.03)', borderLeft: '3px solid var(--accent)', borderRadius: '8px', borderTop: '1px solid rgba(255,255,255,0.01)' }}>
                  <strong>[16:15:45] Payment Gate Recipient:</strong> Annual fee renewal completed for Caregiver 264. License expiry pushed.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Union Membership Registry Vetting</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Audit qualifications and clearance forms. Click Details to verify medical diagnostics.</p>

            <div className="card" style={{ overflowX: 'auto', padding: '1rem' }}>
              <table style={{ width: '100%', minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Role Category</th>
                    <th>Experience</th>
                    <th>Vetting Attachment</th>
                    <th>Verification Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingMembers.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <strong style={{ color: '#ffffff' }}>{m.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{m.email}</div>
                      </td>
                      <td>
                        <span className="badge badge-pending" style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}>
                          {m.category}
                        </span>
                      </td>
                      <td><strong style={{ color: '#ffffff' }}>{m.exp}</strong></td>
                      <td>
                        <span 
                          onClick={() => { setSelectedMember(m); setDocTab('cert'); }}
                          style={{ textDecoration: 'underline', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          📄 {m.proof}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button 
                          onClick={() => { setSelectedMember(m); setDocTab('cert'); }} 
                          className="btn btn-outline" 
                          style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                        >
                          🔍 Audit Details
                        </button>
                        <button 
                          onClick={() => approveMember(m.id, m.name)} 
                          className="btn btn-primary" 
                          style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', background: 'var(--health)', boxShadow: '0 2px 8px var(--health-glow)' }}
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => rejectMember(m.id, m.name)} 
                          className="btn btn-outline" 
                          style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                        >
                          <X size={14} /> Decline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Match Dispatch & Case Assignments</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Match incoming case requests to vetted, verified caregivers.</p>

            <div className="grid-cols-2">
              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>Active Dispatched Assignments</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '12px', background: 'rgba(30,41,59,0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <strong style={{ color: '#ffffff', fontSize: '1.05rem' }}>Grandpa Zhang (Chronic Care)</strong>
                      <span className="badge badge-active">Active Shift</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Assigned Caregiver: Li Xiulan (MCSA-2026-0009)</p>
                  </div>
                  <div style={{ border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '12px', background: 'rgba(30,41,59,0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <strong style={{ color: '#ffffff', fontSize: '1.05rem' }}>Baby Wang & Mom (Confinement)</strong>
                      <span className="badge badge-active">Active Shift</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Assigned Caregiver: Meizhen Chen (MCSA-2026-1112)</p>
                  </div>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Smart Match Suggestion Engine</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    Execute algorithms factoring in hospital coordinates, caregiver specialized categories, and clinical ratings.
                  </p>
                </div>
                <button 
                  onClick={() => alert('Big data algorithm executed. Best matches computed.')} 
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1.5rem', background: 'linear-gradient(135deg, var(--accent) 0%, #d97706 100%)', boxShadow: '0 4px 14px var(--accent-glow)' }}
                >
                  ⚡ Execute Smart Match Recommendation
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Customer Inquiries Logs</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Public feedback submissions tracked from Web homepage footer forms.</p>

            <div className="card" style={{ overflowX: 'auto', padding: '1rem' }}>
              <table style={{ width: '100%', minWidth: '700px' }}>
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Contact Info</th>
                    <th>Message Details</th>
                    <th>Resolution Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq) => (
                    <tr key={inq.id}>
                      <td><strong style={{ color: '#ffffff' }}>{inq.name}</strong></td>
                      <td><span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{inq.contact}</span></td>
                      <td style={{ maxWidth: '300px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>{inq.message}</td>
                      <td>
                        <button 
                          onClick={() => {
                            const updated = inquiries.filter(i => i.id !== inq.id);
                            store.setInquiries(updated);
                            setInquiries(updated);
                            alert('Inquiry marked as solved and archived.');
                          }}
                          className="btn btn-outline" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', borderColor: 'var(--health)', color: 'var(--health)' }}
                        >
                          Resolve & Contact
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Hospital Guidelines & SOP Library</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Publish new floor guides and outpatient routing lists to active caregiver databases.</p>

            <div className="grid-cols-2">
              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>Publish New Guide SOP</h3>
                <form onSubmit={publishLibItem}>
                  <div className="form-group">
                    <label className="form-label">Resource Title</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. Prince Court Medical Map SOP"
                      value={newLibTitle}
                      onChange={(e) => setNewLibTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Format Type</label>
                    <select 
                      className="form-input"
                      style={{ background: 'var(--bg-input)', color: 'white', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}
                      value={newLibType}
                      onChange={(e) => setNewLibType(e.target.value)}
                    >
                      <option value="PDF Document">PDF Document</option>
                      <option value="Image Map">Image Map</option>
                      <option value="Spreadsheet Log">Spreadsheet Log</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    🚀 Publish and Notify Caregivers
                  </button>
                </form>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>Published Resources</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {libItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', padding: '1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.01)' }}>
                      <div>
                        <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{item.title}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{item.type} &bull; {item.size}</div>
                      </div>
                      <button 
                        onClick={() => {
                          const updated = libItems.filter(l => l.id !== item.id);
                          store.setLibItems(updated);
                          setLibItems(updated);
                          alert('Deleted guide.');
                        }}
                        className="btn btn-outline" 
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Announcements & Activities Hub</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Publish new union-wide notifications and register dynamic training activity photos.</p>

            <div className="grid-cols-2">
              {/* Form 1: Announcements */}
              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>Publish Announcement</h3>
                <form onSubmit={publishAnnouncement}>
                  <div className="form-group">
                    <label className="form-label">Announcement Title</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. Mandatory Training Seminar"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      className="form-input"
                      style={{ background: 'var(--bg-input)', color: 'white', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}
                      value={annCategory}
                      onChange={(e) => setAnnCategory(e.target.value)}
                    >
                      <option value="Training">Training</option>
                      <option value="Union News">Union News</option>
                      <option value="General Notification">General Notification</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Content Description</label>
                    <textarea 
                      required 
                      className="form-input" 
                      style={{ minHeight: '100px', resize: 'vertical' }}
                      placeholder="Enter the notice details here..."
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    📢 Publish Announcement
                  </button>
                </form>
              </div>

              {/* Form 2: Activity Photos */}
              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>Add Activity Gallery Photo</h3>
                <form onSubmit={addActivityPhoto}>
                  <div className="form-group">
                    <label className="form-label">Photo Image URL</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. /activity-center.jpg or custom HTTPS URL"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Caption / Description</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. Practical Skills Assessment Room"
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    📸 Add Gallery Image
                  </button>
                </form>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem' }} className="grid-cols-2">
              {/* Display list of announcements */}
              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>Current Published Announcements</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {announcements.map((ann) => (
                    <div key={ann.id} style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: '#ffffff', fontSize: '0.95rem', display: 'block' }}>{ann.title}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{ann.category} &bull; {ann.date}</div>
                        </div>
                        <button 
                          onClick={() => deleteAnnouncement(ann.id)}
                          className="btn btn-outline" 
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)', flexShrink: 0 }}
                        >
                          Delete
                        </button>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Display list of activity photos */}
              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>Current Gallery Photos</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                  {activityPhotos.map((photo) => (
                    <div key={photo.id} style={{ border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ width: '100%', height: '80px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#1e293b' }}>
                        <img src={photo.url} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {photo.caption}
                      </span>
                      <button 
                        onClick={() => deleteActivityPhoto(photo.id)}
                        className="btn btn-outline" 
                        style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem', borderColor: 'var(--danger)', color: 'var(--danger)', width: '100%', marginTop: 'auto' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'escortForms' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#ffffff' }}>Medical Escort Client Forms Dashboard / 陪诊协议与建档记录</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>View client information sheets and liability agreements submitted by caregivers.</p>

            {selectedEscortForm ? (
              <div>
                <button 
                  onClick={() => setSelectedEscortForm(null)}
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
                      <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent)' }}>{selectedEscortForm.id}</div>
                    </div>
                  </div>

                  <h2 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '2rem', fontFamily: 'Outfit' }}>📝 Medical Escort Service – Client Information Form</h2>

                  {/* Section 1 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>1. Personal Information / 个人信息</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>Full Name / 姓名:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.fullName}</span></div>
                      <div><strong>Gender / 性别:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.gender}</span></div>
                      <div><strong>Date of Birth / 出生日期:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.dob || 'N/A'}</span></div>
                      <div><strong>NRIC or Passport / 证件号:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.nric}</span></div>
                      <div><strong>Contact Number / 电话:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.phone || 'N/A'}</span></div>
                      <div><strong>Home Address / 地址:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.address || 'N/A'}</span></div>
                      <div><strong>Emergency Contact / 紧急联系人:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.emergencyName || 'N/A'}</span></div>
                      <div><strong>Emergency Phone / 联系电话:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.emergencyPhone || 'N/A'}</span></div>
                      <div><strong>Relationship / 关系:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.relationship || 'N/A'}</span></div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>2. Escort Service Details / 陪诊服务详情</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>Appointment Date / 就诊日期:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.appointmentDate || 'N/A'}</span></div>
                      <div><strong>Appointment Time / 就诊时间:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.appointmentTime || 'N/A'}</span></div>
                      <div><strong>Medical Facility / 就诊医院:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.facility || 'N/A'}</span></div>
                      <div><strong>Doctor Name / 医生姓名:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.doctor || 'N/A'}</span></div>
                      <div><strong>Department or Specialty / 科室:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.specialty || 'N/A'}</span></div>
                      <div><strong>Admin Tasks Required / 协助取药/付款/登记:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.assistanceRequired ? 'Yes / 是' : 'No / 否'}</span></div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>3. Health & Medical History / 健康与既往病史</h4>
                    <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div><strong>Main Complaint / 就诊主诉:</strong> <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: '0.25rem 0 0 0' }}>{selectedEscortForm.complaint || 'N/A'}</p></div>
                      <div>
                        <strong>Past Medical History / 既往病史:</strong>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                          {selectedEscortForm.pastHistory && selectedEscortForm.pastHistory.length > 0 ? (
                            selectedEscortForm.pastHistory.map((h: string, i: number) => (
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
                      <div><strong>Drug Allergies / 药物过敏:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.drugAllergy}</span></div>
                      <div><strong>Food Allergies / 食物过敏:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.foodAllergy}</span></div>
                      <div><strong>Other Allergies / 其他过敏:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.otherAllergy}</span></div>
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>5. Current Medication / 当前用药情况</h4>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>Taking medications or supplements / 是否正在服药:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.takingMeds ? 'Yes / 是' : 'No / 否'}</span>
                      {selectedEscortForm.takingMeds && (
                        <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: '0.4rem 0 0 0', whiteSpace: 'pre-wrap' }}>{selectedEscortForm.medsList}</p>
                      )}
                    </div>
                  </div>

                  {/* Section 6 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>6. Surgical History / 手术史</h4>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>History of surgeries or procedures / 手术史:</strong>
                      <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: '0.4rem 0 0 0' }}>{selectedEscortForm.surgicalHistory || 'No / 无'}</p>
                    </div>
                  </div>

                  {/* Section 7 */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>7. Functional & Mobility Assessment / 行动与感官功能评估</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>Mobility Difficulty / 行动评估:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.mobility}</span></div>
                      <div><strong>Hearing Difficulties / 听力困难:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.hearingDifficulty ? 'Yes / 有' : 'No / 无'}</span></div>
                      <div><strong>Speech Difficulties / 语言困难:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.speechDifficulty ? 'Yes / 有' : 'No / 无'}</span></div>
                      <div><strong>Visual Impairment / 视力受损情况:</strong> <span style={{ color: '#ffffff' }}>{selectedEscortForm.visualImpairment || 'No / 无'}</span></div>
                    </div>
                  </div>

                  {/* Section 8 */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{ color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>8. Additional Information / 额外备注</h4>
                    <p style={{ color: '#ffffff', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', margin: 0 }}>{selectedEscortForm.additionalInfo || 'None / 无'}</p>
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
                          ✍️ {selectedEscortForm.clientSigned}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed Date / 签署日期: {selectedEscortForm.signedDate}</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Escort Service Provider / 陪诊师</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#60a5fa', margin: '0.9rem 0' }}>
                          🛡️ Verified Caregiver Escort
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status / 执照状态: Active Licensed Vetted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '700px' }}>
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Appointment Date</th>
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
                            onClick={() => setSelectedEscortForm(f)}
                            className="btn btn-outline"
                            style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                          >
                            🔍 View Details & Agreement
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Member Credential Vetting Modal Overlay */}
      {selectedMember && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(11, 19, 41, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            width: '92%',
            maxWidth: '1120px',
            height: '85vh',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 2rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-sidebar)',
              color: '#ffffff'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Shield size={22} style={{
                  color: 'var(--accent)'
                }} />
                <div>
                  <h3 style={{
                    margin: 0,
                    color: '#ffffff',
                    fontSize: '1.25rem',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    Member Credential Audit Panel / 成员资质核审面板
                  </h3>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}>
                    Application ID: {selectedMember.id} &bull; Received via MCSA API Vetting Queue
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content - Split Layout */}
            <div style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden'
            }}>
              {/* Left Side: Applicant Summary (35%) */}
              <div style={{
                width: '35%',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                padding: '2rem 1.5rem',
                overflowY: 'auto',
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                {/* Avatar and Badge */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
                    border: '2px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedMember.photo ? (
                      <img 
                        src={selectedMember.photo} 
                        alt={selectedMember.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'white' }}>
                        {selectedMember.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      color: '#ffffff',
                      margin: 0
                    }}>{selectedMember.name}</h4>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      margin: '0.2rem 0 0 0'
                    }}>{selectedMember.email}</p>
                  </div>
                  <span className="badge badge-pending" style={{
                    padding: '0.4rem 0.95rem',
                    borderRadius: '20px',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}>
                    {selectedMember.category === 'Confinement Care' && 'Confinement Care / 月嫂'}
                    {selectedMember.category === 'Patient Companion' && 'Patient Companion / 陪诊员'}
                    {selectedMember.category === 'Elderly Caregiver' && 'Elderly Caregiver / 养老护理员'}
                    {selectedMember.category === 'Rehabilitation Care Assistant' && 'Rehabilitation Care Assistant / 康复助理'}
                  </span>
                </div>

                <hr style={{
                  border: '0',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  margin: '0.5rem 0'
                }} />

                {/* Quick Metrics */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  fontSize: '0.9rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      color: 'var(--text-muted)'
                    }}>Experience:</span>
                    <strong style={{
                      color: '#ffffff'
                    }}>{selectedMember.exp}</strong>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      color: 'var(--text-muted)'
                    }}>Location:</span>
                    <strong style={{
                      color: '#ffffff',
                      textAlign: 'right'
                    }}>{selectedMember.location}</strong>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      color: 'var(--text-muted)'
                    }}>Phone:</span>
                    <strong style={{
                      color: '#ffffff'
                    }}>{selectedMember.phone}</strong>
                  </div>
                </div>

                <hr style={{
                  border: '0',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  margin: '0.5rem 0'
                }} />

                {/* Biography */}
                <div>
                  <h5 style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Applicant Statement / 申请陈述
                  </h5>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    lineHeight: '1.5',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.04)',
                    margin: 0
                  }}>
                    "{selectedMember.bio}"
                  </p>
                </div>

                {/* Vetting Checklist */}
                <div style={{
                  marginTop: 'auto'
                }}>
                  <h5 style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Vetting Verification Checklist / 核审清单
                  </h5>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--health)'
                    }}>
                      <CheckCircle2 size={16} /> <span>Identity / NRIC Match Verified</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: docTab === 'cert' ? 'var(--accent)' : 'var(--health)'
                    }}>
                      {docTab === 'cert' ? <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid var(--accent)',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}></span> : <CheckCircle2 size={16} />}
                      <span>Professional Qualification Audited</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: docTab === 'health' ? 'var(--accent)' : 'var(--health)'
                    }}>
                      {docTab === 'health' ? <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid var(--accent)',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}></span> : <CheckCircle2 size={16} />}
                      <span>Health & TB Vetting Vouching</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Document Preview (65%) */}
              <div style={{
                width: '65%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: '#111827'
              }}>
                {/* Tab Selector */}
                <div style={{
                  display: 'flex',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  padding: '0.5rem 1rem 0 1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <button
                    onClick={() => setDocTab('cert')}
                    style={{
                      padding: '0.85rem 1.5rem',
                      border: 'none',
                      background: docTab === 'cert' ? 'var(--bg-card)' : 'transparent',
                      borderRadius: '12px 12px 0 0',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: docTab === 'cert' ? '#ffffff' : 'var(--text-muted)',
                      cursor: 'pointer',
                      borderTop: docTab === 'cert' ? '3px solid var(--primary)' : '3px solid transparent',
                      marginTop: '-3px',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    📜 Qualification Certificate ({selectedMember.proof})
                  </button>
                  <button
                    onClick={() => setDocTab('health')}
                    style={{
                      padding: '0.85rem 1.5rem',
                      border: 'none',
                      background: docTab === 'health' ? 'var(--bg-card)' : 'transparent',
                      borderRadius: '12px 12px 0 0',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: docTab === 'health' ? '#ffffff' : 'var(--text-muted)',
                      cursor: 'pointer',
                      borderTop: docTab === 'health' ? '3px solid var(--primary)' : '3px solid transparent',
                      marginTop: '-3px',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    🏥 Health Clearance ({selectedMember.healthCert})
                  </button>
                </div>

                {/* Tab Content Box */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '2.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start'
                }}>
                  {docTab === 'cert' ? (
                    /* Professional Certificate CSS Render */
                    <div style={{
                      width: '100%',
                      maxWidth: '640px',
                      background: 'linear-gradient(135deg, #fdfbf7 0%, #f6f1e5 100%)',
                      border: '15px double #c5a880',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                      padding: '3rem 2rem',
                      borderRadius: '8px',
                      position: 'relative',
                      textAlign: 'center',
                      color: '#3e2723',
                      fontFamily: 'Outfit, Georgia, serif'
                    }}>
                      {/* Vintage Corner Accents */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '2px solid #c5a880', borderLeft: '2px solid #c5a880' }}></div>
                      <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderTop: '2px solid #c5a880', borderRight: '2px solid #c5a880' }}></div>
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '20px', borderBottom: '2px solid #c5a880', borderLeft: '2px solid #c5a880' }}></div>
                      <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderBottom: '2px solid #c5a880', borderRight: '2px solid #c5a880' }}></div>

                      {/* Ribbon Logo */}
                      <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#c5a880' }}>🏅</div>

                      <h4 style={{
                        fontSize: '1.1rem',
                        letterSpacing: '0.1em',
                        color: '#5d4037',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        margin: '0 0 0.5rem 0',
                        fontFamily: 'Outfit, sans-serif'
                      }}>
                        Malaysia Care & Confinement Board
                      </h4>
                      <p style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.05em',
                        color: '#8d6e63',
                        fontStyle: 'italic',
                        margin: '0 0 2rem 0'
                      }}>
                        Accredited Caregiver Guild of MultiCare Support Malaysia Union
                      </p>

                      <h2 style={{
                        fontSize: '1.8rem',
                        color: '#3e2723',
                        fontWeight: 'bold',
                        margin: '0 0 1rem 0',
                        fontFamily: 'Outfit, sans-serif'
                      }}>
                        Certificate of Competency
                      </h2>
                      
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#5d4037',
                        margin: '0 0 1.5rem 0'
                      }}>
                        This professional qualification is awarded to
                      </p>

                      <h3 style={{
                        fontSize: '1.6rem',
                        fontFamily: 'Georgia, serif',
                        textDecoration: 'underline',
                        color: '#1e3a8a',
                        margin: '0 0 1.5rem 0',
                        fontWeight: 'bold'
                      }}>
                        {selectedMember.name}
                      </h3>

                      <p style={{
                        fontSize: '0.85rem',
                        lineHeight: '1.6',
                        color: '#5d4037',
                        maxWidth: '480px',
                        margin: '0 auto 2rem auto'
                      }}>
                        having demonstrated exceptional knowledge, compliance, and clinical hours in:
                        <br />
                        <strong style={{
                          color: '#1e3a8a',
                          fontSize: '1.05rem'
                        }}>
                          {selectedMember.category === 'Confinement Care' && 'Confinement Care & Neonatal Support (月嫂)'}
                          {selectedMember.category === 'Patient Companion' && 'Patient Medical Accompaniment & Clinic Protocol (陪诊人员)'}
                          {selectedMember.category === 'Elderly Caregiver' && 'Geriatric Support & Elder Care Management (养老护理人员)'}
                          {selectedMember.category === 'Rehabilitation Care Assistant' && 'Rehabilitation Care Assistant (康复助理)'}
                        </strong>
                        <br />
                        and meeting all training milestones required by MCSA Union policies.
                      </p>

                      {/* Footer of Certificate */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '1.5rem',
                        padding: '0 1rem'
                      }}>
                        <div style={{
                          textAlign: 'left'
                        }}>
                          <div style={{
                            fontSize: '0.8rem',
                            fontFamily: 'Georgia, serif',
                            fontStyle: 'italic',
                            textDecoration: 'underline'
                          }}>Dr. Raymond Chen</div>
                          <div style={{
                            fontSize: '0.65rem',
                            color: '#8d6e63'
                          }}>Guild Registry Director</div>
                        </div>

                        {/* Red Gold Seal */}
                        <div style={{
                          width: '75px',
                          height: '75px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, #e53935 0%, #b71c1c 100%)',
                          border: '3px dotted #c5a880',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#c5a880',
                          fontSize: '0.55rem',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                          transform: 'rotate(-5deg)'
                        }}>
                          <span>MCSA</span>
                          <span>VERIFIED</span>
                          <span style={{
                            fontSize: '0.45rem'
                          }}>2026</span>
                        </div>

                        <div style={{
                          textAlign: 'right'
                        }}>
                          <div style={{
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}>MCSA-GP-{selectedMember.id}</div>
                          <div style={{
                            fontSize: '0.65rem',
                            color: '#8d6e63'
                          }}>License Expiry: May 2027</div>
                        </div>
                      </div>

                      {/* Audit Overlay Stamp */}
                      <div style={{
                        position: 'absolute',
                        top: '15%',
                        right: '10%',
                        border: '4px solid #2e7d32',
                        color: '#2e7d32',
                        padding: '0.5rem 1rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        transform: 'rotate(15deg)',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(232, 245, 233, 0.85)',
                        pointerEvents: 'none'
                      }}>
                        ✅ CREDENTIAL MATCH
                      </div>
                    </div>
                  ) : (
                    /* Health Screening Report CSS Render */
                    <div style={{
                      width: '100%',
                      maxWidth: '640px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                      padding: '2.5rem 2rem',
                      borderRadius: '8px',
                      color: '#1e293b',
                      fontFamily: 'monospace, Courier, monospace'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '2px solid #0284c7',
                        paddingBottom: '1rem',
                        marginBottom: '1.5rem'
                      }}>
                        <div>
                          <h3 style={{
                            margin: 0,
                            color: '#0284c7',
                            fontFamily: 'monospace',
                            fontSize: '1.1rem',
                            fontWeight: 'bold'
                          }}>
                            🏥 CLINICAL HEALTH AUDIT SHEET
                          </h3>
                          <p style={{
                            margin: 0,
                            fontSize: '0.7rem',
                            color: '#64748b'
                          }}>
                            Poliklinik & Surgeri Union-Cares Group Malaysia
                          </p>
                        </div>
                        <div style={{
                          textAlign: 'right',
                          fontSize: '0.7rem',
                          color: '#64748b'
                        }}>
                          <div>Report Ref: HSR-2026-{selectedMember.id}</div>
                          <div>Date: 12th May 2026</div>
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        fontSize: '0.8rem',
                        marginBottom: '1.5rem',
                        backgroundColor: '#f8fafc',
                        padding: '0.75rem',
                        borderRadius: '6px'
                      }}>
                        <div><strong>Patient Name:</strong> {selectedMember.name}</div>
                        <div><strong>Application Cat:</strong> {selectedMember.category}</div>
                        <div><strong>Vetting Protocol:</strong> MCSA Guild Form 4B</div>
                        <div><strong>Status:</strong> COMPLETED & VOUCHED</div>
                      </div>

                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.8rem',
                        marginBottom: '2rem'
                      }}>
                        <thead>
                          <tr style={{
                            borderBottom: '2px solid #cbd5e1',
                            color: '#64748b'
                          }}>
                            <th style={{
                              textAlign: 'left',
                              padding: '0.5rem 0'
                            }}>SCREENING PROTOCOL PANEL</th>
                            <th style={{
                              textAlign: 'center',
                              padding: '0.5rem 0'
                            }}>RESULT</th>
                            <th style={{
                              textAlign: 'right',
                              padding: '0.5rem 0'
                            }}>VETTING STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{
                            borderBottom: '1px solid #f1f5f9'
                          }}>
                            <td style={{
                              padding: '0.75rem 0'
                            }}>1. Chest X-Ray (Tuberculosis Screening)</td>
                            <td style={{
                              textAlign: 'center',
                              color: '#15803d',
                              fontWeight: 'bold'
                            }}>CLEAR</td>
                            <td style={{
                              textAlign: 'right',
                              color: '#15803d'
                            }}>PASS &bull; Negative TB</td>
                          </tr>
                          <tr style={{
                            borderBottom: '1px solid #f1f5f9'
                          }}>
                            <td style={{
                              padding: '0.75rem 0'
                            }}>2. Hepatitis B Antigen (HBsAg)</td>
                            <td style={{
                              textAlign: 'center',
                              color: '#15803d',
                              fontWeight: 'bold'
                            }}>NON-REACTIVE</td>
                            <td style={{
                              textAlign: 'right',
                              color: '#15803d'
                            }}>PASS &bull; Immunized</td>
                          </tr>
                          <tr style={{
                            borderBottom: '1px solid #f1f5f9'
                          }}>
                            <td style={{
                              padding: '0.75rem 0'
                            }}>3. Typhoid Vaccination Status (Valid to 2029)</td>
                            <td style={{
                              textAlign: 'center',
                              color: '#15803d',
                              fontWeight: 'bold'
                            }}>ACTIVE</td>
                            <td style={{
                              textAlign: 'right',
                              color: '#15803d'
                            }}>PASS &bull; Compliant</td>
                          </tr>
                          <tr style={{
                            borderBottom: '1px solid #f1f5f9'
                          }}>
                            <td style={{
                              padding: '0.75rem 0'
                            }}>4. Physical & Psychiatric Health Assessment</td>
                            <td style={{
                              textAlign: 'center',
                              color: '#15803d',
                              fontWeight: 'bold'
                            }}>NORMAL</td>
                            <td style={{
                              textAlign: 'right',
                              color: '#15803d'
                            }}>PASS &bull; Fit for Care</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Medical Sign-off */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        fontSize: '0.75rem'
                      }}>
                        <div>
                          <div style={{
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#94a3b8'
                          }}>
                            [ Signed digitally: Dr. J. Tan ]
                          </div>
                          <div style={{
                            borderTop: '1px solid #cbd5e1',
                            paddingTop: '0.25rem'
                          }}>
                            <strong>Dr. Jeffrey Tan</strong>
                            <div style={{
                              fontSize: '0.65rem',
                              color: '#64748b'
                            }}>MMC Registered Practitioner #45892</div>
                          </div>
                        </div>
                        
                        <div style={{
                          border: '3px solid #16a34a',
                          color: '#16a34a',
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          borderRadius: '4px',
                          transform: 'rotate(-5deg)',
                          backgroundColor: 'rgba(240, 253, 250, 0.85)'
                        }}>
                          🩺 HEALTH VETTED
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.25rem 2rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-sidebar)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)'
              }}>
                <span>Audited Category:</span>
                <strong style={{
                  color: 'var(--accent)'
                }}>
                  {selectedMember.category === 'Confinement Care' && 'Confinement Care Specialist (月嫂)'}
                  {selectedMember.category === 'Patient Companion' && 'Patient Companion (陪诊员)'}
                  {selectedMember.category === 'Elderly Caregiver' && 'Elderly Caregiver (养老护理员)'}
                  {selectedMember.category === 'Rehabilitation Care Assistant' && 'Rehabilitation Care Assistant (康复助理)'}
                </strong>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '0.75rem'
              }}>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="btn btn-outline"
                  style={{
                    minWidth: '100px',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'var(--text-muted)'
                  }}
                >
                  Close / 关闭
                </button>
                <button 
                  onClick={() => {
                    rejectMember(selectedMember.id, selectedMember.name);
                    setSelectedMember(null);
                  }}
                  className="btn btn-outline"
                  style={{
                    borderColor: 'var(--danger)',
                    color: 'var(--danger)'
                  }}
                >
                  <X size={16} /> Decline / 拒绝
                </button>
                <button 
                  onClick={() => {
                    approveMember(selectedMember.id, selectedMember.name);
                    setSelectedMember(null);
                  }}
                  className="btn btn-primary"
                  style={{
                    background: 'var(--health)',
                    boxShadow: '0 4px 12px var(--health-glow)'
                  }}
                >
                  <Check size={16} /> Approve & Generate MCSA Member ID
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
