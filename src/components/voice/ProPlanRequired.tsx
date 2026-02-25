import React from "react";
import Navbar from "../Navbar";
import { Mic, Tag } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

const ProPlanRequired = () => {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 pt-24">
          <div className="mb-11 overflow-hidden">
            <div className="flex items-center justify-between bg-linear-to-br from-primary/10 to-background rounded-3xl p-8 border border-primary/20">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-primary">Pro Feature</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-3">
                    Voice Assistant Access Required
                  </h1>
                  <p className="text-muted-foreground">
                    Upgrade to AI Pro or AI Basic to unlock unlimited voice
                    consultations with our AI dental assistant.
                  </p>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-33 h-33 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Mic className="text-primary size-16" />
                </div>
              </div>
            </div>
          </div>
          <Card className="max-w-2xl mx-auto group hover:border-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
            <CardHeader>
              <div className="flex items-center flex-col gap-6">
                <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-3xl size-25 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mic className="text-primary size-10" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-3">Upgrade Required</h3>
                  <p className="text-muted-foreground mb-1">
                    The voice assistant feature is available to AI Pro and AI
                    Basic subscribers. Get instant dental advice through natural
                    voice conversations.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm">Upgrade to AI Pro or AI Basic</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm">Upgrade to AI Pro or AI Basic</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm">Upgrade to AI Pro or AI Basic</span>
                </div>
                <Link href={"/pro"}>
                  <Button
                    variant={"default"}
                    className="flex items-center gap-3 w-full cursor-pointer text-white"
                  >
                    <Tag className="size-5" />
                    <span>Upgrade to pro</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProPlanRequired;
