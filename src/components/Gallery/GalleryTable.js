// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";

// const GalleryTable = ({
//   data = [],
//   GalleryhandleToggle,
//   galleryhandleEdit,
//   pagination,
//   setPagination,
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
//         header: "Title (English)",
//       },

//       {
//         accessorKey: "type",
//         header: "type",
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
//                 onChange={() => GalleryhandleToggle?.(item)}
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
//                 onClick={() => galleryhandleEdit?.(item)}
//               >
//                 Edit
//               </span>
//             </div>
//           );
//         },
//       },
//     ],
//     [galleryhandleEdit],
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

// export default GalleryTable;
import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const GalleryTable = ({
  data = [],
  GalleryhandleToggle,
  galleryhandleEdit,
  galleryhandleDelete,
  pagination,
  setPagination,
  hasEditAccess,
  hasActiveAccess,
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
        header: "Title (English)",
      },
      {
        accessorKey: "type",
        header: "Type",
      },
    ];

    // Status Permission
    if (
      hasActiveAccess?.("Album") ||
      hasActiveAccess?.("Facilities") ||
      hasActiveAccess?.("Student Course") ||
      hasActiveAccess?.("Outreach programme")
    ) {
      cols.push({
        header: "Status",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="form-check form-switch table-lable-switch d-flex align-items-center">
              <input
                className="form-check-input"
                type="checkbox"
                checked={Boolean(item?.isActive)}
                onChange={() => GalleryhandleToggle?.(item)}
              />
              <label
                className={`form-check-label ${
                  item?.isActive ? "status-active" : "status-inactive"
                }`}
              ></label>
            </div>
          );
        },
      });
    }

    const canEdit =
      hasEditAccess?.("Album") ||
      hasEditAccess?.("Facilities") ||
      hasEditAccess?.("Student Course") ||
      hasEditAccess?.("Outreach programme");

    const canDelete =
      hasDeleteAccess?.("Album") ||
      hasDeleteAccess?.("Facilities") ||
      hasDeleteAccess?.("Student Course") ||
      hasDeleteAccess?.("Outreach programme");

    if (canEdit || canDelete) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              {canEdit && (
                <div
                  className="table-text-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => galleryhandleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-6"></i>
                </div>
              )}

              {canDelete && (
                <span
                  className="trash-icon"
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => galleryhandleDelete?.(item)}
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
    GalleryhandleToggle,
    galleryhandleEdit,
    galleryhandleDelete,
    hasEditAccess,
    hasActiveAccess,
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

export default GalleryTable;
