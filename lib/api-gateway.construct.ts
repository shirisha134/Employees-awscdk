import { Construct } from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";

export interface LambdaIntegrationProps {
  lambda: lambda.Function;
  method: string;
}

export class ApiGatewayConstruct extends Construct {
  private api: apigateway.RestApi;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.api = new apigateway.RestApi(this, id);
  }

  addResource(name: string, props: LambdaIntegrationProps[]) {
    const resource = this.api.root.addResource(name);
    props.forEach((props) => {
      resource.addMethod(
        props.method,
        new apigateway.LambdaIntegration(props.lambda)
      );
    });
    return this;
  }
}
