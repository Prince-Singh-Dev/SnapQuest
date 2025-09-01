// src/pages/Challenges.jsx
import {Navigate, useNavigate} from "react-router-dom";
import "./Challenge.css";

function Challenges() {
  const challenges = [
    {
      id: 1,
      title: "Sunset Vibes",
      desc: "Capture the beauty of sunsets 🌅",
      deadline: "2 days left",
      reward: "+50 points & 1 perk",
      status: "ongoing",
    },
    {
      id: 2,
      title: "Urban Life",
      desc: "Show us the hustle of city streets 🏙️",
      deadline: "Starts in 1 day",
      reward: "+30 points",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Nature Macro",
      desc: "Capture details of plants & insects 🐞",
      deadline: "Ended",
      reward: "+100 points",
      status: "ended",
    },
  ];

  return (
    <div className="challenges-container">
      <h1>📸 Photography Challenges</h1>
      <p>Participate in challenges, submit your photos, and vote for others!</p>

      <div className="challenges-grid">
        {challenges.map((ch) => (
          <div className={`challenge-card ${ch.status}`} key={ch.id}>
            <h2>{ch.title}</h2>
            <p>{ch.desc}</p>
            <p className="deadline">⏳ {ch.deadline}</p>
            <p className="reward">🏆 {ch.reward}</p>

            {ch.status === "ongoing" && (
              <button className="join-btn" onClick={() => Navigate(`/challenges/${ch.id}`)}>
                Join Challenge →
              </button>
            )}
            {ch.status === "upcoming" && (
              <button className="upcoming-btn" disabled>Coming Soon ⏳</button>
            )}
            {ch.status === "ended" && (
              <button className="results-btn" onClick={()=> Navigate(`/challenges/${ch.id}/results`)}>
                View Results 🏅
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Challenges;
