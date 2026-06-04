import axios from "axios";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import Swal from "sweetalert2";

function ContractualStaffForm({
  data,
  setData,
  handleClose,
  isEdit,
  getContractualStaff,
  setIsEdit,
  editId,
  setPreview,
  preview,
}) {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const formRef = useRef();
  const editor = useRef(null);

  const handleChange = (e) => {
    const { name, type, value, files, checked } = e.target;

    if (type === "file" && files?.length > 0) {
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
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      try {
        const formData = new FormData();

        console.log("data", data);

        formData.append("name_en", data?.name_en || "");
        formData.append("name_hi", data?.name_hi || "");
        formData.append("position_en", data?.position_en || "");
        formData.append("position_hi", data?.position_hi || "");
        formData.append(
          "associatedLabDivision_en",
          data?.associatedLabDivision_en || "",
        );
        formData.append(
          "associatedLabDivision_hi",
          data?.associatedLabDivision_hi || "",
        );
        formData.append("contactNumber", data?.contactNumber || "");
        formData.append("email", data?.email || "");
        formData.append("photoTitle", data?.photoTitle || "");
        formData.append("isActive", data?.isActive);

        if (data?.photo) {
          formData.append("photo", data?.photo);
        }

        const res = await axios.put(
          `${API_URL}/ContractualStaffRoutes/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setIsEdit(false);
        await getContractualStaff();
        handleClose();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error || "Server error",
        });
      }
    } else {
      const formData = new FormData();

      formData.append("name_en", data?.name_en || "");
      formData.append("name_hi", data?.name_hi || "");
      formData.append("position_en", data?.position_en || "");
      formData.append("position_hi", data?.position_hi || "");
      formData.append(
        "associatedLabDivision_en",
        data?.associatedLabDivision_en || "",
      );
      formData.append(
        "associatedLabDivision_hi",
        data?.associatedLabDivision_hi || "",
      );
      formData.append("contactNumber", data?.contactNumber || "");
      formData.append("email", data?.email || "");
      formData.append("photoTitle", data?.photoTitle || "");
      formData.append("isActive", data?.isActive);

      if (data?.photo) {
        formData.append("photo", data?.photo);
      }

      try {
        const response = await axios.post(
          `${API_URL}/ContractualStaffRoutes/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        await getContractualStaff();
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

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Contractual Staff</div>
          </div>

          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Name (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="name_en"
                      value={data?.name_en}
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
                    Name (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="name_hi"
                      value={data?.name_hi}
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
                    Position (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="position_en"
                      value={data?.position_en}
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
                    Position (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="position_hi"
                      value={data?.position_hi}
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
                    Associated Lab/Division (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="associatedLabDivision_en"
                      value={data?.associatedLabDivision_en}
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
                    Associated Lab/Division (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="associatedLabDivision_hi"
                      value={data?.associatedLabDivision_hi}
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
                    Contact Number
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="number"
                      name="contactNumber"
                      value={data?.contactNumber}
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
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    photo Title
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="photoTitle"
                      value={data?.photoTitle}
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
                    Photo
                  </label>

                  <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    className="form-control upload-image-input"
                    id="validationCustom03"
                  />
                  {preview && (
                    <a href={preview} target="_blank" rel="noreferrer">
                      View Document
                    </a>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Is Active</label>
                  <select
                    name="isActive"
                    value={data.isActive}
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

export default ContractualStaffForm;
