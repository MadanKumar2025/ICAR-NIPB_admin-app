// import React, { useMemo } from 'react';
// import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

// const TemplateTable = ({ data = [], handleEdit ,hasEditAccess}) => {

//   const columns = useMemo(
//     () => [
//       {
//         header: '#',
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorKey: 'templateName',
//         header: 'Template Name',
//       },
//       {
//         header: 'Action',
//         Cell: ({ row }) => {
//           const item = row.original;

//           return (
//             <span
//               className="badge text-bg-danger"
//               style={{ cursor: 'pointer' }}
//               onClick={() => handleEdit?.(item)}
//             >
//               Edit
//             </span>
//           );
//         },
//       },
//     ],
//     [handleEdit]
//   );

//   const table = useMaterialReactTable({
//     columns,
//     data: data || [],

//     initialState: {
//       showColumnFilters: true,
//     },

//     //  TABLE CONTAINER STYLE
//     muiTableProps: {
//       sx: {
//         width: '100%',
//         display: 'table',
//       },
//     },

//     // PAPER (outer box)
//     muiTablePaperProps: {
//       sx: {
//         borderRadius: '10px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//       },
//     },

//     //  HEADER STYLE
//     muiTableHeadCellProps: {
//       sx: {
//         fontWeight: 'bold',
//         backgroundColor: '#f5f5f5',
//         color: '#333',
//       },
//     },

//     // CELL STYLE (GRID LIKE LOOK)
//     muiTableBodyCellProps: {
//       sx: {
//         borderBottom: '1px solid #eee',
//         padding: '10px',
//       },
//     },
//   });

//   return <MaterialReactTable table={table} />;
// };

// export default TemplateTable;

import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const TemplateTable = ({ data = [], handleEdit, hasEditAccess }) => {

  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorKey: "templateName",
        header: "Template Name",
      },
    ];

 
    if (hasEditAccess?.("Template")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div
              className="table-text-edit"
              style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
             <i class="bi bi-pencil fs-6"></i>
              <span>Edit</span>
            </div>
          );
        },
      });
    }

    return cols;
  }, [handleEdit, hasEditAccess]);

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

export default TemplateTable;