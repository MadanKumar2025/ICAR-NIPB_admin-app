import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { usePermissions } from "../User_Management/UserManagement";
import TrainingProgramForm from "./TrainingProgramForm";
import TrainingProgramTable from "./TrainingProgramTable";
import Swal from "sweetalert2";

function TrainingProgram() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess, hasDeleteAccess } =
    usePermissions();

  const [preview, setPreview] = useState(null);
  const [trainingProgram, setTrainingProgram] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    title_en: "",
    title_hi: "",
    description_en: "",
    description_hi: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const token = localStorage.getItem("token");

  const getTrainingProgram = async () => {
    try {
      const response = await axios.get(`${API_URL}/TrainingProgramRoutes/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTrainingProgram(response?.data?.data);
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
    getTrainingProgram();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/TrainingProgramRoutes/updateStatus/${item?.id}`,
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

      setTrainingProgram((prev) =>
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
      title_en: item?.title?.en,
      title_hi: item?.title?.hi,
      description_en: item?.description?.en,
      description_hi: item?.description?.hi,
    });

    setEditId(item?.id);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setData({
      title_en: "",
      title_hi: "",
      description_en: "",
      description_hi: "",
      isActive: true,
    });
    setEditId(null);
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Training Program  ?",
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
        `${API_URL}/TrainingProgramRoutes/delete-training-program/${item?.id}`,
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

      getTrainingProgram();

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: "Training Program has been successfully deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the Training Program.",
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
            {hasAddAccess("Api Function Mapping Web") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Training Program
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <TrainingProgramForm
            data={data}
            setData={setData}
            setPreview={setPreview}
            isEdit={isEdit}
            editId={editId}
            getTrainingProgram={getTrainingProgram}
            setTrainingProgram={setTrainingProgram}
            preview={preview}
            handleClose={handleClose}
          />
        )}
        <div className="card mb-4" style={{ width: "90%", marginLeft: "5%" }}>
          <TrainingProgramTable
            data={trainingProgram || []}
            handleToggle={handleToggle}
            pagination={pagination}
            setPagination={setPagination}
            handleEdit={handleEdit}
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

export default TrainingProgram;
