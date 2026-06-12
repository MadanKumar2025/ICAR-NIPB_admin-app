import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useNavigate } from "react-router-dom";

const UserTable = ({
  data = [],
  handleToggle,
  handleEdit,
  hasEditAccess,
  hasActiveAccess,
}) => {
  const navigate = useNavigate();

  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 70,
      },
      {
        accessorKey: "name",
        header: "Name",
   
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      // {
      //   accessorKey: "email",
      //   header: "Email",
      //   Cell: ({ cell }) => {
      //     const email = cell.getValue();

      //     return (
      //       <div style={{ wordBreak: "break-word" }}>
      //         {email.split("@").map((part, i) => (
      //           <span key={i}>
      //             {i === 0 ? part : `@${part}`}
      //             <br />
      //           </span>
      //         ))}
      //       </div>
      //     );
      //   },
      // },
      {
        accessorKey: "mobileNo",
        header: "Mobile No.",
      },
      // {
      //   accessorKey: "designation",
      //   header: "Designation",
      //   size: 160,
      //   grow: false,
      // },
    ];

    if (hasActiveAccess?.("User")) {
      cols.push({
         header: "Status",
        size: 100,
        grow: false,
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
              <label className="form-check-label">
                {/* {item?.isActive ? "Active" : "Inactive"} */}
              </label>
            </div>
          );
        },
      });
    }

    if (hasEditAccess?.("User")) {
      cols.push({
        header: "Action",
        size: 105,
        grow: false,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="table-icon-edit" onClick={() => handleEdit?.(item)}>
              {/* Edit */}
              <i className="bi bi-pencil fs-5"></i>
            </div>
          );
        },
      });
    }

    cols.push({
      header: "Permission",
      size: 130,
      grow: false,
      Cell: ({ row }) => {
        const item = row.original;
        return (
          // <button
          //   className="btn btn-info nowrap-btn"
          //   style={{ marginTop: "10px" }}
          //   onClick={() => navigate(`/UserPermissions/${item?._id}`)}
          // >
          //   Page Permissions
          // </button>
          <button
            className="btn btn-info nowrap-btn"
            style={{ marginTop: "10px" }}
            onClick={() => navigate(`/UserPermissions/${item?._id}`)}
          >
            Permissions
          </button>
        );
      },
    });

    return cols;
  }, [handleToggle, handleEdit, hasEditAccess, hasActiveAccess, navigate]);

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    // enableColumnResizing: true,
    layoutMode: "grid-no-grow",
    initialState: {
      showColumnFilters: true,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default UserTable;
