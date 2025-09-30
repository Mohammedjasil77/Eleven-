import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/NonAuth/Home/HomePage";
import Registration from "./Pages/Auth/Registration";
import Login from "./Pages/Auth/Login";
import NotFound from "./Pages/NonAuth/NotFound/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
