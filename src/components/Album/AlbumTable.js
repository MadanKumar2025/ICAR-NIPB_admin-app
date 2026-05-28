// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";

// const AlbumTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   setAlbumGallery,
//   handleOpen,
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
//         accessorFn: (row) => row.title?.en || "-",
//         header: "Title",
//       },

//       {
//         accessorFn: (row) => row.venue?.en || "-",
//         header: "Venue",
//       },

//       {
//         header: "Publish Date",
//         accessorFn: (row) =>
//           row.publishDate
//             ? new Date(row.publishDate).toLocaleDateString("en-GB")
//             : "-",
//       },
//       {
//         header: "Expiry Date",
//         accessorFn: (row) =>
//           row.expiryDate
//             ? new Date(row.expiryDate).toLocaleDateString("en-GB")
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
//       {
//         header: "Gallery",
//         Cell: ({ row }) => {
//           const item = row.original;
//           return (
//             <div className="col-md-6">
//               <div
//                 className=" btn btn-info"
//                 onClick={() => {
//                   setAlbumGallery(item?._id);
//                   handleOpen();
//                 }}
//                 style={{ marginTop: "20px" }}
//               >
//                 Add Gallery
//               </div>
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

// export default AlbumTable;

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const AlbumTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  setAlbumGallery,
  handleOpen,
  hasEditAccess,
  hasActiveAccess,hasAddAccess
}) => {
  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row.type?.en || "-",
        header: "Type",
      },
      {
        accessorFn: (row) => row.title?.en || "-",
        header: "Title",
      },
      {
        accessorFn: (row) => row.venue?.en || "-",
        header: "Venue",
      },
      {
        header: "Publish Date",
        accessorFn: (row) =>
          row.publishDate
            ? new Date(row.publishDate).toLocaleDateString("en-GB")
            : "-",
      },
      {
        header: "Expiry Date",
        accessorFn: (row) =>
          row.expiryDate
            ? new Date(row.expiryDate).toLocaleDateString("en-GB")
            : "-",
      },
    ];

    // STATUS COLUMN (ACTIVE ACCESS)

    if (hasActiveAccess?.("Album")) {
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
                {/* {item?.isActive ? "Active" : "Inactive"} */}
              </label>
            </div>
          );
        },
      });
    }

    // EDIT ACTION (EDIT ACCESS)

    if (hasEditAccess?.("Album")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex gap-2">
              <span
                // className="badge text-bg-danger"
                // style={{ cursor: "pointer" }}
                onClick={() => handleEdit?.(item)}
              >
                {/* Edit */}

                <i className="bi bi-pencil fs-4"></i>
              </span>
            </div>
          );
        },
      });
    }

    // GALLERY ACTION (NO RESTRICT LOGIC APPLIED, BUT SAFE)

    if (hasEditAccess?.("Album") || hasAddAccess?.("Album")) {
  
      cols.push({
        header: "Gallery",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="col-md-6">
              <div
                className="btn btn-info"
                onClick={() => {
                  setAlbumGallery?.(item?._id);
                  handleOpen?.();
                }}
                style={{ cursor: "pointer" }}
              >
                Add Gallery
              </div>
            </div>
          );
        },
      });
    }
    return cols;
  }, [
    handleEdit,
    handleToggle,
    handleOpen,
    setAlbumGallery,
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

export default AlbumTable;
