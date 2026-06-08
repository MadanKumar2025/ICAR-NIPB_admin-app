import React, { useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";
import axios from "axios";
import TemplateTable from "./TemplateTable";
import { usePermissions } from "../User_Management/UserManagement";

function Template() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [template, setTemplate] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [data, setData] = useState({
    templateName: "",
    htmlDescription: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const { hasAddAccess, hasActiveAccess, hasEditAccess } = usePermissions();

  const editor = useRef(null);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      try {
        const response = await axios.put(
          `${API_URL}/templates/update/${editId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setIsEdit(false);
        setData({
          templateName: "",
          htmlDescription: "",
        });
        getTemplate(currentPage);
      } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("SERVER ERROR:", error?.response?.data);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Server error",
        });
      }
    } else {
      try {
        const response = await axios.post(`${API_URL}/templates/create`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setData({
          templateName: "",
          htmlDescription: "",
        });
        getTemplate(currentPage);
      } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("SERVER ERROR:", error?.response?.data);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Server error",
        });
      }
    }
  };

  const getTemplate = async (page = 1) => {
    try {
      const response = await axios.get(
        // `${API_URL}/templates/list?page=${page}`,
        `${API_URL}/templates/list?all=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTemplate(response.data);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.data?.message === "Invalid token") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    getTemplate(currentPage);
  }, []);

  const handleEdit = (template) => {
    setData({
      templateName: template?.templateName,
      htmlDescription: template?.htmlDescription,
    });
    setEditId(template._id);
    setIsEdit(true);
  };

  const config = useMemo(
    () => ({
      readonly: false,
      showPoweredBy: false,
      placeholder: "",
    }),
    [],
  );

  return (
    <>
      <div>
        {hasAddAccess("Template") && (
          <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
            <div className="custom-card card card-info card-outline mb-4">
              <div className="card-header">
                <div className="card-title">Create Template</div>
              </div>

              <form className="needs-validation" onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="validationCustom01"
                        className="form-label"
                      >
                        Template Name
                      </label>
                      <input
                        type="text"
                        name="templateName"
                        value={data?.templateName}
                        className="form-control"
                        id="validationCustom01"
                        onChange={handleChange}
                        required
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div></div>
                    <div>
                      <label className="form-label fw-bold">
                        HTML Description
                      </label>
                      <div className="custom-main-editor">
                        {/* <JoditEditor
                          style={{ width: "90%" }}
                          ref={editor}
                          value={data?.htmlDescription}
                          config={{
                            showPoweredBy: false,
                            placeholder: "",
                            askBeforePasteHTML: false,
                            askBeforePasteFromWord: false,
                          }}
                          onBlur={(newContent) => {
                            setData((prev) => ({
                              ...prev,
                              htmlDescription: newContent,
                            }));
                          }}
                        /> */}
                        <JoditEditor
                          ref={editor}
                          value={data.htmlDescription}
                          config={config}
                          tabIndex={1}
                          onBlur={(newContent) => {
                            setData((prev) => ({
                              ...prev,
                              htmlDescription: newContent,
                            }));
                          }}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button className="btn btn-info" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div
          className="card mb-4 custom-panel-table mt-3"
          style={{ width: "90%", marginLeft: "5%" }}
        >
          <TemplateTable
            data={template?.data || []}
            handleEdit={handleEdit}
            hasEditAccess={hasEditAccess}
          />
        </div>
      </div>
    </>
  );
}

export default Template;
