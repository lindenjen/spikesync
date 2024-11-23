import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "spikesync";

export const handler = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      // MATCHES
      case "POST /matches":
        const match = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: `Match#${match.id}`,
              pool: match.pool,
              date: match.date,
              court: match.court,
              teams: match.teams,
              scores: match.scores || [],
            },
          })
        );
        body = `Created match ${match.id}`;
        break;

      case "GET /matches/{id}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: `Match#${event.pathParameters.id}`,
            },
          })
        );
        body = body.Item;
        break;

      case "DELETE /matches/{id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: `Match#${event.pathParameters.id}`,
            },
          })
        );
        body = `Deleted match ${event.pathParameters.id}`;
        break;

      case "GET /matches":
        body = await dynamo.send(new ScanCommand({ TableName: tableName }));
        body = body.Items.filter((item) => item.id.startsWith("Match#"));
        break;

      // BRACKETS
      case "POST /brackets":
        const bracket = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: `Bracket#${bracket.id}`,
              round: bracket.round,
              teams: bracket.teams,
              winners: bracket.winners || [],
            },
          })
        );
        body = `Created bracket ${bracket.id}`;
        break;

      case "GET /brackets/{id}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: `Bracket#${event.pathParameters.id}`,
            },
          })
        );
        body = body.Item;
        break;

      case "DELETE /brackets/{id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: `Bracket#${event.pathParameters.id}`,
            },
          })
        );
        body = `Deleted bracket ${event.pathParameters.id}`;
        break;

      case "GET /brackets":
        body = await dynamo.send(new ScanCommand({ TableName: tableName }));
        body = body.Items.filter((item) => item.id.startsWith("Bracket#"));
        break;

      // LOCATIONS
      case "POST /locations":
        const location = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: `Location#${location.id}`,
              name: location.name,
              address: location.address,
              courts: location.courts || 0,
            },
          })
        );
        body = `Created location ${location.id}`;
        break;

      case "GET /locations/{id}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: `Location#${event.pathParameters.id}`,
            },
          })
        );
        body = body.Item;
        break;

      case "DELETE /locations/{id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: `Location#${event.pathParameters.id}`,
            },
          })
        );
        body = `Deleted location ${event.pathParameters.id}`;
        break;

      case "GET /locations":
        body = await dynamo.send(new ScanCommand({ TableName: tableName }));
        body = body.Items.filter((item) => item.id.startsWith("Location#"));
        break;

      // USERS
      case "POST /users":
        const user = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: `User#${user.id}`,
              name: user.name,
              email: user.email,
              role: user.role || "player",
            },
          })
        );
        body = `Created user ${user.id}`;
        break;

      case "GET /users/{id}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: `User#${event.pathParameters.id}`,
            },
          })
        );
        body = body.Item;
        break;

      case "DELETE /users/{id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: `User#${event.pathParameters.id}`,
            },
          })
        );
        body = `Deleted user ${event.pathParameters.id}`;
        break;

      case "GET /users":
        body = await dynamo.send(new ScanCommand({ TableName: tableName }));
        body = body.Items.filter((item) => item.id.startsWith("User#"));
        break;

      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
