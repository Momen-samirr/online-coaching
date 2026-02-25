import { SignUpButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "../ui/button";
import { CheckCircleIcon } from "lucide-react";

const PricingCards = () => {
  return (
    <>
      {/* Free Plan */}
      <div className="relative">
        <div className="relative bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl rounded-3xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Free</h3>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground text-sm mb-1">
                  /month
                </span>
              </div>
              <p className="text-muted-foreground">
                Essential dental appointment booking
              </p>
            </div>
            <SignUpButton mode="modal">
              <Button className="w-full py-3 bg-gradient-to-r from-muted to-muted/80 text-foreground rounded-xl font-semibold">
                Get Started
              </Button>
            </SignUpButton>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Unlimited appointment booking</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Find dentists in your area</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Basic text chat support</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Appointment reminders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pro Plan */}
      <div className="relative">
        <div className="absolute -top-8 left-1/2 z-20 transform -translate-x-1/2 ">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full px-5 py-2 text-xs font-semibold">
            Most Popular
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-card/95 to-card/70 backdrop-blur-xl rounded-3xl p-8 border-2 border-primary/30 hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/20 scale-105">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">AI Basic</h3>
              <div className="flex items-end gap-1">
                <span className="text-4xl text-primary font-bold">$9</span>
                <span className="text-muted-foreground text-sm mb-1">
                  /month
                </span>
              </div>
              <p className="text-muted-foreground">
                AI consultations + appointment booking
              </p>
            </div>
            <Button className="bg-gradient-to-r py-3 cursor-pointer w-full from-primary to-primary/80 text-foreground rounded-full font-semibold">
              Get Started
            </Button>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Everything in Free</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">10 AI voice calls per month</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">AI dental guidance & advice</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Symptom assessment</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Priority support</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Call history & recordings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* AI Pro */}
      <div className="relative">
        <div className="relative bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl rounded-3xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/10">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">AI Pro</h3>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground text-xs mb-1">
                  /month
                </span>
              </div>
              <p className="text-muted-foreground">
                Unlimited AI consultations
              </p>
            </div>
            <SignUpButton mode="modal">
              <Button className="w-full py-3 bg-gradient-to-r from-muted to-muted/80 text-foreground rounded-xl font-semibold">
                Upgrade to AI Pro
              </Button>
            </SignUpButton>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Everything in AI Basic</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Unlimited AI voice calls</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Advanced AI dental analysis</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Personalized care plans</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">24/7 priority AI support</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">Detailed health reports</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingCards;
