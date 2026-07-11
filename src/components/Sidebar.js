import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// OLD DATA 1
// function Sidebar({ isOpen, toggleSidebar }) {
// ADD NEW DATA 1
function Sidebar({ isOpen, isCollapsed, isMobile, toggleSidebar }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

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

  /* menu click close sidebar */
  const handleMenuClick = (url) => {
    navigate(url);

    if (window.innerWidth <= 1024) {
      toggleSidebar();
    }
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

  const menuPermissions = userPermissions?.menuPermissions || [];

  const parents = menuPermissions.filter(
    (item) => item?.pageAccess && item?.menuId?.menuType === "parent",
  );
  // const handleParentClick = (id) => {
  //   setOpenMenuId((prev) => (prev === id ? null : id));
  // };
  const handleParentClick = (menuId, hasChildren, url) => {
    setActiveMenuId(menuId);

    if (hasChildren) {
      setOpenMenuId((prev) => (prev === menuId ? null : menuId));
    } else {
      setOpenMenuId(null);
      handleMenuClick(url);
    }
  };

  // console.log("userPermissions", userPermissions);

  return (
    // OLD DATA 2
    // <div
    //   // className={`app-sidebar bg-body-secondary shadow ${!isOpen ? "collapsed" : ""}`}
    //   className={`New-sidebar shadow ${!isOpen ? "collapsed" : ""}`}
    //   data-bs-theme="dark"
    //   // style={{ zIndex: 2, position: "relative", }}
    // >
    //  ADD NEW DATA 2
    <div
      className={`New-sidebar shadow
    ${isMobile ? (isOpen ? "mobile-open" : "") : ""}
    ${!isMobile && isCollapsed ? "mini-sidebar" : ""}
  `}
      data-bs-theme="dark"
    >
      {/* End */}
      {/* <div className="sidebar-brand d-flex justify-content-between">
        <Link
          to={"/"}
          className="brand-link"
        
        >
           <span >Admin</span>
        </Link>
        <div className="closeLogo" onClick={toggleSidebar}>
          <i className="bi bi-asterisk"></i>
        </div>
      </div> */}
      <div className="sidebar-brand d-flex justify-content-between">
        <Link
          to={"/"}
          className="brand-link"
          style={{
            width: "100%",
            display: "flex",
          }}
        >
          {/*OLD DATA 3 <p style={{ margin: 0 }}>Admin</p> */}
          {/* ADD DATA NEW 3 */}
          <p
            className="sidebar-text d-flex gap-2 align-items-center justify-conteent-center"
            style={{ margin: 0 }}
          >
            <img
              src="./assets/img/icon/admin.webp"
              className="img-fluid"
              width="28"
              height="28"
              alt="Admin Icon"
            />
            <span>Admin</span>
          </p>
        </Link>

        <div className="closeLogo" onClick={toggleSidebar}>
          <i className="bi bi-x-lg"></i>
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
            {parents.map((parent, index) => {
              const parentMenu = parent.menuId;

              const children = menuPermissions.filter(
                (item) =>
                  item?.pageAccess &&
                  item?.menuId?.menuType === "child" &&
                  item?.menuId?.parentMenuId === parentMenu?._id,
              );

              const isOpen = openMenuId === parentMenu?._id;
              //  const isActiveParent = pathname === parentMenu?.url;
              const hasChildren = children.length > 0;

              return (
                <li
                  className={`nav-item ${isOpen ? "menu-open" : ""}`}
                  key={parentMenu?._id || index}
                >
                  {/* Parent Click */}
                  <div
                    className={`nav-link panel-main-links ${
                      activeMenuId === parentMenu?._id ? "menu-active" : ""
                    }`}
                    // onClick={() => handleParentClick(parentMenu?._id)}
                    onClick={() =>
                      handleParentClick(
                        parentMenu?._id,
                        hasChildren,
                        parentMenu?.url,
                      )
                    }
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* OLD DATA 4 */}
                    {/* <p className="ps-0" style={{ display: "flex" }}>
                      <i className="nav-icon bi bi-folder"></i>
                      {parentMenu?.menuName}
                    </p> */}
                    {/* ADD NEW DATA 4 */}
                    <p className="ps-0 d-flex align-items-center">
                      <i className="nav-icon bi bi-folder"></i>
                      <span className="sidebar-text">
                        {parentMenu?.menuName}
                      </span>
                    </p>
                    {/* END 4 */}
                    <p>
                      {children.length > 0 && (
                        // <i
                        //   className={`bi ${
                        //     isOpen ? "bi-chevron-down" : "bi-chevron-right"
                        //   } ms-auto`}
                        // ></i>
                        <i
                          className={`bi bi-chevron-right ms-auto sidebar-arrow ${
                            isOpen ? "rotate" : ""
                          }`}
                        ></i>
                      )}
                    </p>
                  </div>

                  {/* Child Menu */}
                  {/* {isOpen && children.length > 0 && (
                    <ul className="nav nav-treeview">
                      {children.map((child, i) => (
                        <li className="nav-item" key={child.menuId?._id || i}>
                          <Link
                            to={child.menuId?.url}
                            className={`nav-link ${
                              pathname === child.menuId?.url ? "active" : ""
                            }`}
                            onClick={() => handleMenuClick(child.menuId?.url)}
                          >
                            <i className="far fa-circle nav-icon"></i>
                            <p>{child.menuId?.menuName}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )} */}
                  {/* old data 5 */}
                  {/* <ul
                          className={`nav nav-treeview sidebar-dropdown panel-dropdown ${
                            isOpen ? "show" : ""
                          }`}
                        >
                          {children.map((child, i) => (
                            <li className="nav-item panel-dropdown-items" key={child.menuId?._id || i}>
                              <Link
                                to={child.menuId?.url}
                                className={`nav-link panel-dropdown-link position-relative m-0 ${
                                  pathname === child.menuId?.url ? "active" : ""
                                }`}
                                onClick={() => handleMenuClick(child.menuId?.url)}
                              >
                              <p>{child.menuId?.menuName}</p>
                              </Link>
                            </li>
                          ))}
                        </ul> */}

                  {children.length > 0 && (
                    <ul
                      className={`nav nav-treeview sidebar-dropdown panel-dropdown ${
                        isOpen ? "show" : ""
                      }`}
                    >
                      {children.map((child, i) => (
                        <li
                          className="nav-item panel-dropdown-items"
                          key={child.menuId?._id || i}
                        >
                          <Link
                            to={child.menuId?.url}
                            className={`nav-link panel-dropdown-link ${
                              pathname === child.menuId?.url ? "active" : ""
                            }`}
                            // onClick={() => handleMenuClick(child.menuId?.url)}
                            onClick={() => {
                              setActiveMenuId(parentMenu?._id);
                              handleMenuClick(child.menuId?.url);
                            }}
                          >
                            <p>{child.menuId?.menuName}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            {/* {userPermissions?.menuPermissions?.map((item, index) => {
              const menu = item?.menuId;

              if (!item?.pageAccess) return null;
              if (menu?.url?.includes(":id")) return null;
              return (
                <li className="nav-item" key={menu?._id || index}>
                  <Link
                    to={menu?.url || "#"}
                    className={`nav-link ${pathname === menu?.url ? "active" : ""}`}
                    onClick={() => handleMenuClick(menu?.url)}
                  >
                    <i className="nav-icon bi bi-palette"></i>
                    <p>{menu?.menuName}</p>
                  </Link>
                </li>
              );
            })} */}
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

                {/*old data 6 <p>Logout</p> */}
                {/* add new data 6 */}
                <p className="sidebar-text">Logout</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
