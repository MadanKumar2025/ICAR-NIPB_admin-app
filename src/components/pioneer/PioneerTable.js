
import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const PioneerTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  hasEditAccess,
  hasActiveAccess,
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
      // {
      //   accessorFn: (row) => row?.subTitle?.en || "-",
      //   header: "Sub-Title",
      // },
    //   {
    //     accessorKey: "acting",
    //     header: "Acting Status",
    //     Cell: ({ row }) => {
    //       const item = row.original;

    //       return (
    //         <label className="form-check-label">
    //           {item?.acting ? "Acting" : "Inactive"}
    //         </label>
    //       );
    //     },
    //   },
    ];
    
    if (hasActiveAccess?.("pioneer")) {
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
              {/* <label className="form-check-label">
                {item?.isActive ? "Active" : "Inactive"}
              </label> */}
            </div>
          );
        },
      });
    }
 
    // ACTION COLUMN (EDIT ACCESS)
  
    if (hasEditAccess?.("pioneer")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span
              // className="badge text-bg-danger"
              // style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
              {/* Edit */}
                <i className="bi bi-pencil fs-4"></i>
            </span>
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

export default PioneerTable;