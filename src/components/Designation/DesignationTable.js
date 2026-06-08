// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";

// const DesignationTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   hasActiveAccess,
//   hasEditAccess
// }) => {
//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorFn: (row) => row?.name?.en || "-",
//         header: "Name",
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
//                 onChange={() => handleToggle && handleToggle(item)}
//               />
//               <label className="form-check-label">
//                 {item?.isActive ? "Active" : "Inactive"}
//               </label>
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
//               className="badge text-bg-danger"
//               style={{ cursor: "pointer" }}
//               onClick={() => handleEdit?.(item)}
//             >
//               Edit
//             </span>
//           );
//         },
//       },
//     ],
//     [handleToggle, handleEdit],
//   );

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

// export default DesignationTable;

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const DesignationTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  hasActiveAccess,
  hasEditAccess,
}) => {
  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row?.name?.en || "-",
        header: "Name",
      },
    ];

    // STATUS COLUMN (ACTIVE ACCESS)

    if (hasActiveAccess?.("Designation")) {
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
              {/* <label className="form-check-label">
                {item?.isActive ? "Active" : "Inactive"}
              </label> */}
            </div>
          );
        },
      });
    }

    // ACTION COLUMN (EDIT ACCESS)

    if (hasEditAccess?.("Designation")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span
              className="table-icon-edit"
              // style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
              {/* Edit */}
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

export default DesignationTable;
