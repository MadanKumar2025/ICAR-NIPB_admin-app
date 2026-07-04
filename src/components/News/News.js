import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import NewsTable from "./NewsTable";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NewsForm from "./NewsForm";
import { usePermissions } from "../User_Management/UserManagement";

function News() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [preview, setPreview] = useState(null);
  const [allNews, setAllNews] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    type: "",
    title_en: "",
    title_hi: "",
    link: "",
    documentFile: null,
    publishDate: "",
    expiryDate: "",
    isActive: true,
    markAsNew: "",
    DocumentType: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const location = useLocation();
  const token = localStorage.getItem("token");
  const formRef = useRef();

  const getNewsData = async () => {
    try {
      const response = await axios.get(`${API_URL}/news/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllNews(response?.data?.data);
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
    getNewsData();
  }, []);

  // const handleChange = (e) => {
  //   const { name, type, files, checked, value } = e.target;

  //   if (type === "file" && files.length > 0) {
  //     const file = files[0];

  //     setData((prev) => ({
  //       ...prev,
  //       [name]: file,
  //     }));

  //     const fileURL = URL.createObjectURL(file);
  //     setPreview(fileURL);
  //   } else if (type === "checkbox") {
  //     setData((prev) => ({
  //       ...prev,
  //       [name]: checked,
  //     }));
  //   } else if (name === "isActive") {
  //     setData((prev) => ({
  //       ...prev,
  //       isActive: value === "true",
  //     }));
  //   } else {
  //     setData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };

  const handleChange = (e) => {
    const { name, type, files, checked, value } = e.target;

    // Document Type change
    if (name === "DocumentType") {
      setData((prev) => ({
        ...prev,
        DocumentType: value,
        link: value === "Document" ? "" : prev.link,
        documentFile: value === "Link" ? "" : prev.documentFile,
      }));

      if (value === "Link") {
        setPreview(null);
      }

      return;
    }

    // File
    if (type === "file" && files.length > 0) {
      const file = files[0];

      setData((prev) => ({
        ...prev,
        [name]: file,
      }));

      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
    }
    // Checkbox
    else if (type === "checkbox") {
      setData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
    // Active
    else if (name === "isActive") {
      setData((prev) => ({
        ...prev,
        isActive: value === "true",
      }));
    }
    // Normal Input
    else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // const handleEdit = (item) => {
  //   setData({
  //     type: item?.type,
  //     title_en: item?.title?.en || "",
  //     title_hi: item?.title?.hi || "",
  //     link: item?.link,
  //     documentFile: item?.documentFile,
  //     publishDate: item?.publishDate ? item.publishDate.split("T")[0] : "",
  //     expiryDate: item?.expiryDate ? item.expiryDate.split("T")[0] : "",
  //     markAsNew: item?.markAsNew,
  //     isActive: item?.isActive ?? true,
  //   });

  //   if (item?.documentFile !== null) {
  //     setPreview(`${IMG_BASE_URL}/files/${item?.documentFile}`);
  //   }

  //   setEditId(item?.id);
  //   setIsEdit(true);
  //   setShowForm(true);
  // };

  const handleEdit = (item) => {
    // Check Document Type
    let documentType = "";

    if (item?.link && item.link.trim() !== "") {
      documentType = "Link";
    } else if (item?.documentFile) {
      documentType = "Document";
    }

    setData({
      type: item?.type || "",
      title_en: item?.title?.en || "",
      title_hi: item?.title?.hi || "",
      DocumentType: documentType,
      link: item?.link || "",
      documentFile: item?.documentFile || "",
      publishDate: item?.publishDate ? item.publishDate.split("T")[0] : "",
      expiryDate: item?.expiryDate ? item.expiryDate.split("T")[0] : "",
      markAsNew: item?.markAsNew || false,
      isActive: item?.isActive ?? true,
    });

    // Preview only if document exists
    if (item?.documentFile) {
      setPreview(`${IMG_BASE_URL}/files/${item.documentFile}`);
    } else {
      setPreview(null);
    }

    setEditId(item?.id);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/news/status/${item?.id}`,
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

      setAllNews((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, isActive: !row.isActive } : row,
        ),
      );
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setData({
      type: "",
      title_en: "",
      title_hi: "",
      link: "",
      documentFile: "",
      publishDate: "",
      expiryDate: "",
      markAsNew: "",
      DocumentType: "",
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
            {hasAddAccess("News") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create News
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <NewsForm
            handleChange={handleChange}
            data={data}
            isEdit={isEdit}
            editId={editId}
            setData={setData}
            setPreview={setPreview}
            getNewsData={getNewsData}
            preview={preview}
            handleClose={handleClose}
          />
        )}

        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <NewsTable
            data={allNews || []}
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

export default News;
