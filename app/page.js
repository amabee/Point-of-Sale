"use client";
import React, { use, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { AUTH_ENDPOINT } from "./globals";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await axios.get(AUTH_ENDPOINT, {
        params: {
          operation: "login",
          json: JSON.stringify({ username: username, password: password }),
        },
      });

      if (response.status === 200) {
        alert(JSON.stringify(response.data));
      } else {
        alert("Login failed with status:", response.status);
      }
    } catch (error) {
      alert("an error occured during the operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ background: "#b0f5ee" }}
    >
      <div
        className="bg-white rounded-4 shadow mx-3 mx-lg-0 overflow-hidden"
        style={{ width: "70%", maxWidth: "1000px" }}
      >
        <div className="row g-0">
          <div className="col-lg-6 p-5">
            <h1 className="fw-bold fs-1 mb-3">Log in</h1>
            <p className="text-muted mb-4">Welcome to Galleria Mall Biringan</p>
            <form method="POST">
              <div className="mb-4">
                <input
                  className="form-control py-3 rounded-3"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  className="form-control py-3 rounded-3"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <a href="#" className="text-info text-decoration-none">
                  Forgot your password?
                </a>
                <div>
                  {isLoading ? (
                    <div class="spinner-border text-primary" role="status" />
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-info px-5 py-2 rounded-3"
                      onClick={login}
                    >
                      Log in
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
          <div
            className="col-lg-6 d-none d-lg-block position-relative"
            style={{ minHeight: "600px" }}
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/001/226/527/large_2x/summer-beach-concept-of-an-ocean-wave-on-empty-sandy-beach-free-photo.jpg"
              className="position-absolute w-100 h-100 object-fit-cover"
              alt="Beach"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
