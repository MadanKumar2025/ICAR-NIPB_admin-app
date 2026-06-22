import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const StaffTable = ({
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
        accessorFn: (row) => row.department?.en || "-",
        header: "Department",
      },
      {
        accessorFn: (row) => row.staffName?.en || "-",
        header: "Staff Name",
      },
      {
        accessorFn: (row) => row.designation?.en || "-",
        header: "Designation",
      },
    ];

    if (
      hasActiveAccess?.("Staff") ||
      hasActiveAccess?.("Technical Staff") ||
      hasActiveAccess?.("Honorary Scientist") ||
      hasActiveAccess?.("Administrative Staff")
    ) {
      cols.push({
        header: "Status",
        size: 40,
        minSize: 30,
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

    if (
      hasEditAccess?.("Staff") ||
      hasEditAccess?.("Technical Staff") ||
      hasEditAccess?.("Honorary Scientist") ||
      hasEditAccess?.("Administrative Staff")
    ) {
      cols.push({
        header: "Action",
        size: 40,
        minSize: 30,
        maxSize: 70,
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

export default StaffTable;
