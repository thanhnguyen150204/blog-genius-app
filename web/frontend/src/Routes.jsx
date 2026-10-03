import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Studio from "./pages/Studio";
import Keywords from "./pages/Keywords";
import FeatureRequest from "./pages/FeatureRequest";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import Authors from "./pages/Authors";
import Research from "./pages/Research";
import Strategy from "./pages/Strategy";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/studio" element={<Studio />} />
      <Route path="/keywords" element={<Keywords />} />
      <Route path="/feature-request" element={<FeatureRequest />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/authors" element={<Authors />} />
      <Route path="/research" element={<Research />} />
      <Route path="/strategy" element={<Strategy />} />
    </Routes>
  );
}
