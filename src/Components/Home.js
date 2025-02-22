import React, { useState } from "react";
import { Link } from "react-router-dom";
import startupsData from "../data";
import StartupCard from "./StartupCard";
import CreditCard from "./CreditCard";
import InvestedStartups from "./InvestedStartups";
import "./InvestedStartups.css"; // Ensure this CSS is imported

const Home = () => {
  // Example invested startups data (initially set)
  const exampleInvestedStartups = [
    {
      id: "tech1",
      name: "TechNova",
      logo: "/path/to/logo",
      description: "AI-powered analytics platform",
      goal: "Transform data into actionable insights",
      invested: 45000,
      stake: 20,
      totalUsers: 1500,
      team: ["John Doe", "Jane Smith"]
    },
    {
      id: "green1",
      name: "GreenFuture",
      logo: "/path/to/logo",
      description: "Sustainable energy solutions",
      goal: "Renewable energy innovation",
      invested: 125000,
      stake: 35,
      totalUsers: 2000,
      team: ["Alice Johnson", "Bob Wilson"]
    }
  ];

  const [availableStartups, setAvailableStartups] = useState(startupsData);
  const [investedStartups, setInvestedStartups] = useState(exampleInvestedStartups);

  const investInStartup = (id) => {
    const selectedStartup = availableStartups.find((s) => s.id === id);
    if (selectedStartup) {
      setInvestedStartups([...investedStartups, selectedStartup]);
      setAvailableStartups(availableStartups.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Hackalytics - Startup Investment</h1>
        <nav>
          <Link to="/insights">Go to Insights</Link>
        </nav>
      </header>

      <CreditCard
        cardNumber="1234 5678 9012 3456"
        cardHolder="John Doe"
        expiry="12/24"
        cardType="MasterCard"
      />

      <div className="content">
        {/* Available Startups Column */}
        <div className="column">
          <h2 style={{ color: "black" }}>Available Startups</h2>
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

        {/* Already Invested Column */}
        <div className="column">
          <h2>Already Invested</h2>
          {investedStartups.length > 0 ? (
            <InvestedStartups investedStartups={investedStartups} />
          ) : (
            <p>No investments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
