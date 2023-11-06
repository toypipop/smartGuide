import React from "react";
import "./App.css";

import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./users/Login";
import Admin from "./users/Admin/Admin";
import User from "./users/User/User";

import Error from "./pages/Error";

// reactstrap components
import { Container } from "reactstrap";

import antoineBarresImage from "./assets/img/antoine-barres.jpg";
import fogLowImage from "./assets/img/fog-low.png";
import cloudsImage from "./assets/img/clouds.png";

export default function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <nav className="navbar bg-light">
            <form className="container-fluid justify-content-start">
              <NavLink end to="/">
                <button className="btn btn-outline-success me-2" type="button">
                  เข้าสู่เว็บไซต์
                </button>
              </NavLink>
              <NavLink end to="/Login">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  type="button"
                >
                  สำหรับผู้พัฒนา
                </button>
              </NavLink>
            </form>
          </nav>
          <div
            className="page-header section-dark"
            style={{
              backgroundImage: `url(${antoineBarresImage})`,
            }}
          >
            <div className="filter" />
            <div className="content-center">
              <Container>
                <div className="title-brand">
                  <div className="fog-low">
                    <div
                      style={{
                        height: 100,
                      }}
                    ></div>
                  </div>
                  <h2 className="presentation-subtitle text-center">
                    Smart Guide by Sjp
                  </h2>
                  <div className="fog-low right">
                    <div
                      style={{
                        height: 100,
                      }}
                    ></div>
                  </div>
                </div>
              </Container>
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/Login" element={<Login />}></Route>
            <Route path="/Admin" element={<Admin />}></Route>
            <Route path="/User" element={<User />}></Route>
            <Route path="*" element={<Error />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}
