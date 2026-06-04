import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";

function PopupForm({
  data,
  handleClose,
  setPreview,
  setData,
  isEdit,
  editId,
  setIsEdit,
  getPopup,
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

        formData.append("title", data?.title || "");
        formData.append("url", data?.url || "");
        formData.append("startTime", data?.startTime || "");
        formData.append("endTime", data?.endTime || "");
        formData.append("photoTitle", data?.photoTitle || "");

        if (data?.photo) {
          formData.append("photo", data?.photo);
        }

        formData.append("isActive", data?.isActive);

        const res = await axios.put(
          `${API_URL}/PopupRoutes/updatePopup/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setIsEdit(false);
        setPreview(null);
        handleClose();

        await getPopup();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error || "Server error",
        });
      }
    } else {
      const formData = new FormData();

      formData.append("title", data?.title || "");
      formData.append("url", data?.url || "");
      formData.append("startTime", data?.startTime || "");
      formData.append("endTime", data?.endTime || "");
      formData.append("photoTitle", data?.photoTitle || "");

      if (data?.photo) {
        formData.append("photo", data?.photo);
      }

      formData.append("isActive", data?.isActive);

      try {
        const response = await axios.post(
          `${API_URL}/PopupRoutes/create`,
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
          photoTitle: "",
          url: "",
          startTime: "",
          endTime: "",
          photo: null,
          isActive: true,
        });

        handleClose();
        setPreview(null);

        formRef.current.reset();
        await getPopup();
      } catch (error) {
        console.log("error", error);

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
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Popup</div>
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
                    Title
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="title"
                      value={data?.title}
                      onChange={handleChange}
                      className="form-control"
                      id="title"
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
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    name="startTime"
                    value={data?.startTime}
                    onChange={handleChange}
                    className="form-control"
                    id="startTime"
                     required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    name="endTime"
                    value={data?.endTime}
                    onChange={handleChange}
                    className="form-control"
                    id="endTime"
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

export default PopupForm;
