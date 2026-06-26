import axios from "axios";
import JoditEditor from "jodit-react";
import { useMemo, useRef } from "react";
import Swal from "sweetalert2";

function DirectorForm({
  data,
  handleClose,
  setPreview,
  setData,
  isEdit,
  editId,
  setIsEdit,
  getDirector,
  preview,
  hasAddAccess,
  hasEditAccess,
}) {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const formRef = useRef();
  const editor = useRef(null);

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
    try {
      const formData = new FormData();

      formData.append("name_en", data?.name_en || "");
      formData.append("name_hi", data?.name_hi || "");
      formData.append("message_en", data?.message_en || "");
      formData.append("message_hi", data?.message_hi || "");
      formData.append("workingPeriod", data?.workingPeriod || "");
      formData.append("photoTitle", data?.photoTitle || "");
      formData.append("email", data?.email || "");
      formData.append("phone", data?.phone || "");
      formData.append("education_en", data?.education_en || "");
      formData.append("education_hi", data?.education_hi || "");
      formData.append("acting", data?.acting);
      formData.append("isActive", data?.isActive);

      if (data?.photo) {
        formData.append("photo", data?.photo);
      }

      const res = await axios.put(
        `${API_URL}/DirectorRoutes/update/${editId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        text: "Director details have been updated!",
        timer: 2000,
        showConfirmButton: false,
      });
      await getDirector();
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "Server error",
      });
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
            <div className="card-title">Director</div>
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

                <div className="col-md-6">
                  <label className="form-label">Working Period</label>
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
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={data?.email}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustomUsername"
                    aria-describedby="inputGroupPrepend"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    type="number"
                    name="phone"
                    value={data?.phone}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustomUsername"
                    aria-describedby="inputGroupPrepend"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Education (English)</label>
                  <input
                    type="text"
                    name="education_en"
                    value={data?.education_en}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustomUsername"
                    aria-describedby="inputGroupPrepend"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Education (Hindi)</label>
                  <input
                    type="text"
                    name="education_hi"
                    value={data?.education_hi}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustomUsername"
                    aria-describedby="inputGroupPrepend"
                  />
                </div>
                <div className="col-md-6">
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
                {/* <div className="col-md-6">
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
                </div> */}
                <div className="col-md-6">
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
                 <div>
                  <label className="form-label fw-bold">
                    Message (English)
                  </label>
                  <div className="custom-main-editor">
                    <JoditEditor
                      ref={editor}
                      value={data?.message_en}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          message_en: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label fw-bold">Message (Hindi)</label>
                  <div className="custom-main-editor">
                    <JoditEditor
                      ref={editor}
                      value={data?.message_hi}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          message_hi: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer">
                {(hasAddAccess("Director") || hasEditAccess("Director")) && (
                  <button className="btn btn-info" type="submit">
                    Save
                  </button>
                )}
              </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DirectorForm;
