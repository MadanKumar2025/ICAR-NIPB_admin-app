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
        header: "Category",
      },
      {
        accessorFn: (row) => row?.sanctionedStrength || "0",
        header: "Sanctioned strength",
         size: 40,
        minSize: 30,
        maxSize: 70,
      },
      {
        accessorFn: (row) => row?.filled || "0",
        header: "Filled", size: 40,
        minSize: 30,
        maxSize: 70,
      },
      {
        accessorFn: (row) => row?.vacant || "0",
        header: "Vacant", size: 40,
        minSize: 30,
        maxSize: 70,
      },
    ];

    //  STATUS COLUMN
    if (hasActiveAccess?.("Cadre Strength")) {
      cols.push({
         header: "Status", size: 40,
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

    //  EDIT COLUMN
    if (hasEditAccess?.("Cadre Strength")) {
      cols.push({
        header: "Edit", size: 40,
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
