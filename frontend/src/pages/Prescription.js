import React, { useState } from "react";
import api from "../api/axios";

const Prescription = () => {
  const [data, setData] = useState({
    patientId: "",
    medicine: "",
    dosage: ""
  });

  const savePrescription = async () => {
    await api.post("/prescriptions", data);
    alert("Prescription Saved");
  };

  return (
    <div>
      <h2>Create Prescription</h2>
      <input placeholder="Patient ID" onChange={e=>setData({...data,patientId:e.target.value})}/>
      <input placeholder="Medicine" onChange={e=>setData({...data,medicine:e.target.value})}/>
      <input placeholder="Dosage" onChange={e=>setData({...data,dosage:e.target.value})}/>
      <button onClick={savePrescription}>Save</button>
    </div>
  );
};

export default Prescription;
