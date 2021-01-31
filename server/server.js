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
      // console.log("ids:", pitcherIds.length);

      // let halfPitcherIds = Math.floor(pitcherIds.length / 2)
      // let pitcherIdsFirstHalf = pitcherIds.slice(0, halfPitcherIds);
      // let pitcherIdsSecondHalf = pitcherIds.slice(halfPitcherIds, pitcherIds.length);

      axios.get(`${PITCHING_STATS}${pitcherIds}`)
      .then(response => {
          console.log("pitcher res: ", response.data.length);
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
//API endpount takes in a list of player id's seperated by a comma
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
//API endpount takes in a list of player id's seperated by a comma
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


//
// SIMULATED DATA 
//to similate games being played during the off season

//get a random number
const simulatedPoints = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

//PITCHERS
//API endpount takes in one user id
app.get("/simulated-pitchers/:id", (req,res) => {
  let reqPitchers = req.url.substring('/simulated-pitchers/'.length)
  // console.log("reqPitchers substring: ", reqPitchers)

  reqPitchers = reqPitchers.split(",");
  // console.log("reqPitchers split: ", reqPitchers)
  const simulatePitcherPromise = new Promise((resolve, reject) => {

  
    // get all players
    axios.get(`${ALL_PLAYERS}`)
    .then(response => {
      let data = response.data;
      
      //filter for only pitchers
      let pitchers = [];
      data.map(player => {
        reqPitchers.map(reqPitcher => {

          if (player.player_id ===  reqPitcher) {
            pitchers.push(player);
          }
        })
      })

      // assign the simulated points
      let simulatedPitchersList = [];
      pitchers.map(pitcher => {
      let simulatedPitcher = {};
         
        simulatedPitcher.batters_faced = simulatedPoints(5);
        simulatedPitcher.bb_per_9 = simulatedPoints(5);
        simulatedPitcher.era = simulatedPoints(5);
        simulatedPitcher.games = 0;
        simulatedPitcher.hits_allowed = simulatedPoints(5);
        simulatedPitcher.hits_per_9 = simulatedPoints(5);
        simulatedPitcher.hpbs = simulatedPoints(5);
        simulatedPitcher.hr_per_9 = simulatedPoints(5);
        simulatedPitcher.hrs_allowed = simulatedPoints(5);
        simulatedPitcher.innings = simulatedPoints(5);
        simulatedPitcher.k_bb = simulatedPoints(5);
        simulatedPitcher.k_per_9 = simulatedPoints(5);
        simulatedPitcher.losses = simulatedPoints(5);
        simulatedPitcher.outs_recorded = simulatedPoints(5);
        simulatedPitcher.pitch_count = simulatedPoints(5);
        simulatedPitcher.player_id = pitcher.player_id;
        simulatedPitcher.player_name = pitcher.player_name;
        simulatedPitcher.quality_starts = simulatedPoints(5);
        simulatedPitcher.runs_allowed = simulatedPoints(5);
        simulatedPitcher.season = pitcher.season;
        simulatedPitcher.shutouts = simulatedPoints(5);
        simulatedPitcher.strikeouts = simulatedPoints(5);
        simulatedPitcher.team = pitcher.team;
        simulatedPitcher.walks = simulatedPoints(5);
        simulatedPitcher.whip = simulatedPoints(5);
        simulatedPitcher.win_pct = simulatedPoints(5);
        simulatedPitcher.wins = simulatedPoints(5);
        
        simulatedPitchersList.push(simulatedPitcher);
  console.log("simulatedPitcher: ", simulatedPitcher)

      })
  
      return res.status(200).json(simulatedPitchersList)
    })
    .catch(err => console.log("err: ", err))
  })
 
  
});

//batters
//API endpount takes in one user id
app.get("/simulated-batters/:id", (req,res) => {
// const simulatePitcherPromise = new Promise((resolve, reject) => {
  let reqBatters = req.url.substring('/simulated-batters/'.length)
  // console.log("reqPitchers substring: ", reqPitchers)
  
  reqBatters = reqBatters.split(",");
  // console.log("reqPitchers split: ", reqPitchers)
  const simulateBatterPromise = new Promise((resolve, reject) => {
    

  // get all players
  axios.get(`${ALL_PLAYERS}`)
  .then(response => {
  //   console.log("res: ", response)
    let data = response.data;
    
    let batters = [];
    data.map(player => {
      reqBatters.map(reqBatter => { 

        if (player.player_id === reqBatter) {

          batters.push(player);
         }
      })
    })

    // assign the simulated points
    let simulatedBattersList = [];
    batters.map(batter => {
      let simulatedBatter = {};

      simulatedBatter.appearances = simulatedPoints(5);
      simulatedBatter.at_bats =  simulatedPoints(5);
      simulatedBatter.at_bats_risp = simulatedPoints(5);
      simulatedBatter.batting_average = simulatedPoints(5);
      simulatedBatter.batting_average_risp = simulatedPoints(5);
      simulatedBatter.doubles = simulatedPoints(5);
      simulatedBatter.first_appearance = simulatedPoints(5);
      simulatedBatter.flyouts = simulatedPoints(5);
      simulatedBatter.gidps = simulatedPoints(5);
      simulatedBatter.ground_outs = simulatedPoints(5);
      simulatedBatter.hbps = simulatedPoints(5);
      simulatedBatter.hits = simulatedPoints(5);
      simulatedBatter.hits_risps = simulatedPoints(5);
      simulatedBatter.home_runs = simulatedPoints(5);
      simulatedBatter.on_base_percentage = simulatedPoints(5);
      simulatedBatter.on_base_slugging = simulatedPoints(5);
      simulatedBatter.plate_appearances = simulatedPoints(5);
      simulatedBatter.player_id = batter.player_id;
      simulatedBatter.player_name = batter.player_name;
      simulatedBatter.quadruples = simulatedPoints(5);
      simulatedBatter.runs_batted_in = simulatedPoints(5);
      simulatedBatter.strikeouts = simulatedPoints(5);
      simulatedBatter.sacrifices = simulatedPoints(5);
      simulatedBatter.season =  batter.season;
      simulatedBatter.singles = simulatedPoints(5);
      simulatedBatter.slugging = simulatedPoints(5);
      simulatedBatter.team = batter.team;
      simulatedBatter.team_id = batter.team_id;
      simulatedBatter.total_bases = simulatedPoints(5);
      simulatedBatter.triples = simulatedPoints(5);
      simulatedBatter.walks = simulatedPoints(5);

      simulatedBattersList.push(simulatedBatter);
    })

    return res.status(200).json(simulatedBattersList)
  })
  .catch(err => console.log("err: ", err))
  })
});


