const express = require('express');
// const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
// const { createProxyMiddleware } = require('http-proxy-middleware');
const port = 7777;
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

// app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(cors());



app.listen(port, () => console.log("Server's up! Running hard on port: http://localhost:7777"));


//
// PITCHING STATS
//

app.get("/pitchers", (_req,res) => {
    // get all players
    axios.get(`${ALL_PLAYERS}`)
    .then(response => {
    //   console.log("res: ", response)
      let data = response.data;
      //loop through the returned list of all players and remove any players that are deceased or have null position data
      // let livingPlayers = [];
      // data.map(item => {
      //   if (!item.deceased && item.position_type) {
      //     let player =  {
      //       id: item.player_id,
      //       name: item.player_name,
      //       team: item.team,
      //       position: item.position_type
      //     }
      //     return livingPlayers.push(player);
      //   }
      // })      
      // console.log("living players:", livingPlayers[0]);
      
      let pitchers = [];
      data.map(player => {
          if (player.position_type === "PITCHER") {
          return pitchers.push(player);
          }
      })
      // console.log("pitchers:", pitchers[0]);

      let pitcherIds = [];
      pitchers.map(pitcher => {
        let id = pitcher.player_id ;
        return pitcherIds.push(id);
      })
      // console.log("ids:", pitcherIds[0]);

      let halfPitcherIds = Math.floor(pitcherIds.length / 2)
      let pitcherIdsFirstHalf = pitcherIds.slice(0, halfPitcherIds);
      let pitcherIdsSecondHalf = pitcherIds.slice(halfpitcherIds, pitcherIds.length);

      axios.get(`${PITCHING_STATS}${pitcherIdsFirstHalf}`)
      .then(response => {
          // console.log("pitcher res: ", response);
          let pitchingStats = response.data;
          return res.status(200).send(pitchingStats)
      })
    })
    .catch(err => console.log("err: ", err))
});


//
// BATTING STATS
//

app.get("/batters", (_req,res) => {
    // get all players
    axios.get(`${ALL_PLAYERS}`)
    .then(response => {
    //   console.log("res: ", response)
      let data = response.data;
      
      let batters = [];
      data.map(player => {
          if (player.position_type !== "PITCHER" && player.position_type !== null && player.player_name !== null) {
            return batters.push(player);
          }
        })

      let batterIds = [];
      batters.map(batter => {
        let id = batter.player_id;
          return batterIds.push(id);
      })
      // console.log("batter Ids: ", batterIds.length)

      //too many http headers to send at once, split in half first
      /* *** NOT RETURNING CORRECT AMOUNT OF PLAYERS??? *** */
      let halfBatterIds = Math.floor(batterIds.length / 2)
      let batterIdsFirstHalf = batterIds.slice(0, halfBatterIds);
      let batterIdsSecondHalf = batterIds.slice(halfBatterIds, batterIds.length);

      let batterResponse = [];
      axios.get(`${BATTING_STATS}${batterIdsFirstHalf}`)
      .then(response => {
          response.data.map(item => {
            return batterResponse.push(item);
          })
      })
      .then(response => {
        battingStats = response;
        axios.get(`${BATTING_STATS}${batterIdsSecondHalf}`)
        .then(response => {
          response.data.map(item => {
            return batterResponse.push(item);
          })
          const battingStats = batterResponse;
          return res.status(200).send(battingStats)
        })
      })
    })
    .catch(err => console.log("err: ", err))
});



//get list of pitchers from API to check scores
app.get("/pitchers-list/:id", (req, res) => {
  const reqPitchersUrl = req.url.substring('/pitchers-list/'.length);
  // console.log("pit req url:",req.url)
  // console.log("pit req url string:", reqPitchersUrl)
  axios.get(`${PITCHING_STATS}${reqPitchersUrl}`)
    .then(response => {
      // console.log("pitchers: ", response.data[0])
      console.log("pit res url:", response.data.length)

      return res.status(200).json(response.data)
    })
    .catch(err => console.log("err: ", err))
})

//get list of batters from API to check scores
app.get("/batters-list/:id", (req, res) => {
  // console.log(res.url)
  const reqBattersUrl = req.url.substring('/batters-list/'.length);
  // console.log("bat req url:",req.url)
  // console.log("bat req url string:", reqBattersUrl)
  axios.get(`${BATTING_STATS}${reqBattersUrl}`)
    .then(response => {
      // console.log("batters: ", response.data[0])
      return res.status(200).json(response.data)
    })
    .catch(err => console.log("err: ", err))
})



