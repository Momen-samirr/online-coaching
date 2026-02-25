import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Brain } from "lucide-react";

const StepComponentExpert = () => {
  return (
    <div className="relative group">
      <Card>
        <div className="absolute w-8 h-8 -top-4 left-8 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm flex items-center justify-center shadow-lg">
          <span className="font-bold">2</span>
        </div>
        <CardHeader>
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 mb-6">
            <Brain className="size-10 text-primary animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-center">Ask Questions</h3>
          <p className="text-muted-foreground text-center leading-relaxed mb-6">
            hat with our AI assistant about any dental concerns. Get instant
            answers about symptoms, treatments, and oral health tips.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 justify-center ">
            <span className="bg-primary/10 to-primary/5 rounded-full px-3 py-1 text-primary text-xs">
              AI-Powered
            </span>
            <span className="bg-primary/10 to-primary/5 rounded-full px-3 py-1 text-primary text-xs">
              Personalized
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepComponentExpert;
