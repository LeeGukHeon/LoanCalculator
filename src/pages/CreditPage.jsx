import { useState, useEffect } from "react";
import LoanInput from "../components/calculator/LoanInput";
import ResultCard from "../components/calculator/ResultCard";
import PaymentTable from "../components/calculator/PaymentTable";
import {
  calculateEqualPayment,
  calculateEqualPrincipal,
} from "../utils/loanCalculations";
import { calculateCreditLoanLimit } from "../utils/loanLimitCalculator";
import { CREDIT_RATING_RATES } from "../utils/loanPolicyData";
import { formatCurrency } from "../utils/formatters";
import "./CreditPage.css";

function CreditPage() {
  // 소득 및 부채 정보 (천만원/만원 단위)
  const [annualIncomeInput, setAnnualIncomeInput] = useState("6"); // 6천만원
  const [existingLoanMonthlyInput, setExistingLoanMonthlyInput] = useState("0"); // 0만원

  // 신용등급
  const [creditGrade, setCreditGrade] = useState("grade3");

  // 대출 조건 (천만원 단위)
  const [loanAmountInput, setLoanAmountInput] = useState("3"); // 3천만원
  const [interestRate, setInterestRate] = useState("8.5");
  const [loanPeriod, setLoanPeriod] = useState("36");
  const [repaymentType, setRepaymentType] = useState("equal");

  // 계산 결과
  const [maxLoanResult, setMaxLoanResult] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  // 실제 계산용 값 변환
  const annualIncome = (parseFloat(annualIncomeInput) || 0) * 10000000;
  const existingLoanMonthly =
    (parseFloat(existingLoanMonthlyInput) || 0) * 10000;
  const loanAmount = (parseFloat(loanAmountInput) || 0) * 10000000;

  // 신용등급에 따른 금리 범위
  const rateRange = CREDIT_RATING_RATES[creditGrade];

  // 최대 대출 한도 계산
  useEffect(() => {
    const result = calculateCreditLoanLimit(
      annualIncome,
      existingLoanMonthly,
      parseInt(loanPeriod) || 0,
      parseFloat(interestRate) || 0,
    );

    setMaxLoanResult(result);
  }, [annualIncome, existingLoanMonthly, loanPeriod, interestRate]);

  // 신용등급 변경 시 금리 자동 조정
  useEffect(() => {
    if (rateRange) {
      const avgRate = (rateRange.min + rateRange.max) / 2;
      setInterestRate(avgRate.toFixed(1));
    }
  }, [creditGrade, rateRange]);

  // 상환 시뮬레이션 계산
  useEffect(() => {
    const principal = loanAmount;
    const rate = parseFloat(interestRate) || 0;
    const months = parseInt(loanPeriod) || 0;

    if (principal <= 0 || rate < 0 || months <= 0) {
      setPaymentResult(null);
      return;
    }

    let calculationResult;

    if (repaymentType === "equal") {
      calculationResult = calculateEqualPayment(principal, rate, months);
    } else if (repaymentType === "equalPrincipal") {
      calculationResult = calculateEqualPrincipal(principal, rate, months);
    }

    setPaymentResult(calculationResult);
  }, [loanAmount, interestRate, loanPeriod, repaymentType]);

  return (
    <main className="main">
      <div className="page-header">
        <h2>💳 신용대출 계산기</h2>
        <p>2026년 최신 정책 반영 - DSR 40%, 연소득 1배 한도</p>
      </div>

      <div className="calculator-container">
        {/* 소득 및 부채 정보 */}
        <div className="input-section">
          <h3>소득 및 부채 정보</h3>

          <LoanInput
            label="연소득"
            value={annualIncomeInput}
            onChange={setAnnualIncomeInput}
            type="number"
            unit="천만원"
            min="0"
            step="0.1"
            helpText="예: 6.5천만원 → 6.5 입력"
          />

          <LoanInput
            label="기존 대출 월 상환액 (전체)"
            value={existingLoanMonthlyInput}
            onChange={setExistingLoanMonthlyInput}
            type="number"
            unit="만원"
            min="0"
            step="1"
            helpText="주택담보대출, 신용대출 등 모든 대출 포함"
          />

          <div className="info-box">
            <strong>💡 2026년 신용대출 규제</strong>
            <ul>
              <li>연소득의 1배 이내로 제한</li>
              <li>DSR 40% 적용 (스트레스 금리 +3.0%p)</li>
              <li>총대출 1억 초과 시 DSR 규제 강화</li>
            </ul>
          </div>
        </div>

        {/* 신용등급 */}
        <div className="input-section">
          <h3>신용등급 (NICE 평가 기준)</h3>

          <div className="loan-input">
            <label className="loan-input-label">신용등급</label>
            <select
              value={creditGrade}
              onChange={(e) => setCreditGrade(e.target.value)}
              className="loan-select"
            >
              <option value="grade1">
                {CREDIT_RATING_RATES.grade1.name} - 금리{" "}
                {CREDIT_RATING_RATES.grade1.min}~
                {CREDIT_RATING_RATES.grade1.max}%
              </option>
              <option value="grade2">
                {CREDIT_RATING_RATES.grade2.name} - 금리{" "}
                {CREDIT_RATING_RATES.grade2.min}~
                {CREDIT_RATING_RATES.grade2.max}%
              </option>
              <option value="grade3">
                {CREDIT_RATING_RATES.grade3.name} - 금리{" "}
                {CREDIT_RATING_RATES.grade3.min}~
                {CREDIT_RATING_RATES.grade3.max}%
              </option>
              <option value="grade4">
                {CREDIT_RATING_RATES.grade4.name} - 금리{" "}
                {CREDIT_RATING_RATES.grade4.min}~
                {CREDIT_RATING_RATES.grade4.max}%
              </option>
              <option value="grade5">
                {CREDIT_RATING_RATES.grade5.name} - 금리{" "}
                {CREDIT_RATING_RATES.grade5.min}~
                {CREDIT_RATING_RATES.grade5.max}%
              </option>
              <option value="grade6">
                {CREDIT_RATING_RATES.grade6.name} - 금리{" "}
                {CREDIT_RATING_RATES.grade6.min}~
                {CREDIT_RATING_RATES.grade6.max}%
              </option>
              <option value="grade7">
                {CREDIT_RATING_RATES.grade7.name} - 금리{" "}
                {CREDIT_RATING_RATES.grade7.min}~
                {CREDIT_RATING_RATES.grade7.max}%
              </option>
              <option value="grade8">
                {CREDIT_RATING_RATES.grade8.name} - 금리{" "}
                {CREDIT_RATING_RATES.grade8.min}~
                {CREDIT_RATING_RATES.grade8.max}%
              </option>
              <option value="grade9">
                {CREDIT_RATING_RATES.grade9.name} - 금리{" "}
                {CREDIT_RATING_RATES.grade9.min}~
                {CREDIT_RATING_RATES.grade9.max}%
              </option>
              <option value="grade10">
                {CREDIT_RATING_RATES.grade10.name} - 금리{" "}
                {CREDIT_RATING_RATES.grade10.min}~
                {CREDIT_RATING_RATES.grade10.max}%
              </option>
            </select>
          </div>

          <div className="info-text">
            💡 신용점수는 나이스(NICE) 또는 KCB 앱에서 무료로 확인 가능합니다
          </div>
        </div>

        {/* 최대 대출 한도 결과 */}
        {maxLoanResult && (
          <div className="max-loan-section">
            <h3>최대 대출 가능액</h3>

            {maxLoanResult.errors.length > 0 ? (
              <div className="error-box">
                <h4>❌ 대출 불가</h4>
                <ul>
                  {maxLoanResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <div className="max-loan-result">
                  <div className="max-loan-amount">
                    {formatCurrency(maxLoanResult.maxAmount)}
                  </div>
                  <div className="limiting-factor">
                    제한 요인: {maxLoanResult.limitingFactor}
                  </div>
                </div>

                <div className="limit-details">
                  <div className="limit-item">
                    <span>소득 기준 한도 (연소득 1배):</span>
                    <span>
                      {formatCurrency(maxLoanResult.details.incomeLimit)}
                    </span>
                  </div>
                  <div className="limit-item">
                    <span>DSR 기준 한도 (40%):</span>
                    <span>
                      {formatCurrency(maxLoanResult.details.dsrLimit)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 대출 조건 입력 */}
        <div className="input-section">
          <h3>대출 조건</h3>

          <LoanInput
            label="대출 금액"
            value={loanAmountInput}
            onChange={setLoanAmountInput}
            type="number"
            unit="천만원"
            min="0"
            step="0.1"
            helpText="예: 3.5천만원 → 3.5 입력"
          />

          <LoanInput
            label="연 이자율"
            value={interestRate}
            onChange={setInterestRate}
            type="number"
            unit="%"
            min={rateRange?.min || 0}
            max={rateRange?.max || 20}
            step="0.1"
            helpText={`${creditGrade} 금리 범위: ${rateRange?.min}~${rateRange?.max}%`}
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

        {/* 상환 시뮬레이션 */}
        {paymentResult && (
          <div className="result-section">
            <h3>상환 시뮬레이션</h3>

            <div className="result-cards">
              {repaymentType === "equal" && (
                <ResultCard
                  title="월 상환액"
                  value={paymentResult.monthlyPayment}
                  highlight={true}
                />
              )}
              {repaymentType === "equalPrincipal" && (
                <>
                  <ResultCard
                    title="첫 달 상환액"
                    value={paymentResult.firstMonthPayment}
                    highlight={true}
                  />
                  <ResultCard
                    title="마지막 달 상환액"
                    value={paymentResult.lastMonthPayment}
                  />
                </>
              )}
              <ResultCard
                title="총 상환액"
                value={paymentResult.totalPayment}
              />
              <ResultCard title="총 이자" value={paymentResult.totalInterest} />
            </div>

            <PaymentTable schedule={paymentResult.schedule} />
          </div>
        )}
      </div>
    </main>
  );
}

export default CreditPage;
