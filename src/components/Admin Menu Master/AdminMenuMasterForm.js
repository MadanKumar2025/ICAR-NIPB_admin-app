import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Box, Tabs, useMediaQuery, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";

function AdminMenuMasterForm({
  data,
  setData,
  setPreview,
  isEdit,
  editId,
  adminMenuMaster,
  getAdminMenuMasters,
  setAdminMenuMaster,
  preview,
  handleClose,
}) {
  const [designation, setDesignation] = useState([]);
  // console.log("data", data);

  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;

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
    console.log("data",data);
    
    // editId
    if (isEdit) {
      try {
        const response = await axios.put(
          `${API_URL}/AdminMenuMasterRoutes/update/${editId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        Swal.fire({
          icon: "success",
          title: "Admin Menu Master",
          text:
            response.data.message || " Admin Menu Master UpDate Successfully.",
          confirmButtonColor: "#3085d6",
        });

        // setAdminMenuMaster(response?.data?.data);
        setAdminMenuMaster(
          Array.isArray(response?.data?.data)
            ? response.data.data
            : response?.data?.data?.data || [],
        );
        await getAdminMenuMasters();
        handleClose();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Update failed",
        });
      }
    } else {
      try {
        const response = await axios.post(
          `${API_URL}/AdminMenuMasterRoutes/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        Swal.fire({
          icon: "success",
          title: "Admin Menu Master",
          text: response.data.message || " Admin Menu Master Successfully.",
          confirmButtonColor: "#3085d6",
        });

        setAdminMenuMaster(response?.data?.data);
        await getAdminMenuMasters();
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

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Admin Menu Master </div>
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
                    Menu Type
                  </label>
                  <select
                    name="menuType"
                    className="form-control"
                    value={data?.menuType}
                    onChange={handleChange}
                    // disabled={data?.menuCategory === "footer"}
                  >
                    <option value="">select</option>
                    <option value="parent">Parent Menu</option>
                    <option value="child">Child Menu</option>
                  </select>
                  <div className="valid-feedback">Looks good!</div>
                </div>
                {data?.menuType === "child" && (
                  <div className="col-md-6">
                    <label htmlFor="validationCustom02" className="form-label">
                      Parent Menu
                    </label>
                    <select
                      name="parentMenuId"
                      className="form-control"
                      value={String(data?.parentMenuId || "")}
                      onChange={handleChange}
                    >
                      <option value={""}>select</option>
                      {Array.isArray(adminMenuMaster) &&
                        adminMenuMaster
                          ?.filter(
                            (item) =>
                              item?.isActive === true &&
                              item?.menuType === "parent" &&
                              item?.menuCategory === data?.menuCategory,
                          )
                          .map((item, index) => {
                            return (
                              <option key={index} value={String(item?._id)}>
                                {item?.menuName}
                              </option>
                            );
                          })}
                      ;
                    </select>
                  </div>
                )}
                <div className="col-sm-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Menu Name
                  </label>
                  <input
                    type="text"
                    name="menuName"
                    value={data?.menuName}
                    onChange={handleChange}
                    className="form-control"
                    id="menuName"
                  />
                </div>

                <div className="col-sm-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Url
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="url"
                      value={data?.url}
                      onChange={handleChange}
                      className="form-control"
                      // required
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    DisplayOrder Number
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="displayOrderNumber"
                      value={data?.displayOrderNumber}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-sm-6">
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

export default AdminMenuMasterForm;
