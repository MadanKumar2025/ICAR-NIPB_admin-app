import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const NewsTable = ({
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
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorFn: (row) => row.title?.en || "-",
        header: "Title",
      },
      {
        accessorKey: "link",
        header: "Link",
        size: 50,
        minSize: 40,
        maxSize: 80,
        Cell: ({ row }) => {
          const link = row.original.link;

          return link ? (
            <a 
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="fs-6 links-title"
            >
              <i class="bi bi-link-45deg fs-5"></i> Link
            </a>
          ) : (
            "-"
          );
        },
      },
      // {
      //   header: "Publish Date",
      //   accessorFn: (row) =>
      //     row.publishDate
      //       ? new Date(row.publishDate).toLocaleDateString("en-GB")
      //       : "-",
      // },
      // {
      //   header: "Expiry Date",
      //   accessorFn: (row) =>
      //     row.expiryDate
      //       ? new Date(row.expiryDate).toLocaleDateString("en-GB")
      //       : "-",
      // },
      // {
      //   accessorKey: "markAsNew",
      //   header: "Mark As New",
        
      //   Cell: ({ row }) => {
      //     return row.original.markAsNew ? "✅" : "❌";
      //   },
      // },
    ];

    // =========================
    // STATUS COLUMN (ACTIVE ACCESS)
    // =========================
    if (hasActiveAccess?.("News")) {
      cols.push({
        accessorKey: "isActive",
        header: "Status",
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
    if (hasEditAccess?.("News")) {
      cols.push({
        header: "Action",
        size: 50,
        minSize: 40,
        maxSize: 80,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="table-text-edit" style={{ cursor: "pointer" }}
                onClick={() => handleEdit?.(item)}
              >
                <i class="bi bi-pencil fs-6"></i>
               <span> Edit
              </span>
            </div>
          );
        },
      });
    }

    return cols;
  }, [handleEdit, handleToggle, hasEditAccess, hasActiveAccess]);

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

export default NewsTable;