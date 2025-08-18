// src/pages/Lessons.jsx
import "./Lessons.css";

function Lessons() {
  const lessons = [
    { id: 1, title: "Basics of Photography", desc: "Learn how a camera works.", status: "completed" },
    { id: 2, title: "Lighting & Composition", desc: "Master light and framing.", status: "in-progress" },
    { id: 3, title: "Portrait Photography", desc: "Capture stunning portraits.", status: "locked" },
    { id: 4, title: "Landscape Photography", desc: "Frame nature beautifully.", status: "locked" },
  ];

  return (
    <div className="lessons-container">
      <h1>Photography Lessons</h1>
      <p>Complete lessons to earn points, badges, and unlock challenges.</p>

      <div className="lessons-grid">
        {lessons.map((lesson) => (
          <div className={`lesson-card ${lesson.status}`} key={lesson.id}>
            <h2>{lesson.title}</h2>
            <p>{lesson.desc}</p>

            {/* Status handling */}
            {lesson.status === "completed" && (
              <>
                <div className="progress-bar completed"></div>
                <button className="completed-btn">Completed ✔</button>
              </>
            )}

            {lesson.status === "in-progress" && (
              <>
                <div className="progress-bar in-progress"></div>
                <button className="continue-btn">Continue →</button>
              </>
            )}

            {lesson.status === "locked" && (
              <>
                <div className="progress-bar locked"></div>
                <button className="locked-btn" disabled>Locked 🔒</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lessons;
