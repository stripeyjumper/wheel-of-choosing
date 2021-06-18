"use strict";
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "eu-west-1" });

function getUserId(event) {
  return event.requestContext.authorizer.jwt.claims.sub;
}

module.exports.saveWheels = async (event) => {
  const params = {
    TableName: "Wheels",
    Item: {
      Id: { S: getUserId() },
      wheelName: { S: "Fruity boot loop!" },
    },
  };

  let error;
  try {
    await client.send(new PutItemCommand(params));
  } catch (e) {
    error = e;
    console.log("Error here:", error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Saved it!",
        user: getUserId(event),
        event,
      },
      null,
      2
    ),
  };
};
