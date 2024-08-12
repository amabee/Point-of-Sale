"use client";
import React, { useState, useEffect, useRef } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../public/styles/pos-style.css";
import InformationModal from "@/components/modal/modal";
import axios from "axios";
import usePosState from "./posState/posState";
import Swal from "sweetalert2";
import { useRouter, redirect } from "next/navigation";
import { STORE_CASHIER_IMAGE, STORE_ENDPOINT } from "../globals";

const Pos2 = () => {
  const {
    barcode,
    setBarcode,
    product,
    setProduct,
    quantity,
    setQuantity,
    orders,
    setOrders,
    totalAmount,
    setTotalAmount,
    cash,
    setCash,
    totalChange,
    setTotalChange,
    previousSales,
    setPreviousSales,
    quantityInputRef,
    nextRef,
    textColor,
    setTextColor,
    showInfoModal,
    setShowInfoModal,
    showInputItemModal,
    setShowInputItemModal,
    handleShow,
    handleClose,
    handleShowInputModal,
    handleCloseInputModal,
    heldTransactions,
    setHeldTransactions,
    msg,
    setMsg,
    showHeldTransactions,
    setShowHeldTransactions,
    handleShowHeldTransactions,
    handleCloseHeldTransactions,
    customerID,
    setCustomerID,
    showCustomerIDInput,
    setShowCustomerIDInput,
    handleShowCustomerIDInput,
    handleCloseCustomerIDInput,
    showPaymentModal,
    setShowPaymentModal,
    handleShowPaymentModal,
    handleClosePaymentModal,
    showSavedCustomerPickerModal,
    setShowSavedCustomerPickerModal,
    handleShowSavedCustomerPickerModal,
    handleCloseSavedCustomerPickerModal,
    retrievedIDs,
    setRetrievedIDs,
    selectCustomerID,
    setSelectedCustomerID,
    showVoidModal,
    setShowVoidModal,
    handleShowVoidModal,
    handleCloseVoidModal,
  } = usePosState();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);
  const [itemRemoved, setItemRemoved] = useState(false);
  const [inputPin, setInputPin] = useState("");
  const superVisorPin = "122099";
  const router = useRouter();

  const getProductsFromAPI = async (barCode) => {
    try {
      const response = await axios.get(STORE_ENDPOINT, {
        params: {
          operation: "getItem",
          json: JSON.stringify({
            barcode: barCode,
          }),
        },
      });

      if (response.data) {
        setProduct(response.data.success);
        setMsg("");
        console.log(response.data);
      } else {
        setProduct({});
        setMsg("No Data");
        console.log(respose.data);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      setProduct({});
      setMsg("Error fetching data");
    }
  };

  const saveSomeItems = async (cuid, items) => {
    try {
      const formData = new FormData();
      formData.append("operation", "holdItems");
      formData.append(
        "json",
        JSON.stringify({
          customer_id: cuid,
          items: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price_at_time: item.price,
          })),
        })
      );

      const response = await axios.post(STORE_ENDPOINT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);

      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          text: "Items held successfully!",
          icon: "success",
          confirmButtonText: "Shux",
        });
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const fetchHeldItems = async () => {
    try {
      const res = await axios.get(STORE_ENDPOINT, {
        params: {
          operation: "getHoldItems",
          json: "",
        },
      });

      if (res.data !== null && res.data.success) {
        setHeldTransactions([res.data.success]);
        //console.log(res.data);
      } else {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHeldItems();
  }, []);

  const handleCustomerInput = (event) => {
    setCustomerID(event.target.value);
  };

  const handlePinChange = (e) => {
    setInputPin(e.target.value);
  };

  const handlePinSubmit = () => {
    if (inputPin === superVisorPin) {
      removeSelectedItem();
      setInputPin();
      handleCloseVoidModal();
    } else {
      Swal.fire({
        title: "Error",
        text: "Invalid PIN. Please try again",
        icon: "error",
      });
    }
  };

  const holdTransaction = () => {
    if (orders.length > 0) {
      setHeldTransactions([...heldTransactions, orders]);
      setOrders([]);
      setBarcode("");
      setProduct({});
      setQuantity(1);
      setTotalAmount(0);
    }
  };

  useEffect(() => {
    const getAllCustomerID = async () => {
      try {
        const response = await axios.get(STORE_ENDPOINT, {
          params: {
            operation: "getAllCustomerID",
            json: "",
          },
        });

        if (response.data && response.data.success) {
          setRetrievedIDs(response.data.success);
          setMsg("");
          console.log(response.data.success);
        } else {
          setRetrievedIDs([]);
          setMsg("No Data");
        }
      } catch (error) {
        console.error("Error fetching customer IDs:", error);
      }
    };
    getAllCustomerID();
  }, []);

  const handleCashChange = (e) => {
    const enteredCash = Number(e.target.value);
    setCash(enteredCash);
    setTotalChange(enteredCash - totalAmount);

    if (enteredCash > totalAmount) {
      setTextColor({ color: "green" });
    }

    if (enteredCash < totalAmount) {
      setTextColor({ color: "red" });
    }

    if (enteredCash == totalAmount) {
      setTextColor({ color: "black" });
    }
  };

  const handleBarcodeChange = (e) => {
    const enteredBarcode = e.target.value;
    setBarcode(enteredBarcode);
    if (enteredBarcode) {
      getProductsFromAPI(enteredBarcode);
    } else {
      setProduct({});
      setMsg("Please enter a barcode");
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleEscKeyPress = (e) => {
    if (e.key === "Escape") {
      if (handleShow) {
        handleClose();
      }

      if (handleShowInputModal) {
        handleCloseInputModal();
      }

      if (handleShowHeldTransactions) {
        handleCloseHeldTransactions();
      }

      if (handleShowPaymentModal) {
        handleClosePaymentModal();
      }

      if (handleShowCustomerIDInput) {
        handleCloseCustomerIDInput();
      }
    }
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (handleShowInputModal) {
        if (product.name) {
          const newOrder = {
            ...product,
            quantity,
            amount: product.price * quantity,
          };
          setOrders([...orders, newOrder]);
          setBarcode("");
          setProduct({});
          setQuantity(1);
          quantityInputRef.current.focus();
        }
      }
    }
  };

  const handleSaveSomeItemsKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (handleShowCustomerIDInput) {
        holdTransaction();
        saveSomeItems(customerID, orders);

        handleCloseCustomerIDInput();
      }
    }
  };

  const handleF2Press = (e) => {
    if (e.key === "F2") {
      //setPreviousSales(previousSales + totalAmount);
      setOrders([]);
      setTotalAmount(0);
    }
  };

  const handleSelectCustomer = async (customerID) => {
    setSelectedCustomerID(customerID);

    try {
      const response = await axios.get(STORE_ENDPOINT, {
        params: {
          op: "retrieveSaveItems",
          cashierID: currentUser.CID,
          customerID: customerID,
        },
      });

      if (response.status === 200) {
        setOrders(response.data);
        console.log(response.data);
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error("Error fetching saved items:", error);
    }
  };

  const handleFunctionsPress = (e) => {
    if (e.ctrlKey && e.key === "f") {
      e.preventDefault();
      handleShowInputModal();
      return;
    }

    switch (e.key) {
      // HELP
      case "F1":
        e.preventDefault();
        handleShow();
        break;

      // NEW TRANSACTION
      case "F2":
        e.preventDefault();
        handleF2Press(e);
        break;

      // SAVE ITEMS
      case "F3":
        e.preventDefault();
        handleShowCustomerIDInput();
        break;

      // RETAKE SAVED ORDERS
      case "F4":
        e.preventDefault();
        handleShowHeldTransactions();
        break;

      // PENDING SALES
      case "F6":
        e.preventDefault();
        restoreTransaction();
        break;

      case "F7":
        e.preventDefault();
        handleShowSavedCustomerPickerModal();
        break;

      case "Escape":
        e.preventDefault();
        handleEscKeyPress(e);
        break;
    }
  };

  useEffect(() => {
    const userLoggedIN = JSON.parse(sessionStorage.getItem("user"));

    if (userLoggedIN) {
      setCurrentUser(userLoggedIN);
    } else {
      router.push("/");
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [router]);

  useEffect(() => {
    const total = orders.reduce((acc, order) => acc + order.amount, 0);
    setTotalAmount(total);
  }, [orders]);

  useEffect(() => {
    window.addEventListener("keydown", handleFunctionsPress);
    return () => {
      window.removeEventListener("keydown", handleFunctionsPress);
    };
  }, [previousSales, totalAmount]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (orders.length === 0) return;

      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "arrowup":
            setSelectedRow((prev) => Math.max(0, prev - 1));
            break;
          case "arrowdown":
            setSelectedRow((prev) => Math.min(orders.length - 1, prev + 1));
            break;
          case "arrowleft":
            setSelectedCol((prev) => Math.max(0, prev - 1));
            break;
          case "arrowright":
            setSelectedCol((prev) => Math.min(3, prev + 1));
            break;
          case "v":
            // removeSelectedItem();
            handleShowVoidModal();
            break;
          default:
            return;
        }
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [orders, selectedRow, selectedCol]);

  const removeSelectedItem = () => {
    if (orders.length === 0) return;

    const newOrders = orders.filter((_, index) => index !== selectedRow);
    setOrders(newOrders);

    // Adjust the selected row if necessary
    if (selectedRow >= newOrders.length) {
      setSelectedRow(Math.max(0, newOrders.length - 1));
    }

    setItemRemoved(true);
  };

  useEffect(() => {
    if (itemRemoved) {
      const timer = setTimeout(() => setItemRemoved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [itemRemoved]);

  // if (loading) {
  //   return <Loader></Loader>;
  // }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="container-fluid">
        {itemRemoved && (
          <div className="alert alert-warning text-center" role="alert">
            Item removed from cart
          </div>
        )}
        <h1 className="text-center fw-bold">ROBINSONS BIRINGAN MALL</h1>
        <div className="card">
          <div className="card-body">
            <div className="row d-flex justify-content-between align-items-center">
              <div className="col-auto">
                <img
                  src="/assets/robinsons.png"
                  style={{ width: "350px" }}
                  alt="Robinsons Malls"
                />
              </div>
              <div className="col-auto">
                <h1 className="card-title m-0">Total: {totalAmount}.00</h1>
              </div>
            </div>

            <div className="row">
              {currentUser ? (
                <div className="col-md-4">
                  <div className="customer-info mb-3">
                    <div className="card text-center bg-light border-0">
                      <img
                        src={STORE_CASHIER_IMAGE + currentUser.image}
                        className="card-img-top img-thumbnail mx-auto d-block mt-2"
                        alt="bg"
                        style={{
                          width: "150px",
                          height: "150px",
                          borderRadius: "50%",
                        }}
                      />

                      <div className="card-body">
                        <h4>{currentUser.username}</h4>
                        <p>Cashier ID: {currentUser.CID}</p>
                        <div className="row justify-content-center">
                          <div className="col-auto">
                            STORE SALES
                            <br />₱{previousSales}
                          </div>
                          <div className="col-auto">
                            CUSTOMER COUNT
                            <br />0
                          </div>
                        </div>

                        <div className="row mt-3 align-items-center justify-content-center">
                          <button
                            className="btn btn-success"
                            style={{ width: "200px" }}
                          >
                            <span className="fs-6">
                              HELD TRANSACTION {heldTransactions.length}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <h1>Please log in</h1>
              )}

              <div className="col-md-8">
                <div className="row mb-2">
                  <div
                    className="card overflow-y-scroll"
                    style={{ maxHeight: "20rem" }}
                  >
                    <div className="card-body">
                      <h5 className="card-title text-center fs-4 fw-bold">
                        MY CART
                      </h5>
                      <style jsx>{`
                        .selected-cell {
                          background-color: #e0e0e0;
                          outline: 2px solid #007bff;
                        }
                      `}</style>
                      <div className="purchases mb-3">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th scope="col">Item Name</th>
                              <th scope="col">Item Code</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order, rowIndex) => (
                              <tr key={rowIndex}>
                                {["name", "barcode", "quantity", "price"].map(
                                  (field, colIndex) => (
                                    <td
                                      key={colIndex}
                                      className={
                                        rowIndex === selectedRow &&
                                        colIndex === selectedCol
                                          ? "selected-cell"
                                          : ""
                                      }
                                    >
                                      {order[field]}
                                    </td>
                                  )
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="card mt-2">
                    <div className="card-body">
                      <h5 className="card-title">ITEMS:</h5>
                      <form>
                        <div className="form-group">
                          <label htmlFor="quantity">Quantity</label>
                          <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            value={quantity}
                            onChange={handleQuantityChange}
                            placeholder="Enter quantity"
                            ref={quantityInputRef}
                            autoFocus={true}
                            onKeyPress={handleEnterKeyPress}
                            // onKeyPress={handlePlusKeyPress}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="product">Product</label>

                          <input
                            type="text"
                            className="form-control"
                            id="product"
                            value={product ? product.name : ""}
                            readOnly
                            placeholder="Product name"
                            disabled
                          />
                          {!product && (
                            <small className="form-text text-danger">
                              Product not found
                            </small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="price">Price</label>
                          <input
                            type="text"
                            className="form-control"
                            id="price"
                            value={product ? product.price : ""}
                            readOnly
                            placeholder="Price"
                            disabled
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* SHORTCUT KEYS HELP MODAL */}
        <InformationModal
          show={showInfoModal}
          handleClose={handleClose}
          centered={true}
          className="modal-lg"
          style={{ width: "100%" }}
          title="ROBINSONS POS SYSTEM SHORTCUT KEYS"
          animation={true}
        >
          <div className="row justify-content-evenly">
            <div className="col-md-2">
              General
              <div className="row-cols-2 mt-2 justify-content-evenly">
                <span className="spacing">
                  <span className="square">F1</span> - Help
                </span>
              </div>
              <div className="row-cols-2 mt-2 justify-content-evenly">
                <span className="spacing">
                  <span className="square">F2</span> - New Sale
                </span>
              </div>
              <div className="row-cols-2 mt-2 justify-content-evenly">
                <span className="spacing">
                  <span className="square">F3</span> - Save Order
                </span>
              </div>
              <div className="row-cols-2 mt-2 justify-content-evenly">
                <span className="spacing">
                  <span className="square">F4</span> - Retake Save Order
                </span>
              </div>
              <div className="row-cols-2 mt-2 justify-content-evenly">
                <span className="spacing">
                  <span className="square">F6</span> - Pending Sales
                </span>
              </div>
              <div className="row-cols-2 mt-2 justify-content-evenly">
                <span className="spacing">
                  <span className="square">F7</span> - Void
                </span>
              </div>
              <div className="row-cols-2 mt-2 justify-content-evenly">
                <span className="spacing">
                  <span className="square">F8</span> - Cash Drawer
                </span>
              </div>
              <div className="row-cols-2 mt-2 justify-content-evenly">
                <span className="spacing">
                  <span className="square">F9</span> - X Report
                </span>
              </div>
              <div className="row-cols-2 mt-2 justify-content-evenly">
                <span className="spacing">
                  <span className="square">F10</span> - Clock In / Out
                </span>
              </div>
            </div>
            <div className="col-md-2">
              Cashiering
              <div className="row-cols-2 mt-2 justify-content-evenly">
                <span className="spacing">
                  <span className="square">Ctrl</span> +{" "}
                  <span className="square">F</span> - Find Item
                </span>
              </div>
              <div className="row-cols-2 mt-2 justify-content-evenly">
                <span className="spacing">
                  <span className="square square-long">Enter</span> - Punch Item
                </span>
              </div>
            </div>

            <div className="col-md-2">Global</div>
          </div>
        </InformationModal>
        {/* SEARCH ITEM MODAL */}
        <InformationModal
          show={showInputItemModal}
          handleClose={handleCloseInputModal}
          centered={false}
          title="Search Item"
          animation={true}
          className="modal-lg"
        >
          <div className="row">
            <div className="input-group">
              <span className="input-group-text">Search Item</span>
              <input
                className="form-control"
                aria-label="Search Item"
                type="number"
                value={barcode}
                onChange={handleBarcodeChange}
                autoFocus={true}
              ></input>
            </div>
          </div>
        </InformationModal>
        {/* HELD ITEMS MODAL */}
        <InformationModal
          animation={true}
          centered={true}
          show={showHeldTransactions}
          handleClose={handleCloseHeldTransactions}
          title="Held Items"
        >
          <table className="table table-success">
            <thead>
              <tr>
                <th scope="col">Item Barcode</th>
                <th scope="col">Item name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {heldTransactions.map((transaction, index) =>
                transaction.map((item) => (
                  <tr key={item.barcode}>
                    <td>{item.barcode}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.price * item.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </InformationModal>
        {/* CUSTOMER ID MODAL */}
        <InformationModal
          animation={true}
          title="Enter Customer Name or ID"
          show={showCustomerIDInput}
          handleClose={handleCloseCustomerIDInput}
        >
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                ID
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Customer ID"
              aria-label="Customer ID"
              value={customerID}
              onChange={handleCustomerInput}
              onKeyPress={handleSaveSomeItemsKeyPress}
            />
          </div>
        </InformationModal>
        {/* PAYMENT MODAL */}
        <InformationModal
          centered
          animation
          title="Payment Wall"
          show={showPaymentModal}
          handleClose={handleClosePaymentModal}
        >
          <div className="card border-0 rounded-0 shadow-sm">
            <div className="card-body">
              {/* Cashier Info */}
              <div className="d-flex flex-column align-items-start mb-3">
                <span
                  className="name mb-1"
                  style={{
                    fontSize: "20px",
                    color: "#403f3f",
                    fontWeight: "bold",
                  }}
                >
                  Cashier Name: {currentUser.username}
                </span>
                <span
                  className="cross"
                  style={{ fontSize: "15px", color: "#b0aeb7" }}
                >
                  Cashier ID: {currentUser.CID}
                </span>
              </div>

              {/* Total Amount Due */}
              <div className="d-flex align-items-center mb-3 p-3 border border-light rounded">
                <div className="me-3">
                  <span
                    className="head"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    Total amount due
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <span
                    className="dollar"
                    style={{ fontSize: "20px", marginRight: "4px" }}
                  >
                    ₱
                  </span>
                  <span className="amount" style={{ fontSize: "20px" }}>
                    {totalAmount}.00
                  </span>
                </div>
              </div>
              {/* CHANGE */}
              <div className="d-flex align-items-center mb-3 p-3 border border-light rounded">
                <div className="me-3">
                  <span
                    className="head"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    CHANGE
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <span
                    className="dollar"
                    style={{ fontSize: "20px", marginRight: "4px" }}
                  >
                    ₱
                  </span>
                  <span className="amount" style={{ fontSize: "20px" }}>
                    {totalChange}.00
                  </span>
                </div>
              </div>

              {/* Enter Cash */}
              <div className="d-flex align-items-center mb-3 p-3 border border-light rounded">
                <div className="me-3">
                  <span
                    className="head"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    Enter Cash
                  </span>
                </div>

                <div className="d-flex align-items-center">
                  <span
                    className="dollar"
                    style={{ fontSize: "20px", marginRight: "4px" }}
                  >
                    ₱
                  </span>
                  <input
                    type="text"
                    name="text"
                    className="form-control"
                    placeholder="0"
                    style={{ maxWidth: "100px" }}
                    autoFocus={true}
                    value={cash}
                    onChange={handleCashChange}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-between align-items-center">
                <button type="button" className="btn btn-secondary">
                  Go back
                </button>
                <button type="button" className="btn btn-primary">
                  Pay amount
                </button>
              </div>
            </div>
          </div>
        </InformationModal>
        {/* GET ALL CUSTOMER IDs */}
        <InformationModal
          title="Select Customer ID"
          animation={true}
          centered={true}
          show={showSavedCustomerPickerModal}
          handleClose={handleCloseSavedCustomerPickerModal}
        >
          <div className="dropdown-custom">
            {retrievedIDs.length > 0 ? (
              <DropdownButton
                id="dropdown-basic-button"
                title="SELECT CUSTOMER"
                autoFocus={true}
              >
                {retrievedIDs.map((item, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => handleSelectCustomer(item.customer_id)}
                  >
                    {item.customer_id}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            ) : (
              <p>No customers available</p>
            )}
          </div>
        </InformationModal>
        <InformationModal
          title="Item Void"
          animation={true}
          centered={true}
          show={showVoidModal}
          handleClose={handleCloseVoidModal}
        >
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon3">
                Supervisor PIN:
              </span>
            </div>
            <input
              type="text"
              class="form-control"
              id="basic-url"
              aria-describedby="basic-addon3"
              value={inputPin}
              onChange={handlePinChange}
              autoFocus={true}
            />
          </div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handlePinSubmit}
          >
            Submit
          </button>
        </InformationModal>
        ;
      </div>
    </div>
  );
};

export default Pos2;
