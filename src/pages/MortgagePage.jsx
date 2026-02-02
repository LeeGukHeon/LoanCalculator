import { useState, useEffect } from "react";
import LoanInput from "../components/calculator/LoanInput";
import ResultCard from "../components/calculator/ResultCard";
import PaymentTable from "../components/calculator/PaymentTable";
import AdSense from "../components/common/AdSense";
import {
  calculateEqualPayment,
  calculateEqualPrincipal,
  calculateIncreasingPayment,
  calculateBulletPayment,
} from "../utils/loanCalculations";
import {
  calculateMortgageLoanLimit,
  calculateDidimdolDiscount,
} from "../utils/loanLimitCalculator";
import { DIDIMDOL_LOAN } from "../utils/loanPolicyData";
import { formatCurrency } from "../utils/formatters";
import "./MortgagePage.css";

function MortgagePage() {
  // 1. 상태 관리
  const [loanType, setLoanType] = useState("general"); // general, didimdol, bogeumjari

  // 지역 및 주택 속성
  const [isMetropolitan, setIsMetropolitan] = useState(true); // 수도권 여부
  const [isApartment, setIsApartment] = useState(true); // 아파트 여부
  const [isRegulated, setIsRegulated] = useState(false); // 규제지역 여부

  // 입력값 상태 (초기값 0)
  const [housePriceInput, setHousePriceInput] = useState("0");
  const [annualIncomeInput, setAnnualIncomeInput] = useState("0");
  const [existingDebtInput, setExistingDebtInput] = useState("0");
  const [existingLoanMonthlyInput, setExistingLoanMonthlyInput] = useState("0");

  // 우대 조건
  const [isFirstHome, setIsFirstHome] = useState(false);
  const [isNewlywed, setIsNewlywed] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isElectronic, setIsElectronic] = useState(false);

  // 대출 조건
  const [loanAmountInput, setLoanAmountInput] = useState("0");
  const [interestRate, setInterestRate] = useState("4.5");
  const [loanPeriod, setLoanPeriod] = useState("360");
  const [gracePeriod, setGracePeriod] = useState("0");
  const [repaymentType, setRepaymentType] = useState("equal");

  // 결과 상태
  const [maxLoanResult, setMaxLoanResult] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [finalRate, setFinalRate] = useState(4.5);

  // 2. 값 변환
  const housePrice = (parseFloat(housePriceInput) || 0) * 100000000;
  const annualIncome = (parseFloat(annualIncomeInput) || 0) * 10000000;

  const annualDebt =
    ((parseFloat(existingDebtInput) || 0) +
      (parseFloat(existingLoanMonthlyInput) || 0)) *
    10000 *
    12;

  const loanAmount = (parseFloat(loanAmountInput) || 0) * 100000000;

  // 3. 대출 유형 변경 시 초기화
  useEffect(() => {
    // 유형 변경 시 거치기간 리셋 (정책대출은 1년 초과 불가하므로)
    setGracePeriod("0");

    if (loanType === "didimdol") {
      setInterestRate("2.8");
      setIsFirstHome(true);
    } else if (loanType === "bogeumjari") {
      setInterestRate("4.2");
    } else {
      setInterestRate("4.5");
      setIsFirstHome(false);
    }
  }, [loanType]);

  // 4. 최대 대출 한도 계산
  useEffect(() => {
    const result = calculateMortgageLoanLimit(
      housePrice,
      annualIncome,
      annualDebt,
      parseInt(loanPeriod) / 12,
      parseFloat(interestRate) || 0,
      loanType,
      isFirstHome,
      isMetropolitan,
      isApartment,
    );
    setMaxLoanResult(result);
  }, [
    loanType,
    housePrice,
    annualIncome,
    annualDebt,
    interestRate,
    loanPeriod,
    isFirstHome,
    isMetropolitan,
    isApartment,
  ]);

  // 자동 입력: 최대 한도가 계산되면 희망 대출 금액에 자동 입력
  useEffect(() => {
    if (maxLoanResult && maxLoanResult.maxAmount > 0) {
      const amountInEok = maxLoanResult.maxAmount / 100000000;
      setLoanAmountInput(parseFloat(amountInEok.toFixed(2)).toString());
    } else if (maxLoanResult && maxLoanResult.maxAmount === 0) {
      setLoanAmountInput("0");
    }
  }, [maxLoanResult]);

  // 5. 최종 금리 계산
  useEffect(() => {
    let baseRate = parseFloat(interestRate) || 0;

    if (loanType === "didimdol") {
      const discount = calculateDidimdolDiscount(
        annualIncome,
        isFirstHome,
        isNewlywed,
        childrenCount,
        hasSubscription,
        isElectronic,
      );
      let calculatedRate = baseRate - discount;
      if (calculatedRate < DIDIMDOL_LOAN.baseRate.min)
        calculatedRate = DIDIMDOL_LOAN.baseRate.min;

      setFinalRate(parseFloat(calculatedRate.toFixed(2)));
    } else {
      setFinalRate(baseRate);
    }
  }, [
    loanType,
    interestRate,
    annualIncome,
    isFirstHome,
    isNewlywed,
    childrenCount,
    hasSubscription,
    isElectronic,
  ]);

  // 6. 상환 시뮬레이션
  useEffect(() => {
    const principal = loanAmount;
    const rate = finalRate;
    const months = parseInt(loanPeriod) || 0;
    const graceYears = parseInt(gracePeriod) || 0;

    if (principal <= 0 || rate < 0 || months <= 0) {
      setPaymentResult(null);
      return;
    }

    let calc;
    if (repaymentType === "equal")
      calc = calculateEqualPayment(principal, rate, months, graceYears);
    else if (repaymentType === "equalPrincipal")
      calc = calculateEqualPrincipal(principal, rate, months, graceYears);
    else if (repaymentType === "increasing")
      calc = calculateIncreasingPayment(principal, rate, months);
    else if (repaymentType === "bullet")
      calc = calculateBulletPayment(principal, rate, months);

    setPaymentResult(calc);
  }, [loanAmount, finalRate, loanPeriod, repaymentType, gracePeriod]);

  return (
    <main className="main">
      <div className="page-header">
        <h2>🏠 주택담보대출 계산기</h2>
        <p>2026년 최신 규제 반영 (스트레스 DSR 3단계, 6.27 대책)</p>
      </div>

      <AdSense slot="3924893287" label="Top Banner" />

      <div className="calculator-container">
        {/* [1] 대출 유형 */}
        <div className="input-section">
          <h3>대출 유형</h3>
          <div className="loan-type-buttons">
            <button
              className={`type-btn ${loanType === "general" ? "active" : ""}`}
              onClick={() => setLoanType("general")}
            >
              일반 주택담보대출
            </button>
            <button
              className={`type-btn ${loanType === "didimdol" ? "active" : ""}`}
              onClick={() => setLoanType("didimdol")}
            >
              디딤돌대출
            </button>
            <button
              className={`type-btn ${loanType === "bogeumjari" ? "active" : ""}`}
              onClick={() => setLoanType("bogeumjari")}
            >
              보금자리론
            </button>
          </div>
        </div>

        {/* [2] 주택 정보 */}
        <div className="input-section">
          <h3>주택 정보</h3>
          <div
            className="checkbox-group"
            style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}
          >
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isMetropolitan}
                onChange={(e) => setIsMetropolitan(e.target.checked)}
              />
              <span>수도권 (서울·경기·인천)</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isApartment}
                onChange={(e) => setIsApartment(e.target.checked)}
              />
              <span>아파트 (빌라/다세대 제외)</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isRegulated}
                onChange={(e) => setIsRegulated(e.target.checked)}
              />
              <span>규제지역 (강남3구/용산)</span>
            </label>
          </div>

          {isMetropolitan && loanType === "didimdol" && isApartment && (
            <div className="info-text">
              💡 2026 규제: 수도권 아파트 디딤돌대출은 방공제(최우선변제금)가
              필수 차감됩니다.
            </div>
          )}
          {isMetropolitan && isFirstHome && loanType !== "didimdol" && (
            <div className="info-text" style={{ marginTop: "5px" }}>
              💡 6.27 대책: 수도권 생애최초 LTV는 80%가 아닌 70%로 제한됩니다.
            </div>
          )}
        </div>

        {/* [3] 금액 및 소득 정보 */}
        <div className="input-section">
          <h3>금액 및 소득 정보</h3>
          <LoanInput
            label="주택 가격"
            value={housePriceInput}
            onChange={setHousePriceInput}
            unit="억원"
            step="0.1"
          />
          <LoanInput
            label="연소득"
            value={annualIncomeInput}
            onChange={setAnnualIncomeInput}
            unit="천만원"
            step="0.1"
          />
          <LoanInput
            label="기존 신용대출 월 상환액"
            value={existingDebtInput}
            onChange={setExistingDebtInput}
            unit="만원"
          />
          <LoanInput
            label="기존 주택대출 월 상환액"
            value={existingLoanMonthlyInput}
            onChange={setExistingLoanMonthlyInput}
            unit="만원"
          />
        </div>

        {/* [4] 우대 조건 */}
        <div className="input-section">
          <h3>우대 조건</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isFirstHome}
                onChange={(e) => setIsFirstHome(e.target.checked)}
              />
              <span>
                생애최초 주택구입 {loanType === "didimdol" && "(-0.2%p)"}
              </span>
            </label>
          </div>

          {loanType === "didimdol" && (
            <div style={{ marginTop: "10px" }}>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isNewlywed}
                    onChange={(e) => setIsNewlywed(e.target.checked)}
                  />
                  <span>신혼부부 (혼인 7년 이내) (-0.2%p)</span>
                </label>
              </div>
              <div className="loan-input" style={{ marginTop: "10px" }}>
                <label className="loan-input-label">자녀 수</label>
                <select
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(parseInt(e.target.value))}
                  className="loan-select"
                >
                  <option value="0">없음</option>
                  <option value="1">1명 (-0.3%p)</option>
                  <option value="2">2명 (-0.5%p)</option>
                  <option value="3">3명 이상 (-0.7%p)</option>
                </select>
              </div>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={hasSubscription}
                    onChange={(e) => setHasSubscription(e.target.checked)}
                  />
                  <span>청약저축 6개월+ (-0.2%p)</span>
                </label>
                <label
                  className="checkbox-label"
                  style={{ marginLeft: "15px" }}
                >
                  <input
                    type="checkbox"
                    checked={isElectronic}
                    onChange={(e) => setIsElectronic(e.target.checked)}
                  />
                  <span>전자계약 (-0.1%p)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* [5] 최대 대출 한도 결과 */}
        {maxLoanResult && (
          <div className="max-loan-section">
            <h3>최대 대출 가능액</h3>
            {maxLoanResult.errors && maxLoanResult.errors.length > 0 ? (
              <div className="error-box">
                <h4>❌ 대출 불가 사유</h4>
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
                    <span>LTV 기준 ({maxLoanResult.appliedLtv}%):</span>
                    <span>{formatCurrency(maxLoanResult.ltvLimit)}</span>
                  </div>
                  <div className="limit-item">
                    <span>소득 기준 ({maxLoanResult.limitType}):</span>
                    <span>{formatCurrency(maxLoanResult.incomeLimit)}</span>
                  </div>
                  <div className="limit-item">
                    <span>상품 한도:</span>
                    <span>
                      {maxLoanResult.maxLoanCap > 9000000000
                        ? "제한없음"
                        : formatCurrency(maxLoanResult.maxLoanCap)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* [6] 상환 시뮬레이션 */}
        <div className="input-section">
          <h3>상환 시뮬레이션</h3>
          <LoanInput
            label="희망 대출 금액"
            value={loanAmountInput}
            onChange={setLoanAmountInput}
            unit="억원"
            step="0.1"
            helpText={`최대 ${maxLoanResult ? formatCurrency(maxLoanResult.maxAmount) : "-"}까지 가능`}
          />
          <LoanInput
            label={
              loanType === "didimdol" ? "기준 금리 (우대 전)" : "연 이자율"
            }
            value={interestRate}
            onChange={setInterestRate}
            unit="%"
            step="0.1"
          />

          {loanType === "didimdol" &&
            finalRate !== parseFloat(interestRate) && (
              <div className="discount-info">
                <strong>최종 금리: {finalRate.toFixed(2)}%</strong>
                <span>
                  (우대 -{(parseFloat(interestRate) - finalRate).toFixed(2)}%p)
                </span>
              </div>
            )}

          <div className="loan-input">
            <label className="loan-input-label">대출 기간</label>
            <select
              value={loanPeriod}
              onChange={(e) => setLoanPeriod(e.target.value)}
              className="loan-select"
            >
              <option value="120">10년</option>
              <option value="180">15년</option>
              <option value="240">20년</option>
              <option value="360">30년</option>
              {loanType !== "general" && (
                <option value="480">40년 (만39세↓/신혼)</option>
              )}
              {loanType === "general" && !isMetropolitan && (
                <option value="480">40년 (비수도권)</option>
              )}
              {(loanType !== "general" || !isMetropolitan) && (
                <option value="600">50년 (만34세↓)</option>
              )}
            </select>
          </div>

          <div className="loan-input">
            <label className="loan-input-label">거치 기간 (이자만 납부)</label>
            <select
              value={gracePeriod}
              onChange={(e) => setGracePeriod(e.target.value)}
              className="loan-select"
            >
              <option value="0">없음</option>
              <option value="1">1년</option>
              {/* 🟢 일반 대출일 때만 장기 거치 옵션 활성화 */}
              {loanType === "general" && (
                <>
                  <option value="2">2년</option>
                  <option value="3">3년</option>
                  <option value="5">5년</option>
                  <option value="10">10년</option>
                </>
              )}
            </select>
            {/* 문구 동적 표시 */}
            <div className="info-text" style={{ fontSize: "0.8rem" }}>
              {loanType === "general"
                ? "※ 은행별 거치 가능 기간 상이 (통상 1년)"
                : "※ 정책대출은 최대 1년 거치 가능"}
            </div>
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
              <button
                className={`type-btn ${repaymentType === "increasing" ? "active" : ""}`}
                onClick={() => setRepaymentType("increasing")}
              >
                체증식
              </button>
            </div>
          </div>
        </div>

        {/* [7] 결과 카드 */}
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
                <strong>
                  {formatCurrency(parseFloat(loanAmountInput) * 100000000)}
                </strong>{" "}
                대출 시<strong> {finalRate}%</strong> 금리로
                <strong> {parseInt(loanPeriod) / 12}년</strong> 동안 상환하면,
                총 이자는{" "}
                <strong>{formatCurrency(paymentResult.totalInterest)}</strong>{" "}
                입니다.
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
              {repaymentType === "increasing" && (
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

export default MortgagePage;
