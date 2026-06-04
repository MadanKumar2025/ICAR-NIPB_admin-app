import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";

function ApiFunctionMappingWebForm({
  data,
  setData,
  isEdit,
  editId,
  getApiFunctionMappingWeb,
  setApiFunctionMappingWeb,
  handleClose,
}) {
  const API_URL = process.env.REACT_APP_API_URL;

  const formRef = useRef();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, type, files } = e.target;

    if (type === "file" && files.length > 0) {
      const file = files[0];

      setData((prev) => ({
        ...prev,
        [name]: file,
      }));

      const fileURL = URL.createObjectURL(file);
    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      //   try {
      //     const formData = new FormData();
      //     formData.append("photoTitle", data?.photoTitle || "");
      //     formData.append("relatedLink", data?.relatedLink || "");
      //     formData.append("isActive", data?.isActive);
      //     if (data?.photo) {
      //       formData.append("photo", data?.photo);
      //     }
      //     const res = await axios.put(
      //       `${API_URL}/AssociatedOrganizationRoutes/update/${editId}`,
      //       formData,
      //       {
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //           "Content-Type": "multipart/form-data",
      //         },
      //       },
      //     );
      //     setPreview(null);
      //     formRef.current.reset();
      //     await getApiFunctionMappingWeb();
      //     handleClose();
      //   } catch (error) {
      //     Swal.fire({
      //       icon: "error",
      //       title: "Error",
      //       text: error?.response?.data?.message || "Update failed",
      //     });
      //   }
    } else {
      try {
        const response = await axios.post(
          `${API_URL}/ApiFunctionMappingRoutes/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        Swal.fire({
          icon: "success",
          title: "Api Function Mapping Web",
          text:
            response.data.message || "Api Function Mapping Web Successfully.",
          confirmButtonColor: "#3085d6",
        });

        setApiFunctionMappingWeb(response?.data?.data);
        await getApiFunctionMappingWeb();
        handleClose();

      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Server error",
        });
      }
    }
  };

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="custom-card card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Api Function Mapping Web</div>
          </div>

          <form
            className="needs-validation"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="validationCustom02" className="form-label">
                    Functionality Name
                  </label>
                  <input
                    type="text"
                    name="functionalityName"
                    value={data?.functionalityName}
                    onChange={handleChange}
                    className="form-control"
                    id="functionalityName"
                  />
                </div>

                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Api Url
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="apiName"
                      value={data?.apiName}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
              <div className="card-footer d-flex">
                <button className="btn btn-info" type="submit">
                  Save
                </button>
                <button className="btn btn-info ms-auto" onClick={handleClose}>
                  Close
                </button>
              </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ApiFunctionMappingWebForm;
