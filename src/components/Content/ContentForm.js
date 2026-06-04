import axios from "axios";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

function ContentForm({
  data,
  setData,
  isEdit,
  editId,
  getContent,
  setIsEdit = { setIsEdit },
  setPreview,
  preview,
  hasAddAccess,
  hasEditAccess
}) {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const editor = useRef(null);
  const formRef = useRef();
  const token = localStorage.getItem("token");
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, type, value, files, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      try {
        const payload = {
          content_en: data?.content_en,
          content_hi: data?.content_hi || "",
          pageId: id,
        };
        const res = await axios.put(
          `${API_URL}/ContentRoutes/update/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        Swal.fire({
          icon: "success",
          title: "Success",
          text: res?.data?.message || "Update successful",
        });
        setData({
          content_en: "",
          content_hi: "",
        });
        setPreview(null);
        formRef.current.reset();
        getContent();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Update failed",
        });
      }
    } else {
      const payload = {
        content_en: data?.content_en,
        content_hi: data?.content_hi || "",
        pageId: id,
      };

      try {
        const response = await axios.post(
          `${API_URL}/ContentRoutes/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("response", response);

        setData({
          content_en: "",
          content_hi: "",
        });
        await getContent();
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
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">content</div>
          </div>

          <form
            className="needs-validation"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="card-body">
              <div className="row g-3">
                <div>
                  <label className="form-label fw-bold">
                    HTML Content (English)
                  </label>
                   <JoditEditor
                        style={{ width: "90%" }}
                        ref={editor}
                        value={data?.content_en}
                        config={{
                          showPoweredBy: false,
                          placeholder: "",
                          askBeforePasteHTML: false,
                          askBeforePasteFromWord: false,
                        }}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            content_en: newContent,
                          }));
                        }}
                      />
                  {/* <JoditEditor
                    style={{ width: "90%" }}
                    ref={editor}
                    value={data?.content_en}
                    onChange={(newContent) =>
                      setData({
                        ...data,
                        content_en: newContent,
                      })
                    }
                  /> */}
                </div>
                <div>
                  <label className="form-label fw-bold">
                    HTML Content (Hindi)
                  </label>
                   <JoditEditor
                        style={{ width: "90%" }}
                        ref={editor}
                        value={data?.content_hi}
                        config={{
                          showPoweredBy: false,
                          placeholder: "",
                          askBeforePasteHTML: false,
                          askBeforePasteFromWord: false,
                        }}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            content_hi: newContent,
                          }));
                        }}
                      />
                  {/* <JoditEditor
                    style={{ width: "90%" }}
                    ref={editor}
                    value={data?.content_hi}
                    onChange={(newContent) =>
                      setData({
                        ...data,
                        content_hi: newContent,
                      })
                    }
                  /> */}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div className="card-footer">
               {(hasAddAccess("content") ||
                hasEditAccess("content")) && (  <button className="btn btn-info" type="submit">
                  {isEdit ? "Update" : "Save"}
                </button>)}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ContentForm;
