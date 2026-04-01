"use client";

import React, { useEffect, useState } from "react";
import ProfilePage from "@/src/components/profile-page";
import ProfileMobPage from "@/src/components/Profile-Mob";

export default function ProfileSwitcher() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return isMobile ? <ProfileMobPage /> : <ProfilePage />;
}
