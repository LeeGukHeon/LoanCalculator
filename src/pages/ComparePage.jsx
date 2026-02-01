import { useState, useEffect } from "react";
import LoanInput from "../components/calculator/LoanInput";
import {
  calculateEqualPayment,
  calculateEqualPrincipal,
  calculateBulletPayment,
} from "../utils/loanCalculations";
import { formatCurrency } from "../utils/formatters";
import "./ComparePage.css";

function ComparePage() {
  const [loanAmount, setLoanAmount] = useState("100000000"); // 1억
  const [interestRate, setInterestRate] = useState("4.5"); // 4.5%
  const [loanPeriod, setLoanPeriod] = useState("360"); // 30년
  const [results, setResults] = useState(null);

  useEffect(() => {
    calculateAll();
  }, [loanAmount, interestRate, loanPeriod]);

  const calculateAll = () => {
    const principal = parseFloat(loanAmount) || 0;
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
    const bulletPaymentResult = calculateBulletPayment(principal, rate, months);

    setResults({
      equalPayment: equalPaymentResult,
      equalPrincipal: equalPrincipalResult,
      bulletPayment: bulletPaymentResult,
    });
  };

  return (
    <main className="main">
      <div className="page-header">
        <h2>📊 상환방식 비교</h2>
        <p>원리금균등, 원금균등, 만기일시 상환 방식을 한눈에 비교</p>
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
              <option value="12">1년 (12개월)</option>
              <option value="24">2년 (24개월)</option>
              <option value="36">3년 (36개월)</option>
              <option value="60">5년 (60개월)</option>
              <option value="120">10년 (120개월)</option>
              <option value="180">15년 (180개월)</option>
              <option value="240">20년 (240개월)</option>
              <option value="300">25년 (300개월)</option>
              <option value="360">30년 (360개월)</option>
            </select>
          </div>
        </div>

        {results && (
          <div className="result-section">
            <h3>비교 결과</h3>

            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>원리금균등</th>
                    <th>원금균등</th>
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
                        parseFloat(loanAmount) +
                          results.bulletPayment.monthlyInterest,
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
                      {formatCurrency(results.bulletPayment.totalInterest)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="comparison-cards">
              <div className="comparison-card">
                <h4>💡 원리금균등</h4>
                <ul>
                  <li>매월 동일한 금액 상환</li>
                  <li>상환 계획이 안정적</li>
                  <li>초반 이자 비중 높음</li>
                  <li>가장 일반적인 방식</li>
                </ul>
              </div>

              <div className="comparison-card">
                <h4>💡 원금균등</h4>
                <ul>
                  <li>매월 원금은 동일</li>
                  <li>초반 상환액이 높음</li>
                  <li>시간이 지날수록 부담 감소</li>
                  <li>총 이자가 가장 적음</li>
                </ul>
              </div>

              <div className="comparison-card">
                <h4>💡 만기일시</h4>
                <ul>
                  <li>매월 이자만 납부</li>
                  <li>만기에 원금 일시 상환</li>
                  <li>초반 부담이 가장 적음</li>
                  <li>총 이자가 가장 많음</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ComparePage;
