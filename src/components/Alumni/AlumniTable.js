import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const AlumniTable = ({
  data = [],
  handleToggle,
  pagination,
  setPagination,
  hasEditAccess,
  hasActiveAccess,
  handleEdit,
  handleDelete,
  hasDeleteAccess,
}) => {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;

  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row?.name?.en || "-",
        header: "Name",
        size: 50,
        minSize: 40,
        maxSize: 80,
      },
      {
        accessorFn: (row) => row?.email || "-",
        header: "Email",
      },
      {
        accessorFn: (row) => row?.batch?.en || "-",
        header: "Batch",
        size: 50,
        minSize: 40,
        maxSize: 80,
      },
      {
        accessorFn: (row) => row?.degree?.en || "-",
        header: "Degree",
        size: 50,
        minSize: 40,
        maxSize: 80,
      },
      {
        header: "Photo",
        size: 50,
        minSize: 40,
        maxSize: 80,
        Cell: ({ row }) => {
          const item = row.original;
          const photoUrl = item?.photo
            ? `${IMG_BASE_URL}/${item.photo}`
            : "https://via.placeholder.com/40";

          return (
            <img
              src={photoUrl}
              alt="profile"
              style={{
                maxWidth: "15vw",
                height: "40px",
                borderRadius: "1%",
                objectFit: "cover",
              }}
            />
          );
        },
      },
    ];

    // if (hasActiveAccess?.("Alumni") || hasEditAccess?.("Alumni")) {
    //   cols.push({
    //     header: "Actions",
    //     size: 50,
    //     minSize: 40,
    //     maxSize: 80,
    //     Cell: ({ row }) => {
    //       const item = row.original;

    //       return (
    //         <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    //           {/* APPROVE TOGGLE */}
    //           {hasActiveAccess?.("Alumni") && (
    //             <div className="form-check form-switch m-0">
    //               <input
    //                 className="form-check-input"
    //                 type="checkbox"
    //                 checked={Boolean(item?.isApproved)}
    //                 onChange={() => handleToggle?.(item)}
    //               />
    //             </div>
    //           )}

    //           {/* EDIT BUTTON */}
    //           {hasEditAccess?.("Alumni") && (
    //             <span
    //               className="table-icon-edit"
    //               style={{ cursor: "pointer" }}
    //               onClick={() => handleEdit?.(item)}
    //             >
    //               <i className="bi bi-pencil fs-5"></i>
    //             </span>
    //           )}
    //         </div>
    //       );
    //     },
    //   });
    // }
    if (
      hasActiveAccess?.("Alumni") ||
      hasEditAccess?.("Alumni") ||
      hasDeleteAccess?.("Alumni")
    ) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              {/* Status Toggle */}
              {hasActiveAccess?.("Alumni") && (
                <div className="form-check form-switch table-lable-switch d-flex align-items-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={Boolean(item?.isApproved)}
                    onChange={() => handleToggle?.(item)}
                  />
                </div>
              )}

              {/* Edit */}
              {hasEditAccess?.("Alumni") && (
                <div
                  className="table-text-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-6"></i>
                </div>
              )}

              {/* Delete */}
              {hasDeleteAccess?.("Alumni") && (
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
    IMG_BASE_URL,
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

export default AlumniTable;
