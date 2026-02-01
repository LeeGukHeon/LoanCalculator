import {
  DIDIMDOL_LOAN,
  BOGEUMJARI_LOAN,
  GENERAL_MORTGAGE,
  DIDIMDOL_DISCOUNTS,
  STRESS_DSR,
  DSR_REGULATION,
} from "./loanPolicyData";

// LTV 기반 대출 한도 계산
export function calculateLTVLimit(
  housePrice,
  loanType,
  isFirstHome,
  isRegulated,
) {
  let ltvRatio;

  if (loanType === "didimdol") {
    ltvRatio = isFirstHome
      ? DIDIMDOL_LOAN.ltv.firstHome
      : DIDIMDOL_LOAN.ltv.general;
  } else if (loanType === "bogeumjari") {
    ltvRatio = isFirstHome
      ? BOGEUMJARI_LOAN.ltv.firstHome
      : BOGEUMJARI_LOAN.ltv.general;
  } else {
    // 일반 주택담보대출
    if (isRegulated) {
      ltvRatio = isFirstHome
        ? GENERAL_MORTGAGE.ltv.regulatedFirstHome
        : GENERAL_MORTGAGE.ltv.regulated;
    } else {
      ltvRatio = isFirstHome
        ? GENERAL_MORTGAGE.ltv.firstHome
        : GENERAL_MORTGAGE.ltv.general;
    }
  }

  return housePrice * (ltvRatio / 100);
}

