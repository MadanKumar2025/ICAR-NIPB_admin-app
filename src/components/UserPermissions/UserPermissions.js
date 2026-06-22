import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRef } from "react";
import { jwtDecode } from "jwt-decode";
import UserPermissionsForm from "./UserPermissionsForm";

function UserPermissions() {
  const itemsPerPage = 10;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;

  const API_URL = process.env.REACT_APP_API_URL;
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [preview, setPreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [defaultData, setDefaultData] = useState([]);
  const [userData, setUserData] = useState([]);


  const token = localStorage.getItem("token");
  const formRef = useRef();

  const handleEdit = (user) => {
    setData({
      name: user.name,
      email: user.email,
      mobileNo: user.mobileNo,
      password: user.password,
      designation: user.designation,
      imageTitle: user.imageTitle,
      photo: "",
      isActive: user.isActive,
    });
    setPreview(`${IMG_BASE_URL}/${user.photo}`);
    setEditId(user._id);
    setIsEdit(true);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getUserPermissions = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_URL}/AdminMenuMasterRoutes/getAll?all=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const formattedData = response.data?.data.map((item) => ({
        menuId: item?._id,
        parentMenuId: item?.parentMenuId,
        menuName: item?.menuName,
        pageAccess: false,
        addAccess: false,
        editAccess: false,
        activeAccess: false,
        deleteAccess: false,
      }));

      setDefaultData(formattedData);
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
    getUserPermissions(currentPage);
  }, []);

  const handleToggle = async (user) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/users/status/${user._id}`,
        {
          isActive: !user.isActive,
          updateby: decoded.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

       getUserPermissions(currentPage);
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setData({
      menuId: "",
      menuName: "",
      pageAccess: "",
      addAccess: "",
      editAccess: "",
      activeAccess: "",
      deleteAccess: "",
    });
  };

  // useEffect(() => {
  //   if (userData.length > 0) {
  //     setData(userData);
  //     setIsEdit(true)
  //   } else {
  //     setData(defaultData);
  //   }
  // }, [userData, defaultData]);

  useEffect(() => {
    if (defaultData.length === 0) return;

    const mergedData = defaultData.map((menu) => {
      const found = userData.find((u) => {
        const userMenuId =
          typeof u.menuId === "object" ? u.menuId._id : u.menuId;
        return userMenuId === menu.menuId;
      });

      return {
        ...menu,
        pageAccess: found?.pageAccess || false,
        addAccess: found?.addAccess || false,
        editAccess: found?.editAccess || false,
        activeAccess: found?.activeAccess || false,
        deleteAccess: found?.deleteAccess || false,
      };
    });

    setData(mergedData);
  }, [defaultData, userData]);
  
    
  return (
    <>
      <div>
        <UserPermissionsForm
          setUserData={setUserData}
          userData={userData}
          data={data}
          setData={setData}
          setPreview={setPreview}
          isEdit={isEdit}
          editId={editId}
          setIsEdit={setIsEdit}
          currentPage={currentPage}
          getUserPermissions={getUserPermissions}
          userPermissions={userPermissions}
          preview={preview}
          handleClose={handleClose}
        />
        <div className="card mb-4 custom-panel-table mt-3" style={{ width: "90%", marginLeft: "5%" }}>
          {/* <UserTable
            data={users?.data || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
          /> */}
        </div>
      </div>
    </>
  );
}

export default UserPermissions;
