import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendUri } from "../../mainApi";
import "./Stats.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Stats = () => {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${backendUri}/code/${code}`);
      const linkData = res.data.data;
      setLink(linkData);

      // Process visitedHistory → group by date
      const grouped = {};

      linkData.visitedHistory.forEach((visit) => {
        const date = new Date(visit.timestamp).toISOString().split("T")[0]; // yyyy-mm-dd

        if (!grouped[date]) grouped[date] = 0;
        grouped[date]++;
      });

      // Convert to chart format
      const chartArray = Object.keys(grouped).map((date) => ({
        date,
        clicks: grouped[date],
      }));

      setChartData(chartArray);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [code]);

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="loading-spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (!link) return <div className="stats-error">Link not found</div>;

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1 className="stats-title">Link Analytics</h1>
        <p className="stats-subtitle">
          Detailed statistics for your shortened URL
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <h3>Short Code</h3>
            <p className="stat-value">{link.shortid}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Clicks</h3>
            <p className="stat-value">{link.visitedHistory.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Created</h3>
            <p className="stat-value">
              {new Date(link.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="url-section">
        <div className="url-card">
          <h3>Original URL</h3>
          <p className="url-text">{link.redirectUrl}</p>
        </div>

        <div className="url-card">
          <h3>Short URL</h3>
          <p className="url-text">{link.fullUrl}</p>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <h2>Daily Click Analytics</h2>
          <p>Track your link performance over time</p>
        </div>

        {chartData.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">📈</div>
            <h3>No clicks yet</h3>
            <p>
              Your link hasn't received any clicks yet. Share it to start
              tracking!
            </p>
          </div>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e1e5e9",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
