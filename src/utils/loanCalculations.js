// 원리금균등 계산
export function calculateEqualPayment(principal, annualRate, months) {
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return {
      monthlyPayment: principal / months,
      totalPayment: principal,
      totalInterest: 0,
      schedule: [],
    };
  }

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  let balance = principal;
  const schedule = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    balance -= principalPayment;

    schedule.push({
      month: i,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interest,
      balance: Math.max(0, balance),
    });
  }

  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    schedule,
  };
}

// 원금균등 계산
export function calculateEqualPrincipal(principal, annualRate, months) {
  const monthlyRate = annualRate / 12 / 100;
  const principalPayment = principal / months;

  let balance = principal;
  const schedule = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
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
    totalPayment,
    totalInterest,
    schedule,
  };
}

// 만기일시 계산
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
