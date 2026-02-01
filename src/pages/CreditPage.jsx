import { useState, useEffect } from "react";
import LoanInput from "../components/calculator/LoanInput";
import ResultCard from "../components/calculator/ResultCard";
import PaymentTable from "../components/calculator/PaymentTable";
import {
  calculateEqualPayment,
  calculateEqualPrincipal,
} from "../utils/loanCalculations";
import "./CreditPage.css";

function CreditPage() {
  const [loanAmount, setLoanAmount] = useState("10000000"); // 1천만원
  const [interestRate, setInterestRate] = useState("7.5"); // 7.5%
  const [loanPeriod, setLoanPeriod] = useState("36"); // 3년
  const [repaymentType, setRepaymentType] = useState("equal"); // 원리금균등
  const [result, setResult] = useState(null);

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanPeriod, repaymentType]);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const months = parseInt(loanPeriod) || 0;

    if (principal <= 0 || rate < 0 || months <= 0) {
      setResult(null);
      return;
    }

    let calculationResult;

    if (repaymentType === "equal") {
      calculationResult = calculateEqualPayment(principal, rate, months);
    } else if (repaymentType === "equalPrincipal") {
      calculationResult = calculateEqualPrincipal(principal, rate, months);
    }

    setResult(calculationResult);
  };

  return (
    <main className="main">
      <div className="page-header">
        <h2>💳 신용대출 계산기</h2>
        <p>신용대출 상환 계획을 시뮬레이션합니다</p>
      </div>

      <div className="calculator-container">
        <div className="input-section">
          <h3>대출 정보 입력</h3>

          <LoanInput
            label="대출 금액"
            value={loanAmount}
            onChange={setLoanAmount}
            type="number"
            unit="원"
            min="0"
            step="1000000"
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
              <option value="6">6개월</option>
              <option value="12">1년 (12개월)</option>
              <option value="24">2년 (24개월)</option>
              <option value="36">3년 (36개월)</option>
              <option value="48">4년 (48개월)</option>
              <option value="60">5년 (60개월)</option>
              <option value="84">7년 (84개월)</option>
              <option value="120">10년 (120개월)</option>
            </select>
          </div>

          <div className="loan-input">
            <label className="loan-input-label">상환 방식</label>
            <div className="repayment-type-buttons">
              <button
                className={`type-btn ${repaymentType === "equal" ? "active" : ""}`}
                onClick={() => setRepaymentType("equal")}
              >
                원리금균등
              </button>
              <button
                className={`type-btn ${repaymentType === "equalPrincipal" ? "active" : ""}`}
                onClick={() => setRepaymentType("equalPrincipal")}
              >
                원금균등
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className="result-section">
            <h3>계산 결과</h3>

            <div className="result-cards">
              {repaymentType === "equal" && (
                <ResultCard
                  title="월 상환액"
                  value={result.monthlyPayment}
                  highlight={true}
                />
              )}
              {repaymentType === "equalPrincipal" && (
                <>
                  <ResultCard
                    title="첫 달 상환액"
                    value={result.firstMonthPayment}
                    highlight={true}
                  />
                  <ResultCard
                    title="마지막 달 상환액"
                    value={result.lastMonthPayment}
                  />
                </>
              )}
              <ResultCard title="총 상환액" value={result.totalPayment} />
              <ResultCard title="총 이자" value={result.totalInterest} />
            </div>

            <PaymentTable schedule={result.schedule} />
          </div>
        )}
      </div>
    </main>
  );
}

export default CreditPage;
