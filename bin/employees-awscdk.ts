#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { EmployeesAwscdkStack } from "../lib/employees-awscdk-stack";

var sites = [
  {
    stackName: "bangalore",
    region: "ap-south-1",
    tags: { sitetag: "site2tag" }
  },
  {
    stackName: "melbourne",
    region: "ap-southeast-2",
    tags: { sitetag: "site1tag" }
  }
];

const app = new cdk.App();

sites.forEach(site => {
  var stackName = site.stackName + "EmployeesAwscdkStackAPP";
  new EmployeesAwscdkStack(app, stackName, {
    stackName: site.stackName,
    env: {
      region: site.region
    },
    tags: site.tags
  });
});
app.synth();
