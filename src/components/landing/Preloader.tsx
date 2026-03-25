import React, { useEffect, useState } from 'react';
import './Preloader.css';

export function Preloader({ isFinished }: { isFinished: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isFinished) {
      const timer = setTimeout(() => setHidden(true), 600); // Wait for fade out
      return () => clearTimeout(timer);
    }
  }, [isFinished]);

  if (hidden) return null;

  return (
    <div className={`preloader-overlay ${mounted ? 'active' : ''} ${isFinished ? 'fade-out' : ''}`}>
      <div className="resume-loader-container">
        
        {/* Animated Resume Document */}
        <div className="resume-document-anim">
          <div className="ats-badge-skeleton">100% ATS</div>
          
          <div className="resume-header-anim">
            <div className="resume-avatar-skeleton"></div>
            <div className="resume-title-skeleton">
              <div className="line title-line-1 gradient"></div>
              <div className="line title-line-2"></div>
            </div>
          </div>
          
          <div className="resume-body-skeleton">
            <div className="line body-line-1"></div>
            <div className="line body-line-2"></div>
            <div className="line body-line-3"></div>
            <div className="line body-line-4"></div>
            <div className="section-gap"></div>
            <div className="line body-line-5"></div>
            <div className="line body-line-6"></div>
          </div>

          <div className="scanner-line"></div>
        </div>

        {/* Text Area */}
        <h1 className="resume-loading-text">
          <span>Crafting </span>
          <span className="brand-text">Resume...</span>
        </h1>
      </div>
    </div>
  );
}
