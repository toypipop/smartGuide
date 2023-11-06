import React, { useState, useEffect } from "react";

import axios from "axios";

import "./Admin.css";

export default function Admin() {
  //data new register
  const [datanewregister, setDatanewregister] = useState([]);

  const newregisterData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/viewNewRegister");
      setDatanewregister(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    newregisterData();
  }, []);

  //handleApprove for new user
  const handleApprove = (id) => {
    axios
      .post("http://localhost:3000/approveNewRegister", { id })
      .then((response) => {
        if (response.data.message == "approvedUserSucces") {
          alert("Approve succes");
          newregisterData();
        } else {
          alert("Error form server or axios");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  //handledisapprove for new user
  const handledisapprove = (id) => {
    axios
      .delete("http://localhost:3000/disapproveNewRegister", {
        params: { id: id },
      })
      .then((response) => {
        if (response.data.message == "disapproveUserSucces") {
          alert("disapprove success");
          newregisterData();
        } else {
          alert("Error form server or axios");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
    <>
      <div className="wid90-m3">
        <div className="wid95-m3">
          <h1>Your New User</h1>
          {datanewregister.length === 0 ? (
            <p>No new users to approve.</p>
          ) : (
            <ul>
              {datanewregister.map((item) => (
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
                          class="btn btn-success m-1"
                          onClick={() => handleApprove(item.id)}
                        >
                          approuver
                        </button>
                        <button
                          type="button"
                          class="btn btn-danger m-1"
                          onClick={() => handledisapprove(item.id)}
                        >
                          disapprove
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
    </>
  );
}
