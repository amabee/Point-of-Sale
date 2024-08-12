"use client";
import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../../public/styles/admin/assets/vendor/fonts/boxicons.css";
import "../../public/styles/admin/assets/vendor/css/core.css";
import "../../public/styles/admin/assets/vendor/css/theme-default.css";
import "../../public/styles/admin/assets/css/demo.css";
import "../../public/styles/admin/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css";
import "../../public/styles/admin/assets/vendor/libs/apex-charts/apex-charts.css";
import PerfectScrollbar from "perfect-scrollbar";
import "../../public/styles/admin/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css";
import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ADMIN_IMAGE_ENDPOINT } from "../globals";

const Admin = () => {
  const [year, setYear] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear(currentYear);
  }, []);

  useEffect(() => {
    const container = document.querySelector(".layout-wrapper");
    if (container) {
      const ps = new PerfectScrollbar(container, {
        wheelSpeed: 0.5,
        wheelPropagation: true,
        minScrollbarLength: 20,
      });
      return () => ps.destroy();
    }
  }, []);

  useEffect(() => {
    const loadScript = (src, onLoad) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = onLoad;
      document.body.appendChild(script);
      return script;
    };
    const apexchartsScript = loadScript(
      "https://cdn.jsdelivr.net/npm/apexcharts",
      () => {
        console.log("ApexCharts script loaded successfully");
      }
    );
    return () => {
      document.body.removeChild(apexchartsScript);
    };
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
      <Script
        src="/styles/admin/assets/vendor/js/bootstrap.js"
        strategy="beforeInteractive"
      ></Script>

      {/* ApexCharts JS */}
      <Script
        src="/styles/admin/assets/vendor/libs/apex-charts/apexcharts.js"
        strategy="beforeInteractive"
      ></Script>

      {/* Main JS */}
      <Script src="/styles/admin/assets/js/main.js"></Script>

      {/* PAGE JS */}
      <Script src="/styles/admin/assets/js/dashboards-analytics.js"></Script>

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
                  <li className="menu-item active">
                    <Link href="/admin" className="menu-link" passHref>
                      <div className="text-truncate" data-i18n="Analytics">
                        Sales Analytics
                      </div>
                    </Link>
                  </li>

                  <li className="menu-item">
                    <Link href="admin/products" className="menu-link" passHref>
                      <div className="text-truncate" data-i18n="Analytics">
                        Products
                      </div>
                    </Link>
                  </li>

                  <li className="menu-item">
                    <a
                      href="/admin/cashier"
                      passHref
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
                                  src={
                                    ADMIN_IMAGE_ENDPOINT + loggedInUser.image
                                  }
                                  alt
                                  className="w-px-40 h-auto rounded-circle"
                                />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0">{loggedInUser.username}</h6>
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

              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row">
                  <div className="col-xxl-8 mb-6 order-0">
                    <div className="card">
                      <div className="d-flex align-items-start row">
                        <div className="col-sm-7">
                          <div className="card-body">
                            {loggedInUser ? (
                              <h5 className="card-title text-primary mb-3">
                                Welcome back <b>{loggedInUser.username}</b>! 🎉
                              </h5>
                            ) : (
                              <h5>No User</h5>
                            )}

                            <p className="mb-6">
                              You have done 72% more sales today.
                              <br />
                              Check your new badge in your profile.
                            </p>

                            <a
                              href="javascript:;"
                              className="btn btn-sm btn-outline-primary"
                            >
                              View Badges
                            </a>
                          </div>
                        </div>
                        <div className="col-sm-5 text-center text-sm-left">
                          <div className="card-body pb-0 px-0 px-md-6">
                            <img
                              src="/styles/admin/assets/img/illustrations/man-with-laptop.png"
                              height="175"
                              className="scaleX-n1-rtl"
                              alt="View Badge User"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 order-1">
                    <div className="row">
                      <div className="col-lg-6 col-md-12 col-6 mb-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="card-title d-flex align-items-start justify-content-between mb-4">
                              <div className="avatar flex-shrink-0">
                                <img
                                  src="/styles/admin/assets/img/icons/unicons/chart-success.png"
                                  alt="chart success"
                                  className="rounded"
                                />
                              </div>
                              <div className="dropdown">
                                <button
                                  className="btn p-0"
                                  type="button"
                                  id="cardOpt3"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  <i className="bx bx-dots-vertical-rounded text-muted"></i>
                                </button>
                                <div
                                  className="dropdown-menu dropdown-menu-end"
                                  aria-labelledby="cardOpt3"
                                >
                                  <a
                                    className="dropdown-item"
                                    href="javascript:void(0);"
                                  >
                                    View More
                                  </a>
                                  <a
                                    className="dropdown-item"
                                    href="javascript:void(0);"
                                  >
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                            <p className="mb-1">Profit</p>
                            <h4 className="card-title mb-3">₱0.00</h4>
                            <small className="text-success fw-medium">
                              <i className="bx bx-up-arrow-alt"></i> +72.80%
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-12 col-6 mb-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="card-title d-flex align-items-start justify-content-between mb-4">
                              <div className="avatar flex-shrink-0">
                                <img
                                  src="/styles/admin/assets/img/icons/unicons/wallet-info.png"
                                  alt="wallet info"
                                  className="rounded"
                                />
                              </div>
                              <div className="dropdown">
                                <button
                                  className="btn p-0"
                                  type="button"
                                  id="cardOpt6"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  <i className="bx bx-dots-vertical-rounded text-muted"></i>
                                </button>
                                <div
                                  className="dropdown-menu dropdown-menu-end"
                                  aria-labelledby="cardOpt6"
                                >
                                  <a
                                    className="dropdown-item"
                                    href="javascript:void(0);"
                                  >
                                    View More
                                  </a>
                                  <a
                                    className="dropdown-item"
                                    href="javascript:void(0);"
                                  >
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                            <p className="mb-1">Sales</p>
                            <h4 className="card-title mb-3">₱0.00</h4>
                            <small className="text-success fw-medium">
                              <i className="bx bx-up-arrow-alt"></i> +28.42%
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Total Revenue --> */}
                  <div className="col-12 col-xxl-8 order-2 order-md-3 order-xxl-2 mb-6">
                    <div className="card">
                      <div className="row row-bordered g-0">
                        <div className="col-lg-8">
                          <div className="card-header d-flex align-items-center justify-content-between">
                            <div className="card-title mb-0">
                              <h5 className="m-0 me-2">Total Revenue</h5>
                            </div>
                            <div className="dropdown">
                              <button
                                className="btn p-0"
                                type="button"
                                id="totalRevenue"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                <i className="bx bx-dots-vertical-rounded bx-lg text-muted"></i>
                              </button>
                              <div
                                className="dropdown-menu dropdown-menu-end"
                                aria-labelledby="totalRevenue"
                              >
                                <a
                                  className="dropdown-item"
                                  href="javascript:void(0);"
                                >
                                  Select All
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="javascript:void(0);"
                                >
                                  Refresh
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="javascript:void(0);"
                                >
                                  Share
                                </a>
                              </div>
                            </div>
                          </div>
                          <div id="totalRevenueChart" className="px-3"></div>
                        </div>
                        <div className="col-lg-4 d-flex align-items-center">
                          <div className="card-body px-xl-9">
                            <div className="text-center mb-6">
                              <div className="btn-group">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary"
                                >
                                  {year}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="visually-hidden">
                                    Toggle Dropdown
                                  </span>
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="javascript:void(0);"
                                    >
                                      2021
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="javascript:void(0);"
                                    >
                                      2020
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="javascript:void(0);"
                                    >
                                      2019
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div id="growthChart"></div>
                            <div className="text-center fw-medium my-6">
                              62% Company Growth
                            </div>

                            <div className="d-flex gap-3 justify-content-between">
                              <div className="d-flex">
                                <div className="avatar me-2">
                                  <span className="avatar-initial rounded-2 bg-label-primary">
                                    <i className="bx bx-dollar bx-lg text-primary"></i>
                                  </span>
                                </div>
                                <div className="d-flex flex-column">
                                  <small>{year - 1}</small>
                                  <h6 className="mb-0">$32.5k</h6>
                                </div>
                              </div>
                              <div className="d-flex">
                                <div className="avatar me-2">
                                  <span className="avatar-initial rounded-2 bg-label-info">
                                    <i className="bx bx-wallet bx-lg text-info"></i>
                                  </span>
                                </div>
                                <div className="d-flex flex-column">
                                  <small>{year - 2}</small>
                                  <h6 className="mb-0">$41.2k</h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!--/ Total Revenue --> */}
                  <div className="col-12 col-md-8 col-lg-12 col-xxl-4 order-3 order-md-2">
                    <div className="row">
                      <div className="col-6 mb-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="card-title d-flex align-items-start justify-content-between mb-4">
                              <div className="avatar flex-shrink-0">
                                <img
                                  src="/styles/admin/assets/img/icons/unicons/paypal.png"
                                  alt="paypal"
                                  className="rounded"
                                />
                              </div>
                              <div className="dropdown">
                                <button
                                  className="btn p-0"
                                  type="button"
                                  id="cardOpt4"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  <i className="bx bx-dots-vertical-rounded text-muted"></i>
                                </button>
                                <div
                                  className="dropdown-menu dropdown-menu-end"
                                  aria-labelledby="cardOpt4"
                                >
                                  <a
                                    className="dropdown-item"
                                    href="javascript:void(0);"
                                  >
                                    View More
                                  </a>
                                  <a
                                    className="dropdown-item"
                                    href="javascript:void(0);"
                                  >
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                            <p className="mb-1">Payments</p>
                            <h4 className="card-title mb-3">₱0.00</h4>
                            <small className="text-danger fw-medium">
                              <i className="bx bx-down-arrow-alt"></i> -14.82%
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 mb-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="card-title d-flex align-items-start justify-content-between mb-4">
                              <div className="avatar flex-shrink-0">
                                <img
                                  src="/styles/admin/assets/img/icons/unicons/cc-primary.png"
                                  alt="Credit Card"
                                  className="rounded"
                                />
                              </div>
                              <div className="dropdown">
                                <button
                                  className="btn p-0"
                                  type="button"
                                  id="cardOpt1"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  <i className="bx bx-dots-vertical-rounded text-muted"></i>
                                </button>
                                <div
                                  className="dropdown-menu"
                                  aria-labelledby="cardOpt1"
                                >
                                  <a
                                    className="dropdown-item"
                                    href="javascript:void(0);"
                                  >
                                    View More
                                  </a>
                                  <a
                                    className="dropdown-item"
                                    href="javascript:void(0);"
                                  >
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                            <p className="mb-1">Transactions</p>
                            <h4 className="card-title mb-3">₱0.00</h4>
                            <small className="text-success fw-medium">
                              <i className="bx bx-up-arrow-alt"></i> +28.14%
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 mb-6">
                        <div className="card">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center flex-sm-row flex-column gap-10">
                              <div className="d-flex flex-sm-column flex-row align-items-start justify-content-between">
                                <div className="card-title mb-6">
                                  <h5 className="text-nowrap mb-1">
                                    Profile Report
                                  </h5>
                                  <span className="badge bg-label-warning">
                                    YEAR {year}
                                  </span>
                                </div>
                                <div className="mt-sm-auto">
                                  <span className="text-success text-nowrap fw-medium">
                                    <i className="bx bx-up-arrow-alt"></i> 68.2%
                                  </span>
                                  <h4 className="mb-0">$84,686k</h4>
                                </div>
                              </div>
                              <div id="profileReportChart"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* <!-- Order Statistics --> */}
                  <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-6">
                    <div className="card h-100">
                      <div className="card-header d-flex justify-content-between">
                        <div className="card-title mb-0">
                          <h5 className="mb-1 me-2">Order Statistics</h5>
                          <p className="card-subtitle">42.82k Total Sales</p>
                        </div>
                        <div className="dropdown">
                          <button
                            className="btn text-muted p-0"
                            type="button"
                            id="orederStatistics"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="bx bx-dots-vertical-rounded bx-lg"></i>
                          </button>
                          <div
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="orederStatistics"
                          >
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Select All
                            </a>
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Refresh
                            </a>
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Share
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-6">
                          <div className="d-flex flex-column align-items-center gap-1">
                            <h3 className="mb-1">8,258</h3>
                            <small>Total Orders</small>
                          </div>
                          <div id="orderStatisticsChart"></div>
                        </div>
                        <ul className="p-0 m-0">
                          <li className="d-flex align-items-center mb-5">
                            <div className="avatar flex-shrink-0 me-3">
                              <span className="avatar-initial rounded bg-label-primary">
                                <i className="bx bx-mobile-alt"></i>
                              </span>
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <h6 className="mb-0">Electronic</h6>
                                <small>Mobile, Earbuds, TV</small>
                              </div>
                              <div className="user-progress">
                                <h6 className="mb-0">82.5k</h6>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex align-items-center mb-5">
                            <div className="avatar flex-shrink-0 me-3">
                              <span className="avatar-initial rounded bg-label-success">
                                <i className="bx bx-closet"></i>
                              </span>
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <h6 className="mb-0">Fashion</h6>
                                <small>T-shirt, Jeans, Shoes</small>
                              </div>
                              <div className="user-progress">
                                <h6 className="mb-0">23.8k</h6>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex align-items-center mb-5">
                            <div className="avatar flex-shrink-0 me-3">
                              <span className="avatar-initial rounded bg-label-info">
                                <i className="bx bx-home-alt"></i>
                              </span>
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <h6 className="mb-0">Decor</h6>
                                <small>Fine Art, Dining</small>
                              </div>
                              <div className="user-progress">
                                <h6 className="mb-0">849k</h6>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex align-items-center">
                            <div className="avatar flex-shrink-0 me-3">
                              <span className="avatar-initial rounded bg-label-secondary">
                                <i className="bx bx-football"></i>
                              </span>
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <h6 className="mb-0">Sports</h6>
                                <small>Football, Cricket Kit</small>
                              </div>
                              <div className="user-progress">
                                <h6 className="mb-0">99</h6>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* <!--/ Order Statistics --> */}

                  {/* <!-- Expense Overview --> */}
                  {/* <div className="col-md-6 col-lg-4 order-1 mb-6">
                    <div className="card h-100">
                      <div className="card-header nav-align-top">
                        <ul className="nav nav-pills" role="tablist">
                          <li className="nav-item">
                            <button
                              type="button"
                              className="nav-link active"
                              role="tab"
                              data-bs-toggle="tab"
                              data-bs-target="#navs-tabs-line-card-income"
                              aria-controls="navs-tabs-line-card-income"
                              aria-selected="true"
                            >
                              Income
                            </button>
                          </li>
                          <li className="nav-item">
                            <button
                              type="button"
                              className="nav-link"
                              role="tab"
                            >
                              Expenses
                            </button>
                          </li>
                          <li className="nav-item">
                            <button
                              type="button"
                              className="nav-link"
                              role="tab"
                            >
                              Profit
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="card-body">
                        <div className="tab-content p-0">
                          <div
                            className="tab-pane fade show active"
                            id="navs-tabs-line-card-income"
                            role="tabpanel"
                          >
                            <div className="d-flex mb-6">
                              <div className="avatar flex-shrink-0 me-3">
                                <img
                                  src="/styles/admin/assets/img/icons/unicons/wallet.png"
                                  alt="User"
                                />
                              </div>
                              <div>
                                <p className="mb-0">Total Balance</p>
                                <div className="d-flex align-items-center">
                                  <h6 className="mb-0 me-1">$459.10</h6>
                                  <small className="text-success fw-medium">
                                    <i className="bx bx-chevron-up bx-lg"></i>
                                    42.9%
                                  </small>
                                </div>
                              </div>
                            </div>
                            <div id="incomeChart"></div>
                            <div className="d-flex align-items-center justify-content-center mt-6 gap-3">
                              <div className="flex-shrink-0">
                                <div id="expensesOfWeek"></div>
                              </div>
                              <div>
                                <h6 className="mb-0">Income this week</h6>
                                <small>$39k less than last week</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  {/* <!--/ Expense Overview -->

                <!-- Transactions --> */}
                  <div className="col-md-6 col-lg-4 order-2 mb-6">
                    <div className="card h-100">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <h5 className="card-title m-0 me-2">Transactions</h5>
                        <div className="dropdown">
                          <button
                            className="btn text-muted p-0"
                            type="button"
                            id="transactionID"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="bx bx-dots-vertical-rounded bx-lg"></i>
                          </button>
                          <div
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="transactionID"
                          >
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Last 28 Days
                            </a>
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Last Month
                            </a>
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Last Year
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="card-body pt-4">
                        <ul className="p-0 m-0">
                          <li className="d-flex align-items-center mb-6">
                            <div className="avatar flex-shrink-0 me-3">
                              <img
                                src="/styles/admin/assets/img/icons/unicons/paypal.png"
                                alt="User"
                                className="rounded"
                              />
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <small className="d-block">Paypal</small>
                                <h6 className="fw-normal mb-0">Send money</h6>
                              </div>
                              <div className="user-progress d-flex align-items-center gap-2">
                                <h6 className="fw-normal mb-0">+82.6</h6>
                                <span className="text-muted">USD</span>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex align-items-center mb-6">
                            <div className="avatar flex-shrink-0 me-3">
                              <img
                                src="/styles/admin/assets/img/icons/unicons/wallet.png"
                                alt="User"
                                className="rounded"
                              />
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <small className="d-block">Wallet</small>
                                <h6 className="fw-normal mb-0">Mac'D</h6>
                              </div>
                              <div className="user-progress d-flex align-items-center gap-2">
                                <h6 className="fw-normal mb-0">+270.69</h6>
                                <span className="text-muted">USD</span>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex align-items-center mb-6">
                            <div className="avatar flex-shrink-0 me-3">
                              <img
                                src="/styles/admin/assets/img/icons/unicons/chart.png"
                                alt="User"
                                className="rounded"
                              />
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <small className="d-block">Transfer</small>
                                <h6 className="fw-normal mb-0">Refund</h6>
                              </div>
                              <div className="user-progress d-flex align-items-center gap-2">
                                <h6 className="fw-normal mb-0">+637.91</h6>
                                <span className="text-muted">USD</span>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex align-items-center mb-6">
                            <div className="avatar flex-shrink-0 me-3">
                              <img
                                src="/styles/admin/assets/img/icons/unicons/cc-primary.png"
                                alt="User"
                                className="rounded"
                              />
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <small className="d-block">Credit Card</small>
                                <h6 className="fw-normal mb-0">Ordered Food</h6>
                              </div>
                              <div className="user-progress d-flex align-items-center gap-2">
                                <h6 className="fw-normal mb-0">-838.71</h6>
                                <span className="text-muted">USD</span>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex align-items-center mb-6">
                            <div className="avatar flex-shrink-0 me-3">
                              <img
                                src="/styles/admin/assets/img/icons/unicons/wallet.png"
                                alt="User"
                                className="rounded"
                              />
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <small className="d-block">Wallet</small>
                                <h6 className="fw-normal mb-0">Starbucks</h6>
                              </div>
                              <div className="user-progress d-flex align-items-center gap-2">
                                <h6 className="fw-normal mb-0">+203.33</h6>
                                <span className="text-muted">USD</span>
                              </div>
                            </div>
                          </li>
                          <li className="d-flex align-items-center">
                            <div className="avatar flex-shrink-0 me-3">
                              <img
                                src="/styles/admin/assets/img/icons/unicons/cc-warning.png"
                                alt="User"
                                className="rounded"
                              />
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <small className="d-block">Mastercard</small>
                                <h6 className="fw-normal mb-0">Ordered Food</h6>
                              </div>
                              <div className="user-progress d-flex align-items-center gap-2">
                                <h6 className="fw-normal mb-0">-92.45</h6>
                                <span className="text-muted">USD</span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* <!--/ Transactions --> */}
                </div>
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

export default Admin;
