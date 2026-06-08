import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { usePermissions } from "../User_Management/UserManagement";
import ApiFunctionMappingWebForm from "./ApiFunctionMappingWebForm";
import ApiFunctionMappingWebTable from "./ApiFunctionMappingWebTable";

function ApiFunctionMappingWeb() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [preview, setPreview] = useState(null);
  const [apiFunctionMappingWeb, setApiFunctionMappingWeb] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    functionalityName: "",
    apiName: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const token = localStorage.getItem("token");

  const getApiFunctionMappingWeb = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/ApiFunctionMappingRoutes/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApiFunctionMappingWeb(response?.data?.data);
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
    getApiFunctionMappingWeb();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/AssociatedOrganizationRoutes/status/${item?.id}`,
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

      setApiFunctionMappingWeb((prev) =>
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
      photoTitle: item?.photoTitle,
      relatedLink: item?.relatedLink,
      photo: item?.photo,
      isActive: item?.isActive ?? true,
    });

    setEditId(item?.id);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setData({
      menuName: "",
      url: "",
      displayOrderNumber: "",
      isActive: true,
    });
  };

//   console.log("apiFunctionMappingWeb",apiFunctionMappingWeb);
  
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
            {hasAddAccess("Api Function Mapping Web") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Api Function Mapping Web
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <ApiFunctionMappingWebForm
            data={data}
            setData={setData}
            setPreview={setPreview}
            isEdit={isEdit}
            editId={editId}
            getApiFunctionMappingWeb={getApiFunctionMappingWeb}
            setApiFunctionMappingWeb={setApiFunctionMappingWeb}
            preview={preview}
            handleClose={handleClose}
          />
        )}
        <div className="card mb-4 custom-panel-table mt-3" style={{ width: "90%", marginLeft: "5%" }}>
          <ApiFunctionMappingWebTable
            data={apiFunctionMappingWeb || []}
            handleToggle={handleToggle}
            pagination={pagination}
            setPagination={setPagination}
            handleEdit={handleEdit}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
            IMG_BASE_URL={IMG_BASE_URL}
          />
        </div>
      </div>
    </>
  );
}

export default ApiFunctionMappingWeb;
