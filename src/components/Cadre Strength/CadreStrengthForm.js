import axios from "axios";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import Swal from "sweetalert2";

function CadreStrengthForm({
  data,
  setData,
  handleClose,
  isEdit,
  getcadreStrength,
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
          staff_en: data?.staff_en?.trim(),
          staff_hi: data?.staff_hi?.trim(),
          sanctionedStrength: Number(data?.sanctionedStrength),
          filled: Number(data?.filled),
          vacant: Number(data?.vacant),
          isActive: data?.isActive ?? true,
        };

        console.log(payload);

        const res = await axios.put(
          `${API_URL}/CadreStrengthRoutes/update/${editId}`,
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
        await getcadreStrength();
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
        const payload = {
          staff_en: data?.staff_en?.trim(),
          staff_hi: data?.staff_hi?.trim(),
          sanctionedStrength: Number(data?.sanctionedStrength),
          filled: Number(data?.filled),
          vacant: Number(data?.vacant),
          isActive: data?.isActive ?? true,
        };

        const response = await axios.post(
          `${API_URL}/CadreStrengthRoutes/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("response", response);

        await getcadreStrength();
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
            <div className="card-title">Cadre Strength</div>
          </div>

          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Staff (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="staff_en"
                      value={data?.staff_en}
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
                    Staff (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="staff_hi"
                      value={data?.staff_hi}
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
                    Sanctioned strength
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="number"
                      name="sanctionedStrength"
                      value={data?.sanctionedStrength}
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
                    Filled
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="number"
                      name="filled"
                      value={data?.filled}
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
                    Vacant
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="number"
                      name="vacant"
                      value={data?.vacant}
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

export default CadreStrengthForm;
