import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL;

export const usePermissions = () => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  
  const token = localStorage.getItem("token");

  // Decode token
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded?.id);
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  }, [token]);

  // Fetch permissions
  useEffect(() => {
    const getPermissions = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/UserPermissionsRoutes/getAllDatat`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPermissions(response?.data?.data || []);
      } catch (error) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        if (
          message === "Invalid token" ||
          status === 401 ||
          message === "Your account is deactivated. Please contact admin."
        ) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    };

    if (token) getPermissions();
  }, [token]);

  // Find user permissions
  const userPermissions = useMemo(() => {
    return permissions.find((item) => item?.userId?._id === user);
  }, [permissions, user]);

  // Permission functions
  const hasAddAccess = (menuName) =>
    userPermissions?.menuPermissions?.some(
      (item) =>
        item?.menuId?.menuName === menuName && item?.addAccess === true
    );

  const hasEditAccess = (menuName) =>
    userPermissions?.menuPermissions?.some(
      (item) =>
        item?.menuId?.menuName === menuName && item?.editAccess === true
    );

  const hasDeleteAccess = (menuName) =>
    userPermissions?.menuPermissions?.some(
      (item) =>
        item?.menuId?.menuName === menuName && item?.deleteAccess === true
    );

  const hasActiveAccess = (menuName) =>
    userPermissions?.menuPermissions?.some(
      (item) =>
        item?.menuId?.menuName === menuName && item?.activeAccess === true
    );

  return {
    hasAddAccess,
    hasEditAccess,
    hasDeleteAccess,
    hasActiveAccess,
  };
};