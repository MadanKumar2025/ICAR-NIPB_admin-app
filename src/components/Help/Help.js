import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { usePermissions } from "../User_Management/UserManagement";
import HelpForm from "./HelpForm";
import HelpTable from "./HelpTable";

function Help() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess, hasDeleteAccess } =
    usePermissions();

  const [allHelp, setAllHelp] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    title_en: "",
    title_hi: "",
    description_en: "",
    description_hi: "",
    isActive: true,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const token = localStorage.getItem("token");

  const getHelp = async () => {
    try {
      const response = await axios.get(`${API_URL}/HelpRoutes/Getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllHelp(response?.data?.data);
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
    getHelp();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/HelpRoutes/updateStatus/${item?.id}`,
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
      setAllHelp((prev) =>
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
      title_en: item?.title?.en,
      title_hi: item?.title?.hi,
      description_en: item?.description?.en,
      description_hi: item?.description?.hi,
      isActive: item?.isActive ?? true,
    });

    setEditId(item?.id);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setData({
      title_en: "",
      title_hi: "",
      description_en: "",
      description_hi: "",
      isActive: true,
    });
  };

  const handleDelete = async (item) => {
 
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this FAQ?",
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

      await axios.delete(`${API_URL}/HelpRoutes/delete-help/${item?.id}`, {
        data: {
          isActive: !item.isActive,
          updateby: decoded?.id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getHelp();

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: "FAQ has been successfully deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the FAQ.",
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
            {hasAddAccess("FAQ") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create FAQ
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <HelpForm
            data={data}
            setData={setData}
            isEdit={isEdit}
            editId={editId}
            getHelp={getHelp}
            setAllHelp={setAllHelp}
            handleClose={handleClose}
          />
        )}
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <HelpTable
            data={allHelp || []}
            handleToggle={handleToggle}
            pagination={pagination}
            setPagination={setPagination}
            handleEdit={handleEdit}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
            hasDeleteAccess={hasDeleteAccess}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
}

export default Help;
