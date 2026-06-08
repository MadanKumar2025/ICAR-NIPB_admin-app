// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";
// import { useNavigate } from "react-router-dom";

// const FeedbackTable = ({
//   data = [],
//   handleToggle,
//   handleView,
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
//         accessorFn: (row) => row?.name?.en || "-",
//         header: "Name",
//       },
//       {
//         accessorFn: (row) => row?.email || "-",
//         header: "Email",
//       },
//       {
//         accessorFn: (row) => row?.subject?.en || "-",
//         header: "subject",
//       },
//       // {
//       //   accessorFn: (row) => row?.message?.en || "-",
//       //   header: "Message",
//       // },
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
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/feedbackView/${item?._id}`)}
//             >
//               <i class="bi bi-card-checklist fs-4"></i>
//               <p>view</p>
//             </span>
//           );
//         },
//       },
//     ],
//     [handleToggle],
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
  pagination,
  setPagination,
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
        accessorFn: (row) => row?.name || "-",
        header: "Name",
      },
    ];

    //    STATUS COLUMN (Active Access)
    // if (hasActiveAccess?.("Feedback")) {
    //   cols.push({
    //     accessorKey: "isActive",
    //     header: "Status",
    //     Cell: ({ row }) => {
    //       const item = row.original;

    //       return (
    //         <div className="form-check form-switch">
    //           <input
    //             className="form-check-input"
    //             type="checkbox"
    //             checked={Boolean(item?.isActive)}
    //             onChange={() => handleToggle?.(item)}
    //           />
    //         </div>
    //       );
    //     },
    //   });
    // }

    //   VIEW COLUMN (Edit/View Access)

    cols.push({
      header: "Action",
      Cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="feedback-btn d-flex align-items-center"
            style={{ cursor: "pointer",  }}
            onClick={() => navigate(`/feedbackView/${item?.id}`)}
          >
            <i className="bi bi-card-checklist fs-4"></i>
            <span>View</span>
          </div>
        );
      },
    });

    return cols;
  }, [handleToggle, hasActiveAccess, hasEditAccess, navigate]);

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
