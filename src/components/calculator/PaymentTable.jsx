import { formatCurrency } from "../../utils/formatters";
import "./PaymentTable.css";

function PaymentTable({ schedule }) {
  // 처음 12개월만 표시
  const displaySchedule = schedule.slice(0, 12);

  return (
    <div className="payment-table-container">
      <h3>상환 스케줄 (처음 12개월)</h3>
      <div className="table-wrapper">
        <table className="payment-table">
          <thead>
            <tr>
              <th>회차</th>
              <th>납입액</th>
              <th>원금</th>
              <th>이자</th>
              <th>잔액</th>
            </tr>
          </thead>
          <tbody>
            {displaySchedule.map((item) => (
              <tr key={item.month}>
                <td>{item.month}회</td>
                <td>{formatCurrency(item.payment)}</td>
                <td>{formatCurrency(item.principal)}</td>
                <td>{formatCurrency(item.interest)}</td>
                <td>{formatCurrency(item.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentTable;
