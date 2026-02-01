import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>💰 대출 이자 계산기</h1>
      </header>

      <main className="main">
        <section className="hero">
          <h2>대출 이자를 간편하게 계산하세요</h2>
          <p>원리금균등, 원금균등, 만기일시 상환 방식을 한눈에 비교</p>
        </section>

        <section className="calculator-cards">
          <div className="card">
            <h3>🏠 주택담보대출</h3>
            <p>주택 구매 시 필요한 대출 이자를 계산합니다</p>
            <button className="btn">계산하기</button>
          </div>

          <div className="card">
            <h3>💳 신용대출</h3>
            <p>신용대출 상환 계획을 시뮬레이션합니다</p>
            <button className="btn">계산하기</button>
          </div>

          <div className="card">
            <h3>📊 상환방식 비교</h3>
            <p>3가지 상환 방식을 한눈에 비교합니다</p>
            <button className="btn">비교하기</button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 LoanCalc2026. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
