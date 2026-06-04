import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";

function ExternallyFundedProjectsForm({
  data,
  setData,
  handleClose,
  isEdit,
  getExternallyFundedProjects,
  setIsEdit,
  editId,
}) {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const formRef = useRef();

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
          title_en: data?.title_en,
          title_hi: data?.title_hi || null,
          fundingAgency_en: data?.fundingAgency_en || "",
          fundingAgency_hi: data?.fundingAgency_hi || "",
          sanctionedBudget_en: data?.sanctionedBudget_en || "",
          sanctionedBudget_hi: data?.sanctionedBudget_hi || "",
          principalInvestigator_en: data?.principalInvestigator_en || "",
          principalInvestigator_hi: data?.principalInvestigator_hi || "",
          isActive: data?.isActive,
        };
        const res = await axios.put(
          `${API_URL}/externallyFundedProject/updateExternallyFP/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("res", res);
        setIsEdit(false);
        setData({
          title_en: "",
          title_hi: "",
          fundingAgency_en: "",
          fundingAgency_hi: "",
          sanctionedBudget_en: "",
          sanctionedBudget_hi: "",
          principalInvestigator_en: "",
          principalInvestigator_hi: "",
          isActive: true,
        });
        await getExternallyFundedProjects();
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
          `${API_URL}/externallyFundedProject/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setData({
          title_en: "",
          title_hi: "",
          fundingAgency_en: "",
          fundingAgency_hi: "",
          sanctionedBudget_en: "",
          sanctionedBudget_hi: "",
          principalInvestigator_en: "",
          principalInvestigator_hi: "",
          isActive: true,
        });

        await getExternallyFundedProjects();
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
            <div className="card-title">Externally Funded Projects</div>
          </div>

          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Title (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="title_en"
                      value={data?.title_en}
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
                    Title (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="title_hi"
                      value={data?.title_hi}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Funding Agency (English)</label>
                  <input
                    type="text"
                    name="fundingAgency_en"
                    value={data?.fundingAgency_en}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Funding Agency (Hindi)</label>
                  <input
                    type="text"
                    name="fundingAgency_hi"
                    value={data?.fundingAgency_hi}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Sanctioned Budget (English)
                  </label>
                  <input
                    type="text"
                    name="sanctionedBudget_en"
                    value={data?.sanctionedBudget_en}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Sanctioned Budget (Hindi)
                  </label>
                  <input
                    type="text"
                    name="sanctionedBudget_hi"
                    value={data?.sanctionedBudget_hi}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    principal Investigator (English)
                  </label>
                  <input
                    type="text"
                    name="principalInvestigator_en"
                    value={data?.principalInvestigator_en}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    principal Investigator (Hindi)
                  </label>
                  <input
                    type="text"
                    name="principalInvestigator_hi"
                    value={data?.principalInvestigator_hi}
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

export default ExternallyFundedProjectsForm;
