import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { guides } from "../data/guides";
import ReactMarkdown from "react-markdown";
import AdSense from "../components/common/AdSense"; // 광고 컴포넌트 추가
import "./GuideDetailPage.css";

function GuideDetailPage() {
  const { id } = useParams();
  const guide = guides.find((g) => g.id === id);

  // SEO: 가이드 제목에 맞춰 페이지 타이틀 변경
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

  // 📝 본문 중간 광고 삽입 로직
  // 긴 마크다운 텍스트를 중간 지점에서 나누어 그 사이에 광고를 넣습니다.
  const renderContentWithAd = (content) => {
    // 글이 너무 짧으면(800자 미만) 중간 광고 없이 출력
    if (content.length < 800) {
      return <ReactMarkdown>{content}</ReactMarkdown>;
    }

    // 전체 길이의 약 50% 지점부터 탐색 시작
    const middleIndex = Math.floor(content.length / 2);

    // 중간 지점 이후에 나오는 첫 번째 '문단 바꿈(\n\n)' 위치를 찾음
    // 문단 사이가 아니라면 글자 중간에 광고가 들어가는 것을 방지
    const splitIndex = content.indexOf("\n\n", middleIndex);

    if (splitIndex !== -1) {
      const part1 = content.substring(0, splitIndex);
      const part2 = content.substring(splitIndex);

      return (
        <>
          <div className="markdown-part">
            <ReactMarkdown>{part1}</ReactMarkdown>
          </div>

          {/* 🔥 본문 중간 광고 (In-Article Ad) */}
          <AdSense
            slot="4646464646"
            label="In-Article Banner"
            format="fluid" // 본문 흐름에 맞게 자연스럽게 조절
            style={{ margin: "3rem 0" }}
          />

          <div className="markdown-part">
            <ReactMarkdown>{part2}</ReactMarkdown>
          </div>
        </>
      );
    }

    // 나눌 적절한 위치를 못 찾았다면 그냥 출력
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
        </div>

        {/* 상단 광고: 제목 직후 높은 주목도 */}
        <AdSense
          slot="1313131313"
          label="Top Banner"
          style={{ marginBottom: "2rem" }}
        />

        <div className="guide-content">
          {renderContentWithAd(guide.content)}
        </div>

        {/* 하단 광고: 본문 독파 후 */}
        <AdSense slot="7979797979" label="Bottom Banner" />

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
