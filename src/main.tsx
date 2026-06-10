import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import { Index } from "./pages/Index";
import { OBSMode } from "./pages/OBSMode";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/obs" element={<OBSMode />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
