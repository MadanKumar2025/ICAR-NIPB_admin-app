import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useNavigate } from "react-router-dom";

const UserTable = ({
  data = [],
  handleToggle,
  handleEdit,
  hasEditAccess,
  hasActiveAccess,
}) => {
  const navigate = useNavigate();

  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "mobileNo",
        header: "Mobile No.",
      },
      {
        accessorKey: "designation",
        header: "Designation",
      },
    ];

    if (hasActiveAccess?.("User")) {
      cols.push({
        accessorKey: "isActive",
        header: "Status",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={Boolean(item?.isActive)}
                onChange={() => handleToggle?.(item)}
              />
              <label className="form-check-label">
                {/* {item?.isActive ? "Active" : "Inactive"} */}
              </label>
            </div>
          );
        },
      });
    }

    if (hasEditAccess?.("User")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span
              // className="badge text-bg-danger"
              // style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
              {/* Edit */}
               <i className="bi bi-pencil fs-4"></i>
            </span>
          );
        },
      });
    }

    cols.push({
      header: "Permission",
      Cell: ({ row }) => {
        const item = row.original;        
        return (
          <button
            className="btn btn-info"
            style={{ marginTop: "10px" }}
            onClick={() => navigate(`/UserPermissions/${item?._id}`)}
          >
            Page Permissions
          </button>
        );
      },
    });

    return cols;
  }, [handleToggle, handleEdit, hasEditAccess, hasActiveAccess, navigate]);

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    initialState: {
      showColumnFilters: true,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default UserTable;
