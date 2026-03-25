import React, { useEffect, useState } from 'react';
import './Preloader.css';

export function Preloader() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`preloader-overlay ${mounted ? 'active' : ''}`}>
      <div className="preloader-content">
        <div className="brand-logo-anim">
          R
        </div>
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
        <div className="loading-text">
          L O A D I N G
          <span className="dot-1">.</span>
          <span className="dot-2">.</span>
          <span className="dot-3">.</span>
        </div>
      </div>
    </div>
  );
}
