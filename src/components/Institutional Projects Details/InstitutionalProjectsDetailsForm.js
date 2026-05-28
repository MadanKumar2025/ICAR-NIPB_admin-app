import axios from "axios";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

function InstitutionalProjectsDetailsForm({
  data,
  setData,
  handleClose,
  isEdit,
  getInstitutionalProjectsDetails,
  setIsEdit,
  editId,
}) {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const formRef = useRef();
  const { id } = useParams();

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
          institutionalProjectID: id,
          subProjects_en: data?.subProjects_en || "",
          subProjects_hi: data?.subProjects_hi || "",
          principalInvestigators_en: data?.principalInvestigators_en || "",
          principalInvestigators_hi: data?.principalInvestigators_hi || "",
          isActive: data?.isActive ?? true,
        };

        const res = await axios.put(
          `${API_URL}/institutionalProjectsDetailsRoutes/update/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setIsEdit(false);

        await getInstitutionalProjectsDetails();
        handleClose();

        setData({
          subProjects_en: "",
          subProjects_hi: "",
          principalInvestigators_en: "",
          principalInvestigators_hi: "",
          isActive: true,
        });
      } catch (error) {
        console.log("Update Error:", error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Server error",
        });
      }
    } else {
      const p = {
        institutionalProjectID: id,
        subProjects_en: data?.subProjects_en || "",
        subProjects_hi: data?.subProjects_hi || "",
        principalInvestigators_en: data?.principalInvestigators_en || "",
        principalInvestigators_hi: data?.principalInvestigators_hi || "",
        isActive: data?.isActive ?? true,
      };

      try {
        const response = await axios.post(
          `${API_URL}/institutionalProjectsDetailsRoutes/create`,
          p,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setData({
          subProjects_en: "",
          subProjects_hi: "",
          principalInvestigators_en: "",
          principalInvestigators_hi: "",
          isActive: true,
        });

        await getInstitutionalProjectsDetails();
      } catch (error) {
        console.log("Error:", error);

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
        <div className="card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Institutional Projects Details </div>
          </div>

          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Sub Projects (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="subProjects_en"
                      value={data?.subProjects_en}
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
                    Sub Projects (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="subProjects_hi"
                      value={data?.subProjects_hi}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Principal Investigators (English)
                  </label>
                  <input
                    type="text"
                    name="principalInvestigators_en"
                    value={data?.principalInvestigators_en}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Principal Investigators (Hindi)
                  </label>
                  <input
                    type="text"
                    name="principalInvestigators_hi"
                    value={data?.principalInvestigators_hi}
                    onChange={handleChange}
                    className="form-control"
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
              {/* <div className="card-footer">
                <button className="btn btn-info" onClick={handleClose}>
                  Close
                </button>
              </div> */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default InstitutionalProjectsDetailsForm;
