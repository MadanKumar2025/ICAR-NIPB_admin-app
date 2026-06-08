import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Box, Tabs, useMediaQuery, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import JoditEditor from "jodit-react";

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function StaffForm({
  data,
  setData,
  setPreview,
  isEdit,
  editId,
  getStaffData,
  setAllStaff,
  preview,
  handleClose,
}) {
  const [designation, setDesignation] = useState([]);
  const [tab, setTab] = useState(0);

  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;

  const formRef = useRef();
  const editor = useRef(null);
  const token = localStorage.getItem("token");

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
  };

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

        formData.append("department_en", data?.department_en || "");
        formData.append("department_hi", data?.department_hi || "");
        formData.append("staffName_en", data?.staffName_en || "");
        formData.append("staffName_hi", data?.staffName_hi || "");
        formData.append("designation_en", data?.designation_en || "");
        formData.append("designation_hi", data?.designation_hi || "");
        formData.append("phone", data?.phone || "");
        formData.append("email", data?.email || "");
        formData.append("displayOrder", data?.displayOrder || "");
        formData.append("education_en", data?.education_en || "");
        formData.append("education_hi", data?.education_hi || "");
        formData.append("research_en", data?.research_en || "");
        formData.append("research_hi", data?.research_hi || "");
        formData.append("publications_en", data?.publications_en || "");
        formData.append("publications_hi", data?.publications_hi || "");

        formData.append("imageTitle", data?.imageTitle || "");
        formData.append("isActive", data?.isActive);

        if (data.photo) {
          formData.append("photo", data.photo);
        }

        formData.append(
          "awards",
          JSON.stringify(data?.awards || [{ en: "", hi: "" }]),
        );

        formData.append(
          "ipr",
          JSON.stringify(data?.ipr || [{ en: "", hi: "" }]),
        );

        const res = await axios.put(
          `${API_URL}/staff/updateStaff/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setData({
          department_en: "",
          department_hi: "",
          staffName_en: "",
          staffName_hi: "",
          designation_en: "",
          designation_hi: "",
          phone: "",
          email: "",
          displayOrder: "",
          education_en: "",
          education_hi: "",
          research_en: "",
          research_hi: "",
          publications_en: "",
          publications_hi: "",
          imageTitle: "",
          photo: null,
          awards: [{ en: "", hi: "" }],
          ipr: [{ en: "", hi: "" }],
          isActive: true,
        });

        setPreview(null);

        formRef.current.reset();
        await getStaffData();
        handleClose();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Update failed",
        });
      }
    } else {
      const formData = new FormData();

      formData.append("department_en", data?.department_en || "");
      formData.append("department_hi", data?.department_hi || "");
      formData.append("staffName_en", data?.staffName_en || "");
      formData.append("staffName_hi", data?.staffName_hi || "");
      formData.append("designation_en", data?.designation_en || "");
      formData.append("designation_hi", data?.designation_hi || "");
      formData.append("phone", data?.phone || "");
      formData.append("email", data?.email || "");
      formData.append("displayOrder", data?.displayOrder || "");
      formData.append("education_en", data?.education_en || "");
      formData.append("education_hi", data?.education_hi || "");
      formData.append("imageTitle", data?.imageTitle || "");
      formData.append("isActive", data?.isActive);

      formData.append("research_en", data?.research_en || "");
      formData.append("research_hi", data?.research_hi || "");
      formData.append("publications_en", data?.publications_en || "");
      formData.append("publications_hi", data?.publications_hi || "");

      if (data.photo) {
        formData.append("photo", data.photo);
      }

      formData.append(
        "awards",
        JSON.stringify(data?.awards || [{ en: "", hi: "" }]),
      );

      formData.append("ipr", JSON.stringify(data?.ipr || [{ en: "", hi: "" }]));
      try {
        const response = await axios.post(`${API_URL}/staff/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setData({
          department_en: "",
          department_hi: "",
          staffName_en: "",
          staffName_hi: "",
          designation_en: "",
          designation_hi: "",
          phone: "",
          email: "",
          displayOrder: "",
          education_en: "",
          education_hi: "",
          research_en: "",
          research_hi: "",
          publications_en: "",
          publications_hi: "",
          imageTitle: "",
          photo: null,
          awards: [{ en: "", hi: "" }],
          ipr: [{ en: "", hi: "" }],
          isActive: true,
        });
        setPreview(null);

        formRef.current.reset();
        // getAllPage(currentPage);

        Swal.fire({
          icon: "success",
          title: "Organization Details",
          text: response.data.message || "Organization Details Successfully.",
          confirmButtonColor: "#3085d6",
        });
        setAllStaff(response?.data?.data);
        await getStaffData();
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

  // this is use for get Designation
  const getDesignation = async () => {
    try {
      const response = await axios.get(`${API_URL}/designation/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDesignation(response?.data?.data);
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
    getDesignation();
  }, []);

  const handleAwardsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAwards = [...data?.awards];
    updatedAwards[index][name] = value;
    setData({ ...data, awards: updatedAwards });
  };

  const addAwards = () => {
    setData({
      ...data,
      awards: [...data?.awards, { en: "", hi: "" }],
    });
  };

  const deleteAwards = (index) => {
    const updatedAwards = data?.awards?.filter((_, i) => i !== index);
    setData({ ...data, awards: updatedAwards });
  };

  // const handlePublicationsChange = (index, e) => {
  //   const { name, value } = e.target;
  //   const updatedPublications = [...data?.publications];
  //   updatedPublications[index][name] = value;
  //   setData({ ...data, publications: updatedPublications });
  // };

  // const addPublications = () => {
  //   setData({
  //     ...data,
  //     publications: [...data?.publications, { en: "", hi: "" }],
  //   });
  // };

  // const deletePublications = (index) => {
  //   const updatedPublications = data?.publications?.filter(
  //     (_, i) => i !== index,
  //   );
  //   setData({ ...data, publications: updatedPublications });
  // };
  const handleIprChange = (index, e) => {
    const { name, value } = e.target;
    const updatedIpr = [...data?.ipr];
    updatedIpr[index][name] = value;
    setData({ ...data, ipr: updatedIpr });
  };

  const addIpr = () => {
    setData({
      ...data,
      ipr: [...data?.ipr, { en: "", hi: "" }],
    });
  };

  const deleteIpr = (index) => {
    const updatedIpr = data?.ipr?.filter((_, i) => i !== index);
    setData({ ...data, ipr: updatedIpr });
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // console.log("data", data);

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
            <div className="card-title">Staff</div>
          </div>

          <form
            className="needs-validation"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                width: "100%",
                overflowX: "auto",
              }}
            >
              <Tabs
                value={tab}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                allowScrollButtonsMobile
                centered={!isMobile}
                sx={{
                  minHeight: "48px",
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: { xs: "12px", sm: "14px", md: "16px" },
                    padding: { xs: "6px 10px", sm: "8px 16px" },
                  },
                }}
              >
                <Tab label="Basic Info" />
                <Tab label="Duties assigned and Date of Joining" />
                <Tab label="Awards & Honors" />
                <Tab label="Publications" />
                <Tab label="IPR (Patent / Copyright)" />
              </Tabs>
            </Box>

            {/* TAB 1 */}
            <CustomTabPanel value={tab} index={0}>
              <div className="card-body tab-panel-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="validationCustom01" className="form-label">
                      Department (English)
                    </label>
                    <select
                      name="department_en"
                      value={data?.department_en}
                      onChange={handleChange}
                      className="form-control"
                      id="department_en"
                    >
                      <option value="">select</option>
                      <option value="Technical Staff">Technical Staff</option>
                      <option value="Administrative Staff">
                        Administrative Staff
                      </option>
                      <option value="Professor">Professor</option>
                      <option value="Faculty">Faculty</option>
                      <option value="Honorary Scientist">
                        Honorary Scientist
                      </option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationCustom01" className="form-label">
                      Department (Hindi)
                    </label>
                    <select
                      name="department_hi"
                      value={data?.department_hi}
                      onChange={handleChange}
                      className="form-control"
                      id="department_hi"
                    >
                      <option value="">select</option>
                      <option value="तकनीकी कर्मचारी">तकनीकी कर्मचारी</option>
                      <option value="प्रशासनिक कर्मचारी">
                        प्रशासनिक कर्मचारी
                      </option>
                      <option value="प्रोफेसर">प्रोफेसर</option>
                      <option value="फैकल्टी">फैकल्टी</option>
                      <option value="मानद वैज्ञानिक">मानद वैज्ञानिक</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationCustom02" className="form-label">
                      Staff Name (English)
                    </label>
                    <input
                      type="text"
                      name="staffName_en"
                      value={data?.staffName_en}
                      onChange={handleChange}
                      className="form-control"
                      id="staffName_en"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationCustom02" className="form-label">
                      Staff Name (Hindi)
                    </label>
                    <input
                      type="text"
                      name="staffName_hi"
                      value={data?.staffName_hi}
                      onChange={handleChange}
                      className="form-control"
                      id="staffName_hi"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Designation (English)
                    </label>

                    <select
                      name="designation_en"
                      value={data?.designation_en || ""}
                      onChange={handleChange}
                      className="form-control"
                      id="department_en"
                    >
                      <option value="">select</option>

                      {designation.map((item, index) => {
                        return (
                          <option key={index} value={item?.name?.en}>
                            {item?.name?.en}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Designation (Hindi)
                    </label>
                    <select
                      name="designation_hi"
                      value={data?.designation_hi}
                      onChange={handleChange}
                      className="form-control"
                      id="designation_hi"
                    >
                      <option value="">select</option>

                      {designation.map((item, index) => {
                        return (
                          <option key={index} value={item?.name?.hi}>
                            {item?.name?.hi}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Phone
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="phone"
                        value={data?.phone}
                        onChange={handleChange}
                        className="form-control"
                        // required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Email
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="email"
                        name="email"
                        value={data?.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Display Order Number
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="displayOrder"
                        value={data?.displayOrder}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Education (English)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="education_en"
                        value={data?.education_en}
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
                      Education (Hindi)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="education_hi"
                        value={data?.education_hi}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="validationCustom03" className="form-label">
                      Image Title
                    </label>
                    <input
                      type="text"
                      name="imageTitle"
                      value={data?.imageTitle}
                      onChange={handleChange}
                      className="form-control"
                      id="imageTitle"
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
                    <label htmlFor="validationCustom05" className="form-label">
                      Photo
                    </label>
                    <div className="d-flex">
                      <input
                        type="file"
                        name="photo"
                        onChange={handleChange}
                        className="form-control upload-image-input"
                        id="validationCustom05"
                      />
                      {preview && (
                        <img
                          src={preview}
                          alt="Preview"
                          style={{
                            marginLeft: "20px",
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
              </div>
            </CustomTabPanel>
            {/* TAB 2 */}
            <CustomTabPanel value={tab} index={1}>
              <div className="card-body tab-panel-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">
                      Duties assigned and Date of Joining (English)
                    </label>
                    <div className="custom-main-editor">
                      {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.research_en}
                      config={{
                        showPoweredBy: false,
                        placeholder: "",
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                      }}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          research_en: newContent,
                        }));
                      }}
                    /> */}
                      <JoditEditor
                        ref={editor}
                        value={data.research_en}
                        config={config}
                        tabIndex={1}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            research_en: newContent,
                          }));
                        }}
                        onChange={() => {}}
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-bold">
                      Duties assigned and Date of Joining (Hindi)
                    </label>
                    <div className="custom-main-editor">
                      {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.research_hi}
                      config={{
                        showPoweredBy: false,
                        placeholder: "",
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                      }}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          research_hi: newContent,
                        }));
                      }}
                    /> */}
                      <JoditEditor
                        ref={editor}
                        value={data?.research_hi}
                        config={config}
                        tabIndex={1}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            research_hi: newContent,
                          }));
                        }}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CustomTabPanel>

            {/* TAB 3 */}
            <CustomTabPanel value={tab} index={2}>
              <div className="card-body tab-panel-body">
                <div className="row g-3">
                  {data?.awards?.map((awards, index) => (
                    <>
                      <div key={index} className="row g-3  align-items-center">
                        <div key={index} className="col-md-5">
                          <label className="form-label">Awards (English)</label>
                          <input
                            type="text"
                            name="en"
                            value={awards?.en}
                            onChange={(e) => handleAwardsChange(index, e)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-sm-9 col-md-5">
                          <label className="form-label">Awards (Hindi)</label>
                          <input
                            type="text"
                            name="hi"
                            value={awards?.hi}
                            onChange={(e) => handleAwardsChange(index, e)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-sm-3 col-md-2 d-flex align-items-center gap-3 mt-4 pt-sm-4">
                          <div
                            type="button"
                            onClick={() =>
                              data?.awards?.length > 1 && deleteAwards(index)
                            }
                            style={{
                              cursor:
                                data?.awards?.length > 1
                                  ? "pointer"
                                  : "not-allowed",
                              opacity: data?.awards?.length > 1 ? 1 : 0.5,
                            }}
                          >
                            <i className="bi bi-trash fs-4"></i>
                          </div>
                          <div
                            type="button"
                            className="add-awards"
                            // className="btn btn-primary"
                            onClick={addAwards}
                          >
                            <i className="bi bi-plus-circle fs-4"></i>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </CustomTabPanel>

            <CustomTabPanel value={tab} index={3}>
              <div className="card-body tab-panel-body">
                <div className=" g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">
                      Publications (English)
                    </label>
                    <div className="custom-main-editor">
                      {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.publications_en}
                      config={{
                        showPoweredBy: false,
                        placeholder: "",
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                      }}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          publications_en: newContent,
                        }));
                      }}
                    /> */}
                      <JoditEditor
                        ref={editor}
                        value={data?.publications_en}
                        config={config}
                        tabIndex={1}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            publications_en: newContent,
                          }));
                        }}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                  <div></div>
                  <div className="col-md-12 mt-3">
                    <label className="form-label fw-bold">
                      Publications (Hindi)
                    </label>
                    <div className="custom-main-editor">
                      {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.publications_hi}
                      config={{
                        showPoweredBy: false,
                        placeholder: "",
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                      }}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          publications_hi: newContent,
                        }));
                      }}
                    /> */}
                      <JoditEditor
                        ref={editor}
                        value={data?.publications_hi}
                        config={config}
                        tabIndex={1}
                        onBlur={(newContent) => {
                          setData((prev) => ({
                            ...prev,
                            publications_hi: newContent,
                          }));
                        }}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            {/* TAB 5 */}
            <CustomTabPanel value={tab} index={4}>
              <div className="card-body tab-panel-body">
                <div className="row g-3">
                  {data?.ipr?.map((ipr, index) => (
                    <>
                      <div key={index} className="row g-3 align-items-center">
                        <div key={index} className="col-md-5">
                          <label className="form-label">IPR (English)</label>
                          <input
                            type="text"
                            name="en"
                            value={ipr?.en}
                            onChange={(e) => handleIprChange(index, e)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-sm-9 col-md-5">
                          <label className="form-label">IPR (Hindi)</label>
                          <input
                            type="text"
                            name="hi"
                            value={ipr?.hi}
                            onChange={(e) => handleIprChange(index, e)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-sm-3 col-md-2 d-flex align-items-center gap-3 mt-4 pt-sm-4">
                          <div
                            type="button"
                            onClick={() =>
                              data?.ipr?.length > 1 && deleteIpr(index)
                            }
                            style={{
                              cursor:
                                data?.ipr?.length > 1
                                  ? "pointer"
                                  : "not-allowed",
                              opacity: data?.ipr?.length > 1 ? 1 : 0.5,
                            }}
                          >
                            <i className="bi bi-trash fs-4"></i>
                          </div>
                          <div
                            type="button"
                            className="add-award"
                            onClick={addIpr}
                          >
                            <i className="bi bi-plus-circle fs-4"></i>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </CustomTabPanel>

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

export default StaffForm;
