import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";

function TechnologiesDevelopedForm({
  data,
  setData,
  handleClose,
  isEdit,
  getTechnologiesDeveloped,
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
          `${API_URL}/technologiesDeveloped/update/${editId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("res", res);
        setIsEdit(false);
        setData({
          nameOfOtherParty_en: "",
          nameOfOtherParty_hi: "",
          collaboratingInstituteICAR_en: "",
          collaboratingInstituteICAR_hi: "",
          nameOfTechnology_en: "",
          nameOfTechnology_hi: "",
          mouDate: new Date(),
          duration: "",
          isActive: true,
        });
        await getTechnologiesDeveloped();
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
          `${API_URL}/technologiesDeveloped/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setData({
          nameOfOtherParty_en: "",
          nameOfOtherParty_hi: "",
          collaboratingInstituteICAR_en: "",
          collaboratingInstituteICAR_hi: "",
          nameOfTechnology_en: "",
          nameOfTechnology_hi: "",
          mouDate: new Date(),
          duration: "",
          isActive: true,
        });

        await getTechnologiesDeveloped();
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
            <div className="card-title">Technologies developed</div>
          </div>

          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Name of other party (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="nameOfOtherParty_en"
                      value={data?.nameOfOtherParty_en}
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
                    Name of other party (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="nameOfOtherParty_hi"
                      value={data?.nameOfOtherParty_hi}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Name of Collaborating Institute of ICAR (English)
                  </label>
                  <input
                    type="text"
                    name="collaboratingInstituteICAR_en"
                    value={data?.collaboratingInstituteICAR_en}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Name of Collaborating Institute of ICAR (Hindi)
                  </label>
                  <input
                    type="text"
                    name="collaboratingInstituteICAR_hi"
                    value={data?.collaboratingInstituteICAR_hi}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Name of Technology (English)
                  </label>
                  <input
                    type="text"
                    name="nameOfTechnology_en"
                    value={data?.nameOfTechnology_en}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Name of Technology (Hindi)
                  </label>
                  <input
                    type="text"
                    name="nameOfTechnology_hi"
                    value={data?.nameOfTechnology_hi}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">MoU Date</label>
                  <input
                    type="date"
                    name="mouDate"
                    value={data?.mouDate}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={data?.duration}
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

export default TechnologiesDevelopedForm;
