import React, { useState, useEffect } from "react";
import Axios from "axios";

export default function Type() {
  //Crud of Type
  //location storage
  const [locationIdInput, setLocationIdInput] = useState("");
  //read
  const [typeView, setTypeView] = useState([]);
  const handleSearch = async () => {
    try {
      const location = await localStorage.getItem("location");
      setLocationIdInput(location);

      const response = await Axios.post("http://localhost:3000/readType", {
        locationIdInput: locationIdInput,
      });

      if (response.data.status == "nodata") {
        alert("plz insert data");
      } else {
        setTypeView(response.data);
      }
    } catch (error) {
      console.error("Error fetching Type data:", error);
    }
  };

  //Create
  const [typeInput, setTypeInput] = useState("");

  const handleChangeType = (event) => {
    const location = localStorage.getItem("location");
    setTypeInput(event.target.value);
    setLocationIdInput(location);
  };
  const handleInsertType = async () => {
    try {
      const response = await Axios.post("http://localhost:3000/createType", {
        typeName: typeInput,
        locationid: locationIdInput,
      });
      if (response.data.message == "success") {
        alert("Type inserted successfully!");
        handleSearch();
      } else if (response.data.message == "onhave&too") {
        alert("Fill in your message and use no more than 20 characters.");
        handleSearch();
      } else {
        alert("Failed to create Type.");
        handleSearch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Delete Type
  const handleDelete = async (itemId) => {
    try {
      const response = await Axios.delete("http://localhost:3000/deleteType", {
        params: { id: itemId },
      });
      if (response.data.message == "success") {
        alert("Item deleted successfully.");
        handleSearch();
      } else if (response.data.message == "admin") {
        alert("you can not delete login.");
        handleSearch();
      } else {
        alert("Failed to delete Type.");
        handleSearch();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  //edit Type
  const [editType, setEditType] = useState([]);
  const changeEdit = (event) => {
    setEditType(event.target.value);
    const location = localStorage.getItem("location");
    setLocationIdInput(location);
  };
  const handleEdit = async (itemId) => {
    try {
      const response = await Axios.post("http://localhost:3000/editType", {
        id: itemId,
        name: editType,
        location: locationIdInput,
      });
      if (response.data.message == "success") {
        alert("Item edit successfully.");
        handleSearch();
      } else if (response.data.message == "onhave&too") {
        alert("Fill in your message and use no more than 20 characters.");
        handleSearch();
      } else {
        alert("Failed to insert Type.");
        handleSearch();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [locationIdInput]);

  return (
    <div className="wid90-m3">
      <div className="wid95-m3">
        <h1>Type</h1>
        <h4>Create New Type</h4>
        <form class="row g-3 mb-2">
          <div class="col-auto">
            <input
              class="form-control"
              type="text"
              placeholder="Insert New Type"
              aria-label="default input example"
              value={typeInput}
              onChange={handleChangeType}
            />
          </div>
          <div class="col-auto">
            <button
              type="button"
              class="btn btn-primary"
              onClick={handleInsertType}
            >
              Insert
            </button>
          </div>
        </form>
        {typeView.length === 0 ? (
          <p>No Type.</p>
        ) : (
          <ul>
            {typeView.map((item) => (
              <div key={item.id} className="border">
                <div className="border-basic">
                  {item.nametype}
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
