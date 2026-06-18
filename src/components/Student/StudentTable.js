import React, { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { useMaterialReactTable } from "material-react-table";

const StudentTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  setAlbumGallery,
  handleOpen,
}) => {
  const columns = useMemo(
    () => [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row.studentName?.en || "-",
        header: "Student Name",
      },

      {
        accessorFn: (row) => row.rollNo || "-",
        header: "Roll No.",
      },

      {
        accessorFn: (row) => row.guideName?.en || "-",
        header: "Guide Name.",
      },

      {
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
      },
      {
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="d-flex gap-2">
              <span
                className="badge text-bg-danger"
                style={{ cursor: "pointer" }}
                onClick={() => handleEdit?.(item)}
              >
                Edit
              </span>
            </div>
          );
        },
      },
    ],
    [handleEdit],
  );

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    state: {
      pagination,
    },
    onPaginationChange: setPagination,

    autoResetPageIndex: false,
    muiTableContainerProps: {
      sx: {
        maxHeight: "20vh",
        overflow: "auto",
      },
    },

    initialState: {
      showColumnFilters: true,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default StudentTable;
