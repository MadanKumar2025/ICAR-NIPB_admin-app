import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

import { usePermissions } from "../User_Management/UserManagement";
import VigilanceOfficerForm from "./VigilanceOfficerForm";
import VigilanceOfficerTable from "./VigilanceOfficerTable";

function VigilanceOfficer() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess, hasDeleteAccess } =
    usePermissions();

  const [preview, setPreview] = useState(null);
  const [allVigilanceOfficer, setAllVigilanceOfficer] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    name_en: "",
    name_hi: "",
    type_en: "",
    type_hi: "",
    number: "",
    email: "",
    designationId: "",
    photoTitle: "",
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

  const getvigilanceOfficer = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/VigilanceOfficerRoutes/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAllVigilanceOfficer(response?.data?.data);
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
    getvigilanceOfficer();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/VigilanceOfficerRoutes/status/${item?.id}`,
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
      console.log("res", res);

      setAllVigilanceOfficer((prev) =>
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
      name_en: item?.name?.en,
      name_hi: item?.name?.hi,
      type_en: item?.type?.en,
      type_hi: item?.type?.hi,
      number: item?.number,
      email: item?.email,
      designationId: item?.designation?._id,
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
      name_en: "",
      name_hi: "",
      type_en: "",
      type_hi: "",
      number: "",
      email: "",
      designationId: "",
      photoTitle: "",
      photo: null,
      isActive: true,
    });
    setPreview(null);
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this vigilance Officer?",
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
        `${API_URL}/VigilanceOfficerRoutes/delete-vigilance-officer/${item?.id}`,
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

      getvigilanceOfficer();

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: "vigilance Officer has been successfully deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the vigilance Officer.",
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
            {hasAddAccess("Vigilance Officer") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Vigilance Officer
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <VigilanceOfficerForm
            data={data}
            setData={setData}
            setPreview={setPreview}
            isEdit={isEdit}
            editId={editId}
            getvigilanceOfficer={getvigilanceOfficer}
            setAllVigilanceOfficer={setAllVigilanceOfficer}
            preview={preview}
            handleClose={handleClose}
          />
        )}
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <VigilanceOfficerTable
            data={allVigilanceOfficer || []}
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

export default VigilanceOfficer;
