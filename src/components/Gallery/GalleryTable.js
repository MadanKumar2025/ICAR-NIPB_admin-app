import React, { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { useMaterialReactTable } from "material-react-table";

const GalleryTable = ({
  data = [],
  GalleryhandleToggle,
  galleryhandleEdit,
  pagination,
  setPagination,
}) => {
  const columns = useMemo(
    () => [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row.title?.en || "-",
        header: "Title (English)",
      },
     
      {
        accessorKey: "type",
        header: "type",
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
                onChange={() => GalleryhandleToggle?.(item)}
              />
              <label className="form-check-label">
                {item?.isActive ? "Active" : "Inactive"}
              </label>
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
                onClick={() => galleryhandleEdit?.(item)}
              >
                Edit
              </span>
            </div>
          );
        },
      },
    ],
    [galleryhandleEdit],
  );

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

export default GalleryTable;
