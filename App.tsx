import React, { useState } from "react";
import Header from "./components/Header";
import Tabs from "./components/Tabs";

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div>
      <Header />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div style={{ color: "#fff", padding: 24 }}>
        Conteúdo da aba: {activeTab}
      </div>
    </div>
  );
}

export default App;
