import { useState } from "react";
import AdSense from "../components/common/AdSense"; // 광고 컴포넌트 추가
import "./RateComparePage.css";

function RateComparePage() {
  const [loanType, setLoanType] = useState("mortgage"); // mortgage, credit

  // 2026년 1월 기준 주택담보대출 금리
  const mortgageRates = [
    {
      bank: "NH농협은행",
      minRate: 3.91,
      maxRate: 6.21,
      type: "혼합형",
      benefits: ["급여이체 -0.3%p", "자동이체 -0.2%p", "조합원 우대"],
      link: "https://banking.nonghyup.com",
    },
    {
      bank: "신한은행",
      minRate: 4.09,
      maxRate: 5.5,
      type: "혼합형",
      benefits: [
        "급여이체 -0.5%p",
        "신한카드 실적 -0.2%p",
        "신한플러스 -0.1%p",
      ],
      link: "https://www.shinhan.com",
    },
    {
      bank: "우리은행",
      minRate: 4.1,
      maxRate: 5.3,
      type: "고정·혼합",
      benefits: ["급여이체 -0.4%p", "WON통장 -0.2%p", "우리카드 실적"],
      link: "https://www.wooribank.com",
    },
    {
      bank: "KB국민은행",
      minRate: 4.13,
      maxRate: 6.3,
      type: "혼합·고정",
      benefits: ["급여이체 -0.5%p", "KB카드 실적 -0.3%p", "KB스타클럽"],
      link: "https://www.kbstar.com",
    },
    {
      bank: "하나은행",
      minRate: 4.16,
      maxRate: 5.36,
      type: "혼합형",
      benefits: ["급여이체 -0.4%p", "하나카드 실적 -0.2%p", "하나원큐 -0.1%p"],
      link: "https://www.kebhana.com",
    },
  ];

  // 2026년 1월 기준 신용대출 금리 (직장인)
  const creditRates = [
    {
      bank: "NH농협은행",
      minRate: 5.0,
      maxRate: 7.0,
      type: "직장인",
      benefits: ["급여이체 -0.5%p", "조합원 우대", "자동이체 -0.2%p"],
      link: "https://banking.nonghyup.com",
    },
    {
      bank: "신한은행",
      minRate: 5.1,
      maxRate: 6.7,
      type: "직장인",
      benefits: ["급여이체 -0.6%p", "신한카드 실적 -0.3%p", "SOL뱅크 -0.1%p"],
      link: "https://www.shinhan.com",
    },
    {
      bank: "KB국민은행",
      minRate: 5.2,
      maxRate: 6.9,
      type: "직장인",
      benefits: ["급여이체 -0.5%p", "KB카드 실적 -0.3%p", "KB스타클럽"],
      link: "https://www.kbstar.com",
    },
    {
      bank: "하나은행",
      minRate: 5.3,
      maxRate: 6.8,
      type: "직장인",
      benefits: ["급여이체 -0.5%p", "하나카드 실적 -0.3%p", "하나원큐"],
      link: "https://www.kebhana.com",
    },
    {
      bank: "우리은행",
      minRate: 5.4,
      maxRate: 6.9,
      type: "직장인",
      benefits: ["급여이체 -0.5%p", "WON통장 -0.2%p", "우리카드 실적"],
      link: "https://www.wooribank.com",
    },
  ];

  const currentRates = loanType === "mortgage" ? mortgageRates : creditRates;

  return (
    <main className="main">
      <div className="page-header">
        <h2>🏦 은행별 금리 비교</h2>
        <p>2026년 1월 기준 - 5대 시중은행 최신 금리</p>
      </div>

      {/* 상단 광고: 사용자가 가장 먼저 보는 위치 (높은 단가) */}
      <AdSense slot="3924893287" label="Top Banner" />

      <div className="rate-container">
        {/* 대출 유형 선택 */}
        <div className="input-section">
          <div className="loan-type-buttons">
            <button
              className={`type-btn ${loanType === "mortgage" ? "active" : ""}`}
              onClick={() => setLoanType("mortgage")}
            >
              주택담보대출
            </button>
            <button
              className={`type-btn ${loanType === "credit" ? "active" : ""}`}
              onClick={() => setLoanType("credit")}
            >
              신용대출 (직장인)
            </button>
          </div>
        </div>

        {/* 면책조항 */}
        <div className="disclaimer-box">
          <h4>⚠️ 중요 안내사항</h4>
          <ul>
            <li>
              본 사이트는 <strong>대출 계산 도구</strong>를 제공하는 정보
              사이트이며, <strong>대출 상품 판매나 중개를 하지 않습니다</strong>
            </li>
            <li>
              제공되는 금리 정보는 <strong>참고용</strong>이며, 각 은행의 공식
              홈페이지 및 공시 자료를 기반으로 합니다
            </li>
            <li>
              실제 적용 금리는 개인의 신용도, 소득, 담보 등에 따라 크게 달라질
              수 있습니다
            </li>
          </ul>
        </div>

        {/* SEO 텍스트 추가 (체류 시간 증대) */}
        <div
          className="seo-summary"
          style={{
            background: "#f0f4ff",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            fontSize: "0.95rem",
            lineHeight: "1.6",
            color: "#333",
            borderLeft: "4px solid #0066ff",
          }}
        >
          <p>
            현재 <strong>{currentRates[0].bank}</strong>이(가) 최저 금리{" "}
            <strong>{currentRates[0].minRate}%</strong>로 가장 유리한 조건을
            제공하고 있습니다. 하지만 주거래 실적이나 우대 조건 달성 여부에 따라
            순위가 달라질 수 있으므로, 아래 표에서 상세 조건을 반드시
            확인해보세요.
          </p>
        </div>

        {/* 안내 문구 */}
        <div className="notice-box">
          <h4>💡 금리 안내</h4>
          <ul>
            <li>본 금리는 2026년 1월 기준 공시 금리입니다</li>
            <li>
              개인 신용도, 소득, 우대조건에 따라 실제 금리는 달라질 수 있습니다
            </li>
            <li>우대금리 최대 적용 시 최저 금리까지 가능합니다</li>
          </ul>
        </div>

        {/* 금리 비교 테이블 */}
        <div className="rate-table-wrapper">
          <table className="rate-table">
            <thead>
              <tr>
                <th>순위</th>
                <th>은행</th>
                <th>금리 범위</th>
                <th>최저 금리</th>
                <th>유형</th>
                <th>주요 우대조건</th>
              </tr>
            </thead>
            <tbody>
              {currentRates.map((rate, index) => (
                <tr key={rate.bank} className={index === 0 ? "best-rate" : ""}>
                  <td className="rank">
                    {index === 0 && <span className="badge gold">1위</span>}
                    {index === 1 && <span className="badge silver">2위</span>}
                    {index === 2 && <span className="badge bronze">3위</span>}
                    {index > 2 && (
                      <span className="rank-number">{index + 1}</span>
                    )}
                  </td>
                  <td className="bank-name">{rate.bank}</td>
                  <td className="rate-range">
                    {rate.minRate.toFixed(2)}% ~ {rate.maxRate.toFixed(2)}%
                  </td>
                  <td className="min-rate">
                    <strong>{rate.minRate.toFixed(2)}%</strong>
                  </td>
                  <td>{rate.type}</td>
                  <td className="benefits">
                    <ul>
                      {rate.benefits.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 중간 광고: 금리 표 확인 후 팁을 보기 전 (주목도 최고) */}
        <AdSense slot="1616685917" label="Middle Banner" />

        {/* 금리 인하 팁 */}
        <div className="tips-section">
          <h3>💰 금리 낮추는 꿀팁</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">💳</div>
              <h4>급여이체</h4>
              <p>급여 이체 계좌로 지정하면 평균 0.3~0.6%p 우대 금리 적용</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📱</div>
              <h4>모바일 뱅킹</h4>
              <p>인터넷/모바일 뱅킹 가입 시 0.1~0.2%p 추가 우대</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">💰</div>
              <h4>자동이체</h4>
              <p>공과금, 통신비 등 자동이체 설정 시 0.1~0.3%p 우대</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🎯</div>
              <h4>카드 실적</h4>
              <p>해당 은행 신용카드 사용 실적으로 0.2~0.3%p 우대</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📊</div>
              <h4>신용등급 관리</h4>
              <p>신용등급 1~2등급 유지로 최저 금리 적용 가능</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🏅</div>
              <h4>우대 고객</h4>
              <p>은행별 VIP/우수고객 등급으로 추가 우대 금리</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h3>❓ 자주 묻는 질문</h3>
          <div className="faq-list">
            <div className="faq-item">
              <h4>Q. 최저 금리를 받으려면?</h4>
              <p>
                A. 신용등급 1~2등급, 급여이체, 카드 실적, 자동이체 등 모든
                우대조건을 충족해야 최저 금리 적용이 가능합니다. 일반적으로
                3~4등급은 중간 금리대가 적용됩니다.
              </p>
            </div>
            <div className="faq-item">
              <h4>Q. 변동금리 vs 고정금리?</h4>
              <p>
                A. 변동금리는 시장 금리에 따라 변동되며 초기 금리가 낮습니다.
                고정금리는 전 기간 동일한 금리가 적용되어 안정적이지만 초기
                금리가 높습니다. 금리 상승 예상 시 고정금리가 유리합니다.
              </p>
            </div>
            <div className="faq-item">
              <h4>Q. 은행별 금리 차이가 크지 않은데 어디가 좋을까요?</h4>
              <p>
                A. 금리뿐 아니라 중도상환 수수료, 대출 한도, 심사 기준,
                우대조건의 달성 난이도 등을 종합적으로 고려해야 합니다. 주거래
                은행이 있다면 우대 혜택을 받기 쉽습니다.
              </p>
            </div>
            <div className="faq-item">
              <h4>Q. 금리는 언제 변경되나요?</h4>
              <p>
                A. 변동금리는 매월 또는 분기별로 변경됩니다. 각 은행의
                기준금리(COFIX, 금융채 등) 변동에 따라 조정되며, 가산금리는 은행
                정책에 따라 수시로 변경될 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 하단 광고: 페이지 이탈 전 마지막 노출 */}
        <AdSense slot="2611811617" label="Bottom Banner" />

        {/* 업데이트 정보 */}
        <div className="update-info">
          <p>📅 최종 업데이트: 2026년 1월</p>
          <p>📌 출처: 각 은행 공식 홈페이지 및 금융감독원 공시</p>
        </div>
      </div>
    </main>
  );
}

export default RateComparePage;
