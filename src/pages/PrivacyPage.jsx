import "./GuidesPage.css";

function PrivacyPage() {
  return (
    <main className="main">
      <div className="page-header">
        <h2>🔒 개인정보처리방침</h2>
      </div>
      <div className="guides-container" style={{ textAlign: "left", lineHeight: "1.8" }}>
        <h3>1. 개인정보의 처리 목적</h3>
        <p>
          '대출 이자 계산기'(이하 '사이트')는 회원가입 없이 이용 가능한 무료 서비스입니다. 사용자가 입력하는
          대출 금액, 금리, 기간 정보는 브라우저 내 계산 목적으로만 사용되며, 별도 계정 DB로 수집/저장하지 않습니다.
        </p>

        <h3>2. 처리 항목 및 보유 기간</h3>
        <p>
          사이트 운영자는 사용자가 계산기에 직접 입력한 금융 데이터를 서버에 저장하지 않습니다.
          단, 서비스 안정화를 위한 최소한의 접속 로그(브라우저 정보, 접속 시각 등)가 호스팅 사업자 또는
          분석 도구에 의해 제한적으로 처리될 수 있으며, 법령 또는 제공사 정책에 따라 관리됩니다.
        </p>

        <h3>3. 쿠키(Cookie)의 운용 및 거부</h3>
        <p>
          본 사이트는 Google AdSense 광고를 게재할 수 있으며, 구글과 제3자 벤더는 쿠키를 사용해
          관심 기반 광고를 제공할 수 있습니다. 사용자는 브라우저 설정에서 쿠키 저장 거부가 가능합니다.
        </p>

        <h3>4. 제3자 서비스</h3>
        <p>
          본 사이트는 광고 및 방문 통계 확인을 위해 외부 서비스를 사용할 수 있습니다. 자세한 데이터 정책은
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer"> Google 광고 정책 </a>
          을 참고하시기 바랍니다.
        </p>

        <h3>5. 문의처</h3>
        <p>
          개인정보 처리 관련 문의는 문의하기 페이지의 이메일을 통해 접수할 수 있습니다.
        </p>

        <p style={{ marginTop: "2rem", color: "#666" }}>시행일자: 2026년 2월 18일</p>
      </div>
    </main>
  );
}

export default PrivacyPage;
