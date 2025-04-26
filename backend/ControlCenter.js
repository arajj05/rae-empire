import React, { useState, useEffect } from 'react';
import './App.css';

function ControlCenter() {
  const [income, setIncome] = useState(0);
  const [logs, setLogs] = useState([
    "🛡️ Rae system online. Ready for Step 1! 🧑‍💻💼",
    "Tracking earnings now. You’re on your way to six figures!"
  ]);

  useEffect(() => {
    // Fetch real-time earnings from the backend API
    fetch('/api/earnings')
      .then(response => response.json())
      .then(data => {
        setIncome(data.total); // Assuming your API returns earnings data
        setLogs(prevLogs => [...prevLogs, `🔑 New Earnings: $${data.total}`]);
      })
      .catch(error => console.error("Error fetching earnings:", error));
  }, []);

  // Function to whisper earnings using the Web Speech API
  const whisperUpdate = () => {
    if ('speechSynthesis' in window) {
      const message = new SpeechSynthesisUtterance(`Current earnings: $${income}`);
      window.speechSynthesis.speak(message);
    } else {
      console.error("Speech Synthesis not supported.");
    }
  };

  return (
    <div className="control-center">
      <h1>Rae's Control Center</h1>
      <div className="earnings-display">
        <h2>Total Earnings: ${income}</h2>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${(income / 1000000) * 100}%` }}
          ></div>
        </div>
        <p>{(income / 1000000) * 100}% of your 6-figure goal</p>
      </div>
      <button onClick={whisperUpdate}>Whisper Earnings</button>
      <div className="log-messages">
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
}

export default ControlCenter;
