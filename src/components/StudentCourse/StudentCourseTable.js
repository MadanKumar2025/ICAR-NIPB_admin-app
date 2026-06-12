// import React, { useMemo } from "react";
// import { MaterialReactTable } from "material-react-table";
// import { useMaterialReactTable } from "material-react-table";

// const StudentCourseTable = ({
//   data = [],
//   handleToggle,
//   handleEdit,
//   pagination,
//   setPagination,
//   setStudentInCourse,
//   handleOpen,
//   hasActiveAccess,
//   hasEditAccess
// }) => {
//   //  Columns
//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         Cell: ({ row }) => row.index + 1,
//         size: 50,
//       },
//       {
//         accessorFn: (row) => row?.courseName?.en || "-",
//         header: "Course Name",
//       },
//       {
//         accessorFn: (row) => row?.semester?.en || "-",
//         header: "Semester",
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
//                 onChange={() => handleToggle && handleToggle(item)}
//               />
//               <label className="form-check-label">
//                 {item?.isActive ? "Active" : "Inactive"}
//               </label>
//             </div>
//           );
//         },
//       },
//       // Action Column
//       {
//         header: "Action",
//         Cell: ({ row }) => {
//           const item = row.original;

//           return (
//             <span
//               className="badge text-bg-danger"
//               style={{ cursor: "pointer" }}
//               onClick={() => handleEdit?.(item)}
//             >
//               Edit
//             </span>
//           );
//         },
//       },
//       {
//         header: "Student",
//         Cell: ({ row }) => {
//           const item = row.original;
//           return (
//             <div className="col-md-6">
//               <div
//                 className=" btn btn-info"
//                 style={{ marginTop: "20px" }}
//                 onClick={() => {
//                   setStudentInCourse(item?._id);
//                   handleOpen();
//                 }}
//               >
//                 Add Student
//               </div>
//             </div>
//           );
//         },
//       },
//     ],
//     [handleToggle, handleEdit],
//   );

//   //  Table Instance
//   const table = useMaterialReactTable({
//     columns,
//     data: data || [],
//     state: {
//       pagination,
//     },
//     onPaginationChange: setPagination,

//     autoResetPageIndex: false,
//     initialState: {
//       showColumnFilters: true,
//     },
//   });

//   return <MaterialReactTable table={table} />;
// };

// export default StudentCourseTable;

import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const StudentCourseTable = ({
  data = [],
  handleToggle,
  handleEdit,
  pagination,
  setPagination,
  setStudentInCourse,
  handleOpen,
  hasActiveAccess,
  hasEditAccess,
  hasAddAccess
}) => {

  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorFn: (row) => row?.courseName?.en || "-",
        header: "Course Name",
      },
      {
        accessorFn: (row) => row?.semester?.en || "-",
        header: "Semester",
      },
    ];
 
    // STATUS COLUMN (ACTIVE ACCESS)
  
    if (hasActiveAccess?.("Student Course")) {
      cols.push({
     
        header: "Status", size: 40,
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
              {/* <label className="form-check-label">
                {item?.isActive ? "Active" : "Inactive"}
              </label> */}
            </div>
          );
        },
      });
    }

 
    // ACTION COLUMN (EDIT ACCESS)
 
    if (hasEditAccess?.("Student Course")) {
      cols.push({
        header: "Action", size: 40,
        minSize: 30,
        maxSize: 70,
        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div
              className="table-icon-edit"
              // style={{ cursor: "pointer" }}
              onClick={() => handleEdit?.(item)}
            >
            <i class="bi bi-pencil fs-5"></i>
            </div>
          );
        },
      });
    }

  
    // STUDENT ACTION (ALWAYS AVAILABLE OR CAN BE CONTROLLED LATER)
 
   if (hasEditAccess?.("Student Course") || hasAddAccess?.("Student Course")) {  cols.push({
      header: "Student",
      Cell: ({ row }) => {
        const item = row.original;

        return (
          <div
            className="btn btn-info nowrap-btn"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setStudentInCourse?.(item?._id);
              handleOpen?.();
            }}
          >
            Add Student
          </div>
        );
      },
    });}

    return cols;
  }, [
    handleToggle,
    handleEdit,
    setStudentInCourse,
    handleOpen,
    hasActiveAccess,
    hasAddAccess,
    hasEditAccess,
  ]);

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

export default StudentCourseTable;