import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRef } from "react";
import { jwtDecode } from "jwt-decode";
import UserTable from "./UserTable";
import UserForm from "./UserForm";
import { usePermissions } from "../User_Management/UserManagement.js";

function User() {
  const itemsPerPage = 10;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;

  const API_URL = process.env.REACT_APP_API_URL;
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [preview, setPreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { hasAddAccess,hasActiveAccess,hasEditAccess } = usePermissions();

  const [createUser, setCreateUser] = useState({
    name: "",
    email: "",
    mobileNo: "",
    password: "",
    designation: "",
    photo: "",
    imageTitle: "",
  });

  const token = localStorage.getItem("token");
  const formRef = useRef();

  const handleEdit = (user) => {
    setCreateUser({
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

  const getUsers = async (page = 1) => {
    try {
      const response = await axios.get(`${API_URL}/users?all=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.totalPages);
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
    getUsers(currentPage);
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

      console.log(res.data);
      getUsers(currentPage);
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setCreateUser({
      name: "",
      email: "",
      mobileNo: "",
      password: "",
      designation: "",
      photo: "",
      imageTitle: "",
    });
  };

  return (
    <>
      <div>
        <div className="d-flex justify-content-end">
          <div
            className="card-footer"
            style={{
              marginTop: "2vh",
              marginBottom: "2vh",
              marginRight: "4vw",
            }}
          >
            {/* <button className="btn btn-info" onClick={() => setShowForm(true)}>
              Create User
            </button> */}
            {hasAddAccess("User") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create User
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <UserForm
            createUser={createUser}
            setCreateUser={setCreateUser}
            setPreview={setPreview}
            isEdit={isEdit}
            editId={editId}
            setIsEdit={setIsEdit}
            currentPage={currentPage}
            getUsers={getUsers}
            preview={preview}
            handleClose={handleClose}
          />
        )}
        <div className="card mb-4" style={{ width: "90%", marginLeft: "5%" }}>
          <UserTable
            data={users?.data || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
          />
        </div>
      </div>
    </>
  );
}

export default User;
