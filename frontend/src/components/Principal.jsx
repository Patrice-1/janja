import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PrincipalDashboard = ({ onSelectTeacher }) => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/teachers/");
      if (!response.ok) throw new Error("Failed to fetch teachers");
      const data = await response.json();
      setTeachers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (teacherId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/students/?teacherId=${teacherId}`
      );
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async () => {
    if (!newTeacherName) {
      setError("Teacher name is required.");
      return;
    }
    const newTeacher = { name: newTeacherName };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/teachers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeacher),
      });
      if (!response.ok) throw new Error("Failed to add teacher");
      setNewTeacherName("");
      setSuccess("Teacher added successfully!");
      fetchTeachers(); // Refresh the teacher list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeacher = (event) => {
    const teacherId = event.target.value;
    setSelectedTeacherId(teacherId);
    if (teacherId) {
      const selectedTeacher = teachers.find(
        (t) => t.id === parseInt(teacherId)
      );
      onSelectTeacher(selectedTeacher); // Pass selected teacher to the parent
      fetchStudents(teacherId);
    } else {
      setStudents([]);
      onSelectTeacher(null); // Clear selected teacher
    }
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacherId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/teachers/${selectedTeacherId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete teacher");
      setSuccess("Teacher removed successfully!");
      setSelectedTeacherId(""); // Clear selection after deletion
      fetchTeachers(); // Refresh the teacher list
      onSelectTeacher(null); // Clear selected teacher
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Reset state if necessary
    setTeachers([]);
    setStudents([]);
    setSelectedTeacherId("");
    // Redirect to landing page
    navigate("/");
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Principal Dashboard</h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white py-2 px-4 rounded mb-4"
      >
        Logout
      </button>

      <h2 className="text-xl">Add Teacher</h2>
      <input
        type="text"
        value={newTeacherName}
        onChange={(e) => setNewTeacherName(e.target.value)}
        placeholder="Teacher Name"
        className="border border-gray-300 rounded p-2 mb-2"
      />
      <button
        onClick={handleAddTeacher}
        className="bg-blue-600 text-white py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Teacher"}
      </button>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <h2 className="text-xl mt-4">Select a Teacher</h2>
      <select
        value={selectedTeacherId}
        onChange={handleSelectTeacher}
        className="border border-gray-300 rounded p-2 mb-2"
      >
        <option value="">-- Select a Teacher --</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.name}
          </option>
        ))}
      </select>

      {selectedTeacherId && (
        <div className="mt-4">
          <h3 className="text-lg">Selected Teacher</h3>
          <p>
            {
              teachers.find(
                (teacher) => teacher.id === parseInt(selectedTeacherId)
              ).name
            }
          </p>
          <button
            onClick={handleDeleteTeacher}
            className="bg-red-600 text-white py-2 px-4 rounded mt-2"
          >
            Delete Teacher
          </button>
        </div>
      )}

      {students.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg">
            Students under{" "}
            {
              teachers.find(
                (teacher) => teacher.id === parseInt(selectedTeacherId)
              )?.name
            }
          </h3>
          <ul>
            {students.map((student) => (
              <li key={student.id} className="border-b py-2">
                {student.first_name} {student.last_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PrincipalDashboard;
