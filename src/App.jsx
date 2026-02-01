import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import MortgagePage from "./pages/MortgagePage";
import CreditPage from "./pages/CreditPage";
import ComparePage from "./pages/ComparePage";
import PrepaymentPage from "./pages/PrepaymentPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mortgage" element={<MortgagePage />} />
          <Route path="/credit" element={<CreditPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/prepayment" element={<PrepaymentPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
