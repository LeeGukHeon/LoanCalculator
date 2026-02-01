import { Link } from "react-router-dom";
import { guides } from "../data/guides";
import "./GuidesPage.css";

function GuidesPage() {
  // 카테고리별 분류
  const categories = [...new Set(guides.map((guide) => guide.category))];

  return (
    <main className="main">
      <div className="page-header">
        <h2>📚 대출 가이드</h2>
        <p>대출에 대한 모든 것을 알려드립니다</p>
      </div>

      <div className="guides-container">
        {categories.map((category) => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category}</h3>
            <div className="guides-grid">
              {guides
                .filter((guide) => guide.category === category)
                .map((guide) => (
                  <Link
                    to={`/guides/${guide.id}`}
                    key={guide.id}
                    className="guide-card"
                  >
                    <h4>{guide.title}</h4>
                    <p className="guide-description">{guide.description}</p>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default GuidesPage;
