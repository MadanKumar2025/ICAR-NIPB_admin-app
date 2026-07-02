import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRef } from "react";
import { jwtDecode } from "jwt-decode";

import { usePermissions } from "../User_Management/UserManagement.js";
import { useNavigate, useParams } from "react-router-dom";

function CreateScientistLogin() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;

  const [preview, setPreview] = useState(null);
  const [one, setOne] = useState(null);
  const [createUser, setCreateUser] = useState({
    name: "",
    email: "",
    mobileNo: "",
    password: "",
    designation: "",
    imageTitle: "",
    photo: null,
    existingPhoto: "",
  });

  const [data, setData] = useState({
    menuId: "6a100437d7a80cd908e2e640",
    pageAccess: true,
    addAccess: true,
    editAccess: true,
    activeAccess: true,
    deleteAccess: true,
  });

  const { id } = useParams();
  const token = localStorage.getItem("token");
  const formRef = useRef();
  const navigate = useNavigate();

  const getScientist = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/ScientistRoutes/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCreateUser({
        name: response?.data?.data?.scientistName?.en,
        email: response?.data?.data?.email1,
        mobileNo: response?.data?.data?.phone1,
        designation: response?.data?.data?.designationId?.name?.en,
        imageTitle: response?.data?.data?.photoTitle,
        existingPhoto: response?.data?.data?.photo,
        photo: null,
      });

      setPreview(`${IMG_BASE_URL}/${response?.data?.data?.photo}`);
    } catch (error) {
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
    if (id) getScientist(id);
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];

      setCreateUser((prev) => ({
        ...prev,
        photo: file,
      }));

      setPreview(URL.createObjectURL(file));
    } else {
      setCreateUser({
        ...createUser,
        [name]: value,
      });
    }
  };

  // console.log("createUser", createUser);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formData = new FormData();

  //     formData.append("name", createUser?.name);
  //     formData.append("email", createUser?.email);
  //     formData.append("mobileNo", createUser?.mobileNo);
  //     formData.append("password", createUser?.password);
  //     formData.append("designation", createUser?.designation);
  //     formData.append("imageTitle", createUser?.imageTitle);
  //     formData.append("scientistId", id);
  //     formData.append("photo", createUser.photo);
  //     formData.append("existingPhoto", createUser.existingPhoto);

  //     // for (let pair of formData.entries()) {
  //     //   console.log(pair[0], pair[1]);
  //     // }

  //     const response = await axios.post(
  //       `${API_URL}/createScientistLogin`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       },
  //     );

  //     console.log("response1111", response?.data?.data?._id);
  //     setOne(response?.data?.data?._id);

  //     setCreateUser({
  //       name: "",
  //       email: "",
  //       mobileNo: "",
  //       password: "",
  //       designation: "",
  //       photo: null,
  //       imageTitle: "",
  //     });

  //     formRef.current.reset();
  //     setPreview(null);
  //     navigate(-1);
  //   } catch (error) {
  //     console.log("FULL ERROR:", error);
  //     console.log("SERVER ERROR:", error?.response?.data);

  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: error?.response?.data?.message || "Server error",
  //     });
  //   }
  //   console.log("one", one);

  //   if (one) {
  //     try {
  //       const payload = {
  //         userId: one,
  //         menuPermissions: [data],
  //       };

  //       const response = await axios.post(
  //         `${API_URL}/UserPermissionsRoutes/create`,
  //         payload,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         },
  //       );

  //       console.log("response", response);

  //       Swal.fire({
  //         icon: "success",
  //         title: "Success",
  //         text: "User updated successfully",
  //       });

  //       // getUserPermissions();
  //       // getPermissions();
  //     } catch (error) {
  //       console.log("FULL ERROR:", error);
  //       console.log("SERVER ERROR:", error?.response?.data);

  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: error?.response?.data?.message || "Server error",
  //       });
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("createUser",createUser);
    
    try {
      const formData = new FormData();

      formData.append("name", createUser?.name);
      formData.append("email", createUser?.email);
      formData.append("mobileNo", createUser?.mobileNo);
      formData.append("password", createUser?.password);
      formData.append("designation", createUser?.designation);
      formData.append("imageTitle", createUser?.imageTitle);
      formData.append("scientistId", id);
      formData.append("photo", createUser?.photo);
      formData.append("existingPhoto", createUser?.existingPhoto);

      const response = await axios.post(
        `${API_URL}/createScientistLogin`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("response",response);
      
      // Directly get user ID from response
      const userId = response?.data?.data?._id;
      // console.log("Created User ID:", userId);

      // Reset form
      setCreateUser({
        name: "",
        email: "",
        mobileNo: "",
        password: "",
        designation: "",
        photo: null,
        imageTitle: "",
      });
      formRef.current.reset();
      setPreview(null);

      //  Immediately call permission API
      if (userId) {
        const payload = {
          userId: userId,
          menuPermissions: [data],
        };

        const permResponse = await axios.post(
          `${API_URL}/UserPermissionsRoutes/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        console.log("Permissions Response:", permResponse);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User created & permissions saved successfully",
        });
      }

      navigate(-1);
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

  // console.log("data", data);

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Create Scientist Login</div>
          </div>

          <form
            className="needs-validation"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="validationCustom01" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={createUser?.name || ""}
                    className="form-control"
                    id="validationCustom01"
                    onChange={handleChange}
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Email Id
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={createUser.email || "" }
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
                    Mobile No.
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="number"
                      name="mobileNo"
                      value={createUser.mobileNo || "" }
                      className="form-control"
                      id="validationCustomUsername"
                      onChange={handleChange}
                      aria-describedby="inputGroupPrepend"
                      // required
                    />
                    <div className="invalid-feedback">
                      Please choose a Mobile No..
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={createUser.password || "" }
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                  />
                  <div className="invalid-feedback">
                    Please provide a Password.
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={createUser.designation || "" }
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide a Designation.
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
                    Image Title
                  </label>
                  <input
                    type="text"
                    name="imageTitle"
                    value={createUser?.imageTitle || "" }
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                    // required
                  />
                  <div className="invalid-feedback">
                    Please provide a Designation.
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom05" className="form-label">
                    Photo
                  </label>
                  <input
                    type="file"
                    name="photo"
                    // value={createUser.photo}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom05"
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        marginTop: "10px",
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div className="invalid-feedback">
                    Please provide a Photo.
                  </div>
                </div>
              </div>
            </div>
              <div className="card-footer">
                <button className="btn btn-info" type="submit">
                  Save
                </button>
              </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateScientistLogin;
