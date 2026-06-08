import axios from "axios";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import Swal from "sweetalert2";

function PatentsForm({
  data,
  setData,
  handleClose,
  isEdit,
  getPatents,
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
          type_en: data?.type_en?.trim(),
          type_hi: data?.type_hi?.trim(),
          title_en: data?.title_en?.trim(),
          title_hi: data?.title_hi?.trim(),
          isActive: data?.isActive ?? true,
        };

        const res = await axios.put(
          `${API_URL}/PatentsRoutes/update/${editId}`,
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
        await getPatents();
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
          type_en: data?.type_en?.trim(),
          type_hi: data?.type_hi?.trim(),
          title_en: data?.title_en?.trim(),
          title_hi: data?.title_hi?.trim(),
          isActive: data?.isActive ?? true,
        };

        const response = await axios.post(
          `${API_URL}/PatentsRoutes/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        await getPatents();
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

  // console.log("data",data);

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Patents</div>
          </div>

          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="validationCustom01" className="form-label">
                    Type (English)
                  </label>
                  <select
                    name="type_en"
                    value={data?.type_en}
                    onChange={handleChange}
                    className="form-control"
                    id="type_en"
                  >
                    <option value="">select</option>
                    <option value="Patents Obtained">Patents obtained</option>
                    <option value="Patent Applications Filed">
                      Patent applications filed
                    </option>
                  </select>
                </div>
                <div className="col-sm-6">
                  <label htmlFor="validationCustom01" className="form-label">
                    Type (Hindi)
                  </label>
                  <select
                    name="type_hi"
                    value={data?.type_hi}
                    onChange={handleChange}
                    className="form-control"
                    id="type_en"
                  >
                    <option value="">select</option>
                    <option value="प्राप्त पेटेंट">
                      प्राप्त पेटेंट/अर्जित पेटेंट
                    </option>
                    <option value="प्रस्तुत किए गए पेटेंट आवेदन">
                      प्रस्तुत किए गए पेटेंट आवेदन
                    </option>
                  </select>
                </div>
                <div className="col-sm-6">
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
                <div></div>
                <div>
                  <label className="form-label fw-bold">Title (English)</label>
                  <div className="custom-main-editor">
                  <JoditEditor
                    style={{ width: "90%" }}
                    ref={editor}
                    value={data?.title_en}
                    config={{
                      showPoweredBy: false,
                      placeholder: "",
                      askBeforePasteHTML: false,
                      askBeforePasteFromWord: false,
                    }}
                    onBlur={(newContent) => {
                      setData((prev) => ({
                        ...prev,
                        title_en: newContent,
                      }));
                    }}
                  />
                  </div>
                  {/* <JoditEditor
                    style={{ width: "90%" }}
                    ref={editor}
                    value={data.title_en}
                    onChange={(newContent) =>
                      setData({
                        ...data,
                        title_en: newContent,
                      })
                    }
                  /> */}
                </div>
                <div>
                  <label className="form-label fw-bold">Title (Hindi)</label>
                  <div className="custom-main-editor">
                  <JoditEditor
                    style={{ width: "90%" }}
                    ref={editor}
                    value={data?.title_hi}
                    config={{
                      showPoweredBy: false,
                      placeholder: "",
                      askBeforePasteHTML: false,
                      askBeforePasteFromWord: false,
                    }}
                    onBlur={(newContent) => {
                      setData((prev) => ({
                        ...prev,
                        title_hi: newContent,
                      }));
                    }}
                  />
                  </div>
                  {/* <JoditEditor
                    style={{ width: "90%" }}
                    ref={editor}
                    value={data.title_hi}
                    onChange={(newContent) =>
                      setData({
                        ...data,
                        title_hi: newContent,
                      })
                    }
                  /> */}
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

export default PatentsForm;
