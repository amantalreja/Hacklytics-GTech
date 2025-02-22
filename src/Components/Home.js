import React, { useState } from "react";
import { Link } from "react-router-dom";
import startupsData from "../data";
import StartupCard from "./StartupCard";

const Home = () => {
  const [availableStartups, setAvailableStartups] = useState(startupsData);
  const [investedStartups, setInvestedStartups] = useState([]);

  const investInStartup = (id) => {
    const selectedStartup = availableStartups.find((s) => s.id === id);
    setInvestedStartups([...investedStartups, selectedStartup]);
    setAvailableStartups(availableStartups.filter((s) => s.id !== id));
  };

  return (
    <div className="container">
      <header>
        <h1>Hackalytics - Startup Investment</h1>
        <nav>
          <Link to="/insights">Go to Insights</Link>
        </nav>
      </header>
      <div className="content">
        {/* Available Startups */}
        <div className="column">
          <h2>Available Startups</h2>
          {availableStartups.length > 0 ? (
            availableStartups.map((startup) => (
              <StartupCard
                key={startup.id}
                logo={startup.logo}
                name={startup.name}
                description={startup.description}
                goal={startup.goal}
                invested={startup.invested}
                stake={startup.stake}
                totalUsers={startup.totalUsers}
                team={startup.team}
                onInvest={() => investInStartup(startup.id)}
                investedStatus={false}
              />
            ))
          ) : (
            <p>No more startups available.</p>
          )}
        </div>

        {/* Invested Startups */}
        <div className="column">
          <h2>Already Invested</h2>
          {investedStartups.length > 0 ? (
            investedStartups.map((startup) => (
              <StartupCard
                key={startup.id}
                logo={startup.logo}
                name={startup.name}
                description={startup.description}
                goal={startup.goal}
                invested={startup.invested}
                stake={startup.stake}
                totalUsers={startup.totalUsers}
                team={startup.team}
                investedStatus={true}
              />
            ))
          ) : (
            <p>No investments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
