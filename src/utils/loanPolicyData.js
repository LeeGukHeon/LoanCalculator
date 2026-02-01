// 2026년 대출 정책 데이터

// 디딤돌대출
export const DIDIMDOL_LOAN = {
  name: "디딤돌대출",
  maxAmount: {
    general: 250000000, // 2.5억
    firstHome: 300000000, // 3억
    newlywed: 400000000, // 4억
  },
  maxHousePrice: 500000000, // 5억
  maxIncome: {
    general: 60000000, // 6천만원
    newlywed: 70000000, // 7천만원
  },
  baseRate: {
    min: 2.45,
    max: 3.55,
  },
  ltv: {
    general: 70,
    firstHome: 80,
  },
  dti: 60,
};

// 보금자리론
export const BOGEUMJARI_LOAN = {
  name: "보금자리론",
  maxAmount: 360000000, // 3.6억
  maxHousePrice: {
    metropolitan: 900000000, // 9억
    other: 600000000, // 6억
  },
  maxIncome: 100000000, // 1억
  baseRate: {
    min: 3.15,
    max: 3.9,
  },
  ltv: {
    general: 70,
    firstHome: 80,
  },
  dti: 60,
};

// 일반 주택담보대출
export const GENERAL_MORTGAGE = {
  name: "일반 주택담보대출",
  baseRate: {
    min: 3.5,
    max: 6.0,
  },
  ltv: {
    general: 70,
    firstHome: 80,
    regulated: 40, // 규제지역
    regulatedFirstHome: 70, // 규제지역 생애최초
  },
  dti: 60,
  dsr: 40,
};

// 디딤돌대출 우대금리
export const DIDIMDOL_DISCOUNTS = {
  income: {
    under20M: -1.0,
    "20to40M": -0.5,
    over40M: 0,
  },
  firstHome: -0.2,
  newlywed: -0.2,
  children: {
    one: -0.3,
    two: -0.5,
    three: -0.7,
  },
  subscription: -0.3,
  electronic: -0.1,
};

// 스트레스 DSR
export const STRESS_DSR = {
  metropolitan: {
    stressRate: 3.0,
    ratio: 1.0,
  },
  regional: {
    stressRate: 1.5,
    ratio: 0.5,
    endDate: "2026-06-30", // 유예 종료일
  },
};

// DSR 규제
export const DSR_REGULATION = {
  threshold: 100000000, // 1억 초과 시 적용
  maxRatio: 40, // 40%
};
