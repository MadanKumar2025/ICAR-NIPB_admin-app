import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [data, setData] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);
      const token = response.data.token;

      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message || "Invalid password or server error",
        confirmButtonColor: "#d33",
      });
    }
  };
  return (
    <>
    <div className="d-flex justify-content-center align-items-center">
      <img src="/admin/qw.png" alt="Logo" />
      </div>
      <div className="login-page bg-body-secondary">
        <div className="login-box">
          <div className="login-logo">
            {/* <a >
              <b>ICAR</b>-NIPB Login
              </a> */}
            {/* <img src="/admin/qw.png" alt="Logo" /> */}
          </div>
          <div className="card">
            <div className="card-body login-card-body rounded-2">
              <p className="login-box-msg">Sign in to start your session</p>
              <form onSubmit={handleLogin}>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Email"
                  />
                  <div className="input-group-text">
                    <span className="bi bi-envelope"></span>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Password"
                  />
                  <div className="input-group-text">
                    <span className="bi bi-lock-fill"></span>
                  </div>
                </div>
                <div className="row">
                  <div className="social-auth-links text-center mb-3 d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      Sign In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
