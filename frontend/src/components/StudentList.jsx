import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentList = ({ selectedTeacherId, onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudentFirstName, setNewStudentFirstName] = useState("");
  const [newStudentLastName, setNewStudentLastName] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/students/?teacherId=${selectedTeacherId}`
      );
      setStudents(response.data);
    } catch (error) {
      setError("Error fetching students.");
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudentFirstName || !newStudentLastName || !selectedTeacherId) {
      setError("First name, last name, and teacher selection are required.");
      return;
    }

    const newStudent = {
      first_name: newStudentFirstName,
      last_name: newStudentLastName,
      teacher_id: selectedTeacherId, // Ensure this matches your backend requirement
    };

    console.log("Adding Student:", newStudent);

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/students/",
        newStudent
      );
      console.log("Response:", response.data);

      setNewStudentFirstName("");
      setNewStudentLastName("");
      setSuccess("Student added successfully!");
      fetchStudents();
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response.data);
        setError(err.response.data.message || "Failed to add student.");
      } else {
        console.error("Error adding student:", err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:8000/students/${id}`);
        fetchStudents();
      } catch (error) {
        setError("Error deleting student.");
        console.error("Error deleting student:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedTeacherId) {
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [selectedTeacherId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Student List</h2>
      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-lg">Add Student</h3>
            <input
              type="text"
              value={newStudentFirstName}
              onChange={(e) => setNewStudentFirstName(e.target.value)}
              placeholder="First Name"
              className="border border-gray-300 rounded p-2 mb-2 mr-2"
            />
            <input
              type="text"
              value={newStudentLastName}
              onChange={(e) => setNewStudentLastName(e.target.value)}
              placeholder="Last Name"
              className="border border-gray-300 rounded p-2 mb-2"
            />
            <button
              onClick={handleAddStudent}
              className="bg-green-600 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Student"}
            </button>
            {success && <p className="text-green-600">{success}</p>}
          </div>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Registration</th>
                <th className="border border-gray-300 p-2">Class</th>
                <th className="border border-gray-300 p-2">Details</th>
                <th className="border border-gray-300 p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="border border-gray-300 p-2">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {student.registration_number}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {student.class_name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Details
                    </button>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default StudentList;
