import { useState, useEffect } from "react";
import LoanInput from "../components/calculator/LoanInput";
import AdSense from "../components/common/AdSense"; // 광고 컴포넌트 추가
import {
  calculateEqualPayment,
  calculateEqualPrincipal,
  calculateIncreasingPayment,
  calculateBulletPayment,
} from "../utils/loanCalculations";
import { formatCurrency } from "../utils/formatters";
import "./ComparePage.css";

function ComparePage() {
  // 대출 유형
  const [loanType, setLoanType] = useState("mortgage"); // mortgage(주택담보), credit(신용)

  // 입력 값 (억원/천만원 단위)
  const [loanAmountInput, setLoanAmountInput] = useState("3");
  const [interestRate, setInterestRate] = useState("4.5");
  const [loanPeriod, setLoanPeriod] = useState("360");

  // 결과
  const [results, setResults] = useState(null);

  // 실제 계산용 값 변환
  const loanAmount =
    loanType === "mortgage"
      ? (parseFloat(loanAmountInput) || 0) * 100000000 // 억원
      : (parseFloat(loanAmountInput) || 0) * 10000000; // 천만원

  // 대출 유형 변경 시 기본값 조정
  useEffect(() => {
    if (loanType === "mortgage") {
      setLoanAmountInput("3"); // 3억
      setInterestRate("4.5");
      setLoanPeriod("360");
    } else {
      setLoanAmountInput("3"); // 3천만원
      setInterestRate("8.5");
      setLoanPeriod("36");
    }
  }, [loanType]);

  // 계산
  useEffect(() => {
    const principal = loanAmount;
    const rate = parseFloat(interestRate) || 0;
    const months = parseInt(loanPeriod) || 0;

    if (principal <= 0 || rate < 0 || months <= 0) {
      setResults(null);
      return;
    }

    const equalPaymentResult = calculateEqualPayment(principal, rate, months);
    const equalPrincipalResult = calculateEqualPrincipal(
      principal,
      rate,
      months,
    );
    const increasingPaymentResult = calculateIncreasingPayment(
      principal,
      rate,
      months,
    );
    const bulletPaymentResult = calculateBulletPayment(principal, rate, months);

    setResults({
      equalPayment: equalPaymentResult,
      equalPrincipal: equalPrincipalResult,
      increasingPayment: increasingPaymentResult,
      bulletPayment: bulletPaymentResult,
    });
  }, [loanAmount, interestRate, loanPeriod]);

  return (
    <main className="main">
      <div className="page-header">
        <h2>📊 상환방식 비교</h2>
        <p>4가지 상환 방식을 한눈에 비교하세요</p>
      </div>

      {/* 상단 광고: 높은 주목도 */}
      <AdSense slot="3924893287" label="Top Banner" />

      <div className="calculator-container">
        {/* 대출 유형 선택 */}
        <div className="input-section">
          <h3>대출 유형</h3>
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
              신용대출
            </button>
          </div>
        </div>

        {/* 대출 정보 입력 */}
        <div className="input-section">
          <h3>대출 정보 입력</h3>

          <LoanInput
            label="대출 금액"
            value={loanAmountInput}
            onChange={setLoanAmountInput}
            type="number"
            unit={loanType === "mortgage" ? "억원" : "천만원"}
            min="0"
            step="0.1"
            helpText={
              loanType === "mortgage"
                ? "예: 3.5억원 → 3.5 입력"
                : "예: 3.5천만원 → 3.5 입력"
            }
          />

          <LoanInput
            label="연 이자율"
            value={interestRate}
            onChange={setInterestRate}
            type="number"
            unit="%"
            min="0"
            max="20"
            step="0.1"
          />

          <div className="loan-input">
            <label className="loan-input-label">대출 기간</label>
            <select
              value={loanPeriod}
              onChange={(e) => setLoanPeriod(e.target.value)}
              className="loan-select"
            >
              {loanType === "mortgage" ? (
                <>
                  <option value="60">5년 (60개월)</option>
                  <option value="120">10년 (120개월)</option>
                  <option value="180">15년 (180개월)</option>
                  <option value="240">20년 (240개월)</option>
                  <option value="300">25년 (300개월)</option>
                  <option value="360">30년 (360개월)</option>
                  <option value="480">40년 (480개월)</option>
                  <option value="600">50년 (600개월)</option>
                </>
              ) : (
                <>
                  <option value="6">6개월</option>
                  <option value="12">1년 (12개월)</option>
                  <option value="24">2년 (24개월)</option>
                  <option value="36">3년 (36개월)</option>
                  <option value="48">4년 (48개월)</option>
                  <option value="60">5년 (60개월)</option>
                  <option value="84">7년 (84개월)</option>
                  <option value="120">10년 (120개월)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* 비교 결과 */}
        {results && (
          <div className="result-section">
            <h3>상환 방식 비교 결과</h3>

            {/* 스마트 분석 리포트 (SEO 및 체류시간 증대) */}
            <div
              className="seo-summary"
              style={{
                background: "#e3f2fd",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                lineHeight: "1.6",
                color: "#333",
              }}
            >
              <p>
                <strong>분석 결과:</strong> 가장 이자가 적은 방식은{" "}
                <strong>'원금균등'</strong>이며, 가장 일반적인 '원리금균등'
                방식보다 총 이자{" "}
                <strong>
                  {formatCurrency(
                    results.equalPayment.totalInterest -
                      results.equalPrincipal.totalInterest,
                  )}
                </strong>
                을 절약할 수 있습니다. 다만, 초기 월 상환액 부담은 원금균등
                방식이 더 큽니다.
              </p>
            </div>

            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>원리금균등</th>
                    <th>원금균등</th>
                    <th>체증식</th>
                    <th>만기일시</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="row-label">첫 달 상환액</td>
                    <td>
                      {formatCurrency(results.equalPayment.monthlyPayment)}
                    </td>
                    <td>
                      {formatCurrency(results.equalPrincipal.firstMonthPayment)}
                    </td>
                    <td>
                      {formatCurrency(
                        results.increasingPayment.firstMonthPayment,
                      )}
                    </td>
                    <td>
                      {formatCurrency(results.bulletPayment.monthlyInterest)}
                    </td>
                  </tr>
                  <tr>
                    <td className="row-label">마지막 달 상환액</td>
                    <td>
                      {formatCurrency(results.equalPayment.monthlyPayment)}
                    </td>
                    <td>
                      {formatCurrency(results.equalPrincipal.lastMonthPayment)}
                    </td>
                    <td>
                      {formatCurrency(
                        results.increasingPayment.lastMonthPayment,
                      )}
                    </td>
                    <td>
                      {formatCurrency(
                        loanAmount + results.bulletPayment.monthlyInterest,
                      )}
                    </td>
                  </tr>
                  <tr className="highlight-row">
                    <td className="row-label">총 상환액</td>
                    <td>{formatCurrency(results.equalPayment.totalPayment)}</td>
                    <td>
                      {formatCurrency(results.equalPrincipal.totalPayment)}
                    </td>
                    <td>
                      {formatCurrency(results.increasingPayment.totalPayment)}
                    </td>
                    <td>
                      {formatCurrency(results.bulletPayment.totalPayment)}
                    </td>
                  </tr>
                  <tr className="highlight-row">
                    <td className="row-label">총 이자</td>
                    <td>
                      {formatCurrency(results.equalPayment.totalInterest)}
                    </td>
                    <td>
                      {formatCurrency(results.equalPrincipal.totalInterest)}
                    </td>
                    <td>
                      {formatCurrency(results.increasingPayment.totalInterest)}
                    </td>
                    <td>
                      {formatCurrency(results.bulletPayment.totalInterest)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 중간 광고: 표 확인 후 상세 설명 보기 전 (클릭률 높음) */}
            <AdSense slot="1616685917" label="Middle Banner" />

            {/* 각 방식 특징 */}
            <div className="comparison-cards">
              <div className="comparison-card">
                <h4>💡 원리금균등</h4>
                <div className="card-badge best">가장 일반적</div>
                <ul>
                  <li>매월 동일한 금액 상환</li>
                  <li>상환 계획이 안정적</li>
                  <li>초반 이자 비중 높음</li>
                  <li>가계부 관리 용이</li>
                </ul>
              </div>

              <div className="comparison-card">
                <h4>💡 원금균등</h4>
                <div className="card-badge save">이자 절감</div>
                <ul>
                  <li>매월 원금은 동일</li>
                  <li>초반 상환액이 높음</li>
                  <li>시간이 지날수록 부담 감소</li>
                  <li>총 이자가 가장 적음</li>
                </ul>
              </div>

              <div className="comparison-card">
                <h4>💡 체증식</h4>
                <div className="card-badge new">신혼부부 추천</div>
                <ul>
                  <li>초기 상환액이 가장 적음</li>
                  <li>매년 상환액이 점진 증가</li>
                  <li>소득 증가 예상 시 유리</li>
                  <li>총 이자는 많은 편</li>
                </ul>
              </div>

              <div className="comparison-card">
                <h4>💡 만기일시</h4>
                <div className="card-badge caution">주의 필요</div>
                <ul>
                  <li>매월 이자만 납부</li>
                  <li>만기에 원금 일시 상환</li>
                  <li>초반 부담이 가장 적음</li>
                  <li>총 이자가 가장 많음</li>
                </ul>
              </div>
            </div>

            {/* 추천 */}
            <div className="recommendation-box">
              <h4>🎯 나에게 맞는 상환 방식은?</h4>
              <div className="recommendation-grid">
                <div className="recommendation-item">
                  <strong>원리금균등 추천</strong>
                  <p>
                    안정적인 소득이 있고, 매월 일정한 금액을 상환하고 싶은 경우
                  </p>
                </div>
                <div className="recommendation-item">
                  <strong>원금균등 추천</strong>
                  <p>초반 여유 자금이 있고, 총 이자를 최소화하고 싶은 경우</p>
                </div>
                <div className="recommendation-item">
                  <strong>체증식 추천</strong>
                  <p>신혼부부, 사회초년생 등 향후 소득 증가가 예상되는 경우</p>
                </div>
                <div className="recommendation-item">
                  <strong>만기일시 추천</strong>
                  <p>임대 목적이거나 단기간 내 매도/상환 계획이 있는 경우</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 광고 */}
      <AdSense slot="2611811617" label="Bottom Banner" />
    </main>
  );
}

export default ComparePage;
