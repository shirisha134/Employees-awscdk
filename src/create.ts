const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require("uuid/v4");
const TABLE_NAME = process.env.TABLE_NAME || "";
const PRIMARY_KEY = process.env.PRIMARY_KEY || "";
var region = process.env.AWS_REGION;
AWS.config.update({ region: region });

export const handler = async (
  event: any = {},
  callback: any
): Promise<any> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: "invalid request, you are missing the parameter body"
    };
  }
  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);
  item[PRIMARY_KEY] = uuidv4();
  const params = {
    TableName: TABLE_NAME,
    Item: item
  };
  console.log("paramsparamsparams", params);
  db.put(params, function(err: any, data: any = {}) {
    if (err) {
      console.log("error fro post", err);
      callback(err, null);
    } else {
      var response = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Credentials": "true"
        },
        isBase64Encoded: false
      };
      console.log("success: returned ${data.Item}");
      callback(null, response);
    }
  });
};
