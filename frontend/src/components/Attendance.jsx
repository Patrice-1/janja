import React, { useEffect, useState } from "react";

const Attendance = ({ student, onClose, onUpdate }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/students/${student.id}/attendance`
      );
      const data = await response.json();
      setAttendanceRecords(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [student.id]);

  if (loading) return <p>Loading attendance...</p>;

  return (
    <div>
      <h2>
        Attendance for {student.first_name} {student.last_name}
      </h2>
      <button onClick={onClose}>Close</button>
      <ul>
        {attendanceRecords.map((record) => (
          <li key={record.date}>
            {record.date}: {record.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Attendance;
