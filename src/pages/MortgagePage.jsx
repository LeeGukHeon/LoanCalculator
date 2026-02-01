import { useState, useEffect } from "react";
import LoanInput from "../components/calculator/LoanInput";
import ResultCard from "../components/calculator/ResultCard";
import PaymentTable from "../components/calculator/PaymentTable";
import {
  calculateEqualPayment,
  calculateEqualPrincipal,
  calculateIncreasingPayment,
  calculateBulletPayment,
} from "../utils/loanCalculations";
import {
  calculateMaxLoanAmount,
  calculateDidimdolDiscount,
} from "../utils/loanLimitCalculator";
import { DIDIMDOL_LOAN, BOGEUMJARI_LOAN } from "../utils/loanPolicyData";
import { formatCurrency } from "../utils/formatters";
import "./MortgagePage.css";

function MortgagePage() {
  // 대출 유형
  const [loanType, setLoanType] = useState("general"); // general, didimdol, bogeumjari

  // 지역 정보
  const [isMetropolitan, setIsMetropolitan] = useState(true);
  const [isRegulated, setIsRegulated] = useState(false);

  // 주택 및 소득 정보 (억/천만원 단위로 입력)
  const [housePriceInput, setHousePriceInput] = useState("5"); // 5억
  const [annualIncomeInput, setAnnualIncomeInput] = useState("6"); // 6천만원

  // 기존 부채 정보 (만원 단위)
  const [existingDebtInput, setExistingDebtInput] = useState("0");
  const [existingLoanMonthlyInput, setExistingLoanMonthlyInput] = useState("0");

  // 우대 조건
  const [isFirstHome, setIsFirstHome] = useState(false);
  const [isNewlywed, setIsNewlywed] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isElectronic, setIsElectronic] = useState(false);

  // 대출 조건 (억원 단위)
  const [loanAmountInput, setLoanAmountInput] = useState("3"); // 3억
  const [interestRate, setInterestRate] = useState("4.5");
  const [loanPeriod, setLoanPeriod] = useState("360");
  const [repaymentType, setRepaymentType] = useState("equal");

  // 계산 결과
  const [maxLoanResult, setMaxLoanResult] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [finalRate, setFinalRate] = useState(4.5);

  // 실제 계산용 값 변환
  const housePrice = (parseFloat(housePriceInput) || 0) * 100000000;
  const annualIncome = (parseFloat(annualIncomeInput) || 0) * 10000000;
  const existingDebt = (parseFloat(existingDebtInput) || 0) * 10000;
  const existingLoanMonthly =
    (parseFloat(existingLoanMonthlyInput) || 0) * 10000;
  const loanAmount = (parseFloat(loanAmountInput) || 0) * 100000000;

  // 최대 대출 한도 계산
  useEffect(() => {
    const result = calculateMaxLoanAmount({
      loanType,
      housePrice,
      annualIncome,
      interestRate: parseFloat(interestRate) || 0,
      loanMonths: parseInt(loanPeriod) || 0,
      isFirstHome,
      isRegulated,
      isMetropolitan,
      existingDebt,
      existingLoanMonthly,
      isNewlywed,
    });

    setMaxLoanResult(result);
  }, [
    loanType,
    housePrice,
    annualIncome,
    interestRate,
    loanPeriod,
    isFirstHome,
    isRegulated,
    isMetropolitan,
    existingDebt,
    existingLoanMonthly,
    isNewlywed,
  ]);

  // 실제 금리 계산 (디딤돌대출 우대금리)
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
      baseRate = Math.max(DIDIMDOL_LOAN.baseRate.min, baseRate + discount);
    }

    setFinalRate(baseRate);
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

  // 상환 시뮬레이션 계산
  useEffect(() => {
    const principal = loanAmount;
    const rate = finalRate;
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
    } else if (repaymentType === "increasing") {
      calculationResult = calculateIncreasingPayment(principal, rate, months);
    } else if (repaymentType === "bullet") {
      calculationResult = calculateBulletPayment(principal, rate, months);
    }

    setPaymentResult(calculationResult);
  }, [loanAmount, finalRate, loanPeriod, repaymentType]);

  return (
    <main className="main">
      <div className="page-header">
        <h2>🏠 주택담보대출 계산기</h2>
        <p>2026년 최신 정책 반영 - LTV, DTI, DSR 자동 계산</p>
      </div>

      <div className="calculator-container">
        {/* 대출 유형 선택 */}
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

        {/* 지역 정보 */}
        <div className="input-section">
          <h3>지역 정보</h3>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isMetropolitan}
                onChange={(e) => setIsMetropolitan(e.target.checked)}
              />
              <span>수도권 (서울·경기·인천) - 스트레스 DSR 3단계</span>
            </label>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isRegulated}
                onChange={(e) => setIsRegulated(e.target.checked)}
              />
              <span>규제지역 (투기과열지구 등)</span>
            </label>
          </div>
        </div>

        {/* 주택 및 소득 정보 */}
        <div className="input-section">
          <h3>주택 및 소득 정보</h3>

          <LoanInput
            label="주택 가격"
            value={housePriceInput}
            onChange={setHousePriceInput}
            type="number"
            unit="억원"
            min="0"
            step="0.1"
            helpText="예: 5.5억원 → 5.5 입력"
          />

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
            label="기존 신용대출 월 상환액"
            value={existingDebtInput}
            onChange={setExistingDebtInput}
            type="number"
            unit="만원"
            min="0"
            step="1"
            helpText="예: 50만원 → 50 입력"
          />

          <LoanInput
            label="기존 주택대출 월 상환액"
            value={existingLoanMonthlyInput}
            onChange={setExistingLoanMonthlyInput}
            type="number"
            unit="만원"
            min="0"
            step="1"
            helpText="예: 100만원 → 100 입력"
          />
        </div>

        {/* 우대 조건 */}
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
            <>
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

              <div className="loan-input">
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
                  <span>청약저축 6개월 이상 (-0.3%p)</span>
                </label>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isElectronic}
                    onChange={(e) => setIsElectronic(e.target.checked)}
                  />
                  <span>전자계약 (-0.1%p)</span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* 최대 대출 한도 결과 */}
        {maxLoanResult && (
          <div className="max-loan-section">
            <h3>최대 대출 가능액</h3>

            {maxLoanResult.errors.length > 0 ? (
              <div className="error-box">
                <h4>❌ 정책대출 자격 미충족</h4>
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
                    <span>LTV 한도:</span>
                    <span>
                      {formatCurrency(maxLoanResult.details.ltvLimit)}
                    </span>
                  </div>
                  <div className="limit-item">
                    <span>DTI 한도:</span>
                    <span>
                      {formatCurrency(maxLoanResult.details.dtiLimit)}
                    </span>
                  </div>
                  {maxLoanResult.details.dsrLimit && (
                    <div className="limit-item">
                      <span>DSR 한도:</span>
                      <span>
                        {formatCurrency(maxLoanResult.details.dsrLimit)}
                      </span>
                    </div>
                  )}
                  {maxLoanResult.details.policyMaxLimit && (
                    <div className="limit-item">
                      <span>정책대출 한도:</span>
                      <span>
                        {formatCurrency(maxLoanResult.details.policyMaxLimit)}
                      </span>
                    </div>
                  )}
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
            unit="억원"
            min="0"
            step="0.1"
            helpText="예: 3.5억원 → 3.5 입력"
          />

          <LoanInput
            label={
              loanType === "didimdol"
                ? "기준 금리 (우대금리 적용 전)"
                : "연 이자율"
            }
            value={interestRate}
            onChange={setInterestRate}
            type="number"
            unit="%"
            min="0"
            max="20"
            step="0.1"
          />

          {loanType === "didimdol" &&
            finalRate !== parseFloat(interestRate) && (
              <div className="discount-info">
                <strong>최종 적용 금리: {finalRate.toFixed(2)}%</strong>
                <span>
                  (우대금리 {(finalRate - parseFloat(interestRate)).toFixed(2)}
                  %p 적용)
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
              <option value="60">5년 (60개월)</option>
              <option value="120">10년 (120개월)</option>
              <option value="180">15년 (180개월)</option>
              <option value="240">20년 (240개월)</option>
              <option value="300">25년 (300개월)</option>
              <option value="360">30년 (360개월)</option>
              {loanType === "bogeumjari" && (
                <>
                  <option value="480">40년 (480개월)</option>
                  <option value="600">50년 (600개월) - 만 34세 이하</option>
                </>
              )}
              {loanType === "general" && !isMetropolitan && (
                <option value="480">40년 (480개월) - 비수도권</option>
              )}
            </select>
            {loanType === "didimdol" && (
              <div className="info-text">
                💡 디딤돌대출은 최장 30년까지 가능합니다
              </div>
            )}
            {loanType === "bogeumjari" && (
              <div className="info-text">
                💡 만 34세 이하 청년은 최장 50년까지 가능합니다
              </div>
            )}
            {loanType === "general" && isMetropolitan && (
              <div className="info-text">
                💡 수도권은 최장 30년까지 가능합니다
              </div>
            )}
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
              <button
                className={`type-btn ${repaymentType === "bullet" ? "active" : ""}`}
                onClick={() => setRepaymentType("bullet")}
              >
                만기일시
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
              {repaymentType === "bullet" && (
                <ResultCard
                  title="월 이자"
                  value={paymentResult.monthlyInterest}
                  highlight={true}
                />
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

export default MortgagePage;
