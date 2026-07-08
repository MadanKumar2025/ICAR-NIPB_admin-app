import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import StudentCourseForm from "./StudentCourseForm";
import StudentCourseTable from "./StudentCourseTable";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import Student from "../Student/Student";
import { usePermissions } from "../User_Management/UserManagement";
import Swal from "sweetalert2";

function StudentCourse() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const { hasAddAccess, hasActiveAccess, hasEditAccess, hasDeleteAccess } =
    usePermissions();

  const [studentCourse, setStudentCourse] = useState([]);
  const [studentInCourse, setStudentInCourse] = useState(null);
  const [open, setOpen] = React.useState(false);

  const [data, setData] = useState({
    courseName_en: "",
    courseName_hi: "",
    semester_en: "",
    semester_hi: "",
    isActive: true,
  });

  const token = localStorage.getItem("token");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setShowForm(false);
    setData({
      courseName_en: "",
      courseName_hi: "",
      semester_en: "",
      semester_hi: "",
      isActive: true,
    });
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getStudentCourse = async () => {
    try {
      const response = await axios.get(`${API_URL}/StudentCourse/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudentCourse(response.data);
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
    getStudentCourse();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/StudentCourse/updateStudent/${item?._id}`,
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

      setStudentCourse((prev) => ({
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
      courseName_en: item?.courseName?.en || "",
      courseName_hi: item?.courseName?.hi || "",
      semester_en: item?.semester?.en || "",
      semester_hi: item?.semester?.hi || "",
      isActive: item?.isActive,
    });
    setIsEdit(true);
    setEditId(item?._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleOpen = () => setOpen(true);

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this  Student Course?",
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
        `${API_URL}/StudentCourse/delete-student-course/${item?._id}`,
        {
          data: {
            isActive: !item.isActive,
            updateby: decoded?._id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      getStudentCourse();

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: "Student Course has been successfully deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the Student Course.",
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
            {hasAddAccess("Student Course") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Student Course
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <StudentCourseForm
            data={data}
            setData={setData}
            handleClose={handleClose}
            getStudentCourse={getStudentCourse}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editId={editId}
          />
        )}
        <Modal
          open={open}
          disableEscapeKeyDown
          onClose={(event, reason) => {
            if (reason === "backdropClick") return;
            handleClose();
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
            <Student
              studentInCourse={studentInCourse}
              setOpen={setOpen}
              open={open}
            />
          </Box>
        </Modal>
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <StudentCourseTable
            data={studentCourse?.data || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            pagination={pagination}
            setPagination={setPagination}
            setStudentInCourse={setStudentInCourse}
            handleOpen={handleOpen}
            hasEditAccess={hasEditAccess}
            hasActiveAccess={hasActiveAccess}
            hasAddAccess={hasAddAccess}
            hasDeleteAccess={hasDeleteAccess}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
}

export default StudentCourse;
