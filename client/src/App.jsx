import React, { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import UrlChecker from "./components/UrlChecker";
import HistoryList from "./components/HistoryList";
import PieChart from "./components/PieChart";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Count URLs by risk classification
  const riskCounts = {
    safe: 0,
    moderatelySafe: 0,
    risky: 0,
    highlyRisky: 0,
  };

  // Compute counts from history
  history.forEach(({ score }) => {
    if (score >= 90) riskCounts.safe++;
    else if (score >= 50) riskCounts.moderatelySafe++;
    else if (score >= 20) riskCounts.risky++;
    else riskCounts.highlyRisky++;
  });

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("http://localhost:5000/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error(err);
      }
    }

    if (token) {
      fetchHistory();
    } else {
      setHistory([]);
      setShowHistory(false);
    }
  }, [token]);

  // Refresh history after URL check
  async function refreshHistory() {
    try {
      const res = await fetch("http://localhost:5000/api/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleLogout() {
    setToken("");
    localStorage.removeItem("token");
  }

  return (
    <div className="page-wrapper">
      <div className="max-w-3xl mx-auto p-4">
        {!token ? (
          <AuthForm setToken={setToken} />
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="mb-4 px-4 py-2 bg-red-600 text-gray-100 rounded"
            >
              Logout
            </button>

            <UrlChecker
              token={token}
              onUrlChecked={refreshHistory} // refresh history and pie chart after check
            />

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="mt-6 mb-4 px-4 py-2 bg-blue-600 text-gray-100 rounded hover:bg-blue-700 transition"
            >
              {showHistory ? "Hide History" : "View History"}
            </button>

            {showHistory && <HistoryList history={history} />}

            {/* Show pie chart only if there is at least one URL checked */}
            {history.length > 0 && <PieChart counts={riskCounts} />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
