import { useState, useEffect } from "react";
import LoanInput from "../components/calculator/LoanInput";
import ResultCard from "../components/calculator/ResultCard";
import AdSense from "../components/common/AdSense"; // 광고 컴포넌트 추가
import { calculateEqualPayment } from "../utils/loanCalculations";
import { formatCurrency } from "../utils/formatters";
import "./PrepaymentPage.css";

function PrepaymentPage() {
  // 대출 유형
  const [loanType, setLoanType] = useState("general"); // general, didimdol, bogeumjari, credit
  const [rateType, setRateType] = useState("variable"); // variable(변동), fixed(고정)

  // 수수료율 (직접 입력)
  const [customFeeRate, setCustomFeeRate] = useState("0.7");

  // 기존 대출 정보
  const [originalLoanInput, setOriginalLoanInput] = useState("3"); // 억원/천만원
  const [interestRate, setInterestRate] = useState("4.5");
  const [loanPeriod, setLoanPeriod] = useState("360"); // 개월
  const [elapsedMonths, setElapsedMonths] = useState("12"); // 경과 개월

  // 중도상환 정보
  const [prepaymentAmountInput, setPrepaymentAmountInput] = useState("1"); // 억원/천만원

  // 계산 결과
  const [results, setResults] = useState(null);

  // 실제 계산용 값 변환
  const originalLoan =
    loanType === "credit"
      ? (parseFloat(originalLoanInput) || 0) * 10000000 // 천만원
      : (parseFloat(originalLoanInput) || 0) * 100000000; // 억원

  const prepaymentAmount =
    loanType === "credit"
      ? (parseFloat(prepaymentAmountInput) || 0) * 10000000
      : (parseFloat(prepaymentAmountInput) || 0) * 100000000;

  // 대출 유형별 기본 수수료율 설정
  useEffect(() => {
    if (loanType === "general") {
      setCustomFeeRate(rateType === "variable" ? "0.7" : "0.7");
    } else if (loanType === "didimdol") {
      setCustomFeeRate("0.6");
    } else if (loanType === "bogeumjari") {
      setCustomFeeRate("1.0");
    } else if (loanType === "credit") {
      setCustomFeeRate(rateType === "fixed" ? "0.17" : "0.10");
    }
  }, [loanType, rateType]);

  // 중도상환 계산
  useEffect(() => {
    const principal = originalLoan;
    const rate = parseFloat(interestRate) || 0;
    const totalMonths = parseInt(loanPeriod) || 0;
    const elapsed = parseInt(elapsedMonths) || 0;
    const prepayment = prepaymentAmount;
    const feeRate = parseFloat(customFeeRate) || 0;

    if (
      principal <= 0 ||
      rate < 0 ||
      totalMonths <= 0 ||
      elapsed < 0 ||
      prepayment <= 0
    ) {
      setResults(null);
      return;
    }

    // 경과 개월 검증
    if (elapsed >= totalMonths) {
      setResults({ error: "경과 개월이 대출 기간보다 크거나 같습니다" });
      return;
    }

    // 3년(36개월) 경과 시 수수료 면제 (신용대출 제외)
    const isFeeExempt = loanType !== "credit" && elapsed >= 36;

    // 기존 대출 계산
    const originalCalculation = calculateEqualPayment(
      principal,
      rate,
      totalMonths,
    );
    const monthlyPayment = originalCalculation.monthlyPayment;

    // 경과 시점의 잔액 계산
    const monthlyRate = rate / 12 / 100;
    let remainingBalance = principal;

    for (let i = 0; i < elapsed; i++) {
      const interest = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interest;
      remainingBalance -= principalPayment;
    }

    // 중도상환 후 잔액
    const afterPrepaymentBalance = remainingBalance - prepayment;

    if (afterPrepaymentBalance < 0) {
      setResults({ error: "중도상환 금액이 현재 잔액보다 큽니다" });
      return;
    }

    // 중도상환 수수료 계산
    const remainingDays = (totalMonths - elapsed) * 30;
    const totalDays = totalMonths * 30;

    let prepaymentFee;
    if (loanType === "didimdol") {
      // 디딤돌: 중도상환금액 × 수수료율 × (잔여일수/약정기간)
      prepaymentFee =
        prepayment * (feeRate / 100) * (remainingDays / totalDays);
    } else {
      // 일반/보금자리/신용: 중도상환금액 × 수수료율
      prepaymentFee = prepayment * (feeRate / 100);
    }

    if (isFeeExempt) {
      prepaymentFee = 0;
    }

    // 중도상환 후 상환 계획 (잔여 기간 동일)
    const remainingMonths = totalMonths - elapsed;
    const afterCalculation = calculateEqualPayment(
      afterPrepaymentBalance,
      rate,
      remainingMonths,
    );

    // 이자 절감액 계산
    const originalRemainingInterest = originalCalculation.schedule
      .slice(elapsed)
      .reduce((sum, item) => sum + item.interest, 0);

    const newTotalInterest = afterCalculation.totalInterest;
    const interestSaved = originalRemainingInterest - newTotalInterest;

    setResults({
      originalLoan: principal,
      remainingBalance,
      prepaymentAmount: prepayment,
      prepaymentFee,
      afterBalance: afterPrepaymentBalance,
      originalMonthlyPayment: monthlyPayment,
      newMonthlyPayment: afterCalculation.monthlyPayment,
      interestSaved,
      feeRate,
      isFeeExempt,
      elapsed,
      remainingMonths,
    });
  }, [
    originalLoan,
    interestRate,
    loanPeriod,
    elapsedMonths,
    prepaymentAmount,
    loanType,
    customFeeRate,
  ]);

  return (
    <main className="main">
      <div className="page-header">
        <h2>💰 중도상환 계산기</h2>
        <p>2026년 최신 수수료율 반영 - 이자 절감액 확인</p>
      </div>

      {/* 상단 광고: 페이지 진입 시 가장 먼저 노출 */}
      <AdSense slot="3924893287" label="Top Banner" />

      <div className="calculator-container">
        {/* 대출 유형 선택 */}
        <div className="input-section">
          <h3>대출 유형</h3>
          <div className="loan-type-grid">
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
            <button
              className={`type-btn ${loanType === "credit" ? "active" : ""}`}
              onClick={() => setLoanType("credit")}
            >
              신용대출
            </button>
          </div>
        </div>

        {/* 중도상환 수수료율 입력 */}
        <div className="input-section">
          <h3>중도상환 수수료</h3>

          {loanType === "general" && (
            <div className="loan-input">
              <label className="loan-input-label">금리 유형 (참고용)</label>
              <div className="rate-type-buttons">
                <button
                  className={`type-btn ${rateType === "variable" ? "active" : ""}`}
                  onClick={() => setRateType("variable")}
                >
                  변동금리 (평균 0.7%)
                </button>
                <button
                  className={`type-btn ${rateType === "fixed" ? "active" : ""}`}
                  onClick={() => setRateType("fixed")}
                >
                  고정금리 (평균 0.7%)
                </button>
              </div>
            </div>
          )}

          {loanType === "credit" && (
            <div className="loan-input">
              <label className="loan-input-label">금리 유형 (참고용)</label>
              <div className="rate-type-buttons">
                <button
                  className={`type-btn ${rateType === "variable" ? "active" : ""}`}
                  onClick={() => setRateType("variable")}
                >
                  변동금리 (평균 0.10%)
                </button>
                <button
                  className={`type-btn ${rateType === "fixed" ? "active" : ""}`}
                  onClick={() => setRateType("fixed")}
                >
                  고정금리 (평균 0.17%)
                </button>
              </div>
            </div>
          )}

          <LoanInput
            label="중도상환 수수료율"
            value={customFeeRate}
            onChange={setCustomFeeRate}
            type="number"
            unit="%"
            min="0"
            max="3"
            step="0.01"
            helpText={
              loanType === "didimdol"
                ? "디딤돌대출 기본 0.6% (잔여일수 비례 적용)"
                : loanType === "bogeumjari"
                  ? "보금자리론 평균 1.0%"
                  : loanType === "credit"
                    ? "신용대출 평균 0.1~0.2%"
                    : "2026년 시중은행 평균 0.5~1.0% (본인 대출 약정서 확인 필수)"
            }
          />

          <div className="info-box">
            <strong>💡 수수료율 확인 방법</strong>
            <ul>
              <li>대출 약정서 또는 대출 계약서 확인</li>
              <li>은행 모바일 앱 또는 인터넷뱅킹</li>
              <li>은행 고객센터 문의</li>
              <li>은행별로 0.5~1.0% 범위이며 최근 인상 추세</li>
            </ul>
          </div>
        </div>

        {/* 기존 대출 정보 */}
        <div className="input-section">
          <h3>기존 대출 정보</h3>

          <LoanInput
            label="원래 대출 금액"
            value={originalLoanInput}
            onChange={setOriginalLoanInput}
            type="number"
            unit={loanType === "credit" ? "천만원" : "억원"}
            min="0"
            step="0.1"
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

          <LoanInput
            label="대출 기간"
            value={loanPeriod}
            onChange={setLoanPeriod}
            type="number"
            unit="개월"
            min="1"
            step="1"
          />

          <LoanInput
            label="경과 개월"
            value={elapsedMonths}
            onChange={setElapsedMonths}
            type="number"
            unit="개월"
            min="0"
            step="1"
            helpText="대출 실행 후 현재까지 경과한 개월 수"
          />

          {results && results.isFeeExempt && (
            <div className="success-box">
              ✅ 3년(36개월) 경과로 중도상환 수수료 면제 대상입니다!
            </div>
          )}
        </div>

        {/* 중도상환 정보 */}
        <div className="input-section">
          <h3>중도상환 금액</h3>

          <LoanInput
            label="상환할 금액"
            value={prepaymentAmountInput}
            onChange={setPrepaymentAmountInput}
            type="number"
            unit={loanType === "credit" ? "천만원" : "억원"}
            min="0"
            step="0.1"
          />
        </div>

        {/* 계산 결과 */}
        {results && !results.error && (
          <div className="result-section">
            <h3>중도상환 계산 결과</h3>

            {/* SEO 및 사용자 요약 (신규) */}
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
                고객님이{" "}
                <strong>{formatCurrency(results.prepaymentAmount)}</strong>을
                중도상환 하실 경우, 수수료{" "}
                {formatCurrency(results.prepaymentFee)}을 제외하고도 총{" "}
                <strong>
                  {formatCurrency(
                    results.interestSaved - results.prepaymentFee,
                  )}
                </strong>
                의 실질적인 이자 절감 효과를 보실 수 있습니다.
              </p>
            </div>

            <div className="result-cards">
              <ResultCard title="현재 잔액" value={results.remainingBalance} />
              <ResultCard
                title="중도상환 수수료"
                value={results.prepaymentFee}
                highlight={!results.isFeeExempt}
              />
              <ResultCard
                title="총 납부액"
                value={results.prepaymentAmount + results.prepaymentFee}
              />
            </div>

            {/* 중간 광고: 수치 확인 후 상세 변화 보기 전 */}
            <AdSense slot="1616685917" label="Middle Banner" />

            <div className="comparison-section">
              <h4>월 상환액 변화</h4>
              <div className="comparison-row">
                <div className="comparison-item">
                  <span className="label">기존 월 상환액</span>
                  <span className="value">
                    {formatCurrency(results.originalMonthlyPayment)}
                  </span>
                </div>
                <div className="arrow">→</div>
                <div className="comparison-item highlight">
                  <span className="label">변경 후 월 상환액</span>
                  <span className="value">
                    {formatCurrency(results.newMonthlyPayment)}
                  </span>
                </div>
                <div className="diff">
                  <strong>
                    {formatCurrency(
                      results.originalMonthlyPayment -
                        results.newMonthlyPayment,
                    )}
                  </strong>
                  <span>절감</span>
                </div>
              </div>
            </div>

            <div className="savings-box">
              <h4>💰 총 이자 절감액</h4>
              <div className="savings-amount">
                {formatCurrency(results.interestSaved - results.prepaymentFee)}
              </div>
              <div className="savings-detail">
                이자 절감: {formatCurrency(results.interestSaved)} - 수수료:{" "}
                {formatCurrency(results.prepaymentFee)}
              </div>
            </div>

            <div className="info-text">
              💡 잔여 대출 기간: {results.remainingMonths}개월
            </div>
          </div>
        )}

        {results && results.error && (
          <div className="error-box">
            <h4>❌ 계산 오류</h4>
            <p>{results.error}</p>
          </div>
        )}
      </div>

      {/* 하단 광고: 페이지 이탈 전 */}
      <AdSense slot="2611811617" label="Bottom Banner" />
    </main>
  );
}

export default PrepaymentPage;
