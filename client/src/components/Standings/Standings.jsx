import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import fire from "../../config/fire";

import "./Standings.scss"

const Standings = ({user}) => {

    const [teams, setTeams] = useState([]);

  useEffect(() => {
    fire.database().ref(`teams`).on('value', (snapshot) => {

      let teams = [];
      snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          childData.score = Math.floor(Math.random() * 77) + 77;
          
          teams.push(childData);
      });
      const sortTeams = (a, b) => {
        return  b.score - a.score;
      };
      let sortedTeams = teams.sort(sortTeams);

      setTeams(sortedTeams);
    });
  }, [setTeams])

        return (
            <div className="standings__container">
              <h2 className="standings__heading">Standings</h2>
              <table className="standings">
                <thead className="standings__head">
                  <tr className="standings__row--head">
                    <th className="standings__head-items">
                        Team
                    </th>
                    <th className="standings__head-items">
                        User
                    </th>
                    <th className="standings__head-items">
                        Score
                    </th>
                  </tr>
                </thead>
                <tbody className="standings__body">
                  {teams.map(team => (
                    <tr 
                      className="standings__row"
                      key={team.teamId}>
                      <td className="standings__row-items">{team.teamName}</td> 
                      <td className="standings__row-items">{team.userName}</td>
                      <td className="standings__row-items">{team.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )
}

export default Standings
