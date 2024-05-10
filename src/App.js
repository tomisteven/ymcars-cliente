import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AdminCars from "./Pages/AdminCars";
import ViewCar from "./Pages/ViewCar";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<AdminCars />} />

          <Route path="/admin/autos/:idAuto" element={<ViewCar />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
