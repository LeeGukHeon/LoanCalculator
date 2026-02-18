import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🏠 대출계산기
        </Link>
        <nav className="nav">
          <Link to="/mortgage" className="nav-link">
            주택담보대출
          </Link>
          <Link to="/credit" className="nav-link">
            신용대출
          </Link>
          <Link to="/compare" className="nav-link">
            상환방식 비교
          </Link>
          <Link to="/prepayment" className="nav-link">
            중도상환
          </Link>
          <Link to="/rates" className="nav-link">
            금리비교
          </Link>
          <Link to="/guides" className="nav-link">
            가이드
          </Link>
          <Link to="/about" className="nav-link">
            운영원칙
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
