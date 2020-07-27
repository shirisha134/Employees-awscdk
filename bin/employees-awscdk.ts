#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EmployeesAwscdkStack } from '../lib/employees-awscdk-stack';

const app = new cdk.App();
new EmployeesAwscdkStack(app, 'EmployeesAwscdkStack');
