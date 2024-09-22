// src/components/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">
        School Management System
      </h1>
      <div className="flex space-x-8">
        <Link
          to="/principal-dashboard"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Principal
        </Link>
        <Link
          to="/teacher-dashboard"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Teacher
        </Link>
        <Link
          to="/student-dashboard"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Student
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
