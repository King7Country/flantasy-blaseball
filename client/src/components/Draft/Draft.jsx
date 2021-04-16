import React from "react"
import axios from "axios"
import fire from "../../config/fire";
import { v4 as uuidv4 } from 'uuid';
import NameModal from '../NameModal/NameModal'
import DraftModal from '../DraftModal/DraftModal'
import icon from "../../assets/images/baseball-icon.svg"
import "./Draft.scss"

const API_URL = process.env.NODE_ENV === "production"
  ? 'https://flantasy-blaseball.herokuapp.com'
  : 'http://localhost:7877';

class TestDraft extends React.Component {

  state = {
    playerList: [],
    pitchingStats: [],
    battingStats: [],
   
    modalTeamName: true, //boolean display so user can chose team name
    modalMessage: false, //set as a string to display if any errors
    draftFinished: false,  
    teamName: "",
    active: "--pitchers",
    draftedPitchers: [],
    draftedBatters: [],
  }

  componentDidMount() {
    axios.get(`${API_URL}/players`)
      .then(res => {
          this.setState({pitchingStats: res.data.pitching})
          this.setState({battingStats: res.data.hitting})
          // console.log("pitchingStats: ", this.state.pitchingStats)
          // console.log("battingStats: ", this.state.battingStats)

          // this.state.pitchingStats.map(arrays => {
          //   console.log("arrays: ", arrays)

          //   arrays.map(objects => {
          //     console.log("objects: ", objects)

          //     console.log("player: ", objects.player.fullName)
          //     console.log("stat: ", objects.stat.batters_faced)
          //     console.log("team: ", objects.team.full_name)
          //   })
          // })
      })
      .catch(err => console.log(err));

    // axios.get(`${API_URL}/pitchers`)
    // .then(res => {
    //   this.setState({pitchingStats: res.data})
    // })
    // .catch(err => console.log("err pitch: ", err));
    // axios.get(`${API_URL}/batters`)
    // .then(res => {
    //   this.setState({battingStats: res.data})
    // })
    // .catch(err => console.log("err bat: ", err));
  }

  handleTeamName = (name) => {
    this.setState({teamName: name})
  }

