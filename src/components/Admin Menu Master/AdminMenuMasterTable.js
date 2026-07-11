import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const AdminMenuMasterTable = ({
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
        accessorFn: (row) => row?.menuName || "-",
        header: "Menu Name",
      },
      {
        accessorFn: (row) => row?.url || "-",
        header: "Url",
      },
    ];

    //  if (hasActiveAccess?.("Help")) {
    //    cols.push({
    //      accessorKey: "isActive",
    //      header: "Status",
    //      Cell: ({ row }) => {
    //        const item = row.original;

    //        return (
    //          <div className="form-check form-switch">
    //            <input
    //              className="form-check-input"
    //              type="checkbox"
    //              checked={Boolean(item?.isActive)}
    //              onChange={() => handleToggle?.(item)}
    //            />
    //          </div>
    //        );
    //      },
    //    });
    //  }

    //  if (hasEditAccess?.("AdminMenuMaster")) {
    cols.push({
      header: "Action",
      Cell: ({ row }) => {
        const item = row.original;

        return (
          <span
            className="table-icon-edit"
            style={{ cursor: "pointer" }}
            onClick={() => handleEdit?.(item)}
          >
            <i className="bi bi-pencil fs-5"></i>
          </span>
        );
      },
    });
    //  }

    return cols;
  }, [handleToggle, handleEdit, hasEditAccess, hasActiveAccess]);

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    state: { pagination },
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
  });

  return <MaterialReactTable table={table} />;
};

export default AdminMenuMasterTable;
