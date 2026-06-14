import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Contributor, ContributionTarget, Contribution, UserRole, ContributorType, Pledge } from '../types';
import { Search, Hash, Smartphone, DollarSign, Wallet, Calendar, CheckSquare, Trash2, Send, Share2, Clipboard, Lock, Info, PlusCircle, Trash, Edit, Check, UserPlus, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CollectionModuleProps {
  contributors: Contributor[];
  pledges: Pledge[];
  targets: ContributionTarget[];
  contributions: Contribution[];
  currentUserRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onAddContribution: (newContribution: Contribution) => void;
  onDeleteContribution: (id: string) => void;
  onUpdateContribution: (updated: Contribution) => void;
  onTriggerNotification: (title: string, message: string) => void;
  onAddContributor?: (newContributor: Contributor) => void;
  onUpdatePledge?: (updatedPledge: Pledge) => void;
}

export default function CollectionModule({
  contributors,
  pledges = [],
  targets,
  contributions,
  currentUserRole,
  currentUserId,
  currentUserName,
  onAddContribution,
  onDeleteContribution,
  onUpdateContribution,
  onTriggerNotification,
  onAddContributor,
  onUpdatePledge
}: CollectionModuleProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContributor, setSelectedContributor] = useState<any | null>(null);
  
  // Custom temporary collection mode states
  const [collectMode, setCollectMode] = useState<'search' | 'custom'>('search');
  const [customName, setCustomName] = useState("");
  const [customMobile, setCustomMobile] = useState("");
  const [customType, setCustomType] = useState<ContributorType>('onetime');
  const [saveToDb, setSaveToDb] = useState(false);

  // Form states
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  
  // Active receipt display state for simulated sharing
  const [activeReceipt, setActiveReceipt] = useState<Contribution | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Edit transactions states (Admin-only)
  const [editingContributionId, setEditingContributionId] = useState<string | null>(null);
  const [editAmountPaid, setEditAmountPaid] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const downloadReceiptAsPDF = (rec: Contribution) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a6'
      });

      const primaryColor = [4, 120, 87];   
      const darkSlate = [30, 41, 59];      
      const lightBackdrop = [240, 253, 244]; 

      // Draw Header Block
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 105, 20, 'F');

      // Header Branding
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("DONATION RECEIPT", 52.5, 9, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.text("CONTRIBUTIONS MANAGEMENT SYSTEM", 52.5, 14, { align: "center" });

      // Visual border box container
      doc.setDrawColor(200, 230, 210);
      doc.setLineWidth(0.3);
      doc.rect(4, 25, 97, 112);

      // Metadata grid
      doc.setTextColor(110, 120, 130);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text("RECEIPT NO:", 8, 32);
      
      doc.setFont("courier", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
      doc.text(rec.id, 28, 31.8);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(110, 120, 130);
      doc.text("DATE:", 64, 32);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
      doc.text(new Date(rec.datePaid).toLocaleDateString(), 76, 31.8);

      // Dotted horizontal line separator
      doc.setDrawColor(200, 200, 200);
      let dashedX = 8;
      while (dashedX <= 97) {
        doc.line(dashedX, 36, dashedX + 1.2, 36);
        dashedX += 2.5;
      }

      // Contributor Header info block
      doc.setTextColor(5, 150, 105);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.text("CONTRIBUTOR PROFILE DETAILS", 8, 42);

      doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text(rec.contributorName, 8, 48);

      doc.setFont("courier", "normal");
      doc.setFontSize(7);
      doc.setTextColor(70, 80, 90);
      doc.text(`ID: ${rec.contributorId}`, 8, 53);
      doc.text(`Mobile: +91 ${rec.contributorMobile}`, 8, 57);

      // Separator
      dashedX = 8;
      while (dashedX <= 97) {
        doc.line(dashedX, 62, dashedX + 1.2, 62);
        dashedX += 2.5;
      }

      // Goal Purpose block
      doc.setTextColor(5, 150, 105);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.text("RECEIPT GOAL / INVESTMENT CATEGORY", 8, 68);

      doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      const splitTargetText = doc.splitTextToSize(rec.targetName, 88);
      doc.text(splitTargetText, 8, 74);

      // Amount Banner Solid Box
      const boxY = 88;
      doc.setFillColor(lightBackdrop[0], lightBackdrop[1], lightBackdrop[2]);
      doc.rect(8, boxY, 89, 16, 'F');
      
      doc.setDrawColor(5, 150, 105);
      doc.setLineWidth(0.4);
      doc.rect(8, boxY, 89, 16, 'S');

      doc.setTextColor(4, 120, 87);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("TOTAL PAID AMOUNT:", 13, boxY + 10);

      doc.setFont("courier", "bold");
      doc.setFontSize(11);
      doc.setTextColor(4, 120, 87);
      doc.text(`Rs. ${rec.amountPaid}/-`, 58, boxY + 10.5);

      // Verification seal
      doc.setTextColor(110, 120, 130);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.text("SECURITY AUDIT TRAIL LOGS", 8, 113);

      doc.setTextColor(70, 80, 90);
      doc.setFont("helvetica", "bold");
      doc.text(`Collected By: ${rec.collectedByUserName}`, 8, 118);
      doc.text(`Collector Reference ID: ${rec.collectedByUserId}`, 8, 122);

      doc.setFont("courier", "italic");
      doc.setFontSize(5.5);
      doc.setTextColor(120, 130, 140);
      doc.text(`Doc UUID: CM-TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 8, 127);

      // Sealed badge watermark
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(4, 120, 87);
      doc.setLineWidth(0.5);
      doc.ellipse(82, 119, 10, 6, 'S');
      
      doc.setTextColor(4, 120, 87);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text("PAID", 82, 119.5, { align: "center" });

      // Bottom footer information
      doc.setTextColor(130, 140, 150);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.5);
      doc.text("Thank you for your donation. This document verifies the receipt", 52.5, 141, { align: "center" });
      doc.text("and registration of funds inside our records.", 52.5, 144, { align: "center" });

      // Robust download fallback for iframe contexts
      try {
        const blob = doc.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `receipt-${rec.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 100);
      } catch (e) {
        console.warn("Iframe native download helper failed: ", e);
        doc.save(`receipt-${rec.id}.pdf`);
      }

      onTriggerNotification("PDF Receipt Generated 📄", `Payment receipt compiled successfully for ${rec.contributorName} (₹${rec.amountPaid}).`);
    } catch (err: any) {
      console.error(err);
      alert("Error building PDF file: " + err.message);
    }
  };

  // Search contributors and special pledges (including fully paid ones for extra donations)
  const filteredContributors = searchQuery.trim() === "" 
    ? [] 
    : [
        // Map standard contributors
        ...contributors.map(c => ({
          ...c,
          isPledge: false,
        })),
        // Map pledges (including fully paid ones so extra contribution can be logged)
        ...pledges.map(p => ({
          id: p.id,
          name: p.name,
          mobile: p.mobile,
          type: 'pledge' as any,
          expectedAmount: p.promisedAmount - p.amountPaid, // Outstanding balance, can be <= 0
          createdAt: p.createdAt,
          isPledge: true,
          pledgeObj: p,
        }))
      ].filter(item => {
        const query = searchQuery.toLowerCase();
        return (
          item.id.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.mobile.includes(query)
        );
      });

  const selectContributor = (c: any) => {
    setSelectedContributor(c);
    setSearchQuery(""); // Clear lookup search
    // Autoselect standard target if monthly, or first active target
    if (c.isPledge && c.pledgeObj) {
      setSelectedTargetId(c.pledgeObj.targetId);
      const remainingAmount = c.pledgeObj.promisedAmount - c.pledgeObj.amountPaid;
      setAmountPaid(remainingAmount > 0 ? String(remainingAmount) : "500");
    } else if (c.type === 'monthly') {
      const monthlyTarget = targets.find(t => t.category === 'monthly' && t.status === 'active');
      setSelectedTargetId(monthlyTarget?.id || targets[0]?.id || "");
      setAmountPaid(c.expectedAmount ? String(c.expectedAmount) : "500");
    } else {
      setSelectedTargetId(targets[0]?.id || "");
      setAmountPaid("500");
    }
  };

  const getAmountCollectedForTarget = (targetId: string) => {
    return contributions
      .filter(c => c.targetId === targetId)
      .reduce((sum, c) => sum + c.amountPaid, 0);
  };

  const handleCollect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContributor || !selectedTargetId || !amountPaid) return;

    const targetObj = targets.find(t => t.id === selectedTargetId);
    if (!targetObj) return;

    // Check if the goal target has reached 100% already
    const currentCollected = getAmountCollectedForTarget(selectedTargetId);
    if (currentCollected >= targetObj.targetAmount) {
      alert("Target achieved for this Goal! Please contact admin to modify /increase the target Limit.");
      return;
    }

    const receiptId = `REC-${Date.now().toString().slice(-4)}`;
    
    // Determine the final contributor properties (might be converted to a DB record)
    let finalContributorId = selectedContributor.id;
    let finalContributorName = selectedContributor.name;
    let finalContributorMobile = selectedContributor.mobile;
    let finalContributorType = selectedContributor.type;

    const isCustomTemp = (selectedContributor as any).isCustomTemp;
    const shouldSaveToDb = (selectedContributor as any).saveToDb;

    if (isCustomTemp && shouldSaveToDb && onAddContributor) {
      // Determine highest current ID number to generate next consecutive sequence
      const ids = contributors
        .map(c => Number(c.id.replace('CONTR-', '')))
        .filter(num => !isNaN(num));
      const nextNum = ids.length > 0 ? Math.max(...ids) + 1 : 1001;
      const realId = `CONTR-${nextNum}`;

      const newContributor: Contributor = {
        id: realId,
        name: selectedContributor.name.trim(),
        mobile: selectedContributor.mobile.trim(),
        type: selectedContributor.type,
        createdAt: new Date().toISOString().slice(0, 10)
      };

      onAddContributor(newContributor);
      finalContributorId = realId;
      onTriggerNotification(
        "Saved Contributor 👤",
        `Permanently registered "${selectedContributor.name}" with ID "${realId}" in the database.`
      );
    }

    const newContribution: Contribution = {
      id: receiptId,
      contributorId: finalContributorId,
      contributorName: finalContributorName,
      contributorMobile: finalContributorMobile,
      contributorType: finalContributorType,
      targetId: selectedTargetId,
      targetName: targetObj.name,
      amountPaid: Number(amountPaid),
      datePaid: new Date().toISOString(),
      collectedByUserId: currentUserId,
      collectedByUserName: currentUserName,
      receiptUrl: `https://cm-receipts.net/${receiptId.toLowerCase()}`
    };

    onAddContribution(newContribution);
    
    // If this payment is collecting on a Pledge, update the Pledge status and paid amount!
    if (selectedContributor.isPledge && selectedContributor.pledgeObj && onUpdatePledge) {
      const p = selectedContributor.pledgeObj as Pledge;
      const parsedAmount = Number(amountPaid);
      const nextPaid = p.amountPaid + parsedAmount;
      const nextStatus = nextPaid >= p.promisedAmount ? 'fully_paid' : 'partially_paid';
      const updatedPledge: Pledge = {
        ...p,
        amountPaid: nextPaid,
        status: nextStatus
      };
      onUpdatePledge(updatedPledge);
      onTriggerNotification(
        "Pledge Progress Recorded 🤝",
        `Collected ₹${parsedAmount} for ${p.name}'s pledge. Total pledge paid is ₹${nextPaid} (Status: ${nextStatus.toUpperCase().replace('_', ' ')}).`
      );
    }
    
    // Auto trigger push notice alerting the OTP simulator that simulated receipts are active
    onTriggerNotification(
      "Receipt Generated!", 
      `Instant receipt created for ${finalContributorName} (Amount: ₹${amountPaid}).`
    );

    // Show visual mock Receipt Dialog
    setActiveReceipt(newContribution);
    setShowReceiptModal(true);

    // Automatically trigger PDF receipt download in real format!
    downloadReceiptAsPDF(newContribution);

    // Reset selectors
    setSelectedContributor(null);
    setAmountPaid("");

    // Reset custom contributor states so next custom donation is clean
    setCustomName("");
    setCustomMobile("");
    setSaveToDb(false);
  };

  // Generate formatting message content for Whatsapp texting
  const getShareMessage = (rec: Contribution) => {
    return `*Receipt Received* ✅\n\nDear *${rec.contributorName}*,\nThank you for your valuable contribution:\n\n` +
           `• *Receipt ID:* ${rec.id}\n` +
           `• *For:* ${rec.targetName}\n` +
           `• *Amount Paid:* ₹${rec.amountPaid}\n` +
           `• *Date:* ${new Date(rec.datePaid).toLocaleDateString()}\n` +
           `• *Collected By:* ${rec.collectedByUserName}\n\n` +
           `Click to view receipt detail:\n${rec.receiptUrl}`;
  };

  const copyReceiptText = (rec: Contribution) => {
    const textStr = getShareMessage(rec);
    navigator.clipboard.writeText(textStr);
    onTriggerNotification("Copied to Clipboard", "Formatted receipt message successfully copied!");
  };

  const shareViaWhatsApp = (rec: Contribution) => {
    const textStr = getShareMessage(rec);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${rec.contributorMobile}&text=${encodeURIComponent(textStr)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Admin and users actions
  const startEditAmount = (contribution: Contribution) => {
    if (currentUserRole !== 'admin') {
      alert("Access Denied: Collectors cannot modify payments once they are saved.");
      return;
    }
    setEditingContributionId(contribution.id);
    setEditAmountPaid(String(contribution.amountPaid));
  };

  const saveEditAmount = (contribution: Contribution) => {
    const updated = {
      ...contribution,
      amountPaid: Number(editAmountPaid)
    };
    onUpdateContribution(updated);
    setEditingContributionId(null);
    onTriggerNotification("Modified Successful", `Updated ${contribution.id} payment to ₹${editAmountPaid}.`);
  };

  const handleTxDelete = (id: string) => {
    if (currentUserRole !== 'admin') {
      alert("Unauthorized! Only Administrators hold authority to delete contribution payments.");
      return;
    }
    setConfirmDeleteId(id);
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* Upper info section */}
      <div>
        <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-1.5">
          <Wallet className="w-5 h-5 text-indigo-600" />
          Collect Donations
        </h2>
        <p className="text-xs text-slate-500">Record a payment received from a active contributor</p>
      </div>

      {/* Core Selection Module & Payment Fields */}
      {!selectedContributor ? (
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Step 1: Locate Contributor or Enter Details
            </label>
          </div>

          {/* Quick Dual Tab Selector inside Collection Screen */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-start w-fit">
            <button
              type="button"
              onClick={() => setCollectMode('search')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                collectMode === 'search' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Database</span>
            </button>
            <button
              type="button"
              id="new-guest-tab-btn"
              onClick={() => setCollectMode('custom')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                collectMode === 'custom' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New / Guest Donor</span>
            </button>
          </div>

          {collectMode === 'search' ? (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Contributor Name, Mobile, unique ID..."
                  className="w-full text-xs pl-9 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Quick results selection */}
              {searchQuery.trim() !== "" && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 border border-slate-200 rounded-xl max-h-48 overflow-y-auto bg-white divide-y divide-slate-100 shadow-md"
                >
                  {filteredContributors.map(c => (
                    <button
                      key={c.id}
                      onClick={() => selectContributor(c)}
                      className="w-full text-left p-3 hover:bg-indigo-50 flex justify-between items-center transition"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800">{c.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{c.id} • {c.mobile}</div>
                      </div>
                      <span className={`text-[9px] font-bold py-0.5 px-2 rounded-full uppercase ${
                        c.type === 'monthly' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {c.type}
                      </span>
                    </button>
                  ))}
                  {filteredContributors.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400 font-semibold">
                      No matching contributor found matching search text.
                    </div>
                  )}
                </motion.div>
              )}

              <div className="flex gap-2 p-2.5 bg-indigo-50 rounded-lg text-indigo-700 text-[11px] font-medium leading-relaxed">
                <Info className="w-4 h-4 shrink-0 stroke-[2.5]" />
                <span>Type any text above (e.g. "Rajesh" or "CONTR-1001") to trigger lookup engine records.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-[11px] text-amber-800 leading-relaxed font-medium">
                Enter details below to record a donation from a person who is not database-bound. Selecting the checkbox registers them permanently in the database during donation.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Donor Full Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Subhash Deshmukh"
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800"
                    id="custom-donor-name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Mobile number</label>
                  <input
                    type="text"
                    value={customMobile}
                    onChange={(e) => setCustomMobile(e.target.value)}
                    placeholder="10 digit Indian carrier"
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800"
                    id="custom-donor-mobile"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Frequency Group</label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as ContributorType)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="onetime">One-time / Guest</option>
                    <option value="monthly">Monthly Contributor</option>
                  </select>
                </div>
                <div className="flex items-center pt-4">
                  {currentUserRole === 'admin' ? (
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveToDb}
                        onChange={(e) => setSaveToDb(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-650 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        id="save-to-db-checkbox"
                      />
                      <div className="leading-tight">
                        <span className="text-[11px] font-extrabold text-slate-700 block">Add to system database</span>
                        <span className="text-[9px] text-slate-400 block font-medium">Saves profile for future logs</span>
                      </div>
                    </label>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-400 italic text-[11px] leading-tight select-none">
                      <Lock className="w-3.5 h-3.5 shrink-0 text-slate-300" />
                      <div>
                        <span className="font-semibold block text-slate-500">Database Save Locked</span>
                        <span className="text-[9px] block text-slate-400">Only Admins create profiles</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!customName.trim()) {
                    alert("Please enter the donor's name.");
                    return;
                  }
                  if (!/^\d{10}$/.test(customMobile.trim())) {
                    alert("Please specify a valid 10-digit mobile number.");
                    return;
                  }
                  
                  // Setup temporary contributor object with flag
                  const tempContr: Contributor & { isCustomTemp: boolean; saveToDb: boolean } = {
                    id: `TEMP-GUEST-${Date.now().toString().slice(-4)}`,
                    name: customName.trim(),
                    mobile: customMobile.trim(),
                    type: customType,
                    createdAt: new Date().toISOString(),
                    isCustomTemp: true,
                    saveToDb: saveToDb
                  };

                  setSelectedContributor(tempContr);
                  // Default to first target
                  setSelectedTargetId(targets[0]?.id || "");
                  setAmountPaid(customType === 'monthly' ? "500" : "1000");
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
                id="continue-custom-collect-btn"
              >
                <span>Continue to Collection Target</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4"
        >
          {/* Chosen Contributor Header info card */}
          <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Active Selector:</div>
              <h3 className="text-sm font-bold text-slate-800 font-display mt-0.5">{selectedContributor.name}</h3>
              <p className="text-[10px] text-slate-500 font-mono">
                {selectedContributor.id.startsWith("TEMP-GUEST-") 
                  ? `New / Guest Donor ${((selectedContributor as any).saveToDb ? ' (Will add to database)' : ' (Unsaved)')}`
                  : selectedContributor.id
                } • {selectedContributor.mobile}
              </p>
            </div>
            <button 
              onClick={() => {
                setSelectedContributor(null);
                // Also clear custom forms so they are pristine when they click Change
                setCustomName("");
                setCustomMobile("");
                setSaveToDb(false);
              }}
              className="text-[10px] bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-700 py-1 px-2.5 rounded-md transition cursor-pointer"
            >
              Change Contributor
            </button>
          </div>

          {/* Payment submission form fields */}
          <form onSubmit={handleCollect} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Goal / Purpose Target
              </label>
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 font-medium cursor-pointer"
                required
              >
                <option value="" disabled>-- Choose Collection Goal --</option>
                {targets.filter(t => t.status === 'active').map(t => {
                  const collected = getAmountCollectedForTarget(t.id);
                  const isAchieved = collected >= t.targetAmount;
                  return (
                    <option key={t.id} value={t.id}>
                      [{t.category.toUpperCase()}] {t.name} {isAchieved ? '(Achieved - Locked 🔒)' : `(Progress: ₹${collected}/₹${t.targetAmount})`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Receipt Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full text-xs pl-7 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 font-bold text-slate-800"
                  required
                />
              </div>
              {selectedContributor.type === 'monthly' && selectedContributor.expectedAmount && (
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Standard expected amount for {selectedContributor.name}: ₹{selectedContributor.expectedAmount} / month
                </p>
              )}
              {selectedContributor.isPledge && selectedContributor.pledgeObj && (
                <p className="text-[10px] text-indigo-600 mt-1 italic font-medium">
                  Assigned Pledge: {selectedContributor.pledgeObj.targetName} • Promised: ₹{selectedContributor.pledgeObj.promisedAmount} • Cleared: ₹{selectedContributor.pledgeObj.amountPaid} {selectedContributor.pledgeObj.promisedAmount - selectedContributor.pledgeObj.amountPaid <= 0 && '(Fully Cleared • Extra donation allowed!)'}
                </p>
              )}
            </div>

            {/* Target Achieved Alert Message */}
            {selectedTargetId && (() => {
              const selectedTargetObj = targets.find(t => t.id === selectedTargetId);
              if (!selectedTargetObj) return null;
              const collected = getAmountCollectedForTarget(selectedTargetObj.id);
              const isAchieved = collected >= selectedTargetObj.targetAmount;
              if (!isAchieved) return null;

              return (
                <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-rose-800 text-[11px] leading-relaxed font-semibold flex gap-2 items-start" id="target-achieved-blocker-info">
                  <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block text-rose-950 mb-0.5">Target Achieved for this Goal</span>
                    New contributions cannot be accepted because this goal has hit its target limit. Please contact an administrator to modify or increase the target Limit.
                  </div>
                </div>
              );
            })()}

            {/* Simulated staff author */}
            <div className="bg-emerald-50 text-emerald-950 rounded-lg p-2.5 text-[10px] border border-emerald-100 flex items-center gap-1.5 font-medium">
              <CheckSquare className="w-3.5 h-3.5 stroke-[2.5] text-emerald-600" />
              <span>Logging transaction as: <strong>{currentUserName}</strong> ({currentUserRole})</span>
            </div>

            {(() => {
              const selectedTargetObj = targets.find(t => t.id === selectedTargetId);
              const isBlocked = selectedTargetObj ? getAmountCollectedForTarget(selectedTargetObj.id) >= selectedTargetObj.targetAmount : false;

              return (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedContributor(null);
                      setCustomName("");
                      setCustomMobile("");
                      setSaveToDb(false);
                    }}
                    className="w-1/3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3 rounded-xl border border-rose-200 transition cursor-pointer text-xs text-center animate-fade-in animate-pulse-subtle"
                    id="cancel-collection-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBlocked}
                    className={`flex-1 font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 text-xs ${
                      isBlocked 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                        : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white cursor-pointer'
                    }`}
                    id="submit-receipt-btn"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Confirm & Generate Digital Receipt</span>
                  </button>
                </div>
              );
            })()}
          </form>
        </motion.div>
      )}

      {/* HISTORIC TRANSACTION LOGS LIST (Subject to objective 7 permission rules) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider px-1">
          Recent Payments Log
        </h3>

        <div className="space-y-2 max-h-80 overflow-y-auto rounded-xl">
          {contributions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-lg border border-slate-150">
              No contributions payment recorded yet.
            </div>
          ) : (
            contributions.slice().reverse().map(c => {
              const isAdmin = currentUserRole === 'admin';
              const isEditing = editingContributionId === c.id;

              return (
                <div key={c.id} className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-xs flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[12px] font-bold text-slate-800 tracking-tight truncate">
                        {c.contributorName}
                      </h4>
                      <span className="text-[9px] font-mono text-slate-400 font-bold bg-slate-100 py-0.2 px-1 rounded">
                        {c.id}
                      </span>
                    </div>

                    <p className="text-[11px] text-indigo-600 font-semibold truncate mt-0.5">
                      {c.targetName}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5 text-[10px] text-slate-400">
                      <span>Date: {new Date(c.datePaid).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="truncate">By: {c.collectedByUserName}</span>
                    </div>
                  </div>

                  {/* Payment edit view / state */}
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 text-xs">₹</span>
                        <input
                          type="number"
                          value={editAmountPaid}
                          onChange={(e) => setEditAmountPaid(e.target.value)}
                          className="w-16 p-1 border border-slate-300 rounded text-xs text-right text-slate-800 font-bold bg-slate-50 focus:outline"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEditAmount(c)}
                          className="text-emerald-600 hover:text-emerald-700 p-1"
                          title="Save Changes"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap bg-indigo-50 text-indigo-700 py-1 px-2.5 rounded-lg border border-indigo-100 font-mono">
                        ₹{c.amountPaid}
                      </span>
                    )}

                    {/* Operational triggers */}
                    <div className="flex items-center gap-0.5 ml-1 border-l pl-1 border-slate-200">
                      {/* Anyone can view/share receipt */}
                      <button
                        onClick={() => {
                          setActiveReceipt(c);
                          setShowReceiptModal(true);
                        }}
                        className="text-slate-400 hover:text-indigo-600 hover:bg-slate-100 p-1 rounded transition"
                        title="View digital invoice"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Direct PDF Download */}
                      <button
                        onClick={() => downloadReceiptAsPDF(c)}
                        className="text-slate-400 hover:text-emerald-600 hover:bg-slate-100 p-1 rounded transition"
                        title="Download PDF Receipt"
                        id={`download-pdf-contrib-${c.id}`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      {/* Editing / Deleting is ONLY for Admin (Requirement 7) */}
                      {isAdmin ? (
                        <>
                          {!isEditing && (
                            <button
                              onClick={() => startEditAmount(c)}
                              className="text-slate-400 hover:text-indigo-600 hover:bg-slate-100 p-1 rounded transition"
                              title="Modify payment amount"
                              id={`edit-contrib-${c.id}`}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleTxDelete(c.id)}
                            className="text-slate-400 hover:text-rose-600 hover:bg-slate-100 p-1 rounded transition"
                            title="Delete transaction log"
                            id={`del-contrib-${c.id}`}
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span 
                          className="text-slate-300 p-1 cursor-not-allowed" 
                          title="Policy Lock: Non-admins cannot alter submitted records."
                        >
                          <Lock className="w-3 h-3 text-slate-300" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* REALISTIC INVOICE MODAL POPUP FOR RECEIPTS (Requirement 6) */}
      <AnimatePresence>
        {showReceiptModal && activeReceipt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 text-center text-slate-800"
            >
              {/* Receipt Visual Body */}
              <div className="text-indigo-600 font-bold font-display text-base border-b border-dashed border-slate-200 pb-2 flex items-center justify-center gap-1.5">
                <CheckSquare className="w-5 h-5 text-emerald-500 fill-emerald-100 stroke-[2.5]" />
                DONATION PAYMENT RECEIPT
              </div>

              {/* Invoice Layout Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5 text-left font-sans shadow-inner relative overflow-hidden">
                <div className="absolute top-1 right-2 opacity-5 pointer-events-none">
                  <div className="w-24 h-24 rounded-full border-[10px] border-slate-900 flex items-center justify-center text-5xl">✓</div>
                </div>
                
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>RECEIPT NO: <strong className="text-slate-700">{activeReceipt.id}</strong></span>
                  <span>DATE: {new Date(activeReceipt.datePaid).toLocaleDateString()}</span>
                </div>

                <div className="pt-1.5 border-t border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Contributor Details</div>
                  <p className="text-sm font-bold text-slate-800 font-display mt-0.5">{activeReceipt.contributorName}</p>
                  <p className="text-xs text-slate-500 font-mono">{activeReceipt.contributorId} • {activeReceipt.contributorMobile}</p>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Contribution Purpose</div>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-tight">{activeReceipt.targetName}</p>
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-800">Paid Amount (Received):</span>
                  <span className="text-base font-extrabold text-emerald-600 font-mono">₹{activeReceipt.amountPaid}</span>
                </div>

                <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
                  <span>Collector: {activeReceipt.collectedByUserName}</span>
                  <span className="text-emerald-600 font-bold uppercase tracking-wider">★ PAID OK</span>
                </div>
              </div>

              {/* Notification note */}
              <p className="text-[10.5px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                Receipt saved to cloud database and ready to send. WhatsApp text builds dynamic messages.
              </p>

              {/* PDF Document Download Trigger */}
              <button
                type="button"
                onClick={() => downloadReceiptAsPDF(activeReceipt)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-emerald-500/20"
                id="receipt-modal-download-pdf"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download PDF Receipt</span>
              </button>

              {/* Receipt sharing action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => shareViaWhatsApp(activeReceipt)}
                  className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 rounded-xl border font-sans text-xs flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => copyReceiptText(activeReceipt)}
                  className="bg-slate-150 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Clipboard className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Text Link</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowReceiptModal(false);
                  setActiveReceipt(null);
                }}
                className="w-full bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-slate-800 cursor-pointer text-center"
              >
                Close View
              </button>
            </motion.div>
          </div>
        )}

        {/* Custom Confirmation Dialog Modal for deleting contribution receipt logs */}
        {confirmDeleteId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 text-center text-slate-800"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Trash className="w-6 h-6 text-rose-500" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm text-slate-800">Erase Payment Log</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to delete payment log for receipt <strong className="text-slate-800">"{confirmDeleteId}"</strong>? This reduces cumulative figures.
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
                    onDeleteContribution(confirmDeleteId);
                    onTriggerNotification("Deleted Payment", `Erased invoice profile '${confirmDeleteId}' successfully.`);
                    setConfirmDeleteId(null);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer"
                >
                  Erase Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
