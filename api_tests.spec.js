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

Amplify.configure(aws_config);

beforeEach(async () => {
  await Auth.signIn(
    process.env.TEST_USERNAME,
    process.env.TEST_USER_PASSWORD
  ).then(
    user => {
      console.log("Sucessfully signed in", user.username);
    },
    error => console.log("FAILED TO LOGIN:", error)
  );
});

it("fetches things", async () => {
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
      expect(result.data).toEqual({
        getQuestionnaires: {
          questionnaires: []
        }
      });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});
