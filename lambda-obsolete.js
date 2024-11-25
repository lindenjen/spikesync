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

      case "POST /teams":
        const team = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: `Team#${user.id}`,
              teamName: team.teamName,
              tournamentNumber: team.tournamentNumber,
              pool: team.pool,
              poolPlayWins: team.poolPlayWins,
              poolPlayMatchState: team.poolPlayMatchState,
              poolPlayDifferentialPoints: team.poolPlayDifferentialPoints,
              poolPlayDifferentialTotal: team.poolPlayDifferentialTotal,
              poolPlayRank: team.poolPlayRank,
              bracket: team.bracket,
              bracketDifferentialPoints: team.bracketDifferentialPoints,
              bracketDifferentialTotal: team.bracketDifferentialTotal,
              teamBeatenBracket: team.teamBeatenBracket
            },
          })
        );
        body = `Created team ${team.id}`;
        break;

      case "GET /teams":
        body = await dynamo.send(new ScanCommand({ TableName: tableName }));
        body = body.Items.filter((item) => item.id.startsWith("Team#"));
        break;
      
      case "GET /teams{id}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: `Team#${event.pathParameters.id}`,
            },
          })
        );
        body = body.Item;
        break;

      case "PUT /teams/{id}":
        const updateFields = JSON.parse(event.body);
        const updateExpressions = [];
        const expressionAttributeValues = {};

        if (updateFields.PoolPlayDifferentialPoints) {
          const differentialTotal = updateFields.PoolPlayDifferentialPoints.reduce(
            (total, point) => total + point,
            0
          );
          updateExpressions.push("set PoolPlayDifferentialPoints = :d, PoolPlayDifferentialTotal = :dt");
          expressionAttributeValues[":d"] = updateFields.PoolPlayDifferentialPoints;
          expressionAttributeValues[":dt"] = differentialTotal;
        }

        if (updateFields.PoolPlayWins !== undefined) {
          updateExpressions.push("set PoolPlayWins = :w");
          expressionAttributeValues[":w"] = updateFields.PoolPlayWins;
        }

        if (updateFields.PoolPlayMatchState) {
          updateExpressions.push("set PoolPlayMatchState = :m");
          expressionAttributeValues[":m"] = updateFields.PoolPlayMatchState;
        }

        if (updateExpressions.length === 0) {
          throw new Error("No valid fields provided for update");
        }

        await dynamo.send(
          new UpdateCommand({
            TableName: tableName,
            Key: { TeamID: event.pathParameters.id },
            UpdateExpression: updateExpressions.join(", "),
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "UPDATED_NEW",
          })
        );
        body = `Updated team ${event.pathParameters.id}`;
        break;

      case "DELETE /teams/{id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: `Team#${event.pathParameters.id}`,
            },
          })
        );
        body = `Deleted team ${event.pathParameters.id}`;
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
