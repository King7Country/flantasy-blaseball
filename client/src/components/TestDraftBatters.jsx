import React from "react"
import axios from "axios"
import fire from "../config/fire";
import { v4 as uuidv4 } from 'uuid';
import NameModal from '../components/NameModal/NameModal'
// import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";


// If all players are authenticated and logged in, can give them access to the same (instanced) list of players to select from. That way if the list updates then it should update for all users! (thatnks Ashley!)

// If CORS doesn't work try making axios calls from back-end. getrequest to my server which will have an axios call to the blasball API endpoint. Then return the res from axios in my req.body to my client. (thanks Hussein)
// cors-anywhere API: 
// const CORS = 'https://cors-anywhere.herokuapp.com/';
//Currently using CORS browser extension - for now

// Blaseball official API key - not in use
// const API_ALL_TEAMS = 'https://www.blaseball.com/database/allTeams';
// const API_PLAYERS = 'https://www.blaseball.com/database/players?ids='


// the API docs: https://api.blaseball-reference.com/docs#/
const URL = 'https://api.blaseball-reference.com/v1';
const ALL_PLAYERS = `${URL}/allPlayers?includeShadows=false`; // no shadows
const PLAYER_STATS = `${URL}playerStats?category=` // takes in ${statType}&${playerId} to complete the url
const PITCHING_STATS = 'https://api.blaseball-reference.com/v1/playerStats?category=pitching&playerIds=';
const BATTING_STATS = 'https://api.blaseball-reference.com/v1/playerStats?category=batting&playerIds=';
let statType;

class TestDraftBatters extends React.Component {

  state = {
    playerList: [],
    // pitchingStats: [],
    battingStats: [],
   
    showModal: true,
    teamName: "",
    active: "--pitchers",
    // draftedPitchers: [],
    draftedBatters: [],
  }

  componentDidMount() {
    // axios.get('http://localhost:7777/pitchers')
    // .then(res => {
    //   this.setState({pitchingStats: res.data})
    // })
    // .catch(err => console.log("err pitch: ", err));
    axios.get('http://localhost:7777/batters')
    .then(res => {
      console.log("res: ", res)
      this.setState({battingStats: res.data})
    })
    .catch(err => console.log("err bat: ", err));
  }

  componentDidUpdate() {

  }

  handleTeamName = (name) => {
    this.setState({teamName: name})
    console.log("newState: ", this.state.teamName)
  }

  handleCloseModal = (event) => {
    this.setState({showModal: false})
    console.log("showModal: ", this.state.showModal)
  }

  handleTab(event) {
    if (this.state.active === "--pitchers" && event.target.value === "batters-tab") {
      this.setState({active: "--batters"})
    } else if (this.state.active === "--batters" && event.target.value === "pitchers-tab") {
      this.setState({active: "--pitchers"})
    }

    // this.state.active === "--pitchers" ? this.setState({active: "--batters"}) : this.setState({active: "--pitchers"})
  }

  // handleDraftedPitcher(event, draftedPlayer) {
  //   event.preventDefault();
  //   // init array, push to array, set state: array
  //   let draftedPitchersList = this.state.draftedPitchers.slice();
  //   draftedPitchersList.unshift(draftedPlayer);

  //   this.setState({
  //     draftedPitchers: draftedPitchersList,
  //   })

  //   const updatedPitchingStats = this.state.pitchingStats.filter(player => {
  //     return player !== draftedPlayer
  //   })
  //   // console.log("updated state: ",updatedPitchingStats)
  //   this.setState({pitchingStats: updatedPitchingStats})
  // }

  // handleDraftedBatter(event, draftedPlayer) {
  //   event.preventDefault();
  //   // init array, push to array, set state: array
  //   let draftedBattersList = this.state.draftedBatters.slice();
  //   draftedBattersList.unshift(draftedPlayer);

  //   this.setState({
  //     draftedBatters: draftedBattersList,
  //   })

  //   const updatedBattingStats = this.state.battingStats.filter(player => {
  //     return player !== draftedPlayer
  //   })
  //   console.log("updated state: ", updatedBattingStats)
  //   this.setState({battingStats: updatedBattingStats})
  // }

///////////////////////

// handle draft for both tyoes of players
  handleDraftedPlayer(event, draftedPlayer) {
    event.preventDefault();
    //check if pitcher and update the draftedPitcher and pitchingStats states
    // if (event.target.value === "draftPitcher") {
    //   // init array, push to array, set state: new array
    //   let draftedPitchersList = this.state.draftedPitchers.slice();
    //   draftedPitchersList.unshift(draftedPlayer);
    //   this.setState({
    //     draftedPitchers: draftedPitchersList,
    //   })
    //   // filter pitchingStats state, remove the selected player, and save to new array. Set state: new array
    //   const updatedPitchingStats = this.state.pitchingStats.filter(player => {
    //     return player !== draftedPlayer
    //   })
    //   this.setState({pitchingStats: updatedPitchingStats})
    //   // console.log("updated state: ",updatedPitchingStats)
    // }
    // //check if batter and update the draftedBatter and battingStats states
    // else if (event.target.value === "draftBatter") {
      console.log("batter - draftPlayer: ", draftedPlayer)
       // init array, push to array, set state: array
    let draftedBattersList = this.state.draftedBatters.slice();
    draftedBattersList.unshift(draftedPlayer);
  
    this.setState({
      draftedBatters: draftedBattersList,
    })
    console.log("draftedBatters: ", this.state.draftedBatters)

    const updatedBattingStats = this.state.battingStats.filter(player => {
      return player !== draftedPlayer
    })
    this.setState({battingStats: updatedBattingStats})
    console.log("updated batting state: ", this.state.battingStats)

    // }
  }

/////////////////////


