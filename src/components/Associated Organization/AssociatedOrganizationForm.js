import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Box, Tabs, useMediaQuery, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";

function AssociatedOrganizationForm({
  data,
  setData,
  setPreview,
  isEdit,
  editId,
  getAssociatedOrganization,
  setAssociatedOrganization,
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

        formData.append("photoTitle", data?.photoTitle || "");
        formData.append("relatedLink", data?.relatedLink || "");
        formData.append("isActive", data?.isActive);
        if (data?.photo) {
          formData.append("photo", data?.photo);
        }

        const res = await axios.put(
          `${API_URL}/AssociatedOrganizationRoutes/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setPreview(null);
        formRef.current.reset();
        await getAssociatedOrganization();
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

      formData.append("photoTitle", data?.photoTitle || "");
      formData.append("relatedLink", data?.relatedLink || "");
      formData.append("isActive", data?.isActive);
      if (data?.photo) {
        formData.append("photo", data?.photo);
      }

      try {
        const response = await axios.post(
          `${API_URL}/AssociatedOrganizationRoutes/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setPreview(null);

        formRef.current.reset();

        Swal.fire({
          icon: "success",
          title: "Organization Details",
          text:
            response.data.message || " Associated Organization Successfully.",
          confirmButtonColor: "#3085d6",
        });

        setAssociatedOrganization(response?.data?.data);
        await getAssociatedOrganization();
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
            <div className="card-title">Associated Organization </div>
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
                    Related Link
                  </label>
                  <input
                    type="text"
                    name="relatedLink"
                    value={data?.relatedLink}
                    onChange={handleChange}
                    className="form-control"
                    id="relatedLink"
                  />
                </div>

                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Photo Title
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="photoTitle"
                      value={data?.photoTitle}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
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
                  <br></br>
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

export default AssociatedOrganizationForm;
