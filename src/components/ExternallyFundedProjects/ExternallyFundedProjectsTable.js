// import React, { useMemo } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";

// const ExternallyFundedProjectsTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   hasActiveAccess,
//   hasEditAccess,
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
//         accessorFn: (row) => row?.sanctionedBudget?.en || "-",
//         header: "Budget",
//       },
//       {
//         accessorFn: (row) => row?.principalInvestigator?.en || "-",
//         header: "Investigator",
//         size: 30,
//         minSize: 25,
//         maxSize: 60,
//       },
//       {
//         accessorFn: (row) => row?.fundingAgency?.en || "-",
//         header: "Funding Agency",
//         size: 30,
//         minSize: 25,
//         maxSize: 60,
//       },
//     ];

//     if (
//       hasActiveAccess?.("Externally Funded Projects") ||
//       hasEditAccess?.("Externally Funded Projects")
//     ) {
//       cols.push({
//         header: "Actions",
//         size: 30,
//         minSize: 25,
//         maxSize: 60,
//         Cell: ({ row }) => {
//           const item = row.original;

//           return (
//             <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//               {/* STATUS TOGGLE */}
//               {hasActiveAccess?.("Externally Funded Projects") && (
//                 <div className="form-check form-switch table-lable-switch d-flex align-items-center m-0">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     checked={Boolean(item?.isActive)}
//                     onChange={() => handleToggle?.(item)}
//                   />

//                   <label
//                     className={`form-check-label ${
//                       item?.isActive ? "status-active" : "status-inactive"
//                     }`}
//                   />
//                 </div>
//               )}

//               {/* EDIT ACTION */}
//               {hasEditAccess?.("Externally Funded Projects") && (
//                 <div
//                   className="table-text-edit"
//                   style={{ cursor: "pointer", fontSize: "16px" }}
//                   onClick={() => handleEdit?.(item)}
//                 >
//                   <i className="bi bi-pencil fs-6"></i>
//                   <span>Edit</span>
//                 </div>
//               )}
//             </div>
//           );
//         },
//       });
//     }
//     return cols;
//   }, [handleToggle, handleEdit, hasActiveAccess, hasEditAccess]);

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
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const ExternallyFundedProjectsTable = ({
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
        header: "Budget",
      },
      {
        accessorFn: (row) => row?.principalInvestigator?.en || "-",
        header: "Investigator",
        size: 30,
        minSize: 25,
        maxSize: 60,
      },
      {
        accessorFn: (row) => row?.fundingAgency?.en || "-",
        header: "Funding Agency",
        size: 30,
        minSize: 25,
        maxSize: 60,
      },
    ];

    if (
      hasActiveAccess?.("Externally Funded Projects") ||
      hasEditAccess?.("Externally Funded Projects") ||
      hasDeleteAccess?.("Externally Funded Projects")
    ) {
      cols.push({
        header: "Action",
        size: 60,
        minSize: 50,
        maxSize: 100,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              {/* Status Toggle */}
              {hasActiveAccess?.("Externally Funded Projects") && (
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

              {/* Edit */}
              {hasEditAccess?.("Externally Funded Projects") && (
                <div
                  className="table-text-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-6"></i>
                </div>
              )}

              {/* Delete */}
              {hasDeleteAccess?.("Externally Funded Projects") && (
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

export default ExternallyFundedProjectsTable;