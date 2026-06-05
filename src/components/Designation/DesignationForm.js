import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";

function DesignationForm({
  data,
  setData,
  isEdit,
  editId,
  getDesignation,
  handleClose,
  setIsEdit = { setIsEdit },
}) {
  const API_URL = process.env.REACT_APP_API_URL;

  const formRef = useRef();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, type, value, files, checked } = e.target;

    setData((prev) => ({
      ...prev,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      try {
        const payload = {
          name_en: data?.name_en,
          name_hi: data?.name_hi || null,
          isActive: data?.isActive,
        };

        const res = await axios.put(
          `${API_URL}/designation/update/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setIsEdit(false);
        setData({
          name_en: "",
          name_hi: "",
          isActive: true,
        });

        await getDesignation();
        handleClose();
      } catch (error) {
        console.error("Update failed:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error || "Server error",
        });
      }
    } else {
      try {
        const response = await axios.post(
          `${API_URL}/designation/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setData({
          name_en: "",
          name_hi: "",
          isActive: true,
        });

        await getDesignation();
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
            <div className="card-title">Designation</div>
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
                    id="staffName_en"
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
                    id="staffName_hi"
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
            <div className="card-footer d-flex">
              <button className="btn btn-info" type="submit">
                {/* {isEdit ? "Update User" : "Submit form"} */}
                {isEdit ? "Update" : "Save"}
                {/* Save */}
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

export default DesignationForm;
