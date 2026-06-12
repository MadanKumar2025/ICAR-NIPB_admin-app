// import React, { useMemo, useState } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";

// const StaffTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   hasEditAccess,
//   hasActiveAccess
// }) => {
//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorFn: (row) => row.department?.en || "-",
//         header: "Department",
//       },
//       {
//         accessorFn: (row) => row.staffName?.en || "-",
//         header: "Staff Name",
//       },
//       {
//         accessorFn: (row) => row.designation?.en || "-",
//         header: "Designation",
//       },
//       {
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
//               {/* <label className="form-check-label">
//                 {item?.isActive ? "Active" : "Inactive"}
//               </label> */}
//             </div>
//           );
//         },
//       },

//       {
//         header: "Action",
//         Cell: ({ row }) => {
//           const item = row.original;

//           return (
//             <span
//               // className="badge text-bg-danger"
//               // style={{ cursor: "pointer" }}
//               onClick={() => handleEdit?.(item)}
//             >
//               {/* Edit */}
//               <i className="bi bi-pencil fs-4"></i>
//             </span>
//           );
//         },
//       },
//     ],
//     [handleToggle, handleEdit],
//   );

//   const table = useMaterialReactTable({
//     columns,
//     data,
//     state: { pagination },
//     onPaginationChange: setPagination,
//     autoResetPageIndex: false,
//   });

//   return <MaterialReactTable table={table} />;
// };

// export default StaffTable;

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const StaffTable = ({
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
        accessorFn: (row) => row.department?.en || "-",
        header: "Department",
      },
      {
        accessorFn: (row) => row.staffName?.en || "-",
        header: "Staff Name",
      },
      {
        accessorFn: (row) => row.designation?.en || "-",
        header: "Designation",
      },
    ];

    // =========================
    // STATUS COLUMN (ACTIVE ACCESS)
    // =========================
    if (hasActiveAccess?.("Staff")) {
      cols.push({
         header: "Status",
          size: 40,
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

    // =========================
    // ACTION COLUMN (EDIT ACCESS)
    // =========================
    if (hasEditAccess?.("Staff")) {
      cols.push({
        header: "Action",
         size: 40,
        minSize: 30,
        maxSize: 70,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span className="table-icon-edit"
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
  }, [handleToggle, handleEdit, hasEditAccess, hasActiveAccess]);

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    state: { pagination },
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
  });

  return <MaterialReactTable table={table} />;
};

export default StaffTable;
