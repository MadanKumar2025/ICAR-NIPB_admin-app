import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";

function PreviousDirectorForm({
  data,
  handleClose,
  setPreview,
  setData,
  isEdit,
  editId,
  setIsEdit,
  getPreviousDirector,
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

        formData.append("name_en", data?.name_en || "");
        formData.append("name_hi", data?.name_hi || "");
        formData.append("workingPeriod", data?.workingPeriod || "");
        formData.append("photoTitle", data?.photoTitle || "");
        formData.append("displayOrderNumber", data?.displayOrderNumber || "");
        formData.append("acting", data?.acting);
        formData.append("isActive", data?.isActive);

        if (data?.photo) {
          formData.append("photo", data?.photo);
        }

        const res = await axios.put(
          `${API_URL}/PreviousDirector/update/${editId}`,
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

        await getPreviousDirector();
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

      formData.append("name_en", data?.name_en || "");
      formData.append("name_hi", data?.name_hi || "");
      formData.append("workingPeriod", data?.workingPeriod || "");
      formData.append("photo", data?.photo || "");
      formData.append("photoTitle", data?.photoTitle || "");
      formData.append("displayOrderNumber", data?.displayOrderNumber || "");
      formData.append("acting", data?.acting || true);
      formData.append("isActive", data?.isActive);

      try {
        const response = await axios.post(
          `${API_URL}/PreviousDirector/create`,
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
        await getPreviousDirector();
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
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Previous Director</div>
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
                    Name (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="name_en"
                      value={data?.name_en}
                      onChange={handleChange}
                      className="form-control"
                      id="validationCustomUsername"
                      aria-describedby="inputGroupPrepend"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Name (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="name_hi"
                      value={data?.name_hi}
                      onChange={handleChange}
                      className="form-control"
                      id="validationCustomUsername"
                      aria-describedby="inputGroupPrepend"
                      required
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <label className="form-label">working Period</label>
                  <input
                    type="text"
                    name="workingPeriod"
                    value={data?.workingPeriod}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustomUsername"
                    aria-describedby="inputGroupPrepend"
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Display Order Number</label>
                  <input
                    type="number"
                    name="displayOrderNumber"
                    value={data?.displayOrderNumber}
                    onChange={handleChange}
                    className="form-control"
                    id="displayOrderNumber"
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Photo Title</label>
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
                    className="form-control upload-image-input"
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

                <div className="col-sm-6">
                  <label className="form-label">Acting</label>
                  <select
                    name="acting"
                    value={data?.acting}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value={true}>Acting</option>
                    <option value={false}>InActing</option>
                  </select>
                </div>
                <div className="col-sm-6">
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

export default PreviousDirectorForm;
