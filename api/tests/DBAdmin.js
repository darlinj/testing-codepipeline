import AWS from "aws-sdk";
AWS.config.region = "eu-west-1";

const docClient = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  sslEnabled: false,
  paramValidation: false,
  convertResponseTypes: false
});

export const addQuestionnaireForAnotherUser = async tableName => {
  const params = {
    TableName: tableName,
    Item: {
      id: {
        S: "OtherUserID123"
      },
      UserId: {
        S: "1234567890"
      },
      content: {
        S: "Some content belonging to another user"
      }
    }
  };
  return docClient.putItem(params, function(err, data) {
    if (err) {
      console.error(
        "Unable to add item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    }
  });
};

export const clearDatabase = async tableName => {
  const params = {
    TableName: tableName
  };
  const items = await docClient.scan(params).promise();
  items.Items.forEach(item => {
    const deleteParams = {
      TableName: tableName,
      Key: {
        id: item.id,
        UserId: item.UserId
      }
    };
    docClient.deleteItem(deleteParams, function(err, data) {
      if (err) {
        console.error(
          "Unable to delete item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      }
    });
  });
};
