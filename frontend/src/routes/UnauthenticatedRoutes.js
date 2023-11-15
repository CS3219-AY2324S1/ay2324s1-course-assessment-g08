import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LogInPage from "../pages/LogIn";
import SignUpPage from "../pages/SignUp";

const UnauthenticatedRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};

export default UnauthenticatedRoutes;
