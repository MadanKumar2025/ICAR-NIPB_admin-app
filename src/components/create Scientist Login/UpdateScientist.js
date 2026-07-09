import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

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

function UpdateScientist() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;

  const [preview, setPreview] = useState(null);

  const [userId, setUserId] = useState(null);
  const [scientistId, setScientistId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [data, setData] = useState({
    scientistName_en: "",
    scientistName_hi: "",
    designationId: "",
    phone1: "",
    phone2: "",
    email1: "",
    email2: "",
    education_en: "",
    education_hi: "",
    majorCourses_en: "",
    majorCourses_hi: "",
    photoTitle: "",
    researchInterest_en: "",
    researchInterest_hi: "",
    publications_en: "",
    publications_hi: "",
    IPR_en: "",
    IPR_hi: "",
    awards_en: "",
    awards_hi: "",
    externallyFundedProjects_en: "",
    externallyFundedProjects_hi: "",
    photo: null,
    labProfile: [
      {
        name: { en: "", hi: "" },
        position: { en: "", hi: "" },
        duration: { en: "", hi: "" },
        project: { en: "", hi: "" },
        ImageTitle: "",
        photo: null,
      },
    ],
    galleryPhotos: [
      {
        galleryPhotostitle: "",
        galleryPhotos: null,
        orderNumberGallery: 0,
      },
    ],
    isActive: true,
  });

  const formRef = useRef();
  const editor = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded?.id);
    }
  }, [token]);

  //this use for get user id to scientist Id
  const getUser = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setScientistId(response?.data?.data?.scientistId);
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
    if (userId) {
      getUser(userId);
    }
  }, [userId]);

  const getScientistData = async (id) => {
    if (!id) return;
    try {
      const response = await axios.get(`${API_URL}/ScientistRoutes/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData({
        scientistName_en: response?.data?.data?.scientistName?.en || "",
        scientistName_hi: response?.data?.data?.scientistName?.hi || "",

        designationId: response?.data?.data?.designationId?._id || "",
        phone1: response?.data?.data?.phone1 || "",
        phone2: response?.data?.data?.phone2 || "",

        email1: response?.data?.data?.email1 || "",
        email2: response?.data?.data?.email2 || "",

        education_en: response?.data?.data?.education?.en || "",
        education_hi: response?.data?.data?.education?.hi || "",

        majorCourses_en: response?.data?.data?.majorCourses?.en || "",
        majorCourses_hi: response?.data?.data?.majorCourses?.hi || "",

        photoTitle: response?.data?.data?.photoTitle || "",

        researchInterest_en: response?.data?.data?.researchInterest?.en || "",
        researchInterest_hi: response?.data?.data?.researchInterest?.hi || "",

        publications_en: response?.data?.data?.publications?.en || "",
        publications_hi: response?.data?.data?.publications?.hi || "",

        IPR_en: response?.data?.data?.IPR?.en || "",
        IPR_hi: response?.data?.data?.IPR?.hi || "",

        awards_en: response?.data?.data?.awards?.en || "",
        awards_hi: response?.data?.data?.awards?.hi || "",

        externallyFundedProjects_en:
          response?.data?.data?.externallyFundedProjects?.en || "",
        externallyFundedProjects_hi:
          response?.data?.data?.externallyFundedProjects?.hi || "",

        photo: response?.data?.data?.photo || null,

        //  LAB PROFILE MAPPING (IMPORTANT)
        labProfile: response?.data?.data?.labProfile?.map((lab) => ({
          name: {
            en: lab?.name?.en || "",
            hi: lab?.name?.hi || "",
          },
          position: {
            en: lab?.position?.en || "",
            hi: lab?.position?.hi || "",
          },
          duration: {
            en: lab?.duration?.en || "",
            hi: lab?.duration?.hi || "",
          },
          project: {
            en: lab?.project?.en || "",
            hi: lab?.project?.hi || "",
          },
          ImageTitle: lab?.ImageTitle || "",
          photo: lab?.photo1 || null, // backend me photo1 hai
        })) || [
          {
            name: { en: "", hi: "" },
            position: { en: "", hi: "" },
            duration: { en: "", hi: "" },
            project: { en: "", hi: "" },
            ImageTitle: "",
            photo: null,
          },
        ],
        galleryPhotos: response?.data?.data?.galleryPhotos?.map(
          (img, index) => ({
            id: img?._id || Date.now() + index,
            galleryPhotostitle: img?.galleryPhotostitle || "",
            galleryPhotos: img?.galleryPhotos || null,
            orderNumberGallery: img?.orderNumberGallery || 0,
            previewImage: img?.galleryPhotos
              ? `${IMG_BASE_URL}/${img.galleryPhotos}`
              : "",
          }),
        ) || [
          {
            galleryPhotostitle: "",
            galleryPhotos: null,
            orderNumberGallery: 0,
            previewImage: "",
          },
        ],

        isActive: response?.data?.data?.isActive ?? true,
      });
      if (response?.data?.data?.photo) {
        setPreview(`${IMG_BASE_URL}/${response?.data?.data.photo}`);
      } else {
        setPreview(null);
      }
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
    if (scientistId) {
      getScientistData(scientistId);
    }
  }, [scientistId]);

  const [designation, setDesignation] = useState([]);
  const [tab, setTab] = useState(0);
  // console.log("data", data);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
  };

  const handleChange = (e, index = null) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      const file = files?.[0];
      if (!file) return;

      if (name === "photo") {
        setData((prev) => ({ ...prev, photo: file }));
        setPreview(URL.createObjectURL(file));
      } else if (name.startsWith("labProfilePhoto") && index !== null) {
        // Lab profile photo
        const updatedLabProfile = [...data.labProfile];
        updatedLabProfile[index].photo = file;
        setData((prev) => ({ ...prev, labProfile: updatedLabProfile }));
      }
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
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

  const handleLabProfileChange = (index, e) => {
    const { name, value, files } = e.target;

    const updated = [...data.labProfile];

    const item = {
      ...updated[index],
      name: { ...updated[index]?.name },
      position: { ...updated[index]?.position },
      duration: { ...updated[index]?.duration },
      project: { ...updated[index]?.project },
    };

    if (name === "photo") {
      item.photo = files?.[0] || null;
    } else {
      switch (name) {
        case "name_en":
          item.name.en = value;
          break;

        case "name_hi":
          item.name.hi = value;
          break;

        case "position_en":
          item.position.en = value;
          break;

        case "position_hi":
          item.position.hi = value;
          break;

        case "duration_en":
          item.duration.en = value;
          break;

        case "duration_hi":
          item.duration.hi = value;
          break;

        case "project_en":
          item.project.en = value;
          break;

        case "project_hi":
          item.project.hi = value;
          break;

        case "ImageTitle":
          item.ImageTitle = value;
          break;

        default:
          break;
      }
    }

    updated[index] = item;

    setData({
      ...data,
      labProfile: updated,
    });
  };

  const addLabProfile = () => {
    setData((prev) => ({
      ...prev,
      labProfile: [
        ...prev.labProfile,
        {
          name: { en: "", hi: "" },
          position: { en: "", hi: "" },
          duration: { en: "", hi: "" },
          project: { en: "", hi: "" },
          ImageTitle: "",
          photo: null,
        },
      ],
    }));
  };

  const deleteLabProfile = (index) => {
    const updated = data.labProfile.filter((_, i) => i !== index);
    setData({ ...data, labProfile: updated });
  };

  const handleGalleryPhotosChange = (index, e) => {
    const { name, value, files } = e.target;

    const updated = [...data.galleryPhotos];

    const item = {
      ...updated[index],
      galleryPhotostitle: updated[index]?.galleryPhotostitle || "",
      galleryPhotos: updated[index]?.galleryPhotos || null,
      orderNumberGallery: updated[index]?.orderNumberGallery || "",
      previewImage: updated[index]?.previewImage || null,
    };

    if (name === "galleryPhotos") {
      const file = files?.[0] || null;

      item.galleryPhotos = file;

      if (file) {
        item.previewImage = URL.createObjectURL(file);
      }
    } else {
      switch (name) {
        case "galleryPhotostitle":
          item.galleryPhotostitle = value;
          break;

        case "orderNumberGallery":
          item.orderNumberGallery = value;
          break;
      }
    }

    updated[index] = item;

    setData((prev) => ({
      ...prev,
      galleryPhotos: updated,
    }));
  };

  const addGalleryPhotos = () => {
    setData((prev) => ({
      ...prev,
      galleryPhotos: [
        ...prev.galleryPhotos,
        {
          id: Date.now(),
          galleryPhotostitle: "",
          galleryPhotos: null,
          orderNumberGallery: "",
          previewImage: "",
        },
      ],
    }));
  };

  const deletegalleryPhotos = (index) => {
    setData((prev) => {
      const updated = [...prev.galleryPhotos];

      if (updated.length > 1) {
        updated.splice(index, 1);
      } else {
        updated[index] = {
          ...updated[index],
          galleryPhotostitle: "",
          galleryPhotos: null,
          previewImage: "",
          orderNumberGallery: 0,
          isDeleted: true,
        };
      }

      return {
        ...prev,
        galleryPhotos: updated,
      };
    });
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("scientistName_en", data.scientistName_en || "");
    formData.append("scientistName_hi", data.scientistName_hi || "");
    formData.append("designationId", data?.designationId || "");
    formData.append("phone1", data.phone1 || "");
    formData.append("phone2", data.phone2 || "");
    formData.append("email1", data.email1 || "");
    formData.append("email2", data.email2 || "");
    formData.append("education_en", data.education_en || "");
    formData.append("education_hi", data.education_hi || "");
    formData.append("majorCourses_en", data.majorCourses_en || "");
    formData.append("majorCourses_hi", data.majorCourses_hi || "");
    formData.append("photoTitle", data.photoTitle || "");
    formData.append("researchInterest_en", data.researchInterest_en || "");
    formData.append("researchInterest_hi", data.researchInterest_hi || "");
    formData.append("publications_en", data.publications_en || "");
    formData.append("publications_hi", data.publications_hi || "");
    formData.append("IPR_en", data.IPR_en || "");
    formData.append("IPR_hi", data.IPR_hi || "");
    formData.append("awards_en", data.awards_en || "");
    formData.append("awards_hi", data.awards_hi || "");
    formData.append(
      "externallyFundedProjects_en",
      data.externallyFundedProjects_en || "",
    );
    formData.append(
      "externallyFundedProjects_hi",
      data.externallyFundedProjects_hi || "",
    );
    formData.append("isActive", data.isActive);

    if (data.photo && typeof data.photo !== "string") {
      formData.append("photo", data.photo);
    }

    const cleangalleryPhotos = data?.galleryPhotos
      .filter((item) => !item.isDeleted)
      .map((item, index) => ({
        galleryPhotostitle: item?.galleryPhotostitle || "",
        orderNumberGallery: Number(item?.orderNumberGallery || 0),
        photoKey: `galleryPhotos_${index}`,
      }));

    formData.append("galleryPhotos", JSON.stringify(cleangalleryPhotos));

    // files
    data?.galleryPhotos.forEach((item, index) => {
      if (item?.galleryPhotos && typeof item.galleryPhotos !== "string") {
        formData.append(`galleryPhotos_${index}`, item.galleryPhotos);
      }
    });
    const cleanLabProfile = data.labProfile.map((item, index) => ({
      name: item.name,
      position: item.position,
      project: item.project,
      duration: item.duration,
      ImageTitle: item.ImageTitle || "",
      photoKey: `labProfilePhotos_${index}`,
    }));

    // labProfile JSON
    formData.append("labProfile", JSON.stringify(cleanLabProfile));

    // labProfile Photos with index
    data.labProfile.forEach((item, index) => {
      if (item?.photo && typeof item.photo !== "string") {
        formData.append(`labProfilePhotos_${index}`, item.photo);
      }
    });
    // for (let [key, value] of formData.entries()) {
    //   console.log("key, value", key, value);
    // }
    try {
      let response;

      response = await axios.put(
        `${API_URL}/ScientistRoutes/update/${scientistId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      formRef.current.reset();

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: response.data.message || "Scientist updated successfully",
        confirmButtonColor: "#3085d6",
      });
      getScientistData();
      // handleClose();
      getScientistData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Server error",
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

  console.log("data", data?.galleryPhotos);

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Update Scientist Details</div>
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
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  minHeight: "48px",
                  "& .MuiTabs-flexContainer": {
                    gap: "8px", // optional spacing
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    // fontWeight: 500,
                    // minWidth: "200px",
                    // maxWidth: "200px",
                    width: "200px",
                    fontSize: { xs: "11px", sm: "13px", md: "15px" },
                    padding: { xs: "6px 10px", sm: "8px 16px" },
                  },
                }}
              >
                <Tab label="Basic Info" />
                <Tab label="Research Interest" />
                <Tab label="Publications" />
                <Tab label="IPR (Patent / Copyright)" />
                <Tab label="Awards & Honors" />
                <Tab label="Externally funded Projects" />
                <Tab label="Lab Profile and Lab photo" />
                <Tab label="Gallery Photos" />
              </Tabs>
            </Box>

            {/* TAB 1 */}
            <CustomTabPanel value={tab} index={0}>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="validationCustom02" className="form-label">
                      Scientist Name (English)
                    </label>
                    <input
                      type="text"
                      name="scientistName_en"
                      value={data?.scientistName_en}
                      onChange={handleChange}
                      className="form-control"
                      id="scientistName_en"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationCustom02" className="form-label">
                      Scientist Name (Hindi)
                    </label>
                    <input
                      type="text"
                      name="scientistName_hi"
                      value={data?.scientistName_hi}
                      onChange={handleChange}
                      className="form-control"
                      id="scientistName_hi"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      phone 1
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="number"
                        name="phone1"
                        value={data?.phone1}
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
                      phone 2
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="number"
                        name="phone2"
                        value={data?.phone2}
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
                      Email 1
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="email1"
                        name="email1"
                        value={data?.email1}
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
                      Email 2
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="email2"
                        name="email2"
                        value={data?.email2}
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
                      Education (English)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="education_en"
                        value={data?.education_en}
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
                      Education (Hindi)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="education_hi"
                        value={data?.education_hi}
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
                      Major Courses associated with (English)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="majorCourses_en"
                        value={data?.majorCourses_en}
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
                      Major Courses associated with (Hindi)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="majorCourses_hi"
                        value={data?.majorCourses_hi}
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
                      Designation
                    </label>
                    <select
                      name="designationId"
                      value={data?.designationId}
                      onChange={handleChange}
                      className="form-control"
                      required
                    >
                      <option value="">select</option>
                      {designation?.map((item, index) => {
                        return (
                          <option key={item?.id} value={item?.id}>
                            {item?.name?.en}
                          </option>
                        );
                      })}
                    </select>
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
                    <label htmlFor="validationCustom03" className="form-label">
                      Image Title
                    </label>
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
                    </div>
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
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            {/* TAB 2 */}
            <CustomTabPanel value={tab} index={1}>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">
                      Research Interest (English)
                    </label>
                    {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.researchInterest_en}
                      config={{
                        showPoweredBy: false,
                        placeholder: "",
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                      }}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          researchInterest_en: newContent,
                        }));
                      }}
                    /> */}
                    <JoditEditor
                      ref={editor}
                      value={data?.researchInterest_en}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          researchInterest_en: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                  <div></div>
                  <div className="col-md-12">
                    <label className="form-label fw-bold">
                      Research Interest (Hindi)
                    </label>
                    {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.researchInterest_hi}
                      config={{
                        showPoweredBy: false,
                        placeholder: "",
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                      }}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          researchInterest_hi: newContent,
                        }));
                      }}
                    /> */}
                    <JoditEditor
                      ref={editor}
                      value={data?.researchInterest_hi}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          researchInterest_hi: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            {/* TAB 3 */}
            <CustomTabPanel value={tab} index={2}>
              <div className="card-body">
                <div className=" g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">
                      Publications (English)
                    </label>
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
                  <div></div>
                  <div className="col-md-12">
                    <label className="form-label fw-bold">
                      Publications (Hindi)
                    </label>
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
                      value={data.publications_hi}
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
            </CustomTabPanel>
            {/* TAB 4 */}
            <CustomTabPanel value={tab} index={3}>
              <div className="card-body">
                <div className=" g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">IPR (English)</label>
                    {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.IPR_en}
                      config={{
                        showPoweredBy: false,
                        placeholder: "",
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                      }}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          IPR_en: newContent,
                        }));
                      }}
                    />
                     */}
                    <JoditEditor
                      ref={editor}
                      value={data?.IPR_en}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          IPR_en: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                  <div></div>
                  <div className="col-md-12">
                    <label className="form-label fw-bold">IPR (Hindi)</label>
                    {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.IPR_hi}
                      config={{
                        showPoweredBy: false,
                        placeholder: "",
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                      }}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          IPR_hi: newContent,
                        }));
                      }}
                    /> */}
                    <JoditEditor
                      ref={editor}
                      value={data?.IPR_hi}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          IPR_hi: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            </CustomTabPanel>

            {/* TAB 5 */}
            <CustomTabPanel value={tab} index={4}>
              <div className="card-body">
                <div className=" g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">
                      Awards (English)
                    </label>
                    {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.awards_en}
                      config={{
                        showPoweredBy: false,
                        placeholder: "",
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                      }}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          awards_en: newContent,
                        }));
                      }}
                    /> */}
                    <JoditEditor
                      ref={editor}
                      value={data.awards_en}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          awards_en: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                  <div></div>
                  <div className="col-md-12">
                    <label className="form-label fw-bold">Awards (Hindi)</label>
                    {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.awards_hi}
                      config={{
                        showPoweredBy: false,
                        placeholder: "",
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                      }}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          awards_hi: newContent,
                        }));
                      }}
                    /> */}
                    <JoditEditor
                      ref={editor}
                      value={data.awards_hi}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          awards_hi: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            {/* TAB 6 */}
            <CustomTabPanel value={tab} index={5}>
              <div className="card-body">
                <div className=" g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">
                      Externally Funded Projects (English)
                    </label>
                    {/* <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.externallyFundedProjects_en}
                      config={{
                        showPoweredBy: false,
                        placeholder: "",
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                      }}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          externallyFundedProjects_en: newContent,
                        }));
                      }}
                    /> */}
                    <JoditEditor
                      ref={editor}
                      value={data.externallyFundedProjects_en}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          externallyFundedProjects_en: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                  <div></div>
                  <div className="col-md-12">
                    <label className="form-label fw-bold">
                      Externally Funded Projects (Hindi)
                    </label>
                    <JoditEditor
                      style={{ width: "90%" }}
                      ref={editor}
                      value={data?.externallyFundedProjects_hi}
                      config={{
                        showPoweredBy: false,
                        placeholder: "",
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                      }}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          externallyFundedProjects_hi: newContent,
                        }));
                      }}
                    />
                    <JoditEditor
                      ref={editor}
                      value={data.externallyFundedProjects_hi}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => {
                        setData((prev) => ({
                          ...prev,
                          externallyFundedProjects_hi: newContent,
                        }));
                      }}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            {/* TAB 7 */}

            {/* TAB 8 */}
            <CustomTabPanel value={tab} index={7}>
              <div className="card-body tab-panel-body">
                <div className="row g-3">
                  {/* {data?.galleryPhotos?.map((item, index) => ( */}
                  {(data?.galleryPhotos?.length > 0
                    ? data.galleryPhotos
                    : [
                        {
                          galleryPhotostitle: "",
                          galleryPhotos: null,
                          orderNumberGallery: 0,
                          previewImage: "",
                        },
                      ]
                  ).map((item, index) => (
                    <div
                      key={index}
                      className="row g-3 align-items-center border p-3"
                    >
                      <div className="col-md-5">
                        <label className="form-label">
                          Gallery Photos Title
                        </label>
                        <input
                          type="text"
                          name="galleryPhotostitle"
                          value={item?.galleryPhotostitle || ""}
                          onChange={(e) => handleGalleryPhotosChange(index, e)}
                          className="form-control"
                        />
                      </div>

                      {/* Photo */}
                      <div className="col-sm-9 col-md-5">
                        <label className="form-label">Photo</label>
                        <div className="d-flex align-items-center gap-3">
                          <input
                            type="file"
                            name="galleryPhotos"
                            onChange={(e) =>
                              handleGalleryPhotosChange(index, e)
                            }
                            className="form-control upload-image-input"
                          />

                          {item?.previewImage && (
                            <img
                              src={item.previewImage}
                              alt="Preview"
                              style={{
                                marginTop: "10px",
                                height: "50px",
                                width: "50px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #ddd",
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-sm-3 col-md-2 d-flex align-items-center gap-3 mt-4 pt-sm-4">
                        {/* Delete */}
                        <div
                          type="button"
                          // onClick={() =>
                          //   data?.galleryPhotos?.length > 1 &&
                          //   deletegalleryPhotos(index)
                          // }
                          onClick={() => deletegalleryPhotos(index)}
                          // style={{
                          //   cursor:
                          //     data?.galleryPhotos?.length > 1
                          //       ? "pointer"
                          //       : "not-allowed",
                          //   opacity: data?.galleryPhotos?.length > 1 ? 1 : 0.5,
                          // }}
                          style={{
                            cursor: "pointer",
                            opacity: 1,
                          }}
                        >
                          <i className="bi bi-trash fs-4"></i>
                        </div>

                        {/* Add */}
                        <div
                          type="button"
                          onClick={addGalleryPhotos}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="bi bi-plus-circle fs-4"></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CustomTabPanel>

            <CustomTabPanel value={tab} index={6}>
              <div className="card-body">
                <div className="row g-3">
                  {data?.labProfile?.map((item, index) => (
                    <div
                      key={index}
                      className="row g-3 align-items-center border p-3"
                    >
                      {/* Name EN */}
                      <div className="col-md-5">
                        <label className="form-label">Name (English)</label>
                        <input
                          type="text"
                          name="name_en"
                          value={item?.name?.en || ""}
                          onChange={(e) => handleLabProfileChange(index, e)}
                          className="form-control"
                        />
                      </div>

                      {/* Name HI */}
                      <div className="col-md-5">
                        <label className="form-label">Name (Hindi)</label>
                        <input
                          type="text"
                          name="name_hi"
                          value={item?.name?.hi || ""}
                          onChange={(e) => handleLabProfileChange(index, e)}
                          className="form-control"
                        />
                      </div>

                      {/* Position EN */}
                      <div className="col-md-5">
                        <label className="form-label">Position (English)</label>
                        <input
                          type="text"
                          name="position_en"
                          value={item?.position?.en || ""}
                          onChange={(e) => handleLabProfileChange(index, e)}
                          className="form-control"
                        />
                      </div>

                      {/* Position HI */}
                      <div className="col-md-5">
                        <label className="form-label">Position (Hindi)</label>
                        <input
                          type="text"
                          name="position_hi"
                          value={item?.position?.hi || ""}
                          onChange={(e) => handleLabProfileChange(index, e)}
                          className="form-control"
                        />
                      </div>

                      {/* Duration EN */}
                      <div className="col-md-5">
                        <label className="form-label">Duration (English)</label>
                        <input
                          type="text"
                          name="duration_en"
                          value={item?.duration?.en || ""}
                          onChange={(e) => handleLabProfileChange(index, e)}
                          className="form-control"
                        />
                      </div>

                      {/* Duration HI */}
                      <div className="col-md-5">
                        <label className="form-label">Duration (Hindi)</label>
                        <input
                          type="text"
                          name="duration_hi"
                          value={item?.duration?.hi || ""}
                          onChange={(e) => handleLabProfileChange(index, e)}
                          className="form-control"
                        />
                      </div>

                      {/* Project EN */}
                      <div className="col-md-5">
                        <label className="form-label">Project (English)</label>
                        <input
                          type="text"
                          name="project_en"
                          value={item?.project?.en || ""}
                          onChange={(e) => handleLabProfileChange(index, e)}
                          className="form-control"
                        />
                      </div>

                      {/* Project HI */}
                      <div className="col-md-5">
                        <label className="form-label">Project (Hindi)</label>
                        <input
                          type="text"
                          name="project_hi"
                          value={item?.project?.hi || ""}
                          onChange={(e) => handleLabProfileChange(index, e)}
                          className="form-control"
                        />
                      </div>

                      {/* Image Title */}
                      <div className="col-md-5">
                        <label className="form-label">Image Title</label>
                        <input
                          type="text"
                          name="ImageTitle"
                          value={item?.ImageTitle || ""}
                          onChange={(e) => handleLabProfileChange(index, e)}
                          className="form-control"
                        />
                      </div>

                      {/* Photo */}
                      <div className="col-md-5">
                        <label className="form-label">Photo</label>
                        <input
                          type="file"
                          name="photo"
                          onChange={(e) => handleLabProfileChange(index, e)}
                          className="form-control"
                        />
                        {/* {preview && (
                          <img
                            src={preview}
                            alt="Preview"
                            style={{
                              marginLeft: "20px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        )} */}
                      </div>

                      {/* Actions */}
                      <div className="col-md-2 d-flex align-items-center gap-3 mt-4">
                        {/* Delete */}
                        <div
                          type="button"
                          onClick={() =>
                            data?.labProfile?.length > 1 &&
                            deleteLabProfile(index)
                          }
                          style={{
                            cursor:
                              data?.labProfile?.length > 1
                                ? "pointer"
                                : "not-allowed",
                            opacity: data?.labProfile?.length > 1 ? 1 : 0.5,
                          }}
                        >
                          <i className="bi bi-trash fs-4"></i>
                        </div>

                        {/* Add */}
                        <div
                          type="button"
                          onClick={addLabProfile}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="bi bi-plus-circle fs-4"></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CustomTabPanel>
            <div className="card-footer">
              <button className="btn btn-info" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateScientist;
