import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import StaffTable from "./StaffTable";
import { jwtDecode } from "jwt-decode";
import StaffForm from "./StaffForm";
import { usePermissions } from "../User_Management/UserManagement";

function Staff() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [preview, setPreview] = useState(null);
  const [allStaff, setAllStaff] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    department_en: "",
    department_hi: "",
    staffName_en: "",
    staffName_hi: "",
    designation_en: "",
    designation_hi: "",
    phone: "",
    email: "",
    displayOrder: "",
    education_en: "",
    education_hi: "",
    research_en: "",
    research_hi: "",
    publications_en: "",
    publications_hi: "",
    imageTitle: "",
    photo: null,
    awards: [{ en: "", hi: "" }],
    ipr: [{ en: "", hi: "" }],
    isActive: true,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const formRef = useRef();
  const editor = useRef(null);
  const token = localStorage.getItem("token");

  const getStaffData = async () => {
    try {
      const response = await axios.get(`${API_URL}/staff/allStaff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllStaff(response?.data?.data);
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
    getStaffData();
  }, []);

  const handleToggle = async (item) => {
    console.log("item", item);

    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/staff/staffStatus/${item?._id}`,
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

      setAllStaff((prev) =>
        prev.map((row) =>
          row._id === item._id ? { ...row, isActive: !row.isActive } : row,
        ),
      );
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleEdit = (item) => {
    setData({
      department_en: item?.department?.en,
      department_hi: item?.department?.hi,
      staffName_en: item?.staffName?.en,
      staffName_hi: item?.staffName?.hi,
      designation_en: item?.designation?.en,
      designation_hi: item?.designation?.hi,
      phone: item?.phone,
      email: item?.email,
      displayOrder: item?.displayOrder,
      education_en: item?.education?.en,
      education_hi: item?.education?.hi,
      imageTitle: item?.imageTitle,
      photo: item?.photo,
      research_en: item?.Research?.en,
      research_hi: item?.Research?.hi,
      awards: item?.Awards,
      publications_en: item?.Publications?.en,
      publications_hi: item?.Publications?.hi,
      ipr: item?.IPR,
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
      department_en: "",
      department_hi: "",
      staffName_en: "",
      staffName_hi: "",
      designation_en: "",
      designation_hi: "",
      phone: "",
      email: "",
      displayOrder: "",
      education_en: "",
      education_hi: "",
      research_en: "",
      research_hi: "",
      publications_en: "",
      publications_hi: "",
      imageTitle: "",
      photo: null,
      awards: [{ en: "", hi: "" }],
      ipr: [{ en: "", hi: "" }],
      isActive: true,
    });
    setEditId(null);
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
            {(hasAddAccess("Staff") ||
              hasAddAccess("Technical Staff") ||
              hasAddAccess("Honorary Scientist") ||
              hasAddAccess("Administrative Staff")) && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Staff
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <StaffForm
            data={data}
            setData={setData}
            setPreview={setPreview}
            isEdit={isEdit}
            editId={editId}
            getStaffData={getStaffData}
            setAllStaff={setAllStaff}
            preview={preview}
            handleClose={handleClose}
          />
        )}
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <StaffTable
            data={allStaff || []}
            handleToggle={handleToggle}
            pagination={pagination}
            setPagination={setPagination}
            handleEdit={handleEdit}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
          />
        </div>
      </div>
    </>
  );
}

export default Staff;
