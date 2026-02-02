import { useState, useEffect } from "react";
import LoanInput from "../components/calculator/LoanInput";
import ResultCard from "../components/calculator/ResultCard";
import PaymentTable from "../components/calculator/PaymentTable";
import AdSense from "../components/common/AdSense";
import {
  calculateEqualPayment,
  calculateEqualPrincipal,
} from "../utils/loanCalculations";
import { calculateCreditLoanLimit } from "../utils/loanLimitCalculator";
import { CREDIT_RATING_RATES } from "../utils/loanPolicyData";
import { formatCurrency } from "../utils/formatters";
import "./CreditPage.css";

function CreditPage() {
  // 소득 및 부채 정보 (천만원/만원 단위) - 초기값 0으로 설정
  const [annualIncomeInput, setAnnualIncomeInput] = useState("0");
  const [existingLoanMonthlyInput, setExistingLoanMonthlyInput] = useState("0");

  // 신용등급
  const [creditGrade, setCreditGrade] = useState("grade3");

  // 대출 조건 (천만원 단위)
  const [loanAmountInput, setLoanAmountInput] = useState("0");
  const [interestRate, setInterestRate] = useState("5.5"); // 2026년 기준 현실적인 시작 금리
  const [loanPeriod, setLoanPeriod] = useState("12"); // 통상 1년 만기 일시상환이 많으므로
  const [repaymentType, setRepaymentType] = useState("equal"); // 원리금균등 or 만기일시

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

  // 최대 대출 한도 계산 (2026년 규제 적용)
  useEffect(() => {
    // 2026 규제: 신용대출 DSR 산정 시 만기는 5년으로 간주
    // calculateCreditLoanLimit 함수 내부에서 이를 처리하도록 위임
    const result = calculateCreditLoanLimit(
      annualIncome,
      existingLoanMonthly,
      parseInt(loanPeriod) / 12, // 년 단위 전달
      parseFloat(interestRate) || 0,
    );

    setMaxLoanResult(result);
  }, [annualIncome, existingLoanMonthly, loanPeriod, interestRate]);

  // 신용등급 변경 시 금리 자동 조정
  useEffect(() => {
    if (rateRange) {
      const avgRate = (rateRange.min + rateRange.max) / 2;
      setInterestRate(avgRate.toFixed(2));
    }
  }, [creditGrade, rateRange]);

  // 자동 입력: 최대 한도가 계산되면 희망 대출 금액에 자동 입력 (0보다 클 때만)
  useEffect(() => {
    if (maxLoanResult && maxLoanResult.maxAmount > 0) {
      // 천만원 단위로 변환하여 입력
      const amountInTenMillion = maxLoanResult.maxAmount / 10000000;
      setLoanAmountInput(parseFloat(amountInTenMillion.toFixed(1)).toString());
    } else if (maxLoanResult && maxLoanResult.maxAmount === 0) {
      setLoanAmountInput("0");
    }
  }, [maxLoanResult]);

  // 상환 시뮬레이션 계산
  useEffect(() => {
    // 사용자가 입력한 금액이 있으면 그것을, 없으면(0) 최대 한도를 사용
    const principal =
      loanAmount > 0 ? loanAmount : maxLoanResult?.maxAmount || 0;
    const rate = parseFloat(interestRate) || 0;
    const months = parseInt(loanPeriod) || 0;

    if (principal <= 0 || rate < 0 || months <= 0) {
      setPaymentResult(null);
      return;
    }

    let calculationResult;
    // 신용대출은 보통 원리금균등, 원금균등, 만기일시가 있음
    if (repaymentType === "equal") {
      calculateEqualPayment(principal, rate, months); // 거치기간 0
      calculationResult = calculateEqualPayment(principal, rate, months);
    } else if (repaymentType === "equalPrincipal") {
      calculationResult = calculateEqualPrincipal(principal, rate, months);
    }
    // 만기일시 상환 추가 가능성 고려 (현재는 2가지만)

    setPaymentResult(calculationResult);
  }, [loanAmount, interestRate, loanPeriod, repaymentType, maxLoanResult]);

  return (
    <main className="main">
      <div className="page-header">
        <h2>💳 신용대출 계산기</h2>
        <p>2026년 최신 정책 반영 - DSR 40%, 연소득 1배 한도 제한</p>
      </div>

      <AdSense slot="3924893287" label="Top Banner" />

      <div className="calculator-container">
        {/* [1] 소득 및 부채 정보 */}
        <div className="input-section">
          <h3>소득 및 부채 정보</h3>
          <LoanInput
            label="연소득"
            value={annualIncomeInput}
            onChange={setAnnualIncomeInput}
            type="number"
            unit="천만원"
            step="0.1"
            helpText="예: 6.5천만원 → 6.5 입력"
          />
          <LoanInput
            label="기존 대출 월 상환액 (전체)"
            value={existingLoanMonthlyInput}
            onChange={setExistingLoanMonthlyInput}
            type="number"
            unit="만원"
            step="1"
            helpText="주택담보대출, 신용대출 등 모든 대출의 월 납입액 합계"
          />

          {/* 규제 안내 박스 */}
          <div
            className="info-box"
            style={{
              background: "#fff3e0",
              padding: "1rem",
              borderRadius: "8px",
              marginTop: "1rem",
              fontSize: "0.9rem",
              color: "#e65100",
            }}
          >
            <strong>💡 2026년 신용대출 핵심 규제</strong>
            <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
              <li>
                대출 한도는 <strong>연소득의 100% (1배)</strong> 이내로
                제한됩니다.
              </li>
              <li>
                DSR 계산 시 실제 만기와 무관하게 <strong>5년(60개월)</strong>{" "}
                분할상환으로 간주되어 한도가 줄어듭니다.
              </li>
              <li>
                총 대출액 1억 원 초과 시 <strong>DSR 40%</strong> 규제가
                적용됩니다.
              </li>
            </ul>
          </div>
        </div>

        {/* [2] 신용등급 선택 */}
        <div className="input-section">
          <h3>신용등급 (NICE/KCB 기준)</h3>
          <div className="loan-input">
            <label className="loan-input-label">신용등급 선택</label>
            <select
              value={creditGrade}
              onChange={(e) => setCreditGrade(e.target.value)}
              className="loan-select"
            >
              {Object.keys(CREDIT_RATING_RATES).map((key) => (
                <option key={key} value={key}>
                  {CREDIT_RATING_RATES[key].name} (
                  {CREDIT_RATING_RATES[key].min}~{CREDIT_RATING_RATES[key].max}
                  %)
                </option>
              ))}
            </select>
          </div>
          <div
            className="info-text"
            style={{ fontSize: "0.85rem", color: "#666" }}
          >
            ※ 본인의 정확한 신용점수는 토스, 카카오뱅크, 네이버페이 등에서
            무료로 확인 가능합니다.
          </div>
        </div>

        {/* [3] 최대 대출 한도 결과 */}
        {maxLoanResult && (
          <div className="max-loan-section">
            <h3>최대 대출 가능액</h3>

            {maxLoanResult.errors.length > 0 ? (
              <div className="error-box">
                <h4>❌ 대출 한도 조회 불가</h4>
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
                    <span>연소득 1배 한도:</span>
                    <span>
                      {formatCurrency(maxLoanResult.details.incomeLimit)}
                    </span>
                  </div>
                  <div className="limit-item">
                    <span>DSR 40% 한도 (만기 5년 간주):</span>
                    <span>
                      {formatCurrency(maxLoanResult.details.dsrLimit)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* [4] 대출 조건 시뮬레이션 */}
        <div className="input-section">
          <h3>상환 시뮬레이션</h3>

          <LoanInput
            label="희망 대출 금액"
            value={loanAmountInput}
            onChange={setLoanAmountInput}
            type="number"
            unit="천만원"
            step="0.1"
            helpText={`최대 ${maxLoanResult ? formatCurrency(maxLoanResult.maxAmount) : "-"} 권장`}
          />

          <LoanInput
            label="연 이자율"
            value={interestRate}
            onChange={setInterestRate}
            type="number"
            unit="%"
            step="0.1"
            min={rateRange?.min || 0}
            max={rateRange?.max || 20}
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

        {/* [5] 결과 리포트 */}
        {paymentResult && (
          <div className="result-section">
            <div
              className="seo-summary"
              style={{
                background: "#e3f2fd",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                color: "#333",
              }}
            >
              <p>
                <strong>{formatCurrency(loanAmount)}</strong> 신용대출을
                <strong> {parseInt(loanPeriod) / 12}년</strong> 동안 금리{" "}
                <strong>{interestRate}%</strong>로 상환 시, 총 이자는{" "}
                <strong>{formatCurrency(paymentResult.totalInterest)}</strong>{" "}
                발생합니다. (※ DSR 계산 시에는 실제 만기와 무관하게 5년
                분할상환으로 간주되어 한도가 산출되었습니다.)
              </p>
            </div>

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

            <AdSense slot="1616685917" label="Middle Banner" />
            <PaymentTable schedule={paymentResult.schedule} />
          </div>
        )}
      </div>

      <AdSense slot="2611811617" label="Bottom Banner" />
    </main>
  );
}

export default CreditPage;
