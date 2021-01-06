import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { clearDatabase } from "./clearDB";

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
  await login();
  await clearDatabase();
});

const login = async () => {
  await Auth.signIn(process.env.TEST_USERNAME, process.env.TEST_USER_PASSWORD);
};

const runGraphqlOperation = query_string => {
  const query = graphqlOperation(query_string);
  return API.graphql(query);
};

const getQuestionnaires = () => {
  return runGraphqlOperation(`query MyQuery {
    getQuestionnaires {
    questionnaires {
      content
      }
    }
  }`);
};

const saveQuestionnaire = (id, content, title) => {
  return runGraphqlOperation(`mutation MyMutation {
    saveQuestionnaire(content: "${content}", QuestionnaireId: "${id}", title: "${title}") {
      title
      content
    }
  }`);
};

it("Returns an empty array if there are no records in the DB", () => {
  getQuestionnaires().then(result => {
    expect(result.data).toEqual({
      getQuestionnaires: {
        questionnaires: []
      }
    });
  });
});

it("Adds a questionnaire and then checks it is there", async () => {
  await saveQuestionnaire("1234", "Some content", "Some title");

  getQuestionnaires().then(result => {
    expect(result.data).toEqual({
      getQuestionnaires: {
        questionnaires: [{ content: "Some content" }]
      }
    });
  });
});
