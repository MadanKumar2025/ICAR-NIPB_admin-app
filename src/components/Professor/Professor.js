import { useEffect, useState } from "react";
import axios from "axios";
import { usePermissions } from "../User_Management/UserManagement.js";
import ProfessorForm from "./ProfessorForm.js";

function Professor() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [data, setData] = useState({
    name_en: "",
    name_hi: "",
    workingPeriod: "",
    email1: "",
    email2: "",
    phone: "",
    education_en: "",
    education_hi: "",
    message_en: "",
    message_hi: "",
    photoTitle: "",
    photo: null,
    isActive: true,
  });

  const token = localStorage.getItem("token");
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);

  const [isEdit, setIsEdit] = useState(false);

  const getDirector = async () => {
    try {
      const response = await axios.get(`${API_URL}/ProfessorRoutes/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const record = response?.data?.data?.[0];

      if (!record) {
        setIsEdit(false);
        setEditId(null);
        return;
      }

      setIsEdit(true);
      setEditId(record?._id || null);

      setData({
        name_en: response?.data?.data[0]?.name?.en,
        name_hi: response?.data?.data[0]?.name?.hi,
        workingPeriod: response?.data?.data[0]?.workingPeriod,
        photoTitle: response?.data?.data[0]?.photoTitle,
        email1: response?.data?.data[0]?.email1,
        email2: response?.data?.data[0]?.email2,
        phone: response?.data?.data[0]?.phone,
        education_en: response?.data?.data[0]?.education?.en,
        education_hi: response?.data?.data[0]?.education?.hi,
        message_en: response?.data?.data[0]?.message?.en,
        message_hi: response?.data?.data[0]?.message?.hi,
        photo: response?.data?.data[0]?.photo,
        isActive: response?.data?.data[0]?.isActive,
      });
      if (response?.data?.data[0]?.photo) {
        setPreview(`${IMG_BASE_URL}/${response?.data?.data[0]?.photo}`);
      }
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
    getDirector();
  }, []);

  return (
    <>
      <div>
        <ProfessorForm
          data={data}
          setData={setData}
          setPreview={setPreview}
          editId={editId}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
          getDirector={getDirector}
          preview={preview}
          hasAddAccess={hasAddAccess}
          hasEditAccess={hasEditAccess}
        />
      </div>
    </>
  );
}

export default Professor;
