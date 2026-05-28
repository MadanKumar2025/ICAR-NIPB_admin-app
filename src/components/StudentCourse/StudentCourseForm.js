import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";

function StudentCourseForm({
  data,
  setData,
  handleClose,
  isEdit,
  getStudentCourse,
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
      try {
        const payload = {
          courseName_en: data?.courseName_en,
          courseName_hi: data?.courseName_hi || null,
          semester_en: data?.semester_en || "",
          semester_hi: data?.semester_hi || "",
          isActive: data?.isActive,
        };
        const res = await axios.put(
          `${API_URL}/StudentCourse/update/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setIsEdit(false);
        setData({
          courseName_en: "",
          courseName_hi: "",
          semester_en: "",
          semester_hi: "",
          isActive: true,
        });
        await getStudentCourse();
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
          `${API_URL}/StudentCourse/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setData({
          courseName_en: "",
          courseName_hi: "",
          semester_en: "",
          semester_hi: "",
          isActive: true,
        });

        await getStudentCourse();
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
            <div className="card-title">Student Course</div>
          </div>

          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Course Name (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="courseName_en"
                      value={data?.courseName_en}
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
                    Course Name (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="courseName_hi"
                      value={data?.courseName_hi}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Semester (English)</label>
                  <input
                    type="text"
                    name="semester_en"
                    value={data?.semester_en}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Semester (Hindi)</label>
                  <input
                    type="text"
                    name="semester_hi"
                    value={data?.semester_hi}
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

export default StudentCourseForm;
