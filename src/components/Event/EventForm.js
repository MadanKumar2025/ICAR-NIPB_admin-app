import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import EventTable from "./EventTable";
import { jwtDecode } from "jwt-decode";
import JoditEditor from "jodit-react";

function EventForm({
  isEdit,
  data,
  editId,
  setData,
  setPreview,
  getEventData,
  handleChange,
  preview,
  handleClose,
}) {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;

  const formRef = useRef();
  const editor = useRef(null);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      try {
        const formData = new FormData();

        formData.append("name_en", data.name.en);
        formData.append("name_hi", data.name.hi);
        formData.append("eventBannerPhoto", data?.eventBannerPhoto || "");
        formData.append("eventPhoto", data?.eventPhoto || "");
        formData.append("startTime", data?.startTime || "");
        formData.append("endTime", data?.endTime || "");
        formData.append("location_en", data.location.en);
        formData.append("location_hi", data.location.hi);
        formData.append("description_en", data.description.en);
        formData.append("description_hi", data.description.hi);
        formData.append("registrationLink", data?.registrationLink || "");
        formData.append(
          "registrationStartTime",
          data?.registrationStartTime || "",
        );
        formData.append("registrationEndTime", data?.registrationEndTime || "");
        formData.append("isActive", data?.isActive);

        if (data.eventBannerPhoto) {
          formData.append("eventBannerPhoto", data.eventBannerPhoto);
        }
        if (data.eventPhoto) {
          formData.append("eventPhoto", data.eventPhoto);
        }

        const res = await axios.put(
          `${API_URL}/event/updateEvent/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setData({
          name: { en: "", hi: "" },
          location: { en: "", hi: "" },
          description: { en: "", hi: "" },
          eventBannerPhoto: null,
          eventPhoto: null,
          startTime: "",
          endTime: "",
          registrationLink: "",
          registrationStartTime: "",
          registrationEndTime: "",
          isActive: true,
        });
        setPreview(null);

        formRef.current.reset();
        // getEventData();
        await getEventData();
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

    console.log("data",data);
    
      formData.append("name_en", data?.name?.en);
      formData.append("name_hi", data?.name?.hi);
      formData.append("eventBannerPhoto", data?.eventBannerPhoto || "");
      formData.append("eventPhoto", data?.eventPhoto || "");
      formData.append("startTime", data?.startTime || "");
      formData.append("endTime", data?.endTime || "");
      formData.append("location_en", data?.location?.en);
      formData.append("location_hi", data?.location?.hi);
      formData.append("description_en", data?.description?.en);
      formData.append("description_hi", data?.description?.hi);
      formData.append("registrationLink", data?.registrationLink || "");
      formData.append(
        "registrationStartTime",
        data?.registrationStartTime || "",
      );
      formData.append("registrationEndTime", data?.registrationEndTime || "");
      formData.append("isActive", data?.isActive);

      try {
        const response = await axios.post(
          `${API_URL}/event/createEvent`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        console.log("response", response);

        setData({
          name: { en: "", hi: "" },
          location: { en: "", hi: "" },
          description: { en: "", hi: "" },
          eventBannerPhoto: null,
          eventPhoto: null,
          startTime: "",
          endTime: "",
          registrationLink: "",
          registrationStartTime: "",
          registrationendTime: "",
          isActive: true,
        });
        // setPreview(null);

        formRef.current.reset();
        // getAllPage(currentPage);

        Swal.fire({
          icon: "success",
          title: "Organization Details",
          text: response.data.message || "Organization Details Successfully.",
          confirmButtonColor: "#3085d6",
        });
        getEventData();
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

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Create Event</div>
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
                    Event Title (English)
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={data?.name?.en}
                    onChange={handleChange}
                    className="form-control"
                    id="name_en"
                    placeholder="Name (English)"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom01" className="form-label">
                    Event Title (Hindi)
                  </label>
                  <input
                    type="text"
                    name="name_hi"
                    value={data?.name?.hi}
                    onChange={handleChange}
                    className="form-control"
                    id="name_hi"
                    placeholder="नाम (हिंदी)"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
                    Location (English)
                  </label>
                  <input
                    type="text"
                    name="location_en"
                    value={data?.location?.en}
                    onChange={handleChange}
                    className="form-control"
                    id="location_en"
                  />
                  <div className="invalid-feedback">
                    Please provide a location.
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="location_hi" className="form-label">
                    Location (Hindi)
                  </label>
                  <input
                    type="text"
                    name="location_hi"
                    value={data?.location?.hi}
                    onChange={handleChange}
                    className="form-control"
                    id="location_hi"
                    required
                  />
                  <div className="invalid-feedback">
                    कृपया स्थान (हिंदी में) प्रदान करें।
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Banner Photo
                  </label>
                  <input
                    type="file"
                    name="eventBannerPhoto"
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                  />
                  {preview && (
                    <a
                      href={preview?.eventBannerPhoto}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Document
                    </a>
                  )}
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Event Photo
                  </label>

                  <input
                    type="file"
                    name="eventPhoto"
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                  />
                  {preview && (
                    <a
                      href={preview?.eventPhoto}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Document
                    </a>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
                    Event Start Time
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={data?.startTime}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
                    Event End Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={data?.endTime}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                    require
                  />
                  <div className="invalid-feedback">
                    Please provide a Event End Time & Date.
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
                    Event Registration Start Date
                  </label>
                  <input
                    type="date"
                    name="registrationStartTime"
                    value={data?.registrationStartTime}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                  />
                  <div className="invalid-feedback">
                    Please provide a Registration Start Time.
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
                    Event Registration End Date
                  </label>
                  <input
                    type="date"
                    name="registrationEndTime"
                    value={data?.registrationEndTime}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                  />
                  <div className="invalid-feedback">
                    Please provide a Registration End Time.
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Is Active</label>
                  <select
                    name="isActive"
                    value={data.isActive}
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
                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
                    Event Registration Link
                  </label>
                  <input
                    type="text"
                    name="registrationLink"
                    value={data?.registrationLink}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                  />
                  <div className="invalid-feedback">
                    Please provide a Registration Link.
                  </div>
                </div>
                <div>
                  <label htmlFor="description_en" className="form-label">
                    Description (English)
                  </label>
                  <JoditEditor
                    style={{ width: "90%" }}
                    ref={editor}
                    value={data?.description?.en}
                    onChange={(newContent) =>
                      setData((prev) => ({
                        ...prev,
                        description: { ...prev?.description, en: newContent },
                      }))
                    }
                  />
                  <div className="invalid-feedback">
                    Please provide a Description in English.
                  </div>
                </div>
                <div>
                  <label htmlFor="description_hi" className="form-label">
                    Description (Hindi)
                  </label>
                  <JoditEditor
                    style={{ width: "90%" }}
                    ref={editor}
                    value={data?.description?.hi}
                    onChange={(newContent) =>
                      setData((prev) => ({
                        ...prev,
                        description: { ...prev?.description, hi: newContent },
                      }))
                    }
                  />
                  <div className="invalid-feedback">
                    कृपया विवरण (हिंदी में) प्रदान करें।
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div className="card-footer">
                <button className="btn btn-info" type="submit">
                  {/* {isEdit ? "Update User" : "Submit form"} */}
                  {/* {isEdit ? "Update" : "Save"} */}
                  Save
                </button>
              </div>
              <div className="card-footer">
                <button className="btn btn-info" onClick={handleClose}>
                  Close
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EventForm;
