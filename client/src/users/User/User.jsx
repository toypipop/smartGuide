import React, { useEffect } from "react";
import axios from "axios";

import Create from "./Create";
import Read from "./Read";
import Type from "./Type";

export default function User() {
  //authen
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:3000/authenUser",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;
        if (data.status == "ok") {
        } else if (data.status == "error") {
          localStorage.removeItem("token");
          window.location = "/Login";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleLogout = (event) => {
    localStorage.removeItem("token");
    localStorage.removeItem("fname");
    localStorage.removeItem("location");
    window.location = "/Login";
  };

  //fname
  const fname = localStorage.getItem("fname");

  return (
    <>
      <div className="wid90-m3">
        <div className="m-2">
          <div className="right">
            <label className="m-2">{fname}</label>
            <button type="button" class="btn btn-danger" onClick={handleLogout}>
              logout
            </button>
          </div>
        </div>
        <div className="mb-3">
          <div class="accordion" id="accordionPanelsStayOpenExample">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  Create for Type
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseOne"
                class="accordion-collapse collapse "
              >
                <div class="accordion-body">
                  <Type />
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseTwo"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseTwo"
                >
                  Create for Card
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseTwo"
                class="accordion-collapse collapse "
              >
                <div class="accordion-body">
                  <Create />
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseThree"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseThree"
                >
                  Read for Card
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseThree"
                class="accordion-collapse collapse"
              >
                <div class="accordion-body">
                  <Read />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
