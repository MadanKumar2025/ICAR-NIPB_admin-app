import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const ContractualStaffTable = ({
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
        accessorFn: (row) => row?.name?.en || "-",
        header: "Name",
      },
      {
        accessorFn: (row) => row?.position?.en || "-",
        header: "Position",
      },
      {
        accessorFn: (row) => row?.contactNumber || "-",
        header: "Contact Number",
      },
    ];

    //   STATUS COLUMN (Active Access)
    // if (hasActiveAccess?.("Contractual Staff")) {
    //   cols.push({
    //      header: "Status", size: 40,
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
    //         </div>
    //       );
    //     },
    //   });
    // }

    // //   EDIT COLUMN (Edit Access)
    // if (hasEditAccess?.("Contractual Staff")) {
    //   cols.push({
    //     header: "Action", size: 40,
    //     minSize: 30,
    //     maxSize: 70,
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
    if (
      hasActiveAccess?.("Contractual Staff") ||
      hasEditAccess?.("Contractual Staff")
    ) {
      cols.push({
        header: "Actions",
        size: 40,
        minSize: 30,
        maxSize: 70,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {/* STATUS TOGGLE */}
              {hasActiveAccess?.("Contractual Staff") && (
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
              {hasEditAccess?.("Contractual Staff") && (
                <span
                  className="table-icon-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-5"></i>
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

export default ContractualStaffTable;
