import { PutCommand, GetCommand,UpdateCommand } from "@aws-sdk/lib-dynamodb";
import dynamoDBClient from "./DynamoClient";

export const addStartup = async (
  id,
  startupName,
  bio,
  totalInvested,
  targetInvestment,
  capitalOneStake,
  totalUsersInvesting,
  teamMembers,
  logoURL
) => {
  try {
    const params = {
      TableName: "Hacklytics",
      Item: {
        id, // new unique identifier (could be your partition key, if set up that way)
        startupName, // Name of the startup
        bio, // Description or bio of the startup
        totalInvested, // Amount invested so far
        targetInvestment, // Funding goal
        capitalOneStake, // Numeric value representing the stake (e.g. 20 for "20%")
        totalUsersInvesting, // Total number of users investing
        teamMembers, // Array of team member URLs or names
        logoURL, // URL to the startup logo
      },
    };

    const command = new PutCommand(params);
    await dynamoDBClient.send(command);
    console.log(`Startup "${startupName}" added successfully!`);
    return { success: true, message: "Startup added!" };
  } catch (error) {
    console.error("Error adding startup:", error);
    return { success: false, message: error.message };
  }
};


export const getStartup = async (startupName) => {
  try {
    const params = {
      TableName: "Hacklytics",
      Key: {
        startupName: startupName,
      },
    };

    const command = new GetCommand(params);
    const response = await dynamoDBClient.send(command);

    if (!response.Item) {
      throw new Error("Startup not found");
    }

    console.log("Startup data:", response.Item);
    return response.Item;
  } catch (error) {
    console.error("Error fetching startup:", error);
    return null;
  }
};
export const updateStartupInvestment = async (startupName, additionalInvestment) => {
  try {
    const params = {
      TableName: "Hacklytics",
      Key: {
        startupName: startupName, // Use startupName as the key per schema
      },
      UpdateExpression:
        "SET totalInvested = if_not_exists(totalInvested, :start) + :inc, totalUsersInvesting = if_not_exists(totalUsersInvesting, :one) + :one",
      ExpressionAttributeValues: {
        ":inc": additionalInvestment,
        ":start": 0,
        ":one": 1,
      },
      ReturnValues: "UPDATED_NEW",
    };
    console.log(startupName + "STARTUPP");

    const command = new UpdateCommand(params);
    const response = await dynamoDBClient.send(command);
    console.log("Updated startup investment:", response.Attributes);
    return response.Attributes;
  } catch (error) {
    console.error("Error updating startup investment:", error);
    throw error;
  }
};
