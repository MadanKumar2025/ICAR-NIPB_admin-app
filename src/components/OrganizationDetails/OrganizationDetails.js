import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { usePermissions } from "../User_Management/UserManagement.js";

function OrganizationDetails() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();
  const [preview, setPreview] = useState({
    logo1: null,
    logo2: null,
  });

  const [data, setData] = useState({
    organizationName: { en: "", hi: "" },
    tagLine: { en: "", hi: "" },
    logo1: null,
    logo1Title: "",
    logo2: null,
    logo2Title: "",
    addressLine1: { en: "", hi: "" },
    addressLine2: { en: "", hi: "" },
    city: { en: "", hi: "" },
    state: { en: "", hi: "" },
    pinCode: "",
    contactNumber: "",
    faxNumber: "",
    email1: "",
    email2: "",
    websiteLink: "",
    facebookLink: "",
    twitterLink: "",
    linkedinLink: "",
    youtubeLink: "",
    instagramLink: "",
    googleMapLink: "",
    paymentUrl: "",
  });

  const token = localStorage.getItem("token");
  const formRef = useRef();

  const getOrganizations = async (page = 1) => {
    try {
      const response = await axios.get(`${API_URL}/organization`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsEdit(
        response?.data?.data[0]?.addressLine1 === undefined ? false : true,
      );
      setEditId(response?.data?.data[0]?.id);

      setPreview({
        logo1: `${IMG_BASE_URL}/${response?.data?.data[0]?.logo1}`,
        logo2: `${IMG_BASE_URL}/${response?.data?.data[0]?.logo2}`,
      });

      setData(response?.data?.data[0]);
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
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];

        formData.append(
          "organizationName_en",
          data?.organizationName?.en || "",
        );
        formData.append(
          "organizationName_hi",
          data?.organizationName?.hi || "",
        );

        formData.append("tagLine_en", data?.tagLine?.en || "");
        formData.append("tagLine_hi", data?.tagLine?.hi || "");

        // if (data.logo1) {
        //   formData.append("logo1", data.logo1);
        // }
        console.log("data.logo1", data.logo1);

        if (data.logo1) {
          // Check if it's a File object
          if (data.logo1 instanceof File) {
            if (!allowedTypes.includes(data.logo1.type)) {
              Swal.fire({
                icon: "error",
                title: "Invalid File Type",
                text: "Logo1 must be an image (JPG, PNG).",
              });
              return;
            }
            formData.append("logo1", data.logo1);
          } else if (typeof data.logo1 === "string") {
            // It's a default image, just append the filename or handle as needed
            formData.append("logo1", data.logo1);
          }
        }
        formData.append("logo1Title", data?.logo1Title || "");

        if (data.logo2) {
          // Check if it's a File object (new upload)
          if (data.logo2 instanceof File) {
            if (!allowedTypes.includes(data.logo2.type)) {
              Swal.fire({
                icon: "error",
                title: "Invalid File Type",
                text: "Logo2 must be an image (JPG, PNG).",
              });
              return;
            }
            formData.append("logo2", data.logo2);
          }
          // If it's a string (default image), just append it
          else if (typeof data.logo2 === "string") {
            formData.append("logo2", data.logo2);
          }
        }
        formData.append("logo2Title", data?.logo2Title || "");

        formData.append("addressLine1_en", data?.addressLine1?.en || "");
        formData.append("addressLine1_hi", data?.addressLine1?.hi || "");

        formData.append("addressLine2_en", data?.addressLine2?.en || "");
        formData.append("addressLine2_hi", data?.addressLine2?.hi || "");

        formData.append("city_en", data?.city?.en || "");
        formData.append("city_hi", data?.city?.hi || "");

        formData.append("state_en", data?.state?.en || "");
        formData.append("state_hi", data?.state?.hi || "");

        formData.append("pinCode", data?.pinCode || "");
        formData.append("contactNumber", data?.contactNumber || "");
        formData.append("faxNumber", data?.faxNumber || "");
        formData.append("email1", data?.email1 || "");
        formData.append("email2", data?.email2 || "");

        formData.append("websiteLink", data?.websiteLink || "");
        formData.append("facebookLink", data?.facebookLink || "");
        formData.append("twitterLink", data?.twitterLink || "");
        formData.append("linkedinLink", data?.linkedinLink || "");
        formData.append("youtubeLink", data?.youtubeLink || "");
        formData.append("instagramLink", data?.instagramLink || "");
        formData.append("googleMapLink", data?.googleMapLink || "");
        formData.append("paymentUrl", data?.paymentUrl || "");

        const response = await axios.put(
          `${API_URL}/organization/update/${editId}`,
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
          organizationName: { en: "", hi: "" },
          tagLine: { en: "", hi: "" },
          logo1: null,
          logo1Title: "",
          logo2: null,
          logo2Title: "",
          addressLine1: { en: "", hi: "" },
          addressLine2: { en: "", hi: "" },
          city: { en: "", hi: "" },
          state: { en: "", hi: "" },
          pinCode: "",
          contactNumber: "",
          faxNumber: "",
          email1: "",
          email2: "",
          websiteLink: "",
          facebookLink: "",
          twitterLink: "",
          linkedinLink: "",
          youtubeLink: "",
          instagramLink: "",
          googleMapLink: "",
          paymentUrl: "",
          isActive: false,
        });

        formRef.current.reset();
        setPreview(null);

        Swal.fire({
          icon: "success",
          title: "Organization Update",
          text: response.data.message || "Organization updated successfully",
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
      formData.append("organizationName_en", data.organizationName.en || "");
      formData.append("organizationName_hi", data.organizationName.hi || "");

      formData.append("tagLine_en", data.tagLine.en || "");
      formData.append("tagLine_hi", data.tagLine.hi || "");

      formData.append("addressLine1_en", data.addressLine1.en || "");
      formData.append("addressLine1_hi", data.addressLine1.hi || "");

      formData.append("addressLine2_en", data.addressLine2.en || "");
      formData.append("addressLine2_hi", data.addressLine2.hi || "");

      formData.append("city_en", data.city.en || "");
      formData.append("city_hi", data.city.hi || "");

      formData.append("state_en", data.state.en || "");
      formData.append("state_hi", data.state.hi || "");

      // Normal fields
      formData.append("pinCode", data.pinCode || "");
      formData.append("contactNumber", data.contactNumber || "");
      formData.append("faxNumber", data.faxNumber || "");
      formData.append("email1", data.email1 || "");
      formData.append("email2", data.email2 || "");
      formData.append("websiteLink", data.websiteLink || "#");
      formData.append("facebookLink", data.facebookLink || "#");
      formData.append("twitterLink", data.twitterLink || "#");
      formData.append("linkedinLink", data.linkedinLink || "#");
      formData.append("youtubeLink", data.youtubeLink || "#");
      formData.append("instagramLink", data.instagramLink || "#");
      formData.append("googleMapLink", data.googleMapLink || "#");
      formData.append("paymentUrl", data.paymentUrl || "#");

      // File uploads
      if (data.logo1) formData.append("logo1", data.logo1);
      if (data.logo2) formData.append("logo2", data.logo2);
      formData.append("logo1Title", data.logo1Title || "");
      formData.append("logo2Title", data.logo2Title || "");

      try {
        const response = await axios.post(
          `${API_URL}/organization/createOrganization`,
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
          organizationName: { en: "", hi: "" },
          tagLine: { en: "", hi: "" },
          logo1: null,
          logo1Title: "",
          logo2: null,
          logo2Title: "",
          addressLine1: { en: "", hi: "" },
          addressLine2: { en: "", hi: "" },
          city: { en: "", hi: "" },
          state: { en: "", hi: "" },
          pinCode: "",
          contactNumber: "",
          faxNumber: "",
          email1: "",
          email2: "",
          websiteLink: "",
          facebookLink: "",
          twitterLink: "",
          linkedinLink: "",
          youtubeLink: "",
          instagramLink: "",
          googleMapLink: "",
          paymentUrl: "",
          isActive: false,
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

  return (
    <>
      <div>
        <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
          <div className="custom-card card card-info card-outline mb-4">
            <div className="card-header">
              <div className="card-title">Organization Details</div>
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
                      Organization Name (English)
                    </label>
                    <input
                      type="text"
                      name="organizationName_en"
                      value={data?.organizationName?.en}
                      onChange={handleChange}
                      className="form-control"
                      id="validationCustom01"
                      required
                    />
                    <div className="valid-feedback">
                      Please provide a Organization Name
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationCustom01" className="form-label">
                      Organization Name (Hindi)
                    </label>
                    <input
                      type="text"
                      name="organizationName_hi"
                      value={data?.organizationName?.hi}
                      onChange={handleChange}
                      className="form-control"
                      id="validationCustom01"
                      required
                    />
                    <div className="valid-feedback">
                      Please provide a Organization Name
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationCustom02" className="form-label">
                      Tag Line (English)
                    </label>
                    <input
                      type="text"
                      name="tagLine_en"
                      value={data?.tagLine?.en}
                      onChange={handleChange}
                      className="form-control"
                      id="validationCustom02"
                      required
                    />
                    <div className="valid-feedback">
                      Please provide a Tag Line
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationCustom02" className="form-label">
                      Tag Line (Hindi)
                    </label>
                    <input
                      type="text"
                      name="tagLine_hi"
                      value={data?.tagLine?.hi}
                      onChange={handleChange}
                      className="form-control"
                      id="validationCustom02"
                      required
                    />
                    <div className="valid-feedback">
                      Please provide a Tag Line
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationCustom05" className="form-label">
                      Logo 1
                    </label>
                    <input
                      type="file"
                      name="logo1"
                      onChange={handleChange}
                      className="form-control upload-image-input"
                      id="validationCustom05"
                      // required
                    />
                    {preview && (
                      <img
                        src={preview?.logo1}
                        alt="Preview"
                        style={{
                          marginTop: "10px",
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div className="invalid-feedback">
                      Please provide a Logo 1.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationCustom05" className="form-label">
                      Logo 1 Title
                    </label>
                    <input
                      type="text"
                      name="logo1Title"
                      value={data?.logo1Title}
                      onChange={handleChange}
                      className="form-control"
                      id="validationCustom05"
                    />
                    <div className="invalid-feedback">
                      Please provide a Logo 1 Title.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationCustom05" className="form-label">
                      Logo 2
                    </label>
                    <input
                      type="file"
                      name="logo2"
                      onChange={handleChange}
                      className="form-control upload-image-input"
                      id="validationCustom05"
                    />
                    {preview && (
                      <img
                        src={preview?.logo2}
                        alt="Preview"
                        style={{
                          marginTop: "10px",
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div className="invalid-feedback">
                      Please provide a Logo 2.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationCustom05" className="form-label">
                      Logo 2 Title
                    </label>
                    <input
                      type="text"
                      name="logo2Title"
                      value={data?.logo2Title}
                      onChange={handleChange}
                      className="form-control"
                      id="validationCustom05"
                    />
                    <div className="invalid-feedback">
                      Please provide a Logo 2 title.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Address Line 1 (English)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="addressLine1_en"
                        value={data?.addressLine1?.en}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a Address Line 1
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Address Line 1 (Hindi)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="addressLine1_hi"
                        value={data?.addressLine1?.hi}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                      />
                      <div className="invalid-feedback">
                        Please choose a Address Line 1
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Address Line 2 (English)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="addressLine2_en"
                        value={data?.addressLine2?.en}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                      />
                      <div className="invalid-feedback">
                        Please choose a Address Line 2
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Address Line 2 (Hindi)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="addressLine2_hi"
                        value={data?.addressLine2?.hi}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                      />
                      <div className="invalid-feedback">
                        Please choose a Address Line 2
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      City (English)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="city_en"
                        value={data?.city?.en}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a City
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      City (Hindi)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="city_hi"
                        value={data?.city?.hi}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a City
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      state (English)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="state_en"
                        value={data?.state?.en}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a state
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      state (Hindi)
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="state_hi"
                        value={data?.state?.hi}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a state
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      PIN Code Number
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="number"
                        name="pinCode"
                        value={data?.pinCode}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a PIN Code number
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Contact Number
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="number"
                        name="contactNumber"
                        value={data?.contactNumber}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a Contact Number
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Fax Number
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="tel"
                        name="faxNumber"
                        value={data?.faxNumber}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                      />
                      <div className="invalid-feedback">
                        Please choose a Fax Number
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Email ID 1
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="email"
                        name="email1"
                        value={data?.email1}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a Email 1
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Email ID 2
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="email"
                        name="email2"
                        value={data?.email2}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                      />
                      <div className="invalid-feedback">
                        Please choose a Email 1
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Website link
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="websiteLink"
                        value={data?.websiteLink}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a Website Link
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Facebook Link
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="facebookLink"
                        value={data?.facebookLink}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                      />
                      <div className="invalid-feedback">
                        Please choose a Facebook Link
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Twitter (X) Link
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="twitterLink"
                        value={data?.twitterLink}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                      />
                      <div className="invalid-feedback">
                        Please choose a Twitter (X) Link
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      LinkedIn link
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="linkedinLink"
                        value={data?.linkedinLink}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                      />
                      <div className="invalid-feedback">
                        Please choose a LinkedIn Link
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      YouTube link
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="youtubeLink"
                        value={data?.youtubeLink}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                      />
                      <div className="invalid-feedback">
                        Please choose a YouTube Link
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Instagram Link
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="instagramLink"
                        value={data?.instagramLink}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                      />
                      <div className="invalid-feedback">
                        Please choose a Instagram Link
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Google Map Location Link
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="googleMapLink"
                        value={data?.googleMapLink}
                        onChange={handleChange}
                        className="form-control"
                        id="validationCustomUsername"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a Google Map Location Link
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="validationCustomUsername"
                      className="form-label"
                    >
                      Payment Url
                    </label>
                    <div className="input-group has-validation">
                      <input
                        type="text"
                        name="paymentUrl"
                        value={data?.paymentUrl}
                        onChange={handleChange}
                        className="form-control"
                        id="paymentUrl"
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a Payment Link
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                {(hasAddAccess("Organization Details") ||
                  hasEditAccess("Organization Details")) && (
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

export default OrganizationDetails;
