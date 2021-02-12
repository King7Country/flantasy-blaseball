const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const PITCHING_STATS = 'https://api.blaseball-reference.com/v1/playerStats?category=pitching&season=10&playerIds=';
const BATTING_STATS = 'https://api.blaseball-reference.com/v1/playerStats?category=batting&season=10&playerIds=';


//get list of pitchers from API to check scores
//API endpount takes in a list of player id's seperated by a comma
app.get("/pitchers-list/:id", (req, res) => {
    const reqPitchersUrl = req.url.substring('/pitchers-list/'.length);
  
    axios.get(`${PITCHING_STATS}${reqPitchersUrl}`)
      .then(response => {
  
        return res.status(200).json(response.data)
      })
      .catch(err => console.log("err: ", err))
  })
  
  //get list of batters from API to check scores
  //API endpount takes in a list of player id's seperated by a comma
  app.get("/batters-list/:id", (req, res) => {
  
    const reqBattersUrl = req.url.substring('/batters-list/'.length);
  
    axios.get(`${BATTING_STATS}${reqBattersUrl}`)
      .then(response => {
  
        return res.status(200).json(response.data)
      })
      .catch(err => console.log("err: ", err))
  })
  
  
module.exports = app
  