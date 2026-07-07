import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ApexCharts from "apexcharts";

// import "./css/adminlte.css";
// import "./Styles/main.scss";
import "./css/home.css";
import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar.js";
import Footer from "./components/Footer.js";
import Home from "./components/Home.js";
import Login from "./components/Login.js";
import User from "./components/User/User.js";
import ChangePassword from "./components/ChangePassword/ChangePassword.js";
import ProfileUpdate from "./components/ProfileUpdate/ProfileUpdate.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import Template from "./components/Template/Template.js";
import Page from "./components/Page/Page.js";
import Menu from "./components/Menu/Menu.js";
import OrganizationDetails from "./components/OrganizationDetails/OrganizationDetails.js";
import News from "./components/News/News.js";
import Event from "./components/Event/Event.js";
import Scientist from "./components/Scientist/Scientist.js";
import Staff from "./components/Staff/Staff.js";
import Album from "./components/Album/Album.js";
import PreviousDirector from "./components/PreviousDirector/PreviousDirector.js";
import ExternallyFundedProjects from "./components/ExternallyFundedProjects/ExternallyFundedProjects.js";
import InstitutionalProjects from "./components/InstitutionalProjects/InstitutionalProjects.js";
import TechnologiesDeveloped from "./components/TechnologiesDeveloped/TechnologiesDeveloped.js";
import StudentCourse from "./components/StudentCourse/StudentCourse.js";
import Designation from "./components/Designation/Designation.js";
import DocumentUploader from "./components/DocumentUploader/DocumentUploader.js";
import Content from "./components/Content/Content.js";
import Publication from "./components/Publication/Publication.js";
import AdministrativeStaff from "./components/AdministrativeStaff/AdministrativeStaff.js";
import Director from "./components/Director/Director.js";
import InstitutionalProjectsDetails from "./components/Institutional Projects Details/InstitutionalProjectsDetails.js";
import Alumni from "./components/Alumni/Alumni.js";
import ContractualStaff from "./components/ContractualStaff/ContractualStaff.js";
import Feedback from "./components/Feedback/Feedback.js";
import FeedbackView from "./components/Feedback/FeedbackView.js";
import ExternalLink from "./components/ExternalLink.js/ExternalLink.js";
import Collaborations from "./components/Collaborations/Collaborations.js";
import CollaborationsDetails from "./components/CollaborationsDetails/CollaborationsDetails.js";
import UserPermissions from "./components/UserPermissions/UserPermissions.js";
import NotFound from "./components/NotFound/NotFound.js";
import Banner from "./components/Banner/Banner.js";
import CadreStrength from "./components/Cadre Strength/CadreStrength.js";
import Patents from "./components/Patents/Patents.js";
import Disclaimer from "./components/Disclaimer/Disclaimer.js";
import AccessibilityStatement from "./components/Accessibility Statement/AccessibilityStatement.js";
import WebsitePolicies from "./components/Website Policies/WebsitePolicies.js";
import TermsConditions from "./components/Terms Conditions/TermsConditions.js";
import NRCPBMail from "./components/NRCPB Mail/NRCPBMail.js";
import RelatedLinks from "./components/Related Links/RelatedLinks.js";
import ScreenReaderAccess from "./components/Screen Reader Access/ScreenReaderAccess.js";
import Pioneer from "./components/pioneer/Pioneer.js";
import Committees from "./components/Committees/Committees.js";
import AboutCentre from "./components/AboutCentre/AboutCentre.js";
import VigilanceOfficer from "./components/Vigilance Officer/VigilanceOfficer.js";
import Help from "./components/Help/Help.js";
import AssociatedOrganization from "./components/Associated Organization/AssociatedOrganization.js";
import AdminMenuMaster from "./components/Admin Menu Master/AdminMenuMaster.js";
import ApiFunctionMappingWeb from "./components/Api Function Mapping Web/ApiFunctionMappingWeb.js";
import Organogram from "./components/Organogram/Organogram.js";
import Payment from "./components/Payment/Payment.js";
import CreateScientistLogin from "./components/create Scientist Login/CreateScientistLogin.js";
import UpdateScientist from "./components/create Scientist Login/UpdateScientist.js";
import Popup from "./components/Popup/Popup.js";
import TrainingProgram from "./components/Training Program/TrainingProgram.js";
import Professor from "./components/Professor/Professor.js";
import ForgotPassword from "./components/ForgotPassword.js";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const DEFAULT_FONT_SIZE = 16;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const location = useLocation();
  const isLogin = location.pathname === "/login";

  useEffect(() => {
    const savedSize = localStorage.getItem("fontSize");
    if (savedSize) {
      document.documentElement.style.setProperty(
        "--base-font-size",
        `${savedSize}px`,
      );
    } else {
      document.documentElement.style.setProperty(
        "--base-font-size",
        `${DEFAULT_FONT_SIZE}px`,
      );
    }
  }, []);
  const token = localStorage.getItem("token");
  return (
    <>
      {isLogin ? (
        <Routes>
          <Route
            path="/login"
            element={token ? <Navigate to="/" replace /> : <Login />}
          />
        </Routes>
      ) : (
        <div className="layout-fixed sidebar-expand-lg bg-body-tertiary">
          <div style={{ display: "flex" }}>
            <div style={{ width: isSidebarOpen ? "17.5%" : "0%" }}>
              {isSidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}
            </div>
            <div
              style={{
                width: isSidebarOpen ? "82.5%" : "100%",
                height: "100vh",
                flex: 1,
                overflowY: "auto",
              }}
            >
              <Header toggleSidebar={toggleSidebar} />
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forgotPassword"
                  element={
                    <ProtectedRoute>
                      <ForgotPassword />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/User"
                  element={
                    <ProtectedRoute>
                      <User />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/UserPermissions/:id"
                  element={
                    <ProtectedRoute>
                      <UserPermissions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ChangePassword"
                  element={
                    <ProtectedRoute requiredPermission="Change Password">
                      <ChangePassword />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profileupdate"
                  element={
                    <ProtectedRoute requiredPermission="Profile Update">
                      <ProfileUpdate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/template"
                  element={
                    <ProtectedRoute>
                      <Template />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/page"
                  element={
                    <ProtectedRoute>
                      <Page />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/menu"
                  element={
                    <ProtectedRoute>
                      <Menu />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizationDetails"
                  element={
                    <ProtectedRoute>
                      <OrganizationDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/news"
                  element={
                    <ProtectedRoute>
                      <News />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/event"
                  element={
                    <ProtectedRoute>
                      <Event />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/scientist"
                  element={
                    <ProtectedRoute>
                      <Scientist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faculty"
                  element={
                    <ProtectedRoute>
                      <Scientist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/CreateScientistLogin/:id"
                  element={
                    <ProtectedRoute>
                      <CreateScientistLogin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/UpdateScientist"
                  element={
                    <ProtectedRoute>
                      <UpdateScientist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute>
                      <Staff />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/technicalStaff"
                  element={
                    <ProtectedRoute>
                      <Staff />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/honoraryScientist"
                  element={
                    <ProtectedRoute>
                      <Staff />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/administrativeStaff"
                  element={
                    <ProtectedRoute>
                      <Staff />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/administrativeStaff"
                  element={
                    <ProtectedRoute>
                      <AdministrativeStaff />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/album"
                  element={
                    <ProtectedRoute>
                      <Album />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Outreachprogramme"
                  element={
                    <ProtectedRoute>
                      <Album />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/facilities"
                  element={
                    <ProtectedRoute>
                      <Album />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/director"
                  element={
                    <ProtectedRoute>
                      <Director />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/previousDirector"
                  element={
                    <ProtectedRoute>
                      <PreviousDirector />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/externallyFundedProjects"
                  element={
                    <ProtectedRoute>
                      <ExternallyFundedProjects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/institutionalProjects"
                  element={
                    <ProtectedRoute>
                      <InstitutionalProjects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/institutionalProjectsDetails/:id"
                  element={
                    <ProtectedRoute>
                      <InstitutionalProjectsDetails />
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                  path="/technologiesDeveloped"
                  element={
                    <ProtectedRoute>
                      <TechnologiesDeveloped />
                    </ProtectedRoute>
                  }
                /> */}
                <Route
                  path="/studentCourse"
                  element={
                    <ProtectedRoute>
                      <StudentCourse />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/designation"
                  element={
                    <ProtectedRoute>
                      <Designation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/documentUploader"
                  element={
                    <ProtectedRoute>
                      <DocumentUploader />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/content/:id"
                  element={
                    <ProtectedRoute>
                      <Content />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/publication"
                  element={
                    <ProtectedRoute>
                      <Publication />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AnnualReport"
                  element={
                    <ProtectedRoute>
                      <Publication />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Newsletters"
                  element={
                    <ProtectedRoute>
                      <Publication />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/HindiPatrika"
                  element={
                    <ProtectedRoute>
                      <Publication />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Others"
                  element={
                    <ProtectedRoute>
                      <Publication />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/alumni"
                  element={
                    <ProtectedRoute>
                      <Alumni />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contractualStaff"
                  element={
                    <ProtectedRoute>
                      <ContractualStaff />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feedback"
                  element={
                    <ProtectedRoute>
                      <Feedback />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feedbackView/:id"
                  element={
                    <ProtectedRoute>
                      <FeedbackView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/externalLink"
                  element={
                    <ProtectedRoute>
                      <ExternalLink />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collaborations"
                  element={
                    <ProtectedRoute>
                      <Collaborations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collaborationsDetails/:id"
                  element={
                    <ProtectedRoute>
                      <CollaborationsDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/banner"
                  element={
                    <ProtectedRoute>
                      <Banner />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cadreStrength"
                  element={
                    <ProtectedRoute>
                      <CadreStrength />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patents"
                  element={
                    <ProtectedRoute>
                      <Patents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/disclaimer"
                  element={
                    <ProtectedRoute>
                      <Disclaimer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/accessibilityStatement"
                  element={
                    <ProtectedRoute>
                      <AccessibilityStatement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/websitePolicies"
                  element={
                    <ProtectedRoute>
                      <WebsitePolicies />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/termsConditions"
                  element={
                    <ProtectedRoute>
                      <TermsConditions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/NIPBMail"
                  element={
                    <ProtectedRoute>
                      <NRCPBMail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/relatedLinks"
                  element={
                    <ProtectedRoute>
                      <RelatedLinks />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/screenReaderAccess"
                  element={
                    <ProtectedRoute>
                      <ScreenReaderAccess />
                    </ProtectedRoute>
                  }
                />
                {/* pioneer  */}
                <Route
                  path="/pioneer"
                  element={
                    <ProtectedRoute>
                      <Pioneer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/committees"
                  element={
                    <ProtectedRoute>
                      <Committees />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AboutCentre"
                  element={
                    <ProtectedRoute>
                      <AboutCentre />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/VigilanceOfficer"
                  element={
                    <ProtectedRoute>
                      <VigilanceOfficer />
                    </ProtectedRoute>
                  }
                />
                {/* change in FAQ */}
                <Route
                  path="/FAQ"
                  element={
                    <ProtectedRoute>
                      <Help />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AssociatedOrganization"
                  element={
                    <ProtectedRoute>
                      <AssociatedOrganization />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AdminMenuMaster"
                  element={
                    <ProtectedRoute>
                      <AdminMenuMaster />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ApiFunctionMappingWeb"
                  element={
                    <ProtectedRoute>
                      <ApiFunctionMappingWeb />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Organogram"
                  element={
                    <ProtectedRoute>
                      <Organogram />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Payment"
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Popup"
                  element={
                    <ProtectedRoute>
                      <Popup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/TrainingProgram"
                  element={
                    <ProtectedRoute>
                      <TrainingProgram />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Professor"
                  element={
                    <ProtectedRoute>
                      <Professor />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            {/* </div> */}
            {/* <Footer /> */}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
