// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";
// import { useNavigate } from "react-router-dom";
// const InstitutionalProjectsTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
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
//         accessorFn: (row) => row?.mainProject?.en || "-",
//         header: "Main Project",
//       },
//       {
//         accessorFn: (row) => row?.groupLeader?.en || "-",
//         header: "Group Leader",
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
//         header: "Sub Project",
//         Cell: ({ row }) => {
//           const item = row.original;

//           return (
//             <div className="col-md-6">
//               <div
//                 className="btn btn-info"
//                 onClick={() => {
//                   navigate(`/institutionalProjectsDetails/${item?._id}`);
//                 }}
//                 style={{ marginTop: "20px" }}
//               >
//                 Add Sub Project
//               </div>
//             </div>
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

// export default InstitutionalProjectsTable;

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useNavigate } from "react-router-dom";

const InstitutionalProjectsTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  hasActiveAccess,
  hasEditAccess,
  hasAddAccess,
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
        accessorFn: (row) => row?.mainProject?.en || "-",
        header: "Main Project",
      },
      {
        accessorFn: (row) => row?.groupLeader?.en || "-",
        header: "Group Leader",
      },
    ];

    // =========================
    // STATUS COLUMN (ACTIVE ACCESS)
    // =========================
    if (hasActiveAccess?.("Institutional Projects")) {
      cols.push({
        size: 40,
        minSize: 30,
        maxSize: 70,
        header: "Status",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="form-check form-switch table-lable-switch d-flex align-items-center">
              <input
                className="form-check-input"
                type="checkbox"
                checked={Boolean(item?.isActive)}
                onChange={() => handleToggle?.(item)}
              />
              {/* <label className="form-check-label">
                {item?.isActive ? "Active" : "Inactive"}
              </label> */}
              <label
                className={`form-check-label ${
                  item?.isActive ? "status-active" : "status-inactive"
                }`}
              >
                {/* {item?.isActive ? "Active" : "Inactive"} */}
              </label>
            </div>
          );
        },
      });
    }

    // =========================
    // ACTION COLUMN (EDIT ACCESS)
    // =========================
    if (hasEditAccess?.("Institutional Projects")) {
      cols.push({
        header: "Action",
        size: 40,
        minSize: 30,
        maxSize: 70,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div
              className="table-text-edit"
              style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
              <i class="bi bi-pencil fs-6"></i>
              <span> Edit</span>
            </div>
          );
        },
      });
    }

    // =========================
    // SUB PROJECT BUTTON (ALWAYS AVAILABLE OR CAN BE LOCKED LATER)
    // =========================
    if (hasAddAccess("Institutional Projects")) {
      cols.push({
        header: "Sub Project",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div
              className="btn btn-info nowrap-btn"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/institutionalProjectsDetails/${item?._id}`)
              }
            >
              Add Sub Project
            </div>
          );
        },
      });
    }

    return cols;
  }, [
    handleToggle,
    handleEdit,
    hasActiveAccess,
    hasEditAccess,
    hasAddAccess,
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

export default InstitutionalProjectsTable;
