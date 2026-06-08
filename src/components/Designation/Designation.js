import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import DesignationForm from "./DesignationForm";
import DesignationTable from "./DesignationTable";
import { usePermissions } from "../User_Management/UserManagement";

function Designation() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [preview, setPreview] = useState(null);
  const [designation, setDesignation] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    name_en: "",
    name_hi: "",
    isActive: true,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const token = localStorage.getItem("token");

  const getDesignation = async () => {
    try {
      const response = await axios.get(`${API_URL}/designation/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDesignation(response?.data?.data);
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
    getDesignation();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/designation/updateStatus/${item?._id}`,
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
      setDesignation((prev) =>
        prev.map((row) =>
          row._id === item._id ? { ...row, isActive: !row.isActive } : row,
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
      isActive: item?.isActive ?? true,
    });

    setEditId(item?.id);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setData({
      name_en: "",
      name_hi: "",
      isActive: true,
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
            {hasAddAccess("Designation") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Designation
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <DesignationForm
            data={data}
            setData={setData}
            setPreview={setPreview}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editId={editId}
            getDesignation={getDesignation}
            setAllStaff={setDesignation}
            preview={preview}
            handleClose={handleClose}
          />
        )}
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <DesignationTable
            data={designation || []}
            handleToggle={handleToggle}
            pagination={pagination}
            setPagination={setPagination}
            handleEdit={handleEdit}
            hasActiveAccess={hasActiveAccess}
            hasEditAccess={hasEditAccess}
          />
        </div>
      </div>
    </>
  );
}

export default Designation;
