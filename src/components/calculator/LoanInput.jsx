import "./LoanInput.css";

function LoanInput({
  label,
  value,
  onChange,
  type = "text",
  unit,
  min,
  max,
  step,
}) {
  return (
    <div className="loan-input">
      <label className="loan-input-label">{label}</label>
      <div className="loan-input-wrapper">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="loan-input-field"
          min={min}
          max={max}
          step={step}
        />
        {unit && <span className="loan-input-unit">{unit}</span>}
      </div>
    </div>
  );
}

export default LoanInput;
