import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { usePermissions } from "../User_Management/UserManagement.js";

function Organogram() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();
  const [preview, setPreview] = useState(null);

  const [data, setData] = useState({
    photo: null,
    photoTitle: "",
  });

  const token = localStorage.getItem("token");
  const formRef = useRef();

  const getOrganogram = async (page = 1) => {
    try {
      const response = await axios.get(`${API_URL}/OrganogramRoutes/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsEdit(response?.data?.data[0]?.photo === undefined ? false : true);
      setEditId(response?.data?.data[0]?.id);

      setPreview(`${IMG_BASE_URL}/${response?.data?.data[0]?.photo}`);

      setData(response?.data?.data[0]);
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
    getOrganogram();
  }, []);

  const handleChange = (e) => {
    const { name, type, files, checked, value } = e.target;

    // FILE INPUT
    if (type === "file") {
      const file = files?.[0];

      setData((prev) => ({
        ...prev,
        [name]: file || null,
      }));

      if (file) {
        setPreview(URL.createObjectURL(file));
      }

      return;
    }

    // CHECKBOX
    if (type === "checkbox") {
      setData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    // isActive dropdown boolean conversion
    if (name === "isActive") {
      setData((prev) => ({
        ...prev,
        isActive: value === "true",
      }));
      return;
    }

    // MULTILINGUAL fields (example: title_en, title_hi)
    if (name.includes("_en") || name.includes("_hi")) {
      const [field, lang] = name.split("_");

      setData((prev) => ({
        ...prev,
        [field]: {
          ...(prev[field] || {}),
          [lang]: value,
        },
      }));
      return;
    }

    // DEFAULT INPUT
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      try {
        const formData = new FormData();

        // Multilingual fields
        formData.append("photoTitle", data?.photoTitle || "");

        if (data?.photo) formData.append("photo", data?.photo);

        const response = await axios.put(
          `${API_URL}/OrganogramRoutes/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        // reset state
        setData({
          photo: null,
          photoTitle: "",
        });

        formRef.current.reset();
        setPreview(null);

        Swal.fire({
          icon: "success",
          title: "Organogram Update",
          text: response.data.message || "Organogram updated successfully",
          confirmButtonColor: "#3085d6",
        });

        await getOrganogram();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Update failed",
        });
      }
    } else {
      const formData = new FormData();

      // Multilingual fields
      formData.append("photoTitle", data?.photoTitle || "");

      if (data?.photo) formData.append("photo", data?.photo);

      try {
        const response = await axios.post(
          `${API_URL}/OrganogramRoutes/create`,
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
          photo: null,
          photoTitle: "",
        });
        // setPreview(null);

        formRef.current.reset();
        // getAllPage(currentPage);

        Swal.fire({
          icon: "success",
          title: "Organogram Details",
          text: response.data.message || "Organogram Details Successfully.",
          confirmButtonColor: "#3085d6",
        });
        getOrganogram();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Server error",
        });
      }
    }
  };

  return (
    <>
      <div>
        <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
          <div className="custom-card card card-info card-outline mb-4">
            <div className="card-header">
              <div className="card-title"> Organogram Details</div>
            </div>

            <form
              className="needs-validation"
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="validationCustom05" className="form-label">
                      Photo
                    </label>
                    <input
                      type="file"
                      name="photo"
                      onChange={handleChange}
                      className="form-control upload-image-input"
                      id="photo"
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
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationCustom01" className="form-label">
                      Photo Title
                    </label>
                    <input
                      type="text"
                      name="photoTitle"
                      value={data?.photoTitle}
                      onChange={handleChange}
                      className="form-control"
                      id="photoTitle"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="card-footer">
                {(hasAddAccess("Organogram") ||
                  hasEditAccess("Organogram")) && (
                  <button className="btn btn-info" type="submit">
                    Save
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Organogram;
