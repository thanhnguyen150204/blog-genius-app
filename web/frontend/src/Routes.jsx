import { Routes, Route } from "react-router-dom";

// Pages (sẽ tạo sau)
// import Dashboard from "./pages/Dashboard";
// import BlogList from "./pages/BlogList";
// import BlogEditor from "./pages/BlogEditor";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Dashboard - Coming Soon</div>} />
      {/* <Route path="/blogs" element={<BlogList />} /> */}
      {/* <Route path="/blogs/new" element={<BlogEditor />} /> */}
    </Routes>
  );
};

export default AppRoutes;
