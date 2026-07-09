// import React, { useMemo } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";

// const AssociatedOrganizationTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   hasEditAccess,
//   hasActiveAccess,
//   IMG_BASE_URL,
// }) => {
//   const columns = useMemo(() => {
//     const cols = [
//       {
//         header: "#",
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorFn: (row) => row?.relatedLink || "-",
//         header: "Related Link",
//         Cell: ({ row }) => {
//           const link = row.original?.relatedLink;

//           if (!link) return "-";

//           return (
//             <a
//               className="urls-links-title"
//               href={link}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 textDecoration: "none",
//                 color: "#0d6efd",
//               }}
//             >
//               <i className="bi bi-link-45deg fs-5"></i>
//               Visit Link
//             </a>
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row?.photo || "-",
//         header: "Preview",
//         Cell: ({ row }) => {
//           const fileUrl = row.original?.photo;

//           const isImage = fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

//           return isImage ? (
//             <img
//               src={`${IMG_BASE_URL}/${fileUrl}`}
//               alt="Preview"
//               className="associated-organization-logo"
//               style={{
//                 height: "50px",
//                 width: "50px",
//                 objectFit: "cover",
//                 borderRadius: "6px",
//               }}
//             />
//           ) : (
//             <i
//               className="bi bi-file-earmark-pdf"
//               style={{ fontSize: 24, color: "red" }}
//             ></i>
//           );
//         },
//       },
//     ];

//     if (hasActiveAccess?.("Associated Organization")) {
//       cols.push({
//         accessorKey: "isActive",
//         header: "Status",
//         Cell: ({ row }) => {
//           const item = row.original;

//           return (
//             <div className="form-check form-switch">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={Boolean(item?.isActive)}
//                 onChange={() => handleToggle?.(item)}
//               />
//             </div>
//           );
//         },
//       });
//     }

//     // =========================
//     // ACTION COLUMN (EDIT ACCESS)
//     // =========================
//     if (hasEditAccess?.("Associated Organization")) {
//       cols.push({
//         header: "Action",
//         Cell: ({ row }) => {
//           const item = row.original;

//           return (
//             <span
//               style={{ cursor: "pointer" }}
//               onClick={() => handleEdit?.(item)}
//             >
//               <i className="bi bi-pencil fs-4"></i>
//             </span>
//           );
//         },
//       });
//     }

//     return cols;
//   }, [handleToggle, handleEdit, hasEditAccess, hasActiveAccess]);

//   const table = useMaterialReactTable({
//     columns,
//     data: data || [],
//     state: { pagination },
//     onPaginationChange: setPagination,
//     autoResetPageIndex: false,
//     muiTablePaperProps: {
//       className: "panel-inner-table",
//     },
//   });

//   return <MaterialReactTable table={table} />;
// };

// export default AssociatedOrganizationTable;

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const AssociatedOrganizationTable = ({
  data = [],
  handleToggle,
  handleEdit,
  handleDelete,
  pagination,
  setPagination,
  hasEditAccess,
  hasDeleteAccess,
  hasActiveAccess,
  IMG_BASE_URL,
}) => {
  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row?.relatedLink || "-",
        header: "Related Link",
        Cell: ({ row }) => {
          const link = row.original?.relatedLink;

          if (!link) return "-";

          return (
            <a
              className="urls-links-title"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
                color: "#0d6efd",
              }}
            >
              <i className="bi bi-link-45deg fs-5"></i>
              Visit Link
            </a>
          );
        },
      },
      {
        accessorFn: (row) => row?.photo || "-",
        header: "Preview",
        Cell: ({ row }) => {
          const fileUrl = row.original?.photo;

          const isImage = fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

          return isImage ? (
            <img
              src={`${IMG_BASE_URL}/${fileUrl}`}
              alt="Preview"
              className="associated-organization-logo"
              style={{
                height: "50px",
                width: "50px",
                objectFit: "cover",
                borderRadius: "6px",
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

    // STATUS + EDIT + DELETE ACTION COLUMN
    if (
      hasActiveAccess?.("Associated Organization") ||
      hasEditAccess?.("Associated Organization") ||
      hasDeleteAccess?.("Associated Organization")
    ) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              {/* STATUS TOGGLE */}
              {hasActiveAccess?.("Associated Organization") && (
                <div className="form-check form-switch table-lable-switch d-flex align-items-center m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={Boolean(item?.isActive)}
                    onChange={() => handleToggle?.(item)}
                  />

                  <label
                    className={`form-check-label ${
                      item?.isActive ? "status-active" : "status-inactive"
                    }`}
                  />
                </div>
              )}

              {/* EDIT */}
              {hasEditAccess?.("Associated Organization") && (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-6"></i>
                </span>
              )}

              {/* DELETE */}
              {hasDeleteAccess?.("Associated Organization") && (
                <span
                  className="trash-icon"
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => handleDelete?.(item)}
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
    handleToggle,
    handleEdit,
    handleDelete,
    hasEditAccess,
    hasDeleteAccess,
    hasActiveAccess,
    IMG_BASE_URL,
  ]);

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    muiTablePaperProps: {
      className: "panel-inner-table",
    },
  });

  return <MaterialReactTable table={table} />;
};

export default AssociatedOrganizationTable;