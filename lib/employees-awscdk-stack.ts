import * as cdk from "@aws-cdk/core";
import { DynamoDBConstruct } from "./dynamo-db.construct";
import { ApiGatewayConstruct } from "./api-gateway.construct";
import { LambdaConstruct } from "./lambda.construct";

const STACK_NAME_EMPTY_ERROR = "Please provide stackName!";
const apiGatewayNameSuffix = "_apigateway";
const dynamoDbTableSuffix = "_employees";
const primaryKey = "employeeId";
const partitionKey = "employeeId";
const helloHandler = "hello.handler";
const createHandler = "create.handler";
const getAllHandler = "get-all.handler";

export class EmployeesAwscdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const siteName = props && props.stackName;
    if (!siteName) {
      throw new Error(STACK_NAME_EMPTY_ERROR);
    }
    var apiGatewayName = `${siteName}${apiGatewayNameSuffix}`;
    var tableName = `${siteName}${dynamoDbTableSuffix}`;
    var lambdaVars = { TABLE_NAME: tableName, PRIMARY_KEY: primaryKey };

    // Provision dynamoDb
    const employeesDynamoDBIntance = new DynamoDBConstruct(this, id, {
      tableName,
      partitionKeyName: partitionKey,
    }).dynamoDbTable;

    // tag employeesDynamoDBIntance, this will add tags to the node of a construct and all its the taggable children
    cdk.Tag.add(employeesDynamoDBIntance, "stackType", "dynamoTag");

    // --- welcome lambda ---
    const welcomeLambda = new LambdaConstruct(this, "HelloHandler", {
      environment: { SITE_NAME: siteName },
      handler: helloHandler,
    }).lambda;

    // --- Post demployee data lambda ---
    const postEmployeeLambda = new LambdaConstruct(
      this,
      "postEmployeeLambdaId",
      {
        environment: lambdaVars,
        handler: createHandler,
      }
    ).lambda;
    // granting readWrite permissions to lambdas on employeesDynamoDBIntance
    employeesDynamoDBIntance.grantFullAccess(postEmployeeLambda);

    // tag a postEmployeeLambda, this will add tags to the node of a construct and all its the taggable children
    cdk.Tag.add(postEmployeeLambda, "stackType", "lambdaTag");

    // --- Get all demployee data lambda ---
    const getAllEmployeeLambda = new LambdaConstruct(
      this,
      "getAllEmployeesLambdaId",
      {
        environment: lambdaVars,
        handler: getAllHandler,
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
