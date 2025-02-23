import React, { useState } from "react";
import { addStartup } from "./dynamoOperations"; // Adjust the path as needed
import "./PitchStartupOverlay.css";

const PitchStartupOverlay = ({ isOpen, onClose, onSuccess }) => {
  const [startupName, setStartupName] = useState("");
  const [bio, setBio] = useState("");
  const [targetInvestment, setTargetInvestment] = useState("");
  const [capitalOneStake, setCapitalOneStake] = useState("");
  const [logoURL, setLogoURL] = useState("");
  const [teamMembers, setTeamMembers] = useState(""); // Comma-separated list
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Require only essential fields
    if (!startupName || !bio) {
      setErrorMessage("Please fill in Startup Name and Bio.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      // Fallback defaults: if targetInvestment or capitalOneStake is empty/invalid, use defaults
      const numericTargetInvestment = parseFloat(targetInvestment);
      const finalTargetInvestment = isNaN(numericTargetInvestment)
        ? 100000
        : numericTargetInvestment;

      const numericStake = parseFloat(capitalOneStake);
      const finalStake = isNaN(numericStake) ? 10 : numericStake;

      // Use a placeholder if logoURL is empty
      const finalLogoURL = logoURL || "https://via.placeholder.com/150";

      // Process teamMembers (default to empty array if blank)
      const teamMembersArray = teamMembers
        ? teamMembers.split(",").map((member) => member.trim()).filter(Boolean)
        : [];

      // Generate a unique id using the current timestamp
      const id = Date.now().toString();

      // Instead of passing 0, we pass 1 for totalInvested and totalUsersInvesting
      const result = await addStartup(
        id,
        startupName,
        bio,
        1, // totalInvested default value
        finalTargetInvestment,
        finalStake,
        1, // totalUsersInvesting default value
        teamMembersArray,
        finalLogoURL
      );

      if (result.success) {
        // Notify parent that the pitch was successfully submitted
        onSuccess && onSuccess();
        // Clear form fields
        setStartupName("");
        setBio("");
        setTargetInvestment("");
        setCapitalOneStake("");
        setLogoURL("");
        setTeamMembers("");
        onClose();
      } else {
        setErrorMessage(result.message || "Failed to add startup.");
      }
    } catch (error) {
      console.error("Error adding startup:", error);
      setErrorMessage("Error adding startup.");
    }
    setLoading(false);
  };

  return (
    <div className="overlay">
      <div className="pitch-popup">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2>Pitch Your Startup</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>Startup Name*</label>
          <input
            type="text"
            value={startupName}
            onChange={(e) => setStartupName(e.target.value)}
          />

          <label>Description*</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div className="input-row">
            <div>
              <label>Amount to Raise* (Target Investment)</label>
              <input
                type="number"
                value={targetInvestment}
                onChange={(e) => setTargetInvestment(e.target.value)}
                placeholder="100000"
              />
            </div>
            <div>
              <label>Current Stake* (in %)</label>
              <input
                type="number"
                value={capitalOneStake}
                onChange={(e) => setCapitalOneStake(e.target.value)}
                placeholder="10"
              />
            </div>
          </div>

          <label>Logo URL</label>
          <input
            type="text"
            value={logoURL}
            onChange={(e) => setLogoURL(e.target.value)}
            placeholder="https://via.placeholder.com/150"
          />

          <label>Team Members (comma separated)</label>
          <input
            type="text"
            value={teamMembers}
            onChange={(e) => setTeamMembers(e.target.value)}
            placeholder="Alice, Bob, Carol"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Pitch"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PitchStartupOverlay;
