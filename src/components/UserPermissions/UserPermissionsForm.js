import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Box, Tabs } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useParams } from "react-router-dom";

function UserPermissionsForm({
  data,
  setData,
  userData,
  setUserData,
  createUser,
  setCreateUser,
  setPreview,
  isEdit,
  editId,
  setIsEdit,
  currentPage,
  getUserPermissions,
  handleClose,
}) {
  const itemsPerPage = 10;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const formRef = useRef();
  const { id } = useParams();
  const [userPermissionsID, setUserPermissionsID] = useState(null);

  const getPermissions = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_URL}/UserPermissionsRoutes/getPermissionsByUser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const permissions = response.data?.data?.menuPermissions || [];
      const formattedData = permissions.map((item) => ({
        menuId: item?.menuId,
        parentMenuId: item?.menuId?.parentMenuId,
        menuName: item?.menuId?.menuName,
        pageAccess: item?.pageAccess || false,
        addAccess: item?.addAccess || false,
        editAccess: item?.editAccess || false,
        activeAccess: item?.activeAccess || false,
        deleteAccess: item?.deleteAccess || false,
      }));

      setUserData(formattedData);
      setUserPermissionsID(response?.data?.data?._id);
    } catch (error) {
      console.error("Error fetching data:", error);

      const message = error.response?.data?.message;
      const status = error.response?.status;
      if (message === "Invalid token" || status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      if (message === "Your account is deactivated. Please contact admin.") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    getPermissions(currentPage);
  }, []);

  const handleChange = (index, field) => {
    const updatedData = [...data];

    updatedData[index][field] = !updatedData[index][field];

    setData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      try {
        const p = {
          userId: id,
          menuPermissions: data || [],
        };

        const response = await axios.put(
          `${API_URL}/UserPermissionsRoutes/update/${userPermissionsID}`,
          p,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: response.data?.message || "Permissions updated successfully",
        });
      } catch (error) {
        const message = error.response?.data?.message || "Something went wrong";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message || "Something went wrong",
        });
      }
    } else {
      const p = {
        userId: id,
        menuPermissions: data || [],
      };

      try {
        const response = await axios.post(
          `${API_URL}/UserPermissionsRoutes/create`,
          p,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User updated successfully",
        });

        getUserPermissions();
        getPermissions();
      } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("SERVER ERROR:", error?.response?.data);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Server error",
        });
      }
    }
  };

  console.log("data",data);
  
  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">User Permissions</div>
          </div>

          <form
            className="needs-validation"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th style={{ width: "10px" }}>#</th>
                  <th>Menu Name</th>
                  <th>Page Access</th>
                  <th>Add Access</th>
                  <th>Edit Access</th>
                  <th>Active Access</th>
                  <th>Delete Access</th>
                  {/* <th style={{ width: "40px" }}>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr key={index} className="align-middle">
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>
                      {item?.parentMenuId == null
                        ? item?.menuName
                        : item?.parentMenuId != null
                          ? `>>>> ${item?.menuName}`
                          : ""}
                    </td>
                    <th>
                      <input
                        type="checkbox"
                        checked={item.pageAccess}
                        onChange={() => handleChange(index, "pageAccess")}
                      />
                    </th>
                    <th>
                      <input
                        type="checkbox"
                        checked={item.addAccess}
                        onChange={() => handleChange(index, "addAccess")}
                      />
                    </th>
                    <th>
                      <input
                        type="checkbox"
                        checked={item.editAccess}
                        onChange={() => handleChange(index, "editAccess")}
                      />
                    </th>
                    <th>
                      <input
                        type="checkbox"
                        checked={item.activeAccess}
                        onChange={() => handleChange(index, "activeAccess")}
                      />
                    </th>
                    <th>
                      <input
                        type="checkbox"
                        checked={item.deleteAccess}
                        onChange={() => handleChange(index, "deleteAccess")}
                      />
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="card-footer d-flex">
              <button className="btn btn-info" type="submit">
                {/* {isEdit ? "Update User" : "Submit form"} */}
                {isEdit ? "Update" : "Save"}
                {/* Save */}
                {/*<button className="btn btn-info auto" onClick={handleClose}>
                  Close
                </button>*/}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserPermissionsForm;
