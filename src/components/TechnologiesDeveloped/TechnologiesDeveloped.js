import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import TechnologiesDevelopedForm from "./TechnologiesDevelopedForm";
import TechnologiesDevelopedTable from "./TechnologiesDevelopedTable";
import { usePermissions } from "../User_Management/UserManagement";

function TechnologiesDeveloped() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [technologiesDeveloped, setTechnologiesDeveloped] = useState([]);

  const [data, setData] = useState({
    nameOfOtherParty_en: "",
    nameOfOtherParty_hi: "",
    collaboratingInstituteICAR_en: "",
    collaboratingInstituteICAR_hi: "",
    nameOfTechnology_en: "",
    nameOfTechnology_hi: "",
    mouDate: "",
    duration: "",
    isActive: true,
  });

  console.log("technologiesDeveloped", technologiesDeveloped);

  const token = localStorage.getItem("token");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setShowForm(false);
    setData({
      nameOfOtherParty_en: "",
      nameOfOtherParty_hi: "",
      collaboratingInstituteICAR_en: "",
      collaboratingInstituteICAR_hi: "",
      nameOfTechnology_en: "",
      nameOfTechnology_hi: "",
      mouDate: new Date(),
      duration: "",
      isActive: true,
    });
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getTechnologiesDeveloped = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/technologiesDeveloped/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTechnologiesDeveloped(response.data);
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
    getTechnologiesDeveloped();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/technologiesDeveloped/updateStatus/${item?._id}`,
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

      setTechnologiesDeveloped((prev) => ({
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
      nameOfOtherParty_en: item?.nameOfOtherParty?.en || "",
      nameOfOtherParty_hi: item?.nameOfOtherParty?.hi || "",
      collaboratingInstituteICAR_en: item?.collaboratingInstituteICAR?.en || "",
      collaboratingInstituteICAR_hi: item?.collaboratingInstituteICAR?.hi || "",
      nameOfTechnology_en: item?.nameOfTechnology?.en || "",
      nameOfTechnology_hi: item?.nameOfTechnology?.hi || "",
      mouDate: item?.mouDate ? item.mouDate.split("T")[0] : "",
      duration: item?.duration || "",
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
          {hasAddAccess("Technologies Developed") && (   <button className="btn btn-info" onClick={() => setShowForm(true)}>
              Create Technologies Developed
            </button>)}
          </div>
        </div>
        {showForm && (
          <TechnologiesDevelopedForm
            data={data}
            setData={setData}
            handleClose={handleClose}
            getTechnologiesDeveloped={getTechnologiesDeveloped}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editId={editId}
          />
        )}
        <div className="card mb-4" style={{ width: "90%", marginLeft: "5%" }}>
          <TechnologiesDevelopedTable
            data={technologiesDeveloped?.data || []}
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

export default TechnologiesDeveloped;
