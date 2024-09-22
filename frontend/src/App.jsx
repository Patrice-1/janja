import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import PrincipalDashboard from "./components/Principal";
import TeacherDashboard from "./components/Teacher";

const App = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teachers, setTeachers] = useState([]);

  return (
    <Router>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/principal-dashboard"
            element={
              <PrincipalDashboard
                teachers={teachers}
                setTeachers={setTeachers}
                setSelectedTeacher={setSelectedTeacher}
              />
            }
          />
          <Route
            path="/teacher-dashboard"
            element={<TeacherDashboard teacher={selectedTeacher} />}
          />
        </Routes>

        {/* Moved Teacher Selection to PrincipalDashboard */}
      </div>
    </Router>
  );
};

export default App;
