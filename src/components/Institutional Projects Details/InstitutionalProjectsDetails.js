import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import InstitutionalProjectsDetailsForm from "./InstitutionalProjectsDetailsForm";
import { useParams } from "react-router-dom";
import InstitutionalProjectsDetailsTable from "./InstitutionalProjectsDetailsTable";
import Swal from "sweetalert2";
import { usePermissions } from "../User_Management/UserManagement.js";


function InstitutionalProjectsDetails() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess,hasDeleteAccess } = usePermissions();

  const [data, setData] = useState({
    subProjects_en: "",
    subProjects_hi: "",
    principalInvestigators_en: "",
    principalInvestigators_hi: "",
    institutionalProjectID: "",
    isActive: true,
  });

  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [institutionalProjectsDetails, setInstitutionalProjectsDetails] =
    useState([]);
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

  const getInstitutionalProjectsDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/institutionalProjectsDetailsRoutes/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setInstitutionalProjectsDetails(response?.data?.data);
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
    getInstitutionalProjectsDetails();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/institutionalProjectsDetailsRoutes/updateStatus/${item?._id}`,
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

      setInstitutionalProjectsDetails((prev) =>
        prev.map((row) =>
          row?._id === item?._id ? { ...row, isActive: !row?.isActive } : row,
        ),
      );
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleEdit = (item) => {
    setData({
      subProjects_en: item?.subProjects?.en || "",
      subProjects_hi: item?.subProjects?.hi || "",
      principalInvestigators_en: item?.principalInvestigators?.en || "",
      principalInvestigators_hi: item?.principalInvestigators?.hi || "",
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

  // const handleDelete = async (item) => {
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you really want to delete this project detail?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Yes, delete it!",
  //     cancelButtonText: "Cancel",
  //   });

  //   if (!result.isConfirmed) return;

  //   try {
  //     const decoded = jwtDecode(token);

  //     await axios.delete(
  //       `${API_URL}/institutionalProjectsDetailsRoutes/delete/${item?._id}`,
  //       {
  //         data: {
  //           isActive: false,
  //           updatedBy: decoded?.id,
  //         },
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     await getInstitutionalProjectsDetails();

  //     Swal.fire({
  //       title: "Deleted!",
  //       text: "Item has been successfully deleted.",
  //       icon: "success",
  //       timer: 1500,
  //       showConfirmButton: false,
  //     });
  //   } catch (error) {
  //     console.error("Delete error:", error);

  //     Swal.fire({
  //       title: "Error!",
  //       text: "An error occurred while deleting the item.",
  //       icon: "error",
  //     });
  //   }
  // };

  const handleDelete = async (item) => {
    if (!item?._id) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this project detail?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      let decoded = null;
      try {
        decoded = jwtDecode(token);
      } catch (err) {
        console.error("Token decode error:", err);
      }

      console.log("Deleting ID:", item._id);

      await axios.delete(
        `${API_URL}/institutionalProjectsDetailsRoutes/delete/${item._id}`,
        {
          data: {
            isActive: false,
            updatedBy: decoded?.id || null,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setInstitutionalProjectsDetails((prev) =>
        prev.filter((i) => i._id !== item._id),
      );

      await getInstitutionalProjectsDetails();

      console.log("Refetched after delete");

      Swal.fire({
        title: "Deleted!",
        text: "Item has been successfully deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete error:", error);

      if (
        error.response?.status === 401 ||
        error.response?.data?.message === "Invalid token"
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.message ||
          "An error occurred while deleting the item.",
        icon: "error",
      });
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
            {/* <button className="btn btn-info" onClick={() => setShowForm(true)}>
              Create Institutional Projects Details
            </button> */}
          </div>
        </div>
        {/* {showForm && ( */}
        {hasAddAccess("institutionalProjectsDetails") && (  <div>
          <InstitutionalProjectsDetailsForm
            data={data}
            setData={setData}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editId={editId}
            handleClose={handleClose}
            getInstitutionalProjectsDetails={getInstitutionalProjectsDetails}
          />
        </div>)}
        {/* )} */}
        <div className="card mb-4" style={{ width: "90%", marginLeft: "5%" }}>
          <InstitutionalProjectsDetailsTable
            data={institutionalProjectsDetails || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            pagination={pagination}
            setPagination={setPagination}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
            hasDeleteAccess={hasDeleteAccess}
          />
        </div>
      </div>
    </>
  );
}

export default InstitutionalProjectsDetails;
