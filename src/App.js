import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import AdminCars from "./Pages/AdminCars";
import ViewCar from "./Pages/ViewCar";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/autos" element={<AdminCars />} />
          <Route path="/admin/autos/:idAuto" element={<ViewCar />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
