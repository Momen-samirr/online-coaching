import Image from "next/image";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Link } from "@/i18n/navigation";
import HeaderClient from "./HeaderClient";
import { getIsAdmin } from "@/lib/auth-admin";

const Header = async () => {
  const [user, isAdmin] = await Promise.all([
    currentUser(),
    getIsAdmin(),
  ]);
  return (
    <div className="fixed top-0 right-0 left-0 z-[100] border-b border-border/70 bg-background/80 h-16 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={"/logo1.png"}
            alt="Logo"
            width={32}
            height={32}
            className="w-11"
          />
          <span className="font-semibold">Coaching</span>
        </Link>
        <HeaderClient user={!!user} isAdmin={!!isAdmin} />
      </div>
    </div>
  );
};

export default Header;
