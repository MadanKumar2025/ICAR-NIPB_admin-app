import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import EventTable from "./EventTable";
import { jwtDecode } from "jwt-decode";
import JoditEditor from "jodit-react";
import EventForm from "./EventForm";
import { usePermissions } from "../User_Management/UserManagement";

function Event() {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [allEvent, setAllEvent] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState({
    eventBannerPhoto: null,
    eventPhoto: null,
  });
  const [data, setData] = useState({
    name: { en: "", hi: "" },
    eventBannerPhoto: null,
    eventPhoto: null,
    startTime: "",
    endTime: "",
    location: { en: "", hi: "" },
    description: { en: "", hi: "" },
    registrationLink: "",
    registrationStartTime: "",
    registrationEndTime: "",
    isActive: true,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const formRef = useRef();
  const editor = useRef(null);
  const token = localStorage.getItem("token");

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  };

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (type === "file" && files.length > 0) {
      const file = files[0];

      setData((prev) => ({
        ...prev,
        [name]: file,
      }));

      setPreview((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
    } else if (name.endsWith("_en")) {
      const key = name.replace("_en", "");
      setData((prev) => ({
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          en: value,
        },
      }));
    } else if (name.endsWith("_hi")) {
      const key = name.replace("_hi", "");
      setData((prev) => ({
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          hi: value,
        },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const getEventData = async () => {
    try {
      const response = await axios.get(`${API_URL}/event/allEvent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllEvent(response?.data?.data);
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
    getEventData();
  });

  const handleEdit = (item) => {
    setData({
      name: {
        en: item?.name?.en || "",
        hi: item?.name?.hi || "",
      },
      location: {
        en: item?.location?.en || "",
        hi: item?.location?.hi || "",
      },
      description: {
        en: item?.description?.en || "",
        hi: item?.description?.hi || "",
      },
      eventBannerPhoto: item?.eventBannerPhoto || null,
      eventPhoto: item?.eventPhoto || null,
      startTime: item?.startTime ? formatDateTimeLocal(item.startTime) : "",
      endTime: item?.endTime ? formatDateTimeLocal(item.endTime) : "",
      registrationLink: item?.registrationLink || "",
      registrationStartTime: item?.registrationStartTime
        ? formatDateTimeLocal(item.registrationStartTime)
        : "",
      registrationendTime: item?.registrationEndTime
        ? formatDateTimeLocal(item.registrationEndTime)
        : "",
      isActive: item?.isActive ?? true,
    });

    // Set image previews
    setPreview({
      eventBannerPhoto: item?.eventBannerPhoto
        ? `${IMG_BASE_URL}/${item.eventBannerPhoto}`
        : null,
      eventPhoto: item?.eventPhoto
        ? `${IMG_BASE_URL}/${item.eventPhoto}`
        : null,
    });

    // Set edit ID
    setEditId(item?.id);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.patch(
        `${API_URL}/event/updateEventStatus/${item?.id}`,
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

      // getEventData();
      setAllEvent((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, isActive: !row.isActive } : row,
        ),
      );
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setData({
      type: "",
      title_en: "",
      title_hi: "",
      link: "",
      documentFile: "",
      publishDate: "",
      expiryDate: "",
      markAsNew: "",
      isActive: true,
    });
    setPreview(null);
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
            {hasAddAccess("Event") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Event
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <EventForm
            isEdit={isEdit}
            data={data}
            editId={editId}
            setData={setData}
            setPreview={setPreview}
            getEventData={getEventData}
            handleChange={handleChange}
            preview={preview}
            handleClose={handleClose}
          />
        )}

        <div className="card mb-4 custom-panel-table mt-3" style={{ width: "90%", marginLeft: "5%" }}>
          <EventTable
            data={allEvent || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
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

export default Event;
