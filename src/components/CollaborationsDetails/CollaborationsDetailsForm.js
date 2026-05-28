import axios from "axios";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

function CollaborationsDetailsForm({
  data,
  setData,
  handleClose,
  isEdit,
  getCollaborationsDetails,
  setIsEdit,
  editId,
  setPreview,
  preview,
}) {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const formRef = useRef();
  const editor = useRef(null);
  const { id } = useParams();

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
          subTitle_en: data?.subTitle_en || "",
          subTitle_hi: data?.subTitle_hi || "",
          CollaborationsId: id,
          isActive: data?.isActive,
        };

        const res = await axios.put(
          `${API_URL}/CollaborationsDetailsRoutes/update/${editId}`,
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

          setData({
            subTitle_en: "",
            subTitle_hi: "",
            isActive: true,
          });

          setIsEdit(false);
          await getCollaborationsDetails();
          handleClose();
        }
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
          subTitle_en: data?.subTitle_en || "",
          subTitle_hi: data?.subTitle_hi || "",
          CollaborationsId: id,
          isActive: data?.isActive,
        };

        const response = await axios.post(
          `${API_URL}/CollaborationsDetailsRoutes/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setData({
          subTitle_en: "",
          subTitle_hi: "",
          isActive: true,
        });

        await getCollaborationsDetails();
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
            <div className="card-title">Collaborations Details</div>
          </div>

          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    sub-Title (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="subTitle_en"
                      value={data?.subTitle_en}
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
                    sub-Title (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="subTitle_hi"
                      value={data?.subTitle_hi}
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

export default CollaborationsDetailsForm;
