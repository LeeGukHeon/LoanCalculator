import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { guides } from "../data/guides";
import ReactMarkdown from "react-markdown";
import AdSense from "../components/common/AdSense";
import "./GuideDetailPage.css";

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

function GuideDetailPage() {
  const { id } = useParams();
  const guide = guides.find((g) => g.id === id);
  const meta = GUIDE_META[id] || { updatedAt: "2026-02-01", readTime: "5분" };

  useEffect(() => {
    if (guide) {
      document.title = `${guide.title} - 대출 계산기 가이드`;
    } else {
      document.title = "가이드를 찾을 수 없습니다";
    }
  }, [guide]);

  if (!guide) {
    return (
      <main className="main">
        <div className="not-found">
          <h2>가이드를 찾을 수 없습니다</h2>
          <Link to="/guides" className="btn">
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const renderContentWithAd = (content) => {
    if (content.length < 800) {
      return <ReactMarkdown>{content}</ReactMarkdown>;
    }

    const middleIndex = Math.floor(content.length / 2);
    const splitIndex = content.indexOf("\n\n", middleIndex);

    if (splitIndex !== -1) {
      const part1 = content.substring(0, splitIndex);
      const part2 = content.substring(splitIndex);

      return (
        <>
          <div className="markdown-part">
            <ReactMarkdown>{part1}</ReactMarkdown>
          </div>

          <AdSense
            slot="7157221978"
            label="In-Article Banner"
            format="fluid"
            style={{ margin: "3rem 0" }}
          />

          <div className="markdown-part">
            <ReactMarkdown>{part2}</ReactMarkdown>
          </div>
        </>
      );
    }

    return <ReactMarkdown>{content}</ReactMarkdown>;
  };

  return (
    <main className="main">
      <div className="guide-detail-container">
        <div className="guide-header">
          <Link to="/guides" className="back-link">
            ← 목록으로
          </Link>
          <div className="guide-category-badge">{guide.category}</div>
          <h1>{guide.title}</h1>
          <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
            읽기 시간 {meta.readTime} · 최신 검수일 {meta.updatedAt}
          </p>
        </div>

        <div className="guides-container" style={{ marginBottom: "2rem" }}>
          <p>
            본 문서는 정보 제공을 위한 콘텐츠이며, 실제 심사 기준은 금융기관의 내부 정책에 따라
            달라질 수 있습니다. 계산기로 수치를 확인한 뒤 은행 상담에서 최종 조건을 반드시
            확인하세요.
          </p>
        </div>

        <div className="guide-content">{renderContentWithAd(guide.content)}</div>

        <AdSense slot="2611811617" label="Bottom Banner" />

        <div className="guide-footer">
          <Link to="/guides" className="btn">
            목록으로 돌아가기
          </Link>
        </div>

        <div className="related-calculators">
          <h3>관련 계산기</h3>
          <div className="calculator-links">
            {guide.category === "주택담보대출" && (
              <>
                <Link to="/mortgage" className="calc-link">
                  주택담보대출 계산기
                </Link>
                <Link to="/prepayment" className="calc-link">
                  중도상환 계산기
                </Link>
              </>
            )}
            {guide.category === "신용대출" && (
              <>
                <Link to="/credit" className="calc-link">
                  신용대출 계산기
                </Link>
                <Link to="/prepayment" className="calc-link">
                  중도상환 계산기
                </Link>
              </>
            )}
            <Link to="/compare" className="calc-link">
              상환방식 비교
            </Link>
            <Link to="/rates" className="calc-link">
              은행별 금리 비교
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default GuideDetailPage;
