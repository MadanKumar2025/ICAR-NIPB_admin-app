import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { usePermissions } from "../User_Management/UserManagement.js";

function ProfileUpdate() {
  const API_URL = process.env.REACT_APP_API_URL;
    const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
 const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();
  const [preview, setPreview] = useState(null);

  const [data, setData] = useState({
    name: "",
    mobileNo: "",
    designation: "",
    photo: "",
    imageTitle:""
  });

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData({
          name: res?.data?.data.name,
          mobileNo: res?.data?.data.mobileNo,
          designation: res?.data?.data.designation,
          imageTitle: res?.data?.data.imageTitle,
          photo: res?.data?.data.photo,
        });

        // Existing photo preview
        if (res?.data?.data.photo) {
          setPreview(`${IMG_BASE_URL}/${res?.data?.data.photo}`);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [API_URL, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({
        ...data,
        photo: file,
      });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("mobileNo", data.mobileNo);
      formData.append("designation", data.designation);
      formData.append("imageTitle", data.imageTitle);

      if (data.photo) {
        formData.append("photo", data.photo);
      }

      const res = await axios.put(
        `${API_URL}/users/profile-update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: res.data.message || "Profile Updated Successfully.",
        confirmButtonColor: "#3085d6",
      });

      // Update preview if new file returned by server
      if (res.data.data?.photo) {
        setPreview(`${IMG_BASE_URL}/${res.data.data.photo}`);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Server error",
      });
    }
  };

  return (
    <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
      <div className="card card-info card-outline mb-4">
        <div className="card-header">
          <div className="card-title">Profile Update</div>
        </div>

        <form className="needs-validation" onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="validationCustom01" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  className="form-control"
                  id="validationCustom01"
                />
                <div className="valid-feedback">Looks good!</div>
              </div>

              <div className="col-md-6">
                <label htmlFor="validationCustomUsername" className="form-label">
                  Mobile No.
                </label>
                <div className="input-group has-validation">
                  <input
                    type="number"
                    name="mobileNo"
                    value={data.mobileNo}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustomUsername"
                  />
                  <div className="invalid-feedback">
                    Please choose a Mobile No..
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <label htmlFor="validationCustom03" className="form-label">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={data.designation}
                  onChange={handleChange}
                  className="form-control"
                  id="validationCustom03"
                />
                <div className="invalid-feedback">
                  Please provide a Designation.
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor="validationCustom03" className="form-label">
                  Image Title
                </label>
                <input
                  type="text"
                  name="imageTitle"
                  value={data.imageTitle}
                  onChange={handleChange}
                  className="form-control"
                  id="validationCustom03"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="validationCustom05" className="form-label">
                  Photo
                </label>
                <input
                  type="file"
                  onChange={handlePhotoChange}
                  className="form-control"
                  id="validationCustom05"
                />

                {/* Image Preview */}
                {preview && (
                  <img
                    src={preview}
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
                  Please provide a Photo.
                </div>
              </div>
            </div>
          </div>

          <div className="card-footer">
          {(hasAddAccess("Profile Update") ||
                hasEditAccess("Profile Update")) && (    <button className="btn btn-info" type="submit">
              Submit
            </button>)}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileUpdate;