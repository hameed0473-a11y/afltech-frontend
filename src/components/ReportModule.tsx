import React, { useState } from 'react';
import { Contributor, ContributionTarget, Contribution } from '../types';
import { AlertCircle, AlertTriangle, MessageSquare, Smartphone, Clock, Calendar, CheckCircle2, CircleDollarSign, Send, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface ReportModuleProps {
  contributors: Contributor[];
  targets: ContributionTarget[];
  contributions: Contribution[];
  onTriggerNotification: (title: string, message: string) => void;
  currentUserRole?: string;
  currentUserId?: string;
  currentUserName?: string;
  onAddContribution?: (newContribution: Contribution) => void;
}

export default function ReportModule({
  contributors,
  targets,
  contributions,
  onTriggerNotification,
  currentUserRole,
  currentUserId,
  currentUserName,
  onAddContribution
}: ReportModuleProps) {
  // Only deal with monthly targets
  const monthlyTargets = targets.filter(t => t.category === 'monthly');
  const [selectedTargetId, setSelectedTargetId] = useState(monthlyTargets[0]?.id || "");

  const activeTarget = targets.find(t => t.id === selectedTargetId);

  // States for cash collection on missed monthly contribution
  const [collectingContributor, setCollectingContributor] = useState<Contributor | null>(null);
  const [collectAmount, setCollectAmount] = useState<string>("");

  // Compute those who paid for this target
  const paidContributorIds = contributions
    .filter(c => c.targetId === selectedTargetId)
    .map(c => c.contributorId);

  // Filter Monthly Contributors who have NOT paid
  const missedContributors = contributors.filter(c => 
    c.type === 'monthly' && !paidContributorIds.includes(c.id)
  );

  // Compute stats
  const totalMonthlyCount = contributors.filter(c => c.type === 'monthly').length;
  const paidCount = totalMonthlyCount - missedContributors.length;
  const missedCount = missedContributors.length;
  const totalMissedAmount = missedContributors.reduce((sum, c) => sum + (c.expectedAmount || 500), 0);
  const totalPaidAmount = contributions
    .filter(c => c.targetId === selectedTargetId)
    .reduce((sum, c) => sum + c.amountPaid, 0);

  const handleSendReminder = (contr: Contributor) => {
    const amount = contr.expectedAmount || 500;
    const targetName = activeTarget ? activeTarget.name : "Monthly Contribution";
    const textStr = `*Payment Outstanding Update* ⚠️\n\nDear *${contr.name}*,\n\nThis is a friendly reminder that your monthly contribution of *₹${amount}* for *${targetName}* is currently pending.\n\nPlease facilitate the dues at your earliest convenience to assist our ongoing target.\n\nThank you for your supportive efforts!`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${contr.mobile}&text=${encodeURIComponent(textStr)}`;
    window.open(whatsappUrl, '_blank');
    onTriggerNotification("Reminder Opened", `Reminder details generated for ${contr.name}.`);
  };

  const notifyAllMissed = () => {
    if (missedContributors.length === 0) return;
    onTriggerNotification(
      "Reminder Broadcast", 
      `Dispatched reminder guidelines for ${missedContributors.length} pending contributors.`
    );
    alert(`This will open WhatsApp reminders sequentially. Click "Send Reminder" individually next to each contributor for optimal results.`);
  };

  const startCollectPayment = (c: Contributor) => {
    setCollectingContributor(c);
    setCollectAmount(String(c.expectedAmount || 500));
  };

  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectingContributor || !collectAmount) return;

    if (!onAddContribution) {
      alert("System error: Collection handler not available.");
      return;
    }

    const value = Number(collectAmount);
    if (isNaN(value) || value <= 0) {
      alert("Please enter a valid contribution amount greater than 0.");
      return;
    }

    const tObj = activeTarget;
    if (!tObj) {
      alert("No active monthly target period selected.");
      return;
    }

    // Check if target is already hit
    const currentCollected = contributions
      .filter(c => c.targetId === selectedTargetId)
      .reduce((sum, c) => sum + c.amountPaid, 0);

    if (currentCollected >= tObj.targetAmount) {
      if (!confirm(`Warning: The target amount of ₹${tObj.targetAmount} is already achieved for this goal. Would you still like to log this over-collection?`)) {
        return;
      }
    }

    const receiptId = `REC-${Date.now().toString().slice(-4)}`;

    const newContribution: Contribution = {
      id: receiptId,
      contributorId: collectingContributor.id,
      contributorName: collectingContributor.name,
      contributorMobile: collectingContributor.mobile,
      contributorType: collectingContributor.type,
      targetId: selectedTargetId,
      targetName: tObj.name,
      amountPaid: value,
      datePaid: new Date().toISOString(),
      collectedByUserId: currentUserId || 'system',
      collectedByUserName: currentUserName || 'System Collector',
      receiptUrl: `https://cm-receipts.net/${receiptId.toLowerCase()}`
    };

    onAddContribution(newContribution);

    onTriggerNotification(
      "Collection Successful 🧾",
      `Successfully registered payment of ₹${value} from ${collectingContributor.name} for ${tObj.name}.`
    );

    setCollectingContributor(null);
    setCollectAmount("");
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header section */}
      <div>
        <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-1.5">
          <AlertCircle className="w-5 h-5 text-indigo-600" />
          Pending Reports (Missed)
        </h2>
        <p className="text-xs text-slate-500">View and remind monthly contributors who missed payments</p>
      </div>

      {/* Target Selector Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Monthly Period
          </label>
          <select
            value={selectedTargetId}
            onChange={(e) => setSelectedTargetId(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 font-medium"
          >
            {monthlyTargets.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.status === 'active' ? 'Active' : 'Completed'})
              </option>
            ))}
            {monthlyTargets.length === 0 && (
              <option value="">No monthly target targets found.</option>
            )}
          </select>
        </div>

        {/* Stats Dashboard Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Paid / Total</div>
            <p className="text-sm font-bold font-display text-emerald-600 mt-1">{paidCount} <span className="text-xs text-slate-400">/ {totalMonthlyCount}</span></p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Unpaid / Missed</div>
            <p className="text-sm font-bold font-display text-rose-500 mt-1">{missedCount}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Unpaid Value</div>
            <p className="text-sm font-bold font-display text-amber-655 mt-1 text-slate-700">₹{totalMissedAmount}</p>
          </div>
        </div>

        <div className="flex gap-1.5 p-2 bg-indigo-50 text-indigo-750 text-[10px] rounded-lg mt-1 leading-normal">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 stroke-[2.5]" />
          <span>This module strictly considers <strong>Monthly Contributors</strong>. One-time contributors are automatically bypassed per business policy.</span>
        </div>
      </div>

      {/* Missed list */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pending List ({missedCount})</span>
          {missedContributors.length > 0 && (
            <button
              onClick={notifyAllMissed}
              className="text-[10px] text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 py-1 px-2.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3 text-rose-600" />
              <span>Broadcast Reminders</span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          {missedContributors.map(c => {
            const expectAmount = c.expectedAmount || 500;
            return (
              <div 
                key={c.id} 
                onClick={() => startCollectPayment(c)}
                className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs flex justify-between items-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/10 active:bg-indigo-50/20 transition-all duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 font-bold border border-rose-100 flex items-center justify-center text-xs">
                    !
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{c.name}</h4>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">{c.id} • {c.mobile}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-rose-500">₹{expectAmount}</span>
                    <span className="text-[9px] text-slate-400 block tracking-tight">Due Amount</span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => startCollectPayment(c)}
                      className="text-[10px] py-1 px-2.5 font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 rounded-lg transition"
                      title="Collect cash outstanding"
                    >
                      Collect
                    </button>

                    <button
                      onClick={() => handleSendReminder(c)}
                      className="p-1.5 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 hover:text-indigo-805 rounded-lg border border-indigo-100 transition shadow-xs flex items-center justify-center cursor-pointer"
                      title="Send reminder through WhatsApp"
                      id={`remind-contr-${c.id}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {missedContributors.length === 0 && (
            <div className="text-center p-8 bg-white border rounded-xl shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs text-slate-800 font-bold">Excellent: All Cleared! 🎉</p>
              <p className="text-[11px] text-slate-400 mt-1">105% of monthly contributors made successful payments for this target.</p>
            </div>
          )}
        </div>
      </div>

      {/* Collect cash collection dialog */}
      {collectingContributor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-55" onClick={() => setCollectingContributor(null)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-150 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-slate-800 text-sm font-bold font-display flex items-center gap-1.5 border-b pb-2">
              <CircleDollarSign className="w-5 h-5 text-emerald-600" />
              Collect Dues: {collectingContributor.name}
            </div>

            <div className="space-y-1.5 text-xs text-slate-500">
              <p>Period: <span className="font-semibold text-slate-700">{activeTarget?.name || "Monthly Target"}</span></p>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-[11px]">
                <div>Expected Standard: <strong>₹{collectingContributor.expectedAmount || 500}</strong></div>
                <div>Contributor ID: <strong>{collectingContributor.id}</strong></div>
                <div className="col-span-2 text-rose-600 font-bold">Pending Amount: ₹{collectingContributor.expectedAmount || 500}</div>
              </div>
            </div>

            <form onSubmit={handleCollectSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Enter Collected Amount (₹)</label>
                <input
                  type="number"
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-emerald-700 bg-slate-50 focus:outline text-xs"
                  autoFocus
                  required
                />
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCollectingContributor(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  Confirm Cash Received
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
