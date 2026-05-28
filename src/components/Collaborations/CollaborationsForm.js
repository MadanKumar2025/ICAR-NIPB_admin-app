import axios from "axios";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import Swal from "sweetalert2";

function CollaborationsForm({
  data,
  setData,
  handleClose,
  isEdit,
  getCollaborations,
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
        const payload = {
          title_en: data?.title_en || "",
          title_hi: data?.title_hi || "",
          isActive: data?.isActive,
        };

        const res = await axios.put(
          `${API_URL}/CollaborationsRoutes/updateCollaborations/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (res?.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Updated",
            text: res?.data?.message || "Updated successfully",
          });
        }

        setIsEdit(false);
        await getCollaborations();
        handleClose();
      } catch (error) {
        console.log("API ERROR:", error?.response?.data || error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error?.response?.data?.message || error?.message || "Server error",
        });
      }
    } else {
      try {
        const response = await axios.post(
          `${API_URL}/CollaborationsRoutes/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        await getCollaborations();
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

  console.log("data", data);

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Collaborations</div>
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
                      required
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

export default CollaborationsForm;
