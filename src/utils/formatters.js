// 숫자를 천 단위 콤마 형식으로 변환
export function formatNumber(number) {
  return Math.round(number).toLocaleString("ko-KR");
}

// 원화 형식으로 변환
export function formatCurrency(number) {
  return `${formatNumber(number)}원`;
}

// 퍼센트 형식으로 변환
export function formatPercent(number, decimals = 2) {
  return `${number.toFixed(decimals)}%`;
}
