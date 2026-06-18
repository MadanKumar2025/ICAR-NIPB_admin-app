import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const PopupTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  hasEditAccess,
  hasActiveAccess,
  IMG_BASE_URL,
}) => {
  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row?.title || "-",
        header: "Title",
      },
      {
        accessorFn: (row) => row?.photo || "-",
        header: "Preview",
        Cell: ({ row }) => {
          const fileUrl = row.original?.photo;

          const isImage = fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

          return isImage ? (
            <img
              src={`${IMG_BASE_URL}/${fileUrl}`}
              alt="Preview"
              style={{
                height: "50px",
                width: "50px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          ) : (
            <i
              className="bi bi-file-earmark-pdf"
              style={{ fontSize: 24, color: "red" }}
            ></i>
          );
        },
      },
    ];

    // if (hasActiveAccess?.("Popup")) {
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
    //           {/* <label className="form-check-label">
    //             {item?.isActive ? "Active" : "Inactive"}
    //           </label> */}
    //         </div>
    //       );
    //     },
    //   });
    // }

    // // ACTION COLUMN (EDIT ACCESS)

    // if (hasEditAccess?.("Popup")) {
    //   cols.push({
    //     header: "Action",
    //     Cell: ({ row }) => {
    //       const item = row.original;

    //       return (
    //         <span
    //           // className="badge text-bg-danger"
    //           // style={{ cursor: "pointer" }}
    //           onClick={() => handleEdit?.(item)}
    //         >
    //           {/* Edit */}
    //           <i className="bi bi-pencil fs-4"></i>
    //         </span>
    //       );
    //     },
    //   });
    // }

    if (hasActiveAccess?.("Popup") || hasEditAccess?.("Popup")) {
      cols.push({
        header: "Actions",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {/* STATUS TOGGLE */}
              {hasActiveAccess?.("Popup") && (
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={Boolean(item?.isActive)}
                    onChange={() => handleToggle?.(item)}
                  />
                </div>
              )}

              {/* EDIT ICON */}
              {hasEditAccess?.("Popup") && (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-4"></i>
                </span>
              )}
            </div>
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

export default PopupTable;
