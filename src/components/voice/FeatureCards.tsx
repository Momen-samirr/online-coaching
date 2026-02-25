import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CalendarIcon, LockIcon, Mic, MicIcon, ShieldIcon } from "lucide-react";

const FeatureCards = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-11">
      <Card className="relative group bg-linear-to-br from-card/90 to-card/60 backdrop-blur-xl rounded-3xl hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <MicIcon className="h-5 w-5 text-primary" />
            </div>
            How to Use
          </CardTitle>
          <CardDescription>
            Simple steps to get started with voice assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-5">
          <div className="flex items-center gap-3 ">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-sm">
              Click the microphone button to start talking
            </span>
          </div>
          <div className="flex items-center gap-3 ">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-sm">
              Ask questions about dental health and treatments
            </span>
          </div>
          <div className="flex items-center gap-3 ">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-sm">
              Get instant voice responses from the AI
            </span>
          </div>
          <div className="flex items-center gap-3 ">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-sm">
              View conversation transcript in real-time
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="relative group bg-linear-to-br from-card/90 to-card/60 backdrop-blur-xl rounded-3xl hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3">
            <div className="bg-linear-to-br from-primary/20 to-primary/10 size-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <LockIcon className="size-5 text-primary" />
            </div>
            <div>Features</div>
          </CardTitle>
          <CardDescription>
            Simple steps to get started with voice assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-5">
          <div className="flex items-center gap-3 bg-muted/30 rounded-2xl p-3">
            <div className="size-10 bg-linear-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
              <MicIcon className="size-5 text-primary" />
            </div>
            <span className="text-sm font-medium">
              Real-time Voice Recognation
            </span>
          </div>
          <div className="flex items-center gap-3 bg-muted/30 rounded-2xl p-3">
            <div className="size-10 bg-linear-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
              <ShieldIcon className="size-5 text-primary" />
            </div>
            <span className="text-sm font-medium">AI-Powered Responses</span>
          </div>
          <div className="flex items-center gap-3 bg-muted/30 rounded-2xl p-3">
            <div className="size-10 bg-linear-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
              <CalendarIcon className="size-5 text-primary" />
            </div>
            <span className="text-sm font-medium">Conversation History</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureCards;
