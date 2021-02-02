import React from "react"
import axios from "axios"
import fire from "../config/fire";
import { v4 as uuidv4 } from 'uuid';
import NameModal from '../components/NameModal/NameModal'
import DraftModal from '../components/DraftModal/DraftModal'

import "./TestDraft.scss"

// import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";


// If all players are authenticated and logged in, can give them access to the same (instanced) list of players to select from. That way if the list updates then it should update for all users! (thatnks Ashley!)

// If CORS doesn't work try making axios calls from back-end. getrequest to my server which will have an axios call to the blasball API endpoint. Then return the res from axios in my req.body to my client. (thanks Hussein)
// cors-anywhere API: 
// const CORS = 'https://cors-anywhere.herokuapp.com/';
//Currently using CORS browser extension - for now

// Blaseball official API key - not in use
// const API_ALL_TEAMS = 'https://www.blaseball.com/database/allTeams';
// const API_PLAYERS = 'https://www.blaseball.com/database/players?ids='


const URL = 'http://localhost:7877';

class TestDraft extends React.Component {

  state = {
    playerList: [],
    pitchingStats: [],
    battingStats: [],
   
    modalTeamName: true, //boolean display so user can chose team name
    modalMessage: false, //set as a string to display if any errors 
    teamName: "",
    active: "--pitchers",
    draftedPitchers: [],
    draftedBatters: [],
  }

  componentDidMount() {
    axios.get(`http://localhost:7877/pitchers`)
    .then(res => {
      this.setState({pitchingStats: res.data})
    })
    .catch(err => console.log("err pitch: ", err));
    axios.get(`http://localhost:7877/batters`)
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
    this.setState({modalTeamName: false})
    this.setState({modalMessage: false})
  }

  handleTab(event) {
    if (this.state.active === "--pitchers" && event.target.value === "batters-tab") {
      this.setState({active: "--batters"})
    } else if (this.state.active === "--batters" && event.target.value === "pitchers-tab") {
      this.setState({active: "--pitchers"})
    }
  }

  handleDraftedPlayer(event, draftedPlayer) {
    event.preventDefault();
    const totalPlayers = this.state.draftedPitchers.length + this.state.draftedBatters.length;

    // check if total players is less then max amount
    if (totalPlayers < 12) {
      //check if pitcher and update the draftedPitcher and pitchingStats states
      if (event.target.value === "draftPitcher" && this.state.draftedPitchers.length < 3) {
        // init array, push to array, set state: new array
        let draftedPitchersList = this.state.draftedPitchers.slice();
        draftedPitchersList.unshift(draftedPlayer);
        this.setState({
          draftedPitchers: draftedPitchersList,
        })
        // filter pitchingStats state, remove the selected player, and save to new array. Set state: new array
        const updatedPitchingStats = this.state.pitchingStats.filter(player => {
          return player !== draftedPlayer
        })
        this.setState({pitchingStats: updatedPitchingStats})
        // console.log("updated state: ",updatedPitchingStats)
      }
      //check if batter and update the draftedBatter and battingStats states
      else if (event.target.value === "draftBatter" && this.state.draftedBatters.length < 9) {
        console.log("batter - draftPlayer: ", draftedPlayer)
        // init array, push to array, set state: array
        let draftedBattersList = this.state.draftedBatters.slice();
        draftedBattersList.unshift(draftedPlayer);
      
        this.setState({
          draftedBatters: draftedBattersList,
        })
        console.log("draftedBatters: ", draftedBattersList)

        const updatedBattingStats = this.state.battingStats.filter(player => {
          return player !== draftedPlayer
        })
        this.setState({battingStats: updatedBattingStats})
        console.log("updated batting state: ", this.state.battingStats)
      }
    }
    //if already selected max number of players for that position, let them know
    if (event.target.value === "draftPitcher" && this.state.draftedPitchers.length === 3) {

      this.setState({modalMessage: "You've already drafted the max number of players for that position."})
    } else if (event.target.value === "draftBatter" && this.state.draftedBatters.length === 9) {
    //if already selected max number of players for that position, let them know
      this.setState({modalMessage: "You've already drafted the max number of players for that position."})
    }
  }

  finishDraft(state) {
    const totalPlayers = this.state.draftedPitchers.length + this.state.draftedBatters.length;

    if (totalPlayers === 12) {

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
  
        // show completion message
        this.setState({modalMessage: `Congratulations! The draft is complete, you can safely return to low pressure situations.`});
    }

   if (totalPlayers < 12) {
    this.setState({modalMessage: `You've only selected ${totalPlayers} players, select a few more players until you have 12 on your team.`});
    }
  
  }

