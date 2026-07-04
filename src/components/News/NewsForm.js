import axios from "axios";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const NewsForm = ({
  handleChange,
  data,
  isEdit,
  editId,
  setData,
  setPreview,
  getNewsData,
  preview,
  handleClose,
}) => {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;

  const location = useLocation();
  const token = localStorage.getItem("token");
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      try {
        const formData = new FormData();

        console.log("handleSubmit Data ", data);

        formData.append("type", data?.type || "");
        formData.append("title_en", data?.title_en || "");
        formData.append("title_hi", data?.title_hi || "");
        // formData.append("link", data?.link || "");
        formData.append("publishDate", data?.publishDate || "");
        formData.append("expiryDate", data?.expiryDate || "");
        formData.append("markAsNew", data?.markAsNew);
        formData.append("isActive", data?.isActive);

        // if (data.documentFile) {
        //   formData.append("documentFile", data.documentFile);
        // }

        if (data?.DocumentType === "Link") {
          formData.append("link", data?.link || "");
          formData.append("documentFile", ""); 
        }

        if (data?.DocumentType === "Document") {
          formData.append("link", "");
          if (data?.documentFile instanceof File) {
            formData.append("documentFile", data.documentFile);
          }
        }

        const res = await axios.put(
          `${API_URL}/news/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setData({
          type: "",
          title_en: "",
          title_hi: "",
          link: "",
          documentFile: "",
          publishDate: "",
          expiryDate: "",
          markAsNew: "",
          isActive: true,
        });
        setPreview(null);

        formRef.current.reset();
        await getNewsData();
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

      formData.append("type", data?.type || "");
      formData.append("title_en", data?.title_en || "");
      formData.append("title_hi", data?.title_hi || "");
      // formData.append("link", data?.link || "");
      formData.append("publishDate", data?.publishDate || "");
      formData.append("expiryDate", data?.expiryDate || "");
      formData.append("markAsNew", data?.markAsNew || "");
      formData.append("isActive", data?.isActive);

      // if (data?.documentFile) {
      //   formData.append("documentFile", data?.documentFile);
      // }


      
        if (data?.DocumentType === "Link") {
          formData.append("link", data?.link || "");
          formData.append("documentFile", ""); 
        }

        if (data?.DocumentType === "Document") {
          formData.append("link", "");
          if (data?.documentFile instanceof File) {
            formData.append("documentFile", data.documentFile);
          }
        }
        
      try {
        const response = await axios.post(`${API_URL}/news/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("response", response);

        setData({
          type: "",
          title_en: "",
          title_hi: "",
          link: "",
          documentFile: "",
          publishDate: "",
          expiryDate: "",
          markAsNew: "",
          isActive: true,
        });
        setPreview(null);

        formRef.current.reset();
        await getNewsData();

        Swal.fire({
          icon: "success",
          title: "News",
          text: response.data.message || "News saved successfully",
          confirmButtonColor: "#3085d6",
        });
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

  console.log("data ", data);

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Create News</div>
          </div>

          <form
            className="needs-validation"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="validationCustom01" className="form-label">
                    Type
                  </label>
                  <select
                    name="type"
                    className="form-control"
                    value={data?.type}
                    onChange={handleChange}
                    id="validationCustom03"
                  >
                    <option value="">select</option>
                    <option value="News">News</option>
                    <option value="Tender">Tender</option>
                    <option value="Job">Job / vacancy</option>
                  </select>
                </div>
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
                    id="validationCustom02"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Title (Hindi)
                  </label>
                  <input
                    type="text"
                    name="title_hi"
                    value={data?.title_hi}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom02"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom01" className="form-label">
                    URL Type
                  </label>
                  <select
                    name="DocumentType"
                    className="form-control"
                    value={data?.DocumentType}
                    onChange={handleChange}
                    id="validationCustom03"
                    required
                  >
                    <option value="">select</option>
                    <option value="Link">Link</option>
                    <option value="Document">Document</option>
                  </select>
                </div>
                {data?.DocumentType === "Link" && (
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Link
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="link"
                        value={data?.link}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                      />
                    </div>
                  </div>
                )}
                {data?.DocumentType === "Document" && (
                  <div className="col-md-6">
                    <label htmlFor="validationCustom03" className="form-label">
                      Document
                    </label>
                    <input
                      type="file"
                      name="documentFile"
                      onChange={handleChange}
                      className="form-control"
                      id="validationCustom03"
                    />
                    {preview && (
                      <a href={preview} target="_blank" rel="noreferrer">
                        View Document
                      </a>
                    )}
                    <div className="invalid-feedback">
                      Please provide a Document.
                    </div>
                  </div>
                )}
                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
                    publish Date
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    value={data?.publishDate}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                    require
                  />
                  <div className="invalid-feedback">
                    Please provide a publish Date.
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
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
                  <div className="invalid-feedback">
                    Please provide a Expiry Date.
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Is Active</label>
                  <select
                    name="isActive"
                    value={data?.isActive}
                    // onChange={handleChange}
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "3" }}
                  className="col-12"
                >
                  <input
                    type="checkbox"
                    name="markAsNew"
                    checked={data?.markAsNew || false}
                    onChange={handleChange}
                    id="validationCustom05"
                  />
                  <label
                    htmlFor="validationCustom05"
                    className="form-label m-0"
                  >
                    Mark As New
                  </label>

                  <div className="invalid-feedback">
                    Please provide a Photo.
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex">
              <button className="btn btn-info" type="submit">
                {/* {isEdit ? "Update User" : "Submit form"} */}
                {/* {isEdit ? "Update" : "Save"} */}
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
};
export default NewsForm;
