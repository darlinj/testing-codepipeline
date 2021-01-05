import AWS from "aws-sdk";
AWS.config.region = "eu-west-1";
const sts = new AWS.STS();

let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
  region: "eu-west-1"
});

const checkIfUserExists = () => {
  var params = {
    UserPoolId: process.env.UserPoolId
  };
  cognitoidentityserviceprovider.listUsers(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data); 
  });
};

const makeCognitoUser = () => {
  const params = {
    ClientId: process.env.ClientId,
    Password: "Passw0rd!",
    Username: "frank",
    UserAttributes: [
      {
        Name: "name",
        Value: "fred"
      },
      {
        Name: "email",
        Value: "fred@example.com"
      },
      {
        Name: "phone_number",
        Value: "+441473223987"
      }
    ]
  };

  cognitoidentityserviceprovider.signUp(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log("User created", data);
    }
  });
};

const makeTestUser = () => {
  checkIfUserExists();
};

makeTestUser();
