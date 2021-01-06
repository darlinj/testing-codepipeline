import Amplify, { API, graphqlOperation } from "aws-amplify";

const runGraphqlOperation = query_string => {
  const query = graphqlOperation(query_string);
  return API.graphql(query);
};

export const getQuestionnaires = () => {
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

export const getQuestionnaire = id => {
  return runGraphqlOperation(`query MyQuery {
  getQuestionnaire(QuestionnaireId: "${id}") {
    title
    content
    QuestionnaireId
  }
}`);
};

export const deleteQuestionnaire = id => {
  return runGraphqlOperation(`mutation MyMutation {
  deleteQuestionnaire(QuestionnaireId: "${id}") {
    content
  }
}`);
};

export const saveQuestionnaire = (id, content, title) => {
  return runGraphqlOperation(`mutation MyMutation {
    saveQuestionnaire(content: "${content}", QuestionnaireId: "${id}", title: "${title}") {
      title
      content
    }
  }`);
};

export const getQuestions = () => {
  return runGraphqlOperation(`query MyQuery {
  getQuestions {
    questions {
      id
      questionnaireId
      question
    }
  }
}`);
};
