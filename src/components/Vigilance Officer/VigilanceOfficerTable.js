// import React, { useMemo } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";

// const VigilanceOfficerTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   hasEditAccess,
//   hasActiveAccess,
// }) => {
//   const columns = useMemo(() => {
//     const cols = [
//       {
//         header: "#",
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorFn: (row) => row?.type?.en || "-",
//         header: "Type",
//       },
//       {
//         accessorFn: (row) => row?.name?.en || "-",
//         header: "Name",
//       },
//       {
//         accessorFn: (row) => row.designation?.name?.en || "-",
//         header: "Designation",
//       },
//     ];

//     if (
//       hasActiveAccess?.("Vigilance Officer") ||
//       hasEditAccess?.("Vigilance Officer")
//     ) {
//       cols.push({
//         header: "Actions",
//         size: 40,
//         minSize: 30,
//         maxSize: 70,
//         Cell: ({ row }) => {
//           const item = row.original;

//           return (
//             <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//               {/* STATUS TOGGLE */}
//               {hasActiveAccess?.("Vigilance Officer") && (
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
//               {hasEditAccess?.("Vigilance Officer") && (
//                 <span
//                   className="table-icon-edit"
//                   style={{ cursor: "pointer" }}
//                   onClick={() => handleEdit?.(item)}
//                 >
//                   <i className="bi bi-pencil fs-5"></i>
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
//     state: { pagination },
//     onPaginationChange: setPagination,
//     autoResetPageIndex: false,
//     muiTablePaperProps: {
//       className: "panel-inner-table",
//     },
//   });

//   return <MaterialReactTable table={table} />;
// };

// export default VigilanceOfficerTable;

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const VigilanceOfficerTable = ({
  data = [],
  handleToggle,
  handleEdit,
  handleDelete,
  pagination,
  setPagination,
  hasEditAccess,
  hasDeleteAccess,
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
        accessorFn: (row) => row?.type?.en || "-",
        header: "Type",
      },
      {
        accessorFn: (row) => row?.name?.en || "-",
        header: "Name",
      },
      {
        accessorFn: (row) => row?.designation?.name?.en || "-",
        header: "Designation",
      },
    ];

    if (
      hasActiveAccess?.("Vigilance Officer") ||
      hasEditAccess?.("Vigilance Officer") ||
      hasDeleteAccess?.("Vigilance Officer")
    ) {
      cols.push({
        header: "Actions",
        size: 70,
        minSize: 50,
        maxSize: 100,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              {/* STATUS TOGGLE */}
              {hasActiveAccess?.("Vigilance Officer") && (
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
              {hasEditAccess?.("Vigilance Officer") && (
                <span
                  className="table-icon-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-6"></i>
                </span>
              )}

              {/* DELETE */}
              {hasDeleteAccess?.("Vigilance Officer") && (
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
    muiTablePaperProps: {
      className: "panel-inner-table",
    },
  });

  return <MaterialReactTable table={table} />;
};

export default VigilanceOfficerTable;