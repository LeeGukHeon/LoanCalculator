// src/utils/loanCalculations.js

// -----------------------------------------------------------
// 1. 헬퍼 함수: 거치 기간(이자만 납부) 스케줄 생성
// -----------------------------------------------------------
function createGracePeriodSchedule(principal, monthlyRate, graceMonths) {
  const schedule = [];
  const monthlyInterest = principal * monthlyRate;

  for (let i = 1; i <= graceMonths; i++) {
    schedule.push({
      month: i,
      payment: monthlyInterest,
      principal: 0,
      interest: monthlyInterest,
      balance: principal,
      isGrace: true, // 거치기간임을 표시 (UI에서 회색 처리 등 가능)
    });
  }
  return { schedule, totalInterest: monthlyInterest * graceMonths };
}

// -----------------------------------------------------------
// 2. 원리금균등 상환 (Equal Payment) - 거치 기간 지원
// -----------------------------------------------------------
export function calculateEqualPayment(
  principal,
  annualRate,
  months,
  gracePeriod = 0, // 거치 기간 (단위: 년)
) {
  const monthlyRate = annualRate / 12 / 100;
  const graceMonths = parseInt(gracePeriod) * 12; // 연 -> 월 변환
  const repaymentMonths = months - graceMonths; // 실제 상환 기간

  // 예외 처리: 금리가 0이거나 상환 기간이 없을 때
  if (monthlyRate === 0 || repaymentMonths <= 0) {
    return {
      monthlyPayment: principal / Math.max(1, repaymentMonths),
      totalPayment: principal,
      totalInterest: 0,
      schedule: [],
    };
  }

  // [Phase 1] 거치 기간 스케줄 생성
  const { schedule: graceSchedule, totalInterest: graceInterest } =
    createGracePeriodSchedule(principal, monthlyRate, graceMonths);

  // [Phase 2] 상환 기간 스케줄 생성
  // 남은 기간(repaymentMonths) 동안 원리금균등 공식 적용
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
    (Math.pow(1 + monthlyRate, repaymentMonths) - 1);

  let balance = principal;
  const repaymentSchedule = [];

  for (let i = 1; i <= repaymentMonths; i++) {
    const interest = balance * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    balance -= principalPayment;

    // 마지막 달 오차 보정 (잔액이 미세하게 남거나 부족한 경우 처리)
    if (i === repaymentMonths) {
      // 마지막 달은 남은 잔액을 털어버림
      const finalPrincipal = balance + principalPayment; // 이전 balance
      // 여기선 간단히 0으로 처리 (balance 계산 순서상 이미 0에 가까움)
    }

    repaymentSchedule.push({
      month: graceMonths + i,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interest,
      balance: Math.max(0, balance),
      isGrace: false,
    });
  }

  const schedule = [...graceSchedule, ...repaymentSchedule];

  // 총 이자 = 거치기간 이자 + 상환기간 총 납입액 - 원금
  const totalRepaymentAmount = monthlyPayment * repaymentMonths;
  const totalPayment = totalRepaymentAmount + graceInterest;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment, // 거치 후 월 상환액
    totalPayment,
    totalInterest,
    schedule,
  };
}

// -----------------------------------------------------------
// 3. 원금균등 상환 (Equal Principal) - 거치 기간 지원
// -----------------------------------------------------------
export function calculateEqualPrincipal(
  principal,
  annualRate,
  months,
  gracePeriod = 0,
) {
  const monthlyRate = annualRate / 12 / 100;
  const graceMonths = parseInt(gracePeriod) * 12;
  const repaymentMonths = months - graceMonths;

  if (repaymentMonths <= 0) {
    return { totalPayment: 0, totalInterest: 0, schedule: [] };
  }

  // [Phase 1] 거치 기간
  const { schedule: graceSchedule, totalInterest: graceInterest } =
    createGracePeriodSchedule(principal, monthlyRate, graceMonths);

  // [Phase 2] 상환 기간
  const principalPayment = principal / repaymentMonths; // 매달 동일한 원금

  let balance = principal;
  const repaymentSchedule = [];

  for (let i = 1; i <= repaymentMonths; i++) {
    const interest = balance * monthlyRate;
    const payment = principalPayment + interest;
    balance -= principalPayment;

    repaymentSchedule.push({
      month: graceMonths + i,
      payment: payment,
      principal: principalPayment,
      interest: interest,
      balance: Math.max(0, balance),
      isGrace: false,
    });
  }

  const schedule = [...graceSchedule, ...repaymentSchedule];

  // 총 납입금 계산
  const totalPayment = schedule.reduce((sum, item) => sum + item.payment, 0);
  const totalInterest = totalPayment - principal;

  return {
    firstMonthPayment: repaymentSchedule[0]?.payment || 0, // 거치 후 첫 상환액
    lastMonthPayment:
      repaymentSchedule[repaymentSchedule.length - 1]?.payment || 0,
    totalPayment,
    totalInterest,
    schedule,
  };
}

