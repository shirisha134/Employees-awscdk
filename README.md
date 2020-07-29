# Employees-awscdk
This is to learn concepts of aws-cdk.


## **Application Description:**

There are two sites which hold employee details, each store employee details in two different dynamo tables and exposes get-all-employees and post-employee rest-apis. It also supports welcome api.
This project includes 3 Lambdas in a default VPC that receive event triggers manually, which then store the event-related data into the DynamoTable instance per site.

1. We take site related configuration as a list of jsons, and create a stack(aws-cdk-stack) specific to each site.
2. Each stack contains constructs/resources like dynamoTable, lambdas and api-gateway and related roles.
3. The above stacks are created in default vpc of a specific region.
4. The regions include `ap-south-1(mumbai)`, `ap-southeast-2(sydney)`


## Prerequisites:

Make sure node version to be 10.3.0 or later

###### Note:

Node.js versions 13.0.0 through 13.6.0 are not compatible with the AWS CDK.


To run a this example,

`npm install -g aws-cdk`

`npm install`

`npm run build`

below are the list of cdk commands which will be useful:
to list aws-cdk stacks:

`cdk ls`

to check diff between stacks deployed and local stack:

`cdk diff` or `cdk diff <stackname>`

to generate cloudFormation templates:

`cdk synth` or `cdk diff <stackname>`

tO deploy stack:

`cdk deploy <stackname>`

to destroy stack:

`cdk destroy <stackname>`