import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const EventTable = ({
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
        accessorFn: (row) => row.name?.en || "-",
        header: "Event Title",
      },

      {
        header: "Time",
        accessorFn: (row) => {
          const startTime = row.startTime
            ? new Date(row.startTime).toLocaleDateString("en-GB")
            : "-";

          const endTime = row.endTime
            ? new Date(row.endTime).toLocaleDateString("en-GB")
            : "-";

          return `${startTime} - ${endTime}`;
        },
      },
      // {
      //   accessorFn: (row) => row.location?.en || "-",
      //   header: "Location",
      // },
      {
        accessorKey: "registrationLink",
        header: "Registration Link",
        size: 50,
        minSize: 40,
        maxSize: 80,
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
    ];

    if (hasActiveAccess?.("Event")) {
      cols.push({
        accessorKey: "isActive",
        header: "Status",
        size: 50,
        minSize: 40,
        maxSize: 80,
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
            </div>
          );
        },
      });
    }

    // if (hasEditAccess?.("Event")) {
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
    //           <span> Edit</span>
    //         </div>
    //       );
    //     },
    //   });
    // }
    const canEdit = hasEditAccess?.("Event");
    const canDelete = hasDeleteAccess?.("Event");

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

export default EventTable;
