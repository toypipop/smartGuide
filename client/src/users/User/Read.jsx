import React, { useState, useEffect } from "react";
import Axios from "axios";

export default function Read() {
  //read card

  const location = localStorage.getItem("location");
  const [readView, setreadView] = useState([]);
  const handleSearch = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:3000/readCard",
        {
          location: location,
        }
      );

      if (response.data.status == "nodata") {
        alert("plz insert data");
      } else {
        setreadView(response.data);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  //delete card axios
  const handleDelete = async (id) => {
    const response = await Axios.delete(
      "http://localhost:3000/deleteCard",
      {
        params: { id: id },
      }
    ).then((response) => {
      if (response.data.message == "deleteCardSucces") {
        console.log(response.data.message);
        alert("ลบ Card เรียบร้อย");
        handleSearch();
      } else {
        alert("Error form server or axios");
      }
    });
  };
  //read card with useEffect
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <>
      {readView.length === 0 ? (
        <p>No Card.</p>
      ) : (
        <ul>
          {readView.map((item) => (
            <div key={item.id} className="border">
              <div className="border-basic">
                <div class="row g-2 align-items-center mb-3">
                  <div class="col-md-5">
                    {/* img card */}
                    <div
                      id="carouselExampleControlsNoTouching"
                      class="carousel slide"
                      data-bs-touch="false"
                    >
                      <div
                        id={item.id}
                        class="carousel slide"
                        data-bs-touch="false"
                      >
                        <div class="carousel-inner">
                          {JSON.parse(item.img64).map((imgData, index) => (
                            <div class="carousel-item active">
                              <img
                                key={index}
                                src={imgData}
                                alt={`รูปภาพ ${index + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="center">
                          <button
                            class="btn btn"
                            type="button"
                            data-bs-target={`#${item.id}`}
                            data-bs-slide="prev"
                          >
                            prev
                          </button>
                          <button
                            class="btn btn"
                            type="button"
                            data-bs-target={`#${item.id}`}
                            data-bs-slide="next"
                          >
                            next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card-body">
                      <div class="row  align-items-center mb-3">
                        <div class="col-md-2">
                          <label for="" class="col-form-label">
                            ชื่อร้าน
                          </label>
                        </div>
                        <div class="col-md-10"> {item.name}</div>
                      </div>
                      <div class="row g-2 align-items-center mb-3">
                        <div class="col-md-2">
                          <label for="" class="col-form-label">
                            คำอธิบายร้านค้า
                          </label>
                        </div>
                        <div class="col-md-10"> {item.content}</div>
                      </div>
                      <div class="row g-2 align-items-center mb-3">
                        <div class="col-md-2">
                          <label for="" class="col-form-label">
                            ที่อยู่ร้าน
                          </label>
                        </div>
                        <div class="col-md-10">{item.address}</div>
                      </div>
                      <div class="row g-2 align-items-center mb-3">
                        <div class="col-md-2">
                          <label for="" class="col-form-label">
                            ประเภท
                          </label>
                        </div>
                        <div class="col-md-10">{item.type}</div>
                      </div>
                      <div class="row g-2 align-items-center mb-3">
                        <div class="col-md-2">
                          <label for="" class="col-form-label">
                            เปิดตั้งเเต่เวลา
                          </label>
                        </div>
                        <div class="col-md-10">
                          {item.timeopen}- {item.timeclose}
                        </div>
                      </div>
                      <button
                        type="button"
                        class="btn btn-danger mb-3"
                        onClick={() => handleDelete(item.id)}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ul>
      )}
    </>
  );
}
