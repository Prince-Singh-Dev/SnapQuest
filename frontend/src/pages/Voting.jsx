import React, { useState, useEffect } from "react";
import "./Voting.css";

const Voting = () => {
  const [submissions, setSubmissions] = useState([]);

  // Fetch submissions (dummy for now, backend integration later)
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        username: "JohnDoe",
        caption: "Golden hour in the hills 🌄",
        imageUrl: "https://picsum.photos/400/300?random=1",
        votes: 12,
      },
      {
        id: 2,
        username: "JaneSmith",
        caption: "City lights at night ✨",
        imageUrl: "https://picsum.photos/400/300?random=2",
        votes: 20,
      },
      {
        id: 3,
        username: "Alex99",
        caption: "Peaceful forest path 🌲",
        imageUrl: "https://picsum.photos/400/300?random=3",
        votes: 8,
      },
    ];
    setSubmissions(dummyData);
  }, []);

  // Handle voting
  const handleVote = (id) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, votes: sub.votes + 1 } : sub
      )
    );
  };

  return (
    <div className="voting-container">
      <h2 className="voting-title">Vote for Your Favorite Photo 📸</h2>
      <div className="submissions-grid">
        {submissions.map((submission) => (
          <div key={submission.id} className="submission-card">
            <img
              src={submission.imageUrl}
              alt={submission.caption}
              className="submission-image"
            />
            <div className="submission-info">
              <h3>@{submission.username}</h3>
              <p>{submission.caption}</p>
              <div className="vote-section">
                <button
                  className="vote-btn"
                  onClick={() => handleVote(submission.id)}
                >
                  👍 Vote
                </button>
                <span className="vote-count">{submission.votes} votes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Voting;
