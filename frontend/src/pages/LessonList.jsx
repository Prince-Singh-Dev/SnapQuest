import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./LessonList.css";

const LessonList = () => {
  const { user, token } = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/lessons", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLessons(data);
      } catch (err) {
        setError("Failed to load Lessons");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [token]);

  if (loading) return <p className="loading-message">Loading lessons...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="lesson-container">
      <h2>📚 Lessons</h2>
      {lessons.length === 0 ? (
        <p className="no-lessons">No lessons available right now.</p>
      ) : (
        <div className="lesson-grid">
          {lessons.map((lesson) => (
            <div key={lesson._id} className="lesson-card">
              <div className="lesson-content">
                <h3>{lesson.title}</h3>
                <p className="description">
                  {lesson.description.length > 100
                    ? `${lesson.description.substring(0, 100)}...`
                    : lesson.description}
                </p>
              </div>
              <div className="lesson-footer">
                <p className="reward">Reward: {lesson.rewardPoints} points</p>
                <Link to={`/lessons/${lesson._id}`} className="view-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonList;
