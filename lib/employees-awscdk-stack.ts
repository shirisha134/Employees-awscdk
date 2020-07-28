import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";

export class EmployeesAwscdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const siteName = props && props.stackName;
    if(!siteName) {
      throw new Error('Please provide stackName!');
    }
    var apiGatewayName = siteName + "_apigateway";
    var tableName = siteName + "_employees";
    var lambdaVars = { TABLE_NAME: tableName, PRIMARY_KEY: "employeeId" };
    // instantiate dynamodb table instance with default instance size and resource id starts with employeesDynamoDBIntanceID
    const employeesDynamoDBIntance = new dynamodb.Table(
      this,
      "employeesDynamoDBIntanceID",
      {
        tableName: tableName,
        partitionKey: {
          name: "employeeId",
          type: dynamodb.AttributeType.NUMBER
        },
        removalPolicy: cdk.RemovalPolicy.DESTROY
      }
    );

    // creating api gatway
    const api = new apigateway.RestApi(this, apiGatewayName);
    // creating resource on api gatway
    const employee = api.root.addResource("employee");
    const welcome = api.root.addResource("welcome");

    // --- welcome lambda ---
    const welcomeLambda = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset("src"),
      environment: lambdaVars,
      handler: "hello.handler"
    });

    // greeter lambda integration
    const helloIntegration = new apigateway.LambdaIntegration(welcomeLambda);
    welcome.addMethod("GET", helloIntegration);

    // create lambda for posting a record/employee
    const postEmployeeLambda = new lambda.Function(
      this,
      "postEmployeeLambdaId",
      {
        code: new lambda.AssetCode("src"),
        handler: "create.handler",
        runtime: lambda.Runtime.NODEJS_10_X,
        environment: lambdaVars
      }
    );
    // granting readWrite permissions to lambdas on employeesDynamoDBIntance
    employeesDynamoDBIntance.grantFullAccess(postEmployeeLambda);
    // Integrating createLambda with apigateway
    const createIntegration = new apigateway.LambdaIntegration(
      postEmployeeLambda
    );

    employee.addMethod("POST", createIntegration);
    // adding cors for post request
    // addCorsOptions(createEmployee);

    // create lambda for getting all records/employees
    const getAllEmployeeLambda = new lambda.Function(
      this,
      "getAllEmployeesLambdaId",
      {
        code: new lambda.AssetCode("src"),
        handler: "get-all.handler",
        runtime: lambda.Runtime.NODEJS_10_X,
        environment: { TABLE_NAME: tableName, PRIMARY_KEY: "employeeId" }
      }
    );
    // granting read permissions to lambda on employeesDynamoDBIntance
    employeesDynamoDBIntance.grantReadData(getAllEmployeeLambda);
    // Integrating getAllLambda with apigateway
    const getAllIntegration = new apigateway.LambdaIntegration(
      getAllEmployeeLambda
    );
    employee.addMethod("GET", getAllIntegration);
  }
}
