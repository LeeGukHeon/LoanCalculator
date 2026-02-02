// src/utils/loanLimitCalculator.js
import {
  DIDIMDOL_LOAN,
  BOGEUMJARI_LOAN,
  GENERAL_MORTGAGE,
  DIDIMDOL_DISCOUNTS,
  STRESS_DSR,
  DSR_REGULATION,
  ROOM_DEDUCTION,
  CREDIT_LOAN,
} from "./loanPolicyData";

// [LTV 계산] 지역에 따라 70/80% 분기 처리
function calculateLTVLimit(
  housePrice,
  loanType,
  isFirstHome,
  isMetropolitan,
  isApartment,
) {
  let ltvRatio = 70;

  if (loanType === "didimdol") {
    if (isFirstHome) {
      ltvRatio = isMetropolitan
        ? DIDIMDOL_LOAN.ltv.firstHomeMetro
        : DIDIMDOL_LOAN.ltv.firstHomeNonMetro;
    } else {
      ltvRatio = DIDIMDOL_LOAN.ltv.general;
    }
  } else if (loanType === "bogeumjari") {
    if (isFirstHome) {
      ltvRatio = isMetropolitan
        ? BOGEUMJARI_LOAN.ltv.firstHomeMetro
        : BOGEUMJARI_LOAN.ltv.firstHomeNonMetro;
    } else {
      ltvRatio = BOGEUMJARI_LOAN.ltv.general;
    }
  } else {
    // 시중은행
    if (isFirstHome) {
      ltvRatio = isMetropolitan
        ? GENERAL_MORTGAGE.ltv.firstHomeMetro
        : GENERAL_MORTGAGE.ltv.firstHomeNonMetro;
    } else {
      ltvRatio = GENERAL_MORTGAGE.ltv.general;
    }
  }

  let limit = housePrice * (ltvRatio / 100);

  // [방공제] 디딤돌 + 수도권 + 아파트 = 필수 차감
  if (loanType === "didimdol" && isMetropolitan && isApartment) {
    limit -= ROOM_DEDUCTION.metropolitan_overcrowded;
  }

  return limit;
}

// [DTI 계산]
function calculateDTILimit(
  annualIncome,
  interestRate,
  loanMonths,
  existingLoanMonthly,
) {
  if (annualIncome <= 0) return 0;
  const monthlyIncome = annualIncome / 12;
  const monthlyRate = interestRate / 12 / 100;
  const dtiRatio = 60;

  const availableMonthlyPayment =
    monthlyIncome * (dtiRatio / 100) - existingLoanMonthly;

  if (availableMonthlyPayment <= 0) return 0;
  if (monthlyRate === 0) return availableMonthlyPayment * loanMonths;

  return (
    (availableMonthlyPayment * (Math.pow(1 + monthlyRate, loanMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, loanMonths))
  );
}

// [DSR 계산]
function calculateDSRLimit(
  annualIncome,
  interestRate,
  loanMonths,
  existingLoanMonthly,
  isMetropolitan,
) {
  if (annualIncome <= 0) return 0;
  const monthlyIncome = annualIncome / 12;
  const dsrRatio = DSR_REGULATION.maxRatio;

  const stressRateValue = isMetropolitan
    ? STRESS_DSR.metropolitan.stressRate
    : STRESS_DSR.regional.stressRate;

  const applyRate = interestRate + stressRateValue;
  const monthlyRate = applyRate / 12 / 100;

  const availableMonthlyPayment =
    monthlyIncome * (dsrRatio / 100) - existingLoanMonthly;

  if (availableMonthlyPayment <= 0) return 0;
  if (monthlyRate === 0) return availableMonthlyPayment * loanMonths;

  return (
    (availableMonthlyPayment * (Math.pow(1 + monthlyRate, loanMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, loanMonths))
  );
}

// [메인 함수]
export function calculateMortgageLoanLimit(
  housePrice,
  annualIncome,
  annualDebt,
  loanPeriodYears,
  interestRate,
  loanType,
  isFirstTime,
  isMetropolitan = true,
  isApartment = true,
) {
  const loanMonths = loanPeriodYears * 12;
  const existingLoanMonthly = annualDebt / 12;

  // 1. 자격 검증
  if (loanType !== "general") {
    const eligibility = checkPolicyLoanEligibility(
      loanType,
      housePrice,
      annualIncome,
      true,
    );
    if (!eligibility.isEligible) {
      return {
        maxAmount: 0,
        limitingFactor: "자격 미달 (집값/소득)",
        errors: eligibility.errors,
        details: {
          ltvLimit: 0,
          incomeLimit: 0,
          maxLoanCap: 0,
          limitType: "자격미달",
        },
      };
    }
  }

  // 2. LTV 한도
  const ltvLimit = calculateLTVLimit(
    housePrice,
    loanType,
    isFirstTime,
    isMetropolitan,
    isApartment,
  );

  // 3. 소득 한도
  let incomeLimit = 0;
  let incomeLimitType = "";

  if (loanType === "general") {
    incomeLimit = calculateDSRLimit(
      annualIncome,
      interestRate,
      loanMonths,
      existingLoanMonthly,
      isMetropolitan,
    );
    incomeLimitType = isMetropolitan
      ? "DSR 40% (스트레스 1.2%)"
      : "DSR 40% (스트레스 0.75%)";
  } else {
    incomeLimit = calculateDTILimit(
      annualIncome,
      interestRate,
      loanMonths,
      existingLoanMonthly,
    );
    incomeLimitType = "DTI 60%";
  }

  // 4. 상품 한도 (Product Cap)
  let productCap = Infinity;

  if (loanType === "didimdol") {
    if (isFirstTime) productCap = DIDIMDOL_LOAN.maxAmount.firstHome;
    else productCap = DIDIMDOL_LOAN.maxAmount.general;
  } else if (loanType === "bogeumjari") {
    // 🚨 [수정됨] 수도권 여부 상관없이 생애최초면 4.2억 한도 적용
    // (단, LTV가 70%로 제한되므로 실제 대출액은 줄어들 수 있음)
    if (isFirstTime) {
      productCap = BOGEUMJARI_LOAN.maxAmount.firstHome; // 4.2억
    } else {
      productCap = BOGEUMJARI_LOAN.maxAmount.general; // 3.6억
    }
  } else {
    productCap = isFirstTime
      ? GENERAL_MORTGAGE.maxAmount.firstHome
      : GENERAL_MORTGAGE.maxAmount.unlimited;
  }

  // 5. 최종 한도
  const maxAmount = Math.floor(Math.min(ltvLimit, incomeLimit, productCap));

  let limitingFactor = "";
  if (maxAmount === productCap)
    limitingFactor = `상품 한도 (${(productCap / 100000000).toFixed(1)}억)`;
  else if (maxAmount === ltvLimit) {
    const ltvTxt = isFirstTime && !isMetropolitan ? "80%" : "70%";
    const deductTxt =
      loanType === "didimdol" && isMetropolitan && isApartment ? "-방공제" : "";
    limitingFactor = `LTV 한도 (${ltvTxt}${deductTxt})`;
  } else if (maxAmount === incomeLimit)
    limitingFactor = `소득 한도 (${incomeLimitType})`;

  return {
    maxAmount: isNaN(maxAmount) ? 0 : maxAmount,
    limitingFactor,
    ltvLimit: Math.floor(ltvLimit),
    incomeLimit: Math.floor(incomeLimit),
    maxLoanCap: productCap === Infinity ? 99999999999 : productCap,
    limitType: incomeLimitType,
    appliedLtv: isFirstTime && isMetropolitan ? 70 : isFirstTime ? 80 : 70,
  };
}

export function checkPolicyLoanEligibility(
  loanType,
  housePrice,
  annualIncome,
  isNewlywed,
) {
  const errors = [];
  if (loanType === "didimdol") {
    const priceLimit = isNewlywed
      ? DIDIMDOL_LOAN.maxHousePrice.newlywed
      : DIDIMDOL_LOAN.maxHousePrice.general;
    if (housePrice > priceLimit)
      errors.push(`주택가격 ${(priceLimit / 100000000).toFixed(1)}억 초과`);
    const incomeLimit = isNewlywed
      ? DIDIMDOL_LOAN.maxIncome.newlywed
      : DIDIMDOL_LOAN.maxIncome.general;
    if (annualIncome > incomeLimit)
      errors.push(`연소득 ${(incomeLimit / 10000000).toFixed(0)}천만원 초과`);
  } else if (loanType === "bogeumjari") {
    if (housePrice > BOGEUMJARI_LOAN.maxHousePrice)
      errors.push(`주택가격 6억 초과`);
    if (annualIncome > BOGEUMJARI_LOAN.maxIncome)
      errors.push(`연소득 1억 초과`);
  }
  return { isEligible: errors.length === 0, errors };
}

export function calculateDidimdolDiscount(
  income,
  isFirstHome,
  isNewlywed,
  childrenCount,
  hasSubscription,
  isElectronic,
) {
  let discount = 0;
  if (income <= 20000000) discount += 0.5;
  else if (income <= 40000000) discount += 0.2;
  if (isFirstHome) discount += 0.2;
  if (isNewlywed) discount += 0.2;
  if (childrenCount >= 3) discount += 0.7;
  else if (childrenCount === 2) discount += 0.5;
  else if (childrenCount === 1) discount += 0.3;
  if (hasSubscription) discount += 0.2;
  if (isElectronic) discount += 0.1;
  return parseFloat(discount.toFixed(2));
}

export function calculateCreditLoanLimit(
  annualIncome,
  existingLoanMonthly,
  loanPeriodYears,
  interestRate,
) {
  const loanMonths = loanPeriodYears * 12;
  const incomeLimit = annualIncome * CREDIT_LOAN.maxRatio;
  const dsrRatio = CREDIT_LOAN.dsr;
  const stressRate = interestRate + 1.5;
  const monthlyRate = stressRate / 12 / 100;
  const availableMonthlyPayment =
    (annualIncome / 12) * (dsrRatio / 100) - existingLoanMonthly;

  if (availableMonthlyPayment <= 0)
    return {
      maxAmount: 0,
      limitingFactor: "DSR 초과",
      errors: ["기존 대출 과다"],
      details: { incomeLimit, dsrLimit: 0 },
    };

  let dsrLimit = 0;
  if (monthlyRate === 0) dsrLimit = availableMonthlyPayment * loanMonths;
  else
    dsrLimit =
      (availableMonthlyPayment * (Math.pow(1 + monthlyRate, loanMonths) - 1)) /
      (monthlyRate * Math.pow(1 + monthlyRate, loanMonths));

  const maxAmount = Math.floor(Math.min(incomeLimit, dsrLimit));
  return {
    maxAmount,
    limitingFactor: maxAmount === incomeLimit ? "연소득 1배 제한" : "DSR 제한",
    errors: [],
    details: { incomeLimit, dsrLimit },
  };
}