  render() {
    const user = fire.auth().currentUser;
    const pitchingStats = this.state.pitchingStats;
    const draftedPitchers = this.state.draftedPitchers;
    const battingStats = this.state.battingStats;
    const draftedBatters = this.state.draftedBatters;


    console.log("battingStats: ", battingStats)
    console.log("pitchingStats: ", pitchingStats)
    console.log("combined: ", pitchingStats.length + battingStats.length)
    console.log("this.state.modalMessage: ", this.state.modalMessage)

     if (this.state.modalTeamName) {
      return (
        <NameModal 
          modalTeamName={this.state.modalTeamName} 
          value={this.state.teamName} 
          onChange={this.handleTeamName} 
          onClick={this.handleCloseModal} />
      )
    }
     else if (!this.state.pitchingStats.length && !this.state.battingStats.length ) {
      return (
        <div
          style={{
            marginTop: "10em",
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
    if (this.state.modalMessage) {
      return (
        <DraftModal 
          modalMessage={this.state.modalMessage} 
          onClick={this.handleCloseModal} />
      )
    }

    return (
      <div className="draft__container">
        <h2 className="draft__heading">Draft</h2>

        <div className="draft__selected-sub-container">
          <h2 className="draft__team-name">{this.state.teamName}</h2>
          <caption className="draft__table-heading--selected">Selected Players</caption>
        </div>
       

        <div className="draft__selected">
          <table className="draft__selected-table">
            <thead className="draft__head">
              <tr className="draft__row--head">
                <th className="draft__head-items">
                    Name
                </th>
                <th className="draft__head-items">
                    POS
                </th>
              </tr>
            </thead>
            <tbody className="draft__body">
            {draftedPitchers.map(pitcher => (
                <tr 
                  className="draft__row" 
                  key={pitcher.id}>
                  <td className="draft__row-items--selected">{pitcher.player_name}</td> 
                  <td className="draft__row-items--selected">Pitcher</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="draft__selected-table">
            {/* <thead className="draft__head">
              <tr className="draft__row--head">
                <th className="draft__head-items">
                    Name
                </th>
                <th className="draft__head-items">
                    POS
                </th>
              </tr>
            </thead> */}
            <tbody className="draft__body">
            {draftedBatters.map(batter => (
                <tr 
                  className="draft__row" 
                  key={batter.id}>
                  <td className="draft__row-items--selected">{batter.player_name}</td> 
                  <td className="draft__row-items--selected">Batter</td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>

        <button 
          className="draft__buttons--finish"
          onClick={() => this.finishDraft(this.state)}
          >
          Finish Draft
        </button>

        <div className="draft__tab-container">
          <button
            className={`draft__tab-buttons${this.state.active === "--pitchers" ? '--pitcher' : ""}`}
            value="pitchers-tab"
            onClick={event => this.handleTab(event, this.state.active)}
            >Pitchers
          </button>
          <button
            className={`draft__tab-buttons${this.state.active === "--batters" ? '--batter' : ""}`}
            value="batters-tab"
            onClick={event => this.handleTab(event, this.state.active)}
            >Batters
          </button>
        </div>

        <div className="draft__table-container">
          <table 
            className={`draft__tab${this.state.active === "--pitchers" ? '--pitcher' : ""}`}
            >
            {/* <caption className="draft__table-heading">Pitchers Available</caption> */}
            <thead className="draft__head">
              <tr className="draft__row--head">
                <th className="draft__head-items--name">Name</th>
                {/* <th className="draft__head-items">POS</th> */}
                <th 
                  data-tooltip="Games Played"
                  className="draft__head-items--tooltip">G</th>
                <th 
                  data-tooltip="Wins"
                  className="draft__head-items--tooltip">W</th>
                <th 
                  data-tooltip="Losses"
                  className="draft__head-items--tooltip">L</th>
                <th 
                  data-tooltip="Earned Runs Average"
                  className="draft__head-items--tooltip">ERA</th>
                <th 
                  data-tooltip="Quality Starts"
                  className="draft__head-items--tooltip">QS</th>
                <th 
                  data-tooltip="Shutouts"
                  className="draft__head-items--tooltip">SH</th>
                <th 
                  data-tooltip="Hits Allowed"
                  className="draft__head-items--tooltip">H</th>
                <th 
                  data-tooltip="Runs Allowed"
                  className="draft__head-items--tooltip">R</th>
                <th 
                  data-tooltip="Home Runs Allowed"
                  className="draft__head-items--tooltip">HR</th>
                <th 
                  data-tooltip="Outs Recorded"
                  className="draft__head-items">O</th>
                <th 
                  data-tooltip="Walks"
                  className="draft__head-items--tooltip">BB</th>
                <th 
                  data-tooltip="Strikeouts"
                  className="draft__head-items--tooltip">SO</th>
                <th 
                  data-tooltip="Walks And Hits Per Inning Pitched"
                  className="draft__head-items--tooltip">WHIP</th>
                <th 
                  className="draft__head-items"></th>
              </tr>
            </thead>
            <tbody className="draft__body">
              {pitchingStats.map(pitchingStats => (
                <tr  
                  className="draft__row"
                  key={pitchingStats.id}>
                  <td className="draft__row-items--name">{pitchingStats.player_name}</td> 
                  {/* <td className="draft__row-items">Pitcher</td> */}
                  <td className="draft__row-items">{pitchingStats.games}</td>
                  <td className="draft__row-items">{pitchingStats.wins}</td>
                  <td className="draft__row-items">{pitchingStats.losses}</td>
                  <td className="draft__row-items">{pitchingStats.era}</td>
                  <td className="draft__row-items">{pitchingStats.quality_starts}</td> 
                  <td className="draft__row-items">{pitchingStats.shutouts}</td>
                  <td className="draft__row-items">{pitchingStats.hits_allowed}</td>
                  <td className="draft__row-items">{pitchingStats.runs_allowed}</td>
                  <td className="draft__row-items">{pitchingStats.hrs_allowed}</td>
                  <td className="draft__row-items">{pitchingStats.outs_recorded}</td>
                  <td className="draft__row-items">{pitchingStats.walks}</td> 
                  <td className="draft__row-items">{pitchingStats.strikeouts}</td> 
                  <td className="draft__row-items">{pitchingStats.whip}</td> 
                  <td className="draft__row-items--buttons">
                    <button 
                      className="draft__buttons--player"
                      value="draftPitcher"
                      onClick={event => this.handleDraftedPlayer(event, pitchingStats)}
                        >
                        Draft
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        
          <table className={`draft__tab${this.state.active === "--batters" ? '--batter' : ""}`}>
            {/* <caption className="draft__table-heading">Batters Available</caption> */}
            <thead className="draft__head">
              <tr className="draft__row--head">
                <th className="draft__head-items--name">Name</th>
                {/* <th className="draft__head-items">POS</th> */}
                <th 
                  data-tooltip="Appearances"
                  className="draft__head-items--tooltip">A</th>
                <th 
                  data-tooltip="At Bats"
                  className="draft__head-items--tooltip">AB</th>
                <th 
                  data-tooltip="Hits"
                  className="draft__head-items--tooltip">H</th>
                <th 
                  data-tooltip="Singles"
                  className="draft__head-items--tooltip">1B</th>
                <th 
                  data-tooltip="Doubles"
                  className="draft__head-items--tooltip">2B</th>
                <th 
                  data-tooltip="Triples"
                  className="draft__head-items--tooltip">3B</th>
                <th 
                  data-tooltip="Home Runs"
                  className="draft__head-items--tooltip">HR</th>
                <th 
                  data-tooltip="Runs Batted In"
                  className="draft__head-items--tooltip">RBI</th>
                <th 
                  data-tooltip="Strikeouts"
                  className="draft__head-items--tooltip">SO</th>
                <th 
                  data-tooltip="Sacrifices"
                  className="draft__head-items--tooltip">SFC</th>
                <th 
                  data-tooltip="Batting Average"
                  className="draft__head-items--tooltip">BA</th>
                <th 
                  data-tooltip="On Base Percentage"
                  className="draft__head-items--tooltip">OBP</th>
                <th 
                  className="draft__head-items"></th>
              </tr>
            </thead>
            <tbody className="draft__body">
              {battingStats.map(players => (
                <tr 
                  className="draft__row"
                  key={players.id}>
                  <td className="draft__row-items--name">{players.player_name}</td> 
                  {/* <td className="draft__row-items">Batters</td> */}
                  <td className="draft__row-items">{players.appearances}</td>
                  <td className="draft__row-items">{players.at_bats}</td>
                  <td className="draft__row-items">{players.hits}</td>
                  <td className="draft__row-items">{players.singles}</td>
                  <td className="draft__row-items">{players.doubles}</td>
                  <td className="draft__row-items">{players.triples}</td>
                  <td className="draft__row-items">{players.home_runs}</td>
                  <td className="draft__row-items">{players.runs_batted_in}</td>
                  <td className="draft__row-items">{players.strikeouts}</td>
                  <td className="draft__row-items">{players.sacrifices}</td>
                  <td className="draft__row-items">{players.batting_average}</td>
                  <td className="draft__row-items">{players.on_base_percentage}</td>
                  <td  className="draft__row-items--buttons">
                    <button 
                      className="draft__buttons--player"
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

      </div>
    );
  }
}

export default TestDraft;

    
    
    
   