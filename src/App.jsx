import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import MortgagePage from "./pages/MortgagePage";
import CreditPage from "./pages/CreditPage";
import ComparePage from "./pages/ComparePage";
import PrepaymentPage from "./pages/PrepaymentPage";
import RateComparePage from "./pages/RateComparePage";
import GuidesPage from "./pages/GuidesPage";
import GuideDetailPage from "./pages/GuideDetailPage";
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
          <Route path="/rates" element={<RateComparePage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:id" element={<GuideDetailPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
