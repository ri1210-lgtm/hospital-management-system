import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  return (
    <div>
      <h2>Users</h2>
      {users.map(u => (
        <p key={u._id}>{u.firstName} {u.lastName} ({u.role})</p>
      ))}
    </div>
  );
};

export default Users;
