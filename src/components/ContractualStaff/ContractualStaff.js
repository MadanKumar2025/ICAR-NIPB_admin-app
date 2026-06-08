import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ContractualStaffForm from "./ContractualStaffForm";
import ContractualStaffTable from "./ContractualStaffTable";
import { usePermissions } from "../User_Management/UserManagement";

function ContractualStaff() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
    const { hasAddAccess,hasActiveAccess,hasEditAccess } = usePermissions();

  const [contractualStaff, setContractualStaff] = useState([]);

  const [preview, setPreview] = useState(null);
  const [data, setData] = useState({
    name_en: "",
    name_hi: "",
    position_en: "",
    position_hi: "",
    associatedLabDivision_en: "",
    associatedLabDivision_hi: "",
    contactNumber: "",
    email: "",
    photoTitle: "",
    photo: "",
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
      category: "",
      year: "",
      isActive: true,
    });
    setPreview(null)
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getContractualStaff = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/ContractualStaffRoutes/GetAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setContractualStaff(response.data);
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
    getContractualStaff();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/ContractualStaffRoutes/updateStatus/${item?._id}`,
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

      setContractualStaff((prev) => ({
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
      name_en: item?.name?.en || "",
      name_hi: item?.name?.hi || "",
      position_en: item?.position?.en || "",
      position_hi: item?.position?.hi || "",
      associatedLabDivision_en: item?.associatedLabDivision?.en || "",
      associatedLabDivision_hi: item?.associatedLabDivision?.hi || "",
      contactNumber: item?.contactNumber || "",
      email: item?.email || "",
      photoTitle: item?.photoTitle || "",
      photo: item?.photo || "",
      isActive: item?.isActive ?? true,
    });
      if (item?.photo !== null) {
      setPreview(`${IMG_BASE_URL}/${item?.photo}`);
    }
    setIsEdit(true);
    setEditId(item?._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div>
        <div className="d-flex justify-content-end">
          <div
            className="card-footer"
            style={{ marginTop: "2vh", marginBottom: "2vh", marginRight: "4vw", }}
          >
          {hasAddAccess("Contractual Staff") && (   <button className="btn btn-info" onClick={() => setShowForm(true)}>
              Create Contractual Staff
            </button>)}
          </div>
        </div>
        {showForm && (
          <ContractualStaffForm
            data={data}
            setData={setData}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editId={editId}
            handleClose={handleClose}
            getContractualStaff={getContractualStaff}
            setPreview={setPreview}
            preview={preview}
          />
        )}
        <div className="card mb-4 custom-panel-table mt-3" style={{ width: "90%", marginLeft: "5%" }}>
          <ContractualStaffTable
            data={contractualStaff?.data || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            pagination={pagination}
            setPagination={setPagination}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
          />
        </div>
      </div>
    </>
  );
}

export default ContractualStaff;
