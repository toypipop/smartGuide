import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Create() {
  //read type
  const [typeView, setTypeView] = useState([]);

  const [SearchType, setSearchType] = useState("");

  const handleSearchChange = async (event) => {
    await setSearchType(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const location = await localStorage.getItem("location");
      const response = await axios.post("http://localhost:3000/filterType", {
        SearchType: SearchType,
        SearchLocation: location,
      });
      if (response.data.massage == "nohave") {
        alert("plz insert data");
      } else {
        setTypeView(response.data);
      }
    } catch (error) {
      console.error("Error fetching Type data:", error);
    }
  };

  //resizeImage
  const resizeImage = (imageFile, desiredWidth, desiredHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = desiredWidth;
        canvas.height = desiredHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, desiredWidth, desiredHeight);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.5
        );
      };
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    });
  };

  //convertImageToBase64
  const convertImageToBase64 = async (imageFile) => {
    const resizedImage = await resizeImage(imageFile, 600, 600);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(resizedImage);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(new Error("Failed to convert image to Base64"));
      };
    });
  };

  // handleChange img and text
  const handleChange = async (event) => {
    const { name, value } = event.target;

    if (name === "file") {
      const imageFiles = event.target.files;
      const img64Array = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        const base64 = await convertImageToBase64(imageFile);
        img64Array.push(base64);
      }

      setFormData({ ...formData, img64: img64Array });
    } else if (name === "type") {
      setFormData({ ...formData, type: value });
    } else {
      //get location
      const location = localStorage.getItem("location");
      setFormData({ ...formData, [name]: value, location: location });
    }
  };

  //big object for axios
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    address: "",
    timeopen: "",
    timeclose: "",
    type: "",
    img64: [],
    location: "",
  });

  //axios create form to server
  const handleSubmit = async (e) => {
    // authen data before axios api to server
    const { name, content, address, timeopen, timeclose, type, img64 } =
      formData;
    const validationsText = [
      { field: "ชื่อ", warning: "50", value: name, max_length: 50 },
      { field: "เนื้อหา", warning: "800", value: content, max_length: 800 },
      { field: "ที่อยู่", warning: "800", value: address, max_length: 800 },
      { field: "เวลาเปิด", warning: "50", value: timeopen, max_length: 50 },
      { field: "เวลาปิด", warning: "50", value: timeclose, max_length: 50 },
      { field: "ประเภท", warning: "50", value: type, max_length: 50 },
    ];

    const validationsImg = [
      {
        field: "รูป",
        warning: "6",
        value: img64,
        max_length: 6,
        min_length: 1,
      },
    ];

    const validationFailedText = validationsText.some((validationsText) => {
      const { field, value, max_length, warning } = validationsText;

      if (value === "") {
        alert(`กรุณากรอก ${field} ให้ครบถ้วน`);
        return true;
      }
      if (value.length > max_length) {
        alert(`กรุณากรอก ${field} ให้ไม่เกิน ${warning}`);
        return true;
      }
      return false;
    });

    const validationFailedImg = validationsImg.some((validationsImg) => {
      const { field, value, min_length, max_length, warning } = validationsImg;

      if (value.length < min_length) {
        alert(`กรุณาเพิ่ม ${field}`);
        return true;
      }
      if (value.length > max_length) {
        alert(`กรุณาเพิ่ม ${field} ให้ไม่เกิน ${warning}`);
        return true;
      }
      return false;
    });
    if (!validationFailedText && !validationFailedImg) {
      try {
        const response = await axios.post(
          "http://localhost:3000/createCard",
          formData
        );
        const data = response.data;
        if (data.status === "have") {
          alert("ชื่อซ้ำ");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="wid90-m3">
        <form onSubmit={handleSubmit}>
          {/* name input */}
          <div class="row g-2 align-items-center mb-3">
            <div class="col-md-2">
              <label for="" class="col-form-label">
                ชื่อร้าน
              </label>
            </div>
            <div class="col-md-4">
              <input
                class="form-control"
                type="text"
                placeholder="name"
                aria-label="default input example"
                onChange={handleChange}
                name="name"
              />
            </div>
          </div>
          {/* content input */}
          <div class="row g-2 align-items-center mb-3">
            <div class="col-md-2 ">
              <label for="" class="col-form-label">
                คำอธิบายเกี่ยวกับร้าน
              </label>
            </div>
            <div class="col-md-4">
              <textarea
                class="form-control"
                rows="3"
                placeholder="content"
                onChange={handleChange}
                name="content"
              />
            </div>
          </div>
          {/* address input */}
          <div class="row g-2 align-items-center mb-3">
            <div class="col-md-2">
              <label for="" class="col-form-label">
                ที่อยู่
              </label>
            </div>
            <div class="col-md-4">
              <input
                class="form-control"
                type="text"
                placeholder="address"
                aria-label="default input example"
                onChange={handleChange}
                name="address"
              />
            </div>
          </div>
          {/* time input */}
          <div class="row g-2 align-items-center mb-3">
            <div class="col-md-2">
              <label for="" class="col-form-label">
                เวลา เปิด-ปิด
              </label>
            </div>
            <div class="col-md-4">
              <input
                type="time"
                style={{
                  padding: "0.5rem",
                  fontSize: "1.2rem",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
                onChange={handleChange}
                name="timeopen"
              />
              {" - "}
              <input
                type="time"
                style={{
                  padding: "0.5rem",
                  fontSize: "1.2rem",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
                onChange={handleChange}
                name="timeclose"
              />
            </div>
          </div>
          {/* type input */}
          <div class="row g-2 align-items-center mb-3">
            <div class="col-md-2">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Type
              </label>
            </div>
            <div class="col-md-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  aria-label="Text input with segmented dropdown button"
                  placeholder="search..."
                  onChange={handleSearchChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleSearch}
                >
                  search
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></button>
                <ul className="dropdown-menu dropdown-menu-end">
                  {typeView.length > 0 ? (
                    typeView.map((item, index) => (
                      <li key={index}>
                        <div
                          className="dropdown-item"
                          onClick={() =>
                            handleChange({
                              target: { name: "type", value: item.nametype },
                            })
                          }
                        >
                          {item.nametype}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="center"> * No results found * </li>
                  )}
                </ul>
              </div>
            </div>
            <div class="col-md-2"> {formData.type} </div>
          </div>
          {/* img input */}
          <div class="row g-2 align-items-center mb-3">
            <div class="col-md-2">
              <label for="" class="col-form-label">
                เพิ่มรูปภาพ
              </label>
            </div>
            <div class="col-md-4">
              <input
                class="form-control"
                type="file"
                onChange={handleChange}
                name="file"
                multiple
              />
            </div>
          </div>
          <div class="row g-2 align-items-center mb-3">
            <div class="col-md-2">
              <label for="" class="col-form-label">
                รูปภาพ
              </label>
            </div>
            <div class="col-md-10">
              {/* show img real time */}
              {formData.img64.map((imgData, index) => (
                <img
                  key={index}
                  src={imgData}
                  alt={`รูปภาพ ${index + 1}`}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    marginRight: "10px",
                  }}
                />
              ))}
            </div>
          </div>
          <div class="right">
            <button type="submit" class="btn btn-primary">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
