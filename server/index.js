const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mysql = require("mysql");

var bodyParser = require("body-parser");

//useApi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

//mySql Authen
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smart",
});

connection.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Connected to MySQL Authen database");
  }
});

//login
var jwt = require("jsonwebtoken");
const passuser = "592901001";
const passadmin = "592901002";
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jsonParser = bodyParser.json();

app.post("/login", jsonParser, function (req, res, next) {
  connection.query(
    "SELECT * FROM users WHERE username=?",
    [req.body.username],
    function (err, users, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (users.length == 0) {
        res.json({ status: "error", message: "no user" });
        return;
      }
      bcrypt.compare(
        req.body.password,
        users[0].password,
        function (err, isLogin) {
          if (isLogin) {
            if (users[0].type === "admin") {
              var token = jwt.sign({ username: users[0].username }, passadmin, {
                expiresIn: "1h",
              });

              connection.query(
                "SELECT name, location FROM users WHERE username=?",
                [req.body.username],
                function (err, Result, fields) {
                  if (err) {
                    res.json({ status: "error", message: err });
                    return;
                  }

                  const name = Result[0] ? Result[0].name : null;
                  const location = Result[0] ? Result[0].location : null;

                  res.json({
                    status: "okAdmin",
                    message: "your login",
                    token,
                    name,
                    location,
                  });
                }
              );

              return;
            }
            if (users[0].type === "user") {
              var token = jwt.sign({ username: users[0].username }, passuser, {
                expiresIn: "1h",
              });

              connection.query(
                "SELECT name, location FROM users WHERE username = ?",
                [req.body.username],
                function (err, Result, fields) {
                  if (err) {
                    res.json({ status: "error", message: err });
                    return;
                  }

                  const name = Result[0] ? Result[0].name : null;
                  const location = Result[0] ? Result[0].location : null;

                  res.json({
                    status: "okUser",
                    message: "your login",
                    token,
                    name,
                    location,
                  });
                }
              );

              return;
            }
          } else if (err) {
            res.json({ status: "error", message: "your not login" });
          }
        }
      );
    }
  );
});

// authenAdmin
app.post("/authenAdmin", jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, passadmin);
    res.json({ status: "ok", decoded });
    console.log("send authen to front it ok" + decoded);
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

// authenUser
app.post("/authenUser", jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, passuser);
    res.json({ status: "ok", decoded });
    console.log("send authen to front it ok" + decoded);
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

//register
app.post("/register", jsonParser, function (req, res, next) {
  const thaiRegex = /[ก-ฮฯ]/;
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [req.body.username],
    function (err, results, fields) {
      if (
        req.body.username.length === 0 ||
        req.body.password.length === 0 ||
        req.body.name.length === 0 ||
        req.body.type.length === 0 ||
        req.body.location.length === 0
      ) {
        res.json({
          status: "space",
          message: "Please enter a message",
        });
      } else if (
        thaiRegex.test(req.body.username) ||
        thaiRegex.test(req.body.password) ||
        thaiRegex.test(req.body.name) ||
        thaiRegex.test(req.body.type) ||
        thaiRegex.test(req.body.location)
      ) {
        res.json({
          status: "thai",
          message: "Please enter a message with eng",
        });
      } else if (results.length > 0) {
        res.json({ status: "have", message: "Username already exists" });
      } else if (
        req.body.password.length > 18 ||
        req.body.username.length > 18 ||
        req.body.name.length > 18
      ) {
        res.json({
          status: "too",
          message: "user password and name longer than 18 characters",
        });
      } else {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          // ดึง id จากตาราง location ตาม req.body.location
          const locationName = req.body.location;

          connection.query(
            "SELECT id FROM location WHERE namelocation = ?",
            [locationName],
            function (err, results, fields) {
              if (err) {
                res.json({ status: "error", message: err });
                return;
              }

              if (results.length === 0) {
                res.json({ status: "error", message: "Location not found." });
                return;
              }

              const locationId = results[0].id;

              connection.query(
                "INSERT INTO newusers (username ,password ,name ,location ,type) VALUES (?,?,?,?,?)",
                [
                  req.body.username,
                  hash,
                  req.body.name,
                  locationId,
                  req.body.type,
                ],
                function (err, results, fields) {
                  if (err) {
                    res.json({ status: "error", message: err });
                    console.log(err);
                    return;
                  }
                  res.json({ status: "ok" });
                  console.log("This order is good");
                }
              );
            }
          );
        });
      }
    }
  );
});

//viewnewregister
app.get("/viewNewRegister", (req, res) => {
  connection.query(
    "SELECT newusers.*, location.namelocation FROM newusers INNER JOIN location ON newusers.location = location.id",
    (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).json({ error: "An error occurred" });
      } else {
        res.json(result);
      }
    }
  );
});

