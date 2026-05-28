import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const ScientistTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  hasEditAccess,
  hasActiveAccess,
  hasAddAccess,
  handleCreateLogin,
}) => {
  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row.scientistName?.en || "-",
        header: "Scientist Name",
      },
      {
        accessorFn: (row) => row.phone1 || "-",
        header: "Phone",
      },
      {
        accessorFn: (row) => row.email1 || "-",
        header: "Email",
      },
      // {
      //   accessorFn: (row) => row.education?.en || "-",
      //   header: "Education",
      // },
      // {
      //   accessorFn: (row) => row.majorCourses?.en || "-",
      //   header: "Major Courses",
      // },
      {
        accessorFn: (row) => row?.designationId?.name?.en || "-",
        header: "Designation",
      },
    ];

    // STATUS COLUMN (ACTIVE ACCESS)
    if (hasActiveAccess?.("Scientist")) {
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
            </div>
          );
        },
      });
    }

    // =========================
    // ACTION COLUMN (EDIT ACCESS)
    // =========================
    if (hasEditAccess?.("Scientist")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
              <i className="bi bi-pencil fs-4"></i>
            </span>
          );
        },
      });
    }
    if (hasEditAccess?.("Scientist")) {
      cols.push({
        header: "Create Scientist Login",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* CREATE SCIENTIST LOGIN BUTTON */}
              <div
                className="card-footer"
                style={{
                  marginTop: "2vh",
                  marginBottom: "2vh",
                  marginRight: "4vw",
                  padding: 0,
                  border: "none",
                  background: "transparent",
                }}
              >
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleCreateLogin?.(item?._id)}
                >
                  Create Scientist Login
                </button>
              </div>
            </div>
          );
        },
      });
    }
    return cols;
  }, [handleToggle, handleEdit, hasEditAccess, hasActiveAccess]);

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    state: { pagination },
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
  });

  return <MaterialReactTable table={table} />;
};

export default ScientistTable;
