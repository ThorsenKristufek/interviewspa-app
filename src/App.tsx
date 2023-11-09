import React, { useState, useEffect } from 'react';
import logo from './logos/mlblogo.png';
import rangersLogo from './logos/texasrangers.png';
import diamondbacksLogo from './logos/diamondbacks.png';
import yankeesLogo from './logos/yankees.png';
import redSoxLogo from './logos/redsox.png';
import defaultLogo from './logos/default.png'; //For teams logo I didnt include
import styles from './gamefeed.module.css';

interface Game {
  gamePk: number;
  teams: {
    away: { team: { name: string }, score: number },
    home: { team: { name: string }, score: number },
  };
  status: {
    abstractGameState: string,
    inning: number,
    inningState: string,
    detailedState: string,
  };
}

interface TeamLogos {
  [key: string]: string;
}

const teamLogos: TeamLogos = {
  "New York Yankees": yankeesLogo,
  "Boston Red Sox": redSoxLogo,
  "Texas Rangers": rangersLogo,
  "Arizona Diamondbacks": diamondbacksLogo,
  // Would add one for each team- but dont have time
};

const GameFeed: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        //Would change to pull live game if lives games were an option.
        const response = await fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=2023-10-30`);
        const data = await response.json();
        setGames(data.dates[0].games);
      } catch (error) {
        console.error('There was an error fetching the games:', error);
      }
    };

    fetchGames();
  }, []);

  const mostRecentGame = games.length > 0 ? games[games.length - 1] : null;
  //Things like the inning below would take the inning status during a live game
  return (
    <div>
      <div className={styles.header}>
        <span>MLB Game Feed</span>
        <img src={logo} alt="MLB Logo" className={styles.logo} />
      </div>
      {mostRecentGame && (
        <div key={mostRecentGame.gamePk} className={styles.gameContainer}>
          <div className={`${styles.teamLogoContainer} ${styles.awayTeamLogo}`}>
            <img src={teamLogos[mostRecentGame.teams.away.team.name] || defaultLogo} 
                 alt={`${mostRecentGame.teams.away.team.name} Logo`} 
                 className={styles.teamLogo} />
          </div>
          <div className={styles.gameRow}>
            <div className={styles.teamName}>{mostRecentGame.teams.away.team.name}</div>
            <div className={styles.score}>{mostRecentGame.teams.away.score}</div>
            <div className={styles.inning}>{mostRecentGame.status.abstractGameState}</div>
            <div className={styles.score}>{mostRecentGame.teams.home.score}</div>
            <div className={styles.teamName}>{mostRecentGame.teams.home.team.name}</div>
            <div className={styles.outs}>{/* Number of Outs if was a live game*/}</div>
          </div>
          <div className={`${styles.teamLogoContainer} ${styles.homeTeamLogo}`}>
            <img src={teamLogos[mostRecentGame.teams.home.team.name] || defaultLogo} 
                 alt={`${mostRecentGame.teams.home.team.name} Logo`} 
                 className={styles.teamLogo} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameFeed;
