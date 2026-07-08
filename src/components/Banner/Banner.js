import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { usePermissions } from "../User_Management/UserManagement";
import BannerTable from "./BannerTable";
import BannerForm from "./BannerForm";
import Swal from "sweetalert2";

function Banner() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess, hasDeleteAccess } =
    usePermissions();

  const [banner, setBanner] = useState([]);
  const [data, setData] = useState({
    title_en: "",
    title_hi: "",
    subTitle_en: "",
    subTitle_hi: "",
    displayOrderNo: "",
    bannerTitle: "",
    publishDate: "",
    expiryDate: "",
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
      subTitle_en: "",
      subTitle_hi: "",
      displayOrderNo: "",
      bannerTitle: "",
      publishDate: "",
      expiryDate: "",
      photo: null,
      isActive: true,
    });
    setPreview(null);
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getBanner = async () => {
    try {
      const response = await axios.get(`${API_URL}/BannerRoutes/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBanner(response.data);
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
    getBanner();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/BannerRoutes/updateStatus/${item?._id}`,
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

      setBanner((prev) => ({
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
      title_en: item?.title?.en || "",
      title_hi: item?.title?.hi || "",
      subTitle_en: item?.subTitle?.en || "",
      subTitle_hi: item?.subTitle?.hi || "",
      displayOrderNo: item?.displayOrderNo || true,
      bannerTitle: item?.bannerTitle || true,
      photo: item?.bannerImage || "",
      isActive: item?.isActive ?? true,
      publishDate: item?.publishDate ? item.publishDate.split("T")[0] : "",

      expiryDate: item?.expiryDate ? item.expiryDate.split("T")[0] : "",
    });
    if (item?.bannerImage !== null) {
      setPreview(`${IMG_BASE_URL}/${item?.bannerImage}`);
    }

    setIsEdit(true);
    setEditId(item?._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Banner?",
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

      await axios.delete(`${API_URL}/BannerRoutes/delete/${item?._id}`, {
        data: {
          isActive: !item.isActive,
          updateby: decoded?._id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getBanner();

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: "Banner has been successfully deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the Banner.",
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
            {hasAddAccess("Banner") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Banner
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <BannerForm
            data={data}
            handleClose={handleClose}
            setData={setData}
            setPreview={setPreview}
            editId={editId}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            getBanner={getBanner}
            preview={preview}
          />
        )}
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <BannerTable
            data={banner?.data || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            pagination={pagination}
            setPagination={setPagination}
            hasActiveAccess={hasActiveAccess}
            hasEditAccess={hasEditAccess}
            handleDelete={handleDelete}
            hasDeleteAccess={hasDeleteAccess}
          />
        </div>
      </div>
    </>
  );
}

export default Banner;
