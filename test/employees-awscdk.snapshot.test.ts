import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as EmployeesAwscdk from '../lib/employees-awscdk-stack';

test('Should compare the cloudFormation template for the whole stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new EmployeesAwscdk.EmployeesAwscdkStack(app, 'MyTestStack', {stackName: 'MyStack'});
    // THEN
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
