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
      id
    }
  }
}`);
};

export const getQuestionnaire = id => {
  return runGraphqlOperation(`query MyQuery {
  getQuestionnaire(id: "${id}") {
    title
    content
    id
  }
}`);
};

export const deleteQuestionnaire = id => {
  return runGraphqlOperation(`mutation MyMutation {
  deleteQuestionnaire(id: "${id}") {
    content
  }
}`);
};

export const saveQuestionnaire = (id, content, title) => {
  return runGraphqlOperation(`mutation MyMutation {
    saveQuestionnaire(content: "${content}", id: "${id}", title: "${title}") {
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
      QuestionnaireId
      question
    }
  }
}`);
};

export const saveQuestion = (id, questionnaireId, question) => {
  return runGraphqlOperation(`mutation MyMutation {
    saveQuestion(id: "${id}", QuestionnaireId: "${questionnaireId}", question: "${question}") {
      id
      QuestionnaireId
      question
    }
  }`);
};
