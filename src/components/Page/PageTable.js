// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";
// import { useNavigate } from "react-router-dom";

// const PageTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   template,
//   hasEditAccess,
//   hasActiveAccess,
// }) => {
//   const navigate = useNavigate();
//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorFn: (row) => row.pageTitle?.en || "-",
//         header: "Page Title",
//       },
//       {
//         accessorFn: (row) => {
//           const templateId = row.designTemplate?._id;
//           const matchedTemplate = template?.find((t) => t._id === templateId);

//           return matchedTemplate?.templateName || "-";
//         },
//         header: "Design Template",
//       },

//       {
//         accessorKey: "isActive",
//         header: "Status",
//         Cell: ({ row }) => {
//           const item = row.original;

//           return (
//             <div className="form-check form-switch">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={Boolean(item?.isActive)}
//                 onChange={() => handleToggle?.(item)}
//               />
//               {/* <label className="form-check-label">
//                 {item?.isActive ? "Active" : "Inactive"}
//               </label> */}
//             </div>
//           );
//         },
//       },

//       {
//         header: "Action",
//         Cell: ({ row }) => {
//           const item = row.original;
//           const templateId = item.designTemplate?._id;

//           const isStaticTemplate = template?.some(
//             (t) => t._id === templateId && t.templateName === "Static",
//           );

//           return (
//             <div style={{ display: "flex", gap: "10px", cursor: "pointer" }}>
//               <span onClick={() => handleEdit?.(item)}>
//                 <i className="bi bi-pencil fs-4"></i>
//               </span>

//               {isStaticTemplate && (
//                 <span onClick={() => navigate(`/content/${item._id}`)}>
//                   <i className="bi bi-file-earmark-plus fs-4"></i>
//                 </span>
//               )}
//             </div>
//           );
//         },
//       },
//     ],
//     [handleToggle, navigate, handleEdit],
//   );

//   const table = useMaterialReactTable({
//     columns,
//     data: data || [],
//     initialState: {
//       showColumnFilters: true,
//     },
//   });

//   return <MaterialReactTable table={table} />;
// };

// export default PageTable;

import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { useNavigate } from "react-router-dom";

const PageTable = ({
  data = [],
  handleToggle,
  handleEdit,
  template,
  hasEditAccess,
  hasActiveAccess,
}) => {
  const navigate = useNavigate();

  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },

      {
        accessorFn: (row) => row.pageTitle?.en || "-",
        header: "Page Title",
      },
      {
        accessorFn: (row) => row.apiName || "-",
        header: "Api Name",
      },

      {
        accessorFn: (row) => {
          const templateId = row.designTemplate?._id;

          const matchedTemplate = template?.find(
            (t) => t._id === templateId
          );

          return matchedTemplate?.templateName || "-";
        },
        header: "Design Template",
      },
    ];

    // =========================
    // ACTIVE STATUS (PERMISSION BASED)
    // =========================
    if (hasActiveAccess?.("Page")) {
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
 
    // ACTION COLUMN (EDIT + CONTENT)
   
    if (hasEditAccess?.("Page")) {
      cols.push({
        header: "Action",
        Cell: ({ row }) => {
          const item = row.original;

          const templateId = item.designTemplate?._id;

          const isStaticTemplate = template?.some(
            (t) =>
              t._id === templateId &&
              t.templateName === "Static"
          );

          return (
            <div
              style={{
                display: "flex",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              {/* EDIT BUTTON */}
              <span onClick={() => handleEdit?.(item)}>
                <i className="bi bi-pencil fs-4"></i>
              </span>

              {/* CONTENT BUTTON (ONLY STATIC TEMPLATE) */}
              {isStaticTemplate && (
                <span onClick={() => navigate(`/content/${item._id}`)}>
                  <i className="bi bi-file-earmark-plus fs-4"></i>
                </span>
              )}
            </div>
          );
        },
      });
    }

    return cols;
  }, [
    data,
    template,
    handleToggle,
    handleEdit,
    hasEditAccess,
    hasActiveAccess,
    navigate,
  ]);

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    initialState: {
      showColumnFilters: true,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default PageTable;