import { Link } from "react-router-dom";
import { guides } from "../data/guides";
import AdSense from "../components/common/AdSense";
import "./GuidesPage.css";

const GUIDE_META = {
  "mortgage-complete-guide": { updatedAt: "2026-02-18", readTime: "8분" },
  "credit-loan-guide": { updatedAt: "2026-02-18", readTime: "7분" },
  "didimdol-loan-guide": { updatedAt: "2026-02-10", readTime: "6분" },
  "bogeumjari-loan-guide": { updatedAt: "2026-02-10", readTime: "6분" },
  "ltv-dti-dsr-guide": { updatedAt: "2026-02-12", readTime: "7분" },
  "prepayment-strategy-guide": { updatedAt: "2026-02-12", readTime: "6분" },
  "loan-refinancing-guide": { updatedAt: "2026-02-14", readTime: "6분" },
  "interest-rate-cut-request-guide": { updatedAt: "2026-02-15", readTime: "5분" },
  "credit-score-management-guide": { updatedAt: "2026-02-16", readTime: "7분" },
};

function GuidesPage() {
  const categories = [...new Set(guides.map((guide) => guide.category))];

  return (
    <main className="main">
      <div className="page-header">
        <h2>📚 대출 가이드</h2>
        <p>규제 설명부터 신청 실무까지, 계산 결과를 이해할 수 있게 정리했습니다.</p>
      </div>

      <div className="guides-container" style={{ marginBottom: "2rem" }}>
        <p style={{ marginBottom: "0.5rem" }}>
          각 문서는 정책 변경 시 재검수하며 최신 검수일을 함께 표시합니다.
        </p>
        <p style={{ color: "#666" }}>
          사이트의 작성 기준과 업데이트 원칙은 <Link to="/about">운영원칙 페이지</Link>에서 확인할 수
          있습니다.
        </p>
      </div>

      <div className="guides-container">
        {categories.map((category) => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category}</h3>
            <div className="guides-grid">
              {guides
                .filter((guide) => guide.category === category)
                .map((guide) => {
                  const meta = GUIDE_META[guide.id] || {
                    updatedAt: "2026-02-01",
                    readTime: "5분",
                  };

                  return (
                    <Link to={`/guides/${guide.id}`} key={guide.id} className="guide-card">
                      <h4>{guide.title}</h4>
                      <p className="guide-description">{guide.description}</p>
                      <div className="guide-meta">
                        <span>읽기 {meta.readTime}</span>
                        <span>검수 {meta.updatedAt}</span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <AdSense slot="2611811617" label="Bottom Banner" />
    </main>
  );
}

export default GuidesPage;
