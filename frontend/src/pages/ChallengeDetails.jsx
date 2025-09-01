import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Challengedetails.css"; // reuse styling

function ChallengeDetails() {
  const { id } = useParams(); // challenge id from URL
  const [challenge, setChallenge] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch challenge details + user submission
  useEffect(() => {
    const fetchData = async () => {
      try {
        const chRes = await axios.get(`/api/challenges/${id}`);
        setChallenge(chRes.data);

        if (token) {
          const subRes = await axios.get(`/api/submissions/my/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (subRes.data) setSubmission(subRes.data);
        }
      } catch (err) {
        console.error("Error fetching challenge:", err);
      }
    };
    fetchData();
  }, [id, token]);

  // Handle photo upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a photo!");

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setLoading(true);
      const res = await axios.post(`/api/submissions/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSubmission(res.data); // update UI with new submission
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!challenge) return <p>Loading challenge...</p>;

  return (
    <div className="challenge-details">
      <h1>{challenge.title}</h1>
      <p>{challenge.desc}</p>
      <p>⏳ Deadline: {challenge.deadline}</p>
      <p>🏆 Reward: {challenge.reward}</p>

      {/* If user has already submitted */}
      {submission ? (
        <div className="my-submission">
          <h3>✅ Your Submission</h3>
          <img
            src={submission.imageUrl}
            alt="My Submission"
            className="submission-img"
          />
        </div>
      ) : (
        // Upload form
        <form onSubmit={handleUpload} className="upload-form">
          <h3>Upload Your Photo</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Submit Photo"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ChallengeDetails;
