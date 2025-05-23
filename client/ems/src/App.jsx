import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import Layout from "./components/layout/Layout";
import Login from "./components/pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./components/constants/role.js"; // Import roles

// Import other components
import AddAdmin from "./components/pages/Admin/AddAdmin";
import AddProject from "./components/pages/Admin/AddProject";
import IssueGeneration from "./components/pages/IssueGeneration";
import AddProjectincharge from "./components/pages/Admin/AddProjectincharge.jsx";
import ManageAdmin from "./components/pages/ManageAdmins.jsx";
import AddSiteEngineer from "./components/pages/Admin/AddSiteEngineer.jsx";
import ManageSiteEngineers from "./components/pages/ManageSiteEngineers";
import Dashboard from "./components/Dashboard";
import AllAdmin from "./components/pages/Admin/AllAdmins.jsx";
import ManageIssues from "./components/pages/ManageIssues.jsx";
import AddPlaza from "./components/pages/Admin/AddPlaza.jsx";
import AllSiteEngineer from "./components/pages/Admin/AllSiteEngineers";
import AllProjects from "./components/pages/Admin/AllProjects";
import AllPlazas from "./components/pages/Admin/AllPlazas";
import EngineersIssues from "./components/pages/EngineersIssues.jsx";
import ManageIncharges from "./components/pages/ManageIncharges.jsx";

import SingleProject from "./components/pages/SingleProject.jsx";
import ManageProjects from "./components/pages/ManageProjects.jsx";
import AccessDenied from "./components/pages/AccessDenied.jsx";
import AllIssues from "./components/pages/Admin/AllIssues.jsx";
import AllProjectIssues from "./components/pages/AllProjectIssues.jsx";
import UnderDevelopment from "./components/pages/UnderDevelopment.jsx";
import InchargeCreate from "./components/pages/Admin/InchargeCreate.jsx";
import GenerateReport from "./components/GenerateReport.jsx";
import Attendance from "./components/pages/Attendence.jsx";
import AttendanceHistory from "./components/pages/AttendanceHistory.jsx";
import AdminAttendanceManagement from "./components/pages/Admin/AttendenceCalander.jsx";
// import AdminAttendence from "./components/pages/Admin/AdminAttendencne.jsx";
// import AttendanceCalendar from "./components/pages/Admin/AttendenceCalander.jsx";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.SITE_ENGINEER, ROLES.PROJECT_INCHARGE, ROLES.PLAZA_INCHARGE]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard - Accessible by all roles */}
            <Route path="/" element={<Dashboard />} />

            {/* Add Admin - Accessible by Admin and SuperAdmin */}
            <Route
              path="/add-admin"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <AddAdmin />
                </ProtectedRoute>
              }
            />

            {/* Add Project - Accessible by Admin and SuperAdmin */}
            <Route
              path="/add-project"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <AddProject />
                </ProtectedRoute>
              }
            />

            {/* Issue Generation - Accessible by siteEngineer */}
            <Route
              path="/issue-generate"
              element={
                <ProtectedRoute roles={[ROLES.SITE_ENGINEER, ROLES.PLAZA_INCHARGE]}>
                  <IssueGeneration />
                </ProtectedRoute>
              }
            />

            {/* Add Project Incharge - Accessible by Admin and SuperAdmin */}
            <Route
              path="/add-incharge"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
               <InchargeCreate/>
                </ProtectedRoute>
              }
            />

           <Route
              path="/all-issuesByProjectId"
              element={
                <ProtectedRoute roles={[ROLES.PROJECT_INCHARGE]}>
         <UnderDevelopment/>
                </ProtectedRoute>
              }
            />

            {/* Manage Admin - Accessible by Admin and SuperAdmin */}
            <Route
              path="/manage-admin"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <ManageAdmin />
                </ProtectedRoute>
              }
            />

            {/* Add Site Engineer - Accessible by Admin and SuperAdmin */}
            <Route
              path="/add-engineer"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <AddSiteEngineer />
                </ProtectedRoute>
              }
            />

            {/* All Site Engineers - Accessible by Admin and SuperAdmin */}
            <Route
              path="/all-engineers"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <AllSiteEngineer />
                </ProtectedRoute>
              }
            />

            {/* All Admins - Accessible by Admin and SuperAdmin */}
            <Route
              path="/all-admins"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <AllAdmin />
                </ProtectedRoute>
              }
            />

            {/* Manage Issues - Accessible by Admin and SuperAdmin */}
            <Route
              path="/manage-issue"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <ManageIssues />
                </ProtectedRoute>
              }
            />

            {/* Add Plaza - Accessible by Admin and SuperAdmin */}
            <Route
              path="/add-plaza"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <AddPlaza />
                </ProtectedRoute>
              }
            />

            {/* Manage Site Engineers - Accessible by Admin and SuperAdmin */}
            <Route
              path="/manage-engineers"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <ManageSiteEngineers />
                </ProtectedRoute>
              }
            />

            {/* All Projects - Accessible by Admin and SuperAdmin */}
            <Route
              path="/all-projects"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <AllProjects />
                </ProtectedRoute>
              }
            />

            {/* All Plazas - Accessible by Admin and SuperAdmin */}
            <Route
              path="/all-plazas"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <AllPlazas />
                </ProtectedRoute>
              }
            />

            {/* All Plazas - Accessible by Admin and SuperAdmin */}
            <Route
              path="/get-projectById"
              element={
                <ProtectedRoute roles={[ROLES.PROJECT_INCHARGE]}>
                 <SingleProject/>
                </ProtectedRoute>
              }
            />

            {/* Engineer Issues - Accessible by siteEngineer */}
            <Route
              path="/all-issuesById"
              element={
                <ProtectedRoute roles={[ROLES.SITE_ENGINEER, ROLES.PLAZA_INCHARGE]}>
                  <EngineersIssues />
                </ProtectedRoute>
              }
            />

            {/* Engineer Issues - Accessible by siteEngineer */}
            <Route
              path="/manage-projects"
              element={
                <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
               <ManageProjects/>
                </ProtectedRoute>
              }
            />

           <Route
              path="/manage-ProjectIssues"
              element={
                <ProtectedRoute roles={[ROLES.PROJECT_INCHARGE]}>
               <AllProjectIssues/>
                </ProtectedRoute>
              }
            />
            {/* Manage Incharges - Accessible by Admin and SuperAdmin */}
            <Route
              path="/manage-incharge"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <ManageIncharges />
                </ProtectedRoute>
              }
            />

<Route
              path="/generate-report"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                  <GenerateReport/>
                </ProtectedRoute>
              }
            />
              <Route
              path="/all-issues"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.PLAZA_INCHARGE, ROLES.PROJECT_INCHARGE]}>
                 <AllIssues/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/attendence"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.PLAZA_INCHARGE, ROLES.PROJECT_INCHARGE, ROLES.SITE_ENGINEER]}>
                 <Attendance/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/adminattendence"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.PLAZA_INCHARGE, ROLES.PROJECT_INCHARGE, ROLES.SITE_ENGINEER]}>
               <AdminAttendanceManagement/>
                </ProtectedRoute>
              }
            />

<Route
              path="/attendancehistory"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.PLAZA_INCHARGE, ROLES.PROJECT_INCHARGE, ROLES.SITE_ENGINEER]}>
             <AttendanceHistory/>
                </ProtectedRoute>
              }
            />
         

          </Route>
     
          

          

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<AccessDenied/>} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;