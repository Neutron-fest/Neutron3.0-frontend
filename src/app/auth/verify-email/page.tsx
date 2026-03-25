"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth-layout";
import { motion } from "framer-motion";
import { AuthButton } from "@/components/auth-components";
import { Chocolate_Classical_Sans } from "next/font/google";

export default function EmailVerifiedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = React.useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    setToken(token);
    if (!token) {
      router.push("/auth/signup");
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  },[token])

  const verifyEmail = async()=>{
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/verify-email?token=${token}`, {
        method: "GET",
      });
      const data = await res.json();
      console.log(data)
    }catch(err){
      console.log(err)
    }
  }

  return (
    <AuthLayout 
      title="Email Verified!" 
      subtitle="Your email has been successfully verified. You can now explore the Neutron universe."
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 py-4"
      >
        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 16v6m-3-3l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
          <p className="text-white/60 leading-relaxed font-light">
            Your email verification is complete. You can now log in and start your journey.
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <AuthButton onClick={()=>{
            router.push("/auth/signin")
            
          }} variant="primary"
          className="cursor-pointer"
          >

            Go to Sign In
          </AuthButton>
        </div>
      </motion.div>
    </AuthLayout>
  );
}