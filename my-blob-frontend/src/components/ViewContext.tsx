"use client";

import React, { createContext, useContext, useState } from "react";

interface ViewContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const useViewContext = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useViewContext must be used within a ViewProvider");
  }
  return context;
};

interface ViewProviderProps {
  children: React.ReactNode;
}

export const ViewProvider: React.FC<ViewProviderProps> = ({ children }) => {
  const [currentView, setCurrentView] = useState("home");

  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </ViewContext.Provider>
  );
};
