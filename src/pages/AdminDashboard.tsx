import { useEffect, useState } from "react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://api.aftechs.in/api/auth/users")
      .then(r => r.json())
      .then(setUsers);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Registered Users</h2>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Registered</th>
            <th>Login Count</th>
            <th>Last Login</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u:any)=>(
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.mobile}</td>
              <td>{u.email}</td>
              <td>{u.registration_date}</td>
              <td>{u.login_count}</td>
              <td>{u.last_login}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
