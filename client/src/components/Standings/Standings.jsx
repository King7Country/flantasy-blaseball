import React, { Component, useState, useEffect } from 'react';
import axios from "axios";
import fire from "../../config/fire";
import "./Standings.scss"

const Standings = ({user}) => {

    // const [user] = useState(user);
    const [teams, setTeams] = useState([]);

  useEffect(() => {
          //   console.log("pre if: ", user.uid)
          const userId = user.uid;
          console.log("uid : ", userId)
            
            // const teamsRef = "";
            fire.database().ref(`teams`).on('value', (snapshot) => {
            // console.log("snapshot : ", snapshot)

                let teams = [];
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    childData.score = Math.floor(Math.random() * 77) + 77;
                    
                    teams.push(childData);
                    // console.log("childData: ", childData)
                });
                const sortTeams = (a, b) => {
                  return  b.score - a.score;
                };
                let sortedTeams = teams.sort(sortTeams);
                  // console.log(teams.sort())

                setTeams(sortedTeams);
            });
  }, [setTeams])

        return (
            <div>
            <h2>Standings</h2>
                <table className="standings">
          <caption>Pitchers Available</caption>
          <thead>
            <tr>
              <th>
                  Team
              </th>
              <th>
                  User
              </th>
              <th>
                  Score
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team.teamId}>
                <td>{team.teamName}</td> 
                <td>{team.userId}</td>
                <td>{team.score}</td>
                <td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

            </div>
        )
}

export default Standings
