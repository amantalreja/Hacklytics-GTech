import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2"; // Update if using a different AWS region

const dynamoDBClient = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: "AKIA356SJZPTSMN6XNZY",
    secretAccessKey: "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",
  },
});

export default dynamoDBClient;
