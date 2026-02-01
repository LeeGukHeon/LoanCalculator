import "./GuidesPage.css"; // 스타일 재사용

function PrivacyPage() {
  return (
    <main className="main">
      <div className="page-header">
        <h2>🔒 개인정보처리방침</h2>
      </div>
      <div
        className="guides-container"
        style={{ textAlign: "left", lineHeight: "1.8" }}
      >
        <h3>1. 개인정보의 처리 목적</h3>
        <p>
          '대출 이자 계산기'(이하 '사이트')는 별도의 회원가입 없이 이용 가능한
          무료 서비스입니다. 사용자가 입력하는 대출 금액, 금리 등의 정보는
          브라우저 내에서 계산 목적으로만 사용되며, 서버로 전송되거나 저장되지
          않습니다.
        </p>

        <h3>2. 쿠키(Cookie)의 운용 및 거부</h3>
        <p>
          본 사이트는 구글 애드센스(Google AdSense) 광고를 게재하고 있습니다.
          구글과 제3자 벤더는 쿠키를 사용하여 사용자의 과거 방문 기록을 바탕으로
          맞춤형 광고를 제공할 수 있습니다. 사용자는 웹 브라우저 옵션 설정을
          통해 쿠키 저장을 거부할 수 있습니다.
        </p>

        <h3>3. 제3자 광고 서비스</h3>
        <p>
          본 사이트는 수익 창출을 위해 Google AdSense를 사용합니다. Google은
          광고 제공을 위해 사용자의 데이터를 수집할 수 있으며, 이에 대한 자세한
          내용은{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noreferrer"
          >
            Google 광고 정책
          </a>
          을 참고하시기 바랍니다.
        </p>

        <p style={{ marginTop: "2rem", color: "#666" }}>
          시행일자: 2026년 2월 1일
        </p>
      </div>
    </main>
  );
}

export default PrivacyPage;
