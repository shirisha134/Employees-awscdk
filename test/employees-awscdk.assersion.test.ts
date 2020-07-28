import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import * as EmployeesAwscdk from '../lib/employees-awscdk-stack';

test('DynamoDB Table Created', () => {
  const app = new cdk.App();
  // WHEN
  new EmployeesAwscdk.EmployeesAwscdkStack(app, 'MyTestStack', {stackName: 'myStack'});
  console.log(app);
  // THEN
  expectCDK(app).to(haveResource('AWS::DynamoDB::Table'));
});
