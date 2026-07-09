import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ExternallyFundedProjectsForm from "./ExternallyFundedProjectsForm";
import ExternallyFundedProjectsTable from "./ExternallyFundedProjectsTable";
import { usePermissions } from "../User_Management/UserManagement";
import Swal from "sweetalert2";

function ExternallyFundedProjects() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess, hasDeleteAccess } =
    usePermissions();

  const [externallyFundedProjects, setExternallyFundedProjects] = useState([]);

  const [data, setData] = useState({
    title_en: "",
    title_hi: "",
    fundingAgency_en: "",
    fundingAgency_hi: "",
    sanctionedBudget_en: "",
    sanctionedBudget_hi: "",
    principalInvestigator_en: "",
    principalInvestigator_hi: "",
    isActive: true,
  });

  const token = localStorage.getItem("token");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setShowForm(false);
    setData({
      title_en: "",
      title_hi: "",
      fundingAgency_en: "",
      fundingAgency_hi: "",
      sanctionedBudget_en: "",
      sanctionedBudget_hi: "",
      principalInvestigator_en: "",
      principalInvestigator_hi: "",
      isActive: true,
    });
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getExternallyFundedProjects = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/externallyFundedProject/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setExternallyFundedProjects(response.data);
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
    getExternallyFundedProjects();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/externallyFundedProject/updateExternallyFP/${item?.id}`,
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

      setExternallyFundedProjects((prev) => ({
        ...prev,
        data: prev.data.map((row) =>
          row?.id === item?.id ? { ...row, isActive: !row?.isActive } : row,
        ),
      }));
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleEdit = (item) => {
    setData({
      title_en: item?.title?.en || "",
      title_hi: item?.title?.hi || "",
      fundingAgency_en: item?.fundingAgency?.en || "",
      fundingAgency_hi: item?.fundingAgency?.hi || "",
      sanctionedBudget_en: item?.sanctionedBudget?.en || "",
      sanctionedBudget_hi: item?.sanctionedBudget?.hi || "",
      principalInvestigator_en: item?.principalInvestigator?.en || "",
      principalInvestigator_hi: item?.principalInvestigator?.hi || "",
      isActive: item?.isActive ?? true,
    });
    setIsEdit(true);
    setEditId(item?.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    console.log("item", item);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Externally Funded Projects?",
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
        `${API_URL}/externallyFundedProject/delete-externally-funded-project/${item?.id}`,
        {
          data: {
            isActive: !item.isActive,
            updateby: decoded?.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      getExternallyFundedProjects();

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: " Externally Funded Projects has been successfully deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the  Externally Funded Projects.",
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
            {hasAddAccess("Externally Funded Projects") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Externally Funded Projects
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <ExternallyFundedProjectsForm
            data={data}
            setData={setData}
            handleClose={handleClose}
            getExternallyFundedProjects={getExternallyFundedProjects}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editId={editId}
          />
        )}
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <ExternallyFundedProjectsTable
            data={externallyFundedProjects?.data || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            pagination={pagination}
            setPagination={setPagination}
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

export default ExternallyFundedProjects;
