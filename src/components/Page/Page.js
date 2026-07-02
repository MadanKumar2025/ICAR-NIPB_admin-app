import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { isAction } from "@reduxjs/toolkit";
import PageTable from "./PageTable";
import { usePermissions } from "../User_Management/UserManagement";

function Page() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [template, setTemplate] = useState([]);
  const [apiFunctionMapping, setApiFunctionMapping] = useState([]);
  const [isSlugGenerated, setIsSlugGenerated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allPage, setAllpage] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState({
    pageTitle_en: "",
    pageTitle_hi: "",
    slug: "",
    subtitle_en: "",
    subtitle_hi: "",
    metaDescription: "",
    designTemplate: "",
    keyword: "",
    seoPageType: "",
    imageTitle: "",
    apiName: "",
    photo: null,
  });

  const token = localStorage.getItem("token");
  const formRef = useRef();

  const getTemplate = async (page = 1, combinedData = []) => {
    try {
      const response = await axios.get(
        `${API_URL}/templates/list?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newCombinedData = [...combinedData, ...response.data.data];
      if (page < response.data.totalPages) {
        return getTemplate(page + 1, newCombinedData);
      } else {
        setTemplate(newCombinedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (
        error.response?.data?.message === "Invalid token" ||
        error.response?.status === 401
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];

      setData({
        ...data,
        [name]: file,
      });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      if (name === "slug") {
        setData({
          ...data,
          [name]: value.replace(/\s+/g, "-").toLowerCase(),
        });
        setIsSlugGenerated(true);
      } else {
        setData({
          ...data,
          [name]: value,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      try {
        const formData = new FormData();

        formData.append("pageTitle_en", data?.pageTitle_en);
        formData.append("pageTitle_hi", data?.pageTitle_hi);
        formData.append("slug", data?.slug);
        formData.append("subtitle_en", data?.subtitle_en);
        formData.append("subtitle_hi", data?.subtitle_hi);
        formData.append("metaDescription", data?.metaDescription);
        formData.append("designTemplate", data?.designTemplate);
        formData.append("keyword", data?.keyword);
        formData.append("seoPageType", data?.seoPageType);
        formData.append("apiName", data?.apiName);
        formData.append("imageTitle", data?.imageTitle);

        if (data?.photo) {
          formData.append("photo", data.photo);
        }

        formData.append("isActive", data?.isActive);

        console.log("formData111", formData);

        const res = await axios.put(
          `${API_URL}/pages/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setData({
          pageTitle_en: "",
          pageTitle_hi: "",
          slug: "",
          subtitle_en: "",
          subtitle_hi: "",
          metaDescription: "",
          designTemplate: "",
          keyword: "",
          seoPageType: "",
          imageTitle: "",
          apiName: "",
          photo: null,
        });

        setPreview(null);
        formRef.current.reset();

        getAllPage(currentPage);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Update failed",
        });
      }
    } else {
      const formData = new FormData();

      formData.append("pageTitle_en", data?.pageTitle_en);
      formData.append("pageTitle_hi", data?.pageTitle_hi);
      formData.append("slug", data?.slug);
      formData.append("subtitle_en", data?.subtitle_en);
      formData.append("subtitle_hi", data?.subtitle_hi);
      formData.append("metaDescription", data?.metaDescription);
      formData.append("designTemplate", data?.designTemplate);
      formData.append("keyword", data?.keyword);
      formData.append("seoPageType", data?.seoPageType);
      formData.append("imageTitle", data?.imageTitle);
      formData.append("apiName", data?.apiName);
      formData.append("photo", data?.photo);

      try {
        const response = await axios.post(`${API_URL}/pages/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setData({
          pageTitle_en: "",
          pageTitle_hi: "",
          slug: "",
          subtitle_en: "",
          subtitle_hi: "",
          metaDescription: "",
          designTemplate: "",
          keyword: "",
          seoPageType: "",
          imageTitle: "",
          apiName: "",
          photo: null,
        });
        setPreview(null);

        formRef.current.reset();
        getAllPage(currentPage);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Server error",
        });
      }
    }
  };

  const handleSlugClick = () => {
    if (!isSlugGenerated) {
      setData({
        ...data,
        slug: data.pageTitle_en.replace(/\s+/g, "-").toLowerCase(),
      });
      setIsSlugGenerated(true);
    }
  };

  const getAllPage = async (page = 1) => {
    try {
      const response = await axios.get(`${API_URL}/pages/allPage?all=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllpage(response.data);

      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.data?.message === "Invalid token") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  // ApiFunctionMapping

  const getApiFunctionMapping = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_URL}/ApiFunctionMappingRoutes/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApiFunctionMapping(response?.data?.data);
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
    getAllPage(currentPage);
    getTemplate();
    getApiFunctionMapping();
  }, []);

  const handleToggle = async (item) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/pages/status/${item?._id}`,
        {
          isActive: !item?.isActive,
          updateby: decoded?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      getAllPage(currentPage);
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleEdit = (item) => {
    // console.log("item",item);
    setData({
      pageTitle_en: item?.pageTitle?.en,
      pageTitle_hi: item?.pageTitle?.hi,
      slug: item?.slug,
      metaDescription: item?.metaDescription,
      designTemplate: item?.designTemplate?._id,
      subtitle_en: item?.subtitle?.en,
      subtitle_hi: item?.subtitle?.hi,
      keyword: item?.keyword,
      seoPageType: item?.seoPageType,
      imageTitle: item?.imageTitle,
      apiName: item?.apiName,
      photo: null,
      isActive: item.isActive,
    });

    setPreview(`${IMG_BASE_URL}/${item?.photo}`);
    setEditId(item._id);
    setIsEdit(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
// console.log("allPage",allPage);

  return (
    <>
      <div>
        {hasAddAccess("Page") && (
          <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-header">
                <div className="card-title">Create page</div>
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
                        Page Title (English)
                      </label>
                      <input
                        type="text"
                        name="pageTitle_en"
                        value={data?.pageTitle_en}
                        onChange={handleChange}
                        className="form-control"
                        id="pageTitle_en"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom01"
                        className="form-label"
                      >
                        Page Title (Hindi)
                      </label>
                      <input
                        type="text"
                        name="pageTitle_hi"
                        value={data?.pageTitle_hi}
                        onChange={handleChange}
                        className="form-control"
                        id="pageTitle_hi"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom02"
                        className="form-label"
                      >
                        Display URL
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={data?.slug}
                        onChange={handleChange}
                        onFocus={handleSlugClick}
                        className="form-control"
                        id="validationCustom02"
                        required
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom01"
                        className="form-label"
                      >
                        Sub-Title (English)
                      </label>
                      <input
                        type="text"
                        name="subtitle_en"
                        value={data?.subtitle_en}
                        onChange={handleChange}
                        className="form-control"
                        id="subtitle_en"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom01"
                        className="form-label"
                      >
                        Sub-Title (Hindi)
                      </label>
                      <input
                        type="text"
                        name="subtitle_hi"
                        value={data?.subtitle_hi}
                        onChange={handleChange}
                        className="form-control"
                        id="subtitle_hi"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustomUsername"
                        className="form-label"
                      >
                        Meta Description
                      </label>
                      <div className="input-group has-validation">
                        <input
                          type="text"
                          name="metaDescription"
                          value={data?.metaDescription}
                          onChange={handleChange}
                          className="form-control"
                          id="validationCustomUsername"
                          aria-describedby="inputGroupPrepend"
                        />
                        <div className="invalid-feedback">
                          Please choose a Meta Description..
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustomUsername"
                        className="form-label"
                      >
                        Key Word
                      </label>
                      <div className="input-group has-validation">
                        <input
                          type="text"
                          name="keyword"
                          value={data?.keyword}
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
                        Seo Page Type
                      </label>
                      <div className="input-group has-validation">
                        <input
                          type="text"
                          name="seoPageType"
                          value={data?.seoPageType}
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
                        Image Title
                      </label>
                      <div className="input-group has-validation">
                        <input
                          type="text"
                          name="imageTitle"
                          value={data?.imageTitle}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom03"
                        className="form-label"
                      >
                        Design Template
                      </label>
                      <select
                        name="designTemplate"
                        className="form-control"
                        value={data?.designTemplate}
                        onChange={handleChange}
                        id="validationCustom03"
                      >
                        <option>select</option>
                        {template?.map((item, index) => {
                          return (
                            <option key={index} value={item?._id}>
                              {item?.templateName}
                            </option>
                          );
                        })}
                      </select>

                      <div className="invalid-feedback">
                        Please provide a Design Template.
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom05"
                        className="form-label"
                      >
                        Photo
                      </label>
                      <input
                        type="file"
                        name="photo"
                        onChange={handleChange}
                        className="form-control upload-image-input"
                        id="validationCustom05"
                      />
                      {preview && (
                        <div style={{ marginTop: "10px" }}>
                          <img
                            src={preview}
                            alt="Preview"
                            style={{
                              // width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      )}
                      <div className="invalid-feedback">
                        Please provide a Photo.
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom03"
                        className="form-label"
                      >
                        Functionality Name
                      </label>
                      <select
                        name="apiName"
                        className="form-control"
                        value={data?.apiName}
                        onChange={handleChange}
                        id="apiName"
                      >
                        <option>select</option>
                        {apiFunctionMapping?.map((item, index) => {
                          return (
                            <option key={index} value={item?.apiName}>
                              {item?.functionalityName}
                            </option>
                          );
                        })}
                      </select>

                      <div className="invalid-feedback">
                        Please provide a Functionality Name.
                      </div>
                    </div>
                    {isEdit ? (
                      <div className="col-md-6">
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
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="card-footer">
                  <button className="btn btn-info" type="submit">
                    {isEdit ? "Update" : "Save"}
                    {/* Save */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <PageTable
            data={allPage?.data || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            template={template}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
          />
        </div>
      </div>
    </>
  );
}

export default Page;
