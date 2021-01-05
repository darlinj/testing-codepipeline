import AWS from "aws-sdk";
AWS.config.region = "eu-west-1";

const docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  sslEnabled: false,
  paramValidation: false,
  convertResponseTypes: false
});

export const clearDatabase = async () => {
  const tableName = "PipelineAPI-questionnaires-table";
  const params = {
    TableName: tableName
  };
  const items = await docClient.scan(params).promise();
  items.Items.forEach(item => {
    const deleteParams = {
      TableName: tableName,
      Key: {
        QuestionnaireId: item.QuestionnaireId,
        UserId: item.UserId
      }
    };
    docClient.delete(deleteParams, function(err, data) {
      if (err) {
        console.error(
          "Unable to delete item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log("DeleteItem:", JSON.stringify(data, null, 2));
      }
    });
  });
};

clearDatabase();
