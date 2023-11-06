import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./Admin.css";

export default function Location() {
  //Crud of Location
  //read
  const [locationView, setLocationView] = useState([]);
  const handleSearch = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3000/readLocation",
        {}
      );

      if (response.data.status == "nodata") {
        alert("plz insert data");
      } else {
        setLocationView(response.data);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  //Create
  const [locationInput, setLocationInput] = useState("");
  const handleChangeLocation = (event) => {
    setLocationInput(event.target.value);
  };
  const handleInsertLocation = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:3000/createLocation",
        {
          locationName: locationInput,
        }
      );
      if (response.data.message == "success") {
        alert("Location inserted successfully!");
        handleSearch();
      } else if (response.data.message == "onhave&too") {
        alert("Fill in your message and use no more than 20 characters.");
        handleSearch();
      } else if (response.data.message == "thai") {
        alert("You should not type in Thai .");
        handleSearch();
      } else {
        alert("Failed to create location.");
        handleSearch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Delete Location
  const handleDelete = async (itemId) => {
    try {
      const response = await Axios.delete(
        "http://localhost:3000/deleteLocation",
        { params: { id: itemId } }
      );
      if (response.data.message == "success") {
        alert("Item deleted successfully.");
        handleSearch();
      } else if (response.data.message == "admin") {
        alert("you can not delete login.");
        handleSearch();
      } else {
        alert("Failed to delete location.");
        handleSearch();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  //edit location
  const [editLocation, setEditLocation] = useState([]);
  const changeEdit = (event) => {
    setEditLocation(event.target.value);
  };
  const handleEdit = async (itemId) => {
    event.preventDefault();
    try {
      const response = await Axios.post("http://localhost:3000/editLocation", {
        id: itemId,
        name: editLocation,
      });
      if (response.data.message == "success") {
        alert("Item edit successfully.");
        handleSearch();
      } else if (response.data.message == "onhave&too") {
        alert("Fill in your message and use no more than 20 characters.");
        handleSearch();
      } else if (response.data.message == "thai") {
        alert("You should not type in Thai .");
        handleSearch();
      } else {
        alert("Failed to insert location.");
        handleSearch();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="wid90-m3">
      <div className="wid95-m3">
        <h1>Locations</h1>
        <h4>Create New Location</h4>
        <form class="row g-3 mb-2">
          <div class="col-auto">
            <input
              class="form-control"
              type="text"
              placeholder="Insert New Location"
              aria-label="default input example"
              value={locationInput}
              onChange={handleChangeLocation}
            />
          </div>
          <div class="col-auto">
            <button
              type="button"
              class="btn btn-primary"
              onClick={handleInsertLocation}
            >
              Insert
            </button>
          </div>
        </form>
        {locationView.length === 0 ? (
          <p>No Location.</p>
        ) : (
          <ul>
            {locationView.map((item) => (
              <div key={item.id} className="border">
                <div className="border-basic">
                  {item.id} {item.namelocation}
                  <form className="row g-3 justify-content-end">
                    <div class="col-auto">
                      <input
                        type="text"
                        class="form-control"
                        id="edit"
                        placeholder="Edit"
                        onChange={changeEdit}
                      />
                    </div>
                    <div class="col-auto">
                      <button
                        type="submit"
                        class="btn btn-warning mb-3"
                        onClick={() => handleEdit(item.id)}
                      >
                        edit
                      </button>
                    </div>
                    <div class="col-auto">
                      <button
                        type="button"
                        class="btn btn-danger mb-3"
                        onClick={() => handleDelete(item.id)}
                      >
                        delete
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
