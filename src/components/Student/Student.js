import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import StudentTable from "./StudentTable";

function Student({ setOpen, open, studentInCourse }) {
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [student, setStudent] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [data, setData] = useState({
    studentName_en: "",
    studentName_hi: "",
    rollNo: "",
    guideName_en: "",
    guideName_hi: "",
    isActive: true,
  });

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const formRef = useRef();

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, type, value, files, checked } = e.target;

    setData((prev) => ({
      ...prev,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (item) => {
    console.log("item", item);

    setData({
      studentName_en: item?.studentName?.en || "",
      studentName_hi: item?.studentName?.hi || "",
      rollNo: item?.rollNo || "",
      guideName_en: item?.guideName?.hi || "",
      guideName_hi: item?.guideName?.hi || "",
      isActive: item?.isActive,
    });
    setIsEdit(true);
    setEditId(item?._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      try {
        const payload = {
          studentName_en: data?.studentName_en,
          studentName_hi: data?.studentName_hi || null,
          rollNo: data?.rollNo || "",
          guideName_en: data?.guideName_en || "",
          guideName_hi: data?.guideName_hi || "",
          studentCourseId: studentInCourse || null,
          isActive: data?.isActive,
        };
        const res = await axios.put(
          `${API_URL}/Student/update/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setIsEdit(false);
        setData({
          studentName_en: "",
          studentName_hi: "",
          rollNo: "",
          guideName_en: "",
          guideName_hi: "",
          isActive: true,
        });
        await getStudent();
      } catch (error) {
        alert(error?.response?.data?.message);
      }
    } else {
      try {
        const payload = {
          studentName_en: data?.studentName_en,
          studentName_hi: data?.studentName_hi || null,
          rollNo: data?.rollNo || "",
          guideName_en: data?.guideName_en || "",
          guideName_hi: data?.guideName_hi || "",
          studentCourseId: studentInCourse || null,
          isActive: data?.isActive,
        };
        const response = await axios.post(
          `${API_URL}/Student/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setData({
          studentName_en: "",
          studentName_hi: "",
          rollNo: "",
          guideName_en: "",
          guideName_hi: "",
          isActive: true,
        });

        await getStudent();
      } catch (error) {
        alert(error?.response?.data?.message);
      }
    }
  };

  const getStudent = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/Student/get/${studentInCourse}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setStudent(response.data);
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
    if (open) {
      getStudent();
    }
  }, [open]);



    const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/Student/updateStatus/${item?._id}`,
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

      setStudent((prev) => ({
        ...prev,
        data: prev.data.map((row) =>
          row?._id === item?._id ? { ...row, isActive: !row?.isActive } : row,
        ),
      }));
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  return (
    <>
      <div className="card card-info card-outline mb-4">
        <div className="card-header w-100 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 w-50">Add Student</h5>
          <div className="w-50 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleClose}
            >
              ✖
            </button>
          </div>
        </div>

        <form className="needs-validation" onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="validationCustom03" className="form-label">
                  Student Name (English)
                </label>
                <input
                  type="text"
                  name="studentName_en"
                  value={data?.studentName_en}
                  onChange={handleChange}
                  className="form-control"
                  id="galleryTitle_en"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="validationCustom03" className="form-label">
                  Student Name (Hindi)
                </label>
                <input
                  type="text"
                  name="studentName_hi"
                  value={data?.studentName_hi}
                  onChange={handleChange}
                  className="form-control"
                  id="galleryTitle_hi"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="validationCustom03" className="form-label">
                  Guide Name (English)
                </label>
                <input
                  type="text"
                  name="guideName_en"
                  value={data?.guideName_en}
                  onChange={handleChange}
                  className="form-control"
                  id="galleryTitle_hi"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="validationCustom03" className="form-label">
                  Guide Name (Hindi)
                </label>
                <input
                  type="text"
                  name="guideName_hi"
                  value={data?.guideName_hi}
                  onChange={handleChange}
                  className="form-control"
                  id="galleryTitle_hi"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="validationCustom03" className="form-label">
                  Roll No.
                </label>
                <input
                  type="text"
                  name="rollNo"
                  value={data?.rollNo}
                  onChange={handleChange}
                  className="form-control"
                  id="galleryTitle_hi"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Is Active</label>
                <select
                  name="isActive"
                  value={data?.isActive}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <button className="btn btn-info" type="submit">
              Save Student
            </button>
          </div>
        </form>
        <div className="card mb-4" style={{ width: "90%", marginLeft: "5%" }}>
          <StudentTable
            data={student?.data || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            pagination={pagination}
            setPagination={setPagination}
          />
        </div>
      </div>
    </>
  );
}

export default Student;
