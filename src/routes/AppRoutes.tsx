import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import ContractResult from "../pages/ContractResult";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/result" element={<ContractResult />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
