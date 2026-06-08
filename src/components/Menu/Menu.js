import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import MenuTable from "./MenuTable";
import MenuForm from "./MenuForm";
import { usePermissions } from "../User_Management/UserManagement";

function Menu() {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const [isPage, setIsPage] = useState("");
  const [menu, setMenu] = useState([]);
  const [pages, setPages] = useState([]);
  const [error, setError] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    menuType: "",
    menuCategory: "",
    parentMenuId: "",
    menuName_en: "",
    menuName_hi: "",
    pageId: "",
    customUrl: "",
    order: "",
    isActive: true,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getmenu = async () => {
    try {
      const response = await axios.get(`${API_URL}/menu/getmenu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMenu(response.data);
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

  const getpages = async () => {
    try {
      const response = await axios.get(`${API_URL}/pages/allPage?all=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPages(response.data);
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
    getmenu();
    getpages();
  }, []);

  const handleToggle = async (item) => {
    try {
      const decoded = jwtDecode(token);

      const res = await axios.put(
        `${API_URL}/menu/status/${item?.id}`,
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

      setMenu((prev) => ({
        ...prev,
        data: prev.data.map((row) =>
          row?.id === item?.id ? { ...row, isActive: !row?.isActive } : row,
        ),
      }));
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleEdit = (item) => {
    const isPageValue = item?.page ? "yes" : "no";

    setData({
      menuType: item?.menuType || "",
      menuCategory: item?.menuCategory || "",
      parentMenuId: item?.parentMenu?.id || "",
      menuName_en: item?.menuName_en || "",
      menuName_hi: item?.menuName_hi || "",
      pageId: item?.page?.id || "",
      customUrl: item?.customUrl || "",
      order: item?.order || 0,
      isActive: item?.isActive ?? true,
    });

    setIsPage(isPageValue);
    setIsEdit(true);
    setEditId(item?.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleClose = () => {
    setShowForm(false);
    setData({
      menuType: "",
      menuCategory: "",
      parentMenuId: "",
      menuName_en: "",
      menuName_hi: "",
      pageId: "",
      customUrl: "",
      order: "",
      isActive: true,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      let updated = { ...prev };

      updated[name] = value;
      
      // if (name === "menuCategory" && value === "footer") {
      //   updated.menuType = "parent";
      // }

      if (name === "menuCategory") {
        // updated.menuType = "parent";
        updated.parentMenuId = "";
      }

      if (name === "menuType") {
        if (value === "parent") {
          updated.parentMenuId = "";
        }
      }

      if (name === "isPage") {
        setIsPage(value);

        if (value === "yes") {
          updated.customUrl = "";
        }

        if (value === "no") {
          updated.pageId = "";
        }
      }

      return updated;
    });

    if (name === "customUrl") {
      if (value && !isValidUrl(value)) {
        setError((prev) => ({
          ...prev,
          customUrl: "Invalid URL (https://example.com)",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          customUrl: "",
        }));
      }
    }
  };

  const isValidUrl = (url) => {
    const pattern = /^(https?:\/\/)(([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,})(\/.*)?$/;
    return pattern.test(url);
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
            {hasAddAccess("Menu") && (
              <button
                className="btn btn-info"
                onClick={() => setShowForm(true)}
              >
                Create Menu
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <MenuForm
            data={data}
            isEdit={isEdit}
            editId={editId}
            setIsEdit={setIsEdit}
            setData={setData}
            setIsPage={setIsPage}
            getmenu={getmenu}
            setError={setError}
            menu={menu}
            isPage={isPage}
            pages={pages}
            error={error}
            handleClose={handleClose}
            handleChange={handleChange}
          />
        )}
        <div className="card mb-4 custom-panel-table mt-3" style={{ width: "90%", marginLeft: "5%" }}>
          <MenuTable
            data={menu?.data || []}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            pagination={pagination}
            setPagination={setPagination}
            hasActiveAccess={hasActiveAccess}
             hasEditAccess={ hasEditAccess}
          />
        </div>
      </div>
    </>
  );
}

export default Menu;
