import React, { useState, useEffect } from "react";
import Axios from "axios";

export default function Koksak() {
  //type filter
  const [selectedTypes, setSelectedTypes] = useState([]);
  const handleChange = (selectedType) => {
    const isAlreadySelected = selectedTypes.includes(selectedType);

    if (isAlreadySelected) {
      const updatedTypes = selectedTypes.filter(
        (type) => type !== selectedType
      );
      setSelectedTypes(updatedTypes);
    } else {
      setSelectedTypes([...selectedTypes, selectedType]);
    }
  };

  //read card
  const [readView, setreadView] = useState([]);
  const handleSearch = async () => {
    try {
      const location = 1025;
      const response = await Axios.post("http://localhost:3000/filterCard", {
        location: location,
        selectedTypes: selectedTypes,
      });
      if (response.data.status === "nodata") {
        alert("NO Data");
      }
      setreadView(response.data);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  //show type
  const [typeView, setTypeView] = useState([]);

  const handleFilter = async () => {
    try {
      const location = await localStorage.getItem("location");
      const response = await Axios.post("http://localhost:3000/filterType", {
        SearchLocation: location,
      });

      setTypeView(response.data);
    } catch (error) {
      console.error("Error fetching Type data:", error);
    }
  };

  //read card with useEffect
  useEffect(() => {
    handleSearch();
    handleFilter();
  }, [selectedTypes]);

  return (
    <>
      <div class="m-4">
        {typeView.length > 0 ? (
          typeView.map((item, index) => (
            <div
              class="btn-group m-1"
              role="group"
              aria-label="Basic checkbox toggle button group"
              key={index}
            >
              <input
                type="checkbox"
                class="btn-check"
                id={`btncheck${index + 1}`}
                autocomplete="off"
                onClick={() => handleChange(item.nametype)}
              />
              <label
                class="btn btn-outline-secondary"
                for={`btncheck${index + 1}`}
              >
                {item.nametype}
              </label>
            </div>
          ))
        ) : (
          <li className="center"> * No results found * </li>
        )}
      </div>
      {Array.isArray(readView) ? (
        <ul>
          {readView.map((item) => (
            <div key={item.id} className="border">
              <div className="border-basic">
                <div class="row align-items-center mb-3">
                  <div class="col-md-4">
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
                            <div
                              class={`carousel-item ${
                                index === 0 ? "active" : ""
                              }`}
                              key={index}
                            >
                              <img
                                src={imgData}
                                alt={`รูปภาพ ${index + 1}`}
                                onLoad={() => {
                                  setTimeout(() => {}, 1000); // delay 1 s
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="center mt-2">
                          <button
                            class="btn btn"
                            type="button"
                            data-bs-target={`#${item.id}`}
                            data-bs-slide="prev"
                          >
                            ย้อนหลัง
                          </button>
                          <button
                            class="btn btn"
                            type="button"
                            data-bs-target={`#${item.id}`}
                            data-bs-slide="next"
                          >
                            ถัดไป
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-8">
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
                          {item.timeopen} - {item.timeclose}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <p>No Card.</p>
      )}
    </>
  );
}
