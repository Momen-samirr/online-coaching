import React from "react";

const VoiceWelcomeSection = () => {
  return (
    <div className="relative mb-11 overflow-hidden">
      <div className="flex items-center justify-between bg-linear-to-br from-primary/20 to-background rounded-3xl p-8 border border-border/20">
        <div className="space-y-5">
          <div className="inline-flex rounded-full items-center gap-3 px-3 py-1 border-primary/20 bg-primary/10">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-primary">Voice Assistant Ready</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-3">AI Voice Assistant</h1>
            <p className="text-muted-foreground">
              Upgrade to AI Pro or AI Basic to unlock unlimited voice
              consultations with our AI dental assistant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceWelcomeSection;
