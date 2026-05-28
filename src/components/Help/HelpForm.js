import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Box, Tabs, useMediaQuery, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";

function HelpForm({
  data,
  setData,
  setPreview,
  isEdit,
  editId,
  getHelp,
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
        const res = await axios.put(
          `${API_URL}/HelpRoutes/update/${editId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        console.log("res", res);

        setData({
          title_en: "",
          title_hi: "",
          description_en: "",
          description_hi: "",
          isActive: true,
        });
        await getHelp();
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
        const response = await axios.post(
          `${API_URL}/HelpRoutes/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        // console.log("response", response);

        setData({
          title_en: "",
          title_hi: "",
          description_en: "",
          description_hi: "",
          isActive: true,
        });

        Swal.fire({
          icon: "success",
          title: "Help Details",
          text: response.data.message || "Help Details Successfully.",
          confirmButtonColor: "#3085d6",
        });

        setAllHelp(response?.data?.data);
        await getHelp();
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

  //   console.log("data", data);

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">FAQ</div>
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
                    Questions (English)
                  </label>
                  <input
                    type="text"
                    name="title_en"
                    value={data?.title_en}
                    onChange={handleChange}
                    className="form-control"
                    id="title_en"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Questions (Hindi)
                  </label>
                  <input
                    type="text"
                    name="title_hi"
                    value={data?.title_hi}
                    onChange={handleChange}
                    className="form-control"
                    id="title_hi"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Answers (English)
                  </label>
                  <input
                    type="text"
                    name="description_en"
                    value={data?.description_en}
                    onChange={handleChange}
                    className="form-control"
                    id="description_en"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Answers (Hindi)
                  </label>
                  <input
                    type="text"
                    name="description_hi"
                    value={data?.description_hi}
                    onChange={handleChange}
                    className="form-control"
                    id="description_hi"
                    required
                  />
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

export default HelpForm;