app.post("/approveNewRegister", (req, res) => {
  connection.query(
    "SELECT * FROM newusers WHERE id = ?",
    [req.body.id],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.error("error:", selectErr);
        return res.status(500).json({ error: "error" });
      }

      if (selectResults.length === 0) {
        return res.status(404).json({ error: "on have user" });
      }
      // result of id form api
      const approvedUser = selectResults[0];
      // insert new user to table users

      connection.query(
        "INSERT INTO users (id, username, password, name, location, type) VALUES (?, ?, ?, ?, ?, ?)",
        [
          approvedUser.id,
          approvedUser.username,
          approvedUser.password,
          approvedUser.name,
          approvedUser.location,
          approvedUser.type,
        ],
        (insertErr) => {
          if (insertErr) {
            console.error("error insert data:", insertErr);
            return res.status(500).json({ error: "error insert data" });
          }

          // del new user before insert to table user

          connection.query(
            "DELETE FROM newusers WHERE id = ?",
            [approvedUser.id],
            (error) => {
              if (error) {
                console.error(
                  "error form del new user before insert to table user:",
                  error
                );
                return res.status(500).json({
                  error: "error form del new user before insert to table user",
                });
              }
              console.log("approvedUser succes");
              return res.status(200).json({ message: "approvedUserSucces" });
            }
          );
        }
      );
    }
  );
});

//del new user
app.delete("/disapproveNewRegister", (req, res) => {
  // del new user before insert to table user
  connection.query(
    "DELETE FROM newusers WHERE id = ?",
    [req.query.id],
    (error) => {
      if (error) {
        console.error("error form del new user:", error);
        return res.status(500).json({ error: "error form del new user" });
      }
      return res.status(200).json({ message: "disapproveUserSucces" });
    }
  );
});

//crud user
//read user
app.get("/viewUser", (req, res) => {
  connection.query(
    "SELECT users.*, location.namelocation FROM users INNER JOIN location ON users.location = location.id",
    (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).json({ error: "An error occurred" });
      } else {
        res.json(result);
      }
    }
  );
});

//delete user
app.delete("/deleteUser", (req, res) => {
  if (req.query.id == "1008") {
    res.json({ message: "admin" });
  } else {
    connection.query(
      "DELETE FROM users WHERE id = ?",
      [req.query.id],
      (error) => {
        if (error) {
          console.error("error form del user:", error);
          res.status(500).json({ error: "error form del user" });
        }
        res.json({ message: "success" });
      }
    );
  }
});

//location for client
app.post("/viewLocation", (req, res) => {
  try {
    const selectedType = req.body.selectedType;

    connection.query(
      `SELECT * FROM location WHERE namelocation LIKE '%${selectedType}%'`,
      (err, result) => {
        if (err) {
          console.error(err.message);
        } else if (selectedType == 0) {
          res.json(result);
        } else if (result.length == 0) {
          res.json({ status: "nohave" });
        } else {
          res.json(result);
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการร้องขอ API" });
  }
});

//Crud Location
//read
app.get("/readLocation", (req, res) => {
  connection.query("SELECT * FROM location", (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).json({ error: "An error occurred" });
    } else {
      res.json(result);
    }
  });
});

//Create
app.post("/createLocation", (req, res) => {
  const thaiRegex = /[ก-ฮฯ]/;
  if (req.body.locationName.length == 0 || req.body.locationName.length > 20) {
    res.json({ message: "onhave&too" });
  } else if (thaiRegex.test(req.body.locationName)) {
    res.json({ message: "thai" });
  } else {
    connection.query(
      "INSERT INTO location (namelocation) VALUES (?)",
      [req.body.locationName],
      (err, result) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          res.status(500).json({ error: "An error occurred" });
        } else {
          res.json({ message: "success" });
        }
      }
    );
  }
});

//delete location
app.delete("/deleteLocation", (req, res) => {
  if (req.query.id == "1024") {
    res.json({ message: "admin" });
  } else {
    connection.query(
      "DELETE FROM location WHERE id = ?",
      [req.query.id],
      (error) => {
        if (error) {
          console.error("error form del location:", error);
          res.status(500).json({ error: "error form del location" });
        }
        res.json({ message: "success" });
      }
    );
  }
});

