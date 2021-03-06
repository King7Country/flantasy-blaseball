const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();


app.use(express.json());
app.use(cors());


const URL = 'https://api.blaseball-reference.com/v1';
const ALL_PLAYERS = `${URL}/allPlayers?includeShadows=false`; // no shadows
const PITCHING_STATS = 'https://api.blaseball-reference.com/v1/playerStats?category=pitching&season=10&playerIds=';
const BATTING_STATS = 'https://api.blaseball-reference.com/v1/playerStats?category=batting&season=10&playerIds=';


// PITCHING STATS

app.get("/pitchers", (_req,res) => {
    // get all players
    axios.get(`${ALL_PLAYERS}`)
    .then(response => {
      let data = response.data;
      
      let pitchers = [];
      data.map(player => {
          if (player.position_type === "PITCHER") {
          return pitchers.push(player);
          }
      })

      let pitcherIds = [];
      pitchers.map(pitcher => {
        let id = pitcher.player_id ;
        return pitcherIds.push(id);
      })

      axios.get(`${PITCHING_STATS}${pitcherIds}`)
      .then(response => {
          let pitchingStats = response.data;
          return res.status(200).send(pitchingStats)
      })
    })
    .catch(err => console.log("err: ", err))
});


// BATTING STATS

app.get("/batters", (_req,res) => {
    // get all players
    axios.get(`${ALL_PLAYERS}`)
    .then(response => {
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

      //too many http headers to send at once, split in half first
      /* *** NOT RETURNING CORRECT AMOUNT OF PLAYERS??? *** */
      let halfBatterIds = Math.floor(batterIds.length / 3)
      let batterIdsFirstHalf = batterIds.slice(0, halfBatterIds);
      // let batterIdsSecondHalf = batterIds.slice(halfBatterIds, batterIds.length);
    
      let batterResponse = [];
      axios.get(`${BATTING_STATS}${batterIdsFirstHalf}`)
      .then(response => {
        
          response.data.map(item => {
            return batterResponse.push(item);
          })

          const battingStats = batterResponse;
          return res.status(200).send(battingStats)
      })
    //   .then(response => {
    //     battingStats = response;
    //     axios.get(`${BATTING_STATS}${batterIdsSecondHalf}`)
    //     .then(response => {
    //       response.data.map(item => {
    //         return batterResponse.push(item);
    //       })
    //       const battingStats = batterResponse;
    //       return res.status(200).send(battingStats)
    //     })
    //   })
    // .catch(err => console.log("err: ", err))

    })
    .catch(err => console.log("err: ", err))
});


module.exports = app