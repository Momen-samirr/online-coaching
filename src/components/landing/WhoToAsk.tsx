import { MessageCircleIcon } from "lucide-react";
import React from "react";
import ChatBubbles from "./ChatBubbles";
import Image from "next/image";

const WhoToAsk = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-br from-background to-muted/20">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 py-3 px-5 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full border border-primary/10 backdrop-blur-sm mb-6">
            <MessageCircleIcon className="size-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Conversations
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text tetx-transparent">
              Ask About
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Anything dental
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From simple questions to complex concerns, our AI delivers
            expert-level guidance trained on thousands of real dental cases
          </p>
        </div>
        <div className="grid grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-8">
                Common questions our AI answers:
              </h3>
              <ChatBubbles />
            </div>
          </div>
          <div className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-3xl rounded-3xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-500">
            <div className="flex items-center justify-center h-full">
              <Image
                src={"/HeroMucles-removebg-preview.png"}
                alt="AI-Powered Conversations"
                width={500}
                height={500}
                className="w-full h-auto max-w-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoToAsk;
