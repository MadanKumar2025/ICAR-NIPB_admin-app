// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";

// const ExternalLinkTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   hasEditAccess,
//   hasActiveAccess
// }) => {
//   const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorFn: (row) => row?.type || "-",
//         header: "Type",
//       },
//       {
//         accessorFn: (row) => row?.title?.en || "-",
//         header: "Title",
//       },
//      {
//         accessorFn: (row) => row.link || "#",
//         header: "Link",
//         Cell: ({ row }) => {
//           const fileUrl = row.original?.link;
//           // const title = row.original?.title || "Unknown File";
//           return (
//             <a
//             //   href={`${IMG_BASE_URL}/files/${fileUrl}`}
//               href={`${fileUrl}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{ textDecoration: "underline", color: "blue" }}
//             >
//               {/* {`${IMG_BASE_URL}/files/${fileUrl}`} */}
//               {/* {`${fileUrl}`} */}
//               Link
//             </a>
//           );
//         },
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

// export default ExternalLinkTable;


import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const ExternalLinkTable = ({
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
        accessorFn: (row) => row?.type || "-",
        header: "Type",
      },
      {
        accessorFn: (row) => row?.title?.en || "-",
        header: "Title",
      },
      {
        accessorFn: (row) => row.link || "#",
        header: "Link",
        Cell: ({ row }) => {
          const fileUrl = row.original?.link;

          return fileUrl ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", color: "blue" }}
            >
              Link
            </a>
          ) : (
            "-"
          );
        },
      },
    ];

    //  STATUS COLUMN (Active Access)
    if (hasActiveAccess?.("External Link")) {
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

    //  EDIT COLUMN (Edit Access)
    if (hasEditAccess?.("External Link")) {
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
  }, [handleToggle, handleEdit, hasEditAccess, hasActiveAccess]);

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

export default ExternalLinkTable;