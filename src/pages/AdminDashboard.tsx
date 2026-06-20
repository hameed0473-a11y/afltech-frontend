import { useState } from "react";

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

const ADMIN_USERNAME = "hameed";
const ADMIN_PASSWORD = "Asifa96@";

function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
      loadUsers();
    } else {
      setError("Invalid username or password.");
    }
  };

  const loadUsers = () => {
    setLoading(true);
    setFetchError(false);
    fetch("https://api.aftechs.in/api/auth/users")
      .then((r) => r.json())
      .then((data) => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setFetchError(true); setLoading(false); });
  };

  const handleLogout = () => {
    setAuthed(false);
    setUsername("");
    setPassword("");
    setUsers([]);
  };

  const paid = users.filter((u) => u.is_paid).length;
  const free = users.length - paid;
  const interested = users.filter((u) => u.interested_in_pro && !u.is_paid).length;

  // ── LOGIN SCREEN ──
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: "1rem" }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "2.5rem 2rem", width: "100%", maxWidth: 380 }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: 24 }}>
              🛡
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>Admin Login</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>AFTech Software Limited</div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, color: "#1e293b", background: "#f8fafc", outline: "none" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  style={{ width: "100%", padding: "10px 40px 10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, color: "#1e293b", background: "#f8fafc", outline: "none" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94a3b8" }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#991B1B", marginBottom: "1rem", textAlign: "center" }}>
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              style={{ width: "100%", background: "#0F6E56", color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              Login to Dashboard
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <a href="/" style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none" }}>← Back to AFTech website</a>
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD SCREEN ──
  return (
    <div style={{ padding: "1.5rem 1rem", fontFamily: "sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🛡</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#1e293b" }}>Admin Dashboard</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>AFTech Software Limited</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 13, color: "#64748b" }}>👤 <strong>hameed</strong></div>
          <button
            onClick={handleLogout}
            style={{ fontSize: 12, color: "#991B1B", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontWeight: 600 }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        {[
          { label: "Total users", value: users.length, color: "#0F6E56" },
          { label: "Paid users", value: paid, color: "#1e293b" },
          { label: "Free users", value: free, color: "#1e293b" },
          { label: "Interested in Pro", value: interested, color: "#854F0B", highlight: true },
        ].map((s) => (
          <div key={s.label} style={{ background: s.highlight ? "#FAEEDA" : "#f1f5f9", borderRadius: 10, padding: "1rem" }}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: s.color }}>{loading ? "—" : s.value}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
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

        {loading && <div style={{ padding: "2.5rem", textAlign: "center", color: "#64748b", fontSize: 14 }}>Loading users...</div>}
        {fetchError && <div style={{ padding: "2.5rem", textAlign: "center", color: "#991B1B", fontSize: 14 }}>Could not load users. Check API connection.</div>}
        {!loading && !fetchError && users.length === 0 && <div style={{ padding: "2.5rem", textAlign: "center", color: "#64748b", fontSize: 14 }}>No users registered yet.</div>}

        {!loading && !fetchError && users.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Name", "Mobile", "Email", "Registered", "Logins", "Plan", "Interested"].map((h) => (
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
                    <td style={{ padding: "12px 1.25rem", textAlign: "center" }}>
                      {u.interested_in_pro ? (
                        <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "#FAEEDA", color: "#854F0B", fontWeight: 600 }}>
                          🔥 Yes
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: "#cbd5e1" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <a href="/" style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none" }}>← Back to AFTech website</a>
      </div>
    </div>
  );
}

export default AdminDashboard;
