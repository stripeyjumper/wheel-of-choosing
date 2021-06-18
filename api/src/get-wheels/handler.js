"use strict";
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "eu-west-1" });

module.exports.getWheels = async (event) => {
  const params = {
    TableName: "Wheels",
    Key: {
      Id: { S: "toot" },
    },
  };

  const data = await client.send(new GetItemCommand(params));

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: data,
      },
      null,
      2
    ),
  };
};
