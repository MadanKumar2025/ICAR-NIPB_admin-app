import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

function VigilanceOfficerForm({
  data,
  setData,
  setPreview,
  isEdit,
  editId,
  getvigilanceOfficer,
  setAllVigilanceOfficer,
  preview,
  handleClose,
}) {
  const [designation, setDesignation] = useState([]);

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
        formData.append("type_en", data?.type_en || "");
        formData.append("type_hi", data?.type_hi || "");
        formData.append("number", data?.number || "");
        formData.append("email", data?.email || "");
        formData.append("designationId", data?.designationId || "");
        formData.append("photoTitle", data?.photoTitle || "");
        formData.append("isActive", data?.isActive);
        if (data?.photo) {
          formData.append("photo", data?.photo);
        }
        const res = await axios.put(
          `${API_URL}/VigilanceOfficerRoutes/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        setData({
          name_en: "",
          name_hi: "",
          type_en: "",
          type_hi: "",
          number: "",
          email: "",
          designationId: "",
          photoTitle: "",
          photo: null,
          isActive: true,
        });
        setPreview(null);
        formRef.current.reset();
        await getvigilanceOfficer();
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

      formData.append("name_en", data?.name_en || "");
      formData.append("name_hi", data?.name_hi || "");
      formData.append("type_en", data?.type_en || "");
      formData.append("type_hi", data?.type_hi || "");
      formData.append("number", data?.number || "");
      formData.append("email", data?.email || "");
      formData.append("designationId", data?.designationId || "");
      formData.append("photoTitle", data?.photoTitle || "");
      formData.append("isActive", data?.isActive);
      if (data?.photo) {
        formData.append("photo", data?.photo);
      }

      try {
        const response = await axios.post(
          `${API_URL}/VigilanceOfficerRoutes/create`,
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
          type_en: "",
          type_hi: "",
          number: "",
          email: "",
          designationId: "",
          photoTitle: "",
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
        setAllVigilanceOfficer(response?.data?.data);
        await getvigilanceOfficer();
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
            <div className="card-title">Vigilance Officer</div>
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
                    Type (English)
                  </label>
                  <select
                    name="type_en"
                    value={data?.type_en}
                    onChange={handleChange}
                    className="form-control"
                    id="type_en"
                  >
                    <option value="">select</option>
                    <option value="vigilanceOfficer">vigilance officer</option>
                    <option value="TransparencyOfficer">
                      Transparency officer
                    </option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom01" className="form-label">
                    Type (Hindi)
                  </label>
                  <select
                    name="type_hi"
                    value={data?.type_hi}
                    onChange={handleChange}
                    className="form-control"
                    id="type_en"
                  >
                    <option value="">select</option>
                    <option value="सतर्कता अधिकारी">सतर्कता अधिकारी</option>
                    <option value="पारदर्शिता अधिकारी">
                      पारदर्शिता अधिकारी
                    </option>
                  </select>
                </div>
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
                    Number
                  </label>
                  <input
                    type="number"
                    name="number"
                    value={data?.number}
                    onChange={handleChange}
                    className="form-control"
                    id="number"
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
                        <option key={index} value={item?.id}>
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

export default VigilanceOfficerForm;
