import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { usePermissions } from "../User_Management/UserManagement";
import PatentsForm from "./PatentsForm";
import PatentsTable from "./PatentsTable";

function Patents() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [patents, setPatents] = useState([]);

  const [preview, setPreview] = useState(null);
  const [data, setData] = useState({
   type_en: "",
      type_hi: "",
      title_en: "",
      title_hi: "",
      isActive: true,
  });

  const token = localStorage.getItem("token");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setShowForm(false);
    setData({
      type_en: "",
      type_hi: "",
      title_en: "",
      title_hi: "",
      isActive: true,
    });
    setPreview(null);
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getPatents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/PatentsRoutes/Getall`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPatents(response.data);
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
    getPatents();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/PatentsRoutes/updateStatus/${item?._id}`,
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

      setPatents((prev) => ({
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
      type_en: item?.type?.en || "",
      type_hi: item?.type?.hi || "",
      title_en: item?.title?.en || "",
      title_hi: item?.title?.hi || "",
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
            {hasAddAccess("Patents") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Patents
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <PatentsForm
            data={data}
            setData={setData}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editId={editId}
            handleClose={handleClose}
            getPatents={getPatents}
            setPreview={setPreview}
            preview={preview}
          />
        )}
        <div className="card mb-4" style={{ width: "90%", marginLeft: "5%" }}>
          <PatentsTable
            data={patents?.data || []}
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

export default Patents;
