import React, { Component } from 'react'
import fire from '../../config/fire'
import axios from "axios";
import { Link } from 'react-router-dom';
import "./Home.scss";
import Login from "../Login/Login"

class Home extends Component {
    state = {
        userId: "loading",
        userEmail: "",
        myTeams: [],
        origPitcherStats: [],
        newPitcherStats: [],
        origBatterStats: [],
        newBatterStats: [], 
        updatedPitchers: [],

        teamsWithPoints: [],
    }

    componentDidMount() {
        // console.log("props: ", user).uid;
        // const userId = this.state.userId;
        this.authListener();
    }

    authListener() {
        fire.auth().onAuthStateChanged((user) => {
          const userId = user.uid;
            this.setState({ userId: user.uid })
            this.setState({ userEmail: user.email})
            this.getTeams(); 
        })
      }

    getTeams() {
        const userId = this.state.userId
        const teamsRef = fire.database().ref(`teams`);
        teamsRef.orderByChild("userId").equalTo(userId).once('value', (snapshot) => {
            let usersTeams = [];
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                usersTeams.push(childData)
                if (usersTeams.length >= 1 ) {
                    this.setState({userAtTeamLimit: true})
                }
            });
           return this.setState({myTeams: usersTeams})
            
        })
        .then(() => {
            this.getNewPlayerStats();
        })
    }

    //loops through myTeams once to get both pitchers and batters
    getNewPlayerStats() {
        const userId = this.state.userId;
         // loop through player objects to get their id's 
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
            //  axios.get(`http://localhost:7777/pitchers-list/${pitcherIdString}`) //actual API
             axios.get(`http://localhost:7777/simulated-pitchers/${pitcherIdString}`) //simulated API
              .then(res => {
                  this.setState({newPitcherStats: res.data});
                //   console.log("newPitcherStats: ", this.state.newPitcherStats)

                //   this.determinePitcherPoints(this.state.origPitcherStats, this.state.newPitcherStats)
              })
              .catch(err => console.log("err: ", err))

            //   axios.get(`http://localhost:7777/batters-list/${batterIdString}`) //actual API
              axios.get(`http://localhost:7777/simulated-batters/${batterIdString}`) //simulated API
                .then(res => {
                    return this.setState({newBatterStats: res.data});
                    // this.determinePitcherPoints(this.state.origBatterStats, this.state.newBatterStats)

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

        // console.log('oldBatters result', oldBatters)
        // console.log('newBatters result', newBatters)

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
                    //*IMPORTANT: need to re-set name and id to value of newPitcher as the subtraction above returns NaN for any string values
                    updatedPitcher.batters_faced = updatedPitcher.batters_faced //* .5;
                    updatedPitcher.bb_per_9 = updatedPitcher.bb_per_9 //* .5;
                    updatedPitcher.era = updatedPitcher.era //* .5;
                    updatedPitcher.games = newPitcher.games;
                    updatedPitcher.hits_allowed = updatedPitcher.hits_allowed //* .5;
                    updatedPitcher.hits_per_9 = updatedPitcher.hits_per_9 //* .5;
                    updatedPitcher.hpbs = updatedPitcher.hpbs //* .5;
                    updatedPitcher.hr_per_9 = updatedPitcher.hr_per_9 //* .5;
                    updatedPitcher.hrs_allowed = updatedPitcher.hrs_allowed //* .5;
                    updatedPitcher.innings = updatedPitcher.innings * 3; 
                    updatedPitcher.k_bb = updatedPitcher.k_bb //* .5;
                    updatedPitcher.k_per_9 = updatedPitcher.k_per_9 //* .5;
                    updatedPitcher.losses = updatedPitcher.losses //* .5;
                    updatedPitcher.outs_recorded = updatedPitcher.outs_recorded * 1;
                    updatedPitcher.pitch_count = updatedPitcher.pitch_count //* .5; !
                    updatedPitcher.player_id = newPitcher.player_id;
                    updatedPitcher.player_name = newPitcher.player_name;
                    updatedPitcher.quality_starts = updatedPitcher.quality_starts * 3; 
                    updatedPitcher.runs_allowed = updatedPitcher.runs_allowed //* .5;
                    updatedPitcher.season = updatedPitcher.season;
                    updatedPitcher.shutouts = updatedPitcher.shutouts * 10;
                    updatedPitcher.strikeouts = updatedPitcher.strikeouts * 1;  
                    updatedPitcher.team = newPitcher.team;
                    updatedPitcher.walks = updatedPitcher.walks //* .5;
                    updatedPitcher.whip = updatedPitcher.whip //* .5;
                    updatedPitcher.win_pct = updatedPitcher.win_pct //* .5;
                    updatedPitcher.wins = updatedPitcher.wins * 7;  
    
                    //push the new player object to the new array created above
                    pitchersThisWeek.push(updatedPitcher)
                    // console.log("updatedPitcher: ", updatedPitcher)
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
                        // a.player_id = newBatter.player_id;
                        // a.player_name = newBatter.player_name;
                        return a;
                    }, {});
                
                    //set fantasy points: multiply updated stat values by point factor
                    //*IMPORTANT: need to re-set name and id to value of newBatter as the subtraction above returns NaN for any string values
                    updatedBatter.appearances = updatedBatter.appearances //* .5;
                    updatedBatter.at_bats = updatedBatter.at_bats //* .5;
                    updatedBatter.at_bats_risp = updatedBatter.at_bats_risp //* .5;
                    updatedBatter.batting_average = updatedBatter.batting_average //* .5;
                    updatedBatter.batting_average_risp = updatedBatter.batting_average_risp //* .5;
                    updatedBatter.doubles = updatedBatter.doubles * 2;
                    updatedBatter.first_appearance = updatedBatter.first_appearance //* .5;
                    updatedBatter.flyouts = updatedBatter.flyouts //* .5;
                    updatedBatter.gidps = updatedBatter.gidps //* .5;
                    updatedBatter.ground_outs = updatedBatter.ground_outs //* .5;
                    updatedBatter.hbps = updatedBatter.hbps //* .5;
                    updatedBatter.hits = updatedBatter.hits * 1 ;
                    updatedBatter.hits_risps = updatedBatter.hits_risps //* .5;
                    updatedBatter.home_runs = updatedBatter.home_runs  * 4; 
                    updatedBatter.on_base_percentage = updatedBatter.on_base_percentage //* .5;
                    updatedBatter.on_base_slugging = updatedBatter.on_base_slugging //* .5;
                    updatedBatter.plate_appearances = updatedBatter.plate_appearances //* .5;
                    updatedBatter.player_id = newBatter.player_id;
                    updatedBatter.player_name = newBatter.player_name;
                    updatedBatter.quadruples = updatedBatter.quadruples //* .5; 
                    updatedBatter.runs_batted_in = updatedBatter.runs_batted_in * 1;  
                    updatedBatter.strikeouts = updatedBatter.strikeouts //* .5;
                    updatedBatter.sacrifices = updatedBatter.sacrifices //* .5;
                    updatedBatter.season =  newBatter.season;
                    updatedBatter.singles = updatedBatter.singles * 1; 
                    updatedBatter.slugging = updatedBatter.slugging //* .5;
                    updatedBatter.team = newBatter.team;
                    updatedBatter.team_id = newBatter.team_id;
                    updatedBatter.total_bases = updatedBatter.total_bases * 1; 
                    updatedBatter.triples = updatedBatter.triples * 3; 
                    updatedBatter.walks = updatedBatter.walks //* .5;

                    // console.log(" newBatter.player_id: ",  newBatter.player_id)
                    //push the new player object to the new array created above
                    battersThisWeek.push(updatedBatter)
                }
            })
        })
        
        //find which users team each player is on 
        //then create a duplicate team object with the new arrays of updated players
        //batters first this time
        // let updatedTeamsList = [];
        // let updatedTeam = {};
        // this.state.teamsWithPoints.map(teamPoints => {
        let updatedTeamsList = [];
        let updatedTeam = {};
        this.state.myTeams.map(team => {
            let updatedBatters = [];
            let updatedPitchers = [];

            team.batters.map(batter => {

                battersThisWeek.map(thisBatter => {
                   
                    //check if a player is in both the plaeyrsThisWeek array and the myTeams player array
                    //if so create a new team object that is identical to the one heled in state, 
                    //Except overwrite the players array with the updatedPlayers containing the matched players
                    if (thisBatter.player_id === batter.player_id) {
                        updatedBatters.push(thisBatter)
                    }
                })
            })

            team.pitchers.map(pitcher => {

                pitchersThisWeek.map(thisPitcher => {
                   
                    //check if a player is in both the plaeyrsThisWeek array and the myTeams player array
                    //if so create a new team object that is identical to the one heled in state, 
                    //Except overwrite the players array with the updatedPlayers containing the matched players
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
            // could then put a limit on returning only one team with the same id
            updatedTeamsList.push(updatedTeam)
        })
         // set the updated teams array as a new state which will be mapped over in the return method
        this.setState({teamsWithPoints: updatedTeamsList})
        // console.log("myTeams: ", this.state.myTeams)
        // console.log("teamsWithPoints: ", this.state.teamsWithPoints)
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

     // repeat with the interval of 2 minutes
    
   
   
      // Thoughts on edit:
      // give the item being edited an id & pass it to edit button
      // in edit function get the ref(`conversations` + convoId).orderByChild("messages").equalTo(messageId)
      // .update('key': newValue)
      //
      // create nodes:
      // conversations
      //    convoId: uuidv4();
      //        participants: {userOneId, userTwoId, ...}
      //        messages: {
      //                     messageIdOne: {
      //                                    senderId: userOneId,
      //                                    content: "..."
      //                                  }   
      //                  }

    logout() {
        // console.log(userId)
        fire.auth().signOut()
            .then(() => {
                console.log("logged out")
                this.props.history.push("/login")
            })
            .catch(err => console.log("log out err: ", err))
        // this.history.push("/login");
    }

    render() {

   

        const user = fire.auth().currentUser;
        const myTeams = this.state.myTeams;
        const pitchersThisWeek = this.state.pitchersThisWeek;
        const teamsWithPoints = this.state.teamsWithPoints
        // const myRosters = this.state.myRosters;
        // const user = fire.auth().currentUser;

        // if (!user) {
        //     return (
        //         <Login />
        //     );
        // } 
        if (!myTeams.length) {
            return (
                <div>
                    <h1>Home</h1>
                    <button
                        onClick={this.logout}
                        >
                        Logout
                    </button>
                    <br/>
                    <Link to={`/user/`}>My Team</Link>
                    <br/>
                    <Link to="/testdraft">Test Draft</Link>
                    <br/>
                    <Link to={`/standings`}>Standings</Link>
                    <br/>
                    <Link to={`/login`}>Log in</Link>

                    <br/>
                
                    <h4>uid: </h4>
                    <p>{this.state.userId}</p>
                    <h4>email: </h4>
                    <p>{this.state.userEmail}</p>

                    <h3>My Teams</h3>
                    <br/>
                    <p>You don't have a flantasy blaseball team yet, why not draft one now?</p>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <p>I'm serious, draft one right now!</p>

                </div>
            )
        }

        return (
            
            <div>
                <h1>Home</h1>
                <button
                    onClick={this.logout}
                    >
                    Logout
                </button> 
                <br/>
                <Link to={`/user/`}>My Team</Link>
                <br/>
                <Link to={"/tesDraft"}>Test Draft</Link>
                <br/>
                <Link to={`/standings`}>Standings</Link>
                <br/>
                <Link to={`/login`}>Log in</Link>

                <br/>
            

                <h4>uid: </h4>
                <p>{this.state.userId}</p>
                <h4>email: </h4>
                <p>{this.state.userEmail}</p>

                <h3>My Teams</h3>
                <br/>
                <div>
                {teamsWithPoints.map(team => {
                    return (
                      <>
                        <p><strong>Team Name: </strong> {team.teamName}</p>
                        <p><strong>Team Roster:</strong> </p>

                        <table>
                            <caption>Pitchers</caption>
                            <thead>
                                <tr>
                                    <th>
                                        Name
                                    </th>
                                    <th>
                                        POS
                                    </th>
                                    {/* <th>
                                        G
                                    </th> */}
                                    <th>
                                        W
                                    </th>
                                    {/* <th>
                                        L
                                    </th> */}
                                    {/* <th>
                                        ERA
                                    </th> */}
                                    <th>
                                        QS
                                    </th>
                                    <th>
                                        IP
                                    </th>
                                    <th>
                                        SHO
                                    </th>
                                    {/* <th>
                                        H
                                    </th> */}
                                    {/* <th>
                                        R
                                    </th> */}
                                    {/* <th>
                                        HR
                                    </th> */}
                                    <th>
                                        O
                                    </th>
                                    {/* <th>
                                        W
                                    </th> */}
                                    <th>
                                        SO
                                    </th>
                                    {/* <th>
                                        WHIP
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {team.pitchers.map(pitcher => (
                                <tr key={pitcher.id}>
                                    <td>{pitcher.player_name}</td> 
                                    <td>Pitcher</td>
                                    {/* <td>{pitcher.games}</td> */}
                                    <td>{pitcher.wins}</td>
                                    {/* <td>{pitcher.losses}</td> */}
                                    {/* <td>{pitcher.era}</td> */}
                                    <td>{pitcher.quality_starts}</td> 
                                    <td>{pitcher.innings}</td>
                                    <td>{pitcher.shutouts}</td>
                                    {/* <td>{pitcher.hits_allowed}</td> */}
                                    {/* <td>{pitcher.runs_allowed}</td> */}
                                    {/* <td>{pitcher.hrs_allowed}</td> */}
                                    <td>{pitcher.outs_recorded}</td>
                                    {/* <td>{pitcher.walks}</td>  */}
                                    <td>{pitcher.strikeouts}</td> 
                                    {/* <td>{pitcher.whip}</td>  */}
                                    {/* <td>{pitcher.team}</td>  */}
                                </tr>
                                ))}
                            </tbody>
                        </table>
      
                        <table>
                        <caption>Batters Available</caption>
                        <thead>
                            <tr>
                            <th>
                                Name
                            </th>
                            <th>
                                POS
                            </th>
                            {/* <th>
                                G
                            </th> */}
                            {/* <th>
                                AB
                            </th> */}
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
                            {/* <th>
                                SO
                            </th> */}
                            {/* <th>
                                SFC
                            </th> */}
                            {/* <th>
                                AVG
                            </th> */}
                            {/* <th>
                                OBP
                            </th> */}
                            <th>
                                TB
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.batters.map(batter => (
                            <tr key={batter.id}>
                                <td>{batter.player_name}</td> 
                                <td>Batter</td>
                                {/* <td>{batter.appearances}</td> */}
                                {/* <td>{batter.at_bats}</td> */}
                                <td>{batter.hits}</td>
                                <td>{batter.singles}</td>
                                <td>{batter.doubles}</td>
                                <td>{batter.triples}</td>
                                <td>{batter.home_runs}</td>
                                <td>{batter.runs_batted_in}</td>
                                {/* <td>{batter.strikeouts}</td> */}
                                {/* <td>{batter.sacrifices}</td> */}
                                {/* <td>{batter.batting_average}</td> */}
                                {/* <td>{batter.on_base_percentage}</td> */}
                                <td>{batter.total_bases}</td>
                                {/* <td>{batter.team}</td> */}
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        <br/>
                      </>
                    )
                })}

                </div>
             
               

                <br/>
                <br/>
                <br/>

               

            </div>
           
        )
    }
}

export default Home
