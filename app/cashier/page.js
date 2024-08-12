"use client";
import React, { useState, useEffect } from "react";
import "../../public/styles/pos-style.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Cashier = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [savedItems, setSavedItems] = useState([]); // New state for saved items
  const [total, setTotal] = useState(0);
  const [cashInput, setCashInput] = useState("");
  const [change, setChange] = useState(0);

  const handleCashInput = (event) => {
    const cash = parseFloat(event.target.value);
    setCashInput(event.target.value);
    setChange(cash - (total + total * 0.25));
  };

  const handlePrint = () => {
    const receiptContent = document.getElementById("receipt").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = receiptContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="device-frame">
      <div className="app">
        {/* Saved Items Section */}
        <div className="saved-items">
          <h2>Saved Items</h2>
          <div className="saved-items-list">
            {savedItems.length > 0 ? (
              <ul>
                {savedItems.map((item, index) => (
                  <li key={index}>
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No saved items</p>
            )}
          </div>
        </div>

        {/* Active Cart Section */}
        <div className="cart">
          <h2>Order</h2>
          <div className="cart-summary">
            <p>Discount: ₱0.00</p>
            <p>VAT: ₱{(total * 0.15).toFixed(2)}</p>
            <p>Service Charge: ₱{(total * 0.1).toFixed(2)}</p>
            <h3>Total: ₱{(total + total * 0.25).toFixed(2)}</h3>
            <input
              type="number"
              placeholder="Enter cash"
              value={cashInput}
              onChange={handleCashInput}
              className="form-control"
            />
            <p>Change: ₱{change.toFixed(2)}</p>
          </div>
          <button className="btn btn-primary charge-btn" onClick={handlePrint}>
            CHARGE ₱{(total + total * 0.25).toFixed(2)}
          </button>
        </div>

        <div className="menu">
          <h2>Point of Sales</h2>
          <div className="cart-count">{cart.length} items</div>
          <div className="menu-grid">
            <table className="table table-striped table-hover cart-table">
              <thead className="table-dark">
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₱{parseFloat(item.price).toFixed(2)}</td>
                    <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="receipt" className="receipt-container">
        <div className="receipt">
          <h2>C,O,C,B POS</h2>
          <hr />
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>₱{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <hr />
          <p>Discount: ₱0.00</p>
          <h3>Total: ₱{(total + total * 0.25).toFixed(2)}</h3>
          <p>Thank You!</p>
        </div>
      </div>
    </div>
  );
};

export default Cashier;
