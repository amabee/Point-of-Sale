"use client";
import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserMultiFormatReader } from '@zxing/library';
import "../public/styles/pos-style.css";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [quantityInput, setQuantityInput] = useState(1);
  const [cashInput, setCashInput] = useState("");
  const [change, setChange] = useState(0);
  const webcamRef = useRef(null);
  const codeReader = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/store-scanner-beep-90395 (1).mp3");
    return () => {
      audioRef.current = null;
    };
  }, []);

  const menuItems = [
    { barcode: "1001", p_name: "Bulad", price: 10, color: "blue" },
    { barcode: "1002", p_name: "Mantika", price: 30, color: "blue" },
    { barcode: "1003", p_name: "Noodles", price: 20, color: "blue" },
    { barcode: "1004", p_name: "Sabon", price: 35, color: "blue" },
    { barcode: "1005", p_name: "Shampoo", price: 15, color: "green" },
    { barcode: "1006", p_name: "Kulasa De Malas", price: 25, color: "green" },
  ];

  const addItemToCart = (item, quantity) => {
    const itemWithQuantity = { ...item, quantity };
    setCart([...cart, itemWithQuantity]);
    setTotal(total + item.price * quantity);
  };

  const playBarcodeSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleBarcodeDetected = (result) => {
    if (result) {
      const scannedItem = menuItems.find(
        (item) => item.barcode === result.text
      );
      if (scannedItem) {
        addItemToCart(scannedItem, quantityInput);
        playBarcodeSound(); // Play the sound effect
      } else {
        console.error("Item not found for barcode:", result.text);
        alert("Item not found in the menu");
      }
    }
  };

  const handleManualBarcodeInput = () => {
    const scannedItem = menuItems.find((item) => item.barcode === barcodeInput);
    if (scannedItem) {
      addItemToCart(scannedItem, quantityInput);
      playBarcodeSound(); // Play the sound effect
    } else {
      console.error("Item not found for barcode:", barcodeInput);
      alert("Item not found in the menu");
    }
    setBarcodeInput("");
    setQuantityInput(1);
  };

  const handleCashInput = (event) => {
    setCashInput(event.target.value);
    const cashAmount = parseFloat(event.target.value) || 0;
    setChange(cashAmount - (total + total * 0.25));
  };

  useEffect(() => {
    if (scanning) {
      codeReader.current = new BrowserMultiFormatReader();
      const videoElement = webcamRef.current?.video;
      if (videoElement) {
        codeReader.current.decodeFromVideoDevice(
          null,
          videoElement,
          (result, error) => {
            if (result) {
              setCode(result.text);
              handleBarcodeDetected(result);
            }
            if (error) {
              console.error(error);
            }
          }
        );
      }
    } else if (codeReader.current) {
      codeReader.current.reset();
    }

    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, [scanning]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleManualBarcodeInput();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [barcodeInput, quantityInput]);

  const startScanning = () => {
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
    if (codeReader.current) {
      codeReader.current.reset();
    }
  };

  const handleCharge = () => {
    // Automatically open print dialog
    window.print();
  };
  return (
    <div className="app">
      <div className="menu">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`menu-item ${item.color}`}
            onClick={() => addItemToCart(item, quantityInput)}
          >
            {item.p_name}
          </button>
        ))}
      </div>
      <div className="cart">
        <h2>Point of Sales</h2>
        <Webcam
          id="webcam"
          audio={false}
          width={640}
          height={480}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "environment",
          }}
          ref={webcamRef}
        />
        <button className="add-customer" onClick={startScanning}>
          Start Scanning
        </button>
        <button className="stop-scanning" onClick={stopScanning}>
          Stop Scanning
        </button>
        <div className="barcode-input">
          <input
            type="text"
            placeholder="Enter barcode"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
          />
          <input
            type="number"
            min="1"
            value={quantityInput}
            onChange={(e) => setQuantityInput(parseInt(e.target.value, 10))}
          />
          <button onClick={handleManualBarcodeInput}>Add Item</button>
        </div>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.p_name} - {item.quantity} x ₱{item.price.toFixed(2)} = ₱
              {(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
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
          />
          <p>Change: ₱{change.toFixed(2)}</p>
        </div>
        <button className="charge-btn" onClick={handleCharge}>
          CHARGE ₱{(total + total * 0.25).toFixed(2)}
        </button>
      </div>
    </div>
  );
}
