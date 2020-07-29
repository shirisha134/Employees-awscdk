#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import {EmployeesAwscdkStack} from "../lib/employees-awscdk-stack";

const stackSuffix = 'EmployeesAwscdkStack';
const sites = [
  {
    stackName: "bangalore",
    region: "ap-south-1"
  },
  {
    stackName: "melbourne",
    region: "ap-southeast-2"
  }
];

const app = new cdk.App();

sites.forEach(site => {
  var stackName = `${site.stackName}${stackSuffix}`;
  new EmployeesAwscdkStack(app, stackName, {
    stackName: site.stackName,
    env: {
      region: site.region
    }
  });
});
app.synth();
