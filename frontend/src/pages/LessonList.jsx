import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const LessonList = () => {
  const {user,token} = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLessons = async() => {
      try{
        const {data} = await axios.get("http://localhost:5000/api/lessons" , {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        setLessons(data);
      } catch(err){
        setError("Failed to load Lessons");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading lessons...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Lessons</h2>
      {lessons.length === 0 ? (
        <p>No lessons available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
              <p className="text-gray-600 mb-2">
                {lesson.description.substring(0, 80)}...
              </p>
              <p className="text-sm text-blue-500 font-semibold mb-2">
                Reward: {lesson.rewardPoints} points
              </p>
              <Link
                to={`/lessons/${lesson._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonList;
