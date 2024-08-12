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

import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { ADMIN_ENDPOINT, ADMIN_IMAGE_ENDPOINT } from "@/app/globals";
import axios from "axios";

import UpdateCashierModal from "../modals/updateCashierModal";

const Cashier = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [cashiers, setCashiers] = useState([]);
  const [showAddCashierModal, setShowAddCashierModal] = useState(false);
  const [showUpdateCashierModal, setShowUpdateCashierModal] = useState(false);
  const [cashier, setCashier] = useState(null);
  const [id, setID] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleOpenAddCashierModal = () => setShowAddCashierModal(true);
  const handleCloseAddCashierModal = () => setShowAddCashierModal(false);
  const handleOpenUpdateCashierModal = (cashier) => {
    setCashier(cashier);
    setID(cashier.id || "");
    setFirstname(cashier.firstname || "");
    setLastname(cashier.lastname || "");
    setUsername(cashier.username || "");
    setPassword(cashier.password || "");
    setImage(cashier.image || null);
    setShowUpdateCashierModal(true);
  };

  const handleCloseUpdateCashierModal = () => setShowUpdateCashierModal(false);

  const getAllCashiers = async () => {
    try {
      const res = await axios.get(ADMIN_ENDPOINT, {
        params: {
          operation: "getAllCashier",
          json: "",
        },
      });

      if (res.status === 200) {
        if (res.data !== null && res.data.success) {
          setCashiers(res.data.success);
          console.log(res.data.success);
        } else {
          Swal.fire("Error retrieving cashiers", res.data.error, "error");
        }
      } else {
        Swal.fire("Something went wrong", res.data.error, "error");
      }
    } catch (error) {
      Swal.fire("Exception Error", error, "error");
    }
  };

  const addCashier = async () => {
    const formData = new FormData();
    formData.append("operation", "addCashier");
    formData.append(
      "json",
      JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
      })
    );
    formData.append("image", image);

    try {
      const res = await axios({
        url: ADMIN_ENDPOINT,
        method: "POST",
        data: formData,
      });

      if (res.status === 200) {
        if (res.data !== null && res.data.success) {
          handleCloseAddCashierModal();
          Swal.fire("Success", res.data.success, "success");
          getAllCashiers();
        } else {
          Swal.fire("Something went wrong", res.data.success, "error");
        }
      }
    } catch (error) {
      Swal.fire("Exception Error", error, "error");
    }
  };

  const updateCashierStatus = async (id) => {
    const formData = new FormData();
    formData.append("operation", "deactivateCashier");
    formData.append(
      "json",
      JSON.stringify({
        id: id,
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
          Swal.fire("Successful", res.data.success, "success");
          getAllCashiers();
        } else {
          Swal.fire("Error", res.data.error, "error");
        }
      }
    } catch (error) {
      Swal.fire("Exception Error", error, "error");
    }
  };

  const updateCashierInfo = async () => {
    const formData = new FormData();
    formData.append("operation", "updateCashier");
    formData.append(
      "json",
      JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
        id: id,
      })
    );
    formData.append("image", image);

    try {
      const res = await axios({
        url: ADMIN_ENDPOINT,
        method: "POST",
        data: formData,
      });

      if (res.status === 200) {
        if (res.data !== null && res.data.success) {
          handleCloseUpdateCashierModal();
          Swal.fire("Success", res.data.success, "success");
        } else {
          handleCloseUpdateCashierModal();
          Swal.fire("Error", res.data.error, "error");
          getAllCashiers();
        }
      }else{
        Swal.fire("Status Error", res.status, "error");
      }
    } catch (error) {
      Swal.fire("Exception Error", error, "error");
    }
  };

  useEffect(() => {
    getAllCashiers();
  }, []);

  useEffect(() => {
    const checkUserLogin = () => {
      const userLoggedIn = JSON.parse(sessionStorage.getItem("user"));

      if (userLoggedIn) {
        setLoggedInUser(userLoggedIn);
      } else {
        // router.push("/");
        console.log(userLoggedIn);
      }
    };

    checkUserLogin();
  }, [router]);

  return (
    <body>
      <Script src="/styles/admin/assets/vendor/js/helpers.js"></Script>
      <Script src="/styles/admin/assets/js/config.js"></Script>
      {/* CORE JS WTF! */}
      <Script src="/styles/admin/assets/vendor/libs/jquery/jquery.js"></Script>
      <Script src="/styles/admin/assets/vendor/libs/popper/popper.js"></Script>
      <Script src="/styles/admin/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></Script>
      <Script src="/styles/admin/assets/vendor/js/menu.js"></Script>
      <Script src="/styles/admin/assets/vendor/js/bootstrap.js" strategy="afterInteractive"></Script>

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
                    <Link href="/admin/products" className="menu-link" passHref>
                      <div className="text-truncate" data-i18n="Analytics">
                        Products
                      </div>
                    </Link>
                  </li>

                  <li className="menu-item active">
                    <Link href="#" passHref className="menu-link">
                      <div className="text-truncate" data-i18n="Academy">
                        Cashiers
                      </div>
                    </Link>
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
                            src={ADMIN_IMAGE_ENDPOINT + loggedInUser.image}
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
                    <h5 className="card-header">Cashier Table</h5>
                    <button
                      className="btn btn-primary ms-auto me-5"
                      onClick={handleOpenAddCashierModal}
                    >
                      + Add Cashier
                    </button>
                  </div>

                  <div class="table-responsive text-nowrap">
                    <table class="table table-borderless">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Firstname</th>
                          <th>Lastname</th>
                          <th>Username</th>
                          <th>Image</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cashiers.length > 0 ? (
                          cashiers.map((cashier) => (
                            <tr key={cashier.id}>
                              <td>{cashier.id}</td>
                              <td>{cashier.firstname}</td>
                              <td>{cashier.lastname}</td>
                              <td>{cashier.username}</td>
                              <td>
                                <ul class="list-unstyled m-0 avatar-group d-flex align-items-center">
                                  <li
                                    data-bs-toggle="tooltip"
                                    data-popup="tooltip-custom"
                                    data-bs-placement="top"
                                    class="avatar avatar-md pull-up"
                                    title="Lilian Fuller"
                                  >
                                    <img
                                      src={ADMIN_IMAGE_ENDPOINT + cashier.image}
                                      alt="Avatar"
                                      class="rounded-circle fluid"
                                    />
                                  </li>
                                </ul>
                              </td>

                              <td>{cashier.role}</td>
                              <td>
                                {cashier.status === "active" ? (
                                  <span class="badge bg-label-info me-1">
                                    {cashier.status}
                                  </span>
                                ) : (
                                  <span class="badge bg-label-danger me-1">
                                    {cashier.status}
                                  </span>
                                )}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-info me-2"
                                  onClick={() =>
                                    handleOpenUpdateCashierModal(cashier)
                                  }
                                >
                                  <i className="bx bx-edit-alt"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() =>
                                    updateCashierStatus(cashier.id)
                                  }
                                >
                                  <i className="bx bx-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">No cashiers available.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {showAddCashierModal && (
                  <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Add New Cashier</h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={handleCloseAddCashierModal}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <form enctype="multipart/form-data">
                            <div className="mb-3">
                              <label htmlFor="firstname" className="form-label">
                                Firstname
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="firstname"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="lastname" className="form-label">
                                Lastname
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="lastname"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="username" className="form-label">
                                Username
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="password" className="form-label">
                                Password
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="image" className="form-label">
                                Image
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="image"
                                onChange={(e) => setImage(e.target.files[0])}
                              />
                            </div>
                          </form>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCloseAddCashierModal}
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={addCashier}
                          >
                            Save Cashier Info
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {showUpdateCashierModal && (
                  <UpdateCashierModal
                    show={showUpdateCashierModal}
                    handleClose={handleCloseUpdateCashierModal}
                    cashier={cashier}
                    id={id}
                    firstname={firstname}
                    lastname={lastname}
                    username={username}
                    password={password}
                    image={image}
                    setID={setID}
                    setFirstname={setFirstname}
                    setLastname={setLastname}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    setImage={setImage}
                    handleUpdateCashier={updateCashierInfo}
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

export default Cashier;
