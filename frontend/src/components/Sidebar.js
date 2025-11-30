import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../index.css";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const menus = [
    { label: "Dashboard", path: "/", perm: "DASHBOARD" },
    { label: "Patients", path: "/patients", perm: "PATIENT:READ" },
    { label: "Register Patient", path: "/register-patient", perm: "PATIENT:CREATE" },
    { label: "Prescription", path: "/prescription", perm: "PRESCRIPTION:CREATE" },
    { label: "Users", path: "/users", perm: "USER:MANAGE" }
  ];

  const allowedMenus = menus.filter(m =>
    user?.permissions?.includes(m.perm)
  );

  return (
    <div style={{
      width: "230px",
      height: "100vh",
      background: "#0b6623",
      color: "white",
      position: "fixed",
      padding: "20px"
    }}>
      <h2>SANJEEVAN</h2>

      {allowedMenus.map((item) => (
        <p key={item.path}>
          <Link to={item.path} style={{ color: "white", textDecoration: "none" }}>
            {item.label}
          </Link>
        </p>
      ))}

      {user && (
        <>
          <hr />
          <p>{user.firstName} {user.lastName}</p>
          <button onClick={() => { logout(); navigate("/login"); }}>
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
