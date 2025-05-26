import React, { useState } from "react";

export default function UrlChecker({ token, onUrlChecked }) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheck() {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/url/check", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to check URL");
      } else {
        setResult(data);
        // Inform parent to refresh history and pie chart
        if (onUrlChecked) onUrlChecked();
      }
    } catch (err) {
      setError("Network error, please try again.");
    }
    setLoading(false);
  }

  // Updated helper to match new risk classification thresholds
  function getRiskLabel(score) {
    if (score >= 85) return { label: "Safe", color: "green" };
    if (score >= 65) return { label: "Moderately Safe", color: "blue" };
    if (score >= 35) return { label: "Risky", color: "orange" };
    return { label: "Highly Risky", color: "red" };
  }

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Enter URL to check"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full px-4 py-2 border rounded text-gray-900"
      />
      <button
        onClick={handleCheck}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-indigo-600 text-gray-100 rounded hover:bg-indigo-700 transition"
      >
        {loading ? "Checking..." : "Check URL"}
      </button>

      {error && <p className="mt-2 text-red-600">{error}</p>}

      {result && (
        <div className="mt-4 p-4 rounded border" style={{ backgroundColor: "#f0f0f0" }}>
          <p>
            <strong>URL: </strong>
            {url}
          </p>
          <p>
            <strong>Score: </strong>
            {result.score}
          </p>
          <p>
            <strong>Classification: </strong>
            <span style={{ color: getRiskLabel(result.score).color }}>
              {getRiskLabel(result.score).label}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}