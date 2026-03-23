
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowLeft, Sparkles, Crown } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for a quick professional start.",
    features: ["1 Basic Resume Template", "Standard PDF Download", "Manual Spacing Control", "Community Support"],
    cta: "Start for Free",
    variant: "outline"
  },
  {
    name: "Pro",
    price: "$12",
    description: "Best for active job seekers.",
    features: ["All 5+ Templates", "High-Resolution PDF", "AI Writing Assistant", "Unlimited Cloud Saves", "Smart Import (Image/Text)"],
    cta: "Go Pro",
    variant: "default",
    popular: true
  },
  {
    name: "Premium",
    price: "$29",
    description: "The complete career accelerator.",
    features: ["Everything in Pro", "Custom Branding", "Priority AI Processing", "Multiple Resume Profiles", "Direct Export to LinkedIn"],
    cta: "Get Premium",
    variant: "accent"
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#EDE5DA] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Editor
            </Button>
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-headline font-bold text-[#1A1208] mb-4">Elevate Your Career with ResumeCanvas</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your professional journey. Unlock high-power templates and AI-driven insights to land your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <Card key={plan.name} className={`relative flex flex-col border-2 ${plan.popular ? 'border-[#C9864A] shadow-xl scale-105 z-10' : 'border-transparent'}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C9864A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {plan.name === "Pro" && <Sparkles className="w-5 h-5 text-[#C9864A]" />}
                  {plan.name === "Premium" && <Crown className="w-5 h-5 text-amber-500" />}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${plan.variant === 'accent' ? 'bg-[#B74610] hover:bg-[#8B350C]' : ''}`} 
                  variant={plan.variant as any}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center text-xs text-muted-foreground uppercase tracking-widest opacity-50">
          Trusted by 50,000+ professionals worldwide
        </div>
      </div>
    </div>
  );
}
