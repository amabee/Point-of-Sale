import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateCashierModal = ({
  show,
  handleClose,
  id,
  cashier,
  firstname,
  lastname,
  username,
  password,
  image,
  setFirstname,
  setLastname,
  setUsername,
  setPassword,
  setImage,
  setID,
  handleUpdateCashier,
}) => {
  useEffect(() => {
    if (cashier) {
      setID(cashier.id || "");
      setFirstname(cashier.firstname || "");
      setLastname(cashier.lastname || "");
      setUsername(cashier.username || "");
      setPassword(cashier.password || "");
      setImage(cashier.image || null);
    }
  }, [
    cashier,
    setID,
    setFirstname,
    setLastname,
    setUsername,
    setPassword,
    setImage,
  ]);

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ display: show ? "block" : "none" }}
      aria-hidden={!show}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Cashier</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form enctype="multipart/form-data">
              <div className="mb-3">
                <label htmlFor="firstname" className="form-label">
                  ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="id"
                  value={id}
                  onChange={(e) => setID(e.target.value)}
                  readOnly
                  disabled
                />
              </div>
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
              onClick={handleClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateCashier}
            >
              Update Cashier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCashierModal;
