// import React, { useMemo, useState } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";

// const EventTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   hasEditAccess,
//   hasActiveAccess
// }) => {
//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorFn: (row) => row.name?.en || "-",
//         header: "Event Title",
//       },
//       {
//         header: "Start Time",
//         accessorFn: (row) =>
//           row.startTime
//             ? new Date(row.startTime).toLocaleDateString("en-GB")
//             : "-",
//       },
//       {
//         header: "End Time",
//         accessorFn: (row) =>
//           row.endTime
//             ? new Date(row.endTime).toLocaleDateString("en-GB")
//             : "-",
//       },
//       {
//         accessorFn: (row) => row.location?.en || "-",
//         header: "Location",
//       },

//       {
//         accessorKey: "registrationLink",
//         header: "Registration Link",
//         Cell: ({ row }) => {
//           const link = row.original.registrationLink;
//           return link ? (
//             <a
//               href={link}
//               target="_blank"
//               className="fs-6"
//               rel="noopener noreferrer"
//             >
//               Link
//               <i className="bi bi-binoculars "></i>
//             </a>
//           ) : (
//             "-"
//           );
//         },
//       },
//       {
//         header: "Registration Start Time",
//        accessorFn: (row) =>
//           row.registrationStartTime
//             ? new Date(row.registrationStartTime).toLocaleDateString("en-GB")
//             : "-",
//       },
//       {
//         header: "Registration End Time",
//         accessorFn: (row) =>
//           row.registrationendTime
//             ? new Date(row.registrationendTime).toLocaleDateString("en-GB")
//             : "-",
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
//                 onChange={() => handleToggle?.(item)}
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
//             <div className="d-flex gap-2">
//               <span
//                 className="badge text-bg-danger"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => handleEdit?.(item)}
//               >
//                 Edit
//               </span>
//             </div>
//           );
//         },
//       },
//     ],
//     [handleEdit],
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

// export default EventTable;


import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const EventTable = ({
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
        accessorFn: (row) => row.name?.en || "-",
        header: "Event Title",
      },
      {
        header: "Start Time",
        accessorFn: (row) =>
          row.startTime
            ? new Date(row.startTime).toLocaleDateString("en-GB")
            : "-",
      },
      {
        header: "End Time",
        accessorFn: (row) =>
          row.endTime
            ? new Date(row.endTime).toLocaleDateString("en-GB")
            : "-",
      },
      {
        accessorFn: (row) => row.location?.en || "-",
        header: "Location",
      },
      {
        accessorKey: "registrationLink",
        header: "Registration Link",
        Cell: ({ row }) => {
          const link = row.original.registrationLink;

          return link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="fs-6"
            >
              Link <i className="bi bi-binoculars"></i>
            </a>
          ) : (
            "-"
          );
        },
      },
      {
        header: "Registration Start Time",
        accessorFn: (row) =>
          row.registrationStartTime
            ? new Date(row.registrationStartTime).toLocaleDateString("en-GB")
            : "-",
      },
      {
        header: "Registration End Time",
        accessorFn: (row) =>
          row.registrationendTime
            ? new Date(row.registrationendTime).toLocaleDateString("en-GB")
            : "-",
      },
    ];

    // =========================
    // STATUS COLUMN (ACTIVE ACCESS)
    // =========================
    if (hasActiveAccess?.("Event")) {
      cols.push({
        accessorKey: "isActive",
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
              <label
  className={`form-check-label ${
    item?.isActive ? "status-active" : "status-inactive"
  }`}
>
  {item?.isActive ? "Active" : "Inactive"}
</label>

              {/* <label className="form-check-label">
                {item?.isActive ? "Active" : "Inactive"}
              </label> */}
            </div>
          );
        },
      });
    }

    // =========================
    // ACTION COLUMN (EDIT ACCESS)
    // =========================
    if (hasEditAccess?.("Event")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            
            <div className="table-text-edit" style={{ cursor: "pointer" }}
                onClick={() => handleEdit?.(item)}
              >
                <i class="bi bi-pencil fs-6"></i>
               <span> Edit</span>
            </div>
          );
        },
      });
    }

    return cols;
  }, [
    handleEdit,
    handleToggle,
    hasEditAccess,
    hasActiveAccess,
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

export default EventTable;