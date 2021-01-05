import AWS from "aws-sdk";
//const credentials = new AWS.SharedIniFileCredentials({ profile: "admin" });
//AWS.config.credentials = credentials;
AWS.config.region = "eu-west-1";

const docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  sslEnabled: false,
  paramValidation: false,
  convertResponseTypes: false
});

export const scanTable = async tableName => {
  const params = {
    TableName: tableName
  };

  let scanResults = [];
  let items;
  do {
    items = await docClient.scan(params).promise();
    items.Items.forEach(item => scanResults.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != "undefined");

  return scanResults;
};

scanTable("PipelineAPI-questionnaires-table");
