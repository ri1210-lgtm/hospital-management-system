import React from "react";
import AppRouter from "./router/AppRouter";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div>
      <Sidebar />
      <div className="app-content">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
