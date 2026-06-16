'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { translations, Language } from '@/lib/translations';
import { Calendar, User, Clock, ArrowLeft, Search } from 'lucide-react';

export default function BlogPage() {
  const [lang, setLang] = useState<Language>('en');
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setLang(store.getLanguage() as Language);
    const allPosts = store.getBlogPosts();
    setPosts(allPosts);

    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    if (postId) {
      const post = allPosts.find(p => p.id === postId);
      if (post) {
        setSelectedPost(post);
      }
    }
  }, []);

  const selectArticle = (post: any) => {
    setSelectedPost(post);
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?id=${post.id}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const closeArticle = () => {
    setSelectedPost(null);
    if (typeof window !== 'undefined') {
      const newUrl = window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const t = translations[lang] || translations.en;

  const categories = ['All', 'Caregiver Stories', 'Accreditation News', 'Health Tips'];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = 
      (post.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.snippet || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const parseContent = (content: string) => {
    if (!content) return [];
    const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return normalized.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith('### ')) {
        return <h3 key={index} style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={index} style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>{trimmed.replace('## ', '')}</h2>;
      }
      return <p key={index} style={{ lineHeight: 1.7, color: '#334155', fontSize: '1.02rem', marginBottom: '1.25rem', whiteSpace: 'pre-wrap' }}>{trimmed}</p>;
    }).filter(Boolean);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <Navbar />

      {selectedPost ? (
        /* Dedicated Full-Page Article Reader Layout */
        <article className="animate-fade-in" style={{ padding: '3rem 2rem 6rem 2rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Back Button */}
            <button
              onClick={closeArticle}
              className="btn btn-outline"
              style={{
                marginBottom: '2rem',
                padding: '0.6rem 1.25rem',
                fontSize: '0.88rem',
                borderRadius: '8px',
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} /> {lang === 'zh' ? '返回列表' : 'Back to List'}
            </button>

            {/* Category badge */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="badge badge-active" style={{
                background: selectedPost.category === 'Caregiver Stories' ? 'rgba(16, 185, 129, 0.1)' : selectedPost.category === 'Accreditation News' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: selectedPost.category === 'Caregiver Stories' ? 'var(--health)' : selectedPost.category === 'Accreditation News' ? 'var(--primary)' : 'var(--accent)',
                padding: '0.45rem 1rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700
              }}>
                {selectedPost.category}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '1.5rem'
            }}>
              {selectedPost.title}
            </h1>

            {/* Meta row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              alignItems: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              paddingBottom: '1.75rem',
              borderBottom: '1.5px solid var(--border)',
              marginBottom: '2.5rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#334155' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  color: 'var(--primary)'
                }}>
                  {selectedPost.author.charAt(0)}
                </div>
                {selectedPost.author}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={16} /> {selectedPost.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {selectedPost.readTime}</span>
            </div>

            {/* Cover Image */}
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
              marginBottom: '3rem',
              maxHeight: '450px',
              border: '1px solid var(--border)'
            }}>
              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title}
                style={{ width: '100%', height: '100%', maxHeight: '450px', objectFit: 'cover' }}
              />
            </div>

            {/* Content Body */}
            <div className="blog-content-body" style={{
              fontSize: '1.12rem',
              lineHeight: 1.85,
              color: '#334155',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {parseContent(selectedPost.content)}
            </div>

            {/* Footer with share link */}
            <div style={{
              marginTop: '4rem',
              padding: '2rem',
              borderRadius: '16px',
              background: '#f8fafc',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '1rem' }}>
                  {lang === 'zh' ? '喜欢这篇故事吗？' : 'Liked this story?'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {lang === 'zh' ? '将故事分享给身边需要医疗照护或家政看护的朋友。' : 'Share it with friends or family seeking vetted healthcare companions.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert(lang === 'zh' ? '故事链接已复制到剪贴板！' : 'Story link copied to clipboard!');
                  }}
                  className="btn btn-primary"
                  style={{
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px var(--primary-glow)'
                  }}
                >
                  🔗 {lang === 'zh' ? '复制故事链接' : 'Copy Story Link'}
                </button>
              </div>
            </div>
          </div>
        </article>
      ) : (
        /* Standard Blog Feed List Layout */
        <>
          {/* Hero Header */}
          <section style={{
            padding: '5rem 2rem 4rem 2rem',
            background: 'radial-gradient(circle at top, rgba(10, 186, 181, 0.1) 0%, transparent 60%)',
            textAlign: 'center'
          }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <span className="badge badge-active" style={{ marginBottom: '1rem' }}>
                📰 {lang === 'zh' ? '博客与关怀故事' : lang === 'bm' ? 'Blog & Cerita Penjagaan' : 'Blog & News Feed'}
              </span>
              <h1 style={{ fontSize: '3.2rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif', color: '#0f172a', lineHeight: 1.1 }}>
                {lang === 'zh' ? '见证真实的看护温度' : lang === 'bm' ? 'Kongsi Kisah & Informasi Penjagaan' : 'Sharing Our Care & Stories'}
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                {lang === 'zh'
                  ? '通过在册月嫂、陪诊员和老年护工的真实工作日志与心路历程，了解 MCSA 资质验证在规范照护服务中所传递的安全与温度。'
                  : lang === 'bm'
                  ? 'Ketahui kisah benar daripada penjaga bertauliah, peneman hospital, dan maklumat pengesahan standard penjagaan kesihatan di Malaysia.'
                  : 'Discover real-life experiences of MCSA certified nannies, elderly caregivers, and hospital companions making medical visits and post-op rehabilitation safer.'}
              </p>

              {/* Search & Filter Bar */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '650px',
                margin: '0 auto'
              }}>
                {/* Search Input */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder={lang === 'zh' ? '搜索故事与新闻...' : lang === 'bm' ? 'Cari cerita & berita...' : 'Search articles & news...'}
                    className="form-input"
                    style={{
                      width: '100%',
                      paddingLeft: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: '#ffffff',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      border: '1.5px solid var(--border)'
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Category Filters */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  width: '100%'
                }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '0.45rem 1.15rem',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: 'none',
                        background: selectedCategory === cat ? 'var(--primary)' : 'rgba(10, 186, 181, 0.05)',
                        color: selectedCategory === cat ? '#ffffff' : '#088c87',
                        boxShadow: selectedCategory === cat ? '0 4px 12px var(--primary-glow)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      {cat === 'All' ? (lang === 'zh' ? '全部所有' : 'All') : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Blog Post List */}
          <section style={{ padding: '0 2rem 6rem 2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {filteredPosts.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '5rem 2rem',
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid var(--border)'
                }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
                  <h3 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>{lang === 'zh' ? '未找到相关故事文章' : 'No articles found'}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{lang === 'zh' ? '换个搜索关键词或切换分类试试吧' : 'Try searching different keywords or categories.'}</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '2.5rem'
                }}>
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="card animate-fade-in"
                      onClick={() => selectArticle(post)}
                      style={{
                        padding: 0,
                        margin: 0,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'transform 0.25s, box-shadow 0.25s',
                        background: '#ffffff',
                        border: '1px solid var(--border)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(10, 186, 181, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
                      }}
                    >
                      {/* Cover Image */}
                      <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={post.coverImage || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&h=400&fit=crop'}
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'rgba(10, 186, 181, 0.9)',
                          color: '#ffffff',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 'bold',
                          backdropFilter: 'blur(4px)'
                        }}>
                          {post.category}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: '1.75rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          {/* Meta info row */}
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> {post.date}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {post.readTime}</span>
                          </div>
                          <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            color: '#0f172a',
                            lineHeight: 1.3,
                            marginBottom: '0.75rem',
                            fontFamily: 'Outfit, sans-serif'
                          }}>
                            {post.title}
                          </h3>
                          <p style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.5,
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: '3',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {post.snippet}
                          </p>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '1.5rem',
                          paddingTop: '1rem',
                          borderTop: '1px solid var(--border)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: 'var(--primary-glow)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              color: 'var(--primary)'
                            }}>
                              {post.author.charAt(0)}
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>{post.author}</span>
                          </div>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            {lang === 'zh' ? '阅读全文 ➔' : 'Read More ➔'}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
