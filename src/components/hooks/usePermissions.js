import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL;

export const usePermissions = () => {
  const [userId, setUserId] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
 

  // decode token
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded?.id || decoded?._id);
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  }, [token]);

  // fetch permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/UserPermissionsRoutes/getAllDatat`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setPermissions(res?.data?.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPermissions();
  }, [token]);

  // current user permission
  const userPermission = useMemo(() => {
    return permissions.find((p) => p?.userId?._id === userId);
  }, [permissions, userId]);

  const getBasePath = (url) => {
    return "/" + url.split("/")[1]?.toLowerCase();
  };

  const hasAccessByUrl = (url) => {
    const currentBase = getBasePath(url);

    return userPermission?.menuPermissions?.some((item) => {
      const menuBase = getBasePath(item?.menuId?.url || "");
      return currentBase === menuBase && item?.pageAccess === true;
    });
  };

  return {
    userPermission,
    hasAccessByUrl,
    loading,
  };
};
