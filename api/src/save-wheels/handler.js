"use strict";
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "eu-west-1" });

module.exports.saveWheels = async (event) => {
  const params = {
    TableName: "Wheels",
    Item: {
      Id: { S: "toot" },
      name: "Fruity boot loop!",
    },
  };

  await client.send(new PutItemCommand(params));

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Ok I saved it...",
      },
      null,
      2
    ),
  };
};