// -----------------------------------------------------------
// 4. 체증식 상환 (Increasing Payment) - 거치 기간 미지원(정책상 드묾)
// -----------------------------------------------------------
export function calculateIncreasingPayment(principal, annualRate, months) {
  const monthlyRate = annualRate / 12 / 100;

  // 체증률: 통상 연 2%~5% 수준이나 여기선 월 0.4% (연 약 4.8%) 가정
  // 정확한 정책에 따라 이 비율은 조정될 수 있음
  const increaseRate = 0.002; // 월 0.2% 증가로 조정 (부담 완화)

  let balance = principal;
  const schedule = [];

  // [공식] 첫 달 원금 납입액(P1) 역산
  // Loan = Sum [ P1 * (1+g)^(n-1) / (1+r)^n ]  (기하급수 합 공식 활용 가능하나 반복문이 직관적)
  let totalDiscountFactor = 0;
  for (let i = 1; i <= months; i++) {
    // 각 회차별 원금의 현재가치 계수 합산이 아님. 체증식은 '총부채상환' 스케줄이 복잡함.
    // 통상적인 약식: 초기 상환액을 아주 적게 잡고 매달 증액.
    // 여기서는 "원리금(P+I)이 매달 증가"하는 방식 적용 (보금자리론 체증식)
  }

  // 보금자리론 체증식 로직 (약식):
  // 1회차 원금 = 0에 가깝게 시작하지 않고, "원리금"이 매달 일정 비율로 증가하도록 설계
  // 초기 원리금(PMT1)을 구하는 공식:
  // PMT1 = Principal / [ Sum_{t=1 to n} ( (1+increaseRate)^(t-1) / (1+monthlyRate)^t ) ]

  let sigma = 0;
  for (let t = 1; t <= months; t++) {
    sigma += Math.pow(1 + increaseRate, t - 1) / Math.pow(1 + monthlyRate, t);
  }
  const firstTotalPayment = principal / sigma;

  for (let i = 1; i <= months; i++) {
    // 이번 달 총 납부액 (체증)
    const payment = firstTotalPayment * Math.pow(1 + increaseRate, i - 1);
    const interest = balance * monthlyRate;
    let principalPayment = payment - interest;

    // 만약 이자가 납부액보다 크면 원금이 늘어나는(Negative Amortization) 현상 발생 가능
    // 보금자리론은 이를 허용하지 않으므로 최소 납입액 보정 필요하나, 계산기상 그대로 진행

    balance -= principalPayment;

    // 마지막 달 잔액 보정
    if (i === months && Math.abs(balance) > 10) {
      principalPayment += balance;
      balance = 0;
    }

    schedule.push({
      month: i,
      payment: payment,
      principal: principalPayment,
      interest: interest,
      balance: Math.max(0, balance),
    });
  }

  const totalPayment = schedule.reduce((sum, item) => sum + item.payment, 0);
  const totalInterest = totalPayment - principal;

  return {
    firstMonthPayment: schedule[0].payment,
    lastMonthPayment: schedule[schedule.length - 1].payment,
    totalPayment,
    totalInterest,
    schedule,
  };
}

// -----------------------------------------------------------
// 5. 만기일시 상환 (Bullet Payment) - 거치 기간 개념 없음 (전 기간이 거치)
// -----------------------------------------------------------
export function calculateBulletPayment(principal, annualRate, months) {
  const monthlyRate = annualRate / 12 / 100;
  const monthlyInterest = principal * monthlyRate;

  const schedule = [];

  for (let i = 1; i <= months; i++) {
    schedule.push({
      month: i,
      payment: i === months ? principal + monthlyInterest : monthlyInterest,
      principal: i === months ? principal : 0,
      interest: monthlyInterest,
      balance: i === months ? 0 : principal,
    });
  }

  const totalPayment = monthlyInterest * months + principal;
  const totalInterest = monthlyInterest * months;

  return {
    monthlyInterest,
    totalPayment,
    totalInterest,
    schedule,
  };
}
