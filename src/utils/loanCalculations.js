// src/utils/loanCalculations.js

// 거치 기간 스케줄 생성 헬퍼 함수
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
      isGrace: true, // 거치기간임을 표시
    });
  }
  return { schedule, totalInterest: monthlyInterest * graceMonths };
}

// 원리금균등 계산 (거치 기간 지원 추가)
export function calculateEqualPayment(
  principal,
  annualRate,
  months,
  gracePeriod = 0,
) {
  const monthlyRate = annualRate / 12 / 100;
  const graceMonths = parseInt(gracePeriod) * 12; // 연 단위 -> 월 단위 변환
  const repaymentMonths = months - graceMonths;

  if (monthlyRate === 0) {
    return {
      monthlyPayment: principal / Math.max(1, repaymentMonths),
      totalPayment: principal,
      totalInterest: 0,
      schedule: [],
    };
  }

  // 1. 거치 기간 처리
  const { schedule: graceSchedule, totalInterest: graceInterest } =
    createGracePeriodSchedule(principal, monthlyRate, graceMonths);

  // 2. 상환 기간 처리
  // 거치 기간 동안 원금은 그대로이므로, 남은 기간에 대해 원리금균등 공식 적용
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
    (Math.pow(1 + monthlyRate, repaymentMonths) - 1);

  let balance = principal;
  const repaymentSchedule = [];

  for (let i = 1; i <= repaymentMonths; i++) {
    const interest = balance * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    balance -= principalPayment;

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
  // 총 납입액 = (상환기간 월납입액 * 상환개월수) + 거치기간 총 이자
  const totalPayment = monthlyPayment * repaymentMonths + graceInterest;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment, // 상환 기간 중의 월 납입액
    totalPayment,
    totalInterest,
    schedule,
  };
}

// 원금균등 계산 (거치 기간 지원 추가)
export function calculateEqualPrincipal(
  principal,
  annualRate,
  months,
  gracePeriod = 0,
) {
  const monthlyRate = annualRate / 12 / 100;
  const graceMonths = parseInt(gracePeriod) * 12;
  const repaymentMonths = months - graceMonths;

  // 1. 거치 기간 처리
  const { schedule: graceSchedule, totalInterest: graceInterest } =
    createGracePeriodSchedule(principal, monthlyRate, graceMonths);

  // 2. 상환 기간 처리
  const principalPayment = principal / repaymentMonths;

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
  const totalPayment = schedule.reduce((sum, item) => sum + item.payment, 0);
  const totalInterest = totalPayment - principal;

  return {
    firstMonthPayment: repaymentSchedule[0]?.payment || 0,
    lastMonthPayment:
      repaymentSchedule[repaymentSchedule.length - 1]?.payment || 0,
    totalPayment,
    totalInterest,
    schedule,
  };
}

// 체증식 계산 (거치 기간 없음 - 기존 로직 유지)
export function calculateIncreasingPayment(principal, annualRate, months) {
  const monthlyRate = annualRate / 12 / 100;

  // 체증률: 매년 5% 증가 (월 0.4%)
  const increaseRate = 0.004;

  let balance = principal;
  const schedule = [];

  // 첫 달 원금 납입액 계산 (역산)
  let totalDiscountFactor = 0;
  for (let i = 0; i < months; i++) {
    totalDiscountFactor +=
      Math.pow(1 + increaseRate, i) / Math.pow(1 + monthlyRate, i);
  }

  const firstPrincipalPayment = principal / totalDiscountFactor;

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principalPayment =
      firstPrincipalPayment * Math.pow(1 + increaseRate, i - 1);
    const payment = principalPayment + interest;
    balance -= principalPayment;

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
    avgMonthPayment:
      (schedule[0].payment + schedule[schedule.length - 1].payment) / 2,
    totalPayment,
    totalInterest,
    schedule,
  };
}

// 만기일시 계산 (기존 로직 유지)
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
