import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import ContentForm from "./ContentForm";
import { useParams } from "react-router-dom";
import { usePermissions } from "../User_Management/UserManagement";

function Content() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const { id } = useParams();
  const [preview, setPreview] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [data, setData] = useState({
    content_en: "",
    content_hi: "",
  });

  const token = localStorage.getItem("token");

  const getContent = async () => {
    try {
      const response = await axios.get(`${API_URL}/ContentRoutes/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedData = response?.data?.data?.[0];

      if (fetchedData) {
        setData({
          content_en: fetchedData.content?.en || "",
          content_hi: fetchedData.content?.hi || "",
        });
      }
      setPreview(`${IMG_BASE_URL}/${fetchedData?.photo}`);

      setIsEdit(fetchedData.content?.en && true);
      setEditId(fetchedData?._id);
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
    getContent();
  }, []);

  return (
    <>
      <div>
        <ContentForm
          data={data}
          setData={setData}
          setPreview={setPreview}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          editId={editId}
          getContent={getContent}
          preview={preview}
          hasAddAccess={hasAddAccess}
          hasEditAccess={hasEditAccess}
        />
      </div>
    </>
  );
}

export default Content;
