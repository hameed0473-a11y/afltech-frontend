import React, { useState } from 'react';
import { StaffUser, UserRole } from '../types';
import { UserCheck, ShieldAlert, Plus, Shield, Smartphone, Trash, Calendar, Users, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StaffManagementProps {
  staff: StaffUser[];
  currentUserRole: UserRole;
  onAddStaff: (newStaff: StaffUser) => void;
  onDeleteStaff: (id: string) => void;
  onPurgeDatabase: () => void;
  onRestoreDatabase: () => void;
}

export default function StaffManagement({
  staff,
  currentUserRole,
  onAddStaff,
  onDeleteStaff,
  onPurgeDatabase,
  onRestoreDatabase
}: StaffManagementProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [userName, setUserName] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [userRole, setUserRole] = useState<UserRole>('collector');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserRole !== 'admin') {
      alert("Unauthorized: Only Admins can register collectors.");
      return;
    }
    if (!userName || !userMobile) return;

    if (!/^\d{10}$/.test(userMobile.trim())) {
      alert("Invalid number! Please use a 10 digit number.");
      return;
    }

    const existing = staff.find(s => s.mobile === userMobile.trim());
    if (existing) {
      alert(`A staff member with mobile number +91 ${userMobile.trim()} is already registered as a ${existing.role === 'admin' ? 'Partner Admin' : 'Collector Staff'}. Duplicate staff accounts are not allowed.`);
      return;
    }

    const newStaff: StaffUser = {
      id: `staff-${Date.now().toString().slice(-4)}`,
      name: userName.trim(),
      mobile: userMobile.trim(),
      role: userRole,
      registeredAt: new Date().toISOString().slice(0, 10)
    };

    onAddStaff(newStaff);
    setIsAdding(false);
    setUserName("");
    setUserMobile("");
  };

  const handleDelete = (id: string, name: string) => {
    if (id === 'staff-admin-1') {
      alert("Fatal: Root administrator cannot be deleted to prevent locking.");
      return;
    }
    setConfirmDeleteId(id);
  };

  if (currentUserRole !== 'admin') {
    return (
      <div className="p-6 text-center space-y-3">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">Clearance Access Restricted</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Your current authorization clearance is <strong>Collector / User</strong>. Creating and managing authorized collection staff is strictly locked on the Admin terminal level.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header element */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-1.5">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            Authorised Staff
          </h2>
          <p className="text-xs text-slate-500">Manage registered collectors and administrators</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Staff</span>
        </button>
      </div>

      {/* Creation form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl shadow-md border border-slate-100"
        >
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Register Collector/Admin</div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">FullName</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Ramesh Kulkarni"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline bg-slate-50"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile number</label>
                <input
                  type="tel"
                  value={userMobile}
                  onChange={(e) => setUserMobile(e.target.value)}
                  placeholder="e.g. 9845012345"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline bg-slate-50"
                  maxLength={10}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Access Role Privilege</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline bg-slate-50"
                >
                  <option value="collector">Collector (User)</option>
                  <option value="admin">Admin Partner</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs py-1.5 px-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-4 rounded-lg"
              >
                Enroll Staff
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Staff lists */}
      <div className="space-y-2.5">
        {staff.map(s => (
          <div key={s.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs uppercase ${
                s.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {s.name.slice(0, 2)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  {s.name}
                  {s.role === 'admin' ? (
                    <span className="text-[8.5px] font-bold text-purple-700 bg-purple-50 border border-purple-150 px-1 py-0.2 rounded-full uppercase tracking-tight">Admin</span>
                  ) : (
                    <span className="text-[8.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 px-1 py-0.2 rounded-full uppercase tracking-tight">Collector</span>
                  )}
                </h4>
                
                <div className="flex flex-wrap gap-x-2 text-[10px] text-slate-450 font-mono mt-1">
                  <span className="flex items-center gap-0.5"><Smartphone className="w-3 h-3 text-slate-400" /> {s.mobile}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3 text-slate-400" /> Joined {s.registeredAt}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDelete(s.id, s.name)}
              className="text-slate-400 hover:text-rose-600 p-2 rounded transition hover:bg-slate-50"
              disabled={s.id === 'staff-admin-1'}
              id={`delete-staff-${s.id}`}
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* DATABASE ADMINISTRATION PANIC & SEED CONTROLS */}
      <div className="border-t border-slate-200/60 pt-4 mt-2">
        <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex gap-2.5 items-start">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600 font-bold shrink-0">
              <Shield className="w-5 h-5 text-rose-600" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800">Fresh Start Database Guard</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                Wipe clean all contributors, events, collection receipt logs, and pledges instantly to start entirely afresh, or restore the preloaded demo dataset.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setShowPurgeConfirm(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-xl text-[10.5px] flex items-center justify-center gap-1 cursor-pointer transition shadow-xs focus:ring-2 focus:ring-rose-500"
              id="purge-all-data-btn"
            >
              <Trash className="w-3.5 h-3.5" /> Purge & Reset DB
            </button>
            <button
              onClick={() => setShowRestoreConfirm(true)}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-xl text-[10.5px] flex items-center justify-center gap-1 cursor-pointer transition shadow-xs focus:ring-2 focus:ring-slate-700"
              id="restore-demo-data-btn"
            >
              <Users className="w-3.5 h-3.5 text-indigo-300" /> Load Demo Dataset
            </button>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Dialog Modal instead of window.confirm */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 text-center text-slate-800"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Trash className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm text-slate-800">Revoke Staff Access</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you absolutely sure you want to revoke access for <strong className="text-slate-800">"{staff.find(s => s.id === confirmDeleteId)?.name}"</strong>? This action is irreversible.
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-1.5">
                <button
                   type="button"
                   onClick={() => setConfirmDeleteId(null)}
                   className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const matched = staff.find(s => s.id === confirmDeleteId);
                    if (matched) {
                      onDeleteStaff(matched.id);
                    }
                    setConfirmDeleteId(null);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer"
                >
                  Revoke & Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Database PURGE confirmation popup overlay */}
        {showPurgeConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 text-center text-slate-800 animate-fade-in"
            >
              <div className="w-12 h-12 rounded-full bg-rose-55 hover:bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash className="w-6 h-6 text-rose-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-[15px] font-display text-slate-800 tracking-tight">Erase Entire Database?</h3>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  This administrative operation will <strong className="text-rose-600 font-bold">permanently erase</strong> all contributors, events, collection receipt logs, and pledges.
                  <br />
                  <span className="text-amber-600 font-bold mt-1 block">⚠️ This action is irreversible. Your logged-in admin access profile will be preserved.</span>
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-1.5 animate-bounce-in">
                <button
                  type="button"
                  onClick={() => setShowPurgeConfirm(false)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPurgeDatabase();
                    setShowPurgeConfirm(false);
                  }}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer"
                >
                  Yes, Purge All
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Database RESTORE confirmation popup overlay */}
        {showRestoreConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 text-center text-slate-800"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-[15.5px] font-display text-slate-800 tracking-tight">Load Demo Dataset?</h3>
                <p className="text-[11.5px] text-slate-500 font-semibold leading-relaxed">
                  This will reload all preconfigured demonstration events, contributors, collection histories, and pledges. 
                  Any conflicting custom records may be overwritten.
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-1.5">
                <button
                  type="button"
                  onClick={() => setShowRestoreConfirm(false)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRestoreDatabase();
                    setShowRestoreConfirm(false);
                  }}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer"
                >
                  Load Dataset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
