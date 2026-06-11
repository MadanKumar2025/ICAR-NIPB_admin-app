import axios from "axios";
import JoditEditor from "jodit-react";
import { useMemo, useRef } from "react";
import Swal from "sweetalert2";

function CommitteesForm({
  data,
  setData,
  handleClose,
  isEdit,
  getCommittees,
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
          content_en: data?.content_en || "",
          content_hi: data?.content_hi || "",
          type_en: data?.type_en || "",
          type_hi: data?.type_hi || "",
          isActive: data?.isActive,
        };

        const res = await axios.put(
          `${API_URL}/CommitteesRoutes/update/${editId}`,
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
        await getCommittees();
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
        console.log("data", data);

        const payload = {
          content_en: data?.content_en || "",
          content_hi: data?.content_hi || "",
          type_en: data?.type_en || "",
          type_hi: data?.type_hi || "",
          isActive: data?.isActive,
        };
        const response = await axios.post(
          `${API_URL}/CommitteesRoutes/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        await getCommittees();
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

  const config = useMemo(
    () => ({
      readonly: false,
      showPoweredBy: false,
      placeholder: "",
    }),
    [],
  );

 
  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Committees</div>
          </div>

          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Type (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="type_en"
                      value={data?.type_en}
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
                    Type (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="type_hi"
                      value={data?.type_hi}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label fw-bold">
                    Content (English)
                  </label>
                  <div className="custom-main-editor">
                    <JoditEditor
                      ref={editor}
                      value={data?.content_en}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          content_en: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label fw-bold">Content (Hindi)</label>
                  <div className="custom-main-editor">
                    <JoditEditor
                      ref={editor}
                      value={data?.content_hi}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          content_hi: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
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

export default CommitteesForm;
