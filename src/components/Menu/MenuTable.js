import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const MenuTable = ({
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
        accessorKey: "menuCategory",
        header: "Menu Category",
        size: 50,
        minSize: 40,
        maxSize: 80,
      },
      {
        accessorKey: "menuType",
        header: "Menu Type",
        size: 50,
        minSize: 40,
        maxSize: 80,
      },
      {
        accessorFn: (row) => row.menuName_en || "-",
        header: "Menu Name",
      },
      // {
      //   accessorKey: "order",
      //   header: "Order",
      //   size: 30,
      //   minSize: 20,
      //   maxSize: 60,
      // },
    ];

    if (hasActiveAccess?.("Menu")) {
      cols.push({
        // accessorKey: "isActive",
        header: "Status",
        size: 40,
        minSize: 30,
        maxSize: 70,
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

    if (hasEditAccess?.("Menu")) {
      cols.push({
        header: "Action",
        size: 50,
        minSize: 40,
        maxSize: 80,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span
              className="table-icon-edit"
              onClick={() => handleEdit?.(item)}
            >
              <i className="bi bi-pencil fs-5"></i>
            </span>
          );
        },
      });
    }

    return cols;
  }, [handleToggle, handleEdit, hasEditAccess, hasActiveAccess]);

  // =========================
  // TABLE INSTANCE
  // =========================
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

export default MenuTable;
