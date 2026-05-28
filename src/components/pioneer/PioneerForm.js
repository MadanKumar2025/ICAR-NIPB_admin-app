import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";

function PioneerForm({
  data,
  handleClose,
  setPreview,
  setData,
  isEdit,
  editId,
  setIsEdit,
  getpioneer,
  preview,
}) {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const formRef = useRef();

  const handleChange = (e) => {
    const { name, type, files } = e.target;

    if (type === "file" && files.length > 0) {
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
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      try {
        const formData = new FormData();

        formData.append("title_en", data?.title_en || "");
        formData.append("title_hi", data?.title_hi || "");
        formData.append("url", data?.url || "");
        formData.append("photoTitle", data?.photoTitle || "");

        formData.append("isActive", data?.isActive);

        if (data?.photo) {
          formData.append("photo", data?.photo);
        }

        const res = await axios.put(
          `${API_URL}/pioneerRoutes/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setIsEdit(false);
        setPreview(null);
        handleClose();

        await getpioneer();
      } catch (error) {
        console.error("Update failed:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error || "Server error",
        });
      }
    } else {
      const formData = new FormData();

      console.log("data",data);
      
      formData.append("title_en", data?.title_en || "");
      formData.append("title_hi", data?.title_hi || "");
      formData.append("url", data?.url || "");
      formData.append("photoTitle", data?.photoTitle || "");

      formData.append("photo", data?.photo || "");
      formData.append("isActive", data?.isActive);

      try {
        const response = await axios.post(
          `${API_URL}/pioneerRoutes/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        handleClose();
        setPreview(null);

        formRef.current.reset();
        await getpioneer();
      } catch (error) {
        Swal.fire({
          toast: true,
          position: "top",
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
            <div className="card-title">pioneer</div>
          </div>

          <form
            className="needs-validation"
            ref={formRef}
            onSubmit={handleSubmit}
          >
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
                      id="title_en"
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
                      id="title_hi"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Link</label>
                  <input
                    type="text"
                    name="url"
                    value={data?.url}
                    onChange={handleChange}
                    className="form-control"
                    id="url"
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
                <div className="col-md-6">
                  <label className="form-label">Photo-Title</label>
                  <input
                    type="text"
                    name="photoTitle"
                    value={data?.photoTitle}
                    onChange={handleChange}
                    className="form-control"
                    id="photoTitle"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Photo</label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    className="form-control"
                    id="photo"
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        marginTop: "10px",
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  )}
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

export default PioneerForm;
