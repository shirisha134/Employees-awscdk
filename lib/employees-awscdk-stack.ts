import * as cdk from "@aws-cdk/core";
import { DynamoDBConstruct } from "./dynamo-db.construct";
import { ApiGatewayConstruct } from "./api-gateway.construct";
import { LambdaConstruct } from "./lambda.construct";

export class EmployeesAwscdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const siteName = props && props.stackName;
    if (!siteName) {
      throw new Error("Please provide stackName!");
    }
    var apiGatewayName = siteName + "_apigateway";
    var tableName = siteName + "_employees";
    var lambdaVars = { TABLE_NAME: tableName, PRIMARY_KEY: "employeeId" };

    // Provision dynamoDb
    const employeesDynamoDBIntance = new DynamoDBConstruct(this, id, {
      tableName,
      partitionKeyName: "employeeId",
    }).dynamoDbTable;

    // --- welcome lambda ---
    const welcomeLambda = new LambdaConstruct(this, "HelloHandler", {
      environment: { SITE_NAME: siteName },
      handler: "hello.handler",
    }).lambda;

    // --- Post demployee data lambda ---
    const postEmployeeLambda = new LambdaConstruct(
      this,
      "postEmployeeLambdaId",
      {
        environment: lambdaVars,
        handler: "create.handler",
      }
    ).lambda;
    // granting readWrite permissions to lambdas on employeesDynamoDBIntance
    employeesDynamoDBIntance.grantFullAccess(postEmployeeLambda);

    // --- Get all demployee data lambda ---
    const getAllEmployeeLambda = new LambdaConstruct(
      this,
      "getAllEmployeesLambdaId",
      {
        environment: lambdaVars,
        handler: "get-all.handler",
      }
    ).lambda;
    // granting read permissions to lambda on employeesDynamoDBIntance
    employeesDynamoDBIntance.grantReadData(getAllEmployeeLambda);

    // Integrating all lambdas with apigateway with specific methods
    new ApiGatewayConstruct(this, apiGatewayName)
      .addResource("welcome", [{ lambda: welcomeLambda, method: "GET" }])
      .addResource("employee", [
        { lambda: postEmployeeLambda, method: "POST" },
        { lambda: getAllEmployeeLambda, method: "GET" },
      ]);
  }
}
