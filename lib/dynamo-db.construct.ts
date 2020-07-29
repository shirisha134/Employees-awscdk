import { Construct, StackProps, RemovalPolicy } from "@aws-cdk/core";
import * as dynamoDb from "@aws-cdk/aws-dynamodb";

export interface DynamoDBProps extends StackProps {
  tableName: string;
  partitionKeyName: string;
}

export class DynamoDBConstruct extends Construct {
  public readonly dynamoDbTable: dynamoDb.Table;
  constructor(scope: Construct, id: string, props?: DynamoDBProps) {
    super(scope, id);

    this.dynamoDbTable = new dynamoDb.Table(this, id, {
      tableName: props?.tableName,
      partitionKey: {
        name: props?.partitionKeyName || "default",
        type: dynamoDb.AttributeType.NUMBER,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
