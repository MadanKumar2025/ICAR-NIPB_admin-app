import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const PatentsTable = ({
  data = [],
  handleEdit,
  hasEditAccess,
  hasActiveAccess,
  handleToggle,
}) => {
  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row?.type?.en || "-",
        header: "Type",
      },
      // {
      //   accessorFn: (row) => row?.title?.en || "-",
      //   header: "Title",
      // },
      {
        accessorFn: (row) => {
          const html = row?.title?.en || "-";

          const div = document.createElement("div");
          div.innerHTML = html;

          const text = div.textContent || div.innerText || "-";

          // limit text (e.g. 30 chars)
          const limit = 30;

          return text.length > limit ? text.substring(0, limit) + "..." : text;
        },
        header: "Title",
      },
    ];
    if (hasActiveAccess?.("Patents")) {
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
    if (hasEditAccess?.("Patents")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span className="table-icon-edit"
            
              onClick={() => handleEdit?.(item)}
            >
           <i className="bi bi-pencil fs-4"></i>
            </span>
          );
        },
      });
    }

    return cols;
  }, [handleEdit, hasEditAccess, hasActiveAccess, handleToggle]);

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    initialState: {
      showColumnFilters: true,
    },

    // TABLE CONTAINER STYLE
    muiTableProps: {
      sx: {
        width: "100%",
        display: "table",
      },
    },

    // OUTER PAPER STYLE
    muiTablePaperProps: {
      sx: {
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      },
    },

    // HEADER STYLE
    muiTableHeadCellProps: {
      sx: {
        fontWeight: "bold",
        backgroundColor: "#f5f5f5",
        color: "#333",
      },
    },

    // BODY CELL STYLE
    muiTableBodyCellProps: {
      sx: {
        borderBottom: "1px solid #eee",
        padding: "10px",
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default PatentsTable;
