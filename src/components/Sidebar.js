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
  const [openMenuId, setOpenMenuId] = useState(null);

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
  const handleParentClick = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // console.log("userPermissions", userPermissions);

  return (
    <div
      // className={`app-sidebar bg-body-secondary shadow ${!isOpen ? "collapsed" : ""}`}
      className={`New-sidebar shadow ${!isOpen ? "collapsed" : ""}`}
      data-bs-theme="dark"
      // style={{ zIndex: 2, position: "relative", }}
    >
      <div className="sidebar-brand d-flex justify-content-between">
        <Link to={"/"} className="brand-link">
          {/* <span className="brand-text fw-light">Admin ICAR-NIPB</span> */}
          <span className="brand-text fw-light">Admin</span>
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
            {parents.map((parent, index) => {
              const parentMenu = parent.menuId;

              const children = menuPermissions.filter(
                (item) =>
                  item?.pageAccess &&
                  item?.menuId?.menuType === "child" &&
                  item?.menuId?.parentMenuId === parentMenu?._id,
              );

              const isOpen = openMenuId === parentMenu?._id;

              return (
                <li
                  className={`nav-item ${isOpen ? "menu-open" : ""}`}
                  key={parentMenu?._id || index}
                >
                  {/* Parent Click */}
                  <div
                    className="nav-link"
                    // onClick={() => handleParentClick(parentMenu?._id)}
                    onClick={() => {
                      handleParentClick(parentMenu?._id);
                      handleMenuClick(parent.menuId?.url);
                    }}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p style={{ display: "flex" }}>
                      <i className="nav-icon bi bi-folder"></i>
                      {parentMenu?.menuName}
                    </p>
                    <p>
                      {children.length > 0 && (
                        <i
                          className={`bi ${
                            isOpen ? "bi-chevron-down" : "bi-chevron-right"
                          } ms-auto`}
                        ></i>
                      )}
                    </p>
                  </div>

                  {/* Child Menu */}
                  {isOpen && children.length > 0 && (
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
                <p>Logout</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
