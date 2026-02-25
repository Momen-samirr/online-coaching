import React from "react";
import { Card, CardHeader } from "../ui/card";
import { MessageCircleIcon, MessageSquareIcon } from "lucide-react";
import { STORE_KEY_SHARED_PANEL_LOCATION } from "next/dist/next-devtools/dev-overlay/shared";

const ChatBubbles = () => {
  return (
    <>
      <Card className="relative bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl px-3 py-3">
              <MessageSquareIcon className="size-10 text-primary animate-pulse flex items-center justify-center" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6">
                <span className="text-primary font-semibold">
                  "My tooth hurts when I bite down"
                </span>
              </div>
            </div>
          </div>
          <div className="bg-muted/30 rounded-2xl p-5 mt-1">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get immediate advice on pain management, possible causes, and when
              to see a dentist urgently
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                Instant Response
              </span>
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                Pain Relief
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card className="relative bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-3xl rounded-3xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl px-3 py-3">
              <MessageSquareIcon className="size-10 text-primary animate-pulse" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 ">
                <span className="text-primary font-semibold">
                  "My tooth hurts when I bite down"
                </span>
              </div>
            </div>
          </div>
          <div className="bg-muted/30 rounded-2xl p-5 mt-1">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get immediate advice on pain management, possible causes, and when
              to see a dentist urgently
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Cost Analysis
              </span>
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                Treatment Options
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-3xl rounded-3xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl px-3 py-3">
              <MessageSquareIcon className="size-10 text-primary animate-pulse" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6">
                <p className="text-primary font-semibold">
                  "My tooth hurts when I bite down"
                </p>
              </div>
            </div>
          </div>
          <div className="bg-muted/30 rounded-2xl p-5">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get immediate advice on pain management, possible causes, and when
              to see a dentist urgently
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                Preventive Care
              </span>
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                Maintenance
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  );
};

export default ChatBubbles;
