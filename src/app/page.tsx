'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingSections } from '@/components/landing/LandingSections';
import { LandingBottom } from '@/components/landing/LandingBottom';
import { AuthModal } from '@/components/landing/AuthModal';
import { Preloader } from '@/components/landing/Preloader';
import './landing.css';

export default function LandingPage() {
  const [isPreloading, setIsPreloading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'login' | 'signup'>('login');
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  // Minimum display timer for the preloader animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // If user is already logged in, redirect to builder
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/builder');
    }
  }, [user, isUserLoading, router]);

  const openModal = (type: 'login' | 'signup') => {
    setModalTab(type);
    setModalOpen(true);
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setModalOpen(false);
      router.push('/builder');
    } catch (error: any) {
      console.error('Google login error:', error);
      alert(error.message || 'Login failed');
    }
  };

  const handleEmailLogin = async (email: string, password: string) => {
    if (!auth || !email || !password) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setModalOpen(false);
      router.push('/builder');
    } catch (error: any) {
      console.error('Email login error:', error);
      alert(error.message || 'Login failed');
    }
  };

  const handleEmailSignup = async (name: string, email: string, password: string) => {
    if (!auth || !email || !password) return;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setModalOpen(false);
      router.push('/builder');
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.message || 'Signup failed');
    }
  };

  // Show attractive preloader while checking auth or during intro
  if (isPreloading || isUserLoading) {
    return <Preloader />;
  }

  // If user is logged in, don't show landing (redirect will happen)
  if (user) return null;

  return (
    <div>
      <LandingNav onOpenModal={openModal} />
      <LandingHero onOpenModal={openModal} />
      <LandingSections onOpenModal={openModal} />
      <LandingBottom onOpenModal={openModal} />
      <AuthModal
        isOpen={modalOpen}
        activeTab={modalTab}
        onClose={() => setModalOpen(false)}
        onSwitchTab={setModalTab}
        onGoogleLogin={handleGoogleLogin}
        onEmailLogin={handleEmailLogin}
        onEmailSignup={handleEmailSignup}
      />
    </div>
  );
}
