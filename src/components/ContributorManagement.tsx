import React, { useState } from 'react';
import { Contributor, ContributorType, UserRole } from '../types';
import { User, Users, Plus, Edit2, Trash2, Search, Smartphone, Calendar, Hash, ShieldAlert, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContributorManagementProps {
  contributors: Contributor[];
  currentUserRole: UserRole;
  onAddContributor: (newContributor: Contributor) => void;
  onUpdateContributor: (updatedContributor: Contributor) => void;
  onDeleteContributor: (id: string) => void;
}

export default function ContributorManagement({
  contributors,
  currentUserRole,
  onAddContributor,
  onUpdateContributor,
  onDeleteContributor
}: ContributorManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [type, setType] = useState<ContributorType>("monthly");
  const [expectedAmount, setExpectedAmount] = useState("500");

  // Edit states
  const [editName, setEditName] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editType, setEditType] = useState<ContributorType>("monthly");
  const [editExpectedAmount, setEditExpectedAmount] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserRole !== 'admin') {
      alert("Access Denied: Collectors / Sub-users are restricted from creating new profiles.");
      return;
    }
    if (!name || !mobile) return;

    // Mobile Validation (Just numbers & length check)
    if (!/^\d{10}$/.test(mobile.trim())) {
      alert("Invalid mobile! Please check the length. Should be 10 digits.");
      return;
    }

    // Determine highest current ID number to generate next consecutive sequence
    const ids = contributors
      .map(c => Number(c.id.replace('CONTR-', '')))
      .filter(num => !isNaN(num));
    const nextNum = ids.length > 0 ? Math.max(...ids) + 1 : 1001;
    const newId = `CONTR-${nextNum}`;

    const newContributor: Contributor = {
      id: newId,
      name: name.trim(),
      mobile: mobile.trim(),
      type,
      expectedAmount: type === 'monthly' ? Number(expectedAmount) : undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    onAddContributor(newContributor);
    setIsAdding(false);
    setName("");
    setMobile("");
    setType("monthly");
    setExpectedAmount("500");
  };

  const startEdit = (c: Contributor) => {
    if (currentUserRole !== 'admin') {
      alert("Access Denied: Only administrators have full clearance to edit contributor details.");
      return;
    }
    setEditingId(c.id);
    setEditName(c.name);
    setEditMobile(c.mobile);
    setEditType(c.type);
    setEditExpectedAmount(c.expectedAmount ? String(c.expectedAmount) : "0");
  };

  const saveEdit = (id: string) => {
    if (currentUserRole !== 'admin') {
      alert("Unauthorized! Only an admin is permitted to update contributor profiles.");
      return;
    }
    if (!editName || !editMobile) return;

    const updated: Contributor = {
      id,
      name: editName.trim(),
      mobile: editMobile.trim(),
      type: editType,
      expectedAmount: editType === 'monthly' ? Number(editExpectedAmount) : undefined,
      createdAt: contributors.find(c => c.id === id)?.createdAt || new Date().toISOString().slice(0, 10)
    };

    onUpdateContributor(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (currentUserRole !== 'admin') {
      alert("Access Denied: Only administrators can delete records from the system database.");
      return;
    }
    setConfirmDeleteId(id);
  };

  // Filter lists based on text search
  const filteredContributors = contributors.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      c.id.toLowerCase().includes(term) ||
      c.name.toLowerCase().includes(term) ||
      c.mobile.includes(term)
    );
  });

  return (
    <div className="p-4 space-y-4">
      
      {/* Target header info */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-1.5 animate-fade-in">
            <Users className="w-5 h-5 text-indigo-600" />
            Database Contributors
          </h2>
          <p className="text-xs text-slate-500">Add or manage monthly and one-time collectors</p>
        </div>
        
        {currentUserRole === 'admin' ? (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Profile</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 bg-slate-100 text-slate-405 font-display text-[11px] font-bold px-2 py-1 rounded-lg border text-slate-400 select-none" title="Staff are locked from creating profiles">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Locked</span>
          </div>
        )}
      </div>

      {/* Creation form */}
      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 rounded-xl shadow-md border border-slate-100"
        >
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Register Contributor</div>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">FullName</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Subhash Deshmukh"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9876500122"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                  maxLength={10}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Membership</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ContributorType)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                >
                  <option value="monthly">Monthly Contributor</option>
                  <option value="onetime">One-Time Contributor</option>
                </select>
              </div>
            </div>

            {type === 'monthly' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Monthly Payout (₹)</label>
                <input
                  type="number"
                  value={expectedAmount}
                  onChange={(e) => setExpectedAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                />
              </div>
            )}

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
                Submit Profile
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
          placeholder="Search by unique ID, name, or mobile..."
          className="w-full text-xs pl-9 pr-4 py-3 border border-slate-200 rounded-xl bg-white shadow-inner focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
        />
      </div>

      {/* Contributors lists */}
      <div className="space-y-2.5">
        {filteredContributors.map(c => {
          const isEditing = editingId === c.id;

          return (
            <div key={c.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs relative">
              
              {/* Profile badge details */}
              <div className="absolute top-3.5 right-3">
                <span className={`text-[9px] font-bold py-0.5 px-1.5 rounded-full uppercase tracking-wider ${
                  c.type === 'monthly' ? 'bg-indigo-50 text-indigo-700' : 'bg-orange-50 text-orange-700'
                }`}>
                  {c.type}
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-3 text-xs">
                  <div className="text-[11px] font-bold text-indigo-600 mb-1">Modifying Profile: {c.id}</div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Mobile</label>
                      <input
                        type="text"
                        value={editMobile}
                        onChange={(e) => setEditMobile(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Type</label>
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value as any)}
                        className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                      >
                        <option value="monthly">monthly</option>
                        <option value="onetime">onetime</option>
                      </select>
                    </div>
                  </div>

                  {editType === 'monthly' && (
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Expected Monthly Amount (₹)</label>
                      <input
                        type="number"
                        value={editExpectedAmount}
                        onChange={(e) => setEditExpectedAmount(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-300 rounded"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(c.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4.5 py-1"
                      id={`save-edit-${c.id}`}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  {/* Circle avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border uppercase ${
                    c.type === 'monthly' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-orange-50 border-orange-200 text-orange-700'
                  }`}>
                    {c.name.slice(0, 2)}
                  </div>

                  {/* Contact details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight truncate">{c.name}</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-1 gap-x-2 mt-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                        <span className="font-mono text-slate-700 text-[11px] font-bold">{c.id}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono text-[11px] text-slate-600">{c.mobile}</span>
                      </div>
                      {c.type === 'monthly' && c.expectedAmount && (
                        <div className="col-span-2 flex items-center gap-1 text-slate-700 font-medium">
                          <span>Target:</span>
                          <span className="font-semibold text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded">₹{c.expectedAmount} / month</span>
                        </div>
                      )}
                      <div className="col-span-2 flex items-center gap-1 text-[10px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Created: {c.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex flex-col justify-between items-end shrink-0 pl-1">
                    {currentUserRole === 'admin' ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => startEdit(c)}
                          className="text-slate-400 hover:text-indigo-600 hover:bg-slate-100 p-1 rounded-md transition"
                          title="Edit Profile"
                          id={`btn-edit-${c.id}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="text-slate-400 hover:text-rose-600 hover:bg-slate-100 p-1 rounded-md transition"
                          title="Delete Profile"
                          id={`btn-delete-${c.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 flex items-center gap-0.5" title="Collectors can view only">
                        <span>Read Only</span>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          );
        })}

        {filteredContributors.length === 0 && (
          <div className="text-center p-8 bg-white rounded-xl border border-dashed border-slate-300">
            <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-semibold">No contributors match your query.</p>
            <p className="text-[10px] text-slate-400 mt-1">Try another phone number or spelling.</p>
          </div>
        )}
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
                <Trash2 className="w-6 h-6 text-rose-500" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm text-slate-800">Delete Contributor</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you absolutely sure you want to delete contributor <strong className="text-slate-800">"{contributors.find(c => c.id === confirmDeleteId)?.name}"</strong> ({confirmDeleteId})?
                  <br />
                  <span className="text-amber-600 font-semibold text-[10px]">⚠️ This will orphan any relative collection logs from that contributor!</span>
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
                    const matched = contributors.find(c => c.id === confirmDeleteId);
                    if (matched) {
                      onDeleteContributor(matched.id);
                    }
                    setConfirmDeleteId(null);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
