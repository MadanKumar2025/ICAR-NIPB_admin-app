import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

import { usePermissions } from "../User_Management/UserManagement";
import AssociatedOrganizationForm from "./AssociatedOrganizationForm";
import AssociatedOrganizationTable from "./AssociatedOrganizationTable";

function AssociatedOrganization() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [preview, setPreview] = useState(null);
  const [associatedOrganization, setAssociatedOrganization] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    photoTitle: "",
    relatedLink: "",
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

  const getAssociatedOrganization = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/AssociatedOrganizationRoutes/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAssociatedOrganization(response?.data?.data);
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
    getAssociatedOrganization();
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

      setAssociatedOrganization((prev) =>
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
      photoTitle: "",
      relatedLink: "",
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
            {hasAddAccess("Associated Organization") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Associated Organization
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <AssociatedOrganizationForm
            data={data}
            setData={setData}
            setPreview={setPreview}
            isEdit={isEdit}
            editId={editId}
            getAssociatedOrganization={getAssociatedOrganization}
            setAssociatedOrganization={setAssociatedOrganization}
            preview={preview}
            handleClose={handleClose}
          />
        )}
        <div className="card mb-4 custom-panel-table mt-3" style={{ width: "90%", marginLeft: "5%" }}>
          <AssociatedOrganizationTable
            data={associatedOrganization || []}
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

export default AssociatedOrganization;
