import React, { useState } from "react";
import api from "../api/axios";

const RegisterPatient = () => {
  const [form, setForm] = useState({ name: "", gender: "", phone: "" });

  const handleSubmit = async () => {
    await api.post("/patients", form);
    alert("Patient Registered");
  };

  return (
    <div>
      <h2>Register New Patient</h2>
      <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Gender" onChange={e=>setForm({...form,gender:e.target.value})}/>
      <input placeholder="Phone" onChange={e=>setForm({...form,phone:e.target.value})}/>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default RegisterPatient;
