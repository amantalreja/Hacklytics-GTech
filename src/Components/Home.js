import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import fetchStartupsData from "../data"; // Now this returns a promise with DynamoDB data
import StartupCard from "./StartupCard";
import CreditCard from "./CreditCard";
import InvestedStartups from "./InvestedStartups";
import { addStartup } from "./dynamoOperations"; // Unused in this snippet, but still imported if needed
import "./InvestedStartups.css";
import Header from "./Header";

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

  const [availableStartups, setAvailableStartups] = useState([]);
  const [investedStartups, setInvestedStartups] = useState(exampleInvestedStartups);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStartupsData();
        setAvailableStartups(data);
      } catch (error) {
        console.error("Error fetching startups data:", error);
        setMessage("Error fetching startups data.");
      }
    };
    fetchData();
  }, []);

  const investInStartup = (id) => {
    const selectedStartup = availableStartups.find(
      (s) => s.id === id || s.startupName === id
    );
    if (selectedStartup) {
      setInvestedStartups([...investedStartups, selectedStartup]);
      setAvailableStartups(
        availableStartups.filter(
          (s) => s.id !== id && s.startupName !== id
        )
      );
      setMessage(`Successfully invested in ${selectedStartup.name || selectedStartup.startupName}`);
    }
  };

  return (
    <div className="container">
      <Header/>
      <CreditCard />
      {message && <p style={{ color: "green" }}>{message}</p>}
      <div className="content">
        {/* Available Startups Column */}
        <div className="column">
          <h2 style={{ color: "black" }}>Available Startups</h2>
          {availableStartups.length > 0 ? (
            availableStartups.map((startup) => (
              <StartupCard
                key={startup.id || startup.startupName}
                logo={startup.logoURL || startup.logo}
                name={startup.startupName || startup.name}
                description={startup.bio || startup.description}
                goal={startup.targetInvestment || startup.goal}
                invested={startup.totalInvested || startup.invested}
                stake={startup.capitalOneStake || startup.stake}
                totalUsers={startup.totalUsersInvesting || startup.totalUsers}
                team={startup.teamMembers || startup.team}
                onInvest={() =>
                  investInStartup(startup.id || startup.startupName)
                }
                investedStatus={false}
              />
            ))
          ) : (
            <p>No more startups available.</p>
          )}
        </div>

        {/* Already Invested Column */}
        <div className="column">
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