  finishDraft(state) {
    let teamName = this.state.teamName;
    const userId = fire.auth().currentUser.uid;
    let teamId = uuidv4();
    let newTeam = {
      userId: userId,
      teamId: teamId,
      teamName: teamName,
      pitchers: state.draftedPitchers,
      batters: state.draftedBatters,
    }
    fire.database().ref('teams').push(newTeam);
  }

  render() {
    // const pitchingStats = this.state.pitchingStats;
    // const draftedPitchers = this.state.draftedPitchers;
    const battingStats = this.state.battingStats;
    const draftedBatters = this.state.draftedBatters;


    // console.log("battingStats: ", battingStats)
    // console.log("pitchingStats: ", pitchingStats)


    // if (this.state.showModal) {
    //   return (
    //     <NameModal 
    //       showModal={this.state.showModal} 
    //       value={this.state.teamName} 
    //       onChange={this.handleTeamName} 
    //       onClick={this.handleCloseModal} />
    //   )
    // } else 
    if (
        // !this.state.pitchingStats.length && 
        !this.state.battingStats.length ) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <h2>Loading...</h2>
        </div>
      );
    }

    return (
      <div>
        <br/>
        <h2 className="heading">Test Draft</h2>

        {/* <table>
          <caption>{this.state.teamName}</caption>
          <thead>
            <tr>
              <th>
                  Name
              </th>
              <th>
                  Position
              </th>
            </tr>
          </thead>
          <tbody>
          {draftedPitchers.map(pitcher => (
              <tr key={pitcher.id}>
                <td>{pitcher.player_name}</td> 
                <td>Pitcher</td>
                <td>
     
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}

        <table>
        <thead>
            <tr>
              <th>
                  Name
              </th>
              <th>
                  Position
              </th>
            </tr>
          </thead>
          <tbody>
          {draftedBatters.map(batter => (
              <tr key={batter.id}>
                <td>{batter.player_name}</td> 
                <td>Batter</td>
                <td>
     
                </td>
              </tr>
            ))}
          </tbody>
          </table>

        <br/>
        <br/>
        <br/>

        <button
          value="pitchers-tab"
          onClick={event => this.handleTab(event, this.state.active)}
          >Pitchers
        </button>
        <button
          value="batters-tab"
          onClick={event => this.handleTab(event, this.state.active)}
          >Batters
        </button>

        {/* <table className={`tab${this.state.active === "--pitchers" ? '--pitcher' : ""}`}>
          <caption>Pitchers Available</caption>
          <thead>
            <tr>
              <th>
                  Name
              </th>
              <th>
                  Position
              </th>
              <th>
                  W
              </th>
              <th>
                  L
              </th>
              <th>
                  ERA
              </th>
              <th>
                  G
              </th>
              <th>
                  SO
              </th>
              <th>
                  H
              </th>
              <th>
                  O
              </th>
              <th>
                  HR
              </th>
              <th>
                  R
              </th>
            </tr>
          </thead>
          <tbody>
            {pitchingStats.map(pitchingStats => (
              <tr key={pitchingStats.id}>
                <td>{pitchingStats.player_name}</td> 
                <td>Pitcher</td>
                <td>{pitchingStats.wins}</td>
                <td>{pitchingStats.losses}</td>
                <td>{pitchingStats.era}</td>
                <td>{pitchingStats.games}</td>
                <td>{pitchingStats.shutouts}</td>
                <td>{pitchingStats.hits_allowed}</td>
                <td>{pitchingStats.outs_recorded}</td>
                <td>{pitchingStats.hrs_allowed}</td>
                <td>{pitchingStats.runs_allowed}</td>
                <td>
                  <button 
                    className="draft"
                    value="draftPitcher"
                    onClick={event => this.handleDraftedPlayer(event, pitchingStats)}
                      >
                      Draft
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
      
        <table className={`tab${this.state.active === "--batters" ? '--batter' : ""}`}>
          <caption>Batters Available</caption>
          <thead>
            <tr>
              <th>
                  Name
              </th>
              <th>
                  POS
              </th>
              <th>
                  G
              </th>
              <th>
                  AB
              </th>
              <th>
                  H
              </th>
              <th>
                  1B
              </th>
              <th>
                  2B
              </th>
              <th>
                  3B
              </th>
              <th>
                  HR
              </th>
              <th>
                  RBI
              </th>
              <th>
                  SO
              </th>
              <th>
                  SFC
              </th>
              <th>
                  AVG
              </th>
              <th>
                  OBP
              </th>
            </tr>
          </thead>
          <tbody>
            {battingStats.map(players => (
              <tr key={players.id}>
                <td>{players.player_name}</td> 
                <td>Batters</td>
                <td>{players.appearances}</td>
                <td>{players.at_bats}</td>
                <td>{players.hits}</td>
                <td>{players.singles}</td>
                <td>{players.doubles}</td>
                <td>{players.triples}</td>
                <td>{players.home_runs}</td>
                <td>{players.runs_batted_in}</td>
                <td>{players.strikeouts}</td>
                <td>{players.sacrifices}</td>
                <td>{players.batting_average}</td>
                <td>{players.on_base_percentage}</td>
          
                <td>
                  <button 
                    className="draft"
                    value="draftBatter"
                    onClick={event => this.handleDraftedPlayer(event, players)}
                      >
                      Draft
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    );
  }
}

export default TestDraftBatters;

    
    
    
   