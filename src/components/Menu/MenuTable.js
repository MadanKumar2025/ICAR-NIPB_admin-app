// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";

// const MenuTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   hasEditAccess,
//   hasActiveAccess,
// }) => {
//   //  Columns
//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorKey: "menuCategory",
//         header: "Menu Category",
//       },
//       {
//         accessorKey: "menuType",
//         header: "Menu Type",
//       },
//       {
//         accessorFn: (row) => row.menuName_en || "-",
//         header: "Menu Name",
//       },

//       {
//         accessorKey: "order",
//         header: "Order",
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

//       // Action Column
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

//   //  Table Instance
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

// export default MenuTable;

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const MenuTable = ({
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
        accessorKey: "menuCategory",
        header: "Menu Category",
      },
      {
        accessorKey: "menuType",
        header: "Menu Type",
      },
      {
        accessorFn: (row) => row.menuName_en || "-",
        header: "Menu Name",
      },
      {
        accessorKey: "order",
        header: "Order",
      },
    ];

    if (hasActiveAccess?.("Menu")) {
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
            </div>
          );
        },
      });
    }

    if (hasEditAccess?.("Menu")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span onClick={() => handleEdit?.(item)}>
              <i className="bi bi-pencil fs-4"></i>
            </span>
          );
        },
      });
    }

    return cols;
  }, [handleToggle, handleEdit, hasEditAccess, hasActiveAccess]);

  // =========================
  // TABLE INSTANCE
  // =========================
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

export default MenuTable;
