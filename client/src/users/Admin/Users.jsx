import React, { useState, useEffect } from "react";

import axios from "axios";

import "./Admin.css";

export default function User() {
  //data users
  const [dataUser, setdataUser] = useState([]);

  const userData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/viewUser");
      setdataUser(response.data);
      console.log(dataUser);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/deleteUser", {
        params: { id: id },
      })
      .then((response) => {
        if (response.data.message == "success") {
          alert("del user success");
          userData();
        } else if (response.data.message == "admin") {
          alert("can not remove admin");
          userData();
        } else {
          alert("Error form server or axios");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  useEffect(() => {
    userData();
  }, []);
  return (
    <div>
      <div className="wid90-m3">
        <div className="wid95-m3">
          <h1>Your User</h1>
          {dataUser.length === 0 ? (
            <p>No users to approve.</p>
          ) : (
            <ul>
              {dataUser.map((item) => (
                <div key={item.id} className="border">
                  <div className="border-basic">
                    <>
                      ชื่อ {item.name} <br />
                      user {item.username}
                      <br />
                      พื้นที่ {item.namelocation}
                      <div className="right">
                        <button
                          type="button"
                          class="btn btn-danger m-1"
                          onClick={() => handleDelete(item.id)}
                        >
                          delete
                        </button>
                      </div>
                    </>
                  </div>
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