// DTI 기반 대출 한도 계산
export function calculateDTILimit(
  annualIncome,
  loanAmount,
  interestRate,
  loanMonths,
  existingDebt = 0,
) {
  const monthlyIncome = annualIncome / 12;
  const dtiRatio = 60; // 60% 고정

  // 가능한 월 상환액
  const maxMonthlyPayment = monthlyIncome * (dtiRatio / 100) - existingDebt;

  if (maxMonthlyPayment <= 0) {
    return 0;
  }

  // 월이율
  const monthlyRate = interestRate / 12 / 100;

  if (monthlyRate === 0) {
    return maxMonthlyPayment * loanMonths;
  }

  // 역산: 월 상환액으로부터 대출 원금 계산 (원리금균등 기준)
  const maxLoanAmount =
    (maxMonthlyPayment * (Math.pow(1 + monthlyRate, loanMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, loanMonths));

  return maxLoanAmount;
}

// DSR 기반 대출 한도 계산 (스트레스 DSR 포함)
export function calculateDSRLimit(
  annualIncome,
  interestRate,
  loanMonths,
  existingLoanMonthly = 0,
  isMetropolitan = true,
) {
  const monthlyIncome = annualIncome / 12;
  const dsrRatio = DSR_REGULATION.maxRatio; // 40%

  // 스트레스 금리 적용
  let stressRate;
  if (isMetropolitan) {
    stressRate = interestRate + STRESS_DSR.metropolitan.stressRate;
  } else {
    stressRate = interestRate + STRESS_DSR.regional.stressRate;
  }

  const monthlyRate = stressRate / 12 / 100;

  // 가능한 총 월 상환액
  const maxTotalMonthlyPayment = monthlyIncome * (dsrRatio / 100);

  // 신규 대출에 사용 가능한 월 상환액
  const availableMonthlyPayment = maxTotalMonthlyPayment - existingLoanMonthly;

  if (availableMonthlyPayment <= 0) {
    return 0;
  }

  if (monthlyRate === 0) {
    return availableMonthlyPayment * loanMonths;
  }

  // 역산: 월 상환액으로부터 대출 원금 계산
  const maxLoanAmount =
    (availableMonthlyPayment * (Math.pow(1 + monthlyRate, loanMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, loanMonths));

  return maxLoanAmount;
}

// 디딤돌대출 우대금리 계산
export function calculateDidimdolDiscount(
  income,
  isFirstHome,
  isNewlywed,
  childrenCount,
  hasSubscription,
  isElectronic,
) {
  let totalDiscount = 0;

  // 소득별 우대
  if (income <= 20000000) {
    totalDiscount += DIDIMDOL_DISCOUNTS.income.under20M;
  } else if (income <= 40000000) {
    totalDiscount += DIDIMDOL_DISCOUNTS.income["20to40M"];
  }

  // 생애최초
  if (isFirstHome) {
    totalDiscount += DIDIMDOL_DISCOUNTS.firstHome;
  }

  // 신혼부부
  if (isNewlywed) {
    totalDiscount += DIDIMDOL_DISCOUNTS.newlywed;
  }

  // 자녀수
  if (childrenCount === 1) {
    totalDiscount += DIDIMDOL_DISCOUNTS.children.one;
  } else if (childrenCount === 2) {
    totalDiscount += DIDIMDOL_DISCOUNTS.children.two;
  } else if (childrenCount >= 3) {
    totalDiscount += DIDIMDOL_DISCOUNTS.children.three;
  }

  // 청약저축
  if (hasSubscription) {
    totalDiscount += DIDIMDOL_DISCOUNTS.subscription;
  }

  // 전자계약
  if (isElectronic) {
    totalDiscount += DIDIMDOL_DISCOUNTS.electronic;
  }

  return totalDiscount;
}

// 정책대출 자격 검증
export function checkPolicyLoanEligibility(
  loanType,
  housePrice,
  annualIncome,
  isNewlywed,
) {
  const errors = [];

  if (loanType === "didimdol") {
    // 주택가격 검증
    if (housePrice > DIDIMDOL_LOAN.maxHousePrice) {
      errors.push(
        `주택 가격이 ${(DIDIMDOL_LOAN.maxHousePrice / 100000000).toFixed(1)}억원을 초과합니다`,
      );
    }

    // 소득 검증
    const maxIncome = isNewlywed
      ? DIDIMDOL_LOAN.maxIncome.newlywed
      : DIDIMDOL_LOAN.maxIncome.general;
    if (annualIncome > maxIncome) {
      errors.push(
        `연소득이 ${(maxIncome / 10000000).toFixed(0)}천만원을 초과합니다`,
      );
    }
  } else if (loanType === "bogeumjari") {
    // 소득 검증
    if (annualIncome > BOGEUMJARI_LOAN.maxIncome) {
      errors.push(
        `연소득이 ${(BOGEUMJARI_LOAN.maxIncome / 100000000).toFixed(0)}억원을 초과합니다`,
      );
    }
  }

  return {
    isEligible: errors.length === 0,
    errors,
  };
}

// 최종 대출 한도 계산 (LTV, DTI, DSR 중 최소값)
export function calculateMaxLoanAmount(params) {
  const {
    loanType,
    housePrice,
    annualIncome,
    interestRate,
    loanMonths,
    isFirstHome,
    isRegulated,
    isMetropolitan,
    existingDebt,
    existingLoanMonthly,
    isNewlywed,
  } = params;

  // 정책대출 자격 검증
  if (loanType !== "general") {
    const eligibility = checkPolicyLoanEligibility(
      loanType,
      housePrice,
      annualIncome,
      isNewlywed,
    );
    if (!eligibility.isEligible) {
      return {
        maxAmount: 0,
        limitingFactor: "eligibility",
        errors: eligibility.errors,
        details: {},
      };
    }
  }

  // LTV 한도
  const ltvLimit = calculateLTVLimit(
    housePrice,
    loanType,
    isFirstHome,
    isRegulated,
  );

  // DTI 한도
  const dtiLimit = calculateDTILimit(
    annualIncome,
    housePrice,
    interestRate,
    loanMonths,
    existingDebt,
  );

  // DSR 한도 (1억 초과 시만 적용)
  let dsrLimit = Infinity;
  if (housePrice > DSR_REGULATION.threshold) {
    dsrLimit = calculateDSRLimit(
      annualIncome,
      interestRate,
      loanMonths,
      existingLoanMonthly,
      isMetropolitan,
    );
  }

  // 정책대출 최대 한도
  let policyMaxLimit = Infinity;
  if (loanType === "didimdol") {
    if (isFirstHome) {
      policyMaxLimit = DIDIMDOL_LOAN.maxAmount.firstHome;
    } else if (isNewlywed) {
      policyMaxLimit = DIDIMDOL_LOAN.maxAmount.newlywed;
    } else {
      policyMaxLimit = DIDIMDOL_LOAN.maxAmount.general;
    }
  } else if (loanType === "bogeumjari") {
    policyMaxLimit = BOGEUMJARI_LOAN.maxAmount;
  }

  // 최소값 선택
  const limits = [ltvLimit, dtiLimit, dsrLimit, policyMaxLimit];
  const maxAmount = Math.min(...limits);

  let limitingFactor;
  if (maxAmount === ltvLimit) {
    limitingFactor = "LTV";
  } else if (maxAmount === dtiLimit) {
    limitingFactor = "DTI";
  } else if (maxAmount === dsrLimit) {
    limitingFactor = "DSR";
  } else {
    limitingFactor = "정책대출 한도";
  }

  return {
    maxAmount,
    limitingFactor,
    errors: [],
    details: {
      ltvLimit,
      dtiLimit,
      dsrLimit: dsrLimit === Infinity ? null : dsrLimit,
      policyMaxLimit: policyMaxLimit === Infinity ? null : policyMaxLimit,
    },
  };
}
