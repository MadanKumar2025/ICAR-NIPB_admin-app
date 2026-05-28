import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";

function DocumentUploaderForm({
  data,
  setData,
  isEdit,
  editId,
  getDocument,
  handleClose,
  setIsEdit = { setIsEdit },
  setPreview,
  preview,
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
        const formData = new FormData();
        formData.append("title", data?.title || "");

        if (data.documentFile) {
          formData.append("documentFile", data?.documentFile);
        }
        const res = await axios.put(
          `${API_URL}/DocumentUploaderRoutes/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        setData({
          title: "",
          documentFile: "",
        });
        setPreview(null);
        formRef.current.reset();
        await getDocument();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Update failed",
        });
      }
    } else {
      const formData = new FormData();
      formData.append("title", data?.title || "");

      if (data.documentFile) {
        formData.append("documentFile", data?.documentFile);
      }

      try {
        const response = await axios.post(
          `${API_URL}/DocumentUploaderRoutes/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        console.log("response", response);

        setData({
          title: "",
          documentFile: "",
        });
        setPreview(null);

        formRef.current.reset();

        await getDocument();
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
            <div className="card-title">Document Uploader </div>
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
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={data?.title}
                    onChange={handleChange}
                    className="form-control"
                    id="title"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Document / Photo
                  </label>

                  <input
                    type="file"
                    name="documentFile"
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                  />
                  {preview && (
                    <a href={preview} target="_blank" rel="noreferrer">
                      View Document
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div className="card-footer">
                <button className="btn btn-info" type="submit">
                  {isEdit ? "Update" : "Save"}
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

export default DocumentUploaderForm;
