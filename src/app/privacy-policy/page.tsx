import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#1A1A2E] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#E8EAF0]">
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-4 hover:bg-[#EEF2FF] hover:text-[#3B5BDB]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-6 font-['Sora'] text-[#1A1A2E]">Privacy Policy</h1>
        <div className="space-y-5 text-[0.95rem] leading-relaxed text-[#5C5F77]">
          <p><strong>Last Updated:</strong> March 2026</p>
          <p>At ResumeAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI resume building services.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">1. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise when you contact us. This includes your name, email address, phone number, and professional history that you input into your resume.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">2. How We Use Your Information</h2>
          <p>We use personal information collected via our website for a variety of business purposes, such as preparing and rendering your resumes, providing customer support, enforcing our terms of service, and analyzing site usage to enhance the user experience.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">3. Third-Party Services and AI</h2>
          <p>We may share your data with trusted third-party service providers who assist us in operating our website, conducting our business, or providing AI analysis of your resume. Your resume data is temporarily processed by our AI partners solely to generate content improvements for you, and we strictly instruct them not to use your personal data to train their models without permission.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">4. Security of Your Information</h2>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">5. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us at <strong>privacy@resumeai.in</strong>.</p>
        </div>
      </div>
    </div>
  );
}
