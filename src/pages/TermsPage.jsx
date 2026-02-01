import "./GuidesPage.css";

function TermsPage() {
  return (
    <main className="main">
      <div className="page-header">
        <h2>📜 이용약관</h2>
      </div>
      <div
        className="guides-container"
        style={{ textAlign: "left", lineHeight: "1.8" }}
      >
        <h3>1. 목적</h3>
        <p>
          본 약관은 대출 이자 계산기(이하 "사이트")가 제공하는 서비스의 이용조건
          및 절차를 규정함을 목적으로 합니다.
        </p>

        <h3>2. 서비스의 내용</h3>
        <p>
          본 사이트는 주택담보대출, 신용대출 등의 이자 계산 시뮬레이션 및 금융
          정보를 제공합니다.
        </p>

        <h3>3. 면책 조항 (중요)</h3>
        <p>
          <strong>가.</strong> 본 사이트에서 제공하는 계산 결과와 정보는
          참고용일 뿐이며, 법적 효력을 갖지 않습니다.
          <br />
          <strong>나.</strong> 실제 대출 가능 여부와 금리는 금융기관의 심사에
          따라 달라질 수 있습니다.
          <br />
          <strong>다.</strong> 사이트 운영자는 본 사이트의 정보를 활용하여
          발생한 금전적 손실이나 법적 분쟁에 대해 어떠한 책임도 지지 않습니다.
          <br />
          <strong>라.</strong> 정확한 대출 조건은 반드시 해당 금융기관에 직접
          문의하시기 바랍니다.
        </p>

        <h3>4. 저작권</h3>
        <p>
          본 사이트의 콘텐츠(계산 로직, 가이드 글 등)에 대한 저작권은 사이트
          운영자에게 있습니다.
        </p>
      </div>
    </main>
  );
}

export default TermsPage;
