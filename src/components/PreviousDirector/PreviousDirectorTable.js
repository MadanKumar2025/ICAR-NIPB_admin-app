import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const PreviousDirectorTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  hasEditAccess,
  hasActiveAccess,
  handleDelete,
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
        accessorFn: (row) => row?.name?.en || "-",
        header: "Name",
      },
      {
        accessorKey: "workingPeriod",
        header: "Working Period",
      },
      // {
      //   accessorKey: "acting",
      //   header: "Acting Status",
      //   Cell: ({ row }) => {
      //     const item = row.original;

      //     return (
      //       <label className="form-check-label">
      //         {item?.acting ? "Acting" : "Inactive"}
      //       </label>

      //     );
      //   },
      // },
    ];

    if (hasActiveAccess?.("Previous Director")) {
      cols.push({
        // accessorKey: "isActive",
        header: "Status",
        //  header: "Acting Status",
        size: 40,
        minSize: 30,
        maxSize: 70,
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

    // if (hasEditAccess?.("Previous Director")) {
    //   cols.push({
    //     header: "Action",
    //     Cell: ({ row }) => {
    //       const item = row.original;

    //       return (
    //         <div
    //           className="table-text-edit"
    //           style={{ cursor: "pointer" }}
    //           onClick={() => handleEdit?.(item)}
    //         >
    //           <i className="bi bi-pencil fs-6"></i>
    //           <span> Edit</span>
    //         </div>
    //       );
    //     },
    //   });
    // }

    if (
      hasEditAccess?.("Previous Director") ||
      hasDeleteAccess?.("Previous Director")
    ) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              {hasEditAccess?.("Previous Director") && (
                <div
                  className="table-text-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-6"></i>
                </div>
              )}

              {hasDeleteAccess?.("Previous Director") && (
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
    hasEditAccess,
    hasActiveAccess,
    handleDelete,
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

export default PreviousDirectorTable;
