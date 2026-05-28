import "../css/adminlte.css";
import { Navigate } from "react-router-dom";

function Header({ toggleSidebar }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }

  const DEFAULT_FONT_SIZE = 16; // normal size

  const changeFontSize = (delta) => {
    const root = document.documentElement;
    const currentSize = parseInt(
      getComputedStyle(root).getPropertyValue("--base-font-size"),
    );
    let newSize = currentSize + delta;

    if (newSize < 12) newSize = 12;
    if (newSize > 32) newSize = 32;

    root.style.setProperty("--base-font-size", `${newSize}px`);
    localStorage.setItem("fontSize", newSize);
  };

  const resetFontSize = () => {
    const root = document.documentElement;
    root.style.setProperty("--base-font-size", `${DEFAULT_FONT_SIZE}px`);
    localStorage.setItem("fontSize", DEFAULT_FONT_SIZE);
  };
  return (
    <>
      {/* <nav className="app-header navbar navbar-expand bg-body"> */}
      <nav className=" navbar navbar-expand bg-body">
        {/* <nav className="app-header"> */}
        <div className="container-fluid">
          {/* Left Navbar */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" onClick={toggleSidebar} href="#">
                <i className="bi bi-list"></i>
              </a>
            </li>
            <div style={{ marginBottom: "10px" }}>
              <button className="btn" onClick={() => changeFontSize(-2)}>
                -A
              </button>
              <button className="btn " onClick={resetFontSize}>
                A
              </button>
              <button className="btn" onClick={() => changeFontSize(2)}>
                +A
              </button>
            </div>
          </ul>

          {/* <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bi bi-search"></i>
              </a>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link"
                style={{
                  position: "relative",
                  fontSize: "22px",
                  color: "#6c757d",
                }}
                href="#"
              >
                <i className="bi bi-chat-text"></i>
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-8px",
                    background: "red",
                    color: "white",
                    fontSize: "10px",
                    padding: "2px 5px",
                    borderRadius: "50%",
                  }}
                >
                  3
                </span>
              </a>

              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                <a href="#" className="dropdown-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <img
                        src="/assets/img/user1-128x128.jpg"
                        alt="User"
                        className="img-size-50 rounded-circle me-3"
                      />
                    </div>

                    <div className="flex-grow-1">
                      <h3 className="dropdown-item-title">Brad Diesel</h3>

                      <p className="fs-7">Call me whenever you can...</p>
                    </div>
                  </div>
                </a>

                <div className="dropdown-divider"></div>

                <a href="#" className="dropdown-item dropdown-footer">
                  See All Messages
                </a>
              </div>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link"
                style={{
                  position: "relative",
                  fontSize: "22px",
                  color: "#6c757d",
                }}
                data-bs-toggle="dropdown"
                href="#"
              >
                <i className="bi bi-bell-fill"></i>
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-8px",
                    background: "red",
                    color: "white",
                    fontSize: "10px",
                    padding: "2px 5px",
                    borderRadius: "50%",
                  }}
                >
                  15
                </span>
              </a>
            </li>
            <li className="nav-item dropdown user-menu">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <img
                  src="/assets/img/user2-160x160.jpg"
                  className="user-image rounded-circle shadow"
                  alt="User"
                />

                <span className="d-none d-md-inline">Alexander Pierce</span>
              </a>
            </li>
          </ul> */}
        </div>
      </nav>
    </>
  );
}

export default Header;
