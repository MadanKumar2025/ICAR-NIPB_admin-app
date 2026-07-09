import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import InstitutionalProjectsForm from "./InstitutionalProjectsForm";
import InstitutionalProjectsTable from "./InstitutionalProjectsTable";
import InstitutionalProjectsDetails from "../Institutional Projects Details/InstitutionalProjectsDetails";
import { usePermissions } from "../User_Management/UserManagement";
import Swal from "sweetalert2";

function InstitutionalProjects() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess, hasDeleteAccess } =
    usePermissions();

  const [institutionalProjects, setInstitutionalProjects] = useState([]);
  const [data, setData] = useState({
    mainProject_en: "",
    mainProject_hi: "",
    groupLeader_en: "",
    groupLeader_hi: "",
    isActive: true,
  });

  const token = localStorage.getItem("token");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setShowForm(false);
    setData({
      mainProject_en: "",
      mainProject_hi: "",
      groupLeader_en: "",
      groupLeader_hi: "",
      isActive: true,
    });
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getInstitutionalProjects = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/institutionalProjects/allData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setInstitutionalProjects(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.data?.message === "Invalid token") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    getInstitutionalProjects();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/institutionalProjects/updateStatus/${item?._id}`,
        {
          isActive: !item?.isActive,
          updateby: decoded?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setInstitutionalProjects((prev) => ({
        ...prev,
        data: prev.data.map((row) =>
          row?._id === item?._id ? { ...row, isActive: !row?.isActive } : row,
        ),
      }));
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleEdit = (item) => {
    setData({
      mainProject_en: item?.mainProject?.en || "",
      mainProject_hi: item?.mainProject?.hi || "",
      groupLeader_en: item?.groupLeader?.en || "",
      groupLeader_hi: item?.groupLeader?.hi || "",
      isActive: item?.isActive,
    });
    setIsEdit(true);
    setEditId(item?._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    console.log("item",item);
    
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Institutional Projects?",
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

      await axios.delete(
        `${API_URL}/institutionalprojects/delete-institutional-project/${item?._id}`,
        {
          data: {
            isActive: !item.isActive,
            updateby: decoded?._id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      getInstitutionalProjects();

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: "Institutional Projects has been successfully deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the Institutional Projects.",
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
            {hasAddAccess("Institutional Projects") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Institutional Projects
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <InstitutionalProjectsForm
            data={data}
            setData={setData}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editId={editId}
            handleClose={handleClose}
            getInstitutionalProjects={getInstitutionalProjects}
          />
        )}
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <InstitutionalProjectsTable
            data={institutionalProjects?.data || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            pagination={pagination}
            setPagination={setPagination}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
            hasAddAccess={hasAddAccess}
            handleDelete={handleDelete}
            hasDeleteAccess={hasDeleteAccess}
          />
        </div>
      </div>
    </>
  );
}

export default InstitutionalProjects;
