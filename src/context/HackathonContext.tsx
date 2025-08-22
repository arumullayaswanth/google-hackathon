'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HackathonContextType {
  isHackathonMode: boolean;
  toggleHackathonMode: () => void;
}

const HackathonContext = createContext<HackathonContextType | undefined>(undefined);

export const HackathonProvider = ({ children }: { children: ReactNode }) => {
  const [isHackathonMode, setIsHackathonMode] = useState(false);

  const toggleHackathonMode = () => {
    setIsHackathonMode(prev => !prev);
  };

  return (
    <HackathonContext.Provider value={{ isHackathonMode, toggleHackathonMode }}>
      {children}
    </HackathonContext.Provider>
  );
};

export const useHackathon = () => {
  const context = useContext(HackathonContext);
  if (context === undefined) {
    throw new Error('useHackathon must be used within a HackathonProvider');
  }
  return context;
};
