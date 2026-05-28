// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";
// import { useNavigate } from "react-router-dom";

// const CollaborationsDetailsTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   hasDeleteAccess,
//   hasActiveAccess,
//   hasEditAccess
// }) => {
//   const navigate = useNavigate();
//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorFn: (row) => row?.subTitle?.en || "-",
//         header: "sub-Title",
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
//               {/* <label className="form-check-label">
//                 {item?.isActive ? "Active" : "Inactive"}
//               </label> */}
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

// export default CollaborationsDetailsTable;


import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { useNavigate } from "react-router-dom";

const CollaborationsDetailsTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  hasDeleteAccess,
  hasActiveAccess,
  hasEditAccess,
}) => {
  const navigate = useNavigate();

  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row?.subTitle?.en || "-",
        header: "Sub Title",
      },
    ];

    // Status column (permission-based)
    if (hasActiveAccess?.("collaborationsDetails")) {
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

    // Edit column (permission-based)
    if (hasEditAccess?.("collaborationsDetails")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
              <i className="bi bi-pencil fs-4"></i>
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

export default CollaborationsDetailsTable;