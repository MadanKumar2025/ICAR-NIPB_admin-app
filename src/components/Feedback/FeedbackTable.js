// import React, { useMemo } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";
// import { useNavigate } from "react-router-dom";

// const FeedbackTable = ({
//   data = [],
//   handleToggle,
//   pagination,
//   setPagination,
//   hasActiveAccess,
//   hasEditAccess,
// }) => {
//   const navigate = useNavigate();

//   const columns = useMemo(() => {
//     const cols = [
//       {
//         header: "#",
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorFn: (row) => row?.name || "-",
//         header: "Name",
//       },
//     ];

//     cols.push({
//       header: "Action",
//       Cell: ({ row }) => {
//         const item = row.original;

//         return (
//           <div
//             className="feedback-btn d-flex align-items-center"
//             style={{ cursor: "pointer" }}
//             onClick={() => navigate(`/feedbackView/${item?.id}`)}
//           >
//             <i className="bi bi-card-checklist fs-4"></i>
//             <span>View</span>
//           </div>
//         );
//       },
//     });

//     return cols;
//   }, [handleToggle, hasActiveAccess, hasEditAccess, navigate]);

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

// export default FeedbackTable;

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useNavigate } from "react-router-dom";

const FeedbackTable = ({
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
        accessorFn: (row) => row?.name || "-",
        header: "Name",
      },
    ];

    if (
      hasActiveAccess?.("Feedback") ||
      hasEditAccess?.("Feedback") ||
      hasDeleteAccess?.("Feedback")
    ) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              {/* STATUS TOGGLE */}
              {hasActiveAccess?.("Feedback") && (
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

              {/* VIEW */}
              <div
                className="feedback-btn d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/feedbackView/${item?.id}`)
                }
              >
                <i className="bi bi-card-checklist fs-5"></i>
              </div>

              {/* EDIT */}
              {hasEditAccess?.("Feedback") && (
                <span
                  className="table-icon-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-6"></i>
                </span>
              )}

              {/* DELETE */}
              {hasDeleteAccess?.("Feedback") && (
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
    navigate,
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

export default FeedbackTable;