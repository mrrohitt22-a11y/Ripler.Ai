import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#1A1A2E] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#E8EAF0]">
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-4 hover:bg-[#EEF2FF] hover:text-[#3B5BDB]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-6 font-['Sora'] text-[#1A1A2E]">Cookie Policy</h1>
        <div className="space-y-5 text-[0.95rem] leading-relaxed text-[#5C5F77]">
          <p><strong>Last Updated:</strong> March 2026</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">1. What are Cookies?</h2>
          <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">2. How We Use Cookies</h2>
          <p>ResumeAI uses cookies to enhance your experience. Specifically, we use them for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Authentication:</strong> To keep you logged in to your account securely.</li>
            <li><strong>Preferences:</strong> To remember your site preferences, like light/dark mode or font sizes.</li>
            <li><strong>Analytics:</strong> To understand how visitors interact with our site so we can make improvements.</li>
          </ul>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">3. Managing Cookies</h2>
          <p>You can control and manage cookies through your browser settings. Please note that removing or blocking cookies can impact your user experience, and parts of the ResumeAI service (like keeping you logged in) may no longer fully function.</p>
        </div>
      </div>
    </div>
  );
}
