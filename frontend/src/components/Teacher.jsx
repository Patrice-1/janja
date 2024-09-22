import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherDashboard = ({ teacher }) => {
  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [className, setClassName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    if (!teacher || typeof teacher.id !== "number") {
      console.error("Teacher is not defined or has no valid ID.");
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/students/?teacher_id=${teacher.id}`
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    try {
      const studentData = {
        first_name: firstName,
        last_name: lastName,
        class_name: className,
        registration_number: registrationNumber,
      };
      await axios.post("http://127.0.0.1:8000/students/", studentData);
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleDeleteStudent = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/students/${id}`);
    fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
  }, [teacher]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Teacher Dashboard - {teacher?.name}
      </h2>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="border p-2 mb-2"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="border p-2 mb-2"
      />
      <input
        type="text"
        placeholder="Class Name"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        className="border p-2 mb-2"
      />
      <input
        type="text"
        placeholder="Registration Number"
        value={registrationNumber}
        onChange={(e) => setRegistrationNumber(e.target.value)}
        className="border p-2 mb-2"
      />
      <button
        onClick={handleAddStudent}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Student
      </button>
      <h3 className="text-xl mt-4">Students List</h3>
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student.id} className="flex justify-between">
              {student.first_name} {student.last_name}
              <button
                onClick={() => handleDeleteStudent(student.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeacherDashboard;
