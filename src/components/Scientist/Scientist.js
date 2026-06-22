import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ScientistTable from "./ScientistTable";
import { jwtDecode } from "jwt-decode";
import ScientistForm from "./ScientistForm";
import { usePermissions } from "../User_Management/UserManagement";
import { useNavigate } from "react-router-dom";

function Scientist() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [allScientist, setAllScientist] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [data, setData] = useState({
    scientistName_en: "",
    scientistName_hi: "",
    designationId: "",
    phone1: "",
    phone2: "",
    email1: "",
    email2: "",
    education_en: "",
    education_hi: "",
    majorCourses_en: "",
    majorCourses_hi: "",
    photoTitle: "",
    researchInterest_en: "",
    researchInterest_hi: "",
    publications_en: "",
    publications_hi: "",
    IPR_en: "",
    IPR_hi: "",
    awards_en: "",
    awards_hi: "",
    externallyFundedProjects_en: "",
    externallyFundedProjects_hi: "",
    displayOrder: "",
    photo: null,
    labProfile: [
      {
        name: { en: "", hi: "" },
        position: { en: "", hi: "" },
        duration: { en: "", hi: "" },
        project: { en: "", hi: "" },
        ImageTitle: "",
        photo: null,
      },
    ],
    isActive: true,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const token = localStorage.getItem("token");

  const getScientistData = async () => {
    try {
      const response = await axios.get(`${API_URL}/ScientistRoutes/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllScientist(response?.data?.data);
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
    getScientistData();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/ScientistRoutes/updateStatus/${item?.id}`,
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
      console.log("res", res);

      setAllScientist((prev) =>
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
      scientistName_en: item?.scientistName?.en || "",
      scientistName_hi: item?.scientistName?.hi || "",

      designationId: item?.designation?.id || "",
      phone1: item?.phone1 || "",
      phone2: item?.phone2 || "",

      email1: item?.email1 || "",
      email2: item?.email2 || "",

      education_en: item?.education?.en || "",
      education_hi: item?.education?.hi || "",

      majorCourses_en: item?.majorCourses?.en || "",
      majorCourses_hi: item?.majorCourses?.hi || "",

      photoTitle: item?.photoTitle || "",

      researchInterest_en: item?.researchInterest?.en || "",
      researchInterest_hi: item?.researchInterest?.hi || "",

      publications_en: item?.publications?.en || "",
      publications_hi: item?.publications?.hi || "",

      IPR_en: item?.IPR?.en || "",
      IPR_hi: item?.IPR?.hi || "",

      awards_en: item?.awards?.en || "",
      awards_hi: item?.awards?.hi || "",

      externallyFundedProjects_en: item?.externallyFundedProjects?.en || "",
      externallyFundedProjects_hi: item?.externallyFundedProjects?.hi || "",
      displayOrder: item?.displayOrder || "",
      photo: item?.photo || null,

      //  LAB PROFILE MAPPING (IMPORTANT)
      labProfile: item?.labProfile?.map((lab) => ({
        name: {
          en: lab?.name?.en || "",
          hi: lab?.name?.hi || "",
        },
        position: {
          en: lab?.position?.en || "",
          hi: lab?.position?.hi || "",
        },
        duration: {
          en: lab?.duration?.en || "",
          hi: lab?.duration?.hi || "",
        },
        project: {
          en: lab?.project?.en || "",
          hi: lab?.project?.hi || "",
        },
        ImageTitle: lab?.ImageTitle || "",
        photo: lab?.photo1 || null, // backend me photo1 hai
      })) || [
        {
          name: { en: "", hi: "" },
          position: { en: "", hi: "" },
          duration: { en: "", hi: "" },
          project: { en: "", hi: "" },
          ImageTitle: "",
          photo: null,
        },
      ],

      isActive: item?.isActive ?? true,
    });

    // IMAGE PREVIEW
    if (item?.photo) {
      setPreview(`${IMG_BASE_URL}/${item.photo}`);
    } else {
      setPreview(null);
    }

    setEditId(item?.id);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setData({
      scientistName_en: "",
      scientistName_hi: "",
      designationId: "",
      phone1: "",
      phone2: "",
      email1: "",
      email2: "",
      education_en: "",
      education_hi: "",
      majorCourses_en: "",
      majorCourses_hi: "",
      photoTitle: "",
      researchInterest_en: "",
      researchInterest_hi: "",
      publications_en: "",
      publications_hi: "",
      IPR_en: "",
      IPR_hi: "",
      awards_en: "",
      awards_hi: "",
      externallyFundedProjects_en: "",
      externallyFundedProjects_hi: "",
      photo: null,
      displayOrder: "",
      labProfile: [
        {
          name: { en: "", hi: "" },
          position: { en: "", hi: "" },
          duration: { en: "", hi: "" },
          project: { en: "", hi: "" },
          ImageTitle: "",
          photo: null,
        },
      ],
      isActive: true,
    });
    setPreview(null);
  };

  const handleCreateLogin = (id) => {
    navigate(`/CreateScientistLogin/${id}`);
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
            {(hasAddAccess("Scientist") || hasAddAccess("Faculty")) && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <ScientistForm
            data={data}
            setData={setData}
            setPreview={setPreview}
            isEdit={isEdit}
            editId={editId}
            getScientistData={getScientistData}
            setAllScientist={setAllScientist}
            preview={preview}
            handleClose={handleClose}
          />
        )}
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <ScientistTable
            data={allScientist || []}
            handleToggle={handleToggle}
            pagination={pagination}
            setPagination={setPagination}
            handleEdit={handleEdit}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
            handleCreateLogin={handleCreateLogin}
          />
        </div>
      </div>
    </>
  );
}

export default Scientist;
