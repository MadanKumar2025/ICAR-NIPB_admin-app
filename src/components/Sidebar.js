import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded?.id);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getPermissions = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_URL}/UserPermissionsRoutes/getAllDatat`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPermissions(response?.data?.data);

      // const permissions = response.data?.data?.menuPermissions || [];
      // const formattedData = permissions.map((item) => ({
      //   menuId: item?.menuId,
      //   parentMenuId: item?.menuId?.parentMenuId,
      //   menuName: item?.menuId?.menuName,
      //   pageAccess: item?.pageAccess || false,
      //   addAccess: item?.addAccess || false,
      //   editAccess: item?.editAccess || false,
      //   activeAccess: item?.activeAccess || false,
      //   deleteAccess: item?.deleteAccess || false,
      // }));

      // setUserData(formattedData);
      // setUserPermissionsID(response?.data?.data?._id);
    } catch (error) {
      console.error("Error fetching data:", error);

      const message = error.response?.data?.message;
      const status = error.response?.status;
      if (message === "Invalid token" || status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      if (message === "Your account is deactivated. Please contact admin.") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    if (token) {
      getPermissions();
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  const userPermissions = permissions.find(
    (item) => item?.userId?._id === user,
  );

  return (
    <div
      // className={`app-sidebar bg-body-secondary shadow ${!isOpen ? "collapsed" : ""}`}
      className={`New-sidebar shadow ${!isOpen ? "collapsed" : ""}`}
      data-bs-theme="dark"
      // style={{ zIndex: 2, position: "relative", }}
    >
      <div className="sidebar-brand d-flex justify-content-between">
        <Link to={"/"} className="brand-link">
          <span className="brand-text fw-light">Admin ICAR-NIPB</span>
        </Link>
        <div className="closeLogo" onClick={toggleSidebar}>
          <i className="bi bi-asterisk"></i>
        </div>
      </div>
      <div className="sidebar-wrapper">
        <nav className="mt-2">
          <ul
            className="nav sidebar-menu flex-column"
            data-lte-toggle="treeview"
            role="navigation"
            aria-label="Main navigation"
            data-accordion="false"
            id="navigation"
          >
            {userPermissions?.menuPermissions?.map((item, index) => {
              const menu = item?.menuId;

              if (!item?.pageAccess) return null;
              if (menu?.url?.includes(":id")) return null;
              return (
                <li className="nav-item" key={menu?._id || index}>
                  <Link
                    to={menu?.url || "#"}
                    className={`nav-link ${pathname === menu?.url && "active"}`}
                  >
                    <i className="nav-icon bi bi-palette"></i>
                    <p>{menu?.menuName}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul
            className="nav sidebar-menu flex-column"
            data-lte-toggle="treeview"
            role="navigation"
            aria-label="Main navigation"
            data-accordion="false"
          >
            <li className="nav-item">
              <a className="nav-link" onClick={handleLogout}>
                <i className="nav-icon bi bi-box-arrow-in-right"></i>
                <p>Logout</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    // <div
    //   className={`app-sidebar bg-body-secondary shadow ${!isOpen ? "collapsed" : ""}`}
    //   // className={`app-sidebarBox bg-body-secondary shadow ${!isOpen ? "collapsed" : ""}`}
    //   data-bs-theme="dark"
    // >
    //   <div className="sidebar-brand">
    //     <a href="/index.html" className="brand-link">
    //       <span className="brand-text fw-light">Admin ICAR-NIPB</span>
    //     </a>
    //   </div>
    //   <div className="sidebar-wrapper">
    //     <nav className="mt-2">
    //       <ul
    //         className="nav sidebar-menu flex-column"
    //         data-lte-toggle="treeview"
    //         role="navigation"
    //         aria-label="Main navigation"
    //         data-accordion="false"
    //         id="navigation"
    //       >
    //         <li className="nav-item">
    //           <Link
    //             to={"/"}
    //             className={`nav-link ${pathname === "/" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Dashboard</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to={"/user"}
    //             className={`nav-link ${pathname === "/user" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>User</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/changepassword"
    //             className={`nav-link ${pathname === "/changepassword" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Change Password</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/profileupdate"
    //             className={`nav-link ${pathname === "/profileupdate" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Profile Update</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/template"
    //             className={`nav-link ${pathname === "/template" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Template</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/page"
    //             className={`nav-link ${pathname === "/page" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Page</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/menu"
    //             className={`nav-link ${pathname === "/menu" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Menu</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/organizationDetails"
    //             className={`nav-link ${pathname === "/organizationDetails" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Organization Details</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/news"
    //             className={`nav-link ${pathname === "/news" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>News</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/event"
    //             className={`nav-link ${pathname === "/event" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Event</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/scientist"
    //             className={`nav-link ${pathname === "/scientist" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Scientist</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/staff"
    //             className={`nav-link ${pathname === "/staff" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Staff</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/administrativeStaff"
    //             className={`nav-link ${pathname === "/administrativeStaff" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Administrative Staff</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/album"
    //             className={`nav-link ${pathname === "/album" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Album</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/director"
    //             className={`nav-link ${pathname === "/director" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Director</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/previousDirector"
    //             className={`nav-link ${pathname === "/previousDirector" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Previous Director</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/externallyFundedProjects"
    //             className={`nav-link ${pathname === "/externallyFundedProjects" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Externally Funded Projects</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/institutionalProjects"
    //             className={`nav-link ${pathname === "/institutionalProjects" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Institutional Projects</p>
    //           </Link>
    //         </li>

    //         <li className="nav-item">
    //           <Link
    //             to="/technologiesDeveloped"
    //             className={`nav-link ${pathname === "/technologiesDeveloped" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Technologies Developed</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/studentCourse"
    //             className={`nav-link ${pathname === "/studentCourse" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Student Course</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/designation"
    //             className={`nav-link ${pathname === "/designation" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Designation</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/documentUploader"
    //             className={`nav-link ${pathname === "/documentUploader" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Document Uploader</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/publication"
    //             className={`nav-link ${pathname === "/publication" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Publication</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/alumni"
    //             className={`nav-link ${pathname === "/alumni" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Alumni</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/contractualStaff"
    //             className={`nav-link ${pathname === "/contractualStaff" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Contractual Staff</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/feedback"
    //             className={`nav-link ${pathname === "feedback" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Feedback</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/externalLink"
    //             className={`nav-link ${pathname === "externalLink" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>External Link</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/collaborations"
    //             className={`nav-link ${pathname === "collaborations" && "active"}`}
    //           >
    //             <i className="nav-icon bi bi-palette"></i>
    //             <p>Collaborations</p>
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <a className="nav-link" onClick={handleLogout}>
    //             <i className="nav-icon bi bi-box-arrow-in-right"></i>
    //             <p>Logout</p>
    //           </a>
    //         </li>
    //       </ul>
    //     </nav>
    //   </div>
    // </div>
  );
}

export default Sidebar;
