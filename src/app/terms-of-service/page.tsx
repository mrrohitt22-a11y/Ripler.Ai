import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#1A1A2E] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#E8EAF0]">
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-4 hover:bg-[#EEF2FF] hover:text-[#3B5BDB]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-6 font-['Sora'] text-[#1A1A2E]">Terms of Service</h1>
        <div className="space-y-5 text-[0.95rem] leading-relaxed text-[#5C5F77]">
          <p><strong>Last Updated:</strong> March 2026</p>
          <p>Welcome to ResumeAI! These terms govern your use of our resume builder website and services. By accessing or using our services, you agree to comply with and be bound by these Terms.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">1. Use of the Services</h2>
          <p>You may use our services for personal, non-commercial purposes to create and manage professional resumes. You agree not to upload any illegal, defamatory, or harmful content into our platform.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">2. Account Registration</h2>
          <p>To use certain features, you must register for an account. It is your responsibility to safeguard your password and account credentials. We reserve the right to suspend or terminate accounts that violate our terms.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">3. Intellectual Property</h2>
          <p>The templates, designs, generated layouts, and software platform are the intellectual property of ResumeAI. The content and text of the resume you generate remain yours.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">4. Disclaimer of Warranties</h2>
          <p>The services are provided "as is" and without warranties of any kind. We do not guarantee that your use of the website will land you a job or interview, although our AI tools are designed to maximize your chances.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">5. Limitation of Liability</h2>
          <p>We shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services.</p>
        </div>
      </div>
    </div>
  );
}
