// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";

// const ExternallyFundedProjectsTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   hasActiveAccess,
//   hasEditAccess
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
//         accessorFn: (row) => row?.title?.en || "-",
//         header: "Title",
//       },
//       {
//         accessorFn: (row) => row?.sanctionedBudget?.en || "-",
//         header: "Sanctioned Budget",
//       },
//       {
//         accessorFn: (row) => row?.principalInvestigator?.en || "-",
//         header: "Principal Investigator",
//       },
//       {
//         accessorFn: (row) => row?.fundingAgency?.en || "-",
//         header: "Funding Agency",
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

// export default ExternallyFundedProjectsTable;

import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const ExternallyFundedProjectsTable = ({
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
        accessorFn: (row) => row?.title?.en || "-",
        header: "Title",
      },
      {
        accessorFn: (row) => row?.sanctionedBudget?.en || "-",
        header: "Sanctioned Budget",
      },
      {
        accessorFn: (row) => row?.principalInvestigator?.en || "-",
        header: "Principal Investigator",
      },
      {
        accessorFn: (row) => row?.fundingAgency?.en || "-",
        header: "Funding Agency",
      },
    ];

    // =========================
    // STATUS COLUMN (ACTIVE ACCESS)
    // =========================
    if (hasActiveAccess?.("Externally Funded Projects")) {
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

    // =========================
    // ACTION COLUMN (EDIT ACCESS)
    // =========================
    if (hasEditAccess?.("Externally Funded Projects")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span
              className="badge text-bg-danger"
              style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
              Edit
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

export default ExternallyFundedProjectsTable;