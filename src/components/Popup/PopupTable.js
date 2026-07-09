// import React, { useMemo } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";

// const PopupTable = ({
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
//         accessorFn: (row) => row?.title || "-",
//         header: "Title",
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

//     if (hasActiveAccess?.("Popup") || hasEditAccess?.("Popup")) {
//       cols.push({
//         header: "Actions",
//         Cell: ({ row }) => {
//           const item = row.original;

//           return (
//             <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//               {/* STATUS TOGGLE */}
//               {hasActiveAccess?.("Popup") && (
//                 <div className="form-check form-switch m-0">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     checked={Boolean(item?.isActive)}
//                     onChange={() => handleToggle?.(item)}
//                   />
//                 </div>
//               )}

//               {/* EDIT ICON */}
//               {hasEditAccess?.("Popup") && (
//                 <span
//                   style={{ cursor: "pointer" }}
//                   onClick={() => handleEdit?.(item)}
//                 >
//                   <i className="bi bi-pencil fs-4"></i>
//                 </span>
//               )}
//             </div>
//           );
//         },
//       });
//     }
//     return cols;
//   }, [handleToggle, handleEdit, hasEditAccess, hasActiveAccess]);

//   const table = useMaterialReactTable({
//     columns,
//     data: data || [],
//     state: {
//       pagination,
//     },
//     onPaginationChange: setPagination,
//     autoResetPageIndex: false,
//     initialState: {
//       showColumnFilters: true,
//     },
//   });

//   return <MaterialReactTable table={table} />;
// };

// export default PopupTable;


import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const PopupTable = ({
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
        accessorFn: (row) => row?.title || "-",
        header: "Title",
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

    if (
      hasActiveAccess?.("Popup") ||
      hasEditAccess?.("Popup") ||
      hasDeleteAccess?.("Popup")
    ) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              {/* STATUS TOGGLE */}
              {hasActiveAccess?.("Popup") && (
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

              {/* EDIT ICON */}
              {hasEditAccess?.("Popup") && (
                <span
                  className="table-text-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-6"></i>
                </span>
              )}

              {/* DELETE ICON */}
              {hasDeleteAccess?.("Popup") && (
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

export default PopupTable;