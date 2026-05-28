// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";
// import { useNavigate } from "react-router-dom";
// const InstitutionalProjectsDetailsTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   handleDelete,
//   pagination,
//   setPagination,
//   hasActiveAccess,
//   hasEditAccess
// }) => {
//   //  Columns
//   const navigate = useNavigate();
//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorFn: (row) => row?.subProjects?.en || "-",
//         header: "Sub Projects",
//       },
//       {
//         accessorFn: (row) => row?.principalInvestigators?.en || "-",
//         header: "Principal Investigators",
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
//       {
//         header: "Delete",
//         Cell: ({ row }) => {
//           const item = row.original;

//           return (
//             <span
//               className="badge text-bg-danger"
//               style={{ cursor: "pointer" }}
//               onClick={() => handleDelete?.(item)}
//             >
//               Delete
//             </span>
//           );
//         },
//       },
//     ],
//     [handleToggle, handleEdit, handleDelete],
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

// export default InstitutionalProjectsDetailsTable;


import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { useNavigate } from "react-router-dom";

const InstitutionalProjectsDetailsTable = ({
  data = [],
  handleToggle,
  handleEdit,
  handleDelete,
  pagination,
  setPagination,
  hasActiveAccess,
  hasEditAccess,
  hasDeleteAccess,
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
        accessorFn: (row) => row?.subProjects?.en || "-",
        header: "Sub Projects",
      },
      {
        accessorFn: (row) => row?.principalInvestigators?.en || "-",
        header: "Principal Investigators",
      },
    ];

    // Status Column (permission-based like UserTable)
    if (hasActiveAccess?.("institutionalProjectsDetails")) {
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
              <label className="form-check-label">
                {item?.isActive ? "Active" : "Inactive"}
              </label>
            </div>
          );
        },
      });
    }

    // Edit Column (permission-based)
    if (hasEditAccess?.("institutionalProjectsDetails")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span
              onClick={() => handleEdit?.(item)}
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-pencil fs-4"></i>
            </span>
          );
        },
      });
    }

    // Delete Column (permission-based)
    if (hasDeleteAccess?.("institutionalProjectsDetails")) {
      cols.push({
        header: "Delete",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span
              className="badge text-bg-danger"
              style={{ cursor: "pointer" }}
              onClick={() => handleDelete?.(item)}
            >
              Delete
            </span>
          );
        },
      });
    }

    return cols;
  }, [
    handleToggle,
    handleEdit,
    handleDelete,
    hasActiveAccess,
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

export default InstitutionalProjectsDetailsTable;