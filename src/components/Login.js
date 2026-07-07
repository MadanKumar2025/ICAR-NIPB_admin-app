import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [forgotData, setForgotData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleforgotData = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: forgotData.email,
      });

      console.log("response", response.data);

      setShowNewPassword(true);
      setLoading(false);
      Swal.fire({
        icon: "success",
        title: "Email Sent",
        text: "Password reset process started",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Forgot Password Failed",
        text: error.response?.data?.message || "Server error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    try {
      // Update ke baad login
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: forgotData.email,
        password: forgotData.password,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Password Update Failed",
        text: error.response?.data?.message || "Server error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <img src="/admin/qw.png" alt="Logo" />
      </div>
      {!showForgotPassword ? (
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
                  <p style={{ color: "red", cursor: "pointer" }}>
                    <span onClick={() => setShowForgotPassword(true)}>
                      Forgot Password
                    </span>
                  </p>
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
      ) : (
        <>
          <div className="login-page bg-body-secondary">
            <div className="login-box">
              <div className="login-logo"></div>
              <div className="card">
                <div className="card-body login-card-body rounded-2">
                  <p className="login-box-msg">Reset Password</p>

                  {/* Email Input */}
                  <div className="input-group mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter Email"
                      value={forgotData.email}
                      onChange={(e) =>
                        setForgotData({
                          ...forgotData,
                          email: e.target.value,
                        })
                      }
                    />{" "}
                    <div className="input-group-text">
                      <span className="bi bi-envelope"></span>
                    </div>
                  </div>

                  {/* Password Input (Button click ke baad dikhega) */}
                  {showNewPassword && (
                    <div className="input-group mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="New Password"
                        value={forgotData.password}
                        onChange={(e) =>
                          setForgotData({
                            ...forgotData,
                            password: e.target.value,
                          })
                        }
                      />
                      <div className="input-group-text">
                        <span className="bi bi-lock-fill"></span>
                      </div>
                    </div>
                  )}

                  {!showNewPassword ? (
                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={handleforgotData}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Loading...
                        </>
                      ) : (
                        "Send Password"
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdatePassword}
                      className="btn btn-primary w-100"
                    >
                      Update Password
                    </button>
                  )}

                  <button
                    className="btn btn-link w-100 mt-2"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setShowNewPassword(false);
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Login;
