import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 법적 링크 추가 */}
        <div
          className="footer-links"
          style={{
            display: "flex",
            gap: "1.5rem",
            justifyContent: "center",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          <Link to="/terms" style={{ color: "#666", textDecoration: "none" }}>
            이용약관
          </Link>
          <Link
            to="/privacy"
            style={{
              color: "#666",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            개인정보처리방침
          </Link>
          <Link to="/contact" style={{ color: "#666", textDecoration: "none" }}>
            문의하기
          </Link>
        </div>

        <div className="footer-disclaimer">
          <p>
            본 사이트는 대출 이자 계산 도구를 제공하는 정보 사이트입니다. 대출
            상품 판매, 중개, 모집 등의 영업 행위를 하지 않으며, 특정
            금융상품이나 금융기관을 추천하지 않습니다. 제공되는 모든 정보는
            참고용이며, 실제 대출 조건은 개인별로 다를 수 있습니다. 정확한
            정보는 반드시 해당 금융기관에 직접 확인하시기 바랍니다.
          </p>
        </div>
        <p className="footer-copy">
          &copy; 2026 대출 이자 계산기. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
