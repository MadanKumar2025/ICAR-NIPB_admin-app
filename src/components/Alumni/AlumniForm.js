import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Box, Tabs, useMediaQuery, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";

function AlumniForm({
  data,
  setData,
  setPreview,
  isEdit,
  editId,
  getAlumni,
  setAllHelp,
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

        formData.append("name_en", data?.name_en || "");
        formData.append("name_hi", data?.name_hi || "");
        formData.append("email", data?.email || "");
        formData.append("batch_en", data?.batch_en || "");
        formData.append("batch_hi", data?.batch_hi || "");
        formData.append("degree_en", data?.degree_en || "");
        formData.append("degree_hi", data?.degree_hi || "");
        formData.append("profileLink", data?.profileLink || "");
        formData.append("facebook", data?.facebook || "");
        formData.append("twitter", data?.twitter || "");
        formData.append("youtube", data?.youtube || "");
        formData.append("linkedin", data?.linkedin || "");
        formData.append("instagram", data?.instagram || "");
        formData.append("photoTitle", data?.photoTitle || "");
        formData.append("isApproved", data?.isApproved);
        if (data?.photo) {
          formData.append("photo", data?.photo);
        }
        const res = await axios.put(
          `${API_URL}/AlumniRoutes/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        console.log("res", res);

        setData({
          name_en: "",
          name_hi: "",
          email: "",
          batch_en: "",
          batch_hi: "",
          degree_en: "",
          degree_hi: "",
          profileLink: "",
          facebook: "",
          twitter: "",
          youtube: "",
          linkedin: "",
          instagram: "",
          photoTitle: "",
          photo: "",
          isApproved: true,
        });
        await getAlumni();
        handleClose();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Update failed",
        });
      }
    } else {
      try {
        const formData = new FormData();

        formData.append("name_en", data?.name_en || "");
        formData.append("name_hi", data?.name_hi || "");
        formData.append("email", data?.email || "");
        formData.append("batch_en", data?.batch_en || "");
        formData.append("batch_hi", data?.batch_hi || "");
        formData.append("degree_en", data?.degree_en || "");
        formData.append("degree_hi", data?.degree_hi || "");
        formData.append("profileLink", data?.profileLink || "");
        formData.append("facebook", data?.facebook || "");
        formData.append("twitter", data?.twitter || "");
        formData.append("youtube", data?.youtube || "");
        formData.append("linkedin", data?.linkedin || "");
        formData.append("instagram", data?.instagram || "");
        formData.append("photoTitle", data?.photoTitle || "");
        formData.append("isApproved", data?.isApproved);
        if (data?.photo) {
          formData.append("photo", data?.photo);
        }

        const response = await axios.post(
          `${API_URL}/AlumniRoutes/create`,
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
          name_en: "",
          name_hi: "",
          email: "",
          batch_en: "",
          batch_hi: "",
          degree_en: "",
          degree_hi: "",
          profileLink: "",
          facebook: "",
          twitter: "",
          youtube: "",
          linkedin: "",
          instagram: "",
          photoTitle: "",
          photo: "",
          isApproved: true,
        });

        Swal.fire({
          icon: "success",
          title: "Alumni Details",
          text: response.data.message || "Alumni Details Successfully.",
          confirmButtonColor: "#3085d6",
        });

        setPreview(null);
        formRef.current.reset();
        await getAlumni();
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
        <div className="card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Alumni</div>
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
                    Name (English)
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={data?.name_en}
                    onChange={handleChange}
                    className="form-control"
                    id="name_en"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Name (Hindi)
                  </label>
                  <input
                    type="text"
                    name="name_hi"
                    value={data?.name_hi}
                    onChange={handleChange}
                    className="form-control"
                    id="name_hi"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={data?.email}
                    onChange={handleChange}
                    className="form-control"
                    id="email"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Batch (English)
                  </label>
                  <input
                    type="text"
                    name="batch_en"
                    value={data?.batch_en}
                    onChange={handleChange}
                    className="form-control"
                    id="batch_en"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Batch (Hindi)
                  </label>
                  <input
                    type="text"
                    name="batch_hi"
                    value={data?.batch_hi}
                    onChange={handleChange}
                    className="form-control"
                    id="batch_hi"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Degree Name (English)
                  </label>
                  <input
                    type="text"
                    name="degree_en"
                    value={data?.degree_en}
                    onChange={handleChange}
                    className="form-control"
                    id="degree_en"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Degree Name (Hindi)
                  </label>
                  <input
                    type="text"
                    name="degree_hi"
                    value={data?.degree_hi}
                    onChange={handleChange}
                    className="form-control"
                    id="degree_hi"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Profile Link
                  </label>
                  <input
                    type="text"
                    name="profileLink"
                    value={data?.profileLink}
                    onChange={handleChange}
                    className="form-control"
                    id="profileLink"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    value={data?.facebook}
                    onChange={handleChange}
                    className="form-control"
                    id="facebook"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Twitter
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    value={data?.twitter}
                    onChange={handleChange}
                    className="form-control"
                    id="twitter"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    You Tube
                  </label>
                  <input
                    type="text"
                    name="youtube"
                    value={data?.youtube}
                    onChange={handleChange}
                    className="form-control"
                    id="youtube"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Linkedin
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={data?.linkedin}
                    onChange={handleChange}
                    className="form-control"
                    id="linkedin"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={data?.instagram}
                    onChange={handleChange}
                    className="form-control"
                    id="instagram"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Photo Title
                  </label>
                  <input
                    type="text"
                    name="photoTitle"
                    value={data?.photoTitle}
                    onChange={handleChange}
                    className="form-control"
                    id="photoTitle"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Is Active</label>
                  <select
                    name="isApproved"
                    value={data?.isApproved}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
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
                      className="form-control col-md-6"
                      id="validationCustom05"
                      style={{ height: "4vh" }}
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
            <div className="d-flex justify-content-between">
              <div className="card-footer">
                <button className="btn btn-info" type="submit">
                  Save
                </button>
              </div>
              <div className="card-footer">
                <button className="btn btn-info" onClick={handleClose}>
                  Close
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AlumniForm;
