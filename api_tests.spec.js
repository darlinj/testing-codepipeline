import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";

const aws_config = {
  aws_project_region: "eu-west-1",
  aws_appsync_graphqlEndpoint: process.env.APIEndpoint,
  aws_appsync_region: "eu-west-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  aws_appsync_apiKey: "null",
  aws_cognito_region: "eu-west-1",
  aws_user_pools_id: process.env.USER_POOL_ID,
  authenticationFlowType: "USER_PASSWORD_AUTH",
  aws_user_pools_web_client_id: process.env.CLIENT_ID
};

const password = "Passw0rd!";

Amplify.configure(aws_config);

beforeEach(async () => {
  console.log("Config", aws_config);
  console.log("User", process.env.TEST_USERNAME);
  console.log("Password", password);
  await Auth.signIn(process.env.TEST_USERNAME, password).then(
    user => {
      console.log(user);
    },
    error => console.log("FAILED!!!!", error)
  );
});

it("fetches things", async () => {
  console.log("API Endpoint: ", process.env.APIEndpoint);
  const query = graphqlOperation(`query MyQuery {
    getQuestionnaires {
    questionnaires {
      content
    }
  }
}`);
  await API.graphql(query)
    .then(result => {
      console.log("result", result);
      expect(result.data).toEqual("Meta stuff: somedata Inserted text");
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});
