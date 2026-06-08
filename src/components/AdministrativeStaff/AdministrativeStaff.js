import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import AdministrativeStaffForm from "./AdministrativeStaffForm";
import AdministrativeStaffTable from "./AdministrativeStaffTable";
import { usePermissions } from "../User_Management/UserManagement";

function AdministrativeStaff() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [preview, setPreview] = useState(null);
  const [allStaff, setAllStaff] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    department_en: "",
    department_hi: "",
    staffName_en: "",
    staffName_hi: "",
    designationId: "",
    phone: "",
    email: "",
    education_en: "",
    education_hi: "",
    imageTitle: "",
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

  const getAdministrativeStaff = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/AdministrativeStaffRoutes/getall`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAllStaff(response?.data?.data);
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
    getAdministrativeStaff();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/AdministrativeStaffRoutes/updateStatus/${item?._id}`,
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

      setAllStaff((prev) =>
        prev.map((row) =>
          row._id === item._id ? { ...row, isActive: !row.isActive } : row,
        ),
      );
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleEdit = (item) => {
    console.log("item", item);

    setData({
      department_en: item?.department?.en,
      department_hi: item?.department?.hi,
      staffName_en: item?.staffName?.en,
      staffName_hi: item?.staffName?.hi,
      designationId: item?.designationId?._id,
      phone: item?.phone,
      email: item?.email,
      education_en: item?.education?.en,
      education_hi: item?.education?.hi,
      imageTitle: item?.imageTitle,
      photo: item?.photo,
      isActive: item?.isActive ?? true,
    });

    if (item?.photo !== null) {
      setPreview(`${IMG_BASE_URL}/${item?.photo}`);
    }

    setEditId(item?._id);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setData({
      department_en: "",
      department_hi: "",
      staffName_en: "",
      staffName_hi: "",
      designationId: "",
      phone: "",
      email: "",
      education_en: "",
      education_hi: "",
      imageTitle: "",
      photo: null,
      isActive: true,
    });
    setPreview(null);
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
            {hasAddAccess("Administrative Staff") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Administrative Staff
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <AdministrativeStaffForm
            data={data}
            setData={setData}
            setPreview={setPreview}
            isEdit={isEdit}
            editId={editId}
            getAdministrativeStaff={getAdministrativeStaff}
            setAllStaff={setAllStaff}
            preview={preview}
            handleClose={handleClose}
          />
        )}
        <div className="card mb-4 custom-panel-table mt-3" style={{ width: "90%", marginLeft: "5%" }}>
          <AdministrativeStaffTable
            data={allStaff || []}
            handleToggle={handleToggle}
            pagination={pagination}
            setPagination={setPagination}
            handleEdit={handleEdit}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
          />
        </div>
      </div>
    </>
  );
}

export default AdministrativeStaff;
