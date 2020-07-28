const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (event: any = {}, callback: any): Promise<any> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: "invalid request, you are missing the parameter body"
    };
  }
  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);
  const params = {
    TableName: TABLE_NAME,
    Item: item
  };
  try {
    const response = await db.put(params).promise();
    return { statusCode: 200, body: JSON.stringify(response) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
