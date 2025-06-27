import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import Chart from 'chart.js/auto'; // Import Chart.js
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchId, setBatchId] = useState("");
  const [trackData, setTrackData] = useState(null);
  const [certifiedBatches, setCertifiedBatches] = useState([]);
  const [dashboard, setDashboard] = useState({ totalBatches: 5, certified: 2 });
  const [showHelp, setShowHelp] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const connectWallet = async () => {
    if (loading || account) return;
    setLoading(true);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("Please install MetaMask to use this dApp");
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productType = e.target.elements[0].value;
    const location = e.target.elements[1].value;
    console.log("Creating batch:", { productType, location });
    // Add blockchain logic here
  };

  const handleTrack = () => {
    if (batchId) {
      setTrackData({ origin: "Nyeri", timestamp: "2025-06-26", farmer: "0x123..." });
    }
  };

  const viewCertifiedBatches = () => {
    setCertifiedBatches([{ id: "001", product: "Coffee" }]);
  };

  // Effect to render or update the chart
  useEffect(() => {
    if (showChart && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy previous instance to avoid memory leaks
      }
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Batches', 'Certified'],
          datasets: [{
            label: 'Batch Statistics',
            data: [dashboard.totalBatches, dashboard.certified],
            backgroundColor: ['#3498db', '#27ae60'],
            borderColor: ['#2980b9', '#219653'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          }
        }
      });
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [showChart, dashboard.totalBatches, dashboard.certified]);

  return (
    <Router>
      <div className="app-container">
        <div className="card">
          <header className="header">
            <h1 className="title">Kenyan Supply Chain dApp</h1>
            <nav className="nav-bar">
              <NavLink to="/" className="nav-link" activeClassName="active">Home</NavLink>
              <NavLink to="/about" className="nav-link" activeClassName="active">About</NavLink>
              <NavLink to="/track" className="nav-link" activeClassName="active">Track</NavLink>
              <NavLink to="/contact" className="nav-link" activeClassName="active">Contact</NavLink>
            </nav>
          </header>

          <Routes>
            <Route path="/" element={
              <>
                <p className="subtitle">Track farm produce from origin to market using blockchain.</p>
                <p className="about">Developed by John Motaroki Masire, showcasing expertise in React, CSS, and Ethereum smart contracts.</p>
                <button className="action-button" onClick={connectWallet} disabled={loading}>
                  {loading ? "Connecting..." : account ? `Wallet: ${account.substring(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
                </button>
              </>
            } />
            <Route path="/about" element={
              <div className="section">
                <h3>About</h3>
                <p>This dApp was created to provide a transparent supply chain solution for Kenyan farmers, utilizing blockchain technology. Built with React, styled with CSS, and integrated with Ethereum smart contracts.</p>
              </div>
            } />
            <Route path="/track" element={
              account ? (
                <>
                  <div className="section">
                    <h3>Create Produce Batch</h3>
                    <form onSubmit={handleSubmit}>
                      <input type="text" placeholder="Product Type (e.g., Coffee)" required />
                      <input type="text" placeholder="Location (e.g., Nyeri)" required />
                      <button type="submit">Submit</button>
                    </form>
                  </div>

                  <div className="section">
                    <h3>Track Batch</h3>
                    <input
                      type="text"
                      placeholder="Enter Batch ID to Track"
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                    />
                    <button onClick={handleTrack}>Track</button>
                    {trackData && (
                      <p className="info-note">
                        Origin: {trackData.origin}, Timestamp: {trackData.timestamp}, Farmer: {trackData.farmer.substring(0, 6)}...
                      </p>
                    )}
                    <p className="info-note">Displays batch origin, timestamp, farmer address.</p>
                  </div>

                  <div className="section">
                    <h3>Certification</h3>
                    <p className="info-note">Batches marked as certified will show ✅ on-chain.</p>
                    <button onClick={viewCertifiedBatches}>View Certified Batches</button>
                    {certifiedBatches.length > 0 && (
                      <ul>
                        {certifiedBatches.map((batch) => (
                          <li key={batch.id}>{batch.product} (ID: {batch.id}) ✅</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="section">
                    <h3>Dashboard</h3>
                    <button onClick={() => setShowChart(true)}>View Stats</button>
                    <p>Total Batches: {dashboard.totalBatches}, Certified: {dashboard.certified}</p>
                    {showChart && (
                      <div className="chart-container">
                        <canvas id="dashboardChart" ref={chartRef}></canvas>
                        <button onClick={() => setShowChart(false)}>Close Chart</button>
                      </div>
                    )}
                  </div>

                  <div className="section">
                    <h3>User Profile</h3>
                    <p>Address: {account.substring(0, 6)}...{account.slice(-4)}</p>
                    <button onClick={() => setAccount(null)}>Logout</button>
                  </div>
                </>
              ) : (
                <p>Please connect your wallet to access tracking features.</p>
              )
            } />
            <Route path="/contact" element={
              <div className="section">
                <h3>Contact</h3>
                <p>Email: johnmasire2003@yahoo.com | GitHub: <a href="https://github.com/Motaroki-john">Motaroki-john</a></p>
              </div>
            } />
          </Routes>

          <button className="help-button" onClick={() => setShowHelp(true)}>Help</button>
          {showHelp && (
            <div className="modal">
              <h3>Help</h3>
              <p>1. Connect your MetaMask wallet to get started.</p>
              <p>2. Use 'Create Produce Batch' to register new batches.</p>
              <p>3. Track batches or view certifications with the respective buttons.</p>
              <button onClick={() => setShowHelp(false)}>Close</button>
            </div>
          )}

          <footer className="footer">
            <p>© 2025 John Motaroki Masire. All rights reserved. | <a href="https://github.com/Motaroki-john">GitHub</a></p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App