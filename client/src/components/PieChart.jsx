import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ counts }) => {
  // Check if there's any data to display
  const hasData = counts && (
    counts.safe > 0 || 
    counts.moderatelySafe > 0 || 
    counts.risky > 0 || 
    counts.highlyRisky > 0
  );

  // Don't render the chart if there's no data
  if (!hasData) {
    return (
      <div
        style={{
          width: 320,
          height: 320,
          margin: "1.5rem auto",
          backgroundColor: "#f9fafb",
          borderRadius: 12,
          padding: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed #d1d5db",
        }}
      >
        <p style={{ color: "#6b7280", textAlign: "center", fontSize: "14px" }}>
          No URL data available yet.<br />
          Check some URLs to see the distribution chart.
        </p>
      </div>
    );
  }

  const data = {
    labels: [
      "Safe (85-100)",
      "Moderately Safe (65-84)",
      "Risky (35-64)",
      "Highly Risky (0-34)",
    ],
    datasets: [
      {
        label: "URL Safety Status",
        data: [
          counts.safe,
          counts.moderatelySafe,
          counts.risky,
          counts.highlyRisky,
        ],
        backgroundColor: [
          "rgba(22, 163, 74, 0.7)",     // green
          "rgba(59, 130, 246, 0.7)",    // blue
          "rgba(249, 115, 22, 0.7)",    // orange
          "rgba(220, 38, 38, 0.7)",     // red
        ],
        borderColor: [
          "rgba(22, 163, 74, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(249, 115, 22, 1)",
          "rgba(220, 38, 38, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#374151" }, // dark gray text for readability
      },
      title: {
        display: true,
        text: "URL Safety Status Distribution",
        color: "#111827",
        font: { size: 18, weight: "bold" },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#f9fafb",
        titleColor: "#111827",
        bodyColor: "#374151",
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <div
      style={{
        width: 320,
        height: 320,
        margin: "1.5rem auto",
        backgroundColor: "#e5e7eb", // light background for contrast
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 0 12px rgba(59, 130, 246, 0.3)",
      }}
    >
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;