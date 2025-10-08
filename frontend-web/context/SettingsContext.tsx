"use client";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";

// Types
type AccessibilityOptions = {
  highContrast: boolean;
  reducedMotion: boolean;
};

type SettingsContextType = {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  accessibility: AccessibilityOptions;
  updateAccessibility: (key: keyof AccessibilityOptions, value: boolean) => void;
};

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export function SettingsProvider({ children }: { children: ReactNode }) {
  // State for notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // State for accessibility options
  const [accessibility, setAccessibility] = useState<AccessibilityOptions>({
    highContrast: false,
    reducedMotion: false,
  });

  // Initialize with values from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNotifications = localStorage.getItem('notificationsEnabled');
      if (savedNotifications) setNotificationsEnabled(JSON.parse(savedNotifications));
      
      const savedAccessibility = localStorage.getItem('accessibility');
      if (savedAccessibility) setAccessibility(JSON.parse(savedAccessibility));
    }
  }, []);

  // Save to localStorage when settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
      localStorage.setItem('accessibility', JSON.stringify(accessibility));
    }
  }, [notificationsEnabled, accessibility]);

  // Apply accessibility settings to the document
  useEffect(() => {
    // Apply high contrast
    if (accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (accessibility.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [accessibility]);

  // Function to update a specific accessibility option
  const updateAccessibility = (key: keyof AccessibilityOptions, value: boolean) => {
    setAccessibility(prev => ({ ...prev, [key]: value }));
  };

  // Context value
  const value = {
    notificationsEnabled,
    setNotificationsEnabled,
    accessibility,
    updateAccessibility,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use the settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}