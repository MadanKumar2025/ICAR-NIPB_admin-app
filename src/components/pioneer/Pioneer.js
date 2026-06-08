import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { usePermissions } from "../User_Management/UserManagement";
import PioneerForm from "./PioneerForm";
import PioneerTable from "./PioneerTable";

function Pioneer() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [pioneer, setPioneer] = useState([]);
  const [data, setData] = useState({
    title_en: "",
    title_hi: "",
    url: "",
    photo: null,
    isActive: true,
  });

  const token = localStorage.getItem("token");
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);

  const [isEdit, setIsEdit] = useState(false);
  const handleClose = () => {
    setShowForm(false);
    setData({
      title_en: "",
      title_hi: "",
      url: "",
      photo: null,
      isActive: true,
    });
    setPreview(null);
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getpioneer = async () => {
    try {
      const response = await axios.get(`${API_URL}/pioneerRoutes/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPioneer(response.data);
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
    getpioneer();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/pioneerRoutes/updateStatus/${item?.id}`,
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

      setPioneer((prev) => ({
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
    console.log("item", item);

    setData({
      title_en: item?.title?.en || "",
      title_hi: item?.title?.hi || "",
      url: item?.url || "",
      photoTitle: item?.photoTitle || "",
      photo: item?.photo || "",
      isActive: item?.isActive ?? true,
    });
    if (item?.photo !== null) {
      setPreview(`${IMG_BASE_URL}/${item?.photo}`);
    }

    setIsEdit(true);
    setEditId(item?.id);
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
            {hasAddAccess("pioneer") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create pioneer
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <PioneerForm
            data={data}
            handleClose={handleClose}
            setData={setData}
            setPreview={setPreview}
            editId={editId}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            getpioneer={getpioneer}
            preview={preview}
          />
        )}
        <div className="card mb-4 custom-panel-table mt-3" style={{ width: "90%", marginLeft: "5%" }}>
          <PioneerTable
            data={pioneer?.data || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            pagination={pagination}
            setPagination={setPagination}
            hasActiveAccess={hasActiveAccess}
            hasEditAccess={hasEditAccess}
          />
        </div>
      </div>
    </>
  );
}

export default Pioneer;
