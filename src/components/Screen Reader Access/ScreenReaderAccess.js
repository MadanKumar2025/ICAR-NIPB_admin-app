import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { usePermissions } from "../User_Management/UserManagement.js";
import JoditEditor from "jodit-react";

function ScreenReaderAccess() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [data, setData] = useState({
    content_en: "",
    content_hi: "",
  });

  const token = localStorage.getItem("token");
  const formRef = useRef();
  const editor = useRef(null);

  const getscreenReaderAccess = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_URL}/ScreenReaderAccessRoutes/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const item = response?.data?.data?.[0];

      setIsEdit(item?.content?.en === undefined ? false : true);
      setEditId(item?._id);

      setData({
        content_en: item?.content?.en || "",
        content_hi: item?.content?.hi || "",
      });
    } catch (error) {
      console.error("Error fetching organizations:", error);
      if (
        error.response?.data?.message === "Invalid token" ||
        error.response?.status === 401
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    getscreenReaderAccess();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      try {
        const response = await axios.put(
          `${API_URL}/ScreenReaderAccessRoutes/update/${editId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        setData({
          organizationName: { en: "", hi: "" },
        });

        formRef.current.reset();

        Swal.fire({
          icon: "success",
          title: "Organization Update",
          text: response.data.message || "Organization updated successfully",
          confirmButtonColor: "#3085d6",
        });

        await getscreenReaderAccess();
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
          `${API_URL}/ScreenReaderAccessRoutes/create`,
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
          title: "Organization Details",
          text: response.data.message || "Organization Details Successfully.",
          confirmButtonColor: "#3085d6",
        });
        getscreenReaderAccess();
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
      <div>
        <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
          <div className="custom-card card card-info card-outline mb-4">
            <div className="card-header">
              <div className="card-title">Screen Reader Access</div>
            </div>

            <form
              className="needs-validation"
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <div className="card-body">
                <div className="row g-3">
                  <div></div>
                  <div>
                    <label className="form-label fw-bold">
                      Content (English)
                    </label>
                    <div className="custom-main-editor">
                      {/* <JoditEditor
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
                      /> */}
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
                    <label className="form-label fw-bold">
                      Content (Hindi)
                    </label>
                    <div className="custom-main-editor">
                      {/* <JoditEditor
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
                      /> */}
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
                </div>
              </div>

              <div className="card-footer">
                {(hasAddAccess("Screen Reader Access") ||
                  hasEditAccess("Screen Reader Access")) && (
                  <button className="btn btn-info" type="submit">
                    Save
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ScreenReaderAccess;
