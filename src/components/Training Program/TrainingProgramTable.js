import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const TrainingProgramTable = ({
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
        accessorFn: (row) => row?.title.en || "-",
        header: "Title",
      },
    //   {
    //     accessorFn: (row) => row?.apiName || "-",
    //     header: "Api Url",
    //   },
    ];

     if (hasActiveAccess?.("Training Program")) {
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
             </div>
           );
         },
       });
     }

     if (hasEditAccess?.("Training Program")) {
       cols.push({
         header: "Action",
         Cell: ({ row }) => {
           const item = row.original;

           return (
             <span
               style={{ cursor: "pointer" }}
               onClick={() => handleEdit?.(item)}
             >
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
    state: { pagination },
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
  });

  return <MaterialReactTable table={table} />;
};

export default TrainingProgramTable;
