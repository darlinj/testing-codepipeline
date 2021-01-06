import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { clearDatabase, addQuestionnaireForAnotherUser } from "./DBAdmin";

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
      title
      content
      QuestionnaireId
    }
  }
}`);
};

const getQuestionnaire = id => {
  return runGraphqlOperation(`query MyQuery {
  getQuestionnaire(QuestionnaireId: "${id}") {
    title
    content
    QuestionnaireId
  }
}`);
};

const deleteQuestionnaire = id => {
  return runGraphqlOperation(`mutation MyMutation {
  deleteQuestionnaire(QuestionnaireId: "${id}") {
    content
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

it("Returns an empty array if there are no records in the DB", async () => {
  await getQuestionnaires().then(result => {
    expect(result.data).toEqual({
      getQuestionnaires: {
        questionnaires: []
      }
    });
  });
});

it("Adds a questionnaire and then checks it is there", async () => {
  await saveQuestionnaire("1234", "Some content", "Some title");

  await getQuestionnaires().then(result => {
    expect(result.data).toEqual({
      getQuestionnaires: {
        questionnaires: [
          {
            QuestionnaireId: "1234",
            content: "Some content",
            title: "Some title"
          }
        ]
      }
    });
  });
});

it("Can't see items that don't belong to this user", async () => {
  await addQuestionnaireForAnotherUser();

  await saveQuestionnaire("1234", "Some content", "Some title");

  await getQuestionnaires().then(result => {
    expect(result.data).toEqual({
      getQuestionnaires: {
        questionnaires: [
          {
            QuestionnaireId: "1234",
            content: "Some content",
            title: "Some title"
          }
        ]
      }
    });
  });
});

it("Can get an individual Questionnaire by ID", async () => {
  await saveQuestionnaire("1234", "Some content", "Some title");

  await getQuestionnaire("1234").then(result => {
    expect(result.data).toEqual({
      getQuestionnaire: {
        QuestionnaireId: "1234",
        content: "Some content",
        title: "Some title"
      }
    });
  });
});

it("Can delete an individual Questionnaire by ID", async () => {
  await saveQuestionnaire("1234", "Some content", "Some title");

  await getQuestionnaire("1234").then(result => {
    expect(result.data).toEqual({
      getQuestionnaire: {
        QuestionnaireId: "1234",
        content: "Some content",
        title: "Some title"
      }
    });
  });

  await deleteQuestionnaire("1234");

  await getQuestionnaire("1234").then(result => {
    expect(result.data).toEqual({
      getQuestionnaire: null
    });
  });
});
