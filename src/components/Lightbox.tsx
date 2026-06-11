'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface Photo {
  url: string;
  caption?: string;
}

interface LightboxProps {
  isOpen: boolean;
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export default function Lightbox({
  isOpen,
  photos,
  currentIndex,
  onClose,
  onChangeIndex,
}: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Reset zoom and rotation when current image changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
  }, [currentIndex]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) {
        onChangeIndex(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onChangeIndex(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, photos.length, onClose, onChangeIndex]);

  if (!isOpen || !photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];
  if (!currentPhoto) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onChangeIndex(currentIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < photos.length - 1) {
      onChangeIndex(currentIndex + 1);
    }
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(11, 19, 41, 0.95)',
        backdropFilter: 'blur(16px)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        userSelect: 'none',
      }}
    >
      {/* Top Bar with Toolbar controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '2rem',
          right: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#ffffff',
          zIndex: 100,
        }}
      >
        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
          {currentIndex + 1} / {photos.length}
        </div>
        
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            style={{
              background: 'none',
              border: 'none',
              color: zoom <= 0.5 ? 'rgba(255,255,255,0.2)' : '#ffffff',
              cursor: zoom <= 0.5 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <span style={{ fontSize: '0.82rem', minWidth: '40px', textAlign: 'center', color: '#ffffff', fontWeight: 600 }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            style={{
              background: 'none',
              border: 'none',
              color: zoom >= 3 ? 'rgba(255,255,255,0.2)' : '#ffffff',
              cursor: zoom >= 3 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <button
            onClick={handleRotate}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Rotate"
          >
            <RotateCw size={18} />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          title="Close (Esc)"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Navigation Left */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '1rem',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              zIndex: 10,
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Previous (Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* The Image */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '90%',
            maxHeight: '90%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease-out',
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
          }}
        >
          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption || 'Full view'}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          />
        </div>

        {/* Navigation Right */}
        {currentIndex < photos.length - 1 && (
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '1rem',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              zIndex: 10,
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Next (Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Caption & Bottom Indicator */}
      {currentPhoto.caption && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1rem 2rem',
            borderRadius: '12px',
            color: '#ffffff',
            maxWidth: '600px',
            textAlign: 'center',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          {currentPhoto.caption}
        </div>
      )}
    </div>
  );
}
