import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";

function InstitutionalProjectsForm({
  data,
  setData,
  handleClose,
  isEdit,
  getInstitutionalProjects,
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
      console.log("isActive:", data?.isActive);
      
      try {
        const payload = {
          mainProject_en: data?.mainProject_en,
          mainProject_hi: data?.mainProject_hi || "",
          groupLeader_en: data?.groupLeader_en || "",
          groupLeader_hi: data?.groupLeader_hi || "",
          isActive: data?.isActive,
        };
        const res = await axios.put(
          `${API_URL}/institutionalProjects/update/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("res",res);
        
        setIsEdit(false);

        await getInstitutionalProjects();
        handleClose();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error || "Server error",
        });
      }
    } else {
      try {
        const response = await axios.post(
          `${API_URL}/institutionalProjects/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        await getInstitutionalProjects();
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
        <div className="card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Institutional Projects</div>
          </div>

          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Main Project (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="mainProject_en"
                      value={data?.mainProject_en}
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
                    Main Project (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="mainProject_hi"
                      value={data?.mainProject_hi}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Group Leader (English)</label>
                  <input
                    type="text"
                    name="groupLeader_en"
                    value={data?.groupLeader_en}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Group Leader (Hindi)</label>
                  <input
                    type="text"
                    name="groupLeader_hi"
                    value={data?.groupLeader_hi}
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

export default InstitutionalProjectsForm;
