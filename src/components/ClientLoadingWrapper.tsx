"use client"

import React, { useState, useEffect } from 'react';
import GlitchLoader from './GlitchLoader';

export default function ClientLoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <GlitchLoader isLoading={isLoading} />
      <div className={`relative w-full min-h-screen ${isLoading ? 'opacity-0 scale-110' : 'animate-shatter'}`}>
        {children}
      </div>
    </>
  );
}
