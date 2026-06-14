import React, { useState } from 'react';
import { ContributionTarget, Contribution, UserRole } from '../types';
import { Target, Plus, Edit2, CheckCircle, Circle, Save, HelpCircle, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TargetModuleProps {
  targets: ContributionTarget[];
  contributions: Contribution[];
  currentUserRole: UserRole;
  onAddTarget: (newTarget: ContributionTarget) => void;
  onUpdateTarget: (updatedTarget: ContributionTarget) => void;
  onDeleteTarget: (targetId: string) => void;
}

export default function TargetModule({
  targets,
  contributions,
  currentUserRole,
  onAddTarget,
  onUpdateTarget,
  onDeleteTarget
}: TargetModuleProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form states For Adding
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<'monthly' | 'special' | 'event'>('monthly');
  const [newTargetAmount, setNewTargetAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  // Editor states For Updating
  const [editTargetAmount, setEditTargetAmount] = useState("");
  const [editStatus, setEditStatus] = useState<'active' | 'completed'>('active');

  // Sum up collections for each target
  const getAmountCollectedForTarget = (targetId: string) => {
    return contributions
      .filter(c => c.targetId === targetId)
      .reduce((sum, c) => sum + c.amountPaid, 0);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserRole !== 'admin') {
      alert("Unauthorized! Only an admin can set goals/targets.");
      return;
    }
    if (!newName || !newTargetAmount) return;

    const newTarget: ContributionTarget = {
      id: `target-${newCategory}-${Date.now().toString().slice(-4)}`,
      name: newName,
      category: newCategory,
      targetAmount: Number(newTargetAmount),
      dueDate: newDueDate || undefined,
      status: 'active'
    };

    onAddTarget(newTarget);
    setIsAdding(false);
    setNewName("");
    setNewTargetAmount("");
    setNewDueDate("");
  };

  const startEdit = (t: ContributionTarget) => {
    setEditingTargetId(t.id);
    setEditTargetAmount(String(t.targetAmount));
    setEditStatus(t.status);
  };

  const saveEdit = (target: ContributionTarget) => {
    if (currentUserRole !== 'admin') {
      alert("Unauthorized! Only admins can modify goals.");
      return;
    }
    const updated: ContributionTarget = {
      ...target,
      targetAmount: Number(editTargetAmount),
      status: editStatus
    };
    onUpdateTarget(updated);
    setEditingTargetId(null);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-1.5">
            <Target className="w-5 h-5 text-indigo-600" />
            Contribution Goals
          </h2>
          <p className="text-xs text-slate-500">Track and define targets for collections</p>
        </div>
        {currentUserRole === 'admin' && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Goal</span>
          </button>
        )}
      </div>

      {/* Adding Goal Box */}
      {isAdding && currentUserRole === 'admin' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl shadow-md border border-slate-150 space-y-3"
        >
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Set New Collection Target</div>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Target Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Monthly - July 2026, Charity Shelter"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                >
                  <option value="monthly">Monthly Collection</option>
                  <option value="event">Event-based</option>
                  <option value="special">Special Purpose</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  value={newTargetAmount}
                  onChange={(e) => setNewTargetAmount(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Target End Date (Optional)</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
              />
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
                Set Target
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Target list */}
      <div className="space-y-3">
        {targets.map(t => {
          const collected = getAmountCollectedForTarget(t.id);
          const percent = Math.min(Math.round((collected / (t.targetAmount || 1)) * 100), 100);
          const isEditing = editingTargetId === t.id;
          const todayStr = new Date().toISOString().slice(0, 10);
          const isCrossed = t.dueDate ? t.dueDate < todayStr : false;

          return (
            <div key={t.id} className={`bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden transition-all ${isCrossed ? 'opacity-55 saturate-50' : ''}`}>
              {/* Category tag */}
              <div className="absolute top-0 right-0">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider block ${
                  t.category === 'monthly' ? 'bg-teal-50 text-teal-700' :
                  t.category === 'event' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {t.category}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start pr-12">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5 flex-wrap">
                      <span>{t.name}</span>
                      {isCrossed && (
                        <span className="text-rose-600 bg-rose-50 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-rose-100 uppercase tracking-widest">
                          Crossed / Faded
                        </span>
                      )}
                    </h3>
                    {t.dueDate && (
                      <p className="text-[10px] text-slate-400 mt-0.5">Due date: {t.dueDate}</p>
                    )}
                  </div>
                  {currentUserRole === 'admin' && !isEditing && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(t)}
                        className="text-slate-400 hover:text-indigo-600 p-1 rounded-md transition cursor-pointer"
                        title="Edit Target"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(t.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition cursor-pointer"
                        title="Delete Goal / Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2 text-xs">
                    <div className="font-semibold text-slate-700 text-[11px] mb-1">Modify Goal Settings:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Target Amount (₹)</label>
                        <input
                          type="number"
                          value={editTargetAmount}
                          onChange={(e) => setEditTargetAmount(e.target.value)}
                          className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Status</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as any)}
                          className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => setEditingTargetId(null)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(t)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1 rounded text-[11px]"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Visual Meter */}
                    <div className="mt-1">
                      <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-900">₹{collected.toLocaleString()}</span>
                          <span className="text-slate-400">of</span>
                          <span className="font-mono text-slate-500">₹{t.targetAmount.toLocaleString()}</span>
                        </div>
                        <span className="font-bold text-indigo-600">{percent}%</span>
                      </div>
                      
                      {/* Meter bar */}
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            t.status === 'completed' ? 'bg-emerald-500' :
                            percent >= 100 ? 'bg-indigo-500 font-bold' :
                            percent >= 75 ? 'bg-emerald-500' :
                            percent >= 40 ? 'bg-amber-400' : 'bg-rose-400'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <div className="flex items-center gap-1">
                        {t.status === 'completed' ? (
                          <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Status: Completed
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded-full animate-pulse">
                            <Circle className="w-2.5 h-2.5" /> Status: Collecting
                          </span>
                        )}
                      </div>
                      
                      {t.targetAmount > collected && (
                        <p className="text-[10px] text-slate-500">
                          Shortfall: <span className="font-mono font-bold text-rose-500">₹{(t.targetAmount - collected).toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {targets.length === 0 && (
          <div className="text-center p-6 bg-white rounded-xl border border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-semibold">No target goals established yet.</p>
            {currentUserRole === 'admin' && (
              <p className="text-[11px] text-slate-400 mt-1">Click is "New Goal" above to define targets.</p>
            )}
          </div>
        )}
      </div>

      {/* Custom Confirmation Dialog Modal for deleting targets/events */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in shadow-2xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 text-center text-slate-800"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-rose-500" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm text-slate-800">Delete Event / Goal</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to delete the event <strong className="text-slate-800">"{targets.find(t => t.id === confirmDeleteId)?.name}"</strong>?
                  <br />
                  <span className="text-amber-600 font-semibold text-[10px]">⚠️ This will clear/disassociate relative receipts and logs from this event!</span>
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
                    const matched = targets.find(t => t.id === confirmDeleteId);
                    if (matched) {
                      onDeleteTarget(matched.id);
                    }
                    setConfirmDeleteId(null);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer"
                >
                  Delete Event
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
