import React, { useEffect, useState } from "react";

const Grades = ({ studentId }) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGrades = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/students/${studentId}/grades`
      );
      if (!response.ok) throw new Error("Failed to fetch grades");
      const data = await response.json();
      setGrades(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [studentId]);

  if (loading) return <p>Loading grades...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Grades for Student ID: {studentId}</h2>
      <ul>
        {grades.map((grade) => (
          <li key={grade.id}>
            {grade.subject}: {grade.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Grades;
