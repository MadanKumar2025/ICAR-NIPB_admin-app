
// import React, { useMemo } from "react";
// import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

// const HelpTable = ({
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
//         accessorFn: (row) => row?.title?.en || "-",
//         header: "Title",
//       },
//       {
//         accessorFn: (row) => row?.description?.en || "-",
//         header: "Description",
//       },
//     //   {
//     //     accessorFn: (row) => row.designation?.name?.en || "-",
//     //     header: "Designation",
//     //   },
//     ];

//     // =========================
//     // STATUS COLUMN (ACTIVE ACCESS)
//     // =========================
//     if (hasActiveAccess?.("FAQ")) {
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
//     if (hasEditAccess?.("FAQ")) {
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
//   });

//   return <MaterialReactTable table={table} />;
// };

// export default HelpTable;

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const HelpTable = ({
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
        accessorFn: (row) => row?.title?.en || "-",
        header: "Title",
      },
      {
        accessorFn: (row) => row?.description?.en || "-",
        header: "Description",
      },
    ];

    // STATUS + EDIT + DELETE ACTION COLUMN
    if (
      hasActiveAccess?.("FAQ") ||
      hasEditAccess?.("FAQ") ||
      hasDeleteAccess?.("FAQ")
    ) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              {/* STATUS TOGGLE */}
              {hasActiveAccess?.("FAQ") && (
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
              {hasEditAccess?.("FAQ") && (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-6"></i>
                </span>
              )}

              {/* DELETE */}
              {hasDeleteAccess?.("FAQ") && (
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
  });

  return <MaterialReactTable table={table} />;
};

export default HelpTable;