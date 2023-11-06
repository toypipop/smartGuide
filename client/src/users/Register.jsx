import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Axios from "axios";

export default function Register() {
  //select type data
  const [TypeValue, setTypeValue] = useState("user");

  const [LocationValue, setLocationValue] = useState("");
  const handleDropdownType = (LocationValue) => {
    setLocationValue(LocationValue);
  };

  //submit for api
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      username: data.get("username"),
      password: data.get("password"),
      name: data.get("name"),
      location: LocationValue,
      type: TypeValue,
    };
    Axios.post("http://localhost:3000/register", jsonData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.status == "ok") {
          alert("success");
          localStorage.setItem("token", data.token);
          window.location = "/login";
        } else if (data.status == "space") {
          alert("Please enter a message");
        } else if (data.status == "thai") {
          alert("Please enter a message with eng");
        } else if (data.status == "have") {
          alert("Username already exists");
        } else if (data.status == "too") {
          alert("user password and name longer than 18 characters");
        } else {
          alert("not success");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //filter location
  const [SearchType, setSearchType] = useState("");
  const [selete, setSelete] = useState([]);
  LocationValue;

  const handleSearchChange = async (event) => {
    await setSearchType(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await Axios.post("http://localhost:3000/viewLocation", {
        selectedType: SearchType,
      });

      if (response.data.status == "nodata") {
        alert("plz insert data");
      } else if (response.data.status == "nohave") {
        alert("sorry is no have");
      } else {
        setSelete(response.data);
      }
    } catch (error) {
      console.error(error);
      console.log(SearchType);
    }
  };

  return (
    <>
      {/* ลงทะเบียน */}
      <h3>Register</h3>
      {/* form */}
      <form onSubmit={handleSubmit}>
        {/* username */}
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            User
          </label>
          <input
            type="text"
            className="form-control"
            aria-describedby="text"
            name="username"
          />
        </div>
        {/* password */}
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input type="password" className="form-control" name="password" />
        </div>
        {/* name */}
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Name
          </label>
          <input type="text" className="form-control" name="name" />
        </div>

        {/* location */}
        <div class="row g-1 align-items-center mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Location
          </label>
          <div class="col-md-8">
            <input
              type="text"
              className="form-control"
              aria-label="Text input with segmented dropdown button"
              placeholder="search..."
              onChange={handleSearchChange}
            />
          </div>
          <div class="col-md-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleSearch}
            >
              search
            </button>
            &nbsp;
            <button
              type="button"
              className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></button>
            <ul className="dropdown-menu dropdown-menu-end">
              {selete.length > 0 ? (
                selete.map((option, index) => (
                  <li key={index}>
                    <a
                      className="dropdown-item"
                      value={option.namelocation}
                      onClick={() => handleDropdownType(option.namelocation)}
                    >
                      {option.namelocation}
                    </a>
                  </li>
                ))
              ) : (
                <li className="center"> * No results found * </li>
              )}
            </ul>
          </div>
          <div class="col-md-2">{LocationValue}</div>
        </div>
        {/* submit botton */}
        <div className="right">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
