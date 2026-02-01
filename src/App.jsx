import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// Pages
import HomePage from "./pages/HomePage";
import MortgagePage from "./pages/MortgagePage";
import CreditPage from "./pages/CreditPage";
import ComparePage from "./pages/ComparePage";
import PrepaymentPage from "./pages/PrepaymentPage";
import RateComparePage from "./pages/RateComparePage";
import GuidesPage from "./pages/GuidesPage";
import GuideDetailPage from "./pages/GuideDetailPage";

// New Pages (법적 필수 페이지)
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ContactPage from "./pages/ContactPage";

import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
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

          {/* 추가된 라우트 */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
