import axios from "axios";
import JoditEditor from "jodit-react";
import { useMemo, useRef } from "react";
import Swal from "sweetalert2";

function TrainingProgramForm({
  data,
  setData,
  isEdit,
  editId,
  getTrainingProgram,
  setTrainingProgram,
  handleClose,
}) {
  const API_URL = process.env.REACT_APP_API_URL;

  const formRef = useRef();
  const editor = useRef(null);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, type, files } = e.target;

    if (type === "file" && files.length > 0) {
      const file = files[0];

      setData((prev) => ({
        ...prev,
        [name]: file,
      }));

      const fileURL = URL.createObjectURL(file);
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
        const res = await axios.put(
          `${API_URL}/TrainingProgramRoutes/update/${editId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        await getTrainingProgram();
        handleClose();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Update failed",
        });
      }
    } else {
      try {
        const response = await axios.post(
          `${API_URL}/TrainingProgramRoutes/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        Swal.fire({
          icon: "success",
          title: "Training Program",
          text:
            response.data.message || "Training Program create Successfully.",
          confirmButtonColor: "#3085d6",
        });

        setTrainingProgram(response?.data?.data);
        await getTrainingProgram();
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
            <div className="card-title">Training Program</div>
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
                    Title (English)
                  </label>
                  <input
                    type="text"
                    name="title_en"
                    value={data?.title_en}
                    onChange={handleChange}
                    className="form-control"
                    id="title_en"
                  />
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
                <div className="row g-3">
                  <div></div>
                  <label className="form-label fw-bold">
                    Description (English)
                  </label>
                  <div className="custom-main-editor">
                    <JoditEditor
                      ref={editor}
                      value={data.description_en}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          description_en: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                </div>
                <div className="row g-3">
                  <div></div>
                  <label className="form-label fw-bold">
                    Description (Hindi)
                  </label>
                  <div className="custom-main-editor">
                    <JoditEditor
                      ref={editor}
                      value={data.description_hi}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          description_hi: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
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

export default TrainingProgramForm;
