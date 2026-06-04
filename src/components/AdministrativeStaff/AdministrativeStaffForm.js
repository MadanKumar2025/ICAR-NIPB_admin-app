import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Box, Tabs, useMediaQuery, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function AdministrativeStaffForm({
  data,
  setData,
  setPreview,
  isEdit,
  editId,
  getAdministrativeStaff,
  setAllStaff,
  preview,
  handleClose,
}) {
  const [designation, setDesignation] = useState([]);
  // console.log("data", data);

  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;

  const formRef = useRef();
  const editor = useRef(null);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, type, files } = e.target;

    if (type === "file" && files.length > 0) {
      const file = files[0];

      setData((prev) => ({
        ...prev,
        [name]: file,
      }));

      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      try {
        const formData = new FormData();

        formData.append("department_en", data?.department_en || "");
        formData.append("department_hi", data?.department_hi || "");
        formData.append("staffName_en", data?.staffName_en || "");
        formData.append("staffName_hi", data?.staffName_hi || "");
        formData.append("designationId", data?.designationId || "");
        formData.append("phone", data?.phone || "");
        formData.append("email", data?.email || "");
        formData.append("education_en", data?.education_en || "");
        formData.append("education_hi", data?.education_hi || "");
        formData.append("imageTitle", data?.imageTitle || "");
        formData.append("isActive", data?.isActive);
        if (data.photo) {
          formData.append("photo", data.photo);
        }

        const res = await axios.put(
          `${API_URL}/AdministrativeStaffRoutes/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        setData({
          department_en: "",
          department_hi: "",
          staffName_en: "",
          staffName_hi: "",
          designationId: "",
          phone: "",
          email: "",
          education_en: "",
          education_hi: "",
          imageTitle: "",
          photo: null,
          isActive: true,
        });
        setPreview(null);
        formRef.current.reset();
        await getAdministrativeStaff();
        handleClose();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Update failed",
        });
      }
    } else {
      const formData = new FormData();

      formData.append("department_en", data?.department_en || "");
      formData.append("department_hi", data?.department_hi || "");
      formData.append("staffName_en", data?.staffName_en || "");
      formData.append("staffName_hi", data?.staffName_hi || "");
      formData.append("designationId", data?.designationId || "");
      formData.append("phone", data?.phone || "");
      formData.append("email", data?.email || "");
      formData.append("education_en", data?.education_en || "");
      formData.append("education_hi", data?.education_hi || "");
      formData.append("imageTitle", data?.imageTitle || "");
      formData.append("isActive", data?.isActive);
      if (data.photo) {
        formData.append("photo", data.photo);
      }

      try {
        const response = await axios.post(
          `${API_URL}/AdministrativeStaffRoutes/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        console.log("response", response);

        setData({
          department_en: "",
          department_hi: "",
          staffName_en: "",
          staffName_hi: "",
          designationId: "",
          phone: "",
          email: "",
          education_en: "",
          education_hi: "",
          imageTitle: "",
          photo: null,
          isActive: true,
        });
        setPreview(null);

        formRef.current.reset();
        // getAllPage(currentPage);

        Swal.fire({
          icon: "success",
          title: "Organization Details",
          text: response.data.message || "Organization Details Successfully.",
          confirmButtonColor: "#3085d6",
        });
        setAllStaff(response?.data?.data);
        await getAdministrativeStaff();
        handleClose();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Server error",
        });
      }
    }
  };

  // this is use for get Designation
  const getDesignation = async () => {
    try {
      const response = await axios.get(`${API_URL}/designation/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDesignation(response?.data?.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      if (
        error.response?.data?.message === "Invalid token" ||
        error.response?.status === 401
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    getDesignation();
  }, []);

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Administrative Staff</div>
          </div>

          <form
            className="needs-validation"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Department (English)
                  </label>
                  <input
                    type="text"
                    name="department_en"
                    value={data?.department_en}
                    onChange={handleChange}
                    className="form-control"
                    id="department_en"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Department (Hindi)
                  </label>
                  <input
                    type="text"
                    name="department_hi"
                    value={data?.department_hi}
                    onChange={handleChange}
                    className="form-control"
                    id="department_hi"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Staff Name (English)
                  </label>
                  <input
                    type="text"
                    name="staffName_en"
                    value={data?.staffName_en}
                    onChange={handleChange}
                    className="form-control"
                    id="staffName_en"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Staff Name (Hindi)
                  </label>
                  <input
                    type="text"
                    name="staffName_hi"
                    value={data?.staffName_hi}
                    onChange={handleChange}
                    className="form-control"
                    id="staffName_hi"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    phone
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="number"
                      name="phone"
                      value={data?.phone}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Email
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="email"
                      name="email"
                      value={data?.email}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Education (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="education_en"
                      value={data?.education_en}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Education (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="education_hi"
                      value={data?.education_hi}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Designation
                  </label>
                  <select
                    name="designationId"
                    value={data?.designationId}
                    onChange={handleChange}
                    className="form-control"
                    id="designationId"
                  >
                    <option value="">select</option>
                    {designation.map((item, index) => {
                      return (
                        <option key={index} value={item?._id}>
                          {item?.name?.en}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Is Active</label>
                  <select
                    name="isActive"
                    value={data?.isActive}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
                    Image Title
                  </label>
                  <input
                    type="text"
                    name="imageTitle"
                    value={data?.imageTitle}
                    onChange={handleChange}
                    className="form-control"
                    id="imageTitle"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom05" className="form-label">
                    Photo
                  </label>
                  <div className="d-flex">
                    <input
                      type="file"
                      name="photo"
                      onChange={handleChange}
                      className="form-control upload-image-input"
                      id="validationCustom05"
                    />
                  </div>
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        marginLeft: "20px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
              <div className="card-footer d-flex">
                <button className="btn btn-info" type="submit">
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

export default AdministrativeStaffForm;
