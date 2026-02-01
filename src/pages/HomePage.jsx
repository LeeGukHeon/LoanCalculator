import { Link } from "react-router-dom";
import AdSense from "../components/common/AdSense"; // 광고 컴포넌트 추가
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

      {/* 상단 광고: Hero 섹션과 카드 메뉴 사이 (주목도 높음) */}
      <AdSense
        slot="3924893287"
        label="Main Top Banner"
        style={{ marginBottom: "3rem" }}
      />

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

      {/* 하단 광고: 페이지 끝 */}
      <AdSense slot="2611811617" label="Main Bottom Banner" />
    </main>
  );
}

export default HomePage;
