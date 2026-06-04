import axios from "axios";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const MenuForm = ({
  data,
  isEdit,
  editId,
  setIsEdit,
  setData,
  setIsPage,
  getmenu,
  setError,
  menu,
  isPage,
  pages,
  error,
  handleChange,
  handleClose,
}) => {
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const API_URL = process.env.REACT_APP_API_URL;

  const location = useLocation();
  const token = localStorage.getItem("token");
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      try {
        const payload = {
          menuType: data?.menuType,
          menuCategory: data?.menuCategory,
          parentMenuId: data?.parentMenuId || null,
          menuName_en: data?.menuName_en || "",
          menuName_hi: data?.menuName_hi || "",
          pageId: data?.pageId || null,
          customUrl: data?.customUrl || null,
          order: Number(data?.order) || 0,
          isActive: data?.isActive,
        };

        const res = await axios.put(
          `${API_URL}/menu/update/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setIsEdit(false);

        setData({
          menuType: "",
          menuCategory: "",
          parentMenuId: "",
          menuName_en: "",
          menuName_hi: "",
          pageId: "",
          customUrl: "",
          order: "",
          isActive: true,
        });

        setIsPage("");

        await getmenu();
        handleClose();
      } catch (error) {
        console.error("Update failed:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error || "Server error",
        });
      }
    } else {
      try {
        const response = await axios.post(`${API_URL}/menu/createmenu`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData({
          menuType: "",
          menuCategory: "",
          parentMenuId: "",
          menuName_en: "",
          menuName_hi: "",
          pageId: "",
          customUrl: "",
          order: "",
          isActive: true,
        });
        setIsPage("");
        await getmenu();
        handleClose();
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

  return (
    <>
      <div style={{ width: "90%", marginLeft: "5%", marginTop: "3vh" }}>
        <div className="card card-info card-outline mb-4">
          <div className="card-header">
            <div className="card-title">Create Menu</div>
          </div>

          <form
            className="needs-validation"
            //   ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="validationCustom01" className="form-label">
                    Menu Category
                  </label>
                  <select
                    name="menuCategory"
                    className="form-control"
                    value={data?.menuCategory}
                    onChange={handleChange}
                  >
                    <option>select</option>
                    <option value="header">Header</option>
                    <option value="footer">Footer</option>
                  </select>
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="validationCustom01" className="form-label">
                    Menu Type
                  </label>
                  <select
                    name="menuType"
                    className="form-control"
                    value={data?.menuType}
                    onChange={handleChange}
                    // disabled={data?.menuCategory === "footer"}
                  >
                    <option>select</option>
                    <option value="parent">Parent Menu</option>
                    <option value="child">Child Menu</option>
                  </select>
                  <div className="valid-feedback">Looks good!</div>
                </div>
                {data?.menuType === "child" && (
                  <div className="col-md-6">
                    <label htmlFor="validationCustom02" className="form-label">
                      Parent Menu
                    </label>
                    <select
                      name="parentMenuId"
                      className="form-control"
                      value={String(data?.parentMenuId || "")}
                      onChange={handleChange}
                    >
                      <option>select</option>
                      {menu?.data
                        ?.filter(
                          (item) =>
                            item?.isActive === true &&
                            item?.menuType === "parent" &&
                            item?.menuCategory === data?.menuCategory,
                        )
                        .map((item, index) => {
                          console.log("Menu Item:", item);
                          return (
                            <option key={index} value={String(item?.id)}>
                              {item?.menuName_en}
                            </option>
                          );
                        })}
                      ;
                    </select>
                  </div>
                )}

                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Menu Name (English)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="menuName_en"
                      value={data?.menuName_en}
                      onChange={handleChange}
                      className="form-control"
                      id="validationCustomUsername"
                      aria-describedby="inputGroupPrepend"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="validationCustomUsername"
                    className="form-label"
                  >
                    Menu Name (Hindi)
                  </label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      name="menuName_hi"
                      value={data?.menuName_hi}
                      onChange={handleChange}
                      className="form-control"
                      id="validationCustomUsername"
                      aria-describedby="inputGroupPrepend"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="validationCustom03" className="form-label">
                    Is Page
                  </label>
                  <select
                    name="isPage"
                    value={isPage}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustom03"
                  >
                    <option value="">select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <div className="invalid-feedback">
                    Please provide a Is page.
                  </div>
                </div>

                {isPage === "yes" && (
                  <div className="col-md-6">
                    <label htmlFor="validationCustom03" className="form-label">
                      Page Name
                    </label>
                    <select
                      name="pageId"
                      className="form-control"
                      value={data?.pageId}
                      onChange={handleChange}
                      id="validationCustom03"
                    >
                      <option>select</option>
                      {pages?.data?.map((item, index) => {
                        return (
                          <option key={index} value={item?._id}>
                            {item?.pageTitle?.en}
                          </option>
                        );
                      })}
                    </select>
                    <div className="invalid-feedback">
                      Please provide a Page Name.
                    </div>
                  </div>
                )}
                {isPage === "no" && (
                  <div className="col-md-6">
                    <label htmlFor="validationCustom03" className="form-label">
                      Coustom Url (Link)
                    </label>
                    <input
                      type="url"
                      name="customUrl"
                      value={data?.customUrl}
                      onChange={handleChange}
                      className={`form-control ${error.customUrl ? "is-invalid" : ""}`}
                      id="validationCustom03"
                    />
                    {error.customUrl && (
                      <div className="invalid-feedback">{error.customUrl}</div>
                    )}
                    <div className="invalid-feedback">
                      Please provide a Coustom Url (Link).
                    </div>
                  </div>
                )}

                <div className="col-md-6">
                  <label className="form-label">Order</label>
                  {/* <select
                      name="order"
                      value={data?.order}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value={""}>select</option>
                      <option value={"1"}>1</option>
                      <option value={"2"}>2</option>
                    </select> */}

                  <input
                    type="number"
                    name="order"
                    value={data?.order}
                    onChange={handleChange}
                    className="form-control"
                    id="validationCustomUsername"
                    aria-describedby="inputGroupPrepend"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Is Active</label>
                  <select
                    name="isActive"
                    value={data?.isActive}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div className="card-footer">
                <button className="btn btn-info" type="submit">
                  {/* {isEdit ? "Update User" : "Submit form"} */}
                  {/* {isEdit ? "Update" : "Save"} */}
                  Save
                </button>
              </div>
              <div className="card-footer">
                <button className="btn btn-info" onClick={handleClose}>
                  Close
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default MenuForm;
