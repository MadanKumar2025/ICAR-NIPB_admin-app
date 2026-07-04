import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

function Home() {
  const API_URL = process.env.REACT_APP_API_URL;
  const IMG_BASE_URL = process.env.REACT_APP_API_BASE_URL_img;
  const [preview, setPreview] = useState(null);

  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res?.data?.data);
        // Existing photo preview
        if (res?.data?.data.photo) {
          setPreview(`${IMG_BASE_URL}/${res?.data?.data.photo}`);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [API_URL, userId]);
 
  return (
    <>
      {/* <main className="app-main">
        <div className="app-content-header">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-6">
                <h3 className="mb-0">Dashboard v2</h3>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-end">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Dashboard v2
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="app-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 col-sm-6 col-md-3">
                <div className="info-box">
                  <span className="info-box-icon text-bg-primary shadow-sm">
                    <i className="bi bi-gear-fill"></i>
                  </span>

                  <div className="info-box-content">
                    <span className="info-box-text">CPU Traffic</span>
                    <span className="info-box-number">
                      10
                      <small>%</small>
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <div className="info-box">
                  <span className="info-box-icon text-bg-danger shadow-sm">
                    <i className="bi bi-hand-thumbs-up-fill"></i>
                  </span>

                  <div className="info-box-content">
                    <span className="info-box-text">Likes</span>
                    <span className="info-box-number">41,410</span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <div className="info-box">
                  <span className="info-box-icon text-bg-success shadow-sm">
                    <i className="bi bi-cart-fill"></i>
                  </span>

                  <div className="info-box-content">
                    <span className="info-box-text">Sales</span>
                    <span className="info-box-number">760</span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <div className="info-box">
                  <span className="info-box-icon text-bg-warning shadow-sm">
                    <i className="bi bi-people-fill"></i>
                  </span>

                  <div className="info-box-content">
                    <span className="info-box-text">New Members</span>
                    <span className="info-box-number">2,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-8">
                <div className="Card_Latest1">
                  <div className="card" style={{ width: "48%" }}>
                    <div className="card-header">
                      <h3 className="card-title">Latest Orders</h3>

                      <div className="card-tools">
                        <button
                          type="button"
                          className="btn btn-tool"
                          data-lte-toggle="card-collapse"
                        >
                          <i
                            data-lte-icon="expand"
                            className="bi bi-plus-lg"
                          ></i>
                          <i
                            data-lte-icon="collapse"
                            className="bi bi-dash-lg"
                          ></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-tool"
                          data-lte-toggle="card-remove"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table m-0">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Item</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <a
                                  href="pages/examples/invoice.html"
                                  className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >
                                  OR9842
                                </a>
                              </td>
                              <td>Call of Duty IV</td>
                              <td>
                                <span className="badge text-bg-success">
                                  {" "}
                                  Shipped{" "}
                                </span>
                              </td>
                              <td>
                                <div id="table-sparkline-1"></div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <a
                                  href="pages/examples/invoice.html"
                                  className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >
                                  OR1848
                                </a>
                              </td>
                              <td>Samsung Smart TV</td>
                              <td>
                                <span className="badge text-bg-warning">
                                  Pending
                                </span>
                              </td>
                              <td>
                                <div id="table-sparkline-2"></div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <a
                                  href="pages/examples/invoice.html"
                                  className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >
                                  OR7429
                                </a>
                              </td>
                              <td>iPhone 6 Plus</td>
                              <td>
                                <span className="badge text-bg-danger">
                                  {" "}
                                  Delivered{" "}
                                </span>
                              </td>
                              <td>
                                <div id="table-sparkline-3"></div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <a
                                  href="pages/examples/invoice.html"
                                  className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >
                                  OR7429
                                </a>
                              </td>
                              <td>Samsung Smart TV</td>
                              <td>
                                <span className="badge text-bg-info">
                                  Processing
                                </span>
                              </td>
                              <td>
                                <div id="table-sparkline-4"></div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <a
                                  href="pages/examples/invoice.html"
                                  className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >
                                  OR1848
                                </a>
                              </td>
                              <td>Samsung Smart TV</td>
                              <td>
                                <span className="badge text-bg-warning">
                                  Pending
                                </span>
                              </td>
                              <td>
                                <div id="table-sparkline-5"></div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <a
                                  href="pages/examples/invoice.html"
                                  className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >
                                  OR7429
                                </a>
                              </td>
                              <td>iPhone 6 Plus</td>
                              <td>
                                <span className="badge text-bg-danger">
                                  Delivered
                                </span>
                              </td>
                              <td>
                                <div id="table-sparkline-6"></div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="card-footer clearfix">
                      <a
                        href="javascript:void(0)"
                        className="btn btn-sm btn-primary float-start"
                      >
                        Place New Order
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="btn btn-sm btn-secondary float-end"
                      >
                        View All Orders
                      </a>
                    </div>
                  </div>
                  <div className="card" style={{ width: "48%" }}>
                    <div className="card-header">
                      <h3 className="card-title">Latest Orders</h3>

                      <div className="card-tools">
                        <button
                          type="button"
                          className="btn btn-tool"
                          data-lte-toggle="card-collapse"
                        >
                          <i
                            data-lte-icon="expand"
                            className="bi bi-plus-lg"
                          ></i>
                          <i
                            data-lte-icon="collapse"
                            className="bi bi-dash-lg"
                          ></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-tool"
                          data-lte-toggle="card-remove"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table m-0">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Item</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <a
                                  href="pages/examples/invoice.html"
                                  className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >
                                  OR9842
                                </a>
                              </td>
                              <td>Call of Duty IV</td>
                              <td>
                                <span className="badge text-bg-success">
                                  {" "}
                                  Shipped{" "}
                                </span>
                              </td>
                              <td>
                                <div id="table-sparkline-1"></div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <a
                                  href="pages/examples/invoice.html"
                                  className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >
                                  OR1848
                                </a>
                              </td>
                              <td>Samsung Smart TV</td>
                              <td>
                                <span className="badge text-bg-warning">
                                  Pending
                                </span>
                              </td>
                              <td>
                                <div id="table-sparkline-2"></div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <a
                                  href="pages/examples/invoice.html"
                                  className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >
                                  OR7429
                                </a>
                              </td>
                              <td>iPhone 6 Plus</td>
                              <td>
                                <span className="badge text-bg-danger">
                                  {" "}
                                  Delivered{" "}
                                </span>
                              </td>
                              <td>
                                <div id="table-sparkline-3"></div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <a
                                  href="pages/examples/invoice.html"
                                  className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >
                                  OR7429
                                </a>
                              </td>
                              <td>Samsung Smart TV</td>
                              <td>
                                <span className="badge text-bg-info">
                                  Processing
                                </span>
                              </td>
                              <td>
                                <div id="table-sparkline-4"></div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <a
                                  href="pages/examples/invoice.html"
                                  className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >
                                  OR1848
                                </a>
                              </td>
                              <td>Samsung Smart TV</td>
                              <td>
                                <span className="badge text-bg-warning">
                                  Pending
                                </span>
                              </td>
                              <td>
                                <div id="table-sparkline-5"></div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <a
                                  href="pages/examples/invoice.html"
                                  className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >
                                  OR7429
                                </a>
                              </td>
                              <td>iPhone 6 Plus</td>
                              <td>
                                <span className="badge text-bg-danger">
                                  Delivered
                                </span>
                              </td>
                              <td>
                                <div id="table-sparkline-6"></div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="card-footer clearfix">
                      <a
                        href="javascript:void(0)"
                        className="btn btn-sm btn-primary float-start"
                      >
                        Place New Order
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="btn btn-sm btn-secondary float-end"
                      >
                        View All Orders
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="card"
                  style={{ width: "100%", marginTop: "3vh" }}
                >
                  <div className="card-header">
                    <h3 className="card-title">Latest Orders</h3>

                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-lte-toggle="card-collapse"
                      >
                        <i data-lte-icon="expand" className="bi bi-plus-lg"></i>
                        <i
                          data-lte-icon="collapse"
                          className="bi bi-dash-lg"
                        ></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-lte-toggle="card-remove"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table m-0">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Item</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <a
                                href="pages/examples/invoice.html"
                                className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                              >
                                OR9842
                              </a>
                            </td>
                            <td>Call of Duty IV</td>
                            <td>
                              <span className="badge text-bg-success">
                                {" "}
                                Shipped{" "}
                              </span>
                            </td>
                            <td>
                              <div id="table-sparkline-1"></div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                href="pages/examples/invoice.html"
                                className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                              >
                                OR1848
                              </a>
                            </td>
                            <td>Samsung Smart TV</td>
                            <td>
                              <span className="badge text-bg-warning">
                                Pending
                              </span>
                            </td>
                            <td>
                              <div id="table-sparkline-2"></div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                href="pages/examples/invoice.html"
                                className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                              >
                                OR7429
                              </a>
                            </td>
                            <td>iPhone 6 Plus</td>
                            <td>
                              <span className="badge text-bg-danger">
                                {" "}
                                Delivered{" "}
                              </span>
                            </td>
                            <td>
                              <div id="table-sparkline-3"></div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                href="pages/examples/invoice.html"
                                className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                              >
                                OR7429
                              </a>
                            </td>
                            <td>Samsung Smart TV</td>
                            <td>
                              <span className="badge text-bg-info">
                                Processing
                              </span>
                            </td>
                            <td>
                              <div id="table-sparkline-4"></div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                href="pages/examples/invoice.html"
                                className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                              >
                                OR1848
                              </a>
                            </td>
                            <td>Samsung Smart TV</td>
                            <td>
                              <span className="badge text-bg-warning">
                                Pending
                              </span>
                            </td>
                            <td>
                              <div id="table-sparkline-5"></div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                href="pages/examples/invoice.html"
                                className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                              >
                                OR7429
                              </a>
                            </td>
                            <td>iPhone 6 Plus</td>
                            <td>
                              <span className="badge text-bg-danger">
                                Delivered
                              </span>
                            </td>
                            <td>
                              <div id="table-sparkline-6"></div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="card-footer clearfix">
                    <a
                      href="javascript:void(0)"
                      className="btn btn-sm btn-primary float-start"
                    >
                      Place New Order
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="btn btn-sm btn-secondary float-end"
                    >
                      View All Orders
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="info-box mb-3 text-bg-warning">
                  <span className="info-box-icon">
                    <i className="bi bi-tag-fill"></i>
                  </span>

                  <div className="info-box-content">
                    <span className="info-box-text">Inventory</span>
                    <span className="info-box-number">5,200</span>
                  </div>
                </div>
                <div className="info-box mb-3 text-bg-success">
                  <span className="info-box-icon">
                    <i className="bi bi-heart-fill"></i>
                  </span>

                  <div className="info-box-content">
                    <span className="info-box-text">Mentions</span>
                    <span className="info-box-number">92,050</span>
                  </div>
                </div>
                <div className="info-box mb-3 text-bg-danger">
                  <span className="info-box-icon">
                    <i className="bi bi-cloud-download"></i>
                  </span>

                  <div className="info-box-content">
                    <span className="info-box-text">Downloads</span>
                    <span className="info-box-number">114,381</span>
                  </div>
                </div>
                <div className="info-box mb-3 text-bg-info">
                  <span className="info-box-icon">
                    <i className="bi bi-chat-fill"></i>
                  </span>

                  <div className="info-box-content">
                    <span className="info-box-text">Direct Messages</span>
                    <span className="info-box-number">163,921</span>
                  </div>
                </div>
                <div className="card mb-4">
                  <div className="card-header">
                    <h3 className="card-title">Browser Usage</h3>

                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-lte-toggle="card-collapse"
                      >
                        <i data-lte-icon="expand" className="bi bi-plus-lg"></i>
                        <i
                          data-lte-icon="collapse"
                          className="bi bi-dash-lg"
                        ></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-lte-toggle="card-remove"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <div id="pie-chart"></div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer p-0">
                    <ul className="nav nav-pills flex-column">
                      <li className="nav-item">
                        <a href="#" className="nav-link">
                          United States of America
                          <span className="float-end text-danger">
                            <i className="bi bi-arrow-down fs-7"></i>
                            12%
                          </span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="#" className="nav-link">
                          India
                          <span className="float-end text-success">
                            <i className="bi bi-arrow-up fs-7"></i> 4%
                          </span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="#" className="nav-link">
                          China
                          <span className="float-end text-info">
                            <i className="bi bi-arrow-left fs-7"></i> 0%
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main> */}
      {/* <div className="container py-5 w-50 ">
        <div
          className="border border-3 rounded p-4 mx-auto"
          style={{ maxwidth: "500px" }}
        >
           <div className="d-flex justify-content-center mb-4">
            <div
              className="  border-2 rounded d-flex align-items-center justify-content-center"
              style={{ width: "120px", height: "100px" }}
            >
              <img
                className="w-100"
                src={`${process.env.REACT_APP_API_BASE_URL_img}/${data?.photo}`}
                alt={data?.imageTitle}
              />
            </div>
          </div>

           <div
            className="border border-2 rounded mb-4 test-center"
            style={{ height: "120px" }}
          >
            <p>Name :- {data?.name}</p>
            <p>Mobile No. :- {data?.mobileNo}</p>
            <p>Email :- {data?.email}</p>
          </div>

           <div
            className="border border-2 rounded d-flex align-items-center justify-content-center"
            style={{ height: "100px" }}
          >
            Section 2
          </div>
        </div>
      </div> */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4">
              {/* Header */}
              <div className="bg-dark text-white rounded-top-4 text-center py-4 rounded-top-4 text-center py-4">
                <div
                  className="mx-auto rounded-circle overflow-hidden border border-4 border-white bg-white"
                  style={{ width: "120px", height: "120px" }}
                >
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL_img}/${data?.photo}`}
                    alt={data?.imageTitle}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>

                <h4 className="text-white mt-3 mb-0">{data?.name}</h4>

                <small className="text-white-50">Profile Information</small>
              </div>

              {/* Body */}
              <div className="card-body p-4">
                <div className="border rounded-3 p-3 mb-3">
                  <div className="d-flex justify-content-between">
                    <strong>📱 Mobile :- </strong>
                    <span>{data?.mobileNo}</span>
                  </div>
                </div>

                <div className="border rounded-3 p-3 mb-3">
                  <div className="d-flex justify-content-between">
                    <strong>📧 Email</strong>
                    <span>{data?.email}</span>
                  </div>
                </div>

                <div className="border rounded-3 p-3">
                  <div className="d-flex justify-content-between">
                    <strong>👤 Name</strong>
                    <span>{data?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
