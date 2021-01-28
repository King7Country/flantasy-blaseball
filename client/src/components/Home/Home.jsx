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
    }


    componentDidMount() {
        // console.log("props: ", user).uid;
        // const userId = this.state.userId;
        this.authListener();
    }

    authListener() {
        fire.auth().onAuthStateChanged((user) => {
        //   console.log("pre if: ", user.uid)
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
            });
           return this.setState({myTeams: usersTeams})
            
        })
        .then(() => {
            console.log("then")
            this.getNewPitcherStats();
            this.getNewBatterStats();
        })

    }

      getNewPitcherStats() {
         // loop through pitcher objects to get their id's 
          let pitcherIdString = [];
          let origPitcherStats = [];
            this.state.myTeams.map(team => {
              team.pitchers.map(pitcher => {
                const id = pitcher.player_id;
                pitcherIdString.push(id);
                origPitcherStats.push(pitcher);
              })
          })
          pitcherIdString = pitcherIdString.toString()
         this.setState({origPitcherStats: origPitcherStats});
            // make axios call to server with the string of id's as paramaters
          axios.get(`http://localhost:7777/pitchers-list/${pitcherIdString}`)
          .then(res => {
              console.log("pitcher res: ", res.data)
              this.setState({newPitcherStats: res.data});
          })
          .catch(err => console.log("err: ", err))
      }

      getNewBatterStats() {
        // loop through pitcher objects to get their id's 
         let batterIdString = [];
         let origBatterStats = [];
           this.state.myTeams.map(team => {
             team.batters.map(batter => {
               const id = batter.player_id;
               batterIdString.push(id);
               origBatterStats.push(batter);
             })
         })
         batterIdString = batterIdString.toString();
         this.setState({origBatterStats: origBatterStats});
        //  console.log("batterIdString: ", batterIdString)
           // make axios call to server with teh string of id's as paramaters
         axios.get(`http://localhost:7777/batters-list/${batterIdString}`)
         .then(res => {
             console.log("batter res: ", res.data)
             this.setState({newBatterStats: res.data});
             this.determinePitcherPoints(this.state.origPitcherStats, this.state.newPitcherStats)

         })
         .catch(err => console.log("err: ", err))
     }

     determinePitcherPoints(oldPitchers, newPitchers) {

        // convert all string "number" values into actual numbers
        // from https://stackoverflow.com/questions/61057507/how-to-convert-object-properties-string-to-integer-in-javascript
        function convertIntObj(obj) {
            const res = [];
            for (const key in obj) {
            res[key] = {};
            for (const prop in obj[key]) {
                const parsed = parseInt(obj[key][prop], 10);
                res[key][prop] = isNaN(parsed) ? obj[key][prop] : parsed;
                console.log(res[key][prop])

                }
            }
            return res;
        }
        
        // var result = convertIntObj(obj);
        
        oldPitchers = convertIntObj(oldPitchers)
        newPitchers = convertIntObj(newPitchers)
        // oldBatters= convertIntObj(oldBatters)
        // newBatters = convertIntObj(newBatters)

        console.log('oldPitchers result', oldPitchers)
        console.log('newPitchers result', newPitchers)
        // console.log('oldBatters result', oldBatters)
        // console.log('newBatters result', newBatters)


        let currentPitcher;
        oldPitchers.map(oldPitcher => {
            currentPitcher = oldPitcher;

            // get differences from: https://stackoverflow.com/questions/51013088/get-the-difference-two-objects-by-subtracting-properties
            newPitchers.map(newPitcher => {
                let pointsThisWeek = Object.keys(oldPitcher).reduce((a, i) => {
                    a[i] = oldPitcher[i] - newPitcher[i];
                    return a;
                }, {});
                
                console.log("difference: ", pointsThisWeek);
            })
        })

        // let pointsThisWeek = Object.keys(oldPitchers).reduce((a, i) => {
        //     a[i] = oldPitchers[i] - newPitchers[i];
        //     return a;
        // }, {});
        
        // console.log("difference: ", pointsThisWeek);
     }


      // get team roster from database
      // access set of players (pitchers)
      //    *the stats from database should be the stats from the day they were drafted
      // map through players to get their id's 
      // return a string of id's seperated by comma's
      // make axios call to server with teh string of id's as paramaters
      // from server receive request and make same axios request to db API for current season data on those players
      // return current season data to client
      // loop through the returned array of current players
      //    use this to find the difference between objects
      //    then multiply the result by the point factor
      // return that number as the fantasy score to display


      

      // To edit:
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

        // setTimeout(
        //     function() {
        //         this.getNewPitcherStats();
        //         this.getNewBatterStats();
        //     }
        //     , 3000
        // );

        // userId = this.state.userId
        const user = fire.auth().currentUser;
        const myTeams = this.state.myTeams;
        // const myRosters = this.state.myRosters;
        console.log("myTeams: ", myTeams)

        if (!user) {
            return (
                <Login />
            );
        } 
        // if (!myTeams.length) {
        //     return (
        //         <div>
        //             <br/>
        //             <br/>
        //             <br/>
        //             <h2>Loading...</h2>
        //         </div>
        //     )
        // }

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
                <div>
                {myTeams.map(team => {
                    return (
                        <>
                        <p><strong>Team Name: </strong> {team.teamName}</p>
                        <p><strong>Team Roster:</strong> </p>
                        <p>Pitchers: {team.pitchers.map(player => {
                            return (
                                <p>{player.player_name}, ERA: {player.era}</p>
                            )
                        })}
                        </p>

                        <p>Batters: {team.batters.map(player => {
                            return (
                                <p>{player.player_name}, RBI: {player.runs_batted_in}</p>
                            )
                        })}
                       
                        </p>

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
