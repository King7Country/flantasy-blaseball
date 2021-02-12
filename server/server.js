const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require("path");
const app = express();
const draftRoutes = require("./endpoints/draft");
const usersRoutes = require("./endpoints/users");
const simRoutes = require("./simulation/simulation");

const PORT = process.env.PORT || 7877;
// const warehousesRoute = require("./routes/warehouses");
// const inventoriesRoute = require("./routes/inventories")
// const uuid4 = require('uuid4');

// the API docs: https://api.blaseball-reference.com/docs#/
const URL = 'https://api.blaseball-reference.com/v1';
const ALL_PLAYERS = `${URL}/allPlayers?includeShadows=false`; // no shadows
const PLAYER_STATS = `${URL}playerStats?category=` // takes in ${statType}&${playerId} to complete the url
// https://api.blaseball-reference.com/v1/playerStats?category=pitching&season=10&playerIds=
const PITCHING_STATS = 'https://api.blaseball-reference.com/v1/playerStats?category=pitching&season=10&playerIds=';
const BATTING_STATS = 'https://api.blaseball-reference.com/v1/playerStats?category=batting&season=10&playerIds=';
//Need to implement latest season stats

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", draftRoutes);
app.use("/", usersRoutes)
app.use("/", simRoutes);



if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("../client/build"));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
    });
  }

app.listen(PORT, () => console.log(`Server's up! Running hard on port: ${PORT}`));



