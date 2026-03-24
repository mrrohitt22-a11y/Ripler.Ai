import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#1A1A2E] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#E8EAF0]">
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-4 hover:bg-[#EEF2FF] hover:text-[#3B5BDB]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-6 font-['Sora'] text-[#1A1A2E]">Refund Policy</h1>
        <div className="space-y-5 text-[0.95rem] leading-relaxed text-[#5C5F77]">
          <p><strong>Last Updated:</strong> March 2026</p>
          <p>We want you to be completely satisfied with Ripler and the resumes you create.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">1. Free Usage</h2>
          <p>Creating your account, formatting basic templates, and standard PDF downloads is entirely free. You will never be charged a hidden fee.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">2. Premium Subscriptions</h2>
          <p>If you purchase a Premium plan for unlimited AI generations and advanced templates, we believe in a fair money-back policy. If you are not satisfied with your purchase, you may request a refund within <strong>7 days</strong> of the original transaction date.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">3. How to Request a Refund</h2>
          <p>To request a refund, please send an email to <strong>billing@ripler.ai</strong> with your account email address and brief feedback on why you are dissatisfied. We will process your return within 5-7 business days.</p>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">4. Account Status After Refund</h2>
          <p>If a refund is processed, your account will be downgraded to the standard free tier immediately. Any resumes configured with premium features will remain in your dashboard but cannot be downloaded without subscribing again or removing premium elements.</p>
        </div>
      </div>
    </div>
  );
}
