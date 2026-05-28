
import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useNavigate } from "react-router-dom";

const CadreStrengthTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
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
        accessorFn: (row) => row?.staff?.en || "-",
        header: "Staff",
      },
      {
        accessorFn: (row) => row?.sanctionedStrength || "-",
        header: "Sanctioned strength",
      },
      {
        accessorFn: (row) => row?.filled || "-",
        header: "Filled",
      },
      {
        accessorFn: (row) => row?.vacant || "-",
        header: "Vacant",
      },
    ];

    //  STATUS COLUMN
    if (hasActiveAccess?.("Cadre Strength")) {
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

    //  EDIT COLUMN
    if (hasEditAccess?.("Cadre Strength")) {
      cols.push({
        header: "Edit",
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

    return cols;
  }, [handleToggle, handleEdit, hasEditAccess, hasActiveAccess, navigate]);

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

export default CadreStrengthTable;
