import { useParams, Link } from "react-router-dom";
import { guides } from "../data/guides";
import ReactMarkdown from "react-markdown";
import "./GuideDetailPage.css";

function GuideDetailPage() {
  const { id } = useParams();
  const guide = guides.find((g) => g.id === id);

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

  return (
    <main className="main">
      <div className="guide-detail-container">
        <div className="guide-header">
          <Link to="/guides" className="back-link">
            ← 목록으로
          </Link>
          <div className="guide-category-badge">{guide.category}</div>
          <h1>{guide.title}</h1>
        </div>

        <div className="guide-content">
          <ReactMarkdown>{guide.content}</ReactMarkdown>
        </div>

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
