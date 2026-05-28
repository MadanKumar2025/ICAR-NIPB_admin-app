import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { usePermissions } from "../User_Management/UserManagement.js";

function ChangePassword() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();
  const [data, setData] = useState({
    // currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/users/change-password`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      // console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "Password Changed",
        text: response.data.message || "Your password has been updated.",
        confirmButtonColor: "#3085d6",
      });
      setData({
        // currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("SERVER ERROR:", error?.response?.data);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Server error",
      });
    }
  };
  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Change Password</div>
          </div>

          <form className="needs-validation" onSubmit={handleLogin}>
            <div className="card-body">
              <div className="row g-3">
                {/* <div className="col-md-6">
                  <label htmlFor="validationCustom01" className="form-label">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={data.currentPassword}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom01"
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div> */}
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={data.newPassword}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom02"
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Confirm New Password
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={data.confirmNewPassword}
                      onChange={handleChange}
                      className="form-control"
                      id="validationCustomUsername"
                      aria-describedby="inputGroupPrepend"
                      required
                    />
                    <div className="invalid-feedback">
                      Please choose a Mobile No..
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              {(hasAddAccess("Change Password") ||
                hasEditAccess("Change Password")) && (
                <button className="btn btn-info" type="submit">
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
