import AdminDashboard from "./pages/AdminDashboard";
import { registerUser } from './services/api';
import { createBackup, restoreBackup } from './utils/backup';
import React, { useState, useEffect } from 'react';
import { 
  StaffUser, Contributor, ContributionTarget, Contribution, Pledge, UserRole 
} from './types';
import { 
  INITIAL_STAFF, INITIAL_CONTRIBUTORS, INITIAL_TARGETS, INITIAL_CONTRIBUTIONS, INITIAL_PLEDGES 
} from './initialData';
import { APP_THEMES } from './themes';
import DeviceFrame from './components/DeviceFrame';
import TargetModule from './components/TargetModule';
import ContributorManagement from './components/ContributorManagement';
import CollectionModule from './components/CollectionModule';
import ReportModule from './components/ReportModule';
import SpecialPledgeModule from './components/SpecialPledgeModule';
import StaffManagement from './components/StaffManagement';

import { 
  LayoutDashboard, Wallet, HeartHandshake, AlertCircle, Users, UserCheck, 
  LogOut, Shield, CheckCircle, Flame, DollarSign, Smartphone, HelpCircle, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // -------------------------------------------------------------
  // Data Persistence Keys
  // -------------------------------------------------------------
  const [staff, setStaff] = useState<StaffUser[]>(() => {
    const loaded = localStorage.getItem('cm_staff');
    let parsed: StaffUser[] = [];
    if (loaded) {
      try {
        parsed = JSON.parse(loaded);
      } catch (e) {
        parsed = INITIAL_STAFF;
      }
    } else {
      parsed = INITIAL_STAFF;
    }

    const uniqueStaff: StaffUser[] = [];
    const seenMobiles = new Set<string>();
    
    const sorted = [...parsed].sort((a, b) => {
      if (a.id === 'staff-admin-1') return -1;
      if (b.id === 'staff-admin-1') return 1;
      if (a.role === 'collector' && b.role === 'admin') return -1;
      if (a.role === 'admin' && b.role === 'collector') return 1;
      return 0;
    });

    for (const item of sorted) {
      const mob = item.mobile.trim();
      if (!seenMobiles.has(mob)) {
        seenMobiles.add(mob);
        uniqueStaff.push(item);
      }
    }

    if (uniqueStaff.length !== parsed.length) {
      localStorage.setItem('cm_staff', JSON.stringify(uniqueStaff));
    }
    return uniqueStaff;
  });

  const [contributors, setContributors] = useState<Contributor[]>(() => {
    const loaded = localStorage.getItem('cm_contributors');
    const isPurged = localStorage.getItem('cm_is_purged') === 'true';
    if (loaded) {
      const parsed = JSON.parse(loaded);
      if (parsed.length > 0 || isPurged) return parsed;
    }
    localStorage.setItem('cm_contributors', JSON.stringify(INITIAL_CONTRIBUTORS));
    return INITIAL_CONTRIBUTORS;
  });

  const [targets, setTargets] = useState<ContributionTarget[]>(() => {
    const loaded = localStorage.getItem('cm_targets');
    const isPurged = localStorage.getItem('cm_is_purged') === 'true';
    if (loaded) {
      const parsed = JSON.parse(loaded);
      if (parsed.length > 0 || isPurged) return parsed;
    }
    localStorage.setItem('cm_targets', JSON.stringify(INITIAL_TARGETS));
    return INITIAL_TARGETS;
  });

  const [contributions, setContributions] = useState<Contribution[]>(() => {
    const loaded = localStorage.getItem('cm_contributions');
    const isPurged = localStorage.getItem('cm_is_purged') === 'true';
    if (loaded) {
      const parsed = JSON.parse(loaded);
      if (parsed.length > 0 || isPurged) return parsed;
    }
    localStorage.setItem('cm_contributions', JSON.stringify(INITIAL_CONTRIBUTIONS));
    return INITIAL_CONTRIBUTIONS;
  });

  const [pledges, setPledges] = useState<Pledge[]>(() => {
    const loaded = localStorage.getItem('cm_pledges');
    const isPurged = localStorage.getItem('cm_is_purged') === 'true';
    if (loaded) {
      const parsed = JSON.parse(loaded);
      if (parsed.length > 0 || isPurged) return parsed;
    }
    localStorage.setItem('cm_pledges', JSON.stringify(INITIAL_PLEDGES));
    return INITIAL_PLEDGES;
  });

  const [loggedInUser, setLoggedInUser] = useState<StaffUser | null>(() => {
    const loaded = sessionStorage.getItem('cm_current_session');
    return loaded ? JSON.parse(loaded) : null;
  });

  const [activeThemeId, setActiveThemeId] = useState<'classic' | 'emerald' | 'cosmic' | 'editorial'>(() => {
    const loaded = localStorage.getItem('cm_theme');
    return (loaded as any) || 'emerald';
  });

  const [notification, setNotification] = useState<{ 
    title: string; 
    message: string; 
    actionText?: string; 
    onAction?: () => void 
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'collect' | 'pledges' | 'reports' | 'contributors' | 'staff'>('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Registration Form state
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  
  // OTP Simulation states for registration
  const [otpStep, setOtpStep] = useState<'details' | 'otp'>('details');
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Login Form states
  const [loginMobile, setLoginMobile] = useState("");
  const [loginOtpStep, setLoginOtpStep] = useState<'details' | 'otp'>('details');
  const [loginGeneratedOtp, setLoginGeneratedOtp] = useState("");
  const [loginEnteredOtp, setLoginEnteredOtp] = useState("");
  const [isVerifyingLoginOtp, setIsVerifyingLoginOtp] = useState(false);

  useEffect(() => {
    // Dynamic alignment checks if needed on setup
  }, []);

  // -------------------------------------------------------------
  // LocalStorage sync actions
  // -------------------------------------------------------------
  const syncStaff = (updated: StaffUser[]) => {
    setStaff(updated);
    localStorage.setItem('cm_staff', JSON.stringify(updated));
  };

  const syncContributors = (updated: Contributor[]) => {
    setContributors(updated);
    localStorage.setItem('cm_contributors', JSON.stringify(updated));
  };

  const syncTargets = (updated: ContributionTarget[]) => {
    setTargets(updated);
    localStorage.setItem('cm_targets', JSON.stringify(updated));
  };

  const syncContributions = (updated: Contribution[]) => {
    setContributions(updated);
    localStorage.setItem('cm_contributions', JSON.stringify(updated));
  };

  const syncPledges = (updated: Pledge[]) => {
    setPledges(updated);
    localStorage.setItem('cm_pledges', JSON.stringify(updated));
  };

  const triggerNotification = (title: string, message: string, actionText?: string, onAction?: () => void) => {
    setNotification({ title, message, actionText, onAction });
  };

  // -------------------------------------------------------------
  // Auth Flows
  // -------------------------------------------------------------
  const handleLoginMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginMobile.trim()) return;

    if (!/^\d{10}$/.test(loginMobile.trim())) {
      alert("Please specify a valid 10-digit mobile number.");
      return;
    }

    const foundUser = staff.find(s => s.mobile === loginMobile.trim());
    if (!foundUser) {
      alert(`The mobile number +91 ${loginMobile} is not registered. Click 'Create Profile' below to sign up as an Admin, or ask an existing Admin to register your number.`);
      return;
    }

    if (foundUser.role === 'admin') {
      const numCode = Math.floor(100000 + Math.random() * 900000).toString();
      setLoginGeneratedOtp(numCode);
      setLoginOtpStep('otp');

      triggerNotification(
        "✉ SMS Received: Login OTP",
        `OTP code for Admin login is ${numCode}. Click below to auto-fill.`,
        "Auto-fill Code",
        () => {
          setLoginEnteredOtp(numCode);
          setNotification(null);
        }
      );
    } else {
      setLoggedInUser(foundUser);
      setActiveTab('dashboard');
      sessionStorage.setItem('cm_current_session', JSON.stringify(foundUser));
      triggerNotification("Staff Authorized ✅", `Authorized access for ${foundUser.name} (Collector). Logging in...`);
    }
  };

  const handleVerifyLoginOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingLoginOtp(true);

    setTimeout(() => {
      if (loginEnteredOtp === loginGeneratedOtp || loginEnteredOtp === "111111") {
        const foundUser = staff.find(s => s.mobile === loginMobile.trim());
        if (foundUser) {
          setLoggedInUser(foundUser);
          setActiveTab('dashboard');
          sessionStorage.setItem('cm_current_session', JSON.stringify(foundUser));
          setLoginMobile("");
          setLoginEnteredOtp("");
          setLoginOtpStep('details');
          triggerNotification("Login Successful!", `Authenticated as ${foundUser.name} (Admin).`);
        }
        setIsVerifyingLoginOtp(false);
      } else {
        setIsVerifyingLoginOtp(false);
        alert("The verification OTP entered is invalid. Please use the auto-fill code or try '111111'.");
      }
    }, 800);
  };

  const handleDemoLogin = (userId: string) => {
    const user = staff.find(s => s.id === userId);
    if (user) {
      setLoggedInUser(user);
      setActiveTab('dashboard');
      sessionStorage.setItem('cm_current_session', JSON.stringify(user));
      triggerNotification("Login Successful!", `Authenticated as ${user.name} (${user.role.toUpperCase()}).`);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regMobile.trim()) return;

    if (!/^\d{10}$/.test(regMobile.trim())) {
      alert("Please specify a real 10 digit Indian carrier mobile number.");
      return;
    }

    const existing = staff.find(s => s.mobile === regMobile.trim());
    if (existing) {
      alert(`The mobile number +91 ${regMobile.trim()} is already registered as a ${existing.role === 'admin' ? 'Partner Admin' : 'Collector Staff'}. Duplicate registration is not permitted. Please log in directly.`);
      return;
    }

    const numCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(numCode);
    setOtpStep('otp');

    triggerNotification(
      "✉ Sms Received: OTP Verification",
      `OTP code for Registration is indeed ${numCode}. Klik below to auto-fill.`,
      "Auto-fill Code",
      () => {
        setEnteredOtp(numCode);
        setNotification(null);
      }
    );
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOtp(true);

    if (enteredOtp === generatedOtp || enteredOtp === "111111") {

      // Call API to register user in database
      try {
        const apiResult = await registerUser({
          username: regName.trim(),
          mobile: regMobile.trim(),
          email: regEmail.trim() || `${regMobile.trim()}@afltech.in`,
          password: regPassword.trim() || regMobile.trim()
        });
        if (apiResult.success) {
          console.log('User registered in database:', apiResult.user);
        }
      } catch (err) {
        console.log('API registration error (continuing locally):', err);
      }

      // Continue with existing local logic regardless of API result
      const newAdminId = `staff-reg-${Date.now().toString().slice(-4)}`;
      const enrolledAdmin: StaffUser = {
        id: newAdminId,
        name: regName.trim(),
        mobile: regMobile.trim(),
        role: 'admin',
        registeredAt: new Date().toISOString().slice(0, 10)
      };

      const nextStaff = [...staff, enrolledAdmin];
      syncStaff(nextStaff);
      setLoggedInUser(enrolledAdmin);
      setActiveTab('dashboard');
      sessionStorage.setItem('cm_current_session', JSON.stringify(enrolledAdmin));

      setRegName("");
      setRegMobile("");
      setRegEmail("");
      setRegPassword("");
      setEnteredOtp("");
      setOtpStep('details');
      setIsVerifyingOtp(false);
      triggerNotification("Verified ✅", "New Administrative register complete through verified OTP!");
    } else {
      setIsVerifyingOtp(false);
      alert("The authentication OTP entered is invalid. Please try 111111 or press Auto-fill.");
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setActiveTab('dashboard');
    sessionStorage.removeItem('cm_current_session');
    triggerNotification("Logged out", "Revoked security authentication tokens.");
  };

  // -------------------------------------------------------------
  // App Stats Computations
  // -------------------------------------------------------------
  const totalAmountReceived = contributions.reduce((sum, c) => sum + c.amountPaid, 0);
  const uniqueContributorsCount = contributors.length;
  const activeContributorsCount = contributors.filter(c => c.type === 'monthly').length;

  const monthlyTargets = targets.filter(t => t.category === 'monthly');
  const activeMonthlyTargetId = monthlyTargets[0]?.id || "";
  const paidContributorIds = contributions
    .filter(c => c.targetId === activeMonthlyTargetId)
    .map(c => c.contributorId);
  const missedMonthlyCount = contributors.filter(c => 
    c.type === 'monthly' && !paidContributorIds.includes(c.id)
  ).length;
  const totalMonthlyCount = contributors.filter(c => c.type === 'monthly').length;
  const paidMonthlyCount = totalMonthlyCount - missedMonthlyCount;

  const totalPledgesCount = pledges.length;
  const paidPledgesCount = pledges.filter(p => p.status === 'fully_paid').length;
  const pendingPledgesCount = totalPledgesCount - paidPledgesCount;

  const selectedTheme = APP_THEMES.find(t => t.id === activeThemeId) || APP_THEMES[1];

  return (
    <>
      <style>{`
        :root {
          --color-brand-50: ${selectedTheme.primaryLight} !important;
          --color-brand-100: ${selectedTheme.primaryLight} !important;
          --color-brand-500: ${selectedTheme.accent} !important;
          --color-brand-600: ${selectedTheme.primary} !important;
          --color-brand-700: ${selectedTheme.primaryDark} !important;
          --color-brand-900: ${selectedTheme.primaryDark} !important;

          --color-indigo-50: ${selectedTheme.primaryLight} !important;
          --color-indigo-100: ${selectedTheme.primaryLight} !important;
          --color-indigo-150: ${selectedTheme.cardBorder} !important;
          --color-indigo-200: ${selectedTheme.badgeBg} !important;
          --color-indigo-405: ${selectedTheme.accent} !important;
          --color-indigo-500: ${selectedTheme.primary} !important;
          --color-indigo-600: ${selectedTheme.primary} !important;
          --color-indigo-650: ${selectedTheme.primary} !important;
          --color-indigo-700: ${selectedTheme.primaryDark} !important;
          --color-indigo-800: ${selectedTheme.primaryDark} !important;
          --color-indigo-900: ${selectedTheme.primaryDark} !important;
          --color-indigo-950: ${selectedTheme.primaryDark} !important;

          --color-primary-600: ${selectedTheme.primary} !important;
          --color-primary-700: ${selectedTheme.primaryDark} !important;
          --color-emerald-50: ${selectedTheme.primaryLight} !important;
          --color-emerald-600: ${selectedTheme.primary} !important;
          --color-emerald-700: ${selectedTheme.primaryDark} !important;
        }

        .bg-radial {
          background-image: radial-gradient(circle at top, ${selectedTheme.primary} 0%, ${selectedTheme.primaryDark} 100%) !important;
        }
      `}</style>
      <DeviceFrame
        activeNotification={notification}
        onClearNotification={() => setNotification(null)}
        onBackClick={() => {
          if (activeTab !== 'dashboard') setActiveTab('dashboard');
        }}
        showBackButton={activeTab !== 'dashboard'}
        appTitle={loggedInUser ? `Contributions Management` : "Register admin Portal"}
      >
        
        {/* ----------------- LOGIN / REGISTER CONTAINER ----------------- */}
        {!loggedInUser ?
          <div className="w-full p-5 space-y-4 flex flex-col font-sans">
            
            {/* Visual Logo Banner */}
            <div className="text-center space-y-1.5 pt-2 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-display text-2xl font-bold mx-auto border-2 border-emerald-400 shadow-md">
                CM
              </div>
              <h2 className="text-xl font-extrabold font-display text-slate-800 tracking-tight">Contributions Manager</h2>
              <p className="text-xs text-slate-500">Authorized Administration & Cash Collector Terminal</p>
            </div>

            {/* Unified Auth Card Container */}
            <div className="bg-white border text-center p-4 rounded-2xl shadow-sm space-y-3 relative">
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                {authMode === 'login' ? "SECURE PORTAL LOGIN" : "CREATE ADMNISTRATIVE PROFILE"}
              </div>

              {authMode === 'login' ? (
                <div className="space-y-3.5 text-left pt-1">
                  <p className="text-center text-[11px] text-slate-500 font-medium pb-1.5">
                    Enter your registered 10-digit mobile number to log in.
                  </p>

                  {loginOtpStep === 'details' ? (
                    <form onSubmit={handleLoginMobileSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">Mobile Number</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 font-mono">+91</span>
                          <input
                            type="tel"
                            value={loginMobile}
                            onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 9876543210"
                            className="w-full text-xs pl-11 pr-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 font-bold tracking-wide"
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 font-display text-white font-bold py-2.5 rounded-xl shadow-xs text-xs transition cursor-pointer text-center block mt-1"
                      >
                        Login / Send OTP
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyLoginOtpSubmit} className="space-y-3.5">
                      <div className="bg-slate-50 p-2 text-center rounded-lg border text-slate-600">
                        <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Verifying Mobile Profile:</div>
                        <p className="text-xs font-bold text-slate-700 font-mono">+91 {loginMobile}</p>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center space-y-1.5 shadow-xs">
                        <div className="text-[9px] font-black text-amber-800 uppercase tracking-widest">Simulated SMS OTP Code</div>
                        <p className="text-sm font-black tracking-widest text-slate-900 bg-white/85 border border-amber-200/50 py-1 rounded-lg">
                          {loginGeneratedOtp}
                        </p>
                        <button
                          type="button"
                          onClick={() => setLoginEnteredOtp(loginGeneratedOtp)}
                          className="text-[10px] font-bold text-indigo-700 hover:text-indigo-950 underline block mx-auto cursor-pointer"
                        >
                          ⚡ Auto-fill code
                        </button>
                      </div>

                      <div>
                        <label className="block text-center text-[10px] font-bold text-slate-600 mb-1">ENTER VERIFICATION CODE</label>
                        <input
                          type="text"
                          value={loginEnteredOtp}
                          onChange={(e) => setLoginEnteredOtp(e.target.value.slice(0, 6))}
                          placeholder="Type OTP..."
                          className="w-full text-center text-sm p-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-black tracking-[6px]"
                          maxLength={6}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isVerifyingLoginOtp}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        {isVerifyingLoginOtp ? "Authorizing..." : "Verify Code & Confirm Access"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setLoginOtpStep('details')}
                        className="w-full text-slate-400 hover:text-slate-600 text-[10px] underline text-center cursor-pointer block"
                      >
                        Change Number
                      </button>
                    </form>
                  )}

                  <div className="pt-2.5 border-t border-slate-100 text-center">
                    <p className="text-[11px] text-slate-400 font-medium">New administrator partner?</p>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setOtpStep('details');
                        setLoginMobile("");
                      }}
                      className="text-xs text-indigo-650 hover:text-indigo-850 font-bold underline mt-1.5 cursor-pointer block mx-auto"
                    >
                      Create Profile (New Users)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-left pt-1 space-y-3.5">
                  <p className="text-center text-[11px] text-slate-500 font-medium pb-1.5">
                    Create an administrator profile to initialize cash targets and authorize collector sub-users.
                  </p>

                  {otpStep === 'details' ? (
                    <form onSubmit={handleSendOtp} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">Full Name</label>
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Aravind Swamy"
                          className="w-full text-xs px-3 py-2.5 border rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">Mobile number</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 font-mono">+91</span>
                          <input
                            type="tel"
                            value={regMobile}
                            onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 9876543210"
                            className="w-full text-xs pl-11 pr-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-805 font-bold tracking-wide"
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 rounded-xl shadow-xs text-xs transition cursor-pointer text-center block mt-3"
                      >
                        Verify Mobile & Send OTP
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtpSubmit} className="space-y-3.5 pt-1">
                      <div className="bg-slate-50 p-2 text-center rounded-lg border text-slate-600">
                        <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold font-mono">Registering Name: <strong>{regName}</strong></div>
                        <p className="text-xs font-bold text-slate-700 font-mono">+91 {regMobile}</p>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center space-y-1.5 shadow-xs">
                        <div className="text-[9px] font-black text-amber-800 uppercase tracking-widest">Simulated SMS OTP Code</div>
                        <p className="text-sm font-black tracking-widest text-slate-900 bg-white/85 border border-amber-200/50 py-1 rounded-lg">
                          {generatedOtp}
                        </p>
                        <button
                          type="button"
                          onClick={() => setEnteredOtp(generatedOtp)}
                          className="text-[10px] font-bold text-indigo-700 hover:text-indigo-950 underline block mx-auto cursor-pointer"
                        >
                          ⚡ Auto-fill code
                        </button>
                      </div>

                      <div>
                        <label className="block text-center text-[10px] font-bold text-slate-700 mb-1">ENTER RECEIPT CODE</label>
                        <input
                          type="text"
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value.slice(0, 6))}
                          placeholder="Type Code..."
                          className="w-full text-center text-sm p-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-black tracking-[6px]"
                          maxLength={6}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isVerifyingOtp}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        {isVerifyingOtp ? "Confirming..." : "Verify Code & Register Admin"}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setOtpStep('details')}
                        className="w-full text-slate-400 hover:text-slate-600 text-[10px] underline text-center cursor-pointer"
                      >
                        Change Number
                      </button>
                    </form>
                  )}

                  <div className="pt-2.5 border-t border-slate-100 text-center">
                    <p className="text-[11px] text-slate-400 font-medium">Already created your profile?</p>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setLoginOtpStep('details');
                        setRegName("");
                        setRegMobile("");
                      }}
                      className="text-xs text-indigo-650 hover:text-indigo-850 font-bold underline mt-1.5 cursor-pointer block mx-auto animate-fade-in"
                    >
                      Login Profile
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Testing Profiles */}
            <div className="bg-slate-50 p-3 rounded-2xl border text-[11px] text-slate-500 space-y-1.5 leading-normal">
              <div className="font-extrabold text-slate-700 text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                <span>⚡ Enrolled Testing Profiles</span>
              </div>
              <p className="text-slate-500 text-[10.5px]">Use these numbers for quick testing in this playbox:</p>
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setLoginOtpStep('details');
                    setLoginMobile('9876543210');
                  }}
                  className="bg-indigo-50/50 hover:bg-indigo-50 active:bg-indigo-100 rounded p-1.5 text-left border cursor-pointer group"
                >
                  <strong className="text-indigo-900 block text-[10.5px]">Admin Partner</strong>
                  <span className="font-mono text-slate-500 block text-[10px] mt-0.5 group-hover:text-indigo-700">9876543210</span>
                </button>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setLoginOtpStep('details');
                    setLoginMobile('9123456789');
                  }}
                  className="bg-emerald-50/40 hover:bg-emerald-50 active:bg-emerald-100 rounded p-1.5 text-left border cursor-pointer group"
                >
                  <strong className="text-emerald-900 block text-[10.5px]">Collector Staff</strong>
                  <span className="font-mono text-slate-500 block text-[10px] mt-0.5 group-hover:text-emerald-700">9123456789</span>
                </button>
              </div>
            </div>

          </div>
        :
        
        // ----------------- AUTHENTICATED WORKSPACE APP -----------------
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
          
          <div className="bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white px-3.5 py-1.5 flex justify-between items-center text-[10.5px] shrink-0 font-medium">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${loggedInUser.role === 'admin' ? 'bg-purple-400 animate-pulse' : 'bg-indigo-400 animate-pulse'}`}></span>
              Staff: <strong>{loggedInUser.name}</strong> 
              <span className={`text-[8.5px] px-1 rounded uppercase tracking-wider font-extrabold ${
                loggedInUser.role === 'admin' ? 'bg-purple-900/60 border border-purple-500 text-purple-300' : 'bg-indigo-900/60 border border-indigo-500 text-indigo-300'
              }`}>
                {loggedInUser.role}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-500 font-bold tracking-tight py-0.5 px-1.5 rounded-md hover:bg-slate-800 transition flex items-center gap-0.5 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Log out</span>
            </button>
          </div>

          {/* Dynamic Tab Panel Views */}
          <div className="flex-1 overflow-y-auto pb-4">
            
            {/* TAB 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                <div className="bg-indigo-650 bg-radial text-white p-5 rounded-b-3xl shadow-md space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Welcome back</p>
                    <h2 className="text-xl font-black font-display tracking-tight text-white leading-tight">
                      {loggedInUser.name}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                      <span className="text-[10px] text-indigo-200 uppercase tracking-widest font-black block">Collected Cash</span>
                      <p className="text-xl font-black font-display text-white tracking-tight mt-1">₹{totalAmountReceived.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                      <span className="text-[10px] text-indigo-200 uppercase tracking-widest font-black block">Contributors</span>
                      <p className="text-xl font-black font-display text-white tracking-tight mt-1">{uniqueContributorsCount} <span className="text-xs text-indigo-200">total</span></p>
                    </div>
                  </div>
                </div>

                <div className="px-4">
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 px-1">Quick Terminal Launchers</h3>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <button
                      onClick={() => setActiveTab('collect')}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Wallet className="w-5 h-5" /></div>
                      <span className="text-[10px] font-bold text-slate-700 tracking-tight">Collect</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('pledges')}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-teal-50 text-teal-600"><HeartHandshake className="w-5 h-5 animate-pulse" /></div>
                      <span className="text-[10px] font-bold text-slate-700 tracking-tight">Pledges</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-rose-50 text-rose-600"><AlertCircle className="w-5 h-5" /></div>
                      <span className="text-[10px] font-bold text-slate-700 tracking-tight">Missed list</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('contributors')}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Users className="w-5 h-5" /></div>
                      <span className="text-[10px] font-bold text-slate-700 tracking-tight">Add Contr</span>
                    </button>
                  </div>
                </div>

                <div className="px-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-205 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-indigo-505 text-indigo-600" />
                        Dues & Recovery Status
                      </h4>
                      <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50/80 border border-indigo-100 py-0.5 px-2 rounded-full font-mono">
                        Collector Monitor
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-bold text-slate-450 uppercase tracking-tight text-slate-500">Monthly Dues</div>
                          <p className="text-sm font-black font-display text-slate-800 mt-1">
                            {missedMonthlyCount} of {totalMonthlyCount} Pending
                          </p>
                          <p className="text-[9px] text-slate-400 mt-0.5">Defaulters / Unpaid contributors</p>
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10.5px]">
                          <span className="text-emerald-600 font-extrabold font-mono">Paid: {paidMonthlyCount}</span>
                          <span className="text-rose-500 font-extrabold font-mono">Pending: {missedMonthlyCount}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-bold text-slate-450 uppercase tracking-tight text-slate-500 font-sans">Willingness Pledges</div>
                          <p className="text-sm font-black font-display text-slate-800 mt-1">
                            {pendingPledgesCount} of {totalPledgesCount} Pending
                          </p>
                          <p className="text-[9px] text-slate-400 mt-0.5">Special event pledges yet to collect</p>
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10.5px]">
                          <span className="text-emerald-600 font-extrabold font-mono">Paid: {paidPledgesCount}</span>
                          <span className="text-rose-500 font-extrabold font-mono">Pending: {pendingPledgesCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-2">
                  <TargetModule
                    targets={targets}
                    contributions={contributions}
                    currentUserRole={loggedInUser.role}
                    onAddTarget={(newT) => syncTargets([...targets, newT])}
                    onUpdateTarget={(updT) => {
                      const next = targets.map(t => t.id === updT.id ? updT : t);
                      syncTargets(next);
                    }}
                    onDeleteTarget={(id) => {
                      const next = targets.filter(t => t.id !== id);
                      syncTargets(next);
                      const nextPledges = pledges.filter(p => p.targetId !== id);
                      syncPledges(nextPledges);
                      const nextContribs = contributions.filter(c => c.targetId !== id);
                      syncContributions(nextContribs);
                    }}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: COLLECT */}
            {activeTab === 'collect' && (
              <CollectionModule
                contributors={contributors}
                pledges={pledges}
                targets={targets}
                contributions={contributions}
                currentUserRole={loggedInUser.role}
                currentUserId={loggedInUser.id}
                currentUserName={loggedInUser.name}
                onAddContribution={(newC) => syncContributions([...contributions, newC])}
                onDeleteContribution={(id) => {
                  const next = contributions.filter(c => c.id !== id);
                  syncContributions(next);
                }}
                onUpdateContribution={(updC) => {
                  const next = contributions.map(c => c.id === updC.id ? updC : c);
                  syncContributions(next);
                }}
                onTriggerNotification={triggerNotification}
                onAddContributor={(newContr) => syncContributors([...contributors, newContr])}
                onUpdatePledge={(updP) => {
                  const next = pledges.map(p => p.id === updP.id ? updP : p);
                  syncPledges(next);
                }}
              />
            )}

            {/* TAB 3: PLEDGES */}
            {activeTab === 'pledges' && (
              <SpecialPledgeModule
                targets={targets}
                pledges={pledges}
                contributions={contributions}
                contributors={contributors}
                currentUserRole={loggedInUser.role}
                currentUserId={loggedInUser.id}
                currentUserName={loggedInUser.name}
                onAddPledge={(newP) => syncPledges([...pledges, newP])}
                onUpdatePledge={(updP) => {
                  const next = pledges.map(p => p.id === updP.id ? updP : p);
                  syncPledges(next);
                }}
                onDeletePledge={(id) => {
                  const next = pledges.filter(p => p.id !== id);
                  syncPledges(next);
                }}
                onAddContribution={(newC) => syncContributions([...contributions, newC])}
                onTriggerNotification={triggerNotification}
              />
            )}

            {/* TAB 4: REPORTS */}
            {activeTab === 'reports' && (
              <ReportModule
                contributors={contributors}
                targets={targets}
                contributions={contributions}
                onTriggerNotification={triggerNotification}
                currentUserRole={loggedInUser?.role}
                currentUserId={loggedInUser?.id}
                currentUserName={loggedInUser?.name}
                onAddContribution={(newC) => syncContributions([...contributions, newC])}
              />
            )}

            {/* TAB 5: CONTRIBUTORS */}
            {activeTab === 'contributors' && (
              <ContributorManagement
                contributors={contributors}
                currentUserRole={loggedInUser.role}
                onAddContributor={(newContr) => syncContributors([...contributors, newContr])}
                onUpdateContributor={(updContr) => {
                  const next = contributors.map(c => c.id === updContr.id ? updContr : c);
                  syncContributors(next);
                }}
                onDeleteContributor={(id) => {
                  const next = contributors.filter(c => c.id !== id);
                  syncContributors(next);
                  const nextContribs = contributions.filter(tx => tx.contributorId !== id);
                  syncContributions(nextContribs);
                }}
              />
            )}

            {/* TAB 6: STAFF */}
            {activeTab === 'staff' && (
              <div className="flex flex-col">
                <StaffManagement
                  staff={staff}
                  currentUserRole={loggedInUser.role}
                  onAddStaff={(newS) => syncStaff([...staff, newS])}
                  onDeleteStaff={(id) => {
                    const next = staff.filter(s => s.id !== id);
                    syncStaff(next);
                  }}
                  onPurgeDatabase={() => {
                    localStorage.setItem('cm_is_purged', 'true');
                    syncContributors([]);
                    syncTargets([]);
                    syncContributions([]);
                    syncPledges([]);
                    triggerNotification("Purge Successful 🗑️", "All events, contributors, and histories successfully erased.");
                  }}
                  onRestoreDatabase={() => {
                    localStorage.removeItem('cm_is_purged');
                    syncContributors(INITIAL_CONTRIBUTORS);
                    syncTargets(INITIAL_TARGETS);
                    syncContributions(INITIAL_CONTRIBUTIONS);
                    syncPledges(INITIAL_PLEDGES);
                    triggerNotification("Database Restored 🔄", "Initial demo events, contributors, and histories successfully restored.");
                  }}
                />

                {/* Backup and Restore Section */}
                <div className="px-4 py-3 space-y-2">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Data Backup & Restore
                  </h4>
                  <button
                    onClick={() => {
                      createBackup();
                      triggerNotification("Backup Created ✅", "Your data backup file has been downloaded.");
                    }}
                    className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs"
                  >
                    Download Backup File
                  </button>
                  <label className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center cursor-pointer">
                    Restore from Backup
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            await restoreBackup(file);
                            triggerNotification("Restored ✅", "Data restored. Reloading...");
                            setTimeout(() => window.location.reload(), 1500);
                          } catch {
                            alert("Invalid backup file.");
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* ANDROID BOTTOM NAVIGATION BAR */}
          <div className="bg-white border-t border-slate-200 px-1 py-1 flex justify-around items-center shrink-0 shadow-lg select-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg flex-1 cursor-pointer transition ${
                activeTab === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span className="text-[9px] mt-0.5">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('collect')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg flex-1 cursor-pointer transition ${
                activeTab === 'collect' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Wallet className="w-4.5 h-4.5" />
              <span className="text-[9px] mt-0.5">Donations</span>
            </button>

            <button
              onClick={() => setActiveTab('pledges')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg flex-1 cursor-pointer transition ${
                activeTab === 'pledges' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <HeartHandshake className="w-4.5 h-4.5" />
              <span className="text-[9px] mt-0.5">Pledges</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg flex-1 cursor-pointer transition ${
                activeTab === 'reports' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              id="tab-reports"
            >
              <AlertCircle className="w-4.5 h-4.5" />
              <span className="text-[9px] mt-0.5">Missed</span>
            </button>

            <button
              onClick={() => setActiveTab('contributors')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg flex-1 cursor-pointer transition ${
                activeTab === 'contributors' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              id="tab-contributors"
            >
              <Users className="w-4.5 h-4.5" />
              <span className="text-[9px] mt-0.5">DB Users</span>
            </button>

            {loggedInUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('staff')}
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg flex-1 cursor-pointer transition ${
                  activeTab === 'staff' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
                id="tab-staff"
              >
                <UserCheck className="w-4.5 h-4.5" />
                <span className="text-[9px] mt-0.5">Staff</span>
              </button>
            )}
          </div>

        </div>
      }

    </DeviceFrame>
  </>
  );
}
