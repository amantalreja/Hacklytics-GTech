import React, { useState } from "react";
import { Link } from "react-router-dom";
import PitchStartupOverlay from "./PitchStartupOverlay";
import "./Header.css";


const Header = () => {
  const [isPitchOpen, setIsPitchOpen] = useState(false);

  return (
    <header>
      <h1>VentureSeed: Enabling MicroInvestors</h1>
      <nav>
        <button onClick={() => setIsPitchOpen(true)} className="nav-btn">
          Pitch Your Startup
        </button>
        <Link to="/insights">
          Go to Insights
        </Link>
      </nav>
      <PitchStartupOverlay
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
        onSuccess={() => console.log("Pitch submitted successfully!")}
      />
    </header>
  );
};

export default Header;
