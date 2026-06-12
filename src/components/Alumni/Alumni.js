import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import AlumniTable from "./AlumniTable";
import { usePermissions } from "../User_Management/UserManagement";
import AlumniForm from "./AlumniForm";

function Alumni() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;

  const token = localStorage.getItem("token");
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alumni, setAlumni] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [data, setData] = useState({
    name_en: "",
    name_hi: "",
    email: "",
    batch_en: "",
    batch_hi: "",
    degree_en: "",
    degree_hi: "",
    profileLink: "",
    facebook: "",
    twitter: "",
    youtube: "",
    linkedin: "",
    instagram: "",
    photoTitle: "",
    photo: "",
    designation_en: "",
    designation_hi: "",
    passOutYear: "",
    mobile: "",
    isApproved: true,
  });

  const getAlumni = async () => {
    try {
      const response = await axios.get(`${API_URL}/AlumniRoutes/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlumni(response.data);
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
    getAlumni();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/AlumniRoutes/approve/${item?.id}`,
        {
          isApproved: !item?.isApproved,
          updateby: decoded?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      //  Update UI instantly
      setAlumni((prev) => ({
        ...prev,
        data: prev.data.map((row) =>
          row?.id === item?.id
            ? { ...row, isApproved: !row?.isApproved }
            : row,
        ),
      }));
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setData({
      name_en: "",
      name_hi: "",
      email: "",
      batch_en: "",
      batch_hi: "",
      degree_en: "",
      degree_hi: "",
      profileLink: "",
      facebook: "",
      twitter: "",
      youtube: "",
      linkedin: "",
      instagram: "",
      photoTitle: "",
      photo: "",
      designation_en: "",
      designation_hi: "",
      passOutYear: "",
      mobile: "",
      isApproved: true,
    });
    setPreview(null);
    setIsEdit(false);
    setEditId(null);
  };

  const handleEdit = (item) => {    
    setData({
      name_en: item?.name?.en,
      name_hi: item?.name?.hi,
      email: item?.email,
      passOutYear: item?.passOutYear,
      designation_en: item?.designation.en,
      designation_hi: item?.designation.hi,
      mobile: item?.mobile,
      batch_en: item?.batch?.hi,
      batch_hi: item?.batch?.hi,
      degree_en: item?.degree?.hi,
      degree_hi: item?.degree?.hi,
      profileLink: item?.profileLink,
      facebook: item?.facebook,
      twitter: item?.twitter,
      youtube: item?.youtube,
      linkedin: item?.linkedin,
      instagram: item?.instagram,
      photoTitle: item?.photoTitle,
      photo: item?.photo,
      isApproved: item?.isApproved,
    });

    if (item?.photo !== null) {
      setPreview(`${IMG_BASE_URL}/${item?.photo}`);
    }

    setEditId(item?.id);
    setIsEdit(true);
    setShowForm(true);
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <div
          className="card-footer"
          style={{
            marginTop: "2vh",
            marginBottom: "2vh",
            marginRight: "4vw",
          }}
        >
          {hasAddAccess("Alumni") && (
            <button className="btn btn-info" onClick={() => setShowForm(true)}>
              Create Alumni
            </button>
          )}
        </div>
      </div>
      {showForm && (
        <AlumniForm
          data={data}
          setData={setData}
          isEdit={isEdit}
          editId={editId}
          preview={preview}
          setPreview={setPreview}
          getAlumni={getAlumni}
          setAlumni={setAlumni}
          handleClose={handleClose}
        />
      )}
      <div
        className="card mb-4 custom-panel-table mt-3"
        style={{ width: "90%", marginLeft: "5%" }}
      >
        <AlumniTable
          data={alumni?.data || []}
          handleToggle={handleToggle}
          pagination={pagination}
          setPagination={setPagination}
          hasEditAccess={hasEditAccess}
          handleEdit={handleEdit}
          hasActiveAccess={hasActiveAccess}
        />
      </div>
    </>
  );
}

export default Alumni;
