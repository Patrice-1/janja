import React, { useState } from "react";
import { useUser } from "./UserContext";
import StudentList from "./StudentList";
import TeacherDashboard from "./Teacher"; // Component for managing teachers
import PrincipalDashboard from "./Principal"; // For the principal's view
import Grades from "./Grades"; // To view/update student grades
import Attendance from "./Attendance"; // To mark/update attendance

const MainComponent = () => {
  const { userRole, setUserRole } = useUser();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null); // Store selected teacher

  const handleStudentAdded = () => {
    setSelectedStudent(null); // Reset selected student when a new student is added
  };

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher); // Store the selected teacher
  };

  const handleAttendanceUpdate = () => {
    setSelectedStudent(null); // Logic to handle attendance updates
  };

  return (
    <div className="p-4">
      <button
        onClick={() =>
          setUserRole(
            userRole === "teacher" || userRole === "principal"
              ? "student"
              : "teacher"
          )
        }
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Switch to{" "}
        {userRole === "teacher" || userRole === "principal"
          ? "Student"
          : "Teacher"}{" "}
        View
      </button>

      {userRole === "principal" && (
        <PrincipalDashboard onSelectTeacher={handleSelectTeacher} />
      )}

      {userRole === "teacher" && selectedTeacher && (
        <>
          <TeacherDashboard
            teacher={selectedTeacher}
            onStudentAdded={handleStudentAdded}
          />
          <StudentList
            selectedTeacherId={selectedTeacher.id}
            onSelectStudent={setSelectedStudent}
          />
        </>
      )}

      {userRole === "student" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
          {/* Student-specific components can go here */}
        </div>
      )}

      {selectedStudent && (
        <>
          <Attendance
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)} // Close attendance view
            onUpdate={handleAttendanceUpdate} // Callback for updating attendance
          />
          <Grades studentId={selectedStudent.id} />
        </>
      )}
    </div>
  );
};

export default MainComponent;
