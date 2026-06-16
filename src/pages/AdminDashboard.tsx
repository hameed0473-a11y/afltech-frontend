import { useEffect, useState } from "react";

function formatDate(str: string | null) {
  if (!str) return "—";
  try {
    return new Date(str).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  } catch { return str; }
}

function initials(name: string) {
  if (!name) return "?";
  return name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    setError(false);
    fetch("https://api.aftechs.in/api/auth/users")
      .then((r) => r.json())
      .then((data) => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  };

  useEffect(() => { loadUsers(); }, []);

  const paid = users.filter((u) => u.is_paid).length;
  const free = users.length - paid;

  return (
    <div style={{ padding: "1.5rem 1rem", fontFamily: "sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#E1F5EE", fontSize: 20 }}>🛡</span>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#1e293b" }}>Admin Dashboard</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>AFLTech — Contributions Manager</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: "1.5rem" }}>
        {[
          { label: "Total users", value: users.length, color: "#0F6E56" },
          { label: "Paid users", value: paid, color: "#1e293b" },
          { label: "Free users", value: free, color: "#1e293b" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#f1f5f9", borderRadius: 10, padding: "1rem" }}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: s.color }}>{loading ? "—" : s.value}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>

        {/* Table header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", display: "flex", alignItems: "center", gap: 8 }}>
            👥 Registered users
            <span style={{ fontSize: 11, background: "#E1F5EE", color: "#0F6E56", padding: "2px 10px", borderRadius: 99 }}>
              {loading ? "..." : `${users.length} users`}
            </span>
          </div>
          <button onClick={loadUsers} style={{ fontSize: 12, color: "#64748b", background: "none", border: "1px solid #e2e8f0", padding: "5px 12px", borderRadius: 8, cursor: "pointer" }}>
            ↻ Refresh
          </button>
        </div>

        {/* States */}
        {loading && <div style={{ padding: "2.5rem", textAlign: "center", color: "#64748b", fontSize: 14 }}>Loading users...</div>}
        {error && <div style={{ padding: "2.5rem", textAlign: "center", color: "#993C1D", fontSize: 14 }}>Could not load users. Check API connection.</div>}
        {!loading && !error && users.length === 0 && <div style={{ padding: "2.5rem", textAlign: "center", color: "#64748b", fontSize: 14 }}>No users registered yet.</div>}

        {/* Table */}
        {!loading && !error && users.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Name", "Mobile", "Email", "Registered", "Logins", "Plan"].map((h) => (
                    <th key={h} style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textAlign: "left", padding: "10px 1.25rem", borderBottom: "1px solid #e2e8f0", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 1.25rem", fontSize: 13 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#0F6E56", flexShrink: 0 }}>
                          {initials(u.username)}
                        </div>
                        <span style={{ color: "#1e293b", fontWeight: 500 }}>{u.username || "—"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 1.25rem", fontSize: 13, color: "#475569" }}>{u.mobile || "—"}</td>
                    <td style={{ padding: "12px 1.25rem", fontSize: 13, color: "#475569", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email || "—"}</td>
                    <td style={{ padding: "12px 1.25rem", fontSize: 13, color: "#475569", whiteSpace: "nowrap" }}>{formatDate(u.registration_date)}</td>
                    <td style={{ padding: "12px 1.25rem", fontSize: 13, color: "#475569", textAlign: "center" }}>{u.login_count ?? 0}</td>
                    <td style={{ padding: "12px 1.25rem" }}>
                      <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: u.is_paid ? "#E1F5EE" : "#FAECE7", color: u.is_paid ? "#0F6E56" : "#993C1D", fontWeight: 600 }}>
                        {u.is_paid ? "Paid" : "Free"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;