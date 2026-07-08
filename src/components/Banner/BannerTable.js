import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const BannerTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  hasEditAccess,
  hasActiveAccess,
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
        accessorFn: (row) => row?.title?.en || "-",
        header: "Title",
      },
      {
        accessorFn: (row) => row?.subTitle?.en || "-",
        header: "Sub-Title",
      },
      {
        header: "Banner Image",
        Cell: ({ row }) => {
          const image = row.original.bannerImage;

          return (
            <img
              src={`${process.env.REACT_APP_API_BASE_URL_img}/${image}`}
              alt="Banner"
              style={{
                width: "100px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          );
        },
      },
    ];

    if (hasActiveAccess?.("Banner")) {
      cols.push({
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

    // ACTION COLUMN (EDIT ACCESS)

    // if (hasEditAccess?.("Banner")) {
    //   cols.push({
    //     header: "Action",
    //     Cell: ({ row }) => {
    //       const item = row.original;

    //       return (
    //         <span
    //           className="table-icon-edit"
    //           onClick={() => handleEdit?.(item)}
    //         >
    //           <i className="bi bi-pencil fs-5"></i>
    //         </span>
    //       );
    //     },
    //   });
    // }
    const canEdit = hasEditAccess?.("Banner");
    const canDelete = hasDeleteAccess?.("Banner");

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

    return cols;
  }, [
    handleToggle,
    handleEdit,
    hasEditAccess,
    hasActiveAccess,
    hasDeleteAccess,
    handleDelete,
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

export default BannerTable;
