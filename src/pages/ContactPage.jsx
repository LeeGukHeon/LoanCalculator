import "./GuidesPage.css";

function ContactPage() {
  return (
    <main className="main">
      <div className="page-header">
        <h2>📧 문의하기</h2>
        <p>사이트 이용 중 불편한 점이나 제안사항이 있으시면 연락주세요.</p>
      </div>
      <div
        className="guides-container"
        style={{ textAlign: "center", padding: "4rem 2rem" }}
      >
        <h3>이메일 문의</h3>
        <p
          style={{
            fontSize: "1.2rem",
            margin: "2rem 0",
            fontWeight: "bold",
            color: "#0066ff",
          }}
        >
          {/* 본인의 이메일 주소로 변경하세요 */}
          qkqhqk14@gmail.com
        </p>
        <p style={{ color: "#666" }}>
          보내주신 문의는 확인 후 순차적으로 답변 드리겠습니다.
          <br />
          광고 제휴 문의도 위 메일로 부탁드립니다.
        </p>
      </div>
    </main>
  );
}

export default ContactPage;
