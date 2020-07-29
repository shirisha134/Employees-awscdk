import { Construct, StackProps } from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

export interface LambdaProps extends StackProps {
  environment: any;
  handler: string;
}

export class LambdaConstruct extends Construct {
  public readonly lambda: lambda.Function;
  constructor(scope: Construct, id: string, props?: LambdaProps) {
    super(scope, id);

    this.lambda = new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: new lambda.AssetCode("src"),
      environment: props?.environment,
      handler: props?.handler || "default.handler",
    });
  }
}
