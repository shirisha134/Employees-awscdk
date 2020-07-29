import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import { DynamoDBConstruct } from "./dynamo-db.construct";
import { ApiGatewayConstruct } from "./api-gateway.construct";

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
    const welcomeLambda = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: new lambda.AssetCode("src"),
      environment: { SITE_NAME: siteName },
      handler: "hello.handler",
    });

    // create lambda for posting a record/employee
    const postEmployeeLambda = new lambda.Function(
      this,
      "postEmployeeLambdaId",
      {
        code: new lambda.AssetCode("src"),
        handler: "create.handler",
        runtime: lambda.Runtime.NODEJS_10_X,
        environment: lambdaVars,
      }
    );
    // granting readWrite permissions to lambdas on employeesDynamoDBIntance
    employeesDynamoDBIntance.grantFullAccess(postEmployeeLambda);

    // create lambda for getting all records/employees
    const getAllEmployeeLambda = new lambda.Function(
      this,
      "getAllEmployeesLambdaId",
      {
        code: new lambda.AssetCode("src"),
        handler: "get-all.handler",
        runtime: lambda.Runtime.NODEJS_10_X,
        environment: { TABLE_NAME: tableName, PRIMARY_KEY: "employeeId" },
      }
    );
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
