import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Charades.css';

const TIMER_DURATION = 60;

function Charades() {
  const [word, setWord] = useState('');
  const [hidden, setHidden] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);


  const getWord = async () => {
    try {
      const res = await axios.get('http://localhost:5500/api/word');
      setWord(res.data.word);
      setHidden(false);
      setTimeLeft(null);
      clearInterval(timerRef.current);
    } catch (err) {
      console.error('Error fetching word:', err);
    }
  };

  const startTimer = () => {
    clearInterval(timerRef.current); // clear any existing timer
    setTimeLeft(TIMER_DURATION);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current); // cleanup
  }, []);

  return (
    <div className="container">
      <h1>Dumb Charades 🎭</h1>

      <div className="game-section">
        <button onClick={getWord}>Generate Word</button>

        {word && (
          <>
            <button onClick={() => setHidden(!hidden)}>
              {hidden ? 'Show Word' : 'Hide Word'}
            </button>

            <div className="word-box">
              {!hidden ? word : '••••••••••'}
            </div>

            <button onClick={startTimer}>Start Timer</button>

            {timeLeft !== null && (
              <>
                <p
                  className={`timer ${
                    timeLeft > 30 ? 'green' : timeLeft > 10 ? 'orange' : 'red'
                  }`}
                >
                  {timeLeft > 0 ? `⏳ ${timeLeft}s` : "⏰ Time's up!"}
                </p>
              </>
            )}
          </>
        )}
      </div>

      <div className="scoreboard">
        <h2>🏆 Scoreboard</h2>
        <div className="teams">
          <div className="team">
            <h3>Team A</h3>
            <p className="score">{teamAScore}</p>
            <button onClick={() => setTeamAScore(teamAScore + 1)}>+1 Team A</button>
          </div>
          <div className="team">
            <h3>Team B</h3>
            <p className="score">{teamBScore}</p>
            <button onClick={() => setTeamBScore(teamBScore + 1)}>+1 Team B</button>
          </div>
        </div>
        <button onClick={() => { setTeamAScore(0); setTeamBScore(0); }}>
          🔄 Reset Scores
        </button>
      </div>
    </div>
  );
}

export default Charades;
