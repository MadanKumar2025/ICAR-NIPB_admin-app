import axios from "axios";
import JoditEditor from "jodit-react";
import { useMemo, useRef } from "react";
import Swal from "sweetalert2";

function PublicationForm({
  data,
  setData,
  preview,
  setPreview,
  handleClose,
  isEdit,
  getPublication,
  setIsEdit,
  editId,
  addSubProject,
  deleteSubProject,
  handleSubProjectChange,
  previewImage,
  setPreviewImage,
}) {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const formRef = useRef();
  const editor = useRef(null);

  // const handleChange = (e) => {
  //   const { name, type, value, files, checked } = e.target;

  //   setData((prev) => ({
  //     ...prev,
  //     [name]:
  //       type === "file" ? files[0] : type === "checkbox" ? checked : value,
  //   }));
  // };

  const handleChange = (e) => {
    const { name, type, files, checked, value, image } = e.target;

    // FILE INPUT
    if (type === "file") {
      const file = files?.[0];

      const maxSize = 50 * 1024 * 1024;

      if (file && file.size > maxSize) {
        Swal.fire({
          icon: "warning",
          title: "File Too Large",
          text: "File size must be less than 50MB",
        });
        return;
      }

      setData((prev) => ({
        ...prev,
        [name]: file || null,
      }));

      // separate preview logic
      if (name === "image") {
        setPreviewImage(URL.createObjectURL(file));
      }

      if (name === "file") {
        setPreviewImage(URL.createObjectURL(file));
      }

      return;
    }

    // CHECKBOX
    if (type === "checkbox") {
      setData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    // isActive dropdown boolean conversion
    if (name === "isActive") {
      setData((prev) => ({
        ...prev,
        isActive: value === "true",
      }));
      return;
    }

    // MULTILINGUAL fields (example: title_en, title_hi)
    // if (name.includes("_en") || name.includes("_hi")) {
    //   const [field, lang] = name.split("_");

    //   setData((prev) => ({
    //     ...prev,
    //     [field]: {
    //       ...(prev[field] || {}),
    //       [lang]: value,
    //     },
    //   }));
    //   return;
    // }
    if (name === "articleType_en" || name === "articleType_hi") {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }
    // DEFAULT INPUT
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

        formData.append("year", data?.year || "");
        formData.append("title_en", data?.title_en || "");
        formData.append("title_hi", data?.title_hi || "");
        formData.append("category", data?.category || "");
        formData.append("articleType_en", data?.articleType_en || "");
        formData.append("articleType_hi", data?.articleType_hi || "");
        formData.append("isActive", data?.isActive ? "true" : "false");

        if (data?.file) {
          formData.append("file", data.file);
        }
        if (data?.image) {
          formData.append("image", data.image);
        }
        Swal.fire({
          title: "Uploading...",
          html: "0%",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const res = await axios.put(
          `${API_URL}/PublicationsRoutes/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );

              Swal.update({
                html: `${percent}%`,
              });
            },
          },
        );
        Swal.close();

        setIsEdit(false);
        setData({
          title_en: "",
          title_hi: "",
          category: "",
          year: "",
          file: null,
          image: null,
          isActive: true,
        });

        formRef.current?.reset();
        setPreview(null);

        await getPublication();
        handleClose();
      } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("STATUS:", error?.response?.status);
        console.log("DATA:", error?.response?.data);

        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error?.response?.data?.message || error.message || "Server error",
        });
      }
    } else {
      try {
        const formData = new FormData();

        formData.append("year", data?.year || "");
        formData.append("title_en", data?.title_en || "");
        formData.append("title_hi", data?.title_hi || "");
        formData.append("articleType_en", data?.articleType_en || "");
        formData.append("articleType_hi", data?.articleType_hi || "");
        formData.append("category", data?.category || "");
        formData.append("isActive", data?.isActive ? "true" : "false");

        if (data?.file) {
          formData.append("file", data.file);
        }
        if (data?.image) {
          formData.append("image", data.image);
        }

        const response = await axios.post(
          `${API_URL}/PublicationsRoutes/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setData({
          title_en: "",
          title_hi: "",
          category: "",
          year: "",
          file: null,
          image: null,
          articleType_en: "",
          articleType_hi: "",
          isActive: true,
        });

        formRef.current?.reset();
        setPreview(null);

        Swal.fire({
          icon: "success",
          title: "Publication Created",
          text: response?.data?.message || "Created successfully",
          confirmButtonColor: "#3085d6",
        });

        await getPublication();
        handleClose();
      } catch (error) {
        console.log("CREATE ERROR:", error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Server error",
        });
      }
    }
  };

  const showFileUploadCategories = [
    "AnnualReport",
    "Newsletters",
    "HindiPatrika",
    "Others",
    "Forms",
  ];

  const showFileUpload = showFileUploadCategories.includes(data?.category);

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
            <div className="card-title">Publication</div>
          </div>

          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="validationCustom01" className="form-label">
                    Category
                  </label>
                  <select
                    name="category"
                    className="form-control"
                    value={data?.category}
                    onChange={handleChange}
                    id="category"
                  >
                    <option value="">select</option>
                    <option value="ResearchPublications">
                      Research Publications
                    </option>
                    <option value="AnnualReport">Annual Report</option>
                    <option value="Newsletters">Newsletters</option>
                    <option value="HindiPatrika">Hindi Patrika</option>
                    <option value="Forms">Forms</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                {data?.category !== "Forms" && (
                  <div className="col-sm-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Year
                    </label>
                    <select
                      name="year"
                      className="form-control"
                      value={data?.year}
                      onChange={handleChange}
                      id="year"
                    >
                      <option value="">select</option>
                      <option value="2036">2036</option>
                      <option value="2035">2035</option>
                      <option value="2034">2034</option>
                      <option value="2033">2033</option>
                      <option value="2032">2032</option>
                      <option value="2031">2031</option>
                      <option value="2030">2030</option>
                      <option value="2029">2029</option>
                      <option value="2028">2028</option>
                      <option value="2027">2027</option>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                      <option value="2019">2019</option>
                      <option value="2018">2018</option>
                      <option value="2017">2017</option>
                      <option value="2016">2016</option>
                      <option value="2015">2015</option>
                      <option value="2014">2014</option>
                      <option value="2013">2013</option>
                      <option value="2012">2012</option>
                      <option value="2011">2011</option>
                      <option value="2010">2010</option>
                    </select>
                    {/* <div className="input-group has-validation">
                    <input
                      type="text"
                      name="year"
                      value={data?.year}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div> */}
                  </div>
                )}
                {data?.category === "ResearchPublications" && (
                  <div className="col-sm-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Article Type (English)
                    </label>
                    <select
                      name="articleType_en"
                      className="form-control"
                      value={data?.articleType_en}
                      onChange={handleChange}
                      id="articleType_en"
                    >
                      <option value="">select</option>
                      <option value="Research Articles">
                        Research Articles
                      </option>
                      <option value="Review Articles">Review Articles</option>
                      <option value="Book chapters">Book chapters</option>
                    </select>
                  </div>
                )}
                {data?.category === "ResearchPublications" && (
                  <div className="col-sm-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Article Type (Hindi)
                    </label>
                    <select
                      name="articleType_hi"
                      className="form-control"
                      value={data?.articleType_hi}
                      onChange={handleChange}
                      id="articleType_hi"
                    >
                      <option value="">select</option>
                      <option value="अनुसंधान लेख">अनुसंधान लेख</option>
                      <option value="समीक्षा लेख">समीक्षा लेख</option>
                      <option value="पुस्तक के अध्याय">पुस्तक के अध्याय</option>
                    </select>
                  </div>
                )}

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
                {showFileUpload && (
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Document / Photo
                    </label>

                    <input
                      type="file"
                      name="file"
                      onChange={handleChange}
                      className="form-control"
                      id="file"
                      // required
                    />
                    {preview && (
                      <a href={preview} target="_blank" rel="noreferrer">
                        View Document
                      </a>
                    )}
                  </div>
                )}
                {(data?.category === "AnnualReport" ||
                  data?.category === "Newsletters" ||
                  data?.category === "HindiPatrika") && (
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Cover Image
                    </label>

                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      className="form-control"
                      id="image"
                      // required
                    />
                    {previewImage && (
                      <a href={previewImage} target="_blank" rel="noreferrer">
                        View Document
                      </a>
                    )}
                  </div>
                )}
                <div>
                  <label className="form-label fw-bold">Title (English)</label>
                  <div className="custom-main-editor">
                    {/* <JoditEditor
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
                  /> */}
                    <JoditEditor
                      ref={editor}
                      value={data.title_en}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          title_en: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label fw-bold">Title (Hindi)</label>
                  <div className="custom-main-editor">
                    {/* <JoditEditor
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
                  /> */}
                    <JoditEditor
                      ref={editor}
                      value={data?.title_hi}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          title_hi: newContent,
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

export default PublicationForm;
