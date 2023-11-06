import { useState } from "react";
import Axios from "axios";
import Register from "./Register";

import "./users.css";

function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      username: data.get("username"),
      password: data.get("password"),
    };

    const response = Axios.post("http://localhost:3000/login", jsonData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.status == "okAdmin") {
          localStorage.setItem("fname", data.name);
          localStorage.setItem("location", data.location);
          localStorage.setItem("token", data.token);
          window.location = "/Admin";
        } else if (data.status == "okUser") {
          localStorage.setItem("fname", data.name);
          localStorage.setItem("location", data.location);
          localStorage.setItem("token", data.token);
          window.location = "/User";
        } else {
          alert("ชื่อผู้ใช้หรือรหัสไม่ถูกต้อง");
          console.log(data.status);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  };

  return (
    <>
      <div className="left-wid30-mr5">
        <h3>Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              User
            </label>
            <input
              type="text"
              className="form-control"
              name="username"
              aria-describedby="emailHelp"
            />
            <div className="form-text">
              รับรหัสผู้ใช้จาก การลงทะเบียนด้านล่างเเละได้รับการยืนยันจาก sjp
              เท่านั้น
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input type="password" className="form-control" name="password" />
          </div>
          <div className="right">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
        <hr />
        <Register />
      </div>
    </>
  );
}

export default Login;
