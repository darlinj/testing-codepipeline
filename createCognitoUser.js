import AWS from "aws-sdk";
AWS.config.region = "eu-west-1";
const sts = new AWS.STS();

//const login = () => {
//  console.log(process.argv[2]);
//  var params = {
//    DurationSeconds: "3600",
//    SerialNumber: "arn:aws:iam::919384593253:mfa/joe.darling",
//    TokenCode: process.argv[2]
//  };
//  sts.getSessionToken(params, function(err, data) {
//    if (err) console.log("failed to getSessionToken", err, err.stack);
//    else {
//      console.log(data); // successful response
//      assumeRole();
//      AWS.config.update({
//        accessKeyId: data.Credentials.AccessKeyId,
//        secretAccessKey: data.Credentials.SecretAccessKey,
//        sessionToken: data.Credentials.SessionToken
//      });
//    }
//  });
//};

const assumeRole = () => {
  sts.assumeRole(
    {
      RoleArn: "aws:iam::562925407179:role/bttv-mnb-poc-role-admin",
      RoleSessionName: "awssdk",
      SerialNumber: "arn:aws:iam::919384593253:mfa/joe.darling",
      TokenCode: process.argv[2]
    },
    function(err, data) {
      if (err) {
        console.log("Cannot assume role");
        console.log(err, err.stack);
      } else {
        AWS.config.update({
          accessKeyId: data.Credentials.AccessKeyId,
          secretAccessKey: data.Credentials.SecretAccessKey,
          sessionToken: data.Credentials.SessionToken
        });
        checkIfUserExists();
      }
    }
  );
};

let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
  region: "eu-west-1"
});

const checkIfUserExists = () => {
  var params = {
    UserPoolId: process.env.UserPoolId,
    AttributesToGet: ["name"]
  };
  cognitoidentityserviceprovider.listUsers(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data); // successful response
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
  assumeRole();
};

makeTestUser();
