import { Link } from "react-router-dom";
import AdSense from "../components/common/AdSense";
import "./HomePage.css";

function HomePage() {
  return (
    <main className="main">
      <section className="hero">
        <h2>대출 이자를 간편하게 계산하세요</h2>
        <p>
          원리금균등, 원금균등, 만기일시 상환 방식을 한눈에 비교하고
          <br />
          2026년 최신 규제(DSR, 스트레스 금리)를 미리 확인해보세요.
        </p>
      </section>

      <section className="calculator-cards">
        <div className="card">
          <h3>🏠 주택담보대출</h3>
          <p>
            주택 구매 시 필요한 대출 이자와
            <br />
            한도(LTV, DTI)를 계산합니다
          </p>
          <Link to="/mortgage" className="btn">
            계산하기
          </Link>
        </div>

        <div className="card">
          <h3>💳 신용대출</h3>
          <p>
            내 연봉과 신용등급에 맞는
            <br />
            최적의 상환 계획을 세워보세요
          </p>
          <Link to="/credit" className="btn">
            계산하기
          </Link>
        </div>

        <div className="card">
          <h3>📊 상환방식 비교</h3>
          <p>
            원리금균등 vs 원금균등 vs 체증식
            <br />
            나에게 유리한 방식 찾기
          </p>
          <Link to="/compare" className="btn">
            비교하기
          </Link>
        </div>

        <div className="card">
          <h3>💰 중도상환</h3>
          <p>
            대출을 미리 갚을 때 발생하는
            <br />
            수수료와 이자 절감액 계산
          </p>
          <Link to="/prepayment" className="btn">
            계산하기
          </Link>
        </div>

        <div className="card">
          <h3>🏦 금리 비교</h3>
          <p>
            5대 시중은행의 최신 금리와
            <br />
            우대 조건을 한눈에 비교
          </p>
          <Link to="/rates" className="btn">
            확인하기
          </Link>
        </div>

        <div className="card">
          <h3>📚 대출 가이드</h3>
          <p>
            어려운 대출 용어와 규제를
            <br />
            알기 쉽게 설명해 드립니다
          </p>
          <Link to="/guides" className="btn">
            읽어보기
          </Link>
        </div>
      </section>

      <section className="home-info-section">
        <h3>왜 이 사이트를 참고해야 하나요?</h3>
        <ul>
          <li>계산기 + 설명형 가이드를 함께 제공해 수치와 의미를 동시에 확인할 수 있습니다.</li>
          <li>정책/규제 문구를 주기적으로 검수하고, 변경 시 계산기와 가이드를 함께 업데이트합니다.</li>
          <li>특정 금융상품 가입 유도가 아닌 비교·이해 중심의 정보만 제공합니다.</li>
        </ul>
        <p>
          자세한 운영 원칙과 검수 정책은 <Link to="/about">사이트 소개/운영원칙</Link> 페이지에서
          확인할 수 있습니다.
        </p>
      </section>

      <AdSense slot="2611811617" label="Main Bottom Banner" />
    </main>
  );
}

export default HomePage;
