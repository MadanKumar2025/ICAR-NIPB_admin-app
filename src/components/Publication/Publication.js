import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PublicationForm from "./PublicationForm";
import PublicationTable from "./PublicationTable";
import { usePermissions } from "../User_Management/UserManagement";
import Swal from "sweetalert2";

function Publication() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess, hasDeleteAccess } =
    usePermissions();

  const [publication, setPublication] = useState([]);
  const [preview, setPreview] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [data, setData] = useState({
    title_en: "",
    title_hi: "",
    category: "",
    year: "",
    file: null,
    image: null,
    articleType_en: "",
    articleType_hi: "",
    isActive: true,
  });

  const token = localStorage.getItem("token");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setShowForm(false);
    setIsEdit(false);
    setData({
      title_en: "",
      title_hi: "",
      category: "",
      year: "",
      file: null,
      image: null,
      articleType_en: "",
      articleType_hi: "",
      isActive: true,
    });
    setPreview(null);
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getPublication = async () => {
    try {
      const response = await axios.get(`${API_URL}/PublicationsRoutes/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPublication(response.data);
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
    getPublication();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/PublicationsRoutes/updateStatus/${item?.id}`,
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

      setPublication((prev) => ({
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
    // console.log("item", item);

    setData({
      title_en: item?.title?.en || "",
      title_hi: item?.title?.hi || "",
      articleType_en: item?.articleType?.en || "",
      articleType_hi: item?.articleType?.hi || "",
      year: item?.year || "",
      category: item?.category,
      file: item?.file,
      image: item?.image,
      isActive: item?.isActive ?? true,
    });

    if (item?.file) {
      setPreview(`${IMG_BASE_URL}/files/${item.file}`);
    }

    if (item?.image) {
      setPreviewImage(`${IMG_BASE_URL}/files/${item.image}`);
    }

    setIsEdit(true);
    setEditId(item?.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Publication?",
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
        `${API_URL}/PublicationsRoutes/delete-publication/${item?.id}`,
        {
          data: {
            isActive: !item.isActive,
            updateby: decoded?.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      getPublication();

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: "Publication has been successfully deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the Publication.",
        icon: "error",
      });

      alert.error("Status update error", error);
    }
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
            {(hasAddAccess("Research Publications") ||
              hasAddAccess("Annual Report") ||
              hasAddAccess("Newsletters") ||
              hasAddAccess("Others") ||
              hasAddAccess("Hindi Patrika")) && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Publication
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <PublicationForm
            data={data}
            setData={setData}
            preview={preview}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            setPreview={setPreview}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editId={editId}
            handleClose={handleClose}
            getPublication={getPublication}
          />
        )}
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <PublicationTable
            data={publication?.data || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            pagination={pagination}
            setPagination={setPagination}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
            hasDeleteAccess={hasDeleteAccess}
            handleDelete={handleDelete}
            IMG_BASE_URL={IMG_BASE_URL}
          />
        </div>
      </div>
    </>
  );
}

export default Publication;
