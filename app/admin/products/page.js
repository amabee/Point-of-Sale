"use client";
import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../../../public/styles/admin/assets/vendor/fonts/boxicons.css";
import "../../../public/styles/admin/assets/vendor/css/core.css";
import "../../../public/styles/admin/assets/vendor/css/theme-default.css";
import "../../../public/styles/admin/assets/css/demo.css";
import "../../../public/styles/admin/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css";
import "../../../public/styles/admin/assets/vendor/libs/apex-charts/apex-charts.css";
import "../../../public/styles/admin/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css";
import PerfectScrollbar from "perfect-scrollbar";
import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { ADMIN_ENDPOINT } from "@/app/globals";
import axios from "axios";
import UpdateModal from "./modals/updateProductModal.js";

const Products = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [barcode, setBarCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0.0);
  const [stock, setStock] = useState(0);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowUpdateModal = () => setShowUpdateModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const router = useRouter();

  const handleOpenModal = (product) => {
    setProduct(product);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    const getAllItems = async () => {
      try {
        const res = await axios.get(ADMIN_ENDPOINT, {
          params: {
            operation: "getAllItem",
            json: "",
          },
        });

        if (res.status == 200) {
          if (res.data && res.data !== null) {
            console.log(res.data);
            setProducts(res.data);
          } else {
            console.log("Can't retrieve Products: " + res.data);
          }
        }
      } catch (error) {
        Swal.fire(
          "Exception Error",
          "Something went wrong retrieving the items " + error,
          "error"
        );
      }
    };

    getAllItems();
  }, []);

  useEffect(() => {
    const checkUserLogin = () => {
      const userLoggedIn = JSON.parse(sessionStorage.getItem("user"));

      if (userLoggedIn) {
        setLoggedInUser(userLoggedIn);
      } else {
        router.push("/");
      }
    };

    checkUserLogin();
  }, [router]);

  const insertProduct = async () => {
    const formData = new FormData();
    formData.append("operation", "insertProduct");
    formData.append(
      "json",
      JSON.stringify({
        barcode: barcode,
        name: name,
        price: price,
        stock: stock,
      })
    );
    try {
      const res = await axios({
        url: ADMIN_ENDPOINT,
        method: "POST",
        data: formData,
      });

      if (res.status === 200) {
        if (res.data !== null && res.data.success) {
          setBarCode("");
          setName("");
          setPrice(0.0);
          setStock(0);
          handleCloseModal();
          Swal.fire("Success", res.data.success, "success");
        } else {
          Swal.fire("Error", res.data.error, "error");
        }
      } else {
        Swal.fire("Something went wrong ", res.status, "error");
      }
    } catch (error) {
      Swal.fire("Exception Error", error, "error");
    }
  };

  const removeProduct = async (barcode) => {
    const formData = new FormData();
    formData.append("operation", "deleteProduct");
    formData.append("json", JSON.stringify({ barcode: barcode }));
    try {
      const res = await axios({
        url: ADMIN_ENDPOINT,
        method: "POST",
        data: formData,
      });

      if (res.status === 200) {
        if (res.data !== null && res.data.success) {
          Swal.fire("Success", res.data.success, "success");
        } else {
          Swal.fire("Error", res.data.error, "error");
        }
      } else {
        Swal.fire("Status Error", res.data.error, "error");
      }
    } catch (error) {
      Swal.fire("Exception Error", res.data.error, "error");
    }
  };

  const updateProduct = async () => {
    const updateFormData = new FormData();
    updateFormData.append("operation", "updateProduct");
    updateFormData.append(
      "json",
      JSON.stringify({
        barcode: barcode,
        name: name,
        price: price,
        stock: stock,
      })
    );

    const res = await axios({
      url: ADMIN_ENDPOINT,
      method: "POST",
      data: updateFormData,
    });

    if (res.status === 200) {
      if (res.data !== null && res.data.success) {
        Swal.fire("Success", res.data.success, "success");
      } else {
        Swal.fire("Error", res.data.error, "error");
      }
    } else {
      Swal.fire("Exception Error", res.data.error, "error");
    }
  };

  if (!loggedInUser) {
    return null;
  }
  return (
    <body>
      <Script src="/styles/admin/assets/vendor/js/helpers.js"></Script>
      <Script src="/styles/admin/assets/js/config.js"></Script>
      {/* CORE JS WTF! */}
      <Script src="/styles/admin/assets/vendor/libs/jquery/jquery.js"></Script>
      <Script src="/styles/admin/assets/vendor/libs/popper/popper.js"></Script>
      <Script src="/styles/admin/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></Script>
      <Script src="/styles/admin/assets/vendor/js/menu.js"></Script>
      <Script src="/styles/admin/assets/vendor/js/bootstrap.js"></Script>

      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <aside
            id="layout-menu"
            className="layout-menu menu-vertical menu bg-menu-theme"
          >
            <div className="app-brand demo">
              <a href="index.html" className="app-brand-link">
                <span className="app-brand-logo demo"></span>
                <span className="app-brand-text demo menu-text fw-bold ms-2">
                  galleria
                </span>
              </a>

              <a
                href="javascript:void(0);"
                className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none"
              >
                <i className="bx bx-chevron-left bx-sm d-flex align-items-center justify-content-center"></i>
              </a>
            </div>

            <div className="menu-inner-shadow"></div>

            <ul className="menu-inner py-1">
              {/* <!-- Dashboards --> */}
              <li className="menu-item active open">
                <a href="javascript:void(0);" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons bx bx-home-smile"></i>
                  <div className="text-truncate" data-i18n="Dashboards">
                    Dashboards
                  </div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item ">
                    <Link href="/admin" className="menu-link" passHref>
                      <div className="text-truncate" data-i18n="Analytics">
                        Sales Analytics
                      </div>
                    </Link>
                  </li>

                  <li className="menu-item active">
                    <Link href="#" className="menu-link" passHref>
                      <div className="text-truncate" data-i18n="Analytics">
                        Products
                      </div>
                    </Link>
                  </li>

                  <li className="menu-item">
                    <a
                      href="app-academy-dashboard.html"
                      target="_blank"
                      className="menu-link"
                    >
                      <div className="text-truncate" data-i18n="Academy">
                        Cashiers
                      </div>
                      {/* <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                        Pro
                      </div> */}
                    </a>
                  </li>
                </ul>
              </li>

              {/* <!-- Apps & Pages --> */}
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">Settings</span>
              </li>

              {/* <!-- Pages --> */}
              <li className="menu-item">
                <a href="javascript:void(0);" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons bx bx-dock-top"></i>
                  <div className="text-truncate" data-i18n="Account Settings">
                    Account Settings
                  </div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a
                      href="pages-account-settings-account.html"
                      className="menu-link"
                    >
                      <div className="text-truncate" data-i18n="Account">
                        Account
                      </div>
                    </a>
                  </li>
                </ul>
              </li>

              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">Misc</span>
              </li>
              <li className="menu-item">
                <a href="javascript:void(0);" className="menu-link ">
                  <i className="menu-icon tf-icons bx bx-exit"></i>
                  <div className="text-truncate">Logout</div>
                </a>
              </li>
            </ul>
          </aside>

          <div className="layout-page">
            {/* <!-- Navbar --> */}

            <nav
              className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
              id="layout-navbar"
            >
              <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
                <a
                  className="nav-item nav-link px-0 me-xl-6"
                  href="javascript:void(0)"
                >
                  <i className="bx bx-menu bx-md"></i>
                </a>
              </div>

              <div
                className="navbar-nav-right d-flex align-items-center"
                id="navbar-collapse"
              >
                {/* <!-- Search --> */}
                <div className="navbar-nav align-items-center">
                  <div className="nav-item d-flex align-items-center">
                    <i className="bx bx-search bx-md"></i>
                    <input
                      type="text"
                      className="form-control border-0 shadow-none ps-1 ps-sm-2"
                      placeholder="Search..."
                      aria-label="Search..."
                    />
                  </div>
                </div>
                {/* <!-- /Search --> */}

                <ul className="navbar-nav flex-row align-items-center ms-auto">
                  {/* <!-- Place this tag where you want the button to render. --> */}

                  {/* <!-- User --> */}
                  <li className="nav-item navbar-dropdown dropdown-user dropdown">
                    <a
                      className="nav-link dropdown-toggle hide-arrow p-0"
                      href="javascript:void(0);"
                      data-bs-toggle="dropdown"
                    >
                      {loggedInUser ? (
                        <div className="avatar avatar-online">
                          <img
                            src={
                              "https://localhost/pos_api" + loggedInUser.image
                            }
                            alt
                            className="w-px-40 h-auto rounded-circle"
                          />
                        </div>
                      ) : (
                        <div className="avatar avatar-online">
                          <img
                            src=""
                            alt="?"
                            className="w-px-40 h-auto rounded-circle"
                          />
                        </div>
                      )}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <a className="dropdown-item" href="#">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar avatar-online">
                                <img
                                  src="../assets/img/avatars/1.png"
                                  alt
                                  className="w-px-40 h-auto rounded-circle"
                                />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0">John Doe</h6>
                              <small className="text-muted">Admin</small>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <div className="dropdown-divider my-1"></div>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bx bx-user bx-md me-3"></i>
                          <span>My Profile</span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          {" "}
                          <i className="bx bx-cog bx-md me-3"></i>
                          <span>Settings</span>{" "}
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <span className="d-flex align-items-center align-middle">
                            <i className="flex-shrink-0 bx bx-credit-card bx-md me-3"></i>
                            <span className="flex-grow-1 align-middle">
                              Billing Plan
                            </span>
                            <span className="flex-shrink-0 badge rounded-pill bg-danger">
                              4
                            </span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <div className="dropdown-divider my-1"></div>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:void(0);">
                          <i className="bx bx-power-off bx-md me-3"></i>
                          <span>Log Out</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                  {/* <!--/ User --> */}
                </ul>
              </div>
            </nav>

            {/* <!-- / Navbar --> */}

            {/* <!-- Content wrapper --> */}
            <div className="content-wrapper">
              {/* <!-- Content --> */}
              <div class="container-xxl flex-grow-1 container-p-y">
                <hr class="my-12" />
                <div class="card">
                  <div className="col d-flex align-items-center">
                    <h5 className="card-header">Products Table</h5>
                    <button
                      className="btn btn-primary ms-auto me-5"
                      onClick={handleShowModal}
                    >
                      + Add Item
                    </button>
                  </div>

                  <div class="table-responsive text-nowrap">
                    <table class="table table-borderless">
                      <thead>
                        <tr>
                          <th>Barcode</th>
                          <th>Product Name</th>
                          <th>Product Type</th>
                          <th>Stock</th>
                          <th>Added At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length > 0 ? (
                          products.map((product) => (
                            <tr key={product.id}>
                              <td>{product.barcode}</td>
                              <td>{product.name}</td>
                              <td>{product.price}</td>
                              <td>{product.stock_quantity}</td>
                              <td>{product.created_at}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-info me-2"
                                  onClick={() => handleOpenModal(product)}
                                >
                                  <i className="bx bx-edit-alt"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => removeProduct(product.barcode)}
                                >
                                  <i className="bx bx-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">No products available.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {showModal && (
                  <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Add New Product</h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={handleCloseModal}
                          ></button>
                        </div>
                        <div className="modal-body">
                          {/* Form for adding new product */}
                          <form>
                            <div className="mb-3">
                              <label htmlFor="barcode" className="form-label">
                                Barcode
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="barcode"
                                value={barcode}
                                onChange={(e) => setBarCode(e.target.value)}
                              />
                            </div>
                            <div className="mb-3">
                              <label htmlFor="name" className="form-label">
                                Product Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>
                            <div className="mb-3">
                              <label htmlFor="price" className="form-label">
                                Price
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                              />
                            </div>
                            <div className="mb-3">
                              <label htmlFor="stock" className="form-label">
                                Stock Quantity
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="stock"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                              />
                            </div>
                          </form>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCloseModal}
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={insertProduct}
                          >
                            Save Product
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {showUpdateModal && (
                  <UpdateModal
                    show={showUpdateModal}
                    handleClose={handleCloseUpdateModal}
                    product={product}
                    setBarCode={setBarCode}
                    setName={setName}
                    setPrice={setPrice}
                    setStock={setStock}
                    // handleUpdateProduct={updateProduct}
                  />
                )}
                <hr class="my-12" />
              </div>

              {/* <!-- / Content --> */}

              {/* <!-- Footer --> */}
              <footer className="content-footer footer bg-footer-theme">
                <div className="container-xxl">
                  <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                    <div className="text-body">
                      made with ❤️ by
                      <a
                        href="https://github.com/amabee"
                        target="_blank"
                        className="footer-link"
                      >
                        amabee
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
              {/* <!-- / Footer --> */}

              <div className="content-backdrop fade"></div>
            </div>
            {/* <!-- Content wrapper --> */}
          </div>
        </div>
      </div>
    </body>
  );
};

export default Products;
