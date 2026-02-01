import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>💰 대출 이자 계산기</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            홈
          </Link>
          <Link
            to="/mortgage"
            className={location.pathname === "/mortgage" ? "active" : ""}
          >
            주택담보대출
          </Link>
          <Link
            to="/credit"
            className={location.pathname === "/credit" ? "active" : ""}
          >
            신용대출
          </Link>
          <Link
            to="/compare"
            className={location.pathname === "/compare" ? "active" : ""}
          >
            상환방식 비교
          </Link>
          <Link
            to="/prepayment"
            className={location.pathname === "/prepayment" ? "active" : ""}
          >
            중도상환
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
