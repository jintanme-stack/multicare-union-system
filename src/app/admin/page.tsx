'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Users, Briefcase, DollarSign, BookOpen, MessageSquare, Check, X, Award, FileText, Send, CheckCircle2, AlertCircle, Megaphone } from 'lucide-react';
import { store } from '@/lib/store';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'cases' | 'inquiries' | 'library' | 'announcements'>('overview');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [docTab, setDocTab] = useState<'cert' | 'health'>('cert');
  
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
