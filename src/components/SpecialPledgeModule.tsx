import React, { useState } from 'react';
import { ContributionTarget, Pledge, Contribution, UserRole, Contributor } from '../types';
import { Calendar, Plus, Handshake, DollarSign, Search, CheckSquare, Shield, Smartphone, HeartHandshake, AlertCircle, RefreshCw, Trash2, ShieldAlert, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpecialPledgeModuleProps {
  targets: ContributionTarget[];
  pledges: Pledge[];
  contributions: Contribution[];
  contributors: Contributor[];
  currentUserRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onAddPledge: (newPledge: Pledge) => void;
  onUpdatePledge: (updatedPledge: Pledge) => void;
  onDeletePledge: (id: string) => void;
  onAddContribution: (newContribution: Contribution) => void;
  onTriggerNotification: (title: string, message: string) => void;
}

export default function SpecialPledgeModule({
  targets,
  pledges,
  contributions = [],
  contributors = [],
  currentUserRole,
  currentUserId,
  currentUserName,
  onAddPledge,
  onUpdatePledge,
  onDeletePledge,
  onAddContribution,
  onTriggerNotification
}: SpecialPledgeModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Form states For Adding Pledges
  const [pledgeName, setPledgeName] = useState("");
  const [pledgeMobile, setPledgeMobile] = useState("");
  const [targetId, setTargetId] = useState("");
  const [amountPromised, setAmountPromised] = useState("");
  
  // State for active focused input field to manage suggestion dropdowns
  const [focusedField, setFocusedField] = useState<'name' | 'mobile' | null>(null);

  // Suggestions filtered dynamically based on current user inputs
  const nameSuggestions = (focusedField === 'name' && pledgeName.trim().length > 0)
    ? (contributors || []).filter(c =>
        c.name.toLowerCase().includes(pledgeName.toLowerCase()) ||
        c.mobile.includes(pledgeName)
      ).slice(0, 5)
    : [];

  const mobileSuggestions = (focusedField === 'mobile' && pledgeMobile.trim().length > 0)
    ? (contributors || []).filter(c =>
        c.name.toLowerCase().includes(pledgeMobile.toLowerCase()) ||
        c.mobile.includes(pledgeMobile)
      ).slice(0, 5)
    : [];
  
  // Quick payment collection overlay state
  const [collectingPledge, setCollectingPledge] = useState<Pledge | null>(null);
  const [collectAmount, setCollectAmount] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Only consider non-monthly targets for pledges/special events
  const specialTargets = targets.filter(t => t.category !== 'monthly');

  const handleCreatePledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserRole !== 'admin') {
       alert("Access Denied: Collectors / Sub-users are restricted from creating new pledge profiles.");
       return;
    }
    if (!pledgeName || !pledgeMobile || !targetId || !amountPromised) return;

    if (!/^\d{10}$/.test(pledgeMobile.trim())) {
      alert("Invalid Mobile! Please provide a standard 10 digit number.");
      return;
    }

    const targetObj = targets.find(t => t.id === targetId);
    if (!targetObj) return;

    const newPledge: Pledge = {
      id: `PLD-${Date.now().toString().slice(-4)}`,
      targetId,
      targetName: targetObj.name,
      name: pledgeName.trim(),
      mobile: pledgeMobile.trim(),
      promisedAmount: Number(amountPromised),
      amountPaid: 0,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onAddPledge(newPledge);
    setIsAdding(false);
    setPledgeName("");
    setPledgeMobile("");
    setAmountPromised("");
    onTriggerNotification("Pledge Registered", `Registered ${pledgeName} for ₹${amountPromised} towards "${targetObj.name}".`);
  };

  const startCollectPledge = (p: Pledge) => {
    setCollectingPledge(p);
    // Suggest the remaining standard balance
    setCollectAmount(String(p.promisedAmount - p.amountPaid));
  };

  const getAmountCollectedForTarget = (targetId: string) => {
    return contributions
      .filter(c => c.targetId === targetId)
      .reduce((sum, c) => sum + c.amountPaid, 0);
  };

  const handleCollectPledgePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectingPledge || !collectAmount) return;

    const targetObj = targets.find(t => t.id === collectingPledge.targetId);
    if (targetObj) {
      const currentCollected = getAmountCollectedForTarget(collectingPledge.targetId);
      if (currentCollected >= targetObj.targetAmount) {
        alert("Target achieved for this Goal! Please contact admin to modify /increase the target Limit.");
        return;
      }
    }

    const collectVal = Number(collectAmount);
    if (collectVal <= 0) {
      alert("Please specify a valid collection amount above zero.");
      return;
    }

    const currentPaid = collectingPledge.amountPaid + collectVal;
    if (currentPaid > collectingPledge.promisedAmount) {
      if (!confirm(`Note: Collected ₹${collectVal} exceeds remaining pledge promise of ₹${collectingPledge.promisedAmount - collectingPledge.amountPaid}. Accept overpayment?`)) {
        return;
      }
    }

    let nextStatus: 'pending' | 'partially_paid' | 'fully_paid' = 'partially_paid';
    if (currentPaid >= collectingPledge.promisedAmount) {
      nextStatus = 'fully_paid';
    } else if (currentPaid === 0) {
      nextStatus = 'pending';
    }

    // 1. Update the pledge state
    const updatedPledge: Pledge = {
      ...collectingPledge,
      amountPaid: currentPaid,
      status: nextStatus
    };
    onUpdatePledge(updatedPledge);

    // 2. Automatically create a general Contribution record so it feeds the master dashboard stats
    const receiptId = `REC-${Date.now().toString().slice(-4)}`;
    const newContribution: Contribution = {
      id: receiptId,
      contributorId: collectingPledge.id, // Linked to the pledge id!
      contributorName: collectingPledge.name,
      contributorMobile: collectingPledge.mobile,
      contributorType: 'onetime',
      targetId: collectingPledge.targetId,
      targetName: collectingPledge.targetName,
      amountPaid: collectVal,
      datePaid: new Date().toISOString(),
      collectedByUserId: currentUserId,
      collectedByUserName: currentUserName,
      receiptUrl: `https://cm-receipts.net/${receiptId.toLowerCase()}`
    };
    onAddContribution(newContribution);

    onTriggerNotification(
      "Payment Harvested", 
      `Collected ₹${collectVal} from ${collectingPledge.name} for ${collectingPledge.targetName}.`
    );

    setCollectingPledge(null);
    setCollectAmount("");

    alert(`Successfully registered payment of ₹${collectVal}! A contribution receipt was generated with ID: ${receiptId}. You can find and share it from the "Receipts/Logs" tab of the Collection pane.`);
  };

  const handleDeletePledgeObj = (id: string, name: string) => {
    if (currentUserRole !== 'admin') {
      alert("Access Denied: Only administrators have privilege clearance to delete registered pledges.");
      return;
    }
    setConfirmDeleteId(id);
  };

  // Filter pledges by text search, with pending / partially paid at the top, and fully paid at the bottom
  const filteredPledges = pledges.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.mobile.includes(term) ||
      p.targetName.toLowerCase().includes(term)
    );
  }).sort((a, b) => {
    const aPaid = a.status === 'fully_paid' ? 1 : 0;
    const bPaid = b.status === 'fully_paid' ? 1 : 0;
    if (aPaid !== bPaid) {
      return aPaid - bPaid; // pending/partially paid (0) before fully paid (1)
    }
    // Deep sorting: 'pending' above 'partially_paid' as well for maximum clarity
    if (a.status === 'pending' && b.status === 'partially_paid') return -1;
    if (a.status === 'partially_paid' && b.status === 'pending') return 1;
    // Otherwise descending chronological
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  return (
    <div className="p-4 space-y-4">
      {/* Target heading info */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-1.5">
            <Handshake className="w-5 h-5 text-indigo-600" />
            Special / Event Pledges
          </h2>
          <p className="text-xs text-slate-500">Register willingness pledges initially and collect now/later</p>
        </div>
        
        {specialTargets.length > 0 && (
          currentUserRole === 'admin' ? (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pledge</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-slate-100 text-slate-400 font-display text-[11px] font-bold px-2 py-1 rounded-lg border select-none" title="Staff of collectors are locked from registering new pledges">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Locked</span>
            </div>
          )
        )}
      </div>

      {specialTargets.length === 0 && (
        <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-100 text-amber-800 text-xs flex gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <div>
            <span className="font-bold">No active Special/Event targets defined.</span>
            <p className="text-[10px] text-amber-700/80 mt-0.5">Please ask the administrator to define a Special/Event target first using the "Goals" panel before adding pledges.</p>
          </div>
        </div>
      )}

      {/* Creation form */}
      {isAdding && specialTargets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 rounded-xl shadow-md border border-slate-100"
        >
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pledge Registration</div>
          <form onSubmit={handleCreatePledge} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Target Event</label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                required
              >
                <option value="" disabled>-- Select Event / Purpose --</option>
                {specialTargets.map(t => (
                  <option key={t.id} value={t.id}>
                    [{t.category.toUpperCase()}] {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 mb-1">FullName of Willing Person</label>
              <input
                type="text"
                value={pledgeName}
                onChange={(e) => {
                  setPledgeName(e.target.value);
                  setFocusedField('name');
                }}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setTimeout(() => setFocusedField(null), 250)}
                placeholder="e.g. Anand Sathe"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                required
              />
              {nameSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-50 divide-y divide-slate-100">
                  {nameSuggestions.map(c => (
                    <div
                      key={c.id}
                      onMouseDown={() => {
                        setPledgeName(c.name);
                        setPledgeMobile(c.mobile);
                        setFocusedField(null);
                      }}
                      className="p-2.5 hover:bg-slate-50 cursor-pointer text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{c.name}</span>
                        <div className="text-[10px] text-slate-400 capitalize">Contributor: {c.type}</div>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-600 font-semibold">{c.mobile}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile number</label>
                <input
                  type="tel"
                  value={pledgeMobile}
                  onChange={(e) => {
                    setPledgeMobile(e.target.value);
                    setFocusedField('mobile');
                  }}
                  onFocus={() => setFocusedField('mobile')}
                  onBlur={() => setTimeout(() => setFocusedField(null), 250)}
                  placeholder="e.g. 9112233445"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                  maxLength={10}
                  required
                />
                {mobileSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-50 divide-y divide-slate-100">
                    {mobileSuggestions.map(c => (
                      <div
                        key={c.id}
                        onMouseDown={() => {
                          setPledgeName(c.name);
                          setPledgeMobile(c.mobile);
                          setFocusedField(null);
                        }}
                        className="p-2.5 hover:bg-slate-50 cursor-pointer text-xs flex justify-between items-center"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{c.name}</span>
                          <div className="text-[10px] text-slate-400 capitalize">Contributor: {c.type}</div>
                        </div>
                        <span className="text-[10px] font-mono text-indigo-600 font-semibold">{c.mobile}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Promised Pledge (₹)</label>
                <input
                  type="number"
                  value={amountPromised}
                  onChange={(e) => setAmountPromised(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 font-bold"
                  required
                />
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
                Register Pledge
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Database Search field */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search pledges by name, mobile, or target..."
          className="w-full text-xs pl-9 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-705"
        />
      </div>

      {/* Pledges lists */}
      <div className="space-y-2.5">
        {filteredPledges.map(p => {
          const remaining = p.promisedAmount - p.amountPaid;
          const isFullyPaid = p.status === 'fully_paid';
          const isPartPaid = p.status === 'partially_paid';

          return (
            <div 
              key={p.id} 
              onClick={() => {
                if (!isFullyPaid) {
                  startCollectPledge(p);
                }
              }}
              className={`bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs relative transition-all ${
                !isFullyPaid ? 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/10 active:bg-indigo-55/20' : ''
              }`}
            >
              
              {/* Event classification watermark */}
              <div className="absolute top-3.5 right-3">
                <span className={`text-[9px] font-bold py-0.5 px-1.5 rounded-full uppercase tracking-wider ${
                  isFullyPaid ? 'bg-emerald-50 text-emerald-700' :
                  isPartPaid ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {p.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex gap-3">
                {/* Handshake graphic avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border uppercase font-display font-black text-xs ${
                  isFullyPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  isPartPaid ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {p.name.slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight leading-tight">{p.name}</h4>
                  <p className="text-[10px] text-pink-600 font-semibold truncate mt-0.5">{p.targetName}</p>
                  
                  <div className="grid grid-cols-2 gap-y-1 gap-x-2 mt-2 text-[10px] text-slate-500 font-mono">
                    <div className="flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.mobile}</span>
                    </div>
                    <div>
                      <span>Pledge ID: <strong className="text-slate-700 text-[9.5px] font-bold">{p.id}</strong></span>
                    </div>

                    <div className="col-span-2 grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-100 font-sans mt-1">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase tracking-tight">Promised</span>
                        <span className="font-bold text-slate-800">₹{p.promisedAmount}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase tracking-tight">Collected</span>
                        <span className="font-bold text-emerald-600">₹{p.amountPaid}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase tracking-tight">Remaining</span>
                        <span className={`font-bold ${remaining > 0 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>₹{remaining}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collecting Actions triggers */}
                <div className="flex flex-col justify-between items-end shrink-0 pl-1">
                  {!isFullyPaid ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startCollectPledge(p);
                      }}
                      className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 font-bold text-[10px] py-1 px-2 rounded-lg transition"
                      id={`collect-pledge-${p.id}`}
                    >
                      Collect Pay
                    </button>
                  ) : (
                    <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 py-0.5 px-2 rounded-lg">Cleard</span>
                  )}

                  {currentUserRole === 'admin' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePledgeObj(p.id, p.name);
                      }}
                      className="text-slate-400 hover:text-rose-500 hover:bg-slate-100 p-1.5 rounded transition"
                      id={`delete-pledge-${p.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {filteredPledges.length === 0 && (
          <div className="text-center p-8 bg-white border border-slate-205 rounded-xl">
            <HeartHandshake className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-semibold">No pledges match your visual search.</p>
            <p className="text-[10px] text-slate-400 mt-1">Authorized collectors can register willing pledges easily.</p>
          </div>
        )}
      </div>

      {/* COLLECT PLEDGE CASH POPUP */}
      <AnimatePresence>
        {collectingPledge && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-55">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-150 shadow-2xl space-y-4"
            >
              <div className="text-slate-800 text-sm font-bold font-display flex items-center gap-1 border-b pb-2">
                <HeartHandshake className="w-4.5 h-4.5 text-indigo-600" />
                Collect Pledge: {collectingPledge.name}
              </div>

              <div className="space-y-1.5 text-xs text-slate-500">
                <p>Event: <span className="font-semibold text-slate-700">{collectingPledge.targetName}</span></p>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-lg border text-[11px]">
                  <div>Pledge Balance: <strong>₹{collectingPledge.promisedAmount}</strong></div>
                  <div>Collected So far: <strong>₹{collectingPledge.amountPaid}</strong></div>
                  <div className="col-span-2 text-rose-600 font-bold">Outstanding Balance: ₹{collectingPledge.promisedAmount - collectingPledge.amountPaid}</div>
                </div>
              </div>

              <form onSubmit={handleCollectPledgePayment} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Enter Paid Amount (₹)</label>
                  <input
                    type="number"
                    value={collectAmount}
                    onChange={(e) => setCollectAmount(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-emerald-700 bg-slate-50 focus:outline text-xs whitespace-nowrap"
                    autoFocus
                    required
                  />
                </div>

                {(() => {
                  const targetObj = targets.find(t => t.id === collectingPledge.targetId);
                  const isBlocked = targetObj ? getAmountCollectedForTarget(targetObj.id) >= targetObj.targetAmount : false;
                  if (!isBlocked) return null;

                  return (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-[11px] leading-relaxed font-semibold flex gap-1.5 items-start">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold block text-rose-950 mb-0.5">Goal Reached 100%</span>
                        This goal has hit its target limit. Please contact an administrator to modify or increase the target Limit.
                      </div>
                    </div>
                  );
                })()}

                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCollectingPledge(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  {(() => {
                    const targetObj = targets.find(t => t.id === collectingPledge.targetId);
                    const isBlocked = targetObj ? getAmountCollectedForTarget(targetObj.id) >= targetObj.targetAmount : false;

                    return (
                      <button
                        type="submit"
                        disabled={isBlocked}
                        className={`font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 ${
                          isBlocked 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                        }`}
                      >
                        Confirm Collection
                      </button>
                    );
                  })()}
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Custom Confirmation Dialog Modal for deleting pledges */}
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
                <h3 className="font-bold text-sm text-slate-800">Remove Special Pledge</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to remove the pledge registered by <strong className="text-slate-800">"{pledges.find(p => p.id === confirmDeleteId)?.name}"</strong>? This action is irreversible.
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
                    const matched = pledges.find(p => p.id === confirmDeleteId);
                    if (matched) {
                      onDeletePledge(matched.id);
                      onTriggerNotification("Pledge Deleted", "Cleared special pledge records successfully.");
                    }
                    setConfirmDeleteId(null);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer"
                >
                  Remove Pledge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
