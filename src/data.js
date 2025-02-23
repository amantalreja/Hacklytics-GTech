import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import dynamoDBClient from "./Components/DynamoClient";

const fetchAllStartupsData = async () => {
  try {
    const params = {
      TableName: "Hacklytics",
    };
    const command = new ScanCommand(params);
    const response = await dynamoDBClient.send(command);
    return response.Items || [];
  } catch (error) {
    console.error("Error scanning startups data:", error);
    return [];
  }
};

export default fetchAllStartupsData;
