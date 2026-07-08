import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const NewsTable = ({
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
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorFn: (row) => row.title?.en || "-",
        header: "Title",
      },
      {
        accessorKey: "link",
        header: "Link",
        size: 50,
        minSize: 40,
        maxSize: 80,
        Cell: ({ row }) => {
          const link = row.original.link;

          return link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="fs-6 links-title"
            >
              <i class="bi bi-link-45deg fs-5"></i> Link
            </a>
          ) : (
            "-"
          );
        },
      },
    ];

    if (hasActiveAccess?.("News")) {
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
              {/* <label className="form-check-label">
                {item?.isActive ? "Active" : "Inactive"}
              </label> */}
              <label
                className={`form-check-label ${
                  item?.isActive ? "status-active" : "status-inactive"
                }`}
              >
                {/* {item?.isActive ? "Active" : "Inactive"} */}
              </label>
            </div>
          );
        },
      });
    }

    // if (hasEditAccess?.("News")) {
    //   cols.push({
    //     header: "Action",
    //     size: 50,
    //     minSize: 40,
    //     maxSize: 80,
    //     Cell: ({ row }) => {
    //       const item = row.original;

    //       return (
    //         <div
    //           className="table-text-edit"
    //           style={{ cursor: "pointer" }}
    //           onClick={() => handleEdit?.(item)}
    //         >
    //           <i class="bi bi-pencil fs-6"></i>
    //           <span></span>
    //         </div>
    //       );
    //     },
    //   });
    // }
    const canEdit = hasEditAccess?.("News");
    const canDelete = hasDeleteAccess?.("News");

    if (canEdit || canDelete) {
      cols.push({
        header: "Action",
        size: 50,
        minSize: 40,
        maxSize: 80,

        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              {canEdit && (
                <div
                  className="table-text-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-6"></i>
                </div>
              )}

              {canDelete && (
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
    handleEdit,
    handleDelete,
    handleToggle,
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

export default NewsTable;
