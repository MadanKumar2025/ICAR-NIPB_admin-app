 

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
            <a className="view-file-btn"
              href={`${IMG_BASE_URL}/files/${fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", color: "blue" }}
            >  <i class="bi bi-files"></i> <span>View File</span>
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
              className="bi bi-file-earmark-pdf pdf-icon fs-3"
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
        header: "Action", size: 40,
        minSize: 30,
        maxSize: 70,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div style={{ display: "flex", gap: "10px", cursor: "pointer" }}>
              {hasEditAccess?.("Document Uploader") && (
                <span className="table-icon-edit" onClick={() => handleEdit?.(item)}>
                  <i className="bi bi-pencil fs-5"></i>
                </span>
              )}

              {hasDeleteAccess?.("Document Uploader") && (
                <span className="trash-icon"
                  onClick={() => {
                    handleDelete?.(item);
                    handleClose?.();
                  }}
                >
                  <i className="bi bi-trash fs-5"></i>
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
