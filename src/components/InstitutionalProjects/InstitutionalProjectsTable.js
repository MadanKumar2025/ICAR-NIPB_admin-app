import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useNavigate } from "react-router-dom";

const InstitutionalProjectsTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  hasActiveAccess,
  hasEditAccess,
  hasAddAccess,
  hasDeleteAccess,
  handleDelete,
}) => {
  const navigate = useNavigate();

  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row?.mainProject?.en || "-",
        header: "Main Project",
      },
      {
        accessorFn: (row) => row?.groupLeader?.en || "-",
        header: "Group Leader",
      },
    ];

    if (hasActiveAccess?.("Institutional Projects")) {
      cols.push({
        size: 40,
        minSize: 30,
        maxSize: 70,
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
              ></label>
            </div>
          );
        },
      });
    }

    // if (hasEditAccess?.("Institutional Projects")) {
    //   cols.push({
    //     header: "Action",
    //     size: 40,
    //     minSize: 30,
    //     maxSize: 70,
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

    if (
      hasEditAccess?.("Institutional Projects") ||
      hasDeleteAccess?.("Institutional Projects")
    ) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              {hasEditAccess?.("Institutional Projects") && (
                <div
                  className="table-text-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-6"></i>
                </div>
              )}

              {hasDeleteAccess?.("Institutional Projects") && (
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
    if (hasAddAccess("Institutional Projects")) {
      cols.push({
        header: "Sub Project",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div
              className="btn btn-info nowrap-btn"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/institutionalProjectsDetails/${item?._id}`)
              }
            >
              Add Sub Project
            </div>
          );
        },
      });
    }

    return cols;
  }, [
    handleToggle,
    handleEdit,
    hasActiveAccess,
    hasEditAccess,
    hasAddAccess,
    navigate,
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

export default InstitutionalProjectsTable;
