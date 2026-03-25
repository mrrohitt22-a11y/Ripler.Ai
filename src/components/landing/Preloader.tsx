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
      <div className="welcome-content">
        <div className="welcome-logo-container">
          <div className="welcome-logo">R</div>
        </div>
        <h1 className="welcome-text">
          <span>Welcome to </span>
          <span className="brand-text">Ripler.Ai</span>
        </h1>
      </div>
    </div>
  );
}
