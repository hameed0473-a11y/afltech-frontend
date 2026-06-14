import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, ArrowLeft, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DeviceFrameProps {
  children: React.ReactNode;
  activeNotification?: { title: string; message: string; actionText?: string; onAction?: () => void } | null;
  onClearNotification?: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  appTitle?: string;
}

export default function DeviceFrame({
  children,
  activeNotification,
  onClearNotification,
  onBackClick,
  showBackButton = false,
  appTitle = "Contributions MP"
}: DeviceFrameProps) {
  const [time, setTime] = useState("");
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // safety
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss notification after 10 seconds
  useEffect(() => {
    if (activeNotification && onClearNotification) {
      const timer = setTimeout(() => {
        onClearNotification();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [activeNotification, onClearNotification]);

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-start text-sans transition-all duration-300">
      
      {/* Visual Workspace Controls */}
      <div className="w-full max-w-md flex justify-between items-center mb-4 text-xs text-slate-400 font-medium px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Contributions Management Android Sim</span>
        </div>
        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 px-2.5 rounded border border-slate-700 transition"
        >
          {isMobileFrame ? (
            <>
              <Maximize className="w-3 h-3" />
              <span>Full Screen</span>
            </>
          ) : (
            <>
              <Minimize className="w-3 h-3" />
              <span>Android Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div 
        className={`${
          isMobileFrame 
            ? 'w-[410px] h-[840px] rounded-[50px] border-[12px] border-slate-950 bg-slate-950 shadow-2xl relative flex flex-col overflow-hidden ring-[6px] ring-slate-800 ring-offset-2 ring-offset-slate-900'
            : 'w-full max-w-5xl min-h-[760px] rounded-2xl bg-slate-950 shadow-2xl flex flex-col border border-slate-800'
        } transition-all duration-300`}
      >
        
        {/* Android Punch Hole & Status Bar (Simulated only when framed) */}
        {isMobileFrame && (
          <div className="bg-slate-950 h-11 relative flex justify-between items-center px-7 select-none text-white shrink-0">
            {/* Clock */}
            <span className="text-xs font-semibold tracking-wide text-slate-100">{time || "12:46 PM"}</span>
            
            {/* Center Punch-Hole Camera */}
            <div className="absolute left-1/2 transform -translate-x-[50%] top-2.5 w-24 h-5 bg-black rounded-full border border-slate-800 flex items-center justify-center z-55">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-900/60 mr-12"></span>
              <span className="w-2.5 h-1 bg-slate-900 rounded-full"></span>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2 text-slate-100">
              <Signal className="w-3.5 h-3.5 text-slate-200" />
              <Wifi className="w-3.5 h-3.5 text-slate-200" />
              <div className="flex items-center gap-0.5">
                <Battery className="w-4 h-4 text-slate-200" />
                <span className="text-[10px] font-bold">88%</span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Push Notification Overlay for OTPs */}
        <AnimatePresence>
          {activeNotification && (
            <motion.div
              initial={{ opacity: 0, y: -80, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="absolute top-12 left-0 right-0 z-50 px-4 w-full"
            >
              <div className="mx-2 bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-xl text-white flex gap-3">
                <div className="bg-amber-500 text-slate-950 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 mt-0.5 animate-bounce">
                  ✉️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-amber-400 tracking-wider uppercase font-display">SIMULATED SMS MESSAGE</h4>
                    <span className="text-[10px] text-slate-400">Just Now</span>
                  </div>
                  <p className="text-sm font-semibold tracking-wide text-slate-100 mt-0.5">{activeNotification.title}</p>
                  <p className="text-xs text-slate-300 mt-1">{activeNotification.message}</p>
                  {activeNotification.actionText && activeNotification.onAction && (
                    <button
                      onClick={activeNotification.onAction}
                      className="mt-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                    >
                      {activeNotification.actionText}
                    </button>
                  )}
                </div>
                <button 
                  onClick={onClearNotification}
                  className="text-slate-400 hover:text-white text-xs align-top cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Application Appbar / Header */}
        <div className="bg-brand-600 text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button 
                onClick={onBackClick}
                className="hover:bg-brand-700 active:bg-brand-700/60 p-1.5 rounded-full transition-all"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            <div>
              <h1 className="text-base font-bold font-display tracking-tight leading-tight">{appTitle}</h1>
              <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Contributions Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-indigo-700 text-indigo-100 py-0.5 px-2 rounded-full border border-indigo-500">
              v1.2.0-Prod
            </span>
          </div>
        </div>

        {/* Embedded Children Webview (the actual App screen) */}
        <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col relative">
          {children}
        </div>

        {/* Simulated Android Navigation Bar */}
        {isMobileFrame && (
          <div className="bg-slate-950 h-12 flex justify-around items-center px-12 border-t border-slate-900 shrink-0">
            {/* Back Arrow */}
            <button 
              onClick={onBackClick} 
              className="text-slate-400 hover:text-slate-200 active:scale-90 transition p-2 cursor-pointer"
              disabled={!showBackButton}
            >
              <svg className={`w-5 h-5 ${!showBackButton ? 'opacity-30' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
              </svg>
            </button>
            
            {/* Home / Square Circle Button */}
            <div className="w-[14px] h-[14px] rounded-full border-2 border-slate-400 hover:border-slate-200 transition"></div>
            
            {/* Recents Squares Button */}
            <div className="w-3.5 h-3.5 border-2 border-slate-400 rounded-sm hover:border-slate-200 transition"></div>
          </div>
        )}
      </div>
    </div>
  );
}
