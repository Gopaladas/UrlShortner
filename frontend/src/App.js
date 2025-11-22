import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import DashBoard from "./pages/DashBoard/DashBoard";
import Stats from "./pages/Stats/Stats";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/api/links/:code" element={<Stats />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
};

export default App;
