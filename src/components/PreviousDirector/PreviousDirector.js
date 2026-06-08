import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PreviousDirectorTable from "./PreviousDirectorTable";
import PreviousDirectorForm from "./PreviousDirectorForm";
import { usePermissions } from "../User_Management/UserManagement";

function PreviousDirector() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
    const { hasAddAccess,hasActiveAccess,hasEditAccess } = usePermissions();

  const [PreviousDirector, setPreviousDirector] = useState([]);
  const [data, setData] = useState({
    name_en: "",
    name_hi: "",
    workingPeriod: "",
    photoTitle: "",
    photo: null,
    acting: true,
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
      name_en: "",
      name_hi: "",
      workingPeriod: "",
      photoTitle: "",
      photo: null,
      acting: true,
      isActive: true,
    });
    setPreview(null);
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getPreviousDirector = async () => {
    try {
      const response = await axios.get(`${API_URL}/PreviousDirector/Getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPreviousDirector(response.data);
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
    getPreviousDirector();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/PreviousDirector/updateStatus/${item?._id}`,
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

      setPreviousDirector((prev) => ({
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
      workingPeriod: item?.workingPeriod || "",
      photoTitle: item?.photoTitle || "",
      acting: item?.acting || true,
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
            style={{ marginTop: "2vh", marginBottom: "2vh", marginRight: "4vw",}}
          >
           {hasAddAccess("Previous Director") && (  <button className="btn btn-info" onClick={() => setShowForm(true)}>
              Create Previous Director
            </button>)}
          </div>
        </div>
        {showForm && (
          <PreviousDirectorForm
            data={data}
            handleClose={handleClose}
            setData={setData}
            setPreview={setPreview}
            editId={editId}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            getPreviousDirector={getPreviousDirector}
            preview={preview}
          />
        )}
        <div className="card mb-4 custom-panel-table mt-3" style={{ width: "90%", marginLeft: "5%" }}>
          <PreviousDirectorTable
            data={PreviousDirector?.data || []}
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

export default PreviousDirector;
