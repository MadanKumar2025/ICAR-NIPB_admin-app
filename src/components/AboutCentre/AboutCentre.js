import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { usePermissions } from "../User_Management/UserManagement.js";
import JoditEditor from "jodit-react";

function AboutCentre() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();
  const [preview, setPreview] = useState(null);

  const [data, setData] = useState({
    topSection_en: "",
    topSection_hi: "",
    MediyamSection1_en: "",
    MediyamSection1_hi: "",
    MediyamSection2_en: "",
    MediyamSection2_hi: "",
    MediyamSection3_en: "",
    MediyamSection3_hi: "",
    BotemSection_en: "",
    BotemSection_hi: "",
    photo: null,
  });

  const token = localStorage.getItem("token");
  const formRef = useRef();
  const editor = useRef(null);

  const getOrganizations = async (page = 1) => {
    try {
      const response = await axios.get(`${API_URL}/AboutCentreRoutes/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEditId(response?.data?.data[0]?.id);

      setIsEdit(
        response?.data?.data[0]?.topSection?.en === undefined ? false : true,
      );
      const item = response?.data?.data?.[0];

      setData({
        topSection_en: item?.topSection?.en || "",
        topSection_hi: item?.topSection?.hi || "",

        MediyamSection1_en: item?.MediyamSection1?.en || "",
        MediyamSection1_hi: item?.MediyamSection1?.hi || "",

        MediyamSection2_en: item?.MediyamSection2?.en || "",
        MediyamSection2_hi: item?.MediyamSection2?.hi || "",

        MediyamSection3_en: item?.MediyamSection3?.en || "",
        MediyamSection3_hi: item?.MediyamSection3?.hi || "",

        BotemSection_en: item?.BotemSection?.en || "",
        BotemSection_hi: item?.BotemSection?.hi || "",

        photo: item?.topImage || null,
      });
      setPreview(`${IMG_BASE_URL}/${item?.topImage}`);
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
    getOrganizations();
  }, []);

  const handleChange = (e) => {
    const { name, type, files, checked, value } = e.target;

    // File input
    if (type === "file" && files.length > 0) {
      const file = files[0];
      setData((prev) => ({
        ...prev,
        [name]: file,
      }));
      setPreview((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
      return;
    }

    // Checkbox input
    if (type === "checkbox") {
      setData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    // Boolean stored as string (e.g., isActive dropdown)
    if (name === "isActive") {
      setData((prev) => ({
        ...prev,
        isActive: value === "true",
      }));
      return;
    }

    // Multilingual fields (nested objects)
    if (name.includes("_en") || name.includes("_hi")) {
      const [field, lang] = name.split("_");
      setData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value,
        },
      }));
      return;
    }

    // Normal text input
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      try {
        const formData = new FormData();

        console.log("yes");

        formData.append("topSection_en", data?.topSection_en || "");
        formData.append("topSection_hi", data?.topSection_hi || "");
        formData.append("MediyamSection1_en", data?.MediyamSection1_en || "");
        formData.append("MediyamSection1_hi", data?.MediyamSection1_hi || "");
        formData.append("MediyamSection2_en", data?.MediyamSection2_en || "");
        formData.append("MediyamSection2_hi", data?.MediyamSection2_hi || "");
        formData.append("MediyamSection3_en", data?.MediyamSection3_en || "");
        formData.append("MediyamSection3_hi", data?.MediyamSection3_hi || "");
        formData.append("BotemSection_en", data?.BotemSection_en || "");
        formData.append("BotemSection_hi", data?.BotemSection_hi || "");
        if (data?.photo) {
          formData.append("photo", data?.photo || "");
        }

        const response = await axios.put(
          `${API_URL}/AboutCentreRoutes/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        // reset state
        setData({
          topSection_en: "",
          topSection_hi: "",
          MediyamSection1_en: "",
          MediyamSection1_hi: "",
          MediyamSection2_en: "",
          MediyamSection2_hi: "",
          MediyamSection3_en: "",
          MediyamSection3_hi: "",
          BotemSection_en: "",
          BotemSection_hi: "",
          photo: null,
          isActive: false,
        });

        formRef.current.reset();
        setPreview(null);

        Swal.fire({
          icon: "success",
          title: "About Centre Update",
          text: response.data.message || "About Centre updated successfully",
          confirmButtonColor: "#3085d6",
        });

        await getOrganizations();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Update failed",
        });
      }
    } else {
      const formData = new FormData();

      // Multilingual fields
      formData.append("topSection_en", data?.topSection_en || "");
      formData.append("topSection_hi", data?.topSection_hi || "");
      formData.append("MediyamSection1_en", data?.MediyamSection1_en || "");
      formData.append("MediyamSection1_hi", data?.MediyamSection1_hi || "");
      formData.append("MediyamSection2_en", data?.MediyamSection2_en || "");
      formData.append("MediyamSection2_hi", data?.MediyamSection2_hi || "");
      formData.append("MediyamSection3_en", data?.MediyamSection3_en || "");
      formData.append("MediyamSection3_hi", data?.MediyamSection3_hi || "");
      formData.append("BotemSection_en", data?.BotemSection_en || "");
      formData.append("BotemSection_hi", data?.BotemSection_hi || "");
      if (data?.photo) {
        formData.append("photo", data?.photo || "");
      }
      try {
        const response = await axios.post(
          `${API_URL}/AboutCentreRoutes/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setData({
          topSection_en: "",
          topSection_hi: "",
          MediyamSection1_en: "",
          MediyamSection1_hi: "",
          MediyamSection2_en: "",
          MediyamSection2_hi: "",
          MediyamSection3_en: "",
          MediyamSection3_hi: "",
          BotemSection_en: "",
          BotemSection_hi: "",
          photo: null,
          isActive: false,
        });

        formRef.current.reset();

        Swal.fire({
          icon: "success",
          title: "About Centre Details",
          text: response.data.message || "About Centre Details Successfully.",
          confirmButtonColor: "#3085d6",
        });
        getOrganizations();
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
          <div className="main-heading w-100 d-block overflow-hidden mb-3">
            <div className="card-title fw-semibold">About Centre</div>
          </div>

          <form
            className="needs-validation"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div>
                    <label className="form-label fw-bold">
                      Top Section (English)
                    </label>
                    <div className="custom-main-editor">
                      {/* <JoditEditor
                        style={{ width: "90%" }}
                        ref={editor}
                        value={data?.topSection_en}
                        className="custom-editor"
                        config={{
                          showPoweredBy: false,
                          placeholder: "",
                          askBeforePasteHTML: false,
                          askBeforePasteFromWord: false,
                        }}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            topSection_en: newContent,
                          }));
                        }}
                      /> */}

                      <JoditEditor
                        ref={editor}
                        value={data?.topSection_en}
                        config={config}
                        tabIndex={1}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            topSection_en: newContent,
                          }));
                        }}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div>
                    <label className="form-label fw-bold">
                      Top Section (Hindi)
                    </label>
                    <div className="custom-main-editor">
                      {/* <JoditEditor
                        style={{ width: "90%" }}
                        ref={editor}
                        value={data?.topSection_hi}
                        config={{
                          showPoweredBy: false,
                          placeholder: "",
                          askBeforePasteHTML: false,
                          askBeforePasteFromWord: false,
                        }}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            topSection_hi: newContent,
                          }));
                        }}
                      /> */}

                      <JoditEditor
                        ref={editor}
                        value={data?.topSection_hi}
                        config={config}
                        tabIndex={1}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            topSection_hi: newContent,
                          }));
                        }}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div>
                    <label className="form-label fw-bold">
                      Middle Section 1 (English)
                    </label>
                    <div className="custom-main-editor">
                      <JoditEditor
                        style={{ width: "90%" }}
                        ref={editor}
                        value={data?.MediyamSection1_en}
                        config={{
                          showPoweredBy: false,
                          placeholder: "",
                          askBeforePasteHTML: false,
                          askBeforePasteFromWord: false,
                        }}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            MediyamSection1_en: newContent,
                          }));
                        }}
                      />
                    </div>
                    {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.MediyamSection1_en}
                      config={{
                        placeholder: "",
                      }}
                      onChange={(newContent) =>
                        setData({
                          ...data,
                          MediyamSection1_en: newContent,
                        })
                      }
                    /> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div>
                    <label className="form-label fw-bold">
                      Middle Section 1 (Hindi)
                    </label>
                    <div className="custom-main-editor">
                      <JoditEditor
                        style={{ width: "90%" }}
                        ref={editor}
                        value={data?.MediyamSection1_hi}
                        config={{
                          showPoweredBy: false,
                          placeholder: "",
                          askBeforePasteHTML: false,
                          askBeforePasteFromWord: false,
                        }}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            MediyamSection1_hi: newContent,
                          }));
                        }}
                      />
                    </div>
                    {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.MediyamSection1_hi}
                      config={{
                        placeholder: "",
                      }}
                      onChange={(newContent) =>
                        setData({
                          ...data,
                          MediyamSection1_hi: newContent,
                        })
                      }
                    /> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div>
                    <label className="form-label fw-bold">
                      Middle Section 2 (English)
                    </label>
                    <div className="custom-main-editor">
                      <JoditEditor
                        style={{ width: "90%" }}
                        ref={editor}
                        value={data?.MediyamSection2_en}
                        config={{
                          showPoweredBy: false,
                          placeholder: "",
                          askBeforePasteHTML: false,
                          askBeforePasteFromWord: false,
                        }}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            MediyamSection2_en: newContent,
                          }));
                        }}
                      />
                    </div>
                    {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.MediyamSection2_en}
                      config={{
                        placeholder: "",
                      }}
                      onChange={(newContent) =>
                        setData({
                          ...data,
                          MediyamSection2_en: newContent,
                        })
                      }
                    /> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div>
                    <label className="form-label fw-bold">
                      Middle Section 2 (Hindi)
                    </label>
                    <div className="custom-main-editor">
                      <JoditEditor
                        style={{ width: "90%" }}
                        ref={editor}
                        value={data?.MediyamSection2_hi}
                        config={{
                          showPoweredBy: false,
                          placeholder: "",
                          askBeforePasteHTML: false,
                          askBeforePasteFromWord: false,
                        }}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            MediyamSection2_hi: newContent,
                          }));
                        }}
                      />
                    </div>
                    {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.MediyamSection2_hi}
                      config={{
                        placeholder: "",
                      }}
                      onChange={(newContent) =>
                        setData({
                          ...data,
                          MediyamSection2_hi: newContent,
                        })
                      }
                    /> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div>
                    <label className="form-label fw-bold">
                      Middle Section 3 (English)
                    </label>
                    <div className="custom-main-editor">
                      <JoditEditor
                        style={{ width: "90%" }}
                        ref={editor}
                        value={data?.MediyamSection3_en}
                        config={{
                          showPoweredBy: false,
                          placeholder: "",
                          askBeforePasteHTML: false,
                          askBeforePasteFromWord: false,
                        }}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            MediyamSection3_en: newContent,
                          }));
                        }}
                      />
                    </div>
                    {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.MediyamSection3_en}
                      config={{
                        placeholder: "",
                      }}
                      onChange={(newContent) =>
                        setData({
                          ...data,
                          MediyamSection3_en: newContent,
                        })
                      }
                    /> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div>
                    <label className="form-label fw-bold">
                      Middle Section 3 (Hindi)
                    </label>
                    <div className="custom-main-editor">
                      <JoditEditor
                        style={{ width: "90%" }}
                        ref={editor}
                        value={data?.MediyamSection3_hi}
                        config={{
                          showPoweredBy: false,
                          placeholder: "",
                          askBeforePasteHTML: false,
                          askBeforePasteFromWord: false,
                        }}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            MediyamSection3_hi: newContent,
                          }));
                        }}
                      />
                    </div>
                    {/* <JoditEditor
                          style={{ width: "90%" }}
                          ref={editor}
                          value={data?.MediyamSection3_hi}
                          config={{
                            placeholder: "",
                          }}
                          onChange={(newContent) =>
                            setData({
                              ...data,
                              MediyamSection3_hi: newContent,
                            })
                          }
                        /> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div>
                    <label className="form-label fw-bold">
                      Botem Section (English)
                    </label>
                    <div className="custom-main-editor">
                      <JoditEditor
                        style={{ width: "90%" }}
                        ref={editor}
                        value={data?.BotemSection_en}
                        config={{
                          showPoweredBy: false,
                          placeholder: "",
                          askBeforePasteHTML: false,
                          askBeforePasteFromWord: false,
                        }}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            BotemSection_en: newContent,
                          }));
                        }}
                      />
                    </div>
                    {/* <JoditEditor
                          style={{ width: "90%" }}
                          ref={editor}
                          value={data?.BotemSection_en}
                          config={{
                            placeholder: "",
                          }}
                          onChange={(newContent) =>
                            setData({
                              ...data,
                              BotemSection_en: newContent,
                            })
                          }
                        /> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div>
                    <label className="form-label fw-bold">
                      Botem Section (Hindi)
                    </label>
                    <div className="custom-main-editor">
                      <JoditEditor
                        style={{ width: "90%" }}
                        ref={editor}
                        value={data?.BotemSection_hi}
                        config={{
                          showPoweredBy: false,
                          placeholder: "",
                          askBeforePasteHTML: false,
                          askBeforePasteFromWord: false,
                        }}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            BotemSection_hi: newContent,
                          }));
                        }}
                      />
                    </div>
                    {/* <JoditEditor
                          style={{ width: "90%" }}
                          ref={editor}
                          value={data?.BotemSection_hi}
                          config={{
                            placeholder: "",
                          }}
                          onChange={(newContent) =>
                            setData({
                              ...data,
                              BotemSection_hi: newContent,
                            })
                          }
                        /> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-body">
                <div className="row gap-3">
                  <div className="col-12">
                    <label htmlFor="validationCustom05" className="form-label">
                      Photo
                    </label>
                  </div>
                  <div className="col-sm-6 col-xl-5">
                    <input
                      type="file"
                      name="photo"
                      onChange={handleChange}
                      className="form-control upload-image-input"
                      id="validationCustom05"
                    />
                  </div>
                  <div className="col-sm-6 mt-3 mt-sm-0">
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        style={{
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div className="invalid-feedback">
                      Please provide a Photo.
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                {(hasAddAccess("About Centre") ||
                  hasEditAccess("About Centre")) && (
                  <button className="btn btn-info" type="submit">
                    Save
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AboutCentre;
