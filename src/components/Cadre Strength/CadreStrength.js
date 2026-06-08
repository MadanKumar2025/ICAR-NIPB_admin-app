import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { usePermissions } from "../User_Management/UserManagement";
import CadreStrengthForm from "./CadreStrengthForm";
import CadreStrengthTable from "./CadreStrengthTable";

function CadreStrength() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [cadreStrength, setCadreStrength] = useState([]);

  const [preview, setPreview] = useState(null);
  const [data, setData] = useState({
    staff_en: "",
    staff_hi: "",
    sanctionedStrength: "",
    filled: "",
    vacant: "",
    isActive: true,
  });

  const token = localStorage.getItem("token");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setShowForm(false);
    setData({
      staff_en: "",
      staff_hi: "",
      sanctionedStrength: "",
      filled: "",
      vacant: "",
      isActive: true,
    });
    setPreview(null);
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getcadreStrength = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/CadreStrengthRoutes/getall`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCadreStrength(response.data);
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
    getcadreStrength();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/CadreStrengthRoutes/updateStatus/${item?._id}`,
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

      setCadreStrength((prev) => ({
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
      staff_en: item?.staff?.en || "",
      staff_hi: item?.staff?.hi || "",
      sanctionedStrength: item?.sanctionedStrength || "",
      filled: item?.filled || "",
      vacant: item?.vacant || "",
      isActive: item?.isActive ?? true,
    });

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
            style={{
              marginTop: "2vh",
              marginBottom: "2vh",
              marginRight: "4vw",
            }}
          >
            {hasAddAccess("Cadre Strength") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Cadre Strength
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <CadreStrengthForm
            data={data}
            setData={setData}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editId={editId}
            handleClose={handleClose}
            getcadreStrength={getcadreStrength}
            setPreview={setPreview}
            preview={preview}
          />
        )}
        <div className="card mb-4 custom-panel-table mt-3" style={{ width: "90%", marginLeft: "5%" }}>
          <CadreStrengthTable
            data={cadreStrength?.data || []}
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

export default CadreStrength;
