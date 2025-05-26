import React from "react";

export default function HistoryList({ history }) {
  if (!history.length) {
    return <p>No URL check history yet.</p>;
  }

  // Helper to get classification label and color by score
  function getRiskLabel(score) {
    if (score >= 90) return { label: "Safe", color: "green" };
    if (score >= 50) return { label: "Moderately Safe", color: "blue" };
    if (score >= 20) return { label: "Risky", color: "orange" };
    return { label: "Highly Risky", color: "red" };
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-900">
        URL Check History
      </h3>
      <ul className="history-list" style={{ listStyle: "none", padding: 0 }}>
        {history.map(({ url, score, checked_at }, i) => {
          const risk = getRiskLabel(score);
          return (
            <li
              key={i}
              style={{
                marginBottom: 12,
                padding: 12,
                borderRadius: 8,
                border: `2px solid ${risk.color}`,
                backgroundColor: "#f9fafb",
              }}
            >
              <div
                className="url-text"
                title={url}
                style={{
                  fontWeight: "bold",
                  color: "#111827",
                  overflowWrap: "break-word",
                }}
              >
                {url}
              </div>
              <div
                className="bottom-row"
                style={{
                  marginTop: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                }}
              >
                <span
                  className="status-badge"
                  style={{
                    color: "#fff",
                    backgroundColor: risk.color,
                    borderRadius: 4,
                    padding: "2px 6px",
                    fontWeight: "600",
                  }}
                >
                  {risk.label}
                </span>
                <small className="checked-time" style={{ color: "#6b7280" }}>
                  {new Date(checked_at).toLocaleString()}
                </small>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
