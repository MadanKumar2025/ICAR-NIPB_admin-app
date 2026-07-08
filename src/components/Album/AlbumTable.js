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
  hasActiveAccess,
  hasAddAccess,
  hasDeleteAccess,
  handleDelete,
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
    ];

    // STATUS COLUMN (ACTIVE ACCESS)

    // if (
    //   hasActiveAccess?.("Album") ||
    //   hasActiveAccess?.("Facilities") ||
    //   hasActiveAccess?.("Outreach programme")
    // ) {
    //   cols.push({
    //     header: "Status",
    //     size: 40,
    //     minSize: 30,
    //     maxSize: 70,
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
    //           <label className="form-check-label">
    //             {/* {item?.isActive ? "Active" : "Inactive"} */}
    //           </label>
    //         </div>
    //       );
    //     },
    //   });
    // }
    const canEdit =
      hasEditAccess?.("Album") ||
      hasEditAccess?.("Facilities") ||
      hasEditAccess?.("Outreach programme") ||
      hasEditAccess?.("Student Course");

    const canDelete =
      hasDeleteAccess?.("Album") ||
      hasDeleteAccess?.("Facilities") ||
      hasDeleteAccess?.("Outreach programme") ||
      hasDeleteAccess?.("Student Course");

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
                  onClick={() => handleEdit(item)}
                >
                  <i className="bi bi-pencil fs-6"></i>
                </div>
              )}

              {canDelete && (
                <span
                  className="trash-icon"
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => handleDelete(item)}
                >
                  <i className="bi bi-trash fs-5"></i>
                </span>
              )}
            </div>
          );
        },
      });
    }

    if (
      hasEditAccess?.("Album") ||
      hasAddAccess?.("Facilities") ||
      hasAddAccess?.("Outreach programme") ||
      hasAddAccess?.("Student Course")
    ) {
      cols.push({
        header: "Gallery",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="col-md-6">
              <div
                className="btn btn-info nowrap-btn"
                onClick={() => {
                  setAlbumGallery?.(item?.id);
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

export default AlbumTable;
