import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/library";

const BarcodeScanner = ({ onDetected }) => {
  const webcamRef = useRef(null);
  const audioRef = useRef(new Audio("./beep.mp3"));

  const playBeep = () => {
    audioRef.current
      .play()
      .catch((error) => console.error("Error playing audio:", error));
  };

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let interval;

    if (webcamRef.current) {
      interval = setInterval(() => {
        if (webcamRef.current && webcamRef.current.getScreenshot()) {
          codeReader
            .decodeFromImage(undefined, webcamRef.current.getScreenshot())
            .then((result) => {
              playBeep();
              onDetected(result.getText());
            })
            .catch((err) => {
              // No barcode found in this frame
            });
        }
      }, 500);
    }

    return () => {
      clearInterval(interval);
      codeReader.reset();
    };
  }, [onDetected]);

  return (
    <div style={{ width: 1, height: 1, overflow: "hidden" }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        width={300}
        height={300}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: "environment",
        }}
      />
    </div>
  );
};

export default BarcodeScanner;
