import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { usePermissions } from "../User_Management/UserManagement";
import PopupForm from "./PopupForm";
import PopupTable from "./PopupTable";
import Swal from "sweetalert2";

function Popup() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess, hasDeleteAccess } =
    usePermissions();

  const [preview, setPreview] = useState(null);
  const [popup, setPopup] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    title: "",
    photoTitle: "",
    url: "",
    startTime: "",
    endTime: "",
    photo: null,
    isActive: true,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const formRef = useRef();
  const editor = useRef(null);
  const token = localStorage.getItem("token");

  const getPopup = async () => {
    try {
      const response = await axios.get(`${API_URL}/PopupRoutes/allPopup`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPopup(response?.data?.data);
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
    getPopup();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/PopupRoutes/updatePopupStatus/${item?.id}`,
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

      setPopup((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, isActive: !row.isActive } : row,
        ),
      );
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleEdit = (item) => {
    setData({
      title: item?.title,
      url: item?.url,
      startTime: item?.startTime.split("T")[0],
      endTime: item?.endTime.split("T")[0],
      photoTitle: item?.photoTitle,
      photo: item?.photo,
      isActive: item?.isActive ?? true,
    });

    if (item?.photo !== null) {
      setPreview(`${IMG_BASE_URL}/${item?.photo}`);
    }

    setEditId(item?.id);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setData({
      photoTitle: "",
      relatedLink: "",
      photo: null,
      isActive: true,
    });
    setPreview(null);
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Popup?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const decoded = jwtDecode(token);

      await axios.delete(`${API_URL}/PopupRoutes/delete-popup/${item?.id}`, {
        data: {
          isActive: !item.isActive,
          updateby: decoded?.id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getPopup();

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: "Popup has been successfully deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the Popup.",
        icon: "error",
      });

      alert.error("Status update error", error);
    }
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
            {hasAddAccess("Popup") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Popup
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <PopupForm
            data={data}
            setData={setData}
            setPreview={setPreview}
            isEdit={isEdit}
            editId={editId}
            setIsEdit={setIsEdit}
            getPopup={getPopup}
            setPopup={setPopup}
            preview={preview}
            handleClose={handleClose}
            IMG_BASE_URL={IMG_BASE_URL}
          />
        )}
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <PopupTable
            data={popup || []}
            handleToggle={handleToggle}
            pagination={pagination}
            setPagination={setPagination}
            handleEdit={handleEdit}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
            hasDeleteAccess={hasDeleteAccess}
            handleDelete={handleDelete}
            IMG_BASE_URL={IMG_BASE_URL}
          />
        </div>
      </div>
    </>
  );
}

export default Popup;
