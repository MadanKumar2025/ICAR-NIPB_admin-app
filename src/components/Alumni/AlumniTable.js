import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const AlumniTable = ({
  data = [],
  handleToggle,
  pagination,
  setPagination,
  hasEditAccess,
  hasActiveAccess,
  handleEdit,
}) => {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;

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
        accessorFn: (row) => row?.email || "-",
        header: "Email",
      },
      {
        accessorFn: (row) => row?.batch?.en || "-",
        header: "Batch",
      },
      {
        accessorFn: (row) => row?.degree?.en || "-",
        header: "Degree",
      },
      {
        header: "Photo",
        Cell: ({ row }) => {
          const item = row.original;
          const photoUrl = item?.photo
            ? `${IMG_BASE_URL}/${item.photo}`
            : "https://via.placeholder.com/40";

          return (
            <img
              src={photoUrl}
              alt="profile"
              style={{
                maxWidth: "15vw",
                height: "40px",
                borderRadius: "1%",
                objectFit: "cover",
              }}
            />
          );
        },
      },
    ];

    // APPROVED TOGGLE (ACTIVE ACCESS)
    if (hasActiveAccess?.("Alumni")) {
      cols.push({
        accessorKey: "isApproved",
        header: "Approved",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={Boolean(item?.isApproved)}
                onChange={() => handleToggle?.(item)}
              />
            </div>
          );
        },
      });
    }
 
    if (hasEditAccess?.("Alumni")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <span class="table-icon-edit"
              style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
              <i className="bi bi-pencil fs-5"></i>
            </span>
          );
        },
      });
    }

    return cols;
  }, [handleToggle, hasActiveAccess, hasEditAccess, IMG_BASE_URL]);

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

export default AlumniTable;
