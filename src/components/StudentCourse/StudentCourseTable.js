import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

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
  hasAddAccess,
  hasDeleteAccess,
  handleDelete,
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
              {/* <label className="form-check-label">
                {item?.isActive ? "Active" : "Inactive"}
              </label> */}
            </div>
          );
        },
      });
    }

    // ACTION COLUMN (EDIT ACCESS)

    // if (hasEditAccess?.("Student Course")) {
    //   cols.push({
    //     header: "Action",
    //     size: 40,
    //     minSize: 30,
    //     maxSize: 70,
    //     Cell: ({ row }) => {
    //       const item = row.original;

    //       return (
    //         <div
    //           className="table-icon-edit"
    //           // style={{ cursor: "pointer" }}
    //           onClick={() => handleEdit?.(item)}
    //         >
    //           <i class="bi bi-pencil fs-5"></i>
    //         </div>
    //       );
    //     },
    //   });
    // }

    if (
      hasEditAccess?.("Student Course") ||
      hasDeleteAccess?.("Student Course")
    ) {
      cols.push({
        header: "Action",
        size: 70,
        minSize: 50,
        maxSize: 100,

        Cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="d-flex align-items-center gap-3">
              {hasEditAccess?.("Student Course") && (
                <div
                  className="table-icon-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit?.(item)}
                >
                  <i className="bi bi-pencil fs-5"></i>
                </div>
              )}

              {hasDeleteAccess?.("Student Course") && (
                <span
                  className="trash-icon"
                  style={{
                    cursor: "pointer",
                    color: "red",
                  }}
                  onClick={() => handleDelete?.(item)}
                >
                  <i className="bi bi-trash fs-5"></i>
                </span>
              )}
            </div>
          );
        },
      });
    }
    // STUDENT ACTION (ALWAYS AVAILABLE OR CAN BE CONTROLLED LATER)

    if (hasEditAccess?.("Student Course") || hasAddAccess?.("Student Course")) {
      cols.push({
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
      });
    }

    return cols;
  }, [
    handleToggle,
    handleEdit,
    setStudentInCourse,
    handleOpen,
    hasActiveAccess,
    hasAddAccess,
    hasEditAccess,
    hasDeleteAccess
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
