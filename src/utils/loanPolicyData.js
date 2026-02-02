// src/utils/loanPolicyData.js

/**
 * [1] 내집마련 디딤돌대출 (2026년 기준)
 * - 수도권 아파트: 방공제 필수, LTV 70% 제한
 */
export const DIDIMDOL_LOAN = {
  name: "내집마련 디딤돌대출",
  maxAmount: {
    general: 250000000, // 2.5억
    firstHome: 300000000, // 3.0억
    newlywed: 400000000, // 4.0억
  },
  maxHousePrice: {
    general: 500000000, // 5억
    newlywed: 600000000, // 6억
  },
  maxIncome: {
    general: 60000000,
    firstHome: 70000000,
    newlywed: 85000000,
  },
  baseRate: { min: 2.65, max: 3.95 },
  ltv: {
    general: 70,
    firstHomeMetro: 70, // 수도권 생애최초 70%
    firstHomeNonMetro: 80, // 비수도권 생애최초 80%
  },
  dti: 60,
};

/**
 * [2] 보금자리론
 * - 생애최초 한도: 지역 무관 4.2억 (기존 firstHomeLtv80 -> firstHome으로 명칭 통일)
 * - LTV: 지역에 따라 70/80% 차등
 */
export const BOGEUMJARI_LOAN = {
  name: "보금자리론",
  maxAmount: {
    general: 360000000, // 3.6억
    firstHome: 420000000, // 4.2억 (수도권이어도 한도는 4.2억 적용)
  },
  maxHousePrice: 600000000, // 6억
  maxIncome: 100000000, // 1억
  baseRate: { min: 3.9, max: 4.5 },
  ltv: {
    general: 70,
    firstHomeMetro: 70, // 수도권 70%
    firstHomeNonMetro: 80, // 비수도권 80%
  },
  dti: 60,
};

/**
 * [3] 일반 주택담보대출
 */
export const GENERAL_MORTGAGE = {
  name: "일반 주택담보대출",
  baseRate: { min: 4.0, max: 6.5 },
  ltv: {
    general: 70,
    firstHomeMetro: 70,
    firstHomeNonMetro: 80,
    regulated: 50,
    regulatedFirstHome: 60,
  },
  maxAmount: {
    firstHome: 600000000, // 6억
    unlimited: 10000000000,
  },
  dti: 60,
  dsr: 40,
};

export const STRESS_DSR = {
  metropolitan: { stressRate: 1.2, ratio: 1.0 },
  regional: { stressRate: 0.75, ratio: 1.0 },
};

export const ROOM_DEDUCTION = {
  seoul: 55000000,
  metropolitan_overcrowded: 48000000,
  metropolitan: 28000000,
  other: 25000000,
};

export const DSR_REGULATION = { threshold: 100000000, maxRatio: 40 };

export const DIDIMDOL_DISCOUNTS = {
  income: { under20M: -0.5, "20to40M": -0.2 },
  firstHome: -0.2,
  newlywed: -0.2,
  children: { one: -0.3, two: -0.5, three: -0.7 },
  subscription: -0.2,
  electronic: -0.1,
};

export const CREDIT_LOAN = {
  name: "신용대출",
  maxRatio: 1.0,
  baseRate: { min: 5.5, max: 12.0 },
  dsr: 40,
};

export const CREDIT_RATING_RATES = {
  grade1: { min: 5.5, max: 6.5, name: "1등급 (942점 이상)" },
  grade2: { min: 6.51, max: 7.5, name: "2등급 (891~941점)" },
  grade3: { min: 7.51, max: 8.5, name: "3등급 (832~890점)" },
  grade4: { min: 8.51, max: 9.5, name: "4등급 (768~831점)" },
  grade5: { min: 9.51, max: 10.5, name: "5등급 (698~767점)" },
  grade6: { min: 10.51, max: 11.5, name: "6등급 (630~697점)" },
  grade7: { min: 11.51, max: 12.5, name: "7등급 (530~629점)" },
  grade8: { min: 12.51, max: 13.5, name: "8등급 (454~529점)" },
  grade9: { min: 13.51, max: 14.5, name: "9등급 (335~453점)" },
  grade10: { min: 14.51, max: 19.9, name: "10등급 (335점 미만)" },
};
