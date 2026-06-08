// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";
// import { useNavigate } from "react-router-dom";

// const CollaborationsTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   hasEditAccess,
//   hasActiveAccess
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
//         accessorFn: (row) => row?.title?.en || "-",
//         header: "Title",
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
//       {
//         header: "Action",
//         Cell: ({ row }) => {
//           const item = row.original;

//           return (
//             <span
//               className=" btn btn-info"
//               style={{ marginTop: "20px" }}
//               onClick={() => navigate(`/collaborationsDetails/${item?._id}`)}
//             >
//               Add Collaborations Details
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

// export default CollaborationsTable;

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useNavigate } from "react-router-dom";

const CollaborationsTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  hasEditAccess,
  hasActiveAccess,
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
        accessorFn: (row) => row?.title?.en || "-",
        header: "Title",
      },
    ];

    //  STATUS COLUMN
    if (hasActiveAccess?.("Collaborations")) {
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

    //  EDIT COLUMN
    if (hasEditAccess?.("Collaborations")) {
      cols.push({
        header: "Edit",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span className="table-icon-edit"
              style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
              <i className="bi bi-pencil fs-4"></i>
            </span>
          );
        },
      });
    }

    //   DETAILS COLUMN (navigation)
    if (hasEditAccess?.("Collaborations")) {
      cols.push({
        header: "Details",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <button
              className="btn btn-info"
              style={{ marginTop: "10px" }}
              onClick={() => navigate(`/collaborationsDetails/${item?._id}`)}
            >
              Add Details
            </button>
          );
        },
      });
    }

    return cols;
  }, [handleToggle, handleEdit, hasEditAccess, hasActiveAccess, navigate]);

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

export default CollaborationsTable;
