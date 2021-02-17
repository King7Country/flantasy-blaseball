import React, { Component } from 'react'
import fire from '../../config/fire'
import axios from "axios";
import "./Home.scss";

const API_URL = process.env.NODE_ENV === "production"
  ? 'https://flantasy-blaseball.herokuapp.com'
  : 'http://localhost:7877';

class Home extends Component {
    state = {
        user: undefined, 
        userId: "loading",
        userName: "",
        active: "--pitchers",
        myTeams: [],
        origPitcherStats: [], //from db 
        newPitcherStats: [],  //from API - current stats
        origBatterStats: [],  //from db
        newBatterStats: [],   //from API - current stats

        teamsWithPoints: [],  //teams/players with calculated fantasy points to be mapped in render method
    }

    componentDidMount() {
        this.authListener();
    }

    authListener() {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ userId: user.uid })
                this.setState({ userName: user.displayName })
                this.getTeams();
            } else {
                this.setState({user});                
            }
        })
      }

    getTeams() {
        //get the users team information from database and set to state
        const userId = this.state.userId;
        const teamsRef = fire.database().ref(`teams`);
        teamsRef.orderByChild("userId").equalTo(userId).once('value', (snapshot) => {

            let usersTeams = [];
            snapshot.forEach((childSnapshot) => {

                const childData = childSnapshot.val();
                usersTeams.push(childData)
            });
            this.setState({myTeams: usersTeams})

        })
        .then(() => {
            this.getNewPlayerStats();
        })
    }

    getNewPlayerStats() {
         // loop through player objects to get their id's and set the original player data (from db) in state as seperate pitcher and batter arrays
         let origPitcherStats = [];
         let pitcherIdArray = [];
         let pitcherIdString = "";

         let origBatterStats = [];
         let batterIdArray = [];
         let batterIdString = "";

         this.state.myTeams.map(team => {

           //get pitchers data
           team.pitchers.map(pitcher => {
               const id = pitcher.player_id;
               origPitcherStats.push(pitcher);
               pitcherIdArray.push(id);

               pitcherIdString = pitcherIdArray.toString()
             })

             //get batters data
             team.batters.map(batter => {
                const id = batter.player_id;
                origBatterStats.push(batter);
                batterIdArray.push(id);
 
                batterIdString = batterIdArray.toString()
              })

             //set the original players data to state for comparison latter
             this.setState({origPitcherStats: origPitcherStats});
             this.setState({origBatterStats: origBatterStats});

             // make axios call to server with the string of id's as paramaters
            //  axios.get(`http://localhost:7777/pitchers-list/${pitcherIdString}`) //external API
             axios.get(`${API_URL}/simulated-pitchers/${pitcherIdString}`) //simulated API
              .then(res => {
                  this.setState({newPitcherStats: res.data});
              })
              .catch(err => console.log("err: ", err))

            //   axios.get(`http://localhost:7777/batters-list/${batterIdString}`) //actual API
              axios.get(`${API_URL}/simulated-batters/${batterIdString}`) //simulated API
                .then(res => {
                    return this.setState({newBatterStats: res.data});
                })
                .then(res => {
                    this.determinePlayerPoints(this.state.origPitcherStats, this.state.newPitcherStats, this.state.origBatterStats, this.state.newBatterStats);
                })
                .catch(err => console.log("err: ", err))
         })
     }

     determinePlayerPoints(oldPitchers, newPitchers, oldBatters, newBatters) {

        //call conversion function
        const oldPitchersConverted = this.convertIntObj(oldPitchers);
        const newPitchersConverted = this.convertIntObj(newPitchers);
        const oldBattersConverted = this.convertIntObj(oldBatters);
        const newBattersConverted = this.convertIntObj(newBatters);
        
        //IMPORTANT: the conversion will mess up some player_id's, must filter by name and reset id's in order to filter below
        //reset pitcher Ids
        oldPitchers.map(oldPitcher => {

            newPitchersConverted.map(newConverted => {

                if (newConverted.player_name === oldPitcher.player_name) {
                    newConverted.player_id = oldPitcher.player_id;
                    newConverted.team_id = oldPitcher.team_id;
                }
            })
        })

        //reset batters ids
        oldBatters.map(oldBatter => {

            newBattersConverted.map(newConverted => {

                if (newConverted.player_name === oldBatter.player_name) {
                    newConverted.player_id = oldBatter.player_id;
                    newConverted.team_id = oldBatter.team_id;
                }
            })
        })

        // get differences between old and new, from: https://stackoverflow.com/questions/51013088/get-the-difference-two-objects-by-subtracting-properties

        //pitchers difference
         //set new array variable and loop through oldplayers first
         let pitchersThisWeek = [];
         oldPitchersConverted.map(oldPitcher => {
             //loop through new players
             newPitchersConverted.map(newPitcher => {
                 //check to compare only the same players with each other
                 if (oldPitcher.player_name === newPitcher.player_name) {
                     //iterate through object and subtract new stat values from old
                     let updatedPitcher = Object.keys(oldPitcher).reduce((a, i) => {
                         a[i] = newPitcher[i] - oldPitcher[i];
                         return a;
                    }, {});

                    //set fantasy points: multiply updated stat values by point factor
                    //*IMPORTANT: need to re-set name and id to value of newPitcher as the subtraction above returns NaN for string values
                    updatedPitcher.batters_faced = updatedPitcher.batters_faced * .5;
                    updatedPitcher.bb_per_9 = updatedPitcher.bb_per_9 * .5;
                    updatedPitcher.earned_run_average = updatedPitcher.earned_run_average * .5;
                    updatedPitcher.games = newPitcher.games;
                    updatedPitcher.hits_allowed = updatedPitcher.hits_allowed * .5;
                    updatedPitcher.hits_per_9 = updatedPitcher.hits_per_9 * .5;
                    updatedPitcher.hpbs = updatedPitcher.hpbs * .5;
                    updatedPitcher.hr_per_9 = updatedPitcher.hr_per_9 * .5;
                    updatedPitcher.home_runs_allowed = updatedPitcher.home_runs_allowed * .5;
                    updatedPitcher.innings = updatedPitcher.innings * 3; 
                    updatedPitcher.k_bb = updatedPitcher.k_bb * .5;
                    updatedPitcher.k_per_9 = updatedPitcher.k_per_9 * .5;
                    updatedPitcher.losses = updatedPitcher.losses * .5;
                    updatedPitcher.outs_recorded = updatedPitcher.outs_recorded * 1;
                    updatedPitcher.pitch_count = updatedPitcher.pitch_count * .5; 
                    updatedPitcher.player_id = newPitcher.player_id;
                    updatedPitcher.player_name = newPitcher.player_name;
                    updatedPitcher.quality_starts = updatedPitcher.quality_starts * 3; 
                    updatedPitcher.runs_allowed = updatedPitcher.runs_allowed * .5;
                    updatedPitcher.season = updatedPitcher.season;
                    updatedPitcher.shutouts = updatedPitcher.shutouts * 10;
                    updatedPitcher.strikeouts = updatedPitcher.strikeouts * 1;  
                    updatedPitcher.team = newPitcher.team;
                    updatedPitcher.walks = updatedPitcher.walks * .5;
                    updatedPitcher.whip = updatedPitcher.whip * .5;
                    updatedPitcher.win_pct = updatedPitcher.win_pct * .5;
                    updatedPitcher.wins = updatedPitcher.wins * 7;  
    
                    //push the new player object to the new array created above
                    pitchersThisWeek.push(updatedPitcher)
                }
             })
         })

        //batters difference
        //set new array variable and loop through oldplayers first
        let battersThisWeek = [];
        oldBattersConverted.map(oldBatter => {

            //loop throuogh new players
            newBattersConverted.map(newBatter => {
          

                //check to compare only the same players with each other
                if (oldBatter.player_name === newBatter.player_name) {

                    //iterate through object and subtract new stat values from old
                    let updatedBatter = Object.keys(oldBatter).reduce((a, i) => {
                        a[i] = newBatter[i] - oldBatter[i];
                        return a;
                    }, {});
                
                    //set fantasy points: multiply updated stat values by point factor
                    //*IMPORTANT: need to re-set name and id to value of newBatter as the subtraction above returns NaN for any string values
                    updatedBatter.appearances = updatedBatter.appearances * .5;
                    updatedBatter.at_bats = updatedBatter.at_bats * .5;
                    updatedBatter.at_bats_risp = updatedBatter.at_bats_risp * .5;
                    updatedBatter.batting_average = updatedBatter.batting_average * .5;
                    updatedBatter.batting_average_risp = updatedBatter.batting_average_risp * .5;
                    updatedBatter.doubles = updatedBatter.doubles * 2;
                    updatedBatter.first_appearance = updatedBatter.first_appearance * .5;
                    updatedBatter.flyouts = updatedBatter.flyouts * .5;
                    updatedBatter.gidps = updatedBatter.gidps * .5;
                    updatedBatter.ground_outs = updatedBatter.ground_outs * .5;
                    updatedBatter.hbps = updatedBatter.hbps * .5;
                    updatedBatter.hits = updatedBatter.hits * 1 ;
                    updatedBatter.hits_risps = updatedBatter.hits_risps * .5;
                    updatedBatter.home_runs = updatedBatter.home_runs  * 4; 
                    updatedBatter.on_base_percentage = updatedBatter.on_base_percentage * .5;
                    updatedBatter.on_base_slugging = updatedBatter.on_base_slugging * .5;
                    updatedBatter.plate_appearances = updatedBatter.plate_appearances * .5;
                    updatedBatter.player_id = newBatter.player_id;
                    updatedBatter.player_name = newBatter.player_name;
                    updatedBatter.quadruples = updatedBatter.quadruples * .5; 
                    updatedBatter.runs_batted_in = updatedBatter.runs_batted_in * 1;  
                    updatedBatter.strikeouts = updatedBatter.strikeouts * .5;
                    updatedBatter.sacrifices = updatedBatter.sacrifices * .5;
                    updatedBatter.season =  newBatter.season;
                    updatedBatter.singles = updatedBatter.singles * 1; 
                    updatedBatter.slugging = updatedBatter.slugging * .5;
                    updatedBatter.team = newBatter.team;
                    updatedBatter.team_id = newBatter.team_id;
                    updatedBatter.total_bases = updatedBatter.total_bases * 1; 
                    updatedBatter.triples = updatedBatter.triples * 3; 
                    updatedBatter.walks = updatedBatter.walks * .5;

                    //push the new player object to the new array created above
                    battersThisWeek.push(updatedBatter)
                }
            })
        })
        
        //find which users team each player is on 
        //then create a duplicate team object with the new arrays of updated players
        //batters first this time
        let updatedTeamsList = [];
        let updatedTeam = {};
        this.state.myTeams.map(team => {
            let updatedBatters = [];
            let updatedPitchers = [];

            team.batters.map(batter => {

                battersThisWeek.map(thisBatter => {
                   
                    //check if a player is in both the plaeyrsThisWeek array and the myTeams player array, if so push objet to new array
                    if (thisBatter.player_id === batter.player_id) {
                        updatedBatters.push(thisBatter)
                    }
                })
            })

            //now for the pitchers
            team.pitchers.map(pitcher => {

                pitchersThisWeek.map(thisPitcher => {
                   
                    //check if a player is in both the plaeyrsThisWeek array and the myTeams player array, if so push objet to new array
                    if (thisPitcher.player_id === pitcher.player_id) {
                        updatedPitchers.push(thisPitcher)

                    }
                })
            })

            //create updated team object containing both the new updatedPitchers  and updatedBatters arrays
            updatedTeam = {
                teamId: team.teamId,
                teamName: team.teamName,
                userId: team.userId,
                pitchers: updatedPitchers,
                batters: updatedBatters,
            }

            // then push the new object to a new array for updated teams
            updatedTeamsList.push(updatedTeam)
        })
         // set the updated teams array as a new state which will be mapped over in the render method
        this.setState({teamsWithPoints: updatedTeamsList})
     }


    // convert all string "number" values into actual numbers, called in determinePlayerPoints
    // from https://stackoverflow.com/questions/61057507/how-to-convert-object-properties-string-to-integer-in-javascript
    convertIntObj(obj) {
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

    handleTab(event) {
        if (this.state.active === "--pitchers" && event.target.value === "batters-tab") {
          this.setState({active: "--batters"})
        } else if (this.state.active === "--batters" && event.target.value === "pitchers-tab") {
          this.setState({active: "--pitchers"})
        }
    }

    logout() {
        this.props.history.push("/login");
        fire.auth().signOut();
    }

    render() {

        const user = fire.auth().currentUser;
        const myTeams = this.state.myTeams;
        const userName = this.state.userName;
        const teamsWithPoints = this.state.teamsWithPoints

        console.log("myTeams", myTeams)

        if (!user) {
            return (
                <div></div>
            );
        } 
        if (!myTeams.length) {
            return (
                <div className="user">
                    <div className="user__sub-container">
                        <h1 className="user__username">{userName}</h1>
                        <button 
                            className="user__logout"
                            onClick={() => this.logout()}
                            >
                            Logout
                        </button>
                    </div>
                    <h3 className="user__teams-header">My Teams</h3>
                    <div className="user__no-team">
                        <p>You don't have a flantasy blaseball team yet, why not draft one now?</p>
                        <div className="user__no-team--sub">
                            <p>I'm serious, draft one.</p>
                            <p>Right now!</p>
                        </div>
                    </div>
                </div>
            )
        } 

        return (
            
            <div className="user">
                <div className="user__sub-container">
                    <h1 className="user__username">{userName}</h1>
                    <button 
                        className="user__logout"
                        onClick={() => this.logout()}
                        >
                        Logout
                    </button>
                </div>

                <h3 className="user__my-teams">My Teams</h3>
                <div className="user__table-container">
                {teamsWithPoints.map(team => {
                    return (
                      <>
                        <p className="user__team-name"> {team.teamName}</p>

                        <div className="user__tab-container">
                            <button
                                className={`user__tab-buttons${this.state.active === "--pitchers" ? '--pitcher' : ""}`}
                                value="pitchers-tab"
                                onClick={event => this.handleTab(event, this.state.active)}
                                >Pitchers
                            </button>
                            <button
                                className={`user__tab-buttons${this.state.active === "--batters" ? '--batter' : ""}`}
                                value="batters-tab"
                                onClick={event => this.handleTab(event, this.state.active)}
                                >Batters
                            </button>
                        </div>

                        <table 
                            className={`user__tab${this.state.active === "--pitchers" ? '--pitcher' : ""}`}>
                            <thead className="user__head">
                                <tr className="user__row--head">
                                    <th className="user__head-items--name">
                                        Name</th>
                                    <th 
                                        data-tooltip="Wins" 
                                        className="user__head-items--tooltip">
                                        W</th>
                                    <th 
                                        data-tooltip="Quality Starts"
                                        className="user__head-items--tooltip">
                                        QS</th>
                                    <th 
                                        data-tooltip="Innings Pitched"
                                        className="user__head-items--tooltip">
                                        IP</th>
                                    <th 
                                        data-tooltip="Shutouts"
                                        className="user__head-items--tooltip">
                                        SH</th>
   
                                    <th
                                        data-tooltip="Outs Recorded"
                                        className="user__head-items--tooltip">
                                        O</th>
                                    <th
                                        data-tooltip="Strikeouts"
                                        className="user__head-items--tooltip">
                                        SO
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="user__body">
                                {team.pitchers.map(pitcher => (
                                <tr 
                                    className="user__row"
                                    key={pitcher.player_id}>
                                    <td className="user__row-items--name">{pitcher.player_name}</td> 
                                    <td className="user__row-items">{pitcher.wins}</td>
                                    <td className="user__row-items">{pitcher.quality_starts}</td> 
                                    <td className="user__row-items">{pitcher.innings}</td>
                                    <td className="user__row-items">{pitcher.shutouts}</td>
                                    <td className="user__row-items">{pitcher.outs_recorded}</td>
                                    <td className="user__row-items">{pitcher.strikeouts}</td> 
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className={`user__tab${this.state.active === "--batters" ? '--batter' : ""}`}>
                        <thead className="user__head">
                            <tr>
                                <th className="user__head-items--name">
                                    Name</th>
                                <th
                                    data-tooltip="Hits"
                                    className="user__head-items--tooltip">
                                    H</th>
                                <th
                                    data-tooltip="Singles"
                                    className="user__head-items--tooltip">
                                    1B</th>
                                <th
                                    data-tooltip="Doubles"
                                    className="user__head-items--tooltip">
                                    2B</th>
                                <th
                                    data-tooltip="Triples"
                                    className="user__head-items--tooltip">
                                    3B</th>
                                <th
                                    data-tooltip="Home Runs"
                                    className="user__head-items--tooltip">
                                    HR</th>
                                <th
                                    data-tooltip="Runs Batted In"
                                    className="user__head-items--tooltip">
                                    RBI</th>
                                <th
                                    data-tooltip="Total Bases"
                                    className="user__head-items--tooltip">
                                    TB</th>
                            </tr>
                        </thead>
                        <tbody className="user__body">
                            {team.batters.map(batter => (
                            <tr 
                                className="user__row"
                                key={batter.player_id}>
                                <td className="user__row-items--name">{batter.player_name}</td> 
                                <td className="user__row-items">{batter.hits}</td>
                                <td className="user__row-items">{batter.singles}</td>
                                <td className="user__row-items">{batter.doubles}</td>
                                <td className="user__row-items">{batter.triples}</td>
                                <td className="user__row-items">{batter.home_runs}</td>
                                <td className="user__row-items">{batter.runs_batted_in}</td>
                                <td className="user__row-items">{batter.total_bases}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        <br/>
                      </>
                    )
                })}
                </div>
            </div>
        )
    }
}

export default Home
