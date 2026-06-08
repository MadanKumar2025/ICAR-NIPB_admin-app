import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import DocumentUploaderForm from "./DocumentUploaderForm";
import DocumentUploaderTable from "./DocumentUploaderTable";
import Swal from "sweetalert2";
import { usePermissions } from "../User_Management/UserManagement";

function DocumentUploader() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess,hasDeleteAccess } = usePermissions();

  const [preview, setPreview] = useState(null);
  const [document, setDocument] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    title: "",
    documentFile: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const token = localStorage.getItem("token");

  const getDocument = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/DocumentUploaderRoutes/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDocument(response?.data?.data);
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
    getDocument();
  }, []);

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const decoded = jwtDecode(token);

      await axios.delete(
        `${API_URL}/DocumentUploaderRoutes/delete/${item?.id}`,
        {
          data: {
            isActive: !item.isActive,
            updateby: decoded.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      getDocument();

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: "Item has been successfully deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the item.",
        icon: "error",
      });

      alert.error("Status update error", error);
    }
  };

  const handleEdit = (item) => {
    setData({
      title: item?.title,
      documentFile: item?.documentFile,
    });
    if (item?.documentFile !== null) {
      setPreview(`${IMG_BASE_URL}/files/${item?.documentFile}`);
    }
    setEditId(item?.id);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setData({
      title: "",
      documentFile: "",
    });
    setPreview(null);
    setIsEdit(false);
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
            {hasAddAccess("Document Uploader") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Document
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <DocumentUploaderForm
            data={data}
            setData={setData}
            setPreview={setPreview}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editId={editId}
            getDocument={getDocument}
            preview={preview}
            handleClose={handleClose}
          />
        )}
        <div className="card mb-4 custom-panel-table mt-3" style={{ width: "90%", marginLeft: "5%" }}>
          <DocumentUploaderTable
            data={document || []}
            handleDelete={handleDelete}
            setPagination={setPagination}
            handleEdit={handleEdit}
            handleClose={handleClose}
            IMG_BASE_URL={IMG_BASE_URL}
            pagination={pagination}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
            hasDeleteAccess={hasDeleteAccess}
          />
        </div>
      </div>
    </>
  );
}

export default DocumentUploader;