  handleCloseModal = (event) => {
    this.setState({modalTeamName: false})
    this.setState({modalMessage: false})
    if (this.state.draftFinished) {
      this.props.history.push('/')
    }
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
      // create copy of state, push to array, set state: new array
      if (event.target.value === "draftPitcher" && this.state.draftedPitchers.length < 3) {

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
      }
      //check if batter and update the draftedBatter and battingStats states
      else if (event.target.value === "draftBatter" && this.state.draftedBatters.length < 9) {
        let draftedBattersList = this.state.draftedBatters.slice();
        draftedBattersList.unshift(draftedPlayer);
      
        this.setState({
          draftedBatters: draftedBattersList,
        })
        // filter battingStats state, remove the selected player, and save to new array. Set state: new array
        const updatedBattingStats = this.state.battingStats.filter(player => {
          return player !== draftedPlayer
        })
        this.setState({battingStats: updatedBattingStats})
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

    //if correct amount of players drafted, create new team object and send to database
    if (totalPlayers === 12) {

      let teamName = this.state.teamName;
      const userId = fire.auth().currentUser.uid;
      const userName = fire.auth().currentUser.displayName;
      let teamId = uuidv4();
      let newTeam = {
        userId: userId,  
        userName: userName,  
        teamId: teamId,
        teamName: teamName,
        pitchers: state.draftedPitchers,
        batters: state.draftedBatters,
      }
      
        fire.database().ref('teams').push(newTeam);
  
        // show completion message
        this.setState({modalMessage: `Congratulations! The draft is complete, you can safely return to low pressure situations.`});
        this.setState({draftFinished: true})
    }

    //if insufficient player number, let them know
   if (totalPlayers < 12) {
    this.setState({modalMessage: `You've only selected ${totalPlayers} players, select a few more players until you have 12 on your team.`});
    }
  
  }

  render() {
    const pitchingStats = this.state.pitchingStats;
    const draftedPitchers = this.state.draftedPitchers;
    const battingStats = this.state.battingStats;
    const draftedBatters = this.state.draftedBatters;

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
          <>
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
                        key={pitcher.player_id}>
                        <td className="draft__row-items--selected">{pitcher.player_name}</td> 
                        <td className="draft__row-items--selected">Pitcher</td>
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
              <div className="draft__loading-container">
                <h2 className="draft__loading">Loading...</h2>
                <img className="draft__logo" src={icon} alt="baseball"/>
              </div>
            </div> 
        </>
      );
    }
    if (this.state.modalMessage) {
      return (
        <DraftModal 
          modalMessage={this.state.modalMessage} 
          draftFinished={this.state.draftFinished} 
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
                  key={pitcher.player_id}>
                  <td className="draft__row-items--selected">{pitcher.player_name}</td> 
                  <td className="draft__row-items--selected">Pitcher</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="draft__selected-table">
            <tbody className="draft__body">
            {draftedBatters.map(batter => (
                <tr 
                  className="draft__row" 
                  key={batter.player_id}>
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

            <thead className="draft__head">
              <tr className="draft__row--head">
                <th className="draft__head-items--name">Name</th>
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
                  className="draft__head-items--tooltip">O</th>
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
              {pitchingStats.map(pitchers => (
                pitchers.map(pitcher => {
                  return (
                    <>
                  <tr  
                    className="draft__row"
                    key={pitcher.player.id}>
                    <td className="draft__row-items--name">
                        {pitcher.player.fullName}
                        
                      <div>
                        <div className="draft__row-items--team">{pitcher.team.full_name}</div>
                      </div>
                      
                    </td> 
                    <td className="draft__row-items">{pitcher.stat.games}</td>
                    <td className="draft__row-items">{pitcher.stat.wins}</td>
                    <td className="draft__row-items">{pitcher.stat.losses}</td>
                    <td className="draft__row-items">{pitcher.stat.earned_run_average}</td>
                    <td className="draft__row-items">{pitcher.stat.quality_starts}</td> 
                    <td className="draft__row-items">{pitcher.stat.shutouts}</td>
                    <td className="draft__row-items">{pitcher.stat.hits_allowed}</td>
                    <td className="draft__row-items">{pitcher.stat.runs_allowed}</td>
                    <td className="draft__row-items">{pitcher.stat.home_runs_allowed}</td>
                    <td className="draft__row-items">{pitcher.stat.outs_recorded}</td>
                    <td className="draft__row-items">{pitcher.stat.walks}</td> 
                    <td className="draft__row-items">{pitcher.stat.strikeouts}</td> 
                    <td className="draft__row-items">{pitcher.stat.whip}</td> 
                    <td className="draft__row-items--buttons">
                      <button 
                        className="draft__buttons--player"
                        value="draftPitcher"
                        onClick={event => this.handleDraftedPlayer(event, pitcher)}
                          >
                          Draft
                      </button>
                    </td>
                  </tr>
                  
                  </>
                  )
                })
              ))}
            </tbody>
          </table>
        
          <table className={`draft__tab${this.state.active === "--batters" ? '--batter' : ""}`}>
            <thead className="draft__head">
              <tr className="draft__row--head">
                <th className="draft__head-items--name">Name</th>
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
                {/* <th 
                  data-tooltip="Sacrifices"
                  className="draft__head-items--tooltip">SFC</th> */}
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
              {battingStats.map(batters => (
                batters.map(batter => {
                  return (
                    <tr 
                  className="draft__row"
                  key={batter.player.id}>
                  <td className="draft__row-items--name">
                    {batter.player.fullName}

                      <div>
                        <div className="draft__row-items--team">{batter.team.full_name}</div>
                      </div>
                      
                    </td> 
                  <td className="draft__row-items">{batter.stat.appearances}</td>
                  <td className="draft__row-items">{batter.stat.at_bats}</td>
                  <td className="draft__row-items">{batter.stat.hits}</td>
                  <td className="draft__row-items">{batter.stat.singles}</td>
                  <td className="draft__row-items">{batter.stat.doubles}</td>
                  <td className="draft__row-items">{batter.stat.triples}</td>
                  <td className="draft__row-items">{batter.stat.home_runs}</td>
                  <td className="draft__row-items">{batter.stat.runs_batted_in}</td>
                  <td className="draft__row-items">{batter.stat.strikeouts}</td>
                  {/* <td className="draft__row-items">{players.sacrifices}</td> */}
                  <td className="draft__row-items">{batter.stat.batting_average}</td>
                  <td className="draft__row-items">{batter.stat.on_base_percentage}</td>
                  <td  className="draft__row-items--buttons">
                    <button 
                      className="draft__buttons--player"
                      value="draftBatter"
                      onClick={event => this.handleDraftedPlayer(event, batter)}
                        >
                        Draft
                    </button>
                  </td>
                </tr>
                  )
                })
                
              ))}
            </tbody>
          </table>
        </div>

      </div>
    );
  }
}

export default TestDraft;

    
    
    
   