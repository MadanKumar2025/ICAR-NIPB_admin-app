import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import AlbumTable from "./AlbumTable";
import { jwtDecode } from "jwt-decode";
import GalleryTable from "../Gallery/GalleryTable";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import { usePermissions } from "../User_Management/UserManagement";

function Album() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [previewGallery, setPreviewGallery] = useState(null);
  const [preview, setPreview] = useState(null);
  const [allAlbum, setAllAlbum] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isGalleryEdit, setIsGalleryEdit] = useState(false);
  const [galleryeditId, setGalleryeditId] = useState(null);
  const [albumGallery, setAlbumGallery] = useState(null);
  const [allGallery, setAllGallery] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState({
    type_en: "",
    type_hi: "",
    title_en: "",
    title_hi: "",
    venue_en: "",
    venue_hi: "",
    publishDate: "",
    expiryDate: "",
    displayOrderNo: "",
    coverPic: null,
    isActive: true,
  });
  const [galleryData, setGalleryData] = useState({
    galleryTitle_en: "",
    galleryTitle_hi: "",
    type: "",
    photo: null,
    document: null,
    videoUrl: "",
  });

  const albumDataGallery = allAlbum.find((album) => album._id === albumGallery);

  // console.log("galleryData11", galleryData);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
        formData.append("type_en", data?.type_en || "");
        formData.append("type_hi", data?.type_hi || "");
        formData.append("title_en", data?.title_en || "");
        formData.append("title_hi", data?.title_hi || "");
        formData.append("venue_en", data?.venue_en || "");
        formData.append("venue_hi", data?.venue_hi || "");
        formData.append("publishDate", data?.publishDate || "");
        formData.append("expiryDate", data?.expiryDate || "");
        formData.append("displayOrderNo", data?.displayOrderNo);
        formData.append("isActive", data?.isActive);

        if (data.coverPic) {
          formData.append("coverPic", data.coverPic);
        }

        const res = await axios.put(
          `${API_URL}/album/updateAlbum/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setData({
          title_en: "",
          title_hi: "",
          venue_en: "",
          venue_hi: "",
          publishDate: "",
          expiryDate: "",
          coverPic: null,
          displayOrderNo: "",
          isActive: true,
        });
        setPreview(null);

        formRef.current.reset();
        await getAlbumData();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Update failed",
        });
      }
    } else {
      const formData = new FormData();

      formData.append("type_en", data?.type_en || "");
      formData.append("type_hi", data?.type_hi || "");
      formData.append("title_en", data?.title_en || "");
      formData.append("title_hi", data?.title_hi || "");
      formData.append("venue_en", data?.venue_en || "");
      formData.append("venue_hi", data?.venue_hi || "");
      formData.append("publishDate", data?.publishDate || "");
      formData.append("expiryDate", data?.expiryDate || "");
      formData.append("displayOrderNo", data?.displayOrderNo || "");
      formData.append("coverPic", data?.coverPic || "");
      formData.append("isActive", data?.isActive);

      try {
        const response = await axios.post(`${API_URL}/album/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("response", response);

        setData({
          type_en: "",
          type_hi: "",
          title_en: "",
          title_hi: "",
          venue_en: "",
          venue_hi: "",
          publishDate: "",
          expiryDate: "",
          coverPic: null,
          displayOrderNo: null,
          isActive: true,
        });
        setPreview(null);

        formRef.current.reset();
        await getAlbumData();
        Swal.fire({
          icon: "success",
          title: "Album Details",
          text: response.data.message || "Album Details Successfully.",
          confirmButtonColor: "#3085d6",
        });
        // getEventData();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Server error",
        });
      }
    }
  };

  const getAlbumData = async () => {
    try {
      const response = await axios.get(`${API_URL}/album/allAlbum`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllAlbum(response?.data?.data);
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
    getAlbumData();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/album/updateStatus/${item?._id}`,
        {
          isActive: !item.isActive,
          updateby: decoded.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAllAlbum((prev) =>
        prev.map((row) =>
          row._id === item._id ? { ...row, isActive: !row.isActive } : row,
        ),
      );
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleEdit = (item) => {
    setData({
      type_en: item?.type?.en,
      type_hi: item?.type?.hi,
      title_en: item?.title?.en,
      title_hi: item?.title?.hi,
      venue_en: item?.venue?.en,
      venue_hi: item?.venue?.hi,
      displayOrderNo: item?.displayOrderNo,
      publishDate: item?.publishDate ? item.publishDate.split("T")[0] : "",
      expiryDate: item?.expiryDate ? item.expiryDate.split("T")[0] : "",
      isActive: item?.isActive ?? true,
    });

    if (item?.coverPic !== null) {
      setPreview(`${IMG_BASE_URL}/${item?.coverPic}`);
    }

    setEditId(item?.id);
    setIsEdit(true);
  };

  // Gallery

  // const galleryHandleChange = (e) => {
  //   const { name, value, files } = e.target;

  //   setGalleryData((prev) => {
  //     const updated = { ...prev };

  //     switch (name) {
  //       case "type":
  //         updated.type = value;

  //         if (value === "Photo") {
  //           updated.videoUrl = "";
  //         }

  //         if (value === "Video") {
  //           updated.photo = null;
  //           setPreviewGallery(null);
  //         }
  //         break;

  //       case "photo":
  //         if (files && files[0]) {
  //           updated.photo = files[0];

  //           // Preview image
  //           setPreviewGallery(URL.createObjectURL(files[0]));
  //         }
  //         break;

  //       case "videoUrl":
  //         updated.videoUrl = value;
  //         break;

  //       default:
  //         updated[name] = value;
  //     }

  //     return updated;
  //   });
  // };

  const galleryHandleChange = (e) => {
    const { name, value, files } = e.target;

    setGalleryData((prev) => {
      const updated = { ...prev };

      switch (name) {
        // ================= TYPE CHANGE =================
        case "type":
          updated.type = value;

          if (value === "photo") {
            updated.videoUrl = "";
            updated.document = null;
          }

          if (value === "video") {
            updated.photo = null;
            updated.document = null;
            setPreviewGallery(null);
          }

          if (value === "document") {
            updated.photo = null;
            updated.videoUrl = "";
            setPreviewGallery(null);
          }
          break;

        // ================= PHOTO =================
        case "photo":
          if (files && files[0]) {
            updated.photo = files[0];
            updated.document = null;

            setPreviewGallery(URL.createObjectURL(files[0]));
          }
          break;

        // ================= DOCUMENT =================
        case "document":
          if (files && files[0]) {
            updated.document = files[0];
            updated.photo = null;

            setPreviewGallery(null);
          }
          break;

        // ================= VIDEO =================
        case "videoUrl":
          updated.videoUrl = value;
          break;

        default:
          updated[name] = value;
      }

      return updated;
    });
  };

  const galleryhandleSubmit = async (e) => {
    e.preventDefault();
    if (isGalleryEdit) {
      try {
        const formData = new FormData();

        formData.append("title_en", galleryData?.galleryTitle_en || "");
        formData.append("title_hi", galleryData?.galleryTitle_hi || "");
        formData.append("type", galleryData?.type || "");
        formData.append("videoUrl", galleryData?.videoUrl || "");
        formData.append("albumId", albumGallery || null);
        formData.append("isActive", galleryData?.isActive);

        if (galleryData?.photo) {
          formData.append("photo", galleryData?.photo);
        }
        if (galleryData?.document) {
          formData.append("document", galleryData.document);
        }
        const res = await axios.put(
          `${API_URL}/gallery/updateGallery/${galleryeditId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setGalleryData({
          galleryTitle_en: "",
          galleryTitle_hi: "",
          type: "",
          photo: null,
          document: null,
          videoUrl: "",
        });

        setIsGalleryEdit(false);
        setPreview(null);

        formRef.current.reset();
        await getGalleryData();
      } catch (error) {
        // Swal.fire({
        //   icon: "error",
        //   title: "Error",
        //   text: error?.response?.data?.message || "Update failed",
        // });
        alert(error?.response?.data?.message || "Update failed");
      }
    } else {
      const formData = new FormData();

      formData.append("title_en", galleryData?.galleryTitle_en || "");
      formData.append("title_hi", galleryData?.galleryTitle_hi || "");
      formData.append("type", galleryData?.type || "");
      formData.append("photo", galleryData?.photo || "");
      formData.append("videoUrl", galleryData?.videoUrl || "");
      formData.append("albumId", albumGallery || null);
      formData.append("isActive", galleryData?.isActive);
      if (galleryData?.document) {
        formData.append("document", galleryData.document);
      }
      try {
        const response = await axios.post(
          `${API_URL}/gallery/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setGalleryData({
          galleryTitle_en: "",
          galleryTitle_hi: "",
          type: "",
          photo: null,
          document: null,
          videoUrl: "",
        });
        setPreview(null);

        formRef.current.reset();

        // Swal.fire({
        //   toast: true,
        //   position: "top",
        //   icon: "success",
        //   title: "Organization Details",
        //   text: response.data.message || "Organization Details Successfully.",
        //   confirmButtonColor: "#3085d6",
        // });
        // alert(response.data.message || "Organization Details Successfully.",)
        await getGalleryData();
      } catch (error) {
        // Swal.fire({
        //   toast: true,
        //   position: "top",
        //   icon: "error",
        //   title: "Error",
        //   text: error?.response?.data?.message || "Server error",
        // });
        alert(error?.response?.data?.message || "Server error");
      }
    }
  };

  const getGalleryData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/gallery/getGalleryByAlbumId/${albumGallery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAllGallery(response?.data?.data);
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
    if (open) {
      getGalleryData();
    }
  }, [open]);

  const GalleryhandleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/gallery/updateGalleryStatus/${item?.id}`,
        {
          isActive: !item.isActive,
          updateby: decoded.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAllGallery((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, isActive: !row.isActive } : row,
        ),
      );
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setGalleryData({
      galleryTitle_en: "",
      galleryTitle_hi: "",
      type: "",
      photo: null,
      document: null,
      videoUrl: "",
    });
  };

  const galleryhandleEdit = (item) => {
    setGalleryData({
      galleryTitle_en: item?.title?.en,
      galleryTitle_hi: item?.title?.hi,
      type: item?.type,
      photo: item?.photo,
      document: item?.document,
      videoUrl: item?.videoUrl,
      isActive: item?.isActive ?? true,
    });

    if (item?.coverPic !== null) {
      setPreviewGallery(`${IMG_BASE_URL}/${item?.photo}`);
    }

    setGalleryeditId(item?._id);
    setIsGalleryEdit(true);
  };

  const AlbumhandleClose = () => {
    setData({
      type_en: "",
      type_hi: "",
      title_en: "",
      title_hi: "",
      venue_en: "",
      venue_hi: "",
      publishDate: "",
      expiryDate: "",
      coverPic: null,
      isActive: true,
    });
    setPreview(null);
    setIsEdit(false);
    setEditId(null);
  };

  // console.log("data", data);

  return (
    <>
      <div>
        {(hasAddAccess("Album") || hasAddAccess("Facilities")|| hasAddAccess("Outreach programme")) && (
          <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-header">
                <div className="card-title">Create Album</div>
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
                        htmlFor="validationCustom01"
                        className="form-label"
                      >
                        Type (English)
                      </label>
                      <select
                        name="type_en"
                        className="form-control"
                        value={data?.type_en}
                        onChange={handleChange}
                        id="type_en"
                      >
                        <option value="">select</option>
                        <option value="Album">Album</option>
                        <option value="StudentCorner">Student Corner</option>
                        <option value="Outreach Programme">
                          Outreach programme
                        </option>
                        <option value="Facilities">Facilities</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom01"
                        className="form-label"
                      >
                        Type (HIndi)
                      </label>
                      <select
                        name="type_hi"
                        className="form-control"
                        value={data?.type_hi}
                        onChange={handleChange}
                        id="type_hi"
                      >
                        <option value="">select</option>
                        <option value="एल्बम">एल्बम</option>
                        <option value="विद्यार्थी कॉर्नर">विद्यार्थी कॉर्नर</option>
                        <option value="सामुदायिक कार्यक्रम">
                          सामुदायिक कार्यक्रम
                        </option>
                        <option value="सुविधाएँ">सुविधाएँ</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom01"
                        className="form-label"
                      >
                        Album Title (English)
                      </label>
                      <input
                        type="text"
                        name="title_en"
                        value={data?.title_en}
                        onChange={handleChange}
                        className="form-control"
                        id="title_en"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom01"
                        className="form-label"
                      >
                        Album Title (Hindi)
                      </label>
                      <input
                        type="text"
                        name="title_hi"
                        value={data?.title_hi}
                        onChange={handleChange}
                        className="form-control"
                        id="title_hi"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom03"
                        className="form-label"
                      >
                        Venue (English)
                      </label>
                      <input
                        type="text"
                        name="venue_en"
                        value={data?.venue_en}
                        onChange={handleChange}
                        className="form-control"
                        id="venue_en"
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom03"
                        className="form-label"
                      >
                        Venue (Hindi)
                      </label>
                      <input
                        type="text"
                        name="venue_hi"
                        value={data?.venue_hi}
                        onChange={handleChange}
                        className="form-control"
                        id="venue_hi"
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom02"
                        className="form-label"
                      >
                        Publish Date
                      </label>
                      <input
                        type="date"
                        name="publishDate"
                        value={data?.publishDate}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustom03"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom02"
                        className="form-label"
                      >
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={data?.expiryDate}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustom03"
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom02"
                        className="form-label"
                      >
                        Display Order No.
                      </label>
                      <input
                        type="number"
                        name="displayOrderNo"
                        value={data?.displayOrderNo}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustomUsername"
                        className="form-label"
                      >
                        cover Photo
                      </label>

                      <input
                        type="file"
                        name="coverPic"
                        onChange={handleChange}
                        className="form-control upload-image-input"
                        id="validationCustom03"
                      />
                      {preview && (
                        <a href={preview} target="_blank" rel="noreferrer">
                          View Document
                        </a>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Is Active</label>
                      <select
                        name="isActive"
                        value={data?.isActive}
                        //   onChange={handleChange}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            isActive: e.target.value === "true",
                          }))
                        }
                        className="form-control"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="card-footer d-flex">
                  <button className="btn btn-info" type="submit">
                    {/* {isEdit ? "Update User" : "Submit form"} */}
                    {isEdit ? "Update" : "Save"}
                    {/* Save */}
                  </button>
                  <button
                    className="btn btn-info ms-auto"
                    onClick={AlbumhandleClose}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Gallery */}
        <Modal
          open={open}
          disableEscapeKeyDown
          onClose={(event, reason) => {
            if (reason === "backdropClick") return;
            handleClose();
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            style={{
              width: "90%",
              marginLeft: "5%",
              marginTop: "3vh",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-header w-100 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 w-50">Add Gallery</h5>
                <div className="w-50 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleClose}
                  >
                    ✖
                  </button>
                </div>
              </div>

              <h1 style={{ paddingLeft: "1.5vw", marginTop: "1vh" }}>
                Album Name :- {albumDataGallery?.title?.en}
              </h1>

              <form
                className="needs-validation"
                ref={formRef}
                onSubmit={galleryhandleSubmit}
              >
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom03"
                        className="form-label"
                      >
                        Title (English)
                      </label>
                      <input
                        type="text"
                        name="galleryTitle_en"
                        value={galleryData?.galleryTitle_en}
                        onChange={galleryHandleChange}
                        className="form-control"
                        id="galleryTitle_en"
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom03"
                        className="form-label"
                      >
                        Title (Hindi)
                      </label>
                      <input
                        type="text"
                        name="galleryTitle_hi"
                        value={galleryData?.galleryTitle_hi}
                        onChange={galleryHandleChange}
                        className="form-control"
                        id="galleryTitle_hi"
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom03"
                        className="form-label"
                      >
                        Type
                      </label>
                      <select
                        name="type"
                        value={galleryData?.type}
                        onChange={galleryHandleChange}
                        className="form-control"
                        id="type"
                      >
                        <option value="">select</option>
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                      </select>
                      <div className="invalid-feedback">
                        Please provide a Type.
                      </div>
                    </div>
                    {galleryData?.type === "photo" && (
                      <div className="col-md-6">
                        <label
                          htmlFor="validationCustomUsername"
                          className="form-label"
                        >
                          Gallery Photo
                        </label>

                        <input
                          type="file"
                          name="photo"
                          onChange={galleryHandleChange}
                          className="form-control"
                          id="validationCustom03"
                        />
                        {previewGallery && (
                          <a
                            href={previewGallery}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Document
                          </a>
                        )}
                      </div>
                    )}
                    {galleryData?.type === "document" && (
                      <div className="col-md-6">
                        <label className="form-label">
                          Document (PDF/DOC/DOCX)
                        </label>

                        <input
                          type="file"
                          name="document"
                          onChange={galleryHandleChange}
                          className="form-control"
                        />

                        {previewGallery && (
                          <a
                            href={previewGallery}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Document
                          </a>
                        )}
                      </div>
                    )}
                    {galleryData?.type === "video" && (
                      <div className="col-md-6">
                        <label
                          htmlFor="validationCustom03"
                          className="form-label"
                        >
                          YouTube Video Embed Code Link
                        </label>
                        <input
                          type="text"
                          name="videoUrl"
                          value={galleryData.videoUrl}
                          onChange={galleryHandleChange}
                          className="form-control"
                          id="validationCustom03"
                        />
                        <div className="invalid-feedback">
                          Please provide a video line.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-footer">
                  <button className="btn btn-info" type="submit">
                    {/* {isEdit ? "Update User" : "Submit form"} */}
                    {/* {isEdit ? "Update" : "Save"} */}
                    Save Gallery
                  </button>
                </div>
              </form>
              <div
                className="card mb-4"
                style={{ width: "90%", marginLeft: "5%" }}
              >
                <GalleryTable
                  data={allGallery || []}
                  GalleryhandleToggle={GalleryhandleToggle}
                  galleryhandleEdit={galleryhandleEdit}
                  pagination={pagination}
                  setPagination={setPagination}
                />
              </div>
            </div>
          </Box>
        </Modal>
        {/* Gallery */}

        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <AlbumTable
            data={allAlbum || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            pagination={pagination}
            setPagination={setPagination}
            setAlbumGallery={setAlbumGallery}
            handleOpen={handleOpen}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
            hasAddAccess={hasAddAccess}
          />
        </div>
      </div>
    </>
  );
}

export default Album;
