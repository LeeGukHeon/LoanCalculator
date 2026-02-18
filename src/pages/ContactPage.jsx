import "./GuidesPage.css";

function ContactPage() {
  return (
    <main className="main">
      <div className="page-header">
        <h2>📧 문의하기</h2>
        <p>오류 제보, 정책 정정 요청, 기능 개선 의견을 접수합니다.</p>
      </div>
      <div className="guides-container" style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <h3>이메일 문의</h3>
        <p
          style={{
            fontSize: "1.2rem",
            margin: "1.5rem 0",
            fontWeight: "bold",
            color: "#0066ff",
          }}
        >
          qkqhqk14@gmail.com
        </p>
        <p style={{ color: "#666", lineHeight: "1.7" }}>
          문의 메일에는 사용한 페이지 주소(예: /mortgage), 입력값, 기대한 결과를 함께 남겨주세요.
          <br />
          재현 가능한 형태로 보내주시면 더 빠르게 확인할 수 있습니다.
        </p>
      </div>
    </main>
  );
}

export default ContactPage;
