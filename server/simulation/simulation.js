const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const PITCHING_STATS = 'https://api.blaseball-reference.com/v1/playerStats?category=pitching&season=10&playerIds=';
const BATTING_STATS = 'https://api.blaseball-reference.com/v1/playerStats?category=batting&season=10&playerIds=';

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
  
    reqPitchers = reqPitchers.split(",");
  
    const simulatePitcherPromise = new Promise((resolve, reject) => {
  
    
      // get players mathing req
      axios.get(`${PITCHING_STATS}${reqPitchers}`)
      .then(response => {
        let pitchers = response.data;
        pitchers = convertIntObj(pitchers);
  
        // assign the simulated points
        let simulatedPitchersList = [];
        pitchers.map(pitcher => {
        let simulatedPitcher = {};
           
          simulatedPitcher.batters_faced =  pitcher.batters_faced + (simulatedPoints(5) * numberOfSimGames) ;
          simulatedPitcher.bb_per_9 = pitcher.bb_per_9 + (simulatedPoints(5) * numberOfSimGames);
          simulatedPitcher.era =  pitcher.era + (simulatedPoints(5) * numberOfSimGames);
          simulatedPitcher.games = pitcher.games + 1;
          simulatedPitcher.hits_allowed = pitcher.hits_allowed + (simulatedPoints(25) * numberOfSimGames);
          simulatedPitcher.hits_per_9 = pitcher.hits_per_9 + (simulatedPoints(25) * numberOfSimGames);
          simulatedPitcher.hpbs =  pitcher.hpbs + (simulatedPoints(5) * numberOfSimGames);
          simulatedPitcher.hr_per_9 = pitcher.hr_per_9 + (simulatedPoints(5) * numberOfSimGames);
          simulatedPitcher.hrs_allowed = pitcher.hrs_allowed + (simulatedPoints(5) * numberOfSimGames);
          simulatedPitcher.innings = pitcher.innings + (simulatedPoints(9) * numberOfSimGames);
          simulatedPitcher.k_bb = pitcher.k_bb + (simulatedPoints(5) * numberOfSimGames);
          simulatedPitcher.k_per_9 = pitcher.k_per_9 + (simulatedPoints(5) * numberOfSimGames);
          simulatedPitcher.losses = pitcher.losses + (simulatedPoints(1) * numberOfSimGames);
          simulatedPitcher.outs_recorded = pitcher.outs_recorded + (simulatedPoints(12) * numberOfSimGames);
          simulatedPitcher.pitch_count = pitcher.pitch_count + (simulatedPoints(25) * numberOfSimGames);
          simulatedPitcher.player_id = pitcher.player_id;
          simulatedPitcher.player_name = pitcher.player_name;
          simulatedPitcher.quality_starts = pitcher.quality_starts + (simulatedPoints(1) * numberOfSimGames);
          simulatedPitcher.runs_allowed = pitcher.runs_allowed + (simulatedPoints(15) * numberOfSimGames);
          simulatedPitcher.season = pitcher.season;
          simulatedPitcher.shutouts = pitcher.shutouts + (simulatedPoints(1) * numberOfSimGames);
          simulatedPitcher.strikeouts = pitcher.strikeouts + (simulatedPoints(15) * numberOfSimGames);
          simulatedPitcher.team = pitcher.team;
          simulatedPitcher.walks = pitcher.walks + (simulatedPoints(5) * numberOfSimGames);
          simulatedPitcher.whip = pitcher.whip + (simulatedPoints(5) * numberOfSimGames);
          simulatedPitcher.win_pct = pitcher.win_pct + (simulatedPoints(5) * numberOfSimGames);
          simulatedPitcher.wins = pitcher.wins + ((simulatedPoints(2) + simulatedPoints(2)) + simulatedPoints(1) * numberOfSimGames);
          
          simulatedPitchersList.push(simulatedPitcher);
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
  
    
    reqBatters = reqBatters.split(",");
  
    // const simulateBatterPromise = new Promise((resolve, reject) => {
      
    // get players matching req
    axios.get(`${BATTING_STATS}${reqBatters}`)
    .then(response => {
      let batters = response.data;
      batters = convertIntObj(batters);
      
      // assign the simulated points
      let simulatedBattersList = [];
      batters.map(batter => {
        let simulatedBatter = {};
  
  
        simulatedBatter.appearances = batter.appearances + 1;
        simulatedBatter.at_bats =  batter.at_bats + (simulatedPoints(15) * numberOfSimGames);
        simulatedBatter.at_bats_risp =  batter.at_bats_risp + (simulatedPoints(15) * numberOfSimGames);
        simulatedBatter.batting_average = batter.batting_average + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.batting_average_risp = batter.batting_average_risp + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.doubles = batter.doubles + (simulatedPoints(2) * numberOfSimGames);
        simulatedBatter.first_appearance = batter.first_appearance + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.flyouts = batter.flyouts + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.gidps = batter.gidps + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.ground_outs = batter.ground_outs + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.hbps = batter.hbps + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.hits = batter.hits + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.hits_risps = batter.hits_risps + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.home_runs = batter.home_runs + (simulatedPoints(2) * numberOfSimGames);
        simulatedBatter.on_base_percentage =  batter.on_base_percentage + (simulatedPoints(15) * numberOfSimGames);
        simulatedBatter.on_base_slugging = batter.on_base_slugging + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.plate_appearances = batter.plate_appearances + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.player_id = batter.player_id;
        simulatedBatter.player_name = batter.player_name;
        simulatedBatter.quadruples = batter.quadruples + (simulatedPoints(1) * numberOfSimGames);
        simulatedBatter.runs_batted_in = batter.runs_batted_in + (simulatedPoints(4) * numberOfSimGames);
        simulatedBatter.strikeouts = batter.strikeouts + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.sacrifices = batter.sacrifices + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.season = batter.season;
        simulatedBatter.singles = batter.singles + (simulatedPoints(4) * numberOfSimGames);
        simulatedBatter.slugging = batter.slugging + (simulatedPoints(5) * numberOfSimGames);
        simulatedBatter.team = batter.team;
        simulatedBatter.team_id = batter.team_id;
        simulatedBatter.total_bases = batter.total_bases + (simulatedPoints(9) * numberOfSimGames);
        simulatedBatter.triples = batter.triples + (simulatedPoints(2) * numberOfSimGames);
        simulatedBatter.walks = batter.walks + (simulatedPoints(5) * numberOfSimGames);
  
        simulatedBattersList.push(simulatedBatter);
      })
  
      return res.status(200).json(simulatedBattersList)
    })
    .catch(err => console.log("err: ", err))
    // })
  });
  
    // convert all string "number" values into actual numbers, called in determinePlayerPoints
    // from https://stackoverflow.com/questions/61057507/how-to-convert-object-properties-string-to-integer-in-javascript
    const convertIntObj = (obj) => {
      const result = [];
      for (const key in obj) {
        result[key] = {};
          for (const prop in obj[key]) {
            const parsed = parseInt(obj[key][prop], 10);
            result[key][prop] = isNaN(parsed) ? obj[key][prop] : parsed;
          }
        } 
        return result;
      }
  
      //interval to simulate multiple games being played
      let numberOfSimGames = 1;
      const timer = () => {
          numberOfSimGames++;
      }
      // one minute interval
      // setInterval(timer, 60000);  
       
      // four hour interval
      setInterval(timer, 14400000);   
      

module.exports = app