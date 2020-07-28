import cdk = require('@aws-cdk/core');
import * as EmployeesAwscdk from '../lib/employees-awscdk-stack';

test('Should throw error if user does not provide stackName property', () => {
  const stack = new cdk.Stack();
  // WHEN and THEN
  expect(() => {
    new EmployeesAwscdk.EmployeesAwscdkStack(stack, 'MyTestStack')
  }).toThrowError(/Please provide stackName!/);
});