//edit location
app.post("/editLocation", (req, res) => {
  const thaiRegex = /[ก-ฮฯ]/;
  if (req.body.name.length == 0 || req.body.name.length > 20) {
    res.json({ message: "onhave&too" });
  } else if (thaiRegex.test(req.body.name)) {
    res.json({ message: "thai" });
  } else {
    connection.query(
      "UPDATE location SET namelocation = ? WHERE id = ?",
      [req.body.name, req.body.id],
      (error) => {
        if (error) {
          console.error("error form edit location:", error);
          res.status(500).json({ error: "error form edit location" });
          console.log(req.body.name);
        }
        res.json({ message: "success" });
      }
    );
  }
});

//type crud
//read
app.post("/readType", (req, res) => {
  const locationIdInput = req.body.locationIdInput;
  connection.query(
    "SELECT * FROM type WHERE locationid LIKE ?",
    [locationIdInput],
    (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).json({ error: "An error occurred" });
      } else {
        res.json(result);
      }
    }
  );
});

app.post("/filterType", (req, res) => {
  const SearchType = req.body.SearchType;
  const SearchLocation = req.body.SearchLocation;
  let sqlCode = `SELECT nametype FROM type WHERE locationid LIKE '%${SearchLocation}%' AND nametype LIKE '%${SearchType}%';`;
  if (!SearchLocation) {
    sqlCode = `SELECT nametype FROM type WHERE nametype LIKE '%${SearchType}%';`;
  } else if (!SearchType) {
    sqlCode = `SELECT nametype FROM type WHERE locationid LIKE '%${SearchLocation}%';`;
  }
  connection.query(sqlCode, (err, result) => {
    if (err) {
      console.error(err);
    } else if (result.length == 0) {
      res.json({ message: "nohave" });
    } else {
      res.json(result);
    }
  });
});

//Create
app.post("/createType", (req, res) => {
  if (req.body.typeName.length == 0 || req.body.typeName.length > 20) {
    res.json({ message: "onhave&too" });
  } else {
    connection.query(
      "INSERT INTO type (nametype, locationid) VALUES (?, ?)",
      [req.body.typeName, req.body.locationid],
      (err, result) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          res.status(500).json({ error: "An error occurred" });
        } else {
          res.json({ message: "success" });
        }
      }
    );
  }
});

//delete
app.delete("/deleteType", (req, res) => {
  connection.query("DELETE FROM type WHERE id = ?", [req.query.id], (error) => {
    if (error) {
      console.error("error form del Type:", error);
      res.status(500).json({ error: "error form del Type" });
    }
    res.json({ message: "success" });
  });
});

//edit location
app.post("/editType", (req, res) => {
  if (req.body.name.length == 0 || req.body.name.length > 20) {
    res.json({ message: "onhave&too" });
  } else {
    connection.query(
      "UPDATE type SET nametype = ?, locationid = ? WHERE id = ?",
      [req.body.name, req.body.location, req.body.id],
      (error) => {
        if (error) {
          console.error("error form edit location:", error);
          res.status(500).json({ error: "error form edit location" });
          console.log(req.body.name);
        }
        res.json({ message: "success" });
      }
    );
  }
});

//card crud data
// create
app.post("/createCard", (req, res) => {
  const formData = req.body;
  const { name, content, address, timeopen, timeclose, img64, location, type } =
    formData;
  console.log(img64);
  connection.query(
    "SELECT * FROM contents WHERE name = ? ",
    [req.body.name],
    function (err, results, fields) {
      if (results.length > 0) {
        res.json({ status: "have", message: "name already exists" });
      } else {
        connection.query(
          "INSERT INTO contents (name, content, address, timeopen, timeclose, img64, location, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            name,
            content,
            address,
            timeopen,
            timeclose,
            JSON.stringify(img64),
            location,
            type,
          ],
          (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).send("upload database not success");
            } else {
              console.log(results);
              res.status(200).send("upload database success");
            }
          }
        );
      }
    }
  );
});

app.post("/readCard", (req, res) => {
  connection.query(
    "SELECT * FROM contents WHERE location = ?",
    [req.body.location],
    (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).json({ error: "An error occurred" });
      } else {
        //JSON.parse(result[0].img64);
        res.json(result);
      }
    }
  );
});

app.post("/filterCard", (req, res) => {
  const { location, selectedTypes } = req.body;
  let sql = "SELECT * FROM contents WHERE location = ?";
  const queryParams = [location];

  if (selectedTypes.length > 0) {
    sql += " AND type IN (?)";
    queryParams.push(selectedTypes);
  }

  connection.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.length === 0) {
        res.json({ status: "nodata" });
      } else {
        res.json(results);
      }
    }
  });
});

app.delete("/deleteCard", (req, res) => {
  connection.query(
    "DELETE FROM contents WHERE id = ?",
    [req.query.id],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.json({ message: "deleteCardSucces" });
        console.log("good");
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
