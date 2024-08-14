"use client";
import React, { useState, useEffect, useRef } from "react";
import { Dropdown, DropdownButton, Form } from "react-bootstrap";
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
    showReceiptModal,
    setShowReceiptModal,
    handleShowReceiptModal,
    handleCloseReceiptModal,
    showZReportModal,
    setShowZReportModal,
    handleShowZReportModal,
    handleCloseZReportModal,
  } = usePosState();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);
  const [itemRemoved, setItemRemoved] = useState(false);
  const [inputPin, setInputPin] = useState("");
  const [paymentButtonEnabled, setPaymentButtonEnabled] = useState(false);
  const [shouldUpdateTotal, setShouldUpdateTotal] = useState(true);
  const [voidMsg, setVoidMsg] = useState("");
  const [receiptOrders, setReceiptOrders] = useState([]);
  const [receiptTotal, setReceiptTotal] = useState(0);
  const [zReportData, setZReportData] = useState([]);
  const superVisorPin = "122099";
  const router = useRouter();

  const taxRate = 0.08;
  const taxAmount = receiptTotal * taxRate;
  const totalTaxAmout = totalAmount * taxRate;
  const finalTotal = totalAmount + totalTaxAmout;

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
        console.log(response.data);
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
          cashier_id: currentUser.id,
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
    const data = JSON.parse(sessionStorage.getItem("user"));
    console.log(data);

    try {
      const res = await axios.get(STORE_ENDPOINT, {
        params: {
          operation: "getHoldItems",
          json: JSON.stringify({
            cashier_id: data.id,
          }),
        },
      });

      if (res.data !== null && res.data.success) {
        setHeldTransactions([res.data.success]);
        console.log(res.data);
      } else {
        console.log("No data or error in response:", res.data);
      }
    } catch (error) {
      console.error("Error fetching held items:", error);
    }
  };

  const fetchHeldItemsByCustomer = async (cuid) => {
    const data = JSON.parse(sessionStorage.getItem("user"));
    try {
      const res = await axios.get(STORE_ENDPOINT, {
        params: {
          operation: "getHeldItemsFromCustomer",
          json: JSON.stringify({
            cashier_id: data.id,
            customer_id: cuid,
          }),
        },
      });

      if (res.status === 200) {
        if (res.data !== null && res.data.success) {
          Swal.fire("Success", res.data.success, "success");

          setShouldUpdateTotal(false);

          const fetchedOrders = res.data.success;
          const combinedOrders = [...orders, ...fetchedOrders];
          setOrders(combinedOrders);

          const newTotal = combinedOrders.reduce(
            (acc, order) =>
              acc +
              (parseFloat(order.total_price) || parseFloat(order.amount) || 0),
            0
          );
          setTotalAmount(newTotal);

          setShouldUpdateTotal(true);
          const hoid = res.data.success[0].held_order_id;
          updateHeldItemsByCustomerStatus(hoid);

          console.log("Data: ", res.data.success);
          console.log("Orders: ", combinedOrders);
        } else {
          Swal.fire("Something went wrong!", res.data, "info");
        }
      } else {
        Swal.fire("Status Error", res.status, "error");
      }
    } catch (error) {
      Swal.fire("Error", error, "error");
    }
  };

  const updateHeldItemsByCustomerStatus = async (hoid) => {
    try {
      const formData = new FormData();
      formData.append("operation", "updateHeldItemsStatus");
      formData.append(
        "json",
        JSON.stringify({
          held_order_id: hoid,
          status: "resumed",
        })
      );

      const res = await axios({
        url: STORE_ENDPOINT,
        method: "POST",
        data: formData,
      });

      if (res.status === 200) {
        if (res.data !== null && res.data.success) {
          Swal.fire("Succes", res.data.success, "success");
        } else {
          Swal.fire("Something went wrong", res.data, "error");
          console.log(res.data);
        }
      } else {
        Swal.fire("Status Error", res.status, "info");
      }
    } catch (error) {
      Swal.fire("Exception Error", error, "error");
    }
  };

  const voidItem = async (pid, amount) => {
    const formData = new FormData();
    formData.append("operation", "voidItem");
    formData.append(
      "json",
      JSON.stringify({
        cashier_id: currentUser.id,
        product_id: pid,
        amount: amount,
        void_reason: "Whatever reason that is",
        void_date: Date.now(),
      })
    );

    try {
      const res = await axios({
        url: STORE_ENDPOINT,
        method: "POST",
        data: formData,
      });

      if (res.status === 200) {
        if (res.data !== null && res.data.success) {
          setVoidMsg(res.data.success);
          handleShowVoidModal();
          pollVoidStatus(pid, res.data.void_item_id);
          console.log(res.data.void_item_id);
        } else {
          Swal.fire(
            "Something went wrong!",
            JSON.stringify(res.data.error),
            "error"
          );
          console.log(res.data);
          for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
          }
        }
      } else {
        Swal.fire("Status Error", `${res.status}`, "error");
        console.log(res.data);
      }
    } catch (error) {
      Swal.fire("Exception Error", `${error}`, "error");
      console.log(res.data);
    }
  };

  const pollVoidStatus = (id, void_id) => {
    const interval = 5000;

    const poll = async () => {
      console.log(`Polling for product ID: ${id}`);

      try {
        const res = await axios.get(STORE_ENDPOINT, {
          params: {
            operation: "checkForItemVoidStatus",
            json: JSON.stringify({
              product_id: id,
              pid: void_id,
            }),
          },
        });

        if (res.status === 200) {
          if (res.data && res.data.status === "voided") {
            console.log("Item has been voided");
            removeSelectedItem();
            handleCloseVoidModal();
            Swal.fire("Success", "Item voided successfully!", "success");
            return;
          } else {
            console.log(`Current status: ${res.data.status}`);
          }
        } else {
          console.log("Status Error: ", res.status);
        }
      } catch (error) {
        console.log("Exception Error: ", error);
      }

      setTimeout(poll, interval);
    };

    poll();
  };

  const handleCustomerInput = (event) => {
    setCustomerID(event.target.value);
  };

  const handlePinChange = (e) => {
    setInputPin(e.target.value);
  };

  const handlePinSubmit = () => {
    if (inputPin === superVisorPin) {
      removeSelectedItem();
      setInputPin("");
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

  const completeTransaction = async (
    totalAmount,
    paidAmount,
    changeAmount,
    items
  ) => {
    try {
      const formData = new FormData();
      formData.append("operation", "insertTransactions");
      formData.append(
        "json",
        JSON.stringify({
          transaction_date: new Date().toISOString(),
          cashier_id: currentUser.id,
          total_amount: totalAmount,
          paid_amount: paidAmount,
          change_amount: changeAmount,
          status: "completed",
          transaction_items: items.map((item) => ({
            product_id: item.id ? item.id : item.product_id,
            quantity: item.quantity,
            price: item.price,
            subtotal: (item.quantity * item.price).toFixed(2),
          })),
        })
      );

      console.log(items);
      items.map((item) => {
        console.log(parseFloat(item.price));
      });

      const res = await axios({
        url: STORE_ENDPOINT,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        if (res.data && res.data.success) {
          // Swal.fire("Success", res.data.success, "success");
          handleClosePaymentModal();
          handleShowReceiptModal();
          setReceiptOrders(orders);
          setReceiptTotal(totalAmount);
          setOrders([]);
          setProduct(null);
        } else {
          Swal.fire(
            "Something went wrong",
            res.data.error || "Unknown error",
            "error"
          );

          formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
          });
        }
      } else {
        Swal.fire("Status Error", `Status code: ${res.status}`, "error");
      }

      console.log("Response:", res.data);
    } catch (error) {
      Swal.fire(
        "Error completing transaction",
        error.message || "Unknown error",
        "error"
      );
    }
  };

  const getZReport = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    try {
      const res = await axios.get(STORE_ENDPOINT, {
        params: {
          operation: "getMyTotalSales",
          json: JSON.stringify({
            cashier_id: user.id,
            cashier_id: user.id,
          }),
        },
      });

      if (res.status === 200) {
        if (res.data !== null) {
          setZReportData(res.data);
          console.log(res.data);
        } else {
          Swal.fire(
            "Something went wrong fetching Zreport",
            JSON.stringify(res.data),
            "error"
          );
          console.log(res.data);
        }
      } else {
        Swal.fire("Status Error at getZReport", `{res.status}`, "error");
      }
    } catch (error) {
      Swal.fire("Exception Error at getZReport", `{error}`, "error");
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

    if (enteredCash < totalAmount) {
      setTotalChange(0);
      setPaymentButtonEnabled(true);
    } else {
      setTotalChange(enteredCash - totalAmount);
      setPaymentButtonEnabled(false);
    }
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
          setProduct();
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
    if (e.ctrlKey && e.key === "p") {
      e.preventDefault();
      handleShowPaymentModal();
      setPaymentButtonEnabled(true);
      return;
    }

    if (e.ctrlKey && e.key === "z") {
      e.preventDefault();
      handleShowZReportModal();
      return;
    }

    switch (e.key) {
      case "F1":
        e.preventDefault();
        handleShow();
        break;
      case "F2":
        e.preventDefault();
        handleF2Press(e);
        break;
      case "F3":
        e.preventDefault();
        handleShowCustomerIDInput();
        break;
      case "F4":
        e.preventDefault();
        handleShowHeldTransactions();
        break;
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
    fetchHeldItems();
    getZReport();
  }, []);

  useEffect(() => {
    if (shouldUpdateTotal) {
      const total = orders.reduce(
        (acc, order) =>
          acc +
          (parseFloat(order.amount) || parseFloat(order.total_price) || 0),
        0
      );
      setTotalAmount(total);
    }
  }, [orders, shouldUpdateTotal]);

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
            setSelectedCol((prev) => Math.min(4, prev + 1)); // Adjust to number of columns
            break;
          case "v":
            const selectedProduct = orders[selectedRow];
            if (selectedProduct) {
              const productId =
                selectedProduct.id || selectedProduct.product_id;
              const quantity = selectedProduct.quantity || 0;
              const price = selectedProduct.price || 0;
              const total = quantity * price;

              if (productId) {
                voidItem(productId, total);
              } else {
                console.log("No valid ID found in selectedProduct.");
              }
            }
            break;
          default:
            return;
        }
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [orders, selectedRow, selectedCol]);

  const removeSelectedItem = () => {
    if (orders.length === 0) return;

    const newOrders = orders.filter((_, index) => index !== selectedRow);
    setOrders(newOrders);

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
                <h1 className="card-title m-0">Total: {finalTotal}.00</h1>
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
                              <th scope="col">ID</th>
                              <th scope="col">Item Name</th>
                              <th scope="col">Item Code</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">Price</th>
                              <th scope="col">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order, rowIndex) => {
                              const quantity = order.quantity || 0;
                              const price = order.price || 0;
                              const total = quantity * price;

                              return (
                                <tr key={rowIndex}>
                                  {[
                                    "id",
                                    "name",
                                    "barcode",
                                    "quantity",
                                    "price",
                                    total,
                                  ].map((field, colIndex) => (
                                    <td
                                      key={colIndex}
                                      className={
                                        rowIndex === selectedRow &&
                                        colIndex === selectedCol
                                          ? "selected-cell"
                                          : ""
                                      }
                                    >
                                      {field === "id"
                                        ? order["id"] || order["product_id"]
                                        : field === total
                                        ? `₱${total.toFixed(2)}`
                                        : order[field]}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
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
                    {totalAmount + totalTaxAmout}.00
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClosePaymentModal}
                >
                  Go back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={paymentButtonEnabled}
                  onClick={() =>
                    completeTransaction(totalAmount, cash, totalChange, orders)
                  }
                >
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
                    onClick={() => fetchHeldItemsByCustomer(item.customer_id)}
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
        {/* VOID MODAL */}
        <InformationModal
          title="Item Void"
          animation={true}
          centered={true}
          show={showVoidModal}
        >
          <h3>{voidMsg}</h3>
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
        {/* RECEIPT MODAL */}
        <InformationModal
          title="Receipt Modal"
          handleClose={handleCloseReceiptModal}
          show={showReceiptModal}
        >
          <div className="receipt">
            <h2>Robinsons Galleria</h2>
            <p>123 Main Street, Biringan City, State 12345</p>
            <p>Phone: (123) 456-7890</p>

            <hr />

            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {receiptOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.name}</td>
                    <td>{order.quantity}</td>
                    <td>₱{order.price}</td>
                    <td>₱{order.price * order.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr />

            <div className="total">
              <p>
                <strong>Subtotal:</strong> ₱{receiptTotal}.00
              </p>
              <p>
                <strong>Tax (8%):</strong> ₱{receiptTotal * taxRate}
              </p>
              <p>
                <strong>Total:</strong> ₱{receiptTotal + taxAmount}
              </p>
            </div>

            <p className="thank-you">Thank you for your purchase!</p>
          </div>
        </InformationModal>
        {/* Z-REPORT */}
        <InformationModal
          title="Z Report"
          handleClose={handleCloseZReportModal}
          show={showZReportModal}
        >
          <div className="container-fluid">
            <h2 className="text-center mb-4">Z Report</h2>
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th scope="row">Cashier Name:</th>
                      <td>{currentUser.username}</td>
                    </tr>
                    <tr>
                      <th scope="row">Date:</th>
                      <td>{new Date().toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <th scope="row">Shift:</th>
                      <td>{new Date().toLocaleTimeString()}</td>
                    </tr>
                    <tr>
                      <th scope="row">Total Sales:</th>
                      <td>₱{parseFloat(zReportData.total_sales).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th scope="row">Total Void:</th>
                      <td>₱{parseFloat(zReportData.total_voids).toFixed(2)}</td>
                    </tr>

                    <tr>
                      <th scope="row">Net Sales:</th>
                      <td>₱{parseFloat(zReportData.net_sales).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th scope="row">Total Tax:</th>
                      <td>
                        ₱
                        {(
                          parseFloat(zReportData.net_sales) *
                          parseFloat(taxRate)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-8 offset-md-2">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleCloseZReportModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </InformationModal>
        ;
      </div>
    </div>
  );
};

export default Pos2;
