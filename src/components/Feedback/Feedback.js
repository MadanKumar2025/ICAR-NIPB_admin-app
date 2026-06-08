import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import FeedbackTable from "./FeedbackTable";
import { usePermissions } from "../User_Management/UserManagement";

function Feedback() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [feedback, setFeedback] = useState([]);
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const token = localStorage.getItem("token");

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getFeedback = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/FeedbackSchemaRoutes/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFeedback(response.data);
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
    getFeedback();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/FeedbackSchemaRoutes/updateStatus/${item?.id}`,
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

      setFeedback((prev) => ({
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
      <div>
        <div className="card mb-4 custom-panel-table mt-4" style={{ width: "90%", marginLeft: "5%" }}>
          <FeedbackTable
            data={feedback?.data || []}
            handleToggle={handleToggle}
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

export default Feedback;
