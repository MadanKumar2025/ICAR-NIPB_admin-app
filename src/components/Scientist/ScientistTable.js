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
        accessorFn: (row) => row?.designationId?.name?.en || "-",
        header: "Designation",
      },
    ];

    // STATUS COLUMN (ACTIVE ACCESS)
    if (hasActiveAccess?.("Scientist") ||hasActiveAccess?.("Faculty") ) {
      cols.push({
        accessorKey: "isActive",
        header: "Status",
          size: 50,
        minSize: 40,
        maxSize: 70,
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

 
    if (hasEditAccess?.("Scientist") || hasEditAccess?.("Faculty")) {
      cols.push({
        header: "Action",
        size: 60,
        minSize: 50,
        maxSize: 80,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span
              className="table-icon-edit"
              style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
              <i className="bi bi-pencil fs-5"></i>
            </span>
          );
        },
      });
    }
    if (hasEditAccess?.("Scientist")) {
      cols.push({
        // header: "Create Scientist Login",
        header: "Login",
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
                {/* <button
                  className="btn btn-info btn-sm nowrap-btn"
                  onClick={() => handleCreateLogin?.(item?._id)}
                >
                  Create Scientist Login
                </button> */}
                <button
                  className="btn btn-info btn-sm nowrap-btn"
                  onClick={() => handleCreateLogin?.(item?._id)}
                >
                  Create Login
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
