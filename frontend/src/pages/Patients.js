import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Patients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const res = await api.get("/patients");
    setPatients(res.data);
  };

  return (
    <div>
      <h2>Patients</h2>
      {patients.map(p => (
        <p key={p._id}>{p.name} — {p.gender}</p>
      ))}
    </div>
  );
};

export default Patients;
