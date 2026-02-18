import "./GuidesPage.css";

function TermsPage() {
  return (
    <main className="main">
      <div className="page-header">
        <h2>📜 이용약관</h2>
      </div>
      <div className="guides-container" style={{ textAlign: "left", lineHeight: "1.8" }}>
        <h3>1. 목적</h3>
        <p>
          본 약관은 대출 이자 계산기(이하 "사이트")가 제공하는 서비스의 이용 조건 및 절차를 규정함을
          목적으로 합니다.
        </p>

        <h3>2. 서비스의 내용</h3>
        <p>
          본 사이트는 주택담보대출, 신용대출 등의 이자 계산 시뮬레이션 및 금융 정보 콘텐츠를 제공합니다.
          제공 서비스는 사전 고지 없이 개선/변경될 수 있습니다.
        </p>

        <h3>3. 이용자의 책임</h3>
        <p>
          이용자는 계산 결과를 투자/대출 실행의 최종 근거로 단독 사용하지 않아야 하며,
          중요한 금융 의사결정 전에는 반드시 금융기관의 공식 안내를 확인해야 합니다.
        </p>

        <h3>4. 면책 조항 (중요)</h3>
        <p>
          <strong>가.</strong> 본 사이트의 계산 결과와 정보는 참고용이며 법적 효력을 갖지 않습니다.
          <br />
          <strong>나.</strong> 실제 대출 가능 여부와 금리는 금융기관의 심사에 따라 달라질 수 있습니다.
          <br />
          <strong>다.</strong> 사이트 운영자는 본 정보를 활용해 발생한 금전적 손실 또는 법적 분쟁에 대한 직접 책임을 지지 않습니다.
          <br />
          <strong>라.</strong> 최신 정보 및 최종 조건은 반드시 해당 금융기관에서 재확인해야 합니다.
        </p>

        <h3>5. 저작권</h3>
        <p>
          본 사이트의 콘텐츠(계산 로직 설명, 가이드 글, UI 구성물 등)에 대한 저작권은 사이트 운영자에게 있습니다.
        </p>

        <p style={{ marginTop: "2rem", color: "#666" }}>시행일자: 2026년 2월 18일</p>
      </div>
    </main>
  );
}

export default TermsPage;
