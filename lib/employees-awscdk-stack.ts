import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";

export class EmployeesAwscdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const employeeTable = new dynamodb.Table(this, "employeesTableId", {
      tableName: "employees",
      partitionKey: {
        name: "employeeId",
        type: dynamodb.AttributeType.NUMBER
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const postEmployeeLambda = new lambda.Function(
      this,
      "postEmployeeLambdaId",
      {
        code: new lambda.AssetCode("src"),
        handler: "create.handler",
        runtime: lambda.Runtime.NODEJS_10_X,
        environment: {
          TABLE_NAME: employeeTable.tableName,
          PRIMARY_KEY: "employeeId"
        }
      }
    );
    const getAllEmployeeLambda = new lambda.Function(
      this,
      "getAllEmployeesLambdaId",
      {
        code: new lambda.AssetCode("src"),
        handler: "get-all.handler",
        runtime: lambda.Runtime.NODEJS_10_X,
        environment: {
          TABLE_NAME: employeeTable.tableName,
          PRIMARY_KEY: "employeeId"
        }
      }
    );

    employeeTable.grantReadWriteData(getAllEmployeeLambda);
    employeeTable.grantReadWriteData(postEmployeeLambda);

    const api = new apigateway.RestApi(this, "employeesApi", {
      restApiName: "Employees Service"
    });

    const employees = api.root.addResource("employees");
    const getAllIntegration = new apigateway.LambdaIntegration(
      getAllEmployeeLambda
    );
    employees.addMethod("GET", getAllIntegration);

    const createIntegration = new apigateway.LambdaIntegration(
      postEmployeeLambda
    );
    employees.addMethod("POST", createIntegration);
    addCorsOptions(employees);
  }
}
export function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addMethod(
    "OPTIONS",
    new apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials":
              "'false'",
            "method.response.header.Access-Control-Allow-Methods":
              "'OPTIONS,GET,PUT,POST,DELETE'"
          }
        }
      ],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}'
      }
    }),
    {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
            "method.response.header.Access-Control-Allow-Origin": true
          }
        }
      ]
    }
  );
}

const app = new cdk.App();
new EmployeesAwscdkStack(app, "EmployeesAwscdkStackAPP");
app.synth();