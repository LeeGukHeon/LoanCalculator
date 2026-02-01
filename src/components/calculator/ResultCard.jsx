import { formatCurrency } from "../../utils/formatters";
import "./ResultCard.css";

function ResultCard({ title, value, highlight = false }) {
  return (
    <div className={`result-card ${highlight ? "highlight" : ""}`}>
      <div className="result-card-title">{title}</div>
      <div className="result-card-value">{formatCurrency(value)}</div>
    </div>
  );
}

export default ResultCard;
