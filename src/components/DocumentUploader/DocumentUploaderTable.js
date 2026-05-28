 

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const DocumentUploaderTable = ({
  data = [],
  handleDelete,
  handleEdit,
  pagination,
  setPagination,
  IMG_BASE_URL,
  handleClose,
  hasEditAccess,
  hasActiveAccess,
  hasDeleteAccess,
}) => {
  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row.title || "-",
        header: "Title",
      },
      {
        accessorFn: (row) => row.documentFile || "-",
        header: "Link",
        Cell: ({ row }) => {
          const fileUrl = row.original?.documentFile;

          return fileUrl ? (
            <a
              href={`${IMG_BASE_URL}/files/${fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", color: "blue" }}
            >
              View File
            </a>
          ) : (
            "-"
          );
        },
      },
      {
        accessorFn: (row) => row?.documentFile || "-",
        header: "Preview",
        Cell: ({ row }) => {
          const fileUrl = row.original?.documentFile;
          const isImage = fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

          return isImage ? (
            <img
              src={`${IMG_BASE_URL}/files/${fileUrl}`}
              alt="Preview"
              style={{
                height: "50px",
                objectFit: "cover",
              }}
            />
          ) : (
            <i
              className="bi bi-file-earmark-pdf"
              style={{ fontSize: 24, color: "red" }}
            ></i>
          );
        },
      },
    ];

    // ACTION COLUMN (EDIT ACCESS)

    if (
      hasEditAccess?.("Document Uploader") ||
      hasDeleteAccess?.("Document Uploader")
    ) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div style={{ display: "flex", gap: "10px", cursor: "pointer" }}>
              {hasEditAccess?.("Document Uploader") && (
                <span onClick={() => handleEdit?.(item)}>
                  <i className="bi bi-pencil fs-4"></i>
                </span>
              )}

              {hasDeleteAccess?.("Document Uploader") && (
                <span
                  onClick={() => {
                    handleDelete?.(item);
                    handleClose?.();
                  }}
                >
                  <i className="bi bi-trash fs-4"></i>
                </span>
              )}
            </div>
          );
        },
      });
    }

    return cols;
  }, [
    handleEdit,
    handleDelete,
    handleClose,
    IMG_BASE_URL,
    hasEditAccess,
    hasDeleteAccess,
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

export default DocumentUploaderTable;
