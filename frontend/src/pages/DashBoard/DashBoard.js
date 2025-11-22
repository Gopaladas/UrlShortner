import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashBoard.css";
import { backendUri } from "../../mainApi";

const DashBoard = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setMessage("Please enter a valid URL");
      return;
    }

    setLoading(true);
    try {
      const data = await axios.post(`${backendUri}`, { url });
      console.log(data.data.message);
      if (data.data) {
        setShortUrl(data.data.fullUrl);
        setUrl("");
      }
      if (data.data.message) {
        setMessage(data.data.message);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error creating short URL");
    } finally {
      setLoading(false);
    }
  };

  const fetchLinks = async () => {
    try {
      const data = await axios.get(`${backendUri}`);
      setLinks(data.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [shortUrl]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUri}/${id}`);
      console.log("deleted successfully");
      fetchLinks();
    } catch (error) {
      console.log(error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(""), 2000);
    });
  };

  const displayedLinks = showAll ? links : links.slice(0, 5);

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">URL Shortener</h1>
          <p className="dashboard-subtitle">
            Transform long URLs into short, shareable links
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-number">{links.length}</span>
            <span className="stat-label">Total Links</span>
          </div>
        </div>
      </div>

      {/* URL Shortener Section */}
      <div className="shortener-section">
        <div className="shortener-card">
          <div className="card-header">
            <h2>Create New Short URL</h2>
            <div className="decoration-line"></div>
          </div>

          <form onSubmit={handleSubmit} className="url-form">
            <div className="input-group">
              <input
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long URL here..."
                type="url"
                className="url-input"
              />
              <button
                type="submit"
                className={`submit-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Shortening...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✂️</span>
                    Shorten URL
                  </>
                )}
              </button>
            </div>
          </form>

          {message && (
            <div className="message-banner">
              <span className="message-icon">💡</span>
              {message}
            </div>
          )}

          {shortUrl && (
            <div className="result-card">
              <div className="result-header">
                <span className="success-icon">✅</span>
                <h3>URL Shortened Successfully!</h3>
              </div>
              <div className="result-content">
                <div className="url-display">
                  <div className="short-url-text">{shortUrl}</div>
                  <button
                    className={`copy-btn ${
                      copiedUrl === shortUrl ? "copied" : ""
                    }`}
                    onClick={() => copyToClipboard(shortUrl)}
                  >
                    {copiedUrl === shortUrl ? (
                      <>
                        <span className="copy-icon">✅</span>
                        Copied!
                      </>
                    ) : (
                      <>
                        <span className="copy-icon">📋</span>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="visit-link"
                >
                  <span className="visit-icon">🔗</span>
                  Visit URL
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Links List Section */}
      <div className="links-section">
        <div className="section-header">
          <h2>Your Shortened URLs</h2>
          <div className="section-decoration"></div>
        </div>

        {links.length > 0 ? (
          <div className="links-container">
            <div className="links-grid">
              {displayedLinks.map((item, index) => (
                <div key={item.shortid || index} className="link-card">
                  <div className="card-background"></div>
                  <div className="card-content">
                    <div className="link-info">
                      <div className="link-short">
                        <span className="link-badge">ShortUrl</span>
                        <div className="short-url">{item.fullUrl}</div>
                      </div>
                      <div className="link-original">
                        <span className="link-badge">Original</span>
                        <div className="original-url" title={item.redirectUrl}>
                          {item.redirectUrl}
                        </div>
                      </div>
                    </div>

                    <div className="link-actions">
                      <button
                        className={`action-btn copy-btn ${
                          copiedUrl === `${backendUri}/${item.shortid}`
                            ? "copied"
                            : ""
                        }`}
                        onClick={() =>
                          copyToClipboard(`${backendUri}/${item.shortid}`)
                        }
                      >
                        {copiedUrl === `${backendUri}/${item.shortid}`
                          ? "✅ Copied"
                          : "📋 Copy"}
                      </button>

                      <a
                        href={`/api/links/${item.shortid}`}
                        className="action-btn stats-btn"
                      >
                        📊 Stats
                      </a>

                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(item.shortid)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {links.length > 5 && (
              <div className="show-more-container">
                <button
                  className="show-more-btn"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? (
                    <>
                      <span className="btn-icon">👆</span>
                      Show Less
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">👇</span>
                      Show More ({links.length - 5} more)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔗</div>
            <h3>No URLs shortened yet</h3>
            <p>Create your first shortened URL to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
