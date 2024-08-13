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

const Voids = () => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [voidedItems, setVoidedItems] = useState([]);

  const getVoidItems = async () => {
    try {
      const res = await axios.get(ADMIN_ENDPOINT, {
        params: {
          operation: "getVoidItems",
          json: "",
        },
      });

      if (res.status === 200) {
        if (res.data !== null && res.data.success) {
          setVoidedItems(res.data.success);
          console.log(res.data.success);
        } else {
          Swal.fire("Something went wrong", res.data, "error");
          console.log(res.data);
        }
      } else {
        Swal.fire("Status Error", "Response Status: " + res.status, "error");
      }
    } catch (error) {
      Swal.fire("Exceptio Error", `${error}`, "error");
    }
  };

  const updateVoidItemStatus = async (pid) => {
    const formData = new FormData();

    formData.append("operation", "updateVoidItems");
    formData.append(
      "json",
      JSON.stringify({
        id: pid,
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
          Swal.fire("Success", res.data.success, "success");
          getVoidItems();
        } else {
          Swal.fire("Something went wrong", `${res.data}`, "error");
        }
      } else {
        Swal.fire("Status Error", "Response Status: " + res.status, "error");
      }
    } catch (error) {
      Swal.fire("Exception Error", `${error}`, "error");
    }
  };

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

  useEffect(() => {
    getVoidItems();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
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

                  <li className="menu-item ">
                    <Link href="#" className="menu-link" passHref>
                      <div className="text-truncate" data-i18n="Analytics">
                        Products
                      </div>
                    </Link>
                  </li>

                  <li className="menu-item">
                    <Link href="/admin/cashier" passHref className="menu-link">
                      <div className="text-truncate" data-i18n="Academy">
                        Cashiers
                      </div>
                    </Link>
                  </li>

                  <li className="menu-item active">
                    <a href="/admin/voids" passHref className="menu-link">
                      <div className="text-truncate" data-i18n="Academy">
                        Item Void
                      </div>
                      {voidedItems.length > 0 ? (
                        <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">
                          1
                        </div>
                      ) : null}
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
                    <h5 className="card-header">Void Table</h5>
                  </div>

                  <div class="table-responsive text-nowrap">
                    <table class="table table-borderless">
                      <thead>
                        <tr>
                          <th>Void ID</th>
                          <th>Cashier Name</th>
                          <th>Product Name</th>
                          <th>Void Reason</th>
                          <th>Void Timestamp</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {voidedItems.length > 0 ? (
                          voidedItems.map((item) => (
                            <tr key={item.void_id}>
                              <td>{item.void_id}</td>
                              <td>
                                {item.cashier_firstname +
                                  " " +
                                  item.cashier_lastname}
                              </td>
                              <td>{item.product_name}</td>
                              <td>{item.void_reason}</td>
                              <td>{formatDate(item.void_date)}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-info me-2"
                                  onClick={() => updateVoidItemStatus(item.void_id)}
                                >
                                  <i className="bx bx-edit-alt"></i>
                                </button>
                                {/* <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => removeProduct(item.barcode)}
                                >
                                  <i className="bx bx-trash"></i>
                                </button> */}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6">No voided items available.</td>{" "}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
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

export default Voids;
