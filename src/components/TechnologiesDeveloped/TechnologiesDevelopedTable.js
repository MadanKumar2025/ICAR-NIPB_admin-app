 

import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const TechnologiesDevelopedTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  hasEditAccess,
  hasActiveAccess,
}) => {

  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row?.nameOfOtherParty?.en || "-",
        header: "Name of other party",
      },
      {
        accessorFn: (row) => row?.collaboratingInstituteICAR?.en || "-",
        header: "Collaborating Institute (ICAR)",
      },
      {
        accessorFn: (row) => row?.nameOfTechnology?.en || "-",
        header: "Name of Technology",
      },
      {
        accessorFn: (row) => row?.duration || "-",
        header: "Duration",
      },
    ];

    // =========================
    // STATUS COLUMN (ACTIVE ACCESS)
    // =========================
    if (hasActiveAccess?.("Technologies Developed")) {
      cols.push({
         header: "Status", size: 40,
        minSize: 30,
        maxSize: 70,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="form-check form-switch table-lable-switch d-flex align-items-center">
              <input
                className="form-check-input"
                type="checkbox"
                checked={Boolean(item?.isActive)}
                onChange={() => handleToggle?.(item)}
              />
              {/* <label className="form-check-label">
                {item?.isActive ? "Active" : "Inactive"}
              </label> */}
              <label
                className={`form-check-label ${item?.isActive ? "status-active" : "status-inactive"
                  }`}
              >
                {item?.isActive ? "Active" : "Inactive"}
              </label>
            </div>
          );
        },
      });
    }

    // =========================
    // ACTION COLUMN (EDIT ACCESS)
    // =========================
    if (hasEditAccess?.("Technologies Developed")) {
      cols.push({
        header: "Action", size: 40,
        minSize: 30,
        maxSize: 70,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div
              className="table-text-edit"
              style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
            <i class="bi bi-pencil fs-6"></i>
              <span>Edit</span>
            </div>
          );
        },
      });
    }

    return cols;
  }, [
    handleToggle,
    handleEdit,
    hasActiveAccess,
    hasEditAccess,
  ]);

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    initialState: {
      showColumnFilters: true,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default TechnologiesDevelopedTable;