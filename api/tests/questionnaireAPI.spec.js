import Amplify, { Auth } from "aws-amplify";
import { clearDatabase, addQuestionnaireForAnotherUser } from "./DBAdmin";
import {
  saveQuestionnaire,
  getQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaires
} from "../../src/apiCalls.js";
import awsConfig from "../../aws_config";

Amplify.configure(awsConfig);

beforeAll(async () => {
  await login();
});

beforeEach(async () => {
  const tableName = `${process.env.API_NAME}-questionnaires-table`;
  await clearDatabase(tableName);
});

const login = async () => {
  await Auth.signIn(process.env.TEST_USERNAME, process.env.TEST_USER_PASSWORD);
};

describe("The Questionnaire API", () => {
  it("Returns an empty array if there are no records in the DB", async () => {
    await getQuestionnaires().then(result => {
      expect(result.data.getQuestionnaires.questionnaires.length).toEqual(0);
    });
  });

  it("Adds a questionnaire and then checks it is there", async () => {
    let questionnaireId = 0;
    const questionnaire = { name: "Some name" };
    await saveQuestionnaire(questionnaire).then(result => {
      questionnaireId = result.data.saveQuestionnaire.id;
    });

    await getQuestionnaires().then(result => {
      expect(result.data.getQuestionnaires.questionnaires[0].name).toEqual(
        "Some name"
      );
      expect(
        result.data.getQuestionnaires.questionnaires[0].id.length
      ).toBeGreaterThan(10);
    });
  });

  it("Can't see items that don't belong to this user", async () => {
    const tableName = `${process.env.API_NAME}-questionnaires-table`;
    await addQuestionnaireForAnotherUser(tableName);

    let questionnaireId = 0;
    const questionnaire = { name: "Some name" };
    await saveQuestionnaire(questionnaire).then(result => {
      questionnaireId = result.data.saveQuestionnaire.id;
    });

    await getQuestionnaires().then(result => {
      expect(result.data.getQuestionnaires.questionnaires.length).toEqual(1);
    });
  });

  it("Can get an individual Questionnaire by ID", async () => {
    let questionnaireId = 0;
    const questionnaire = { name: "Some name" };
    await saveQuestionnaire(questionnaire).then(result => {
      questionnaireId = result.data.saveQuestionnaire.id;
    });

    await getQuestionnaire(questionnaireId).then(result => {
      expect(result.data).toEqual({
        getQuestionnaire: {
          id: questionnaireId,
          name: "Some name"
        }
      });
    });
  });

  it("Can delete an individual Questionnaire by ID", async () => {
    let questionnaireId = 0;
    const questionnaire = { name: "Some name" };
    await saveQuestionnaire(questionnaire).then(result => {
      questionnaireId = result.data.saveQuestionnaire.id;
    });

    await getQuestionnaire(questionnaireId).then(result => {
      expect(result.data).toEqual({
        getQuestionnaire: {
          id: questionnaireId,
          name: "Some name"
        }
      });
    });

    await deleteQuestionnaire(questionnaireId);

    await getQuestionnaire(questionnaireId).then(result => {
      expect(result.data).toEqual({
        getQuestionnaire: null
      });
    });
  });

  it("deleting a Questionnaire that doesn't exist", async () => {
    await deleteQuestionnaire("9999").then(result => {
      expect(result.data).toEqual({ deleteQuestionnaire: null });
    });
  });
});
