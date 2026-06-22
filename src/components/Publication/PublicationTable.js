import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import DOMPurify from "dompurify";

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
        size: 30,
        minSize: 25,
        maxSize: 60,
      },
      {
        accessorFn: (row) => row?.category || "-",
        header: "Category",
      },
      {
        accessorFn: (row) => row?.title?.en || "-",
        header: "Title",
        Cell: ({ row }) => {
          return stripHtmlAndLimit(row.original?.title?.en, 4);
        },
      },
      // {
      //   accessorFn: (row) => row?.title?.en || "-",
      //   header: "Title (HTML Rendered)",
      //   Cell: ({ row }) => {
      //     // Option 2: Render HTML safely
      //     const html = row.original?.title?.en || "-";
      //     return (
      //       <div
      //         dangerouslySetInnerHTML={{
      //           __html: DOMPurify.sanitize(html),
      //         }}
      //       />
      //     );
      //   },
      // },

      {
        accessorKey: "file",
        header: "File",
        size: 25,
        minSize: 20,
        maxSize: 55,
        Cell: ({ row }) => {
          const file = row.original?.file;

          if (!file) {
            return <span>-</span>;
          }

          const fileUrl = `${IMG_BASE_URL}/files/${file}`;

          return (
            <a
              className="view-file-btn"
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="bi bi-files"></i> <span>View File</span>
            </a>
          );
        },
      },
    ];

    if (
      hasActiveAccess?.("Research Publications") ||
      hasActiveAccess?.("Annual Report") ||
      hasActiveAccess?.("Newsletters") ||
      hasActiveAccess?.("Hindi Patrika") ||
      hasActiveAccess?.("Others")
    ) {
      cols.push({
        header: "Status",
        size: 30,
        minSize: 20,
        maxSize: 60,
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
      hasEditAccess?.("Research Publications") ||
      hasEditAccess?.("Annual Report") ||
      hasEditAccess?.("Newsletters") ||
      hasEditAccess?.("Hindi Patrika") ||
      hasEditAccess?.("Others")
    ) {
      cols.push({
        header: "Action",
        size: 30,
        minSize: 20,
        maxSize: 60,
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
