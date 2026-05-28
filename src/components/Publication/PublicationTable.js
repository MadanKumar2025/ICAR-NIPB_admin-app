import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const PublicationTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  hasEditAccess,
  hasActiveAccess,
  IMG_BASE_URL,
}) => {
  const stripHtmlAndLimit = (html, limit = 5) => {
    if (!html) return "-";

    // HTML tags remove
    const text = html.replace(/<[^>]*>/g, "");

    // words split
    const words = text.split(" ");

    // limit words
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };
  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row?.year || "-",
        header: "Year",
      },
      {
        accessorFn: (row) => row?.category || "-",
        header: "Category",
      },
      {
        accessorFn: (row) => row?.title?.en || "-",
        header: "Title",
        Cell: ({ row }) => {
          return stripHtmlAndLimit(row.original?.title?.en, 5);
        },
      },
      {
        accessorKey: "file",
        header: "File",

        Cell: ({ row }) => {
          const file = row.original?.file;

          if (!file) {
            return <span>-</span>;
          }

          const fileUrl = `${IMG_BASE_URL}/files/${file}`;

          return (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              View File
            </a>
          );
        },
      },
    ];

    // =========================
    // STATUS COLUMN (ACTIVE ACCESS)
    // =========================
    if (hasActiveAccess?.("Publication")) {
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
    if (hasEditAccess?.("Publication")) {
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

    return cols;
  }, [handleToggle, handleEdit, hasActiveAccess, hasEditAccess]);

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

export default PublicationTable;
