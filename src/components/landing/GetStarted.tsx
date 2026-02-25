import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const GetStarted = () => {
  return (
    <section className="flex items-center justify-center mx-auto">
      <SignUpButton mode="modal">
        <button className="bg-primary px-8 py-3 cursor-pointer rounded-full flex items-center gap-3 text-black">
          <ArrowRight className="size-5" />
          <span className="font-semibold text-lg">Get Started now</span>
        </button>
      </SignUpButton>
    </section>
  );
};

export default GetStarted;
