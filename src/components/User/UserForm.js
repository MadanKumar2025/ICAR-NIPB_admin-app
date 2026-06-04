import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Box, Tabs } from "@mui/material";
import Tab from "@mui/material/Tab";

function UserForm({
  createUser,
  setCreateUser,
  setPreview,
  isEdit,
  editId,
  setIsEdit,
  currentPage,
  getUsers,
  preview,
  handleClose,
}) {
  const itemsPerPage = 10;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const formRef = useRef();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setCreateUser({
        ...createUser,
        [name]: file,
      });
      setPreview(URL.createObjectURL(file));
    } else {
      setCreateUser({
        ...createUser,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      try {
        const formData = new FormData();

        if (createUser.name) formData.append("name", createUser.name);
        if (createUser.mobileNo)
          formData.append("mobileNo", createUser.mobileNo);
        if (createUser.designation)
          formData.append("designation", createUser.designation);
        if (createUser.password)
          formData.append("password", createUser.password);
        if (createUser.imageTitle)
          formData.append("imageTitle", createUser.imageTitle);
        if (createUser.isActive !== undefined)
          formData.append("isActive", createUser.isActive);

        if (createUser.photo && createUser.photo instanceof File) {
          formData.append("photo", createUser.photo);
        }

        await axios.put(`${API_URL}/users/update/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setIsEdit(false);
        setCreateUser({
          name: "",
          email: "",
          mobileNo: "",
          password: "",
          designation: "",
          photo: null,
          imageTitle: "",
          isActive: true,
        });
        if (formRef.current) formRef.current.reset();
        setPreview(null);
        handleClose();
      } catch (error) {
        const message = error.response?.data?.message || "Something went wrong";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message || "Something went wrong",
        });
      }
    } else {
      const formData = new FormData();

      formData.append("name", createUser.name);
      formData.append("email", createUser.email);
      formData.append("mobileNo", createUser.mobileNo);
      formData.append("password", createUser.password);
      formData.append("designation", createUser.designation);
      formData.append("imageTitle", createUser.imageTitle);
      formData.append("photo", createUser.photo);

      try {
        const response = await axios.post(`${API_URL}/users`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("response", response);

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
        handleClose();
      } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("SERVER ERROR:", error?.response?.data);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Server error",
        });
      }
    }
    getUsers(currentPage);
  };

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Create User</div>
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
                    value={createUser.name}
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
                    value={createUser.email}
                    onChange={handleChange}
                    disabled={isEdit}
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
                      value={createUser.mobileNo}
                      className="form-control"
                      id="validationCustomUsername"
                      onChange={handleChange}
                      aria-describedby="inputGroupPrepend"
                      required
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
                    value={createUser.password}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                    required={!isEdit}
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
                    value={createUser.designation}
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
                    value={createUser?.imageTitle}
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
                    className="form-control upload-image-input"
                    id="validationCustom05"
                    required={!isEdit}
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
                {isEdit ? (
                  <div className="col-md-6">
                    <label className="form-label">Is Active</label>
                    <select
                      name="isActive"
                      value={createUser.isActive}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
              <div className="card-footer d-flex">
                <button className="btn btn-info" type="submit">
                  {/* {isEdit ? "Update User" : "Submit form"} */}
                  {/* {isEdit ? "Update" : "Save"} */}
                  Save
                </button>
                 <button className="btn btn-info ms-auto" onClick={handleClose}>
                  Close
                </button>
              </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserForm;
